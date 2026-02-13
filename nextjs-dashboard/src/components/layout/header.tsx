'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WalletConnect } from '@/components/auth/wallet-connect'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { User, Settings, LogOut } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

import { useState, useEffect } from 'react'

export function Header({ onMenuClick }: HeaderProps) {
  const { setTheme, theme } = useTheme()
  const { connected, account, disconnect } = useWallet()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get initials from address if connected, else "KA"
  const userInitials = "user"

  const handleLogout = async () => {
    await disconnect()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-secondary"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
              <span className="text-xl font-black text-primary-foreground">S</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <WalletConnect />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-all hover:bg-muted">
                {mounted ? (theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻') : '💻'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 border-border bg-card/95 backdrop-blur">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                <span>☀️ Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                <span>🌙 Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                <span>💻 System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-all border border-primary/20">
                <span className="text-[10px] font-bold text-primary uppercase">{userInitials}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-border bg-card/95 backdrop-blur">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Wallet User</p>
                  <p className="text-xs leading-none text-muted-foreground truncate max-w-[180px]">
                    {connected ? account?.address.toString() : 'Not Connected'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/accounts')} className="cursor-pointer gap-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer gap-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer gap-2 font-medium">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
