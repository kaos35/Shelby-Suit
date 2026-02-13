import { ActivityFeed } from '@/components/dashboard/activity-feed'

export default function ActivityPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-8rem)]">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Activity</h2>
                <p className="text-muted-foreground">Real-time log of all system events.</p>
            </div>

            <ActivityFeed className="h-full" />
        </div>
    )
}
