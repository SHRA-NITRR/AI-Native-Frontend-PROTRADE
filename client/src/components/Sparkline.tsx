import React, { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
}

export function Sparkline({ data, isPositive }: SparklineProps) {
  const path = useMemo(() => {
    if (!data || data.length === 0) return '';
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = (maxVal - minVal) || 1;
    
    const width = 100;
    const height = 30;

    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - minVal) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  }, [data]);

  const color = isPositive ? '#10B981' : '#EF4444'; // Tailwind success/destructive

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-16 h-8 overflow-visible">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300 ease-linear"
      />
    </svg>
  );
}
