import { useTradingStore, Ticker } from '@/store/useTradingStore';
import { formatCurrency, formatCrypto } from '@/lib/utils';
import { Wallet } from 'lucide-react';

export function PortfolioPanel() {
  const portfolio = useTradingStore(state => state.portfolio);
  const prices = useTradingStore(state => state.prices);

  const totalValue = portfolio.balance + Object.entries(portfolio.holdings).reduce((sum, [t, amount]) => {
    const ticker = t as Ticker;
    return sum + (amount * (prices[ticker]?.price || 0));
  }, 0);

  return (
    <div className="flex flex-col h-1/2 bg-slate-950 border-l border-b border-white/5 p-6">
      <div className="flex items-center gap-2 mb-6 text-muted-foreground">
        <Wallet className="w-5 h-5" />
        <h2 className="text-sm font-semibold tracking-wider uppercase">Portfolio</h2>
      </div>

      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-1">Total Equity</div>
        <div className="text-4xl font-mono font-bold text-white tracking-tight">
          {formatCurrency(totalValue)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {/* Cash Row */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div>
              <div className="font-bold">USD</div>
              <div className="text-xs text-muted-foreground">Cash</div>
            </div>
            <div className="text-right font-mono font-bold">
              {formatCurrency(portfolio.balance)}
            </div>
          </div>

          {/* Crypto Holdings */}
          {Object.entries(portfolio.holdings).map(([t, amount]) => {
            if (amount <= 0) return null;
            const ticker = t as Ticker;
            const value = amount * (prices[ticker]?.price || 0);

            return (
              <div key={ticker} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div>
                  <div className="font-bold">{ticker}</div>
                  <div className="text-xs text-muted-foreground font-mono">{formatCrypto(amount, ticker)}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold">{formatCurrency(value)}</div>
                  <div className="text-xs text-muted-foreground">@{formatCurrency(prices[ticker]?.price || 0)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
