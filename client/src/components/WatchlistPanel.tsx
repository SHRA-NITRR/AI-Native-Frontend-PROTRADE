import { useTradingStore, Ticker } from '@/store/useTradingStore';
import { Sparkline } from './Sparkline';
import { PriceFlash } from './PriceFlash';
import { Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_TICKERS: Ticker[] = ['BTC', 'ETH', 'SOL'];

export function WatchlistPanel() {
  const watchlist = useTradingStore(state => state.watchlist);
  const selectedTicker = useTradingStore(state => state.selectedTicker);
  const selectTicker = useTradingStore(state => state.selectTicker);
  const toggleWatchlist = useTradingStore(state => state.toggleWatchlist);

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Markets</h2>
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {ALL_TICKERS.map((ticker) => (
          <WatchlistItem 
            key={ticker} 
            ticker={ticker} 
            isSelected={selectedTicker === ticker}
            isWatched={watchlist.includes(ticker)}
            onClick={() => selectTicker(ticker)}
            onToggleWatch={() => toggleWatchlist(ticker)}
          />
        ))}
      </div>
    </div>
  );
}

function WatchlistItem({ 
  ticker, 
  isSelected, 
  isWatched,
  onClick, 
  onToggleWatch 
}: { 
  ticker: Ticker, 
  isSelected: boolean,
  isWatched: boolean,
  onClick: () => void,
  onToggleWatch: () => void
}) {
  // Use a specific selector to ONLY re-render this row when this specific ticker updates
  const priceData = useTradingStore(state => state.prices[ticker]);
  
  if (!priceData) return null;

  const isPositive = priceData.change24h >= 0;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 cursor-pointer transition-all border-l-2 group hover:bg-white/[0.02]",
        isSelected ? "border-primary bg-primary/5" : "border-transparent"
      )}
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWatch(); }}
          className="text-muted-foreground hover:text-yellow-400 transition-colors"
        >
          <Star className={cn("w-4 h-4", isWatched && "fill-yellow-400 text-yellow-400")} />
        </button>
        <div>
          <div className="font-bold">{ticker}<span className="text-muted-foreground text-xs ml-1">/USD</span></div>
          <div className={cn("text-xs font-mono", isPositive ? "text-success" : "text-destructive")}>
            {isPositive ? '+' : ''}{priceData.change24h.toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden xl:block opacity-50 group-hover:opacity-100 transition-opacity">
          <Sparkline data={priceData.history.slice(-20)} isPositive={isPositive} />
        </div>
        <div className="text-right">
          <PriceFlash value={priceData.price} className="font-bold text-sm" />
        </div>
      </div>
    </div>
  );
}
