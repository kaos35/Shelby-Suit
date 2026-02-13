'use client'

import Link from 'next/link'
import { X, Home, Upload, Settings, Database, Activity, PlayCircle, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GatewayConfig } from '@/components/dashboard/gateway-config'

import { usePathname } from 'next/navigation'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Uploads', href: '/uploads', icon: Upload },
    { name: 'Media', href: '/media', icon: PlayCircle },
    { name: 'Accounts', href: '/accounts', icon: Database },
    { name: 'Gateway', href: '#', icon: Globe, isModal: true },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card text-card-foreground border-r border-border/50 transform transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                <span className="text-xl font-black text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">Shelby</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href

              const linkContent = (
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group uppercase text-xs font-bold tracking-wider cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-primary"
                  )} />
                  <span>{item.name}</span>
                </div>
              )

              if (item.isModal) {
                return (
                  <Dialog key={item.name}>
                    <DialogTrigger asChild>
                      {linkContent}
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Ecosystem Gateway Configuration</DialogTitle>
                      </DialogHeader>
                      <GatewayConfig />
                    </DialogContent>
                  </Dialog>
                )
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose()}
                >
                  {linkContent}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 bg-secondary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center p-[2px]">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">SC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
