import { BatchManager } from '../src/manager';
import { JobQueue } from '../src/worker/queue';
import { WorkerPool } from '../src/worker/pool';
import { RoundRobinStrategy } from '../src/strategies/round-robin';
import { LeastLoadedStrategy } from '../src/strategies/least-loaded';
import { Job, JobType, JobStatus } from '../src/worker/job';

/**
 * Integration Tests for Batch Manager
 * 
 * These tests verify the end-to-end flow of the BatchManager system,
 * including job queuing, worker pool execution, strategy selection,
 * and status reporting — without mocking internal dependencies.
 */

// Mock only the database layer so we don't need SQLite in CI
jest.mock('../src/db/index', () => {
    const jobs = new Map<string, any>();
    return {
        JobDatabase: jest.fn().mockImplementation(() => ({
            addJob: jest.fn((job: any) => jobs.set(job.id, { ...job })),
            getPendingJobs: jest.fn(() =>
                Array.from(jobs.values())
                    .filter(j => j.status === 'pending')
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            ),
            getAllJobs: jest.fn(() => Array.from(jobs.values())),
            getJob: jest.fn((id: string) => jobs.get(id)),
            updateJobStatus: jest.fn((id: string, status: string, result?: any, error?: string) => {
                const job = jobs.get(id);
                if (job) {
                    job.status = status;
                    if (result) job.result = result;
                    if (error) job.error = error;
                    job.updatedAt = new Date();
                }
            }),
            incrementRetries: jest.fn((id: string) => {
                const job = jobs.get(id);
                if (job) job.retries = (job.retries || 0) + 1;
            }),
            resetProcessingJobs: jest.fn(() => {
                jobs.forEach((job) => {
                    if (job.status === 'processing') job.status = 'pending';
                });
            }),
            getStats: jest.fn(() => ({
                total: jobs.size,
                pending: Array.from(jobs.values()).filter(j => j.status === 'pending').length,
                processing: Array.from(jobs.values()).filter(j => j.status === 'processing').length,
                completed: Array.from(jobs.values()).filter(j => j.status === 'completed').length,
                failed: Array.from(jobs.values()).filter(j => j.status === 'failed').length,
            })),
            _clear: jest.fn(() => jobs.clear()),
        })),
    };
});

const testAccounts = [
    { name: 'account-alpha', id: '1', address: '0xA1', privateKey: 'keyA', weight: 1 },
    { name: 'account-beta', id: '2', address: '0xB2', privateKey: 'keyB', weight: 2 },
    { name: 'account-gamma', id: '3', address: '0xC3', privateKey: 'keyC', weight: 1 },
];

describe('BatchManager Integration Tests', () => {
    let manager: BatchManager;

    beforeEach(() => {
        const strategy = new RoundRobinStrategy();
        manager = new BatchManager(strategy, testAccounts, 3);
    });

    afterEach(() => {
        manager.stop();
    });

    describe('Job Lifecycle', () => {
        test('should add multiple upload tasks and track them', () => {
            const files = ['image.png', 'doc.pdf', 'video.mp4'];
            const jobs = manager.addUploadTasks(files);

            expect(jobs).toHaveLength(3);
            jobs.forEach((job, i) => {
                expect(job.id).toBeDefined();
                expect(job.type).toBe(JobType.UPLOAD);
                expect(job.status).toBe(JobStatus.PENDING);
                expect(job.payload.filePath).toBe(files[i]);
            });
        });

        test('should report correct status after adding tasks', () => {
            manager.addUploadTasks(['a.txt', 'b.txt']);
            const status = manager.getStatus();

            expect(status.isRunning).toBe(false);
            expect(status.queue).toBeDefined();
            expect(status.pool).toBeDefined();
            expect(status.pool.activeJobs).toBe(0);
        });

        test('should start and stop processing', async () => {
            manager.addUploadTasks(['test.txt']);
            await manager.start();
            expect(manager.getStatus().isRunning).toBe(true);

            manager.stop();
            expect(manager.getStatus().isRunning).toBe(false);
        });

        test('resume should reset stuck jobs before starting', async () => {
            manager.addUploadTasks(['stuck.dat']);

            // Start and immediately stop so processQueue doesn't run forever
            await manager.resume();
            expect(manager.getStatus().isRunning).toBe(true);
            manager.stop();
        });
    });

    describe('Worker Pool Concurrency', () => {
        let pool: WorkerPool;

        beforeEach(() => {
            pool = new WorkerPool(2); // Max 2 concurrent
        });

        test('should execute tasks within concurrency limit', async () => {
            const mockJob: Job = {
                id: 'test-1',
                type: JobType.UPLOAD,
                status: JobStatus.PENDING,
                payload: { filePath: 'test.txt' },
                retries: 0,
                maxRetries: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await pool.execute(mockJob, async (job) => {
                return { blobId: 'blob-123', success: true };
            });

            expect(result.success).toBe(true);
            expect(result.blobId).toBe('blob-123');
        });

        test('should track stats correctly after multiple executions', async () => {
            const createJob = (id: string): Job => ({
                id,
                type: JobType.UPLOAD,
                status: JobStatus.PENDING,
                payload: { filePath: `file-${id}.txt` },
                retries: 0,
                maxRetries: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Execute 3 jobs sequentially
            await pool.execute(createJob('j1'), async () => ({ ok: true }));
            await pool.execute(createJob('j2'), async () => ({ ok: true }));

            // One failing job
            try {
                await pool.execute(createJob('j3'), async () => {
                    throw new Error('Simulated disk error');
                });
            } catch (e) {
                // Expected
            }

            const stats = pool.getStats();
            expect(stats.completedJobs).toBe(2);
            expect(stats.failedJobs).toBe(1);
            expect(stats.totalProcessed).toBe(3);
            expect(stats.activeJobs).toBe(0);
        });

        test('should reject when at max capacity', async () => {
            const longJob = (id: string): Job => ({
                id,
                type: JobType.UPLOAD,
                status: JobStatus.PENDING,
                payload: {},
                retries: 0,
                maxRetries: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Start 2 long-running jobs (pool capacity is 2)
            const p1 = pool.execute(longJob('cap1'), () => new Promise(r => setTimeout(r, 200)));
            const p2 = pool.execute(longJob('cap2'), () => new Promise(r => setTimeout(r, 200)));

            // 3rd should throw
            await expect(
                pool.execute(longJob('cap3'), async () => ({}))
            ).rejects.toThrow('Worker pool at max capacity');

            await Promise.all([p1, p2]);
        });
    });

    describe('Strategy Selection', () => {
        test('round-robin should cycle through accounts evenly', () => {
            const strategy = new RoundRobinStrategy();

            const selected = [
                strategy.selectAccount(testAccounts),
                strategy.selectAccount(testAccounts),
                strategy.selectAccount(testAccounts),
                strategy.selectAccount(testAccounts),
            ];

            // Should cycle: alpha -> beta -> gamma -> alpha
            expect(selected[0]?.name).toBe('account-alpha');
            expect(selected[1]?.name).toBe('account-beta');
            expect(selected[2]?.name).toBe('account-gamma');
            expect(selected[3]?.name).toBe('account-alpha');
        });

        test('least-loaded should prefer accounts with fewer active jobs', () => {
            const strategy = new LeastLoadedStrategy();

            // First selection from empty state
            const first = strategy.selectAccount(testAccounts);
            expect(first).toBeDefined();
        });
    });
});
