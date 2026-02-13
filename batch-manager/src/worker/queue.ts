import { Job, JobStatus, JobType } from './job.js';
import { v4 as uuidv4 } from 'uuid';
import { JobDatabase } from '../db/index.js';

export class JobQueue {
    private db: JobDatabase;

    constructor() {
        this.db = new JobDatabase();
    }

    public addJob(type: JobType, payload: any, maxRetries: number = 3): Job {
        const job: Job = {
            id: uuidv4(),
            type,
            status: JobStatus.PENDING,
            payload,
            retries: 0,
            maxRetries,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.db.addJob(job);
        return job;
    }

    public getNextPending(): Job | undefined {
        // We get the first pending job from DB
        const jobs = this.db.getPendingJobs();
        return jobs.length > 0 ? jobs[0] : undefined;
    }

    public getJobs(): Job[] {
        return this.db.getAllJobs();
    }

    public getJob(id: string): Job | undefined {
        return this.db.getJob(id);
    }

    public updateJobStatus(id: string, status: JobStatus, result?: any, error?: string): void {
        this.db.updateJobStatus(id, status, result, error);
    }

    public incrementRetries(id: string): void {
        this.db.incrementRetries(id);
    }

    public resetStuckJobs(): void {
        this.db.resetProcessingJobs();
    }

    public clearCompleted(): void {
        // Optional: Implement clearing old completed jobs from DB if needed
        // For now, we keep history
    }

    public getStats() {
        return this.db.getStats();
    }
}
