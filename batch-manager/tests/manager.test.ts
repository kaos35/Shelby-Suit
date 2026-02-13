import { BatchManager } from '../src/manager';
import { JobQueue } from '../src/worker/queue';
import { RoundRobinStrategy } from '../src/strategies/round-robin';
import { Job, JobType, JobStatus } from '../src/worker/job';

// Mock dependencies
jest.mock('../src/worker/queue');
jest.mock('../src/worker/pool');

describe('BatchManager', () => {
    let manager: BatchManager;
    let mockQueue: jest.Mocked<JobQueue>;

    // Create a mock queue instance
    const mockQueueInstance = {
        addJob: jest.fn(),
        resetStuckJobs: jest.fn(),
        getStats: jest.fn().mockReturnValue({ total: 0 }),
        updateJobStatus: jest.fn(),
        getNextPending: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup queue constructor mock
        (JobQueue as jest.Mock).mockImplementation(() => mockQueueInstance);

        const strategy = new RoundRobinStrategy();
        const accounts = [{
            name: 'test-acc',
            id: '1',
            address: '0x123',
            privateKey: 'key',
            weight: 1
        }];

        manager = new BatchManager(strategy, accounts);
        mockQueue = mockQueueInstance as any;
    });

    test('addUploadTasks should add jobs to queue', () => {
        const files = ['file1.txt', 'file2.txt'];
        manager.addUploadTasks(files);

        expect(mockQueue.addJob).toHaveBeenCalledTimes(2);
        expect(mockQueue.addJob).toHaveBeenCalledWith(JobType.UPLOAD, { filePath: 'file1.txt' });
        expect(mockQueue.addJob).toHaveBeenCalledWith(JobType.UPLOAD, { filePath: 'file2.txt' });
    });

    test('resume should reset stuck jobs and start processing', async () => {
        // Spy on start
        const startSpy = jest.spyOn(manager, 'start').mockImplementation(async () => { });

        await manager.resume();

        expect(mockQueue.resetStuckJobs).toHaveBeenCalled();
        expect(startSpy).toHaveBeenCalled();
    });
});
