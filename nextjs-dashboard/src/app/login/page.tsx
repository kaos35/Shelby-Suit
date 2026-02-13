'use client'

import { WalletConnect } from '@/components/auth/wallet-connect'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const { connected } = useWallet()
    const router = useRouter()

    useEffect(() => {
        if (connected) {
            router.push('/')
        }
    }, [connected, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background gradients matching Shelby website */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(322,100%,67%,0.15),transparent)]" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(263,67%,23%,0.2),transparent)]" />

            {/* Floating accent dots */}
            <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
            <div className="absolute top-40 right-32 w-3 h-3 rounded-full bg-primary/20 animate-pulse delay-500" />
            <div className="absolute bottom-32 left-40 w-2 h-2 rounded-full bg-primary/30 animate-pulse delay-1000" />

            <div className="w-full max-w-md p-10 space-y-8 relative z-10 mx-4">
                {/* Brand Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                            <span className="text-3xl font-black text-primary-foreground">S</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-foreground">
                            Shelby
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2 font-medium tracking-wide">
                            Decentralized Storage Protocol
                        </p>
                    </div>
                </div>

                {/* Connect Card */}
                <div className="p-8 rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/30 shadow-2xl space-y-6">
                    <div className="text-center space-y-3">
                        <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                            Connect Wallet
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Link your <span className="text-primary font-bold">Petra</span> wallet to access the Shelby ecosystem dashboard.
                        </p>
                    </div>

                    <div className="flex justify-center pt-2">
                        <WalletConnect />
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center group hover:bg-primary/10 transition-colors">
                            <p className="text-xs font-black text-primary">100k+</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">TPS</p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50 border border-border/30 text-center group hover:bg-secondary transition-colors">
                            <p className="text-xs font-black text-foreground">SUSD</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Currency</p>
                        </div>
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center group hover:bg-primary/10 transition-colors">
                            <p className="text-xs font-black text-primary">E2E</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Encrypted</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-[10px] text-muted-foreground text-center max-w-[280px] mx-auto leading-relaxed">
                    Powered by <span className="font-bold text-primary">Aptos</span> blockchain with client-side erasure coding — your data, your keys.
                </p>
            </div>
        </div>
    )
}
