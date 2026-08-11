import React, { useState } from 'react';

// ==========================================
// 1. LINE CHART
// ==========================================
interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  fillColor?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  color = '#6366f1', // Indigo
  fillColor = 'rgba(99, 102, 241, 0.1)'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const padding = 35;
  const chartHeight = height - padding * 2;
  
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 10) * 1.1; // 10% headroom
  const minVal = 0;
  const range = maxVal - minVal;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (400 - padding * 2); // Assume width 400
    const y = padding + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
    : '';

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 400 ${height}`} className="w-full h-auto overflow-visible" style={{ minHeight: height }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + chartHeight * ratio;
          const val = Math.round(maxVal - (maxVal - minVal) * ratio);
          return (
            <g key={i} className="opacity-40 dark:opacity-20">
              <line 
                x1={padding} 
                y1={y} 
                x2={400 - padding} 
                y2={y} 
                stroke="currentColor" 
                strokeDasharray="4 4" 
                className="text-slate-300 dark:text-slate-700" 
              />
              <text 
                x={padding - 8} 
                y={y + 4} 
                textAnchor="end" 
                className="text-[10px] font-medium fill-slate-400 dark:fill-slate-500"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Fill Area */}
        <path d={areaD} fill="url(#lineGrad)" />

        {/* Line Path */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Dots on Path */}
        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={hoveredIndex === idx ? 5 : 3.5}
            fill={hoveredIndex === idx ? color : 'var(--background)'}
            stroke={color}
            strokeWidth="2"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-pointer transition-all duration-150"
          />
        ))}

        {/* X Labels */}
        {points.map((p, idx) => {
          if (data.length > 8 && idx % 2 !== 0) return null; // reduce label clutter
          return (
            <text
              key={idx}
              x={p.x}
              y={height - padding + 18}
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-400 dark:fill-slate-500"
            >
              {p.label}
            </text>
          );
        })}
      </svg>

      {/* Floating Tooltip HTML Overlay */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div 
          className="absolute z-10 glass-panel px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg text-slate-800 dark:text-slate-100"
          style={{
            left: `${(points[hoveredIndex].x / 400) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 20}%`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none'
          }}
        >
          <p className="text-[10px] text-slate-400 font-medium">{points[hoveredIndex].label}</p>
          <p className="text-sm font-bold text-indigo-500">{points[hoveredIndex].value}%</p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. BAR CHART
// ==========================================
interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  color = '#3b82f6' // Blue
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const padding = 35;
  const chartHeight = height - padding * 2;
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 10) * 1.1;
  const minVal = 0;
  const range = maxVal - minVal;

  const barWidth = Math.min(24, (330 - padding * 2) / data.length);
  const totalWidth = 400;
  const spacing = (totalWidth - padding * 2) / data.length;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 400 ${height}`} className="w-full h-auto overflow-visible" style={{ minHeight: height }}>
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + chartHeight * ratio;
          const val = Math.round(maxVal - (maxVal - minVal) * ratio);
          return (
            <g key={i} className="opacity-40 dark:opacity-20">
              <line 
                x1={padding} 
                y1={y} 
                x2={totalWidth - padding} 
                y2={y} 
                stroke="currentColor" 
                strokeDasharray="4 4" 
                className="text-slate-300 dark:text-slate-700" 
              />
              <text 
                x={padding - 8} 
                y={y + 4} 
                textAnchor="end" 
                className="text-[10px] font-medium fill-slate-400 dark:fill-slate-500"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, idx) => {
          const x = padding + idx * spacing + (spacing - barWidth) / 2;
          const h = (d.value / maxVal) * chartHeight;
          const y = height - padding - h;
          const isHovered = hoveredIndex === idx;

          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx={4}
                fill={color}
                opacity={isHovered ? 1 : 0.8}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all duration-200 hover:scale-x-[1.05]"
              />
              {/* X Labels */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 18}
                textAnchor="middle"
                className="text-[10px] font-medium fill-slate-400 dark:fill-slate-500"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip HTML Overlay */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div 
          className="absolute z-10 glass-panel px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg text-slate-800 dark:text-slate-100"
          style={{
            left: `${((padding + hoveredIndex * spacing + spacing / 2) / totalWidth) * 100}%`,
            top: `${( (height - padding - (data[hoveredIndex].value / maxVal) * chartHeight) / height) * 100 - 20}%`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none'
          }}
        >
          <p className="text-[10px] text-slate-400 font-medium">{data[hoveredIndex].label}</p>
          <p className="text-sm font-bold text-blue-500">{data[hoveredIndex].value}</p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. HEATMAP CHART
// ==========================================
interface HeatmapProps {
  rows: string[];
  cols: string[];
  data: number[][]; // rows x cols values from 0-100
}

export const HeatmapChart: React.FC<HeatmapProps> = ({ rows, cols, data }) => {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  const getCellColor = (val: number) => {
    // Premium teal intensities
    if (val < 20) return 'bg-slate-100 dark:bg-slate-900 text-slate-400';
    if (val < 40) return 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/10';
    if (val < 60) return 'bg-teal-500/40 text-teal-800 dark:text-teal-300 border border-teal-500/20';
    if (val < 80) return 'bg-teal-500/70 text-white border border-teal-500/40';
    return 'bg-teal-600 dark:bg-teal-500 text-white border border-teal-600/50 shadow-sm';
  };

  return (
    <div className="relative w-full overflow-x-auto select-none py-2">
      <div className="min-w-[480px]">
        {/* Heatmap Grid */}
        <div className="grid grid-cols-12 gap-1.5 items-center">
          {/* Top-left empty cell */}
          <div className="col-span-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Department</div>
          {/* Header Column Labels */}
          <div className="col-span-9 grid grid-cols-5 gap-1.5 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            {cols.map((col, cIdx) => (
              <div key={cIdx} className="truncate px-0.5">{col}</div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 mt-2">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-12 gap-1.5 items-center">
              {/* Row Label */}
              <div className="col-span-3 text-xs font-semibold text-slate-600 dark:text-slate-300 truncate pr-2">
                {row}
              </div>
              
              {/* Row Cells */}
              <div className="col-span-9 grid grid-cols-5 gap-1.5">
                {cols.map((col, cIdx) => {
                  const val = data[rIdx]?.[cIdx] || 0;
                  return (
                    <div
                      key={cIdx}
                      className={`h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-105 cursor-pointer ${getCellColor(val)}`}
                      onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {val}%
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Tooltip HTML Overlay */}
      {hoveredCell !== null && (
        <div 
          className="absolute z-10 glass-panel px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg text-slate-800 dark:text-slate-100"
          style={{
            left: `${((hoveredCell.c / cols.length) * 60 + 35)}%`,
            top: `${(hoveredCell.r / rows.length) * 60 + 20}%`,
            pointerEvents: 'none'
          }}
        >
          <p className="text-[10px] text-slate-400 font-medium">{rows[hoveredCell.r]} - {cols[hoveredCell.c]}</p>
          <p className="text-sm font-bold text-teal-500">Coverage: {data[hoveredCell.r][hoveredCell.c]}%</p>
        </div>
      )}
    </div>
  );
};
