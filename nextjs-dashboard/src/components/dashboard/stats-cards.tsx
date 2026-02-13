'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Activity, Users, Database, Loader2 } from 'lucide-react'
import { StatCard } from './stat-card'
import type { LucideIcon } from 'lucide-react'

interface StatsData {
  totalUploads: number
  activeAccounts: number
  totalBlobs: number
  successRate: number
  networkHealth: number
  lastUpdated: string
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000) // Auto-refresh
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted/50" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Uploads',
      value: stats?.totalUploads.toString() || '0',
      icon: Database as LucideIcon,
      trend: stats?.totalUploads !== undefined ? 'Live' : 'No data',
      trendColor: 'text-green-600',
    },
    {
      title: 'Active Accounts',
      value: stats?.activeAccounts.toString() || '0',
      icon: Users as LucideIcon,
      trend: 'Active',
      trendColor: 'text-blue-600',
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      icon: TrendingUp as LucideIcon,
      trend: 'Optimal',
      trendColor: 'text-green-600',
    },
    {
      title: 'Network Health',
      value: `${stats?.networkHealth || 0}%`,
      icon: Activity as LucideIcon,
      trend: 'Stable',
      trendColor: 'text-emerald-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  )
}
