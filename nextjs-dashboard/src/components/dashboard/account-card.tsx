'use client'

import { Wallet, Copy, RefreshCw, MoreVertical, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Account {
  id: string
  name: string
  address: string
  balance: string
  status: 'active' | 'inactive'
}

interface AccountCardProps {
  account: Account
  onDelete?: (id: string) => void
}

export function AccountCard({ account, onDelete }: AccountCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{account.name}</h3>
            <p className="text-xs text-muted-foreground">
              {account.address.slice(0, 8)}...{account.address.slice(-6)}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Balance
            </DropdownMenuItem>
            {onDelete && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(account.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Balance</span>
          <Badge variant="outline">{account.status}</Badge>
        </div>
        <p className="text-2xl font-bold text-card-foreground">{account.balance}</p>
      </div>
    </Card>
  )
}
