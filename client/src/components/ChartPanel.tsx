import { useTradingStore } from '@/store/useTradingStore';
import { NativeChart } from './NativeChart';
import { PriceFlash } from './PriceFlash';

export function ChartPanel() {
  const selectedTicker = useTradingStore(state => state.selectedTicker);
  const priceData = useTradingStore(state => state.prices[selectedTicker]);

  if (!priceData) return null;

  const isPositive = priceData.change24h >= 0;
  const color = isPositive ? '#10B981' : '#EF4444';

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-0 border-b border-white/5">
      {/* Chart Header */}
      <div className="p-6 flex items-end justify-between z-10 relative bg-gradient-to-b from-background to-transparent">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">{selectedTicker}/USD</h1>
            <div className={`px-2 py-1 rounded text-xs font-mono font-bold ${isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              {isPositive ? '+' : ''}{priceData.change24h.toFixed(2)}%
            </div>
          </div>
          <PriceFlash 
            value={priceData.price} 
            className="text-4xl font-mono tracking-tight" 
          />
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground font-mono">
          <div>
            <span className="block text-xs uppercase mb-1 opacity-50">24H High</span>
            {Math.max(...priceData.history).toFixed(2)}
          </div>
          <div>
            <span className="block text-xs uppercase mb-1 opacity-50">24H Low</span>
            {Math.min(...priceData.history).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Chart Body */}
      <div className="flex-1 px-4 pb-4 -mt-10">
        <NativeChart data={priceData.history} color={color} height={400} />
      </div>
    </div>
  );
}
