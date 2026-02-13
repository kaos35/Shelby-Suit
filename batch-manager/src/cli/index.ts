#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { BatchManager } from '../manager.js'; // Note .js extension usage
import { loadConfig } from '../config/index.js';
import { RoundRobinStrategy } from '../strategies/round-robin.js';
import { LeastLoadedStrategy } from '../strategies/least-loaded.js';
import { TokenAwareStrategy } from '../strategies/token-aware.js';
import { WeightedRandomStrategy } from '../strategies/weighted-random.js';
import { Scheduler } from '../scheduler/index.js';

const program = new Command();

program
    .name('shelby-batch')
    .description('CLI for Shelby Batch Manager')
    .version('1.0.0');

program
    .command('start')
    .description('Start the batch manager process')
    .option('-c, --config <path>', 'Path to config file', './config/accounts.yaml')
    .option('-s, --strategy <type>', 'Strategy type (round-robin, least-loaded, token-aware, weighted)', 'round-robin')
    .action(async (options) => {
        try {
            console.log(`Loading config from ${options.config}...`);
            const configPath = path.resolve(process.cwd(), options.config);
            const config = loadConfig(configPath);

            console.log(`Loaded ${config.accounts.length} accounts.`);

            // Select strategy
            let strategy;
            switch (options.strategy) {
                case 'least-loaded':
                    strategy = new LeastLoadedStrategy();
                    break;
                case 'token-aware':
                    strategy = new TokenAwareStrategy();
                    break;
                case 'weighted':
                    strategy = new WeightedRandomStrategy();
                    break;
                case 'round-robin':
                default:
                    strategy = new RoundRobinStrategy();
                    break;
            }
            console.log(`Using strategy: ${options.strategy}`);

            // Initialize Manager
            // Map config accounts to ShelbyAccount (ensure types match)
            // ShelbyAccount now has optional balance and weight
            const accounts = config.accounts.map(acc => ({
                id: acc.id,
                name: acc.name,
                address: acc.address,
                privateKey: acc.privateKey,
                weight: acc.weight,
                balance: acc.balance ? BigInt(acc.balance) : undefined
            }));

            const manager = new BatchManager(
                strategy,
                accounts,
                config.global_limits.max_parallel_uploads
            );

            // Initialize Scheduler
            const scheduler = new Scheduler();

            // Example: Schedule a recurring check or job generation
            // For now, let's just claim we started
            console.log('Starting Batch Manager...');

            await manager.start();

            // Setup signal handling
            process.on('SIGINT', () => {
                console.log('\nGracefully shutting down...');
                manager.stop();
                scheduler.stopJob('main'); // if any
                process.exit(0);
            });

            // Keep process alive
            console.log('Batch Manager running. Press Ctrl+C to stop.');

            // Example scheduler usage:
            // scheduler.addJob('report', '*/5 * * * *', async () => {
            //     console.log('Status Report:', manager.getStatus());
            // });

        } catch (error: any) {
            console.error('Failed to start:', error.message);
            process.exit(1);
        }
    });

program
    .command('resume')
    .description('Resume processing including stuck jobs')
    .option('-c, --config <path>', 'Path to config file', './config/accounts.yaml')
    .action(async (options) => {
        try {
            console.log(`Resuming Batch Manager from ${options.config}...`);
            const configPath = path.resolve(process.cwd(), options.config);
            const config = loadConfig(configPath);

            const accounts = config.accounts.map(acc => ({
                id: acc.id,
                name: acc.name,
                address: acc.address,
                privateKey: acc.privateKey,
                weight: acc.weight,
                balance: acc.balance ? BigInt(acc.balance) : undefined
            }));

            const manager = new BatchManager(
                new RoundRobinStrategy(), // Default strategy for resume
                accounts,
                config.global_limits.max_parallel_uploads
            );

            console.log('Resetting stuck jobs and starting...');
            await manager.resume();

            // Setup signal handling
            process.on('SIGINT', () => {
                console.log('\nGracefully shutting down...');
                manager.stop();
                process.exit(0);
            });

            console.log('Batch Manager resumed. Press Ctrl+C to stop.');

        } catch (error: any) {
            console.error('Failed to resume:', error.message);
            process.exit(1);
        }
    });

program
    .command('status')
    .description('Show current job queue status')
    .action(() => {
        try {
            // We can just use JobDatabase directly here since we only need read access
            const { JobDatabase } = require('../db/index.js');
            const db = new JobDatabase();
            const stats = db.getStats();

            console.log('\n📊 Batch Manager Status');
            console.log('---------------------');
            console.log(`Total Jobs:      ${stats.total}`);
            console.log(`Pending:         ${stats.pending}`);
            console.log(`Processing:      ${stats.processing}`);
            console.log(`Completed:       ${stats.completed}`);
            console.log(`Failed:          ${stats.failed}`);
            console.log('---------------------\n');

        } catch (error: any) {
            console.error('Failed to get status:', error.message);
            process.exit(1);
        }
    });

program
    .command('upload <files...>')
    .description('Queue files for upload immediately')
    .option('-c, --config <path>', 'Path to config file', './config/accounts.yaml')
    .option('--no-start', 'Only queue files without starting worker')
    .action(async (files, options) => {
        // This would require connecting to a running daemon or just running a one-off batch
        const configPath = path.resolve(process.cwd(), options.config);
        const config = loadConfig(configPath);

        const accounts = config.accounts.map(acc => ({
            id: acc.id,
            name: acc.name,
            address: acc.address,
            privateKey: acc.privateKey,
            weight: acc.weight,
            balance: acc.balance ? BigInt(acc.balance) : undefined
        }));

        const manager = new BatchManager(
            new RoundRobinStrategy(),
            accounts,
            5
        );

        console.log(`Queuing ${files.length} files...`);
        manager.addUploadTasks(files);

        if (options.start) {
            console.log('Starting processing...');
            await manager.start();

            // Poll for completion
            const interval = setInterval(() => {
                const status = manager.getStatus();
                process.stdout.write(`\rProcessing: ${status.queue.processing}, Pending: ${status.queue.pending}, Completed: ${status.queue.completed}   `);

                if (status.queue.pending === 0 && status.queue.processing === 0) {
                    console.log('\nDone.');
                    clearInterval(interval);
                    manager.stop();
                    process.exit(0);
                }
            }, 500);
        } else {
            console.log('Files queued. Run "shelby-batch start" or "shelby-batch resume" to process.');
            process.exit(0);
        }
    });

program.parse(process.argv);
