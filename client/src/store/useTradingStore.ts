import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Ticker = 'BTC' | 'ETH' | 'SOL';
export type OrderType = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'EXECUTED' | 'CANCELLED';

export interface PriceData {
  ticker: Ticker;
  price: number;
  change24h: number;
  history: number[];
}

export interface Portfolio {
  balance: number;
  holdings: Record<Ticker, number>;
}

export interface Order {
  id: string;
  ticker: Ticker;
  type: OrderType;
  amount: number;
  price: number;
  isLimit: boolean;
  status: OrderStatus;
  timestamp: number;
}

interface TradingState {
  // Ephemeral State
  prices: Record<Ticker, PriceData>;
  selectedTicker: Ticker;
  
  // Persisted State
  portfolio: Portfolio;
  orders: Order[];
  watchlist: Ticker[];

  // Actions
  tick: () => void;
  selectTicker: (ticker: Ticker) => void;
  toggleWatchlist: (ticker: Ticker) => void;
  executeMarketOrder: (ticker: Ticker, type: OrderType, amount: number) => void;
  placeLimitOrder: (ticker: Ticker, type: OrderType, amount: number, triggerPrice: number) => void;
  cancelOrder: (id: string) => void;
}

const HISTORY_LENGTH = 100;

const INITIAL_PRICES: Record<Ticker, PriceData> = {
  BTC: { ticker: 'BTC', price: 64230.50, change24h: 0, history: Array(HISTORY_LENGTH).fill(64230.50) },
  ETH: { ticker: 'ETH', price: 3450.25, change24h: 0, history: Array(HISTORY_LENGTH).fill(3450.25) },
  SOL: { ticker: 'SOL', price: 145.80, change24h: 0, history: Array(HISTORY_LENGTH).fill(145.80) },
};

const INITIAL_PORTFOLIO: Portfolio = {
  balance: 10000,
  holdings: { BTC: 0, ETH: 0, SOL: 0 }
};

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      prices: INITIAL_PRICES,
      selectedTicker: 'BTC',
      portfolio: INITIAL_PORTFOLIO,
      orders: [],
      watchlist: ['BTC', 'ETH', 'SOL'],

      selectTicker: (ticker) => set({ selectedTicker: ticker }),

      toggleWatchlist: (ticker) => set((state) => ({
        watchlist: state.watchlist.includes(ticker) 
          ? state.watchlist.filter(t => t !== ticker)
          : [...state.watchlist, ticker]
      })),

      tick: () => set((state) => {
        // 1. Generate new prices (Random Walk)
        const newPrices = { ...state.prices };
        Object.keys(newPrices).forEach(t => {
          const ticker = t as Ticker;
          const oldPrice = newPrices[ticker].price;
          // Different volatility for different assets
          const volatility = ticker === 'BTC' ? 0.0005 : ticker === 'ETH' ? 0.001 : 0.002;
          const change = oldPrice * (Math.random() - 0.5) * volatility;
          const newPrice = Number((oldPrice + change).toFixed(2));
          
          const newHistory = [...newPrices[ticker].history.slice(1), newPrice];
          const oldHistoryBase = newHistory[0];
          const change24h = ((newPrice - oldHistoryBase) / oldHistoryBase) * 100;

          newPrices[ticker] = { ...newPrices[ticker], price: newPrice, change24h, history: newHistory };
        });

        // 2. Check Limit Orders
        let newPortfolio = { ...state.portfolio };
        let newOrders = [...state.orders];
        let hasOrderUpdates = false;

        newOrders = newOrders.map(order => {
          if (order.status !== 'PENDING') return order;
          const currentPrice = newPrices[order.ticker].price;
          
          let executed = false;
          if (order.type === 'BUY' && currentPrice <= order.price) executed = true;
          if (order.type === 'SELL' && currentPrice >= order.price) executed = true;

          if (executed) {
            hasOrderUpdates = true;
            // Execution price is the limit price
            if (order.type === 'BUY') {
              newPortfolio.holdings[order.ticker] += order.amount;
              // Funds were already deducted when placed
            } else {
              newPortfolio.balance += (order.amount * order.price);
              // Tokens were already deducted when placed
            }
            return { ...order, status: 'EXECUTED', timestamp: Date.now() };
          }
          return order;
        });

        if (hasOrderUpdates) {
          return { prices: newPrices, portfolio: newPortfolio, orders: newOrders };
        }
        return { prices: newPrices };
      }),

      executeMarketOrder: (ticker, type, amount) => set((state) => {
        const currentPrice = state.prices[ticker].price;
        const totalValue = amount * currentPrice;
        const newPortfolio = { ...state.portfolio, holdings: { ...state.portfolio.holdings } };

        if (type === 'BUY') {
          if (state.portfolio.balance < totalValue) throw new Error("Insufficient USD balance");
          newPortfolio.balance -= totalValue;
          newPortfolio.holdings[ticker] += amount;
        } else {
          if (state.portfolio.holdings[ticker] < amount) throw new Error(`Insufficient ${ticker} balance`);
          newPortfolio.balance += totalValue;
          newPortfolio.holdings[ticker] -= amount;
        }

        const newOrder: Order = {
          id: Math.random().toString(36).substring(2, 9),
          ticker, type, amount, price: currentPrice, isLimit: false, status: 'EXECUTED', timestamp: Date.now()
        };

        return { portfolio: newPortfolio, orders: [newOrder, ...state.orders] };
      }),

      placeLimitOrder: (ticker, type, amount, triggerPrice) => set((state) => {
        const totalValue = amount * triggerPrice;
        const newPortfolio = { ...state.portfolio, holdings: { ...state.portfolio.holdings } };

        // Lock funds/tokens for pending limit orders
        if (type === 'BUY') {
          if (state.portfolio.balance < totalValue) throw new Error("Insufficient USD balance for Limit Buy");
          newPortfolio.balance -= totalValue;
        } else {
          if (state.portfolio.holdings[ticker] < amount) throw new Error(`Insufficient ${ticker} balance for Limit Sell`);
          newPortfolio.holdings[ticker] -= amount;
        }

        const newOrder: Order = {
          id: Math.random().toString(36).substring(2, 9),
          ticker, type, amount, price: triggerPrice, isLimit: true, status: 'PENDING', timestamp: Date.now()
        };

        return { portfolio: newPortfolio, orders: [newOrder, ...state.orders] };
      }),

      cancelOrder: (id) => set((state) => {
        const order = state.orders.find(o => o.id === id);
        if (!order || order.status !== 'PENDING') return state;

        const newPortfolio = { ...state.portfolio, holdings: { ...state.portfolio.holdings } };
        
        // Refund locked funds/tokens
        if (order.type === 'BUY') {
          newPortfolio.balance += (order.amount * order.price);
        } else {
          newPortfolio.holdings[order.ticker] += order.amount;
        }

        const newOrders = state.orders.map(o => o.id === id ? { ...o, status: 'CANCELLED' as OrderStatus, timestamp: Date.now() } : o);
        return { portfolio: newPortfolio, orders: newOrders };
      })
    }),
    {
      name: 'trading-terminal-storage',
      // Only persist user data, not the live price feed
      partialize: (state) => ({ 
        portfolio: state.portfolio, 
        orders: state.orders, 
        watchlist: state.watchlist 
      }),
    }
  )
);
