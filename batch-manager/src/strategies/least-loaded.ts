import { ShelbyAccount, SelectionStrategy } from './round-robin.js';

export class LeastLoadedStrategy implements SelectionStrategy {
    private loadMap: Map<string, number> = new Map();

    public selectAccount(accounts: ShelbyAccount[]): ShelbyAccount | undefined {
        if (!accounts.length) return undefined;

        // Initialize load for new accounts
        for (const acc of accounts) {
            if (!this.loadMap.has(acc.id)) {
                this.loadMap.set(acc.id, 0);
            }
        }

        // Filter map to only include currently provided accounts
        const activeIds = new Set(accounts.map(a => a.id));

        let minLoad = Infinity;
        let selectedAcc: ShelbyAccount | undefined;

        for (const acc of accounts) {
            const load = this.loadMap.get(acc.id) || 0;
            if (load < minLoad) {
                minLoad = load;
                selectedAcc = acc;
            }
        }

        if (selectedAcc) {
            this.incrementLoad(selectedAcc.id);
        }

        return selectedAcc;
    }

    public incrementLoad(accountId: string) {
        this.loadMap.set(accountId, (this.loadMap.get(accountId) || 0) + 1);
    }

    public decrementLoad(accountId: string) {
        const current = this.loadMap.get(accountId) || 0;
        this.loadMap.set(accountId, Math.max(0, current - 1));
    }
}
