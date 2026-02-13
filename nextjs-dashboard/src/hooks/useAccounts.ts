import { useState, useEffect, useCallback } from 'react'
import { useLoading } from './useLoading'
import { useToast } from '@/components/ui/use-toast'

export interface Account {
    id: string
    name: string
    address: string
    balance: string
    status: 'active' | 'inactive'
    createdAt: string
}

export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [error, setError] = useState<Error | null>(null)
    const { isLoading, startLoading, stopLoading } = useLoading(true)
    const { toast } = useToast()

    const fetchAccounts = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const response = await fetch('/api/account')
            if (!response.ok) {
                throw new Error('Failed to fetch accounts')
            }
            const data = await response.json()
            setAccounts(data)
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error('Unknown error')
            setError(errorObj)
            toast({
                title: "Error fetching accounts",
                description: errorObj.message,
                variant: "destructive",
            })
        } finally {
            stopLoading()
        }
    }, [startLoading, stopLoading, toast])

    useEffect(() => {
        fetchAccounts()
    }, [fetchAccounts])

    const createAccount = useCallback(async (name: string) => {
        try {
            const response = await fetch('/api/account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            })

            if (!response.ok) {
                throw new Error('Failed to create account')
            }

            const newAccount = await response.json()
            setAccounts((prev) => [...prev, newAccount])
            toast({
                title: "Account Created",
                description: `Account ${name} created successfully.`,
            })
            return newAccount
        } catch (err: any) {
            toast({
                title: "Error creating account",
                description: err.message,
                variant: "destructive",
            })
            throw err
        }
    }, [toast])

    return {
        accounts,
        isLoading,
        error,
        createAccount,
        refreshAccounts: fetchAccounts,
    }
}
