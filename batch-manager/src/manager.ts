import { JobQueue } from './worker/queue.js';
import { WorkerPool } from './worker/pool.js';
import { JobType, JobStatus, Job } from './worker/job.js';
import { SelectionStrategy, ShelbyAccount } from './strategies/round-robin.js';

export class BatchManager {
    private queue: JobQueue;
    private pool: WorkerPool;
    private isRunning: boolean = false;

    constructor(
        private strategy: SelectionStrategy,
        private accounts: ShelbyAccount[],
        concurrency: number = 5
    ) {
        this.queue = new JobQueue();
        this.pool = new WorkerPool(concurrency);
    }

    public addUploadTasks(filePaths: string[]): Job[] {
        return filePaths.map(path =>
            this.queue.addJob(JobType.UPLOAD, { filePath: path })
        );
    }

    public async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.processQueue();
    }

    public async resume() {
        this.queue.resetStuckJobs();
        await this.start();
    }

    public stop() {
        this.isRunning = false;
    }

    private async processQueue() {
        while (this.isRunning) {
            if (this.pool.canAccept()) {
                const job = this.queue.getNextPending();
                if (job) {
                    const account = this.strategy.selectAccount(this.accounts);
                    if (account) {
                        // Assign account to job payload
                        job.payload.accountName = account.name;

                        // Update status to PROCESSING in DB
                        this.queue.updateJobStatus(job.id, JobStatus.PROCESSING);

                        // Execute job in pool
                        this.pool.execute(job, async (j) => {
                            console.log(`[BatchManager] Processing ${j.type} for file ${j.payload.filePath} using account ${account.name}`);

                            // Simulate work (replace with actual SDK call later)
                            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

                            return { blobId: `mock-blob-${Date.now()}`, success: true };
                        }).then((result) => {
                            this.queue.updateJobStatus(job.id, JobStatus.COMPLETED, result);
                        }).catch(err => {
                            console.error(`[BatchManager] Job ${job.id} failed:`, err.message);
                            this.queue.updateJobStatus(job.id, JobStatus.FAILED, undefined, err.message);
                        });
                    }
                }
            }

            // Wait before next check
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    public getStatus() {
        return {
            queue: this.queue.getStats(),
            pool: this.pool.getStats(),
            isRunning: this.isRunning
        };
    }
}
