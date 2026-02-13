'use client'

import { useState } from 'react'
import { Upload as UploadIcon, FileUp, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useToast } from '@/hooks/use-toast'
import { useUploadBlobs } from '@shelby-protocol/react'

export function UploadManager() {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { connected, signAndSubmitTransaction, account } = useWallet()
  const { toast } = useToast()

  const uploadBlobs = useUploadBlobs({
    onSuccess: () => {
      toast({
        title: "Upload Complete!",
        description: `${file?.name} is now stored and verified on-chain.`,
      })
      setFile(null)
      setUploading(false)
    },
    onError: (error: any) => {
      console.error('Upload process failed:', error)
      toast({
        title: "Process Failed",
        description: error.message || "The transaction was rejected or network error occurred.",
        variant: "destructive"
      })
      setUploading(false)
    }
  })

  const handleUpload = async () => {
    if (!file || !account) return

    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Petra wallet to authorize the storage on-chain.",
        variant: "destructive"
      })
      return
    }

    setUploading(true)

    try {
      toast({
        title: "Initializing Upload",
        description: "Preparing file for Shelby network with erasure coding...",
      })

      const fileData = new Uint8Array(await file.arrayBuffer())

      uploadBlobs.mutate({
        signer: {
          account: account.address as any,
          signAndSubmitTransaction: signAndSubmitTransaction as any
        },
        blobs: [{
          blobName: file.name,
          blobData: fileData
        }],
        expirationMicros: (Date.now() + 30 * 24 * 60 * 60 * 1000) * 1000, // 30 days
      })

    } catch (error: any) {
      console.error('Preparation failed:', error)
      setUploading(false)
      toast({
        title: "Preparation Failed",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="p-8 border-none bg-gradient-to-br from-card to-background shadow-2xl relative overflow-hidden group border border-border/50">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <ShieldCheck className="w-24 h-24 text-primary" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-black uppercase tracking-tight text-card-foreground mb-2 flex items-center gap-2">
          <UploadIcon className="w-5 h-5 text-primary" />
          Shelby Storage
        </h3>
        <p className="text-sm text-muted-foreground mb-6 font-medium">
          Client-side erasure coding for verifiable storage.
        </p>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex justify-between items-center shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-black text-primary/80">Authorized Fee</span>
              <span className="text-xl font-mono font-black text-primary">0.05 SUSD</span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Network</span>
              <span className="text-sm font-black text-foreground antialiased uppercase italic">Shelbynet</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="file"
              onChange={(e) => {
                const selected = e.target.files?.[0]
                if (selected) setFile(selected)
              }}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div className={`
              flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed rounded-2xl transition-all duration-300
              ${file ? 'border-primary bg-primary/5' : 'border-border bg-secondary/10'}
              group-hover:border-primary group-hover:bg-primary/5
            `}>
              {file ? (
                <div className="bg-primary/20 p-4 rounded-full animate-in zoom-in-50 duration-300">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-full">
                  <FileUp className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              )}

              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  {file ? file.name : 'Choose a file to store'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Max size 50MB'}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading || !file || !connected}
            className={`w-full h-12 text-md font-bold rounded-xl shadow-lg transition-all duration-300 
              ${connected ? 'shadow-primary/20 hover:shadow-primary/40' : 'opacity-50'}`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Processing...
              </>
            ) : !connected ? (
              'Connect Wallet First'
            ) : (
              'Pay & Upload (SUSD)'
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3 h-3" />
            Secured by Shelby Network / Aptos L1
          </div>
        </div>
      </div>
    </Card>
  )
}
