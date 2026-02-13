export enum JobType {
    UPLOAD = 'UPLOAD',
    DOWNLOAD = 'DOWNLOAD',
    VERIFY = 'VERIFY',
}

export enum JobStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface Job {
    id: string;
    type: JobType;
    status: JobStatus;
    payload: any;
    result?: any;
    error?: string;
    retries: number;
    maxRetries: number;
    createdAt: Date;
    updatedAt: Date;
}
