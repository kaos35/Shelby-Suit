'use client'

import { useState, useEffect } from 'react'
import { X, Package, Loader2, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Blob {
  id: string
  fileName: string
  fileSize: number
  accountName: string
  uploadedAt: string
}

export function BlobManager() {
  const [blobs, setBlobs] = useState<Blob[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchBlobs = async (query = '') => {
    setLoading(true)
    try {
      const url = query
        ? `/api/blob?id=${encodeURIComponent(query)}`
        : '/api/blob'

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setBlobs(Array.isArray(data) ? data : [data]) // Single blob or array
      } else {
        setBlobs([])
      }
    } catch (error) {
      console.error('Failed to fetch blobs:', error)
      setBlobs([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch all blobs on mount
  useEffect(() => {
    fetchBlobs()
  }, [])

  const handleSearch = () => {
    fetchBlobs(searchTerm)
  }

  const handleDelete = async (id: string) => {
    // API doesn't support delete yet
    if (!confirm(`Delete blob ${id}?`)) return
    setBlobs(blobs.filter(b => b.id !== id))
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        Blob Manager
        {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
      </h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            placeholder="Search by Blob ID..."
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </Button>
        </div>

        {blobs.length > 0 ? (
          <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
            {blobs.map((blob) => (
              <div
                key={blob.id}
                className="p-4 border border-border rounded-lg bg-muted/30 flex justify-between items-center"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-card-foreground truncate" title={blob.fileName}>
                      {blob.fileName || blob.id}
                    </p>
                    <Badge variant="outline" className="text-xs font-normal">
                      {(blob.fileSize / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{blob.accountName}</span>
                    <span>•</span>
                    <span>{new Date(blob.uploadedAt).toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {blob.id.slice(0, 8)}...
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(blob.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-sm text-muted-foreground mt-4 text-center py-8 border-2 border-dashed rounded-lg">
              No blobs found. Upload files using the Batch Uploader.
            </div>
          )
        )}
      </div>
    </Card>
  )
}
