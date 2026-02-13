'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnect() {
    const { connect, disconnect, connected, account, wallets } = useWallet()

    const handleConnect = async () => {
        try {
            // Find Petra wallet in the list of supported wallets
            const petra = wallets?.find((w) => w.name === 'Petra')
            if (petra) {
                connect(petra.name)
            } else {
                window.open('https://petra.app/', '_blank')
            }
        } catch (error) {
            console.error('Connection failed', error)
        }
    }

    if (connected && account) {
        return (
            <div className="flex items-center gap-3 bg-muted/50 pl-3 pr-1 py-1 rounded-full border border-border">
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Petra Connected</span>
                    <span className="text-xs font-mono">
                        {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={disconnect}
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        )
    }

    return (
        <Button onClick={handleConnect} className="gap-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
            <Wallet className="w-4 h-4" />
            <span>Connect Petra</span>
        </Button>
    )
}
