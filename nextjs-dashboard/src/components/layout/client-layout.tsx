'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'

    if (isLoginPage) {
        return <div className="min-h-screen bg-background">{children}</div>
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar for Desktop & Mobile Overlay */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header (only visible on small/medium screens if needed, 
            but Header is designed generally for all screens) */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-auto p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
