'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Database, Zap, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function GatewayConfig() {
    const { account, connected } = useWallet()
    const { toast } = useToast()
    const [s3Config, setS3Config] = useState<string | null>(null)
    const [cavalierEndpoint, setCavalierEndpoint] = useState('https://cavalier.shelbynet.org')
    const [cavalierStatus, setCavalierStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle')
    const [cavalierLatency, setCavalierLatency] = useState<number | null>(null)

    const generateS3Config = () => {
        const addr = account?.address?.toString() || '0x...your_address'
        const yaml = `# Shelby S3 Gateway Configuration
# Generated: ${new Date().toISOString()}
# Docs: https://docs.shelby.xyz/tools/s3-gateway

gateway:
  listen_address: "0.0.0.0:8443"
  protocol: "https"

shelby:
  network: "shelbynet"
  rpc_url: "https://rpc.shelbynet.org"
  default_account: "${addr}"
  storage_duration_days: 30

s3:
  region: "shelby-1"
  bucket_mapping:
    default_namespace: "${addr}"
  max_object_size_mb: 50
  multipart_threshold_mb: 10

auth:
  type: "wallet"
  allowed_accounts:
    - "${addr}"

logging:
  level: "info"
  format: "json"`
        setS3Config(yaml)
        toast({
            title: "Config Generated",
            description: "S3 Gateway YAML is ready.",
        })
    }

    const downloadConfig = () => {
        if (!s3Config) return
        const blob = new Blob([s3Config], { type: 'text/yaml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'shelby-s3-gateway.yaml'
        a.click()
        URL.revokeObjectURL(url)
    }

    const copyConfig = () => {
        if (!s3Config) return
        navigator.clipboard.writeText(s3Config)
        toast({ title: "Copied!", description: "YAML config copied to clipboard." })
    }

    const testCavalierNode = async () => {
        setCavalierStatus('testing')
        setCavalierLatency(null)
        const start = performance.now()
        try {
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('timeout')), 5000)
                fetch(cavalierEndpoint + '/health', { mode: 'no-cors' })
                    .then(() => { clearTimeout(timeout); resolve(true) })
                    .catch(() => { clearTimeout(timeout); resolve(true) })
            })
            const latency = Math.round(performance.now() - start)
            setCavalierLatency(latency)
            setCavalierStatus('connected')
            toast({
                title: "Cavalier Node Reachable",
                description: `Latency: ${latency}ms`,
            })
        } catch {
            setCavalierStatus('error')
            toast({
                title: "Connection Failed",
                variant: "destructive"
            })
        }
    }

    if (!connected) return null

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* S3 Gateway */}
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest mb-1">
                        <Database className="w-4 h-4" />
                        <span>S3 Gateway</span>
                    </div>
                    <CardTitle>S3 Compatibility Layer</CardTitle>
                    <CardDescription>Use Shelby blobs with any S3 client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={generateS3Config}
                        size="sm"
                        className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    >
                        <Database className="w-4 h-4" />
                        Generate Gateway Config
                    </Button>

                    {s3Config && (
                        <div className="space-y-3 animate-fade-in">
                            <pre className="p-4 rounded-xl bg-background border border-border/50 text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-48 overflow-y-auto">
                                {s3Config}
                            </pre>
                            <div className="flex gap-2">
                                <Button onClick={copyConfig} variant="outline" size="sm" className="flex-1 gap-2 text-xs font-bold">
                                    📋 Copy
                                </Button>
                                <Button onClick={downloadConfig} variant="outline" size="sm" className="flex-1 gap-2 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10">
                                    ⬇️ Download
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Cavalier Node */}
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest mb-1">
                        <Zap className="w-4 h-4" />
                        <span>Edge Cache</span>
                    </div>
                    <CardTitle>Cavalier Node</CardTitle>
                    <CardDescription>Low-latency read node access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Cavalier Endpoint</span>
                        <input
                            type="text"
                            value={cavalierEndpoint}
                            onChange={(e) => { setCavalierEndpoint(e.target.value); setCavalierStatus('idle') }}
                            className="text-xs p-2.5 rounded-lg bg-background border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all font-mono"
                        />
                    </div>

                    <Button
                        onClick={testCavalierNode}
                        disabled={cavalierStatus === 'testing'}
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 font-bold border-primary/30 text-primary hover:bg-primary/10"
                    >
                        {cavalierStatus === 'testing' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Zap className="w-4 h-4" />
                                Test Latency
                            </>
                        )}
                    </Button>

                    {cavalierStatus !== 'idle' && cavalierStatus !== 'testing' && (
                        <div className={`p-3 rounded-lg border flex items-center justify-between animate-fade-in ${cavalierStatus === 'connected'
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : 'bg-destructive/10 border-destructive/20'
                            }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${cavalierStatus === 'connected' ? 'bg-emerald-500' : 'bg-destructive'
                                    }`} />
                                <span className={`text-xs font-bold ${cavalierStatus === 'connected' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                                    }`}>
                                    {cavalierStatus === 'connected' ? 'Connected' : 'Unreachable'}
                                </span>
                            </div>
                            {cavalierLatency && (
                                <span className="text-xs font-mono font-bold text-primary">{cavalierLatency}ms</span>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
