'use client'

import { useState, useEffect } from 'react'
import { Clock, File, Loader2, CheckCircle2, Link as LinkIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

interface Upload {
  id: string
  fileName: string
  fileSize: number
  accountName: string
  uploadedAt: string
  onChainStatus?: 'pending' | 'verified' | 'failed'
  txHash?: string
}

export function UploadsTable() {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchUploads = async () => {
    try {
      const res = await fetch('/api/blob')
      if (res.ok) {
        const data = await res.json()
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
          : []
        setUploads(sorted.slice(0, 10))
      }
    } catch (error) {
      console.error('Failed to fetch uploads', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUploads()
    const interval = setInterval(fetchUploads, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="w-full">
      {loading && uploads.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : uploads.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="w-[250px]">File Details</TableHead>
                <TableHead>Owner Account</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Network Status</TableHead>
                <TableHead className="text-right">Aptos Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads.map((upload) => (
                <TableRow key={upload.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                        <File className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold truncate max-w-[180px]" title={upload.fileName}>
                          {upload.fileName}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTime(upload.uploadedAt)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {upload.accountName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {formatFileSize(upload.fileSize)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 px-2 py-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                      Stored
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {upload.onChainStatus === 'verified' ? (
                      <div className="flex items-center justify-end gap-2 text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-tighter">Verified</span>
                        <a
                          href={`https://explorer.aptoslabs.com/txn/${upload.txHash}?network=mainnet`}
                          target="_blank"
                          className="p-1 hover:bg-primary/10 rounded transition-colors"
                          title="View on Explorer"
                        >
                          <LinkIcon className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
                        Off-chain
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-16 border-2 border-dashed rounded-2xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <File className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No uploads yet</p>
          <p className="text-xs mt-1">Upload your first file to see it here and register on-chain.</p>
        </div>
      )}
    </div>
  )
}
