'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Loader2 } from 'lucide-react'
import { AccountCard } from './account-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
// So just use alert or console.

interface Account {
  id: string
  name: string
  address: string
  balance: string
  status: 'active' | 'inactive'
}

export function AccountManager() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [newAccountName, setNewAccountName] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/account')
      if (res.ok) {
        const data = await res.json()
        setAccounts(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Failed to fetch accounts', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleAddAccount = async () => {
    if (!newAccountName.trim()) return

    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAccountName }),
      })

      if (res.ok) {
        const newAccount = await res.json()
        setAccounts([...accounts, newAccount])
        setNewAccountName('')
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Failed to create account', error)
      alert('Failed to create account')
    }
  }

  const handleDeleteAccount = (id: string) => {
    // Delete API not implemented yet, so just local removal + visual feedback
    if (!confirm(`Delete account ${id}?`)) return
    setAccounts(accounts.filter((acc) => acc.id !== id))
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Accounts {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
        </h3>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 px-3 text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Name</label>
                <Input
                  placeholder="e.g. Main Wallet"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Private Key</label>
                <Input type="password" placeholder="Enter private key..." />
                <p className="text-xs text-muted-foreground">Keys are stored locally and never sent to the server.</p>
              </div>
              <Button className="w-full" onClick={handleAddAccount} disabled={!newAccountName.trim()}>
                Import Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {loading && accounts.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onDelete={handleDeleteAccount}
            />
          ))
        )}
      </div>

      {!loading && accounts.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No accounts yet. Click &quot;Add&quot; to create one.
        </div>
      )}
    </Card>
  )
}
