import { AccountManager } from '@/components/dashboard/account-manager'
import { StatsCards } from '@/components/dashboard/stats-cards'

export default function AccountsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Accounts Management</h2>
                <p className="text-muted-foreground">Manage your Shelby accounts and view balances.</p>
            </div>

            <div className="md:grid-cols-2 lg:grid-cols-4 hidden">
                {/* Hiding StatsCards here as redundant or maybe show mini-stats */}
                <StatsCards />
            </div>

            <AccountManager />
        </div>
    )
}
