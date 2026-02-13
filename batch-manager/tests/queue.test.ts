import { JobQueue } from '../src/worker/queue';
import { JobType, JobStatus } from '../src/worker/job';

// Mock the database module entirely
jest.mock('../src/db/index', () => {
    const jobs: any[] = [];
    return {
        JobDatabase: jest.fn().mockImplementation(() => ({
            addJob: jest.fn((job: any) => {
                jobs.push({ ...job, payload: JSON.stringify(job.payload) });
            }),
            getJob: jest.fn((id: string) => {
                const j = jobs.find(j => j.id === id);
                if (!j) return undefined;
                return { ...j, payload: JSON.parse(j.payload) };
            }),
            getPendingJobs: jest.fn(() =>
                jobs.filter(j => j.status === 'PENDING').map(j => ({ ...j, payload: JSON.parse(j.payload) }))
            ),
            getAllJobs: jest.fn(() => jobs.map(j => ({ ...j, payload: JSON.parse(j.payload) }))),
            updateJobStatus: jest.fn((id: string, status: string) => {
                const j = jobs.find(j => j.id === id);
                if (j) j.status = status;
            }),
            incrementRetries: jest.fn(),
            resetProcessingJobs: jest.fn(() => {
                jobs.forEach(j => { if (j.status === 'PROCESSING') j.status = 'PENDING'; });
            }),
            getStats: jest.fn(() => ({
                total: jobs.length,
                pending: jobs.filter(j => j.status === 'PENDING').length,
                processing: jobs.filter(j => j.status === 'PROCESSING').length,
                completed: jobs.filter(j => j.status === 'COMPLETED').length,
                failed: jobs.filter(j => j.status === 'FAILED').length,
            })),
        })),
    };
});

describe('JobQueue', () => {
    let queue: JobQueue;

    beforeEach(() => {
        jest.clearAllMocks();
        queue = new JobQueue();
    });

    test('should add a job and return it', () => {
        const job = queue.addJob(JobType.UPLOAD, { filePath: 'test.txt' });

        expect(job).toBeDefined();
        expect(job.id).toBeDefined();
        expect(job.type).toBe(JobType.UPLOAD);
        expect(job.status).toBe(JobStatus.PENDING);
        expect(job.payload.filePath).toBe('test.txt');
    });

    test('should return stats', () => {
        const stats = queue.getStats();
        expect(stats).toHaveProperty('total');
        expect(stats).toHaveProperty('pending');
        expect(stats).toHaveProperty('completed');
    });
});
