// Core state management for the Shelby Dashboard
// Handles session-persistent data for accounts, blobs, and activities

export interface Account {
    id: string
    name: string
    address: string
    balance: string
    status: 'active' | 'inactive'
    createdAt: string
}

export interface Blob {
    id: string
    fileName: string
    fileSize: number
    accountName: string
    uploadedAt: string
    hash: string
    metadata: Record<string, unknown>
    onChainStatus?: 'pending' | 'verified' | 'failed'
    txHash?: string
}

export interface Activity {
    id: string
    type: 'upload' | 'download' | 'account' | 'system'
    message: string
    time: string
    status: 'success' | 'error' | 'info'
}

export interface UploadStats {
    totalUploads: number
    totalSize: number
}

class Store {
    accounts: Account[] = []
    blobs: Blob[] = []
    activities: Activity[] = []
    stats: UploadStats = {
        totalUploads: 0,
        totalSize: 0
    }

    addAccount(account: Account) {
        this.accounts.push(account)
        this.addActivity({
            type: 'account',
            message: `New account created: ${account.name}`,
            status: 'success'
        })
    }

    getAccounts() {
        return this.accounts
    }

    addBlob(blob: Blob) {
        this.blobs.push(blob)
        this.stats.totalUploads++
        this.stats.totalSize += blob.fileSize
        this.addActivity({
            type: 'upload',
            message: `File uploaded: ${blob.fileName}`,
            status: 'success'
        })
    }

    getBlobs() {
        return this.blobs
    }

    updateBlobOnChain(blobId: string, txHash: string) {
        const blob = this.blobs.find(b => b.id === blobId);
        if (blob) {
            blob.onChainStatus = 'verified';
            blob.txHash = txHash;
            this.addActivity({
                type: 'system',
                message: `On-chain verification successful for ${blob.fileName}`,
                status: 'success'
            });
        }
    }

    addActivity(activity: Omit<Activity, 'id' | 'time'>) {
        const newActivity = {
            ...activity,
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toISOString()
        }
        this.activities.unshift(newActivity) // Add to beginning
        if (this.activities.length > 50) this.activities.pop() // Limit history
    }
}

// Global singleton instance
const globalForStore = global as unknown as { store: Store }

export const store = globalForStore.store || new Store()

if (process.env.NODE_ENV !== 'production') globalForStore.store = store
