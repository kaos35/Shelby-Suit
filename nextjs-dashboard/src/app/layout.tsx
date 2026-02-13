import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { ClientLayout } from '@/components/layout/client-layout'
import { WalletProvider } from '@/components/providers/wallet-provider'
import { ShelbyProvider } from '@/components/providers/shelby-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shelby Dashboard',
  description: 'Shelby Ecosystem Suite Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProvider>
            <ShelbyProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
              <Toaster />
            </ShelbyProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
