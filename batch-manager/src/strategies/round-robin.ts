export interface ShelbyAccount {
    id: string;
    name: string;
    address: string;
    privateKey?: string;
    balance?: bigint;
    weight?: number;
}

export interface SelectionStrategy {
    selectAccount(accounts: ShelbyAccount[]): ShelbyAccount | undefined;
}

export class RoundRobinStrategy implements SelectionStrategy {
    private currentIndex: number = 0;

    public selectAccount(accounts: ShelbyAccount[]): ShelbyAccount | undefined {
        if (!accounts.length) return undefined;

        const account = accounts[this.currentIndex % accounts.length];
        this.currentIndex++;
        return account;
    }
}
