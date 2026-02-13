'use client'

import { useState, useEffect } from 'react'
import { Clock, Upload, Download, Wallet, Database, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  type: 'upload' | 'download' | 'account' | 'system'
  message: string
  time: string
  status: 'success' | 'error' | 'info'
}

export function ActivityFeed({ className }: { className?: string }) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activity')
      if (res.ok) {
        const data = await res.json()
        setActivities(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Failed to fetch activities', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 5000)
    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />
      case 'download': return <Download className="w-4 h-4" />
      case 'account': return <Wallet className="w-4 h-4" />
      case 'system': return <Database className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-destructive" />
      case 'info': return <AlertCircle className="w-4 h-4 text-blue-500" />
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className={cn("p-6 flex flex-col", className || "h-[400px]")}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Activity Feed</h3>
        <Badge variant="outline" className="text-xs font-normal">
          Live
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {loading && activities.length === 0 ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-in slide-in-from-left-2 duration-300"
            >
              <div className={`mt-0.5 p-1.5 rounded-full bg-muted ${activity.status === 'error' ? 'bg-destructive/10 text-destructive' :
                  activity.status === 'success' ? 'bg-green-500/10 text-green-600' : ''
                }`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground font-medium">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatTime(activity.time)}</span>
                </div>
              </div>
              {getStatusIcon(activity.status)}
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8 flex flex-col items-center">
            <span className="mb-2">No recent activity</span>
            <span className="text-xs">Actions will appear here automatically</span>
          </div>
        )}
      </div>
    </Card>
  )
}
