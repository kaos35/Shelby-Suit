'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { VideoPlayer } from '@shelby-protocol/player'
import { PlayCircle, ShieldCheck, Zap } from 'lucide-react'
import { MediaPrepare } from '@/components/dashboard/media-prepare'
import { useState, useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useRouter } from 'next/navigation'

export default function MediaPage() {
    const { connected } = useWallet()
    const router = useRouter()
    const [selectedVideo, setSelectedVideo] = useState<{
        src: string;
        title: string;
        description: string;
    } | null>({
        src: "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd", // Shaka Demo for initial testing
        title: "Eco-System Intro",
        description: "Welcome to the Shelby Protocol. This video is streamed directly from the decentralized network."
    })

    useEffect(() => {
        if (!connected) {
            router.push('/login')
        }
    }, [connected, router])

    if (!connected) return null

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Media Center</h1>
                <p className="text-muted-foreground">
                    Stream high-quality media directly from Shelby's storage providers.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-none shadow-2xl bg-black/5 dark:bg-white/5 backdrop-blur-xl">
                        <CardContent className="p-0">
                            {selectedVideo ? (
                                <div className="aspect-video bg-black flex items-center justify-center">
                                    <VideoPlayer
                                        src={selectedVideo.src}
                                        title={selectedVideo.title}
                                        className="w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-muted flex items-center justify-center">
                                    <PlayCircle className="w-12 h-12 text-muted-foreground animate-pulse" />
                                </div>
                            )}
                        </CardContent>
                        <CardHeader className="bg-background/50 backdrop-blur-md">
                            <CardTitle className="text-2xl">{selectedVideo?.title || "Select a video"}</CardTitle>
                            <CardDescription className="text-base">
                                {selectedVideo?.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-blue-500/10 border-blue-500/20">
                            <CardHeader className="pb-2">
                                <Zap className="w-5 h-5 text-blue-500 mb-2" />
                                <CardTitle className="text-sm">Low Latency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">DoubleZero private network delivery.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-500/10 border-green-500/20">
                            <CardHeader className="pb-2">
                                <ShieldCheck className="w-5 h-5 text-green-500 mb-2" />
                                <CardTitle className="text-sm">Verified Storage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Merkle-proof verified video chunks.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-purple-500/10 border-purple-500/20">
                            <CardHeader className="pb-2">
                                <PlayCircle className="w-5 h-5 text-purple-500 mb-2" />
                                <CardTitle className="text-sm">Multi-Bitrate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Adaptive streaming for all connections.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Library</CardTitle>
                            <CardDescription>Recently uploaded media blobls.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { id: 1, title: "Eco-System Intro", duration: "2:45", size: "125 MB" },
                                    { id: 2, title: "Smart Contract Audit", duration: "1:12:30", size: "2.4 GB" },
                                    { id: 3, title: "ShelbyNode Tutorial", duration: "15:20", size: "450 MB" },
                                ].map((video) => (
                                    <div
                                        key={video.id}
                                        className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                                        onClick={() => setSelectedVideo({
                                            ...selectedVideo!,
                                            title: video.title
                                        })}
                                    >
                                        <div className="relative w-24 h-16 rounded bg-muted overflow-hidden flex items-center justify-center">
                                            <PlayCircle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{video.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{video.duration}</span>
                                                <span>•</span>
                                                <span>{video.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <MediaPrepare />
                </div>
            </div>
        </div>
    )
}
