import { ShelbyAccount, SelectionStrategy } from './round-robin.js';

export class WeightedRandomStrategy implements SelectionStrategy {
    public selectAccount(accounts: ShelbyAccount[]): ShelbyAccount | undefined {
        if (!accounts.length) return undefined;

        let totalWeight = 0;
        const weights: number[] = [];

        // Calculate total weight
        for (const acc of accounts) {
            const w = acc.weight !== undefined && acc.weight > 0 ? acc.weight : 1;
            weights.push(w);
            totalWeight += w;
        }

        // Random value between 0 and totalWeight
        let random = Math.random() * totalWeight;

        // Select account based on weight
        for (let i = 0; i < accounts.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return accounts[i];
            }
        }

        // Should not reach here if logic is correct and totalWeight > 0, 
        // but as fallback return first account
        return accounts[0];
    }
}
