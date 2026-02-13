import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.resolve(process.cwd(), 'batch-manager.db');

export class JobDatabase {
    private db: Database.Database;

    constructor() {
        this.db = new Database(DB_PATH);
        this.init();
    }

    private init() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                status TEXT NOT NULL,
                payload TEXT NOT NULL,
                result TEXT,
                error TEXT,
                retries INTEGER DEFAULT 0,
                maxRetries INTEGER DEFAULT 3,
                createdAt INTEGER NOT NULL,
                updatedAt INTEGER NOT NULL
            )
        `);
    }

    public addJob(job: any) {
        const stmt = this.db.prepare(`
            INSERT INTO jobs (id, type, status, payload, maxRetries, createdAt, updatedAt)
            VALUES (@id, @type, @status, @payload, @maxRetries, @createdAt, @updatedAt)
        `);
        return stmt.run({
            ...job,
            payload: JSON.stringify(job.payload),
            createdAt: job.createdAt.getTime(),
            updatedAt: job.updatedAt.getTime()
        });
    }

    public getJob(id: string) {
        const row = this.db.prepare('SELECT * FROM jobs WHERE id = ?').get(id) as any;
        if (!row) return undefined;
        return this.mapRowToJob(row);
    }

    public updateJobStatus(id: string, status: string, result?: any, error?: string) {
        const stmt = this.db.prepare(`
            UPDATE jobs 
            SET status = @status, result = @result, error = @error, updatedAt = @updatedAt
            WHERE id = @id
        `);
        return stmt.run({
            id,
            status,
            result: result ? JSON.stringify(result) : null,
            error,
            updatedAt: Date.now()
        });
    }

    public incrementRetries(id: string) {
        const stmt = this.db.prepare(`
            UPDATE jobs 
            SET retries = retries + 1, updatedAt = @updatedAt
            WHERE id = @id
        `);
        return stmt.run({ id, updatedAt: Date.now() });
    }

    public resetProcessingJobs() {
        const stmt = this.db.prepare(`
            UPDATE jobs 
            SET status = 'PENDING', updatedAt = @updatedAt 
            WHERE status = 'PROCESSING'
        `);
        return stmt.run({ updatedAt: Date.now() });
    }

    public getPendingJobs() {
        const rows = this.db.prepare("SELECT * FROM jobs WHERE status = 'PENDING' ORDER BY createdAt ASC").all() as any[];
        return rows.map(this.mapRowToJob);
    }

    public getAllJobs() {
        const rows = this.db.prepare("SELECT * FROM jobs ORDER BY createdAt DESC").all() as any[];
        return rows.map(this.mapRowToJob);
    }

    public getStats() {
        const stats = this.db.prepare(`
            SELECT status, COUNT(*) as count 
            FROM jobs 
            GROUP BY status
        `).all() as { status: string, count: number }[];

        const result = {
            total: 0,
            pending: 0,
            processing: 0,
            completed: 0,
            failed: 0
        };

        stats.forEach(s => {
            result.total += s.count;
            if (s.status === 'PENDING') result.pending = s.count;
            if (s.status === 'PROCESSING') result.processing = s.count;
            if (s.status === 'COMPLETED') result.completed = s.count;
            if (s.status === 'FAILED') result.failed = s.count;
        });

        return result;
    }

    private mapRowToJob(row: any) {
        return {
            ...row,
            payload: JSON.parse(row.payload),
            result: row.result ? JSON.parse(row.result) : undefined,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };
    }
}
