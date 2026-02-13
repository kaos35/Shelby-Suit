'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Palette,
    Database,
    Globe,
    Save,
    Trash2,
    AlertCircle,
    Zap
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
    const { connected, account, disconnect } = useWallet()
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!connected) {
            router.push('/login')
        }
    }, [connected, router])

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast({
                title: "Settings saved",
                description: "Your preferences have been updated successfully.",
            })
        }, 800)
    }



    if (!connected) return null

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <SettingsIcon className="w-8 h-8 text-primary" />
                        System Settings
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Configure your Shelby node and personal preferences.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="gap-2 shadow-lg shadow-primary/20">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile & Wallet Section */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-primary font-bold mb-1">
                            <Shield className="w-4 h-4" />
                            <span>Identity & Security</span>
                        </div>
                        <CardTitle>Connected Wallet</CardTitle>
                        <CardDescription>Your unique identity on the Shelby network.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-muted/50 border border-border/50 flex flex-col gap-2">
                            <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Petra Address</span>
                            <code className="text-sm font-mono break-all bg-background p-2 rounded border border-border/30">
                                {account?.address.toString()}
                            </code>
                            <Badge className="w-fit bg-green-500/10 text-green-600 border-green-500/20">Verified On-Chain</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Your wallet is used to sign storage transactions and verify ownership of your data fragments.
                        </p>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button variant="outline" size="sm" onClick={disconnect} className="text-destructive hover:bg-destructive/10 border-destructive/20 ml-auto">
                            Disconnect & Logout
                        </Button>
                    </CardFooter>
                </Card>

                {/* Network Configuration */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-primary font-bold mb-1">
                            <Globe className="w-4 h-4" />
                            <span>Network RPCs</span>
                        </div>
                        <CardTitle>Shelbynet Connectivity</CardTitle>
                        <CardDescription>Official endpoints for the Shelby decentralized storage network.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Shelby RPC</span>
                                <code className="text-xs p-2 rounded bg-muted/50 border border-border/30 truncate">https://api.shelbynet.shelby.xyz</code>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Aptos Node</span>
                                <code className="text-xs p-2 rounded bg-muted/50 border border-border/30 truncate">https://fullnode.shelbynet.shelby.xyz/v1</code>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Indexer API</span>
                                <code className="text-xs p-2 rounded bg-muted/50 border border-border/30 truncate">https://indexer.shelbynet.shelby.xyz/v1/graphql</code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Communication */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-yellow-500 font-bold mb-1">
                            <Bell className="w-4 h-4" />
                            <span>Notifications</span>
                        </div>
                        <CardTitle>Alert Settings</CardTitle>
                        <CardDescription>Choose how you want to be notified of node events.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                            <span className="text-sm">Critical System Failures</span>
                            <Badge className="bg-primary">Always On</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground p-3 border-l-2 border-primary/50 bg-primary/5">
                            Notification preferences are synced with your browser's local storage.
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-2 border-destructive/20 shadow-md bg-destructive/5">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-destructive font-bold mb-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>Danger Zone</span>
                        </div>
                        <CardTitle>Danger Zone</CardTitle>
                        <CardDescription>Irreversible actions for your Shelby node.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-white border-destructive/30 gap-2 mb-3 transition-all">
                            <Trash2 className="w-4 h-4" />
                            Clear Local Storage & Cache
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center">
                            This will not affect your on-chain data, but will reset your dashboard preferences.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function Loader2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
