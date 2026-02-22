import { useEffect } from 'react';
import { useTradingStore } from '@/store/useTradingStore';
import { WatchlistPanel } from '@/components/WatchlistPanel';
import { ChartPanel } from '@/components/ChartPanel';
import { OrderEntryPanel } from '@/components/OrderEntryPanel';
import { PortfolioPanel } from '@/components/PortfolioPanel';
import { OrdersPanel } from '@/components/OrdersPanel';
import { Activity } from 'lucide-react';

export default function Terminal() {
  const tick = useTradingStore(state => state.tick);

  // Global Price Engine Tick
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-white/5 bg-slate-950 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">PRO<span className="text-primary">TRADE</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            MARKET OPEN
          </div>
        </div>
      </header>

      {/* Main Terminal Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Watchlist (25%) */}
        <div className="w-[25%] min-w-[300px] shrink-0 z-10 shadow-2xl">
          <WatchlistPanel />
        </div>

        {/* Center Panel: Chart & Order Entry (50%) */}
        <div className="w-[50%] flex flex-col z-0 relative shadow-2xl shadow-black/50">
          <ChartPanel />
          <OrderEntryPanel />
        </div>

        {/* Right Panel: Portfolio & Orders (25%) */}
        <div className="w-[25%] min-w-[300px] shrink-0 z-10 shadow-2xl flex flex-col">
          <PortfolioPanel />
          <OrdersPanel />
        </div>
      </div>
    </div>
  );
}
