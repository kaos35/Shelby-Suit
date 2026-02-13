import { UploadManager } from '@/components/dashboard/upload-manager'
import { BlobManager } from '@/components/dashboard/blob-manager'
import { DownloadManager } from '@/components/dashboard/download-manager'

export default function UploadsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">File Management</h2>
                <p className="text-muted-foreground">Upload, manage, and download blobs.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-4">
                    <UploadManager />
                    <BlobManager />
                </div>
                <div className="col-span-3 space-y-4">
                    <DownloadManager />
                    {/* Recent uploads logic? BlobManager handles listing all */}
                </div>
            </div>
        </div>
    )
}
