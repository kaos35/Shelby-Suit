'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface HealthCheck {
  id: string
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown'
  message: string
  uptime: string
}

export function SystemHealth() {
  const [checks, setChecks] = useState<HealthCheck[]>([])
  const [loading, setLoading] = useState(true)

  const checkHealth = async () => {
    setLoading(true)
    try {
      // Check API server health
      const start = Date.now()
      const res = await fetch('/api/stats')
      const latency = Date.now() - start

      const apiStatus = res.ok ? 'healthy' : 'unhealthy'

      setChecks([
        {
          id: 'api',
          name: 'API Server',
          status: apiStatus,
          message: res.ok ? `Latency: ${latency}ms` : 'Failed to connect',
          uptime: '100%'
        },
        {
          id: 'db',
          name: 'Database',
          status: 'unknown',
          message: 'In-Memory Store Active', // Transparently show it's in-memory
          uptime: '-'
        },
        {
          id: 'storage',
          name: 'Storage Service',
          status: 'unknown',
          message: 'Not Configured',
          uptime: '-'
        },
        {
          id: 'cdn',
          name: 'CDN',
          status: 'unknown',
          message: 'Not Configured',
          uptime: '-'
        }
      ])
    } catch (error) {
      setChecks([
        { id: 'api', name: 'API Server', status: 'unhealthy', message: 'Network Error', uptime: '0%' }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getHealthIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'unhealthy': return <XCircle className="w-5 h-5 text-destructive" />
      default: return <AlertTriangle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/15 text-green-700 hover:bg-green-500/25'
      case 'degraded': return 'bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25'
      case 'unhealthy': return 'bg-destructive/15 text-destructive hover:bg-destructive/25'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">System Health</h3>
        <button onClick={checkHealth} className="text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {checks.map((check) => (
          <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
            <div className="flex items-center gap-3">
              {getHealthIcon(check.status)}
              <div>
                <p className="font-medium text-sm text-card-foreground">{check.name}</p>
                <p className="text-xs text-muted-foreground">{check.message}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className={getStatusColor(check.status)}>
                {check.status.toUpperCase()}
              </Badge>
              {check.status === 'healthy' && (
                <span className="text-xs text-muted-foreground font-mono">
                  {check.uptime}
                </span>
              )}
            </div>
          </div>
        ))}
        {checks.length === 0 && !loading && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No health data available.
          </div>
        )}
      </div>
    </Card>
  )
}
