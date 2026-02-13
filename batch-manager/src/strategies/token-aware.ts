import { ShelbyAccount, SelectionStrategy } from './round-robin.js';

export class TokenAwareStrategy implements SelectionStrategy {
    public selectAccount(accounts: ShelbyAccount[]): ShelbyAccount | undefined {
        if (!accounts.length) return undefined;

        let maxBalance = BigInt(-1);
        let selectedAcc: ShelbyAccount | undefined;

        for (const acc of accounts) {
            const balance = acc.balance ?? BigInt(0);
            if (balance > maxBalance) {
                maxBalance = balance;
                selectedAcc = acc;
            }
        }

        return selectedAcc;
    }
}
