import { Job, JobStatus } from './job.js';

export interface WorkerStats {
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalProcessed: number;
}

export class WorkerPool {
    private activeJobs: Set<string> = new Set();
    private stats: WorkerStats = {
        activeJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
        totalProcessed: 0,
    };

    constructor(private maxConcurrency: number = 5) { }

    public async execute(job: Job, task: (job: Job) => Promise<any>): Promise<any> {
        if (this.activeJobs.size >= this.maxConcurrency) {
            throw new Error('Worker pool at max capacity');
        }

        this.activeJobs.add(job.id);
        this.stats.activeJobs = this.activeJobs.size;
        job.status = JobStatus.PROCESSING;
        job.updatedAt = new Date();

        try {
            const result = await task(job);
            job.status = JobStatus.COMPLETED;
            job.result = result;
            this.stats.completedJobs++;
            return result;
        } catch (error: any) {
            job.status = JobStatus.FAILED;
            job.error = error.message;
            this.stats.failedJobs++;
            throw error;
        } finally {
            this.activeJobs.delete(job.id);
            this.stats.activeJobs = this.activeJobs.size;
            this.stats.totalProcessed++;
            job.updatedAt = new Date();
        }
    }

    public getStats(): WorkerStats {
        return { ...this.stats };
    }

    public canAccept(): boolean {
        return this.activeJobs.size < this.maxConcurrency;
    }
}
