import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface AccountConfig {
    id: string;
    name: string;
    address: string;
    privateKey?: string;
    weight?: number;
    balance?: string; // yaml usually reads as string or number, but bigints are tricky in yaml
}

export interface Config {
    accounts: AccountConfig[];
    global_limits: {
        max_parallel_uploads: number;
        daily_upload_limit_mb: number;
    };
    retry_policy: {
        max_attempts: number;
        backoff_ms: number;
    };
}

export function loadConfig(configPath: string): Config {
    try {
        const fileContents = fs.readFileSync(configPath, 'utf8');
        const data = yaml.load(fileContents) as Config;

        // Process accounts for env variables
        const processedAccounts = data.accounts.map(acc => {
            if (acc.privateKey && acc.privateKey.startsWith('env:')) {
                const envVar = acc.privateKey.substring(4);
                return {
                    ...acc,
                    privateKey: process.env[envVar] || ''
                };
            }
            return acc;
        });

        return {
            ...data,
            accounts: processedAccounts
        };
    } catch (e) {
        console.error("Failed to load config:", e);
        throw e;
    }
}
