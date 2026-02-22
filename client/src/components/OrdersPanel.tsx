import { useTradingStore } from '@/store/useTradingStore';
import { formatCurrency, formatCrypto } from '@/lib/utils';
import { format } from 'date-fns';
import { History, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function OrdersPanel() {
  const orders = useTradingStore(state => state.orders);
  const cancelOrder = useTradingStore(state => state.cancelOrder);

  return (
    <div className="flex flex-col h-1/2 bg-slate-950 border-l border-white/5 p-6">
      <div className="flex items-center gap-2 mb-4 text-muted-foreground">
        <History className="w-5 h-5" />
        <h2 className="text-sm font-semibold tracking-wider uppercase">Order History</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mx-2 px-2">
        {orders.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No recent orders
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {orders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 rounded-lg bg-slate-900 border border-white/5 text-sm flex justify-between items-center group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${order.type === 'BUY' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                        {order.type}
                      </span>
                      <span className="font-bold">{order.ticker}</span>
                      <span className="text-muted-foreground text-xs">{order.isLimit ? 'LIMIT' : 'MARKET'}</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatCrypto(order.amount, '')} @ {formatCurrency(order.price)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold ${
                      order.status === 'EXECUTED' ? 'text-success' : 
                      order.status === 'CANCELLED' ? 'text-muted-foreground' : 'text-yellow-500'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {format(order.timestamp, 'HH:mm:ss')}
                    </span>
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => cancelOrder(order.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 text-destructive hover:text-red-400 p-1 bg-slate-900 rounded-full"
                        title="Cancel Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
