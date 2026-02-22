import { useEffect, useRef, useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PriceFlashProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function PriceFlash({ value, className, prefix = '', suffix = '' }: PriceFlashProps) {
  const prevValue = useRef(value);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (value > prevValue.current) {
      setFlash('up');
    } else if (value < prevValue.current) {
      setFlash('down');
    }
    prevValue.current = value;

    const timer = setTimeout(() => {
      setFlash(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  const colorClass = flash === 'up' 
    ? 'text-success drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
    : flash === 'down' 
      ? 'text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
      : 'text-foreground';

  return (
    <span className={cn("transition-colors duration-300 font-mono", colorClass, className)}>
      {prefix}{formatCurrency(value)}{suffix}
    </span>
  );
}
