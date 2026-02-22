import { useState } from 'react';
import { useTradingStore, OrderType } from '@/store/useTradingStore';
import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

export function OrderEntryPanel() {
  const ticker = useTradingStore(state => state.selectedTicker);
  const currentPrice = useTradingStore(state => state.prices[ticker].price);
  const portfolio = useTradingStore(state => state.portfolio);
  const executeMarketOrder = useTradingStore(state => state.executeMarketOrder);
  const placeLimitOrder = useTradingStore(state => state.placeLimitOrder);

  const [orderType, setOrderType] = useState<OrderType>('BUY');
  const [isLimit, setIsLimit] = useState(false);
  
  const [amountStr, setAmountStr] = useState('');
  const [priceStr, setPriceStr] = useState('');

  const amount = parseFloat(amountStr) || 0;
  const triggerPrice = isLimit ? (parseFloat(priceStr) || 0) : currentPrice;
  const totalValue = amount * triggerPrice;

  const handleExecute = () => {
    if (amount <= 0) return;
    
    try {
      if (isLimit) {
        if (!triggerPrice || triggerPrice <= 0) throw new Error("Invalid limit price");
        placeLimitOrder(ticker, orderType, amount, triggerPrice);
      } else {
        executeMarketOrder(ticker, orderType, amount);
      }
      setAmountStr('');
      setPriceStr('');
    } catch (e: any) {
      alert(e.message); // In a real app, use a toast notification
    }
  };

  const getButtonText = () => {
    if (amount <= 0) return "Enter Amount";
    if (orderType === 'BUY' && totalValue > portfolio.balance) return "Insufficient USD";
    if (orderType === 'SELL' && amount > (portfolio.holdings[ticker] || 0)) return `Insufficient ${ticker}`;
    return `${orderType} ${ticker}`;
  };

  return (
    <div className="h-80 bg-card p-6 flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex gap-6 text-sm font-semibold">
          <button 
            onClick={() => setIsLimit(false)}
            className={cn("pb-4 -mb-4 border-b-2 transition-colors", !isLimit ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            Market
          </button>
          <button 
            onClick={() => { setIsLimit(true); setPriceStr(currentPrice.toString()); }}
            className={cn("pb-4 -mb-4 border-b-2 transition-colors", isLimit ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            Limit
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6">
        <div className="flex-1 flex flex-col gap-4">
          {/* Buy / Sell Toggle */}
          <div className="flex bg-slate-900 rounded-lg p-1">
            <button 
              onClick={() => setOrderType('BUY')}
              className={cn("flex-1 py-2 rounded-md text-sm font-bold transition-all", orderType === 'BUY' ? "bg-success text-white shadow-lg" : "text-muted-foreground hover:text-white")}
            >
              Buy
            </button>
            <button 
              onClick={() => setOrderType('SELL')}
              className={cn("flex-1 py-2 rounded-md text-sm font-bold transition-all", orderType === 'SELL' ? "bg-destructive text-white shadow-lg" : "text-muted-foreground hover:text-white")}
            >
              Sell
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {isLimit && (
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs text-muted-foreground">Price</span>
                <input 
                  type="number" 
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-lg py-2 pl-14 pr-4 text-right font-mono focus:outline-none focus:border-primary transition-colors"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-3 text-xs text-muted-foreground">USD</span>
              </div>
            )}
            
            <div className="relative">
              <span className="absolute left-3 top-3 text-xs text-muted-foreground">Amount</span>
              <input 
                type="number" 
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-lg py-2 pl-16 pr-10 text-right font-mono focus:outline-none focus:border-primary transition-colors"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-3 text-xs font-bold text-muted-foreground">{ticker}</span>
            </div>

            {/* Quick percentages (Optional UI flair) */}
            <div className="flex gap-2">
              {[25, 50, 75, 100].map(pct => (
                <button 
                  key={pct}
                  onClick={() => {
                    if (orderType === 'BUY') {
                      const maxBuy = portfolio.balance / triggerPrice;
                      setAmountStr((maxBuy * (pct/100)).toFixed(4));
                    } else {
                      const maxSell = portfolio.holdings[ticker] || 0;
                      setAmountStr((maxSell * (pct/100)).toFixed(4));
                    }
                  }}
                  className="flex-1 py-1 text-xs bg-slate-900 hover:bg-slate-800 rounded border border-white/5 text-muted-foreground transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Submit */}
        <div className="flex-1 flex flex-col justify-end bg-slate-900/50 p-4 rounded-xl border border-white/5">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available</span>
              <span className="font-mono">{orderType === 'BUY' ? formatCurrency(portfolio.balance) : `${(portfolio.holdings[ticker] || 0).toFixed(4)} ${ticker}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Est. Total</span>
              <span className="font-mono font-bold">{formatCurrency(totalValue)}</span>
            </div>
          </div>

          <button
            onClick={handleExecute}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]",
              orderType === 'BUY' ? "bg-success hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-destructive hover:bg-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            )}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
