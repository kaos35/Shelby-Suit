'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { UploadChart } from '@/components/dashboard/upload-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { UploadsTable } from '@/components/dashboard/uploads-table'
import { SystemHealth } from '@/components/dashboard/system-health'
import { UploadManager } from '@/components/dashboard/upload-manager'

export default function DashboardPage() {
  const { connected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!connected) {
      router.push('/login')
    }
  }, [connected, router])

  if (!connected) return null // Hide while redirecting

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Welcome to <span className="text-[#FF2D92]">Shelby Suite</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Revolutionizing ecosystem management with speed and precision.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <section>
        <StatsCards />
      </section>


      {/* Main Grid: Upload & Activity */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <UploadManager />
        </div>
        <div className="xl:col-span-2">
          <UploadChart />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-lg font-semibold">Recent File Uploads</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">Last seen files on the Shelby network</p>
            </div>
            <div className="p-0">
              <UploadsTable />
            </div>
          </div>
        </div>
        <div className="xl:col-span-1 space-y-6">
          <ActivityFeed className="h-full min-h-[400px]" />
        </div>
      </div>
    </div>
  )
}
