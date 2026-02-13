import { RoundRobinStrategy, ShelbyAccount } from '../src/strategies/round-robin';
import { LeastLoadedStrategy } from '../src/strategies/least-loaded';
import { TokenAwareStrategy } from '../src/strategies/token-aware';
import { WeightedRandomStrategy } from '../src/strategies/weighted-random';

const mockAccounts: ShelbyAccount[] = [
    { id: '1', name: 'Alice', address: '0xA', balance: BigInt(100), weight: 1 },
    { id: '2', name: 'Bob', address: '0xB', balance: BigInt(500), weight: 3 },
    { id: '3', name: 'Charlie', address: '0xC', balance: BigInt(200), weight: 2 },
];

describe('RoundRobinStrategy', () => {
    test('should cycle through accounts in order', () => {
        const strategy = new RoundRobinStrategy();

        expect(strategy.selectAccount(mockAccounts)?.name).toBe('Alice');
        expect(strategy.selectAccount(mockAccounts)?.name).toBe('Bob');
        expect(strategy.selectAccount(mockAccounts)?.name).toBe('Charlie');
        // Should wrap around
        expect(strategy.selectAccount(mockAccounts)?.name).toBe('Alice');
    });

    test('should return undefined for empty accounts', () => {
        const strategy = new RoundRobinStrategy();
        expect(strategy.selectAccount([])).toBeUndefined();
    });
});

describe('LeastLoadedStrategy', () => {
    test('should pick account with least load', () => {
        const strategy = new LeastLoadedStrategy();

        // First call: all loads are 0, should pick first account
        const first = strategy.selectAccount(mockAccounts);
        expect(first?.name).toBe('Alice');

        // Now Alice has load 1, Bob and Charlie have 0
        const second = strategy.selectAccount(mockAccounts);
        expect(second?.name).toBe('Bob');

        const third = strategy.selectAccount(mockAccounts);
        expect(third?.name).toBe('Charlie');

        // Now all have load 1, should pick first again
        const fourth = strategy.selectAccount(mockAccounts);
        expect(fourth?.name).toBe('Alice');
    });

    test('should return undefined for empty accounts', () => {
        const strategy = new LeastLoadedStrategy();
        expect(strategy.selectAccount([])).toBeUndefined();
    });
});

describe('TokenAwareStrategy', () => {
    test('should pick account with highest balance', () => {
        const strategy = new TokenAwareStrategy();

        // Bob has 500 (highest)
        const selected = strategy.selectAccount(mockAccounts);
        expect(selected?.name).toBe('Bob');
    });

    test('should return undefined for empty accounts', () => {
        const strategy = new TokenAwareStrategy();
        expect(strategy.selectAccount([])).toBeUndefined();
    });

    test('should handle accounts without balance', () => {
        const strategy = new TokenAwareStrategy();
        const accs: ShelbyAccount[] = [
            { id: '1', name: 'NoBal', address: '0x1' },
            { id: '2', name: 'HasBal', address: '0x2', balance: BigInt(10) },
        ];
        expect(strategy.selectAccount(accs)?.name).toBe('HasBal');
    });
});

describe('WeightedRandomStrategy', () => {
    test('should return an account from the list', () => {
        const strategy = new WeightedRandomStrategy();
        const result = strategy.selectAccount(mockAccounts);
        expect(result).toBeDefined();
        expect(mockAccounts.some(a => a.id === result?.id)).toBe(true);
    });

    test('should return undefined for empty accounts', () => {
        const strategy = new WeightedRandomStrategy();
        expect(strategy.selectAccount([])).toBeUndefined();
    });

    test('should favor higher weighted accounts over many iterations', () => {
        const strategy = new WeightedRandomStrategy();
        const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0 };

        for (let i = 0; i < 1000; i++) {
            const result = strategy.selectAccount(mockAccounts);
            if (result) counts[result.id]++;
        }

        // Bob (weight=3) should be picked more than Alice (weight=1)
        expect(counts['2']).toBeGreaterThan(counts['1']);
    });
});
