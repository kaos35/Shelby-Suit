import { useState, useEffect, useCallback } from 'react'
import { useLoading } from './useLoading'

export interface SystemStats {
    totalUploads: number
    activeAccounts: number
    totalBlobs: number
    successRate: number
    networkHealth: number
    uptime: string
    lastUpdated: string
}

export function useStats() {
    const [stats, setStats] = useState<SystemStats | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const { isLoading, startLoading, stopLoading } = useLoading(true)

    const fetchStats = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const response = await fetch('/api/stats')
            if (!response.ok) {
                throw new Error('Failed to fetch stats')
            }
            const data = await response.json()
            setStats(data)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'))
        } finally {
            stopLoading()
        }
    }, [startLoading, stopLoading])

    useEffect(() => {
        fetchStats()
        // Optional polling could be added here
        const interval = setInterval(fetchStats, 30000) // Refresh every 30s
        return () => clearInterval(interval)
    }, [fetchStats])

    return {
        stats,
        isLoading,
        error,
        refreshCallback: fetchStats,
    }
}
