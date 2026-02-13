import { useState, useCallback, useEffect } from 'react'

export interface HealthCheck {
    id: string
    name: string
    status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown'
    message: string
    uptime: string
}

export function useShelby() {
    const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const checkHealth = useCallback(async () => {
        setIsLoading(true)
        try {
            // Check API server health
            const start = Date.now()
            const res = await fetch('/api/stats')
            const latency = Date.now() - start

            const apiStatus = res.ok ? 'healthy' : 'unhealthy'

            setHealthChecks([
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
                    message: 'In-Memory Store Active',
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
            setHealthChecks([
                { id: 'api', name: 'API Server', status: 'unhealthy', message: 'Network Error', uptime: '0%' }
            ])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        checkHealth()
    }, [checkHealth])

    return {
        healthChecks,
        checkHealth,
        isLoading
    }
}
