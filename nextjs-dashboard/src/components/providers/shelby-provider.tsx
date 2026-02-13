'use client'

import { ShelbyClient, ShelbyNetwork } from '@shelby-protocol/sdk/browser'
import { ShelbyClientProvider } from '@shelby-protocol/react'
import { ReactNode, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function ShelbyProvider({ children }: { children: ReactNode }) {
    const client = useMemo(() => {
        return new ShelbyClient({
            network: 'shelbynet' as ShelbyNetwork, // Official Shelby Testnet
        })
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <ShelbyClientProvider client={client}>
                {children}
            </ShelbyClientProvider>
        </QueryClientProvider>
    )
}
