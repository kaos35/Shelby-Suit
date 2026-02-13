import { schedule, ScheduledTask } from 'node-cron';

export type JobFunction = () => Promise<void> | void;

export interface ScheduledJob {
    id: string;
    schedule: string;
    task: JobFunction;
    isRunning: boolean;
}

export class Scheduler {
    private jobs: Map<string, ScheduledTask> = new Map();
    private jobDefinitions: Map<string, ScheduledJob> = new Map();

    /**
     * Schedule a new task
     * @param id Unique identifier for the job
     * @param schedule Cron expression (e.g., "* * * * *")
     * @param task Function to execute
     */
    public addJob(id: string, scheduleExpr: string, task: JobFunction): void {
        if (this.jobs.has(id)) {
            this.stopJob(id);
        }

        const scheduledTask = schedule(scheduleExpr, async () => {
            try {
                // Update specific job status if needed, or emit events
                // console.log(`Starting job ${id}`);
                await task();
                // console.log(`Finished job ${id}`);
            } catch (error) {
                console.error(`Error in job ${id}:`, error);
            }
        }, {
            scheduled: false
        } as any);

        this.jobs.set(id, scheduledTask);
        this.jobDefinitions.set(id, {
            id,
            schedule: scheduleExpr,
            task,
            isRunning: false
        });

        // Start immediately by default? Usually yes for cron.
        // But let's require explicit start or just start it.
        // node-cron starts by default if scheduled is not false.
        // I set scheduled: false above, so I need to start it.
        this.startJob(id);
    }

    public startJob(id: string): void {
        const job = this.jobs.get(id);
        if (job) {
            job.start();
            const def = this.jobDefinitions.get(id);
            if (def) def.isRunning = true;
        }
    }

    public stopJob(id: string): void {
        const job = this.jobs.get(id);
        if (job) {
            job.stop();
            const def = this.jobDefinitions.get(id);
            if (def) def.isRunning = false;
        }
    }

    public removeJob(id: string): void {
        this.stopJob(id);
        this.jobs.delete(id);
        this.jobDefinitions.delete(id);
    }

    public getJobStatus(id: string): boolean | undefined {
        return this.jobDefinitions.get(id)?.isRunning;
    }

    public listJobs(): ScheduledJob[] {
        return Array.from(this.jobDefinitions.values());
    }

    /**
     * Provide a method to wrap tasks with a timer for simpler deviations
     */
    public addIntervalJob(id: string, intervalMs: number, task: JobFunction): void {
        // Since node-cron is cron-based, simple interval is harder to map directly to cron
        // unless we use basic JS interval.
        // Or we can convert some intervals to cron, but ms resolution is tricky.
        // I'll stick to cron for now as per requirements.
        throw new Error("Use addJob with cron expression");
    }
}
