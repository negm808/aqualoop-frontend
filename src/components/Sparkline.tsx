import React from 'react';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color, height = 32 }) => {
  if (!data || data.length < 2) return <div style={{ height, width: 120 }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = range * 0.1;
  
  const width = 120;
  const denom = data.length - 1;
  
  const points = data.map((val, i) => ({
    x: (i / denom) * width,
    y: height - ((val - (min - padding)) / (range + padding * 2)) * height
  }));

  // Create smooth path using command strategy
  const smoothing = 0.2;
  const line = (a: any, b: any) => {
    const lengthX = b.x - a.x;
    const lengthY = b.y - a.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  };

  const controlPoint = (current: any, previous: any, next: any, reverse: boolean) => {
    const p = previous || current;
    const n = next || current;
    const l = line(p, n);
    const angle = l.angle + (reverse ? Math.PI : 0);
    const length = l.length * smoothing;
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return [x, y];
  };

  const d = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const [c1x, c1y] = controlPoint(a[i - 1], a[i - 2], point, false);
    const [c2x, c2y] = controlPoint(point, a[i - 1], a[i + 1], true);
    return `${acc} C ${c1x},${c1y} ${c2x},${c2y} ${point.x},${point.y}`;
  }, "");

  const fillPath = `${d} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={fillPath}
        fill={`url(#spark-grad-${color.replace('#','')})`}
        stroke="none"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
