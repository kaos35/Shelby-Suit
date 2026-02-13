'use client'

import { useState, useEffect } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function UploadChart({ className }: { className?: string }) {
  const [data, setData] = useState<{ time: string; uploads: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/blob')
        if (res.ok) {
          const blobs = await res.json()
          if (!Array.isArray(blobs)) return

          // Group by hour or just show last 10 uploads as points?
          // Let's create a time series for the last 24h
          // Initializing buckets
          const buckets = new Map<string, number>()

          blobs.forEach((blob: { uploadedAt: string }) => {
            const date = new Date(blob.uploadedAt)
            const key = date.getHours() + ':00'
            buckets.set(key, (buckets.get(key) || 0) + 1)
          })

          // Convert to array
          // For demo, just show last few data points if empty
          if (blobs.length === 0) {
            setData([])
          } else {
            const chartData = Array.from(buckets.entries()).map(([time, count]) => ({
              time,
              uploads: count
            })).sort((a, b) => a.time.localeCompare(b.time))
            setData(chartData)
          }
        }
      } catch (error) {
        console.error('Failed to fetch chart data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
    const interval = setInterval(fetchHistory, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="h-[300px] w-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Upload Activity</h3>
          <p className="text-sm text-muted-foreground mt-1">Today&apos;s overview</p>
        </div>
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      </div>

      <div className="h-[300px] w-full">
        {loading && data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Area
                type="monotone"
                dataKey="uploads"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorUploads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">No data available yet</p>
          </div>
        )}
      </div>
    </Card>
  )
}
