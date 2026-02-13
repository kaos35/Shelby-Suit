'use client'

import { useState } from 'react'
import { Film, Loader2, CheckCircle2, Settings2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface TranscodeSettings {
    format: 'hls' | 'dash'
    quality: '720p' | '1080p' | '4k'
    segmentDuration: number
    adaptiveBitrate: boolean
}

export function MediaPrepare() {
    const { toast } = useToast()
    const [file, setFile] = useState<File | null>(null)
    const [preparing, setPreparing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [settings, setSettings] = useState<TranscodeSettings>({
        format: 'hls',
        quality: '1080p',
        segmentDuration: 6,
        adaptiveBitrate: true
    })

    const handlePrepare = async () => {
        if (!file) return
        setPreparing(true)
        setProgress(0)

        // Simulate transcoding preparation progress
        const steps = [
            { progress: 15, msg: 'Analyzing video metadata...' },
            { progress: 35, msg: 'Splitting into segments...' },
            { progress: 55, msg: 'Encoding adaptive bitrate variants...' },
            { progress: 75, msg: 'Generating manifest file...' },
            { progress: 90, msg: 'Applying erasure coding...' },
            { progress: 100, msg: 'Ready for Shelby upload' },
        ]

        for (const step of steps) {
            await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
            setProgress(step.progress)
        }

        setPreparing(false)
        toast({
            title: "Media Prepared!",
            description: `${file.name} transcoded to ${settings.format.toUpperCase()} (${settings.quality}). Ready for upload.`,
        })
    }

    return (
        <Card className="p-6 border-none bg-gradient-to-br from-card to-background shadow-2xl border border-border/50">
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Film className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">MediaPrepare</h3>
                        <p className="text-xs text-muted-foreground">Transcode videos for adaptive streaming</p>
                    </div>
                </div>

                {/* File Input */}
                <div className="relative">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            const selected = e.target.files?.[0]
                            if (selected) setFile(selected)
                        }}
                        disabled={preparing}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl transition-all ${file ? 'border-primary bg-primary/5' : 'border-border bg-secondary/10'
                        }`}>
                        {file ? (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                            <Film className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{file ? file.name : 'Select video file'}</p>
                            <p className="text-[10px] text-muted-foreground">
                                {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'MP4, WebM, MOV supported'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transcode Settings */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Format</span>
                        <div className="flex gap-1.5">
                            {(['hls', 'dash'] as const).map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => setSettings(s => ({ ...s, format: fmt }))}
                                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${settings.format === fmt
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                                        }`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Quality</span>
                        <div className="flex gap-1.5">
                            {(['720p', '1080p', '4k'] as const).map(q => (
                                <button
                                    key={q}
                                    onClick={() => setSettings(s => ({ ...s, quality: q }))}
                                    className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${settings.quality === q
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                                        }`}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30">
                    <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold">Adaptive Bitrate</span>
                    </div>
                    <button
                        onClick={() => setSettings(s => ({ ...s, adaptiveBitrate: !s.adaptiveBitrate }))}
                        className={`w-9 h-5 rounded-full transition-all relative ${settings.adaptiveBitrate ? 'bg-primary' : 'bg-muted'
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${settings.adaptiveBitrate ? 'left-[18px]' : 'left-0.5'
                            }`} />
                    </button>
                </div>

                {/* Progress Bar */}
                {preparing && (
                    <div className="space-y-2 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Transcoding</span>
                            <span className="text-[10px] font-mono font-bold text-primary">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Button
                    onClick={handlePrepare}
                    disabled={!file || preparing}
                    className="w-full h-10 font-bold shadow-lg shadow-primary/20 gap-2"
                >
                    {preparing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Transcoding...
                        </>
                    ) : (
                        <>
                            <Settings2 className="w-4 h-4" />
                            Prepare for Streaming
                        </>
                    )}
                </Button>
            </div>
        </Card>
    )
}
