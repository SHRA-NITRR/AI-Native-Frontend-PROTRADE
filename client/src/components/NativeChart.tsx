import React, { useMemo } from 'react';

interface NativeChartProps {
  data: number[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export function NativeChart({ 
  data, 
  color = '#0ea5e9', // default primary cyan
  height = 300,
  showGrid = true 
}: NativeChartProps) {
  
  const { path, fillPath, min, max } = useMemo(() => {
    if (!data || data.length === 0) return { path: '', fillPath: '', min: 0, max: 0 };
    
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const padding = (maxVal - minVal) * 0.1 || 1;
    const chartMin = minVal - padding;
    const chartMax = maxVal + padding;
    const range = chartMax - chartMin;

    const width = 800; // viewBox width
    const svgHeight = 400; // viewBox height

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = svgHeight - ((val - chartMin) / range) * svgHeight;
      return `${x},${y}`;
    });

    const d = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ');
    const fillD = `${d} L ${width},${svgHeight} L 0,${svgHeight} Z`;

    return { path: d, fillPath: fillD, min: chartMin, max: chartMax };
  }, [data]);

  if (!data.length) return <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>;

  const viewBoxHeight = 400;
  const viewBoxWidth = 800;

  return (
    <div className="w-full relative group" style={{ height }}>
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {showGrid && (
          <g className="stroke-white/5" strokeWidth="1">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line key={`h-${i}`} x1="0" y1={viewBoxHeight * ratio} x2={viewBoxWidth} y2={viewBoxHeight * ratio} />
            ))}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line key={`v-${i}`} x1={viewBoxWidth * ratio} y1="0" x2={viewBoxWidth * ratio} y2={viewBoxHeight} />
            ))}
          </g>
        )}

        <path
          d={fillPath}
          fill="url(#chartGradient)"
          className="transition-all duration-300 ease-linear"
        />
        
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 ease-linear drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]"
          style={{ stroke: color }}
        />
      </svg>
      
      {/* Overlay min/max labels */}
      {showGrid && (
        <>
          <div className="absolute top-2 left-2 text-xs font-mono text-muted-foreground bg-background/50 px-1 rounded">
            ${max.toFixed(2)}
          </div>
          <div className="absolute bottom-2 left-2 text-xs font-mono text-muted-foreground bg-background/50 px-1 rounded">
            ${min.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}
