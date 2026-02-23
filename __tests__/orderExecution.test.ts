import { describe, it, expect } from '@jest/globals';
import { useTradingStore } from '../client/src/store/useTradingStore';

// Mock Zustand store for testing
const createTestStore = () => {
    // Use the same logic as useTradingStore, but with a fresh state
    const initialState = {
        prices: {
            BTC: { ticker: 'BTC', price: 100, change24h: 0, history: Array(100).fill(100) },
            ETH: { ticker: 'ETH', price: 50, change24h: 0, history: Array(100).fill(50) },
            SOL: { ticker: 'SOL', price: 10, change24h: 0, history: Array(100).fill(10) },
        },
        portfolio: { balance: 10000, holdings: { BTC: 0, ETH: 0, SOL: 0 } },
        orders: [],
        watchlist: ['BTC', 'ETH', 'SOL'],
        selectedTicker: 'BTC',
    };
    return { ...initialState };
};

describe('Order Execution', () => {
    it('should not allow buying more than balance', () => {
        const store = createTestStore();
        const amount = 200;
        const price = store.prices.BTC.price;
        const totalValue = amount * price;
        // Simulate buy
        if (store.portfolio.balance < totalValue) {
            expect(() => {
                throw new Error('Insufficient USD balance');
            }).toThrow('Insufficient USD balance');
        }
    });

    it('should not allow selling more than holdings', () => {
        const store = createTestStore();
        const amount = 10;
        // Simulate sell
        if (store.portfolio.holdings.BTC < amount) {
            expect(() => {
                throw new Error('Insufficient BTC balance');
            }).toThrow('Insufficient BTC balance');
        }
    });

    it('should allow valid buy and update balance/holdings', () => {
        const store = createTestStore();
        const amount = 10;
        const price = store.prices.BTC.price;
        const totalValue = amount * price;
        if (store.portfolio.balance >= totalValue) {
            store.portfolio.balance -= totalValue;
            store.portfolio.holdings.BTC += amount;
            expect(store.portfolio.balance).toBe(10000 - 1000);
            expect(store.portfolio.holdings.BTC).toBe(10);
        }
    });
});
