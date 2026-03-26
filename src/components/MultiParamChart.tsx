import { useState, useMemo, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useStore } from '../store/useStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Filler,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, Filler);

// ── Full-scale normalization ranges ─────────────────────────────────
const SCALES: Record<string, [number, number]> = {
  ph:    [0, 14],
  tds:   [0, 2000],
  light: [0, 25000],
  temp:  [0, 50],
};

function norm(value: number, key: string): number {
  const [min, max] = SCALES[key];
  return ((value - min) / (max - min)) * 100;
}

function denorm(percent: number, key: string): number {
  const [min, max] = SCALES[key];
  return min + (percent / 100) * (max - min);
}

// ── Polynomial regression (degree 3) ───────────────────────────────
function polyFit(ys: number[], degree = 3): number[] {
  const n = ys.length;
  if (n <= degree + 1) return ys; // too few points

  // Build Vandermonde matrix & solve via normal equations
  const xs = ys.map((_, i) => i / (n - 1)); // normalize x to [0,1]
  const cols = degree + 1;

  // X^T * X
  const XtX: number[][] = Array.from({ length: cols }, () => new Array(cols).fill(0));
  const XtY: number[] = new Array(cols).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < cols; j++) {
      const xpj = Math.pow(xs[i], j);
      XtY[j] += xpj * ys[i];
      for (let k = 0; k < cols; k++) {
        XtX[j][k] += xpj * Math.pow(xs[i], k);
      }
    }
  }

  // Gaussian elimination
  const aug = XtX.map((row, i) => [...row, XtY[i]]);
  for (let col = 0; col < cols; col++) {
    let maxRow = col;
    for (let row = col + 1; row < cols; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    if (Math.abs(aug[col][col]) < 1e-12) continue;
    for (let row = col + 1; row < cols; row++) {
      const f = aug[row][col] / aug[col][col];
      for (let j = col; j <= cols; j++) aug[row][j] -= f * aug[col][j];
    }
  }
  // Back-substitution
  const coeffs = new Array(cols).fill(0);
  for (let i = cols - 1; i >= 0; i--) {
    coeffs[i] = aug[i][cols];
    for (let j = i + 1; j < cols; j++) coeffs[i] -= aug[i][j] * coeffs[j];
    coeffs[i] /= aug[i][i];
  }

  // Evaluate polynomial at each original x
  return xs.map(x => Math.max(0, coeffs.reduce((sum, c, p) => sum + c * Math.pow(x, p), 0)));
}

// ── Config ──────────────────────────────────────────────────────────
const PARAMS_CONFIG = {
  ph:    { key: 'ph',    name: 'pH',    unit: 'pH',  color: '#4F7CDB', colorEnd: '#A8C4F5', decimals: 2 },
  tds:   { key: 'tds',   name: 'TDS',   unit: 'ppm', color: '#2D9D78', colorEnd: '#94DDC4', decimals: 0 },
  light: { key: 'light', name: 'Light', unit: 'lux', color: '#E5943A', colorEnd: '#F5D5A0', decimals: 0 },
  temp:  { key: 'temp',  name: 'Temp',  unit: '°C',  color: '#C75B8E', colorEnd: '#EEB8D3', decimals: 1 },
};
type ParamKey = keyof typeof PARAMS_CONFIG;

const PROFILE_SETPOINTS: Record<string, Record<string, [number, number]>> = {
  main: { ph: [7.0, 7.5], tds: [300, 700],  light: [13500, 16500], temp: [18, 30] },
  db1:  { ph: [6.0, 7.0], tds: [700, 1200], light: [16000, 20000], temp: [18, 30] },
  db2:  { ph: [6.5, 7.5], tds: [600, 1000], light: [14000, 18000], temp: [18, 30] },
};

// ── Props ───────────────────────────────────────────────────────────
interface MultiParamChartProps {
  title: React.ReactNode;
  subtitle?: string;
  defaultParams: ParamKey[];
  availableParams?: ParamKey[];
}

export function MultiParamChart({ title, subtitle, defaultParams, availableParams }: MultiParamChartProps) {
  const { readings, wsConnected, setpoints, activeProfile } = useStore();
  const [activeParams, setActiveParams] = useState<Set<ParamKey>>(new Set(defaultParams));
  const [timeRange, setTimeRange] = useState<number>(6);
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  const toggleParam = (key: ParamKey) => {
    setActiveParams(prev => {
      const next = new Set(prev);
      if (next.has(key)) { if (next.size > 1) next.delete(key); } else { next.add(key); }
      return next;
    });
  };

  // ── Filter & sort readings ──────────────────────────────────────
  const filteredReadings = useMemo(() => {
    if (readings.length === 0) return [];
    const pointsNeeded = timeRange * 12;
    const sorted = [...readings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return sorted.slice(-pointsNeeded).map(r => {
      const d = new Date(r.timestamp);
      return { ...r, timeLabel: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` };
    });
  }, [readings, timeRange]);

  // ── Dynamic setpoint ranges ─────────────────────────────────────
  const currentSetpointRanges = useMemo<Record<string, [number, number]>>(() => {
    const base = PROFILE_SETPOINTS[activeProfile] || PROFILE_SETPOINTS.main;
    if (!setpoints) return base;
    return {
      ph:    [setpoints.ph_min, setpoints.ph_max],
      tds:   [setpoints.tds_min, setpoints.tds_max],
      light: [setpoints.lux_min, setpoints.lux_max],
      temp:  base.temp, // no temp setpoint override
    };
  }, [activeProfile, setpoints]);

  // ── Stats ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const s: Record<string, any> = {};
    activeParams.forEach(key => {
      const values = filteredReadings.map(r => Number(r[key])).filter(v => Number.isFinite(v));
      if (values.length === 0) return;
      const [minR, maxR] = currentSetpointRanges[key] || [0, 100];
      const getStatus = (val: number) => {
        if (val >= minR && val <= maxR) return { text: 'Normal', bg: 'var(--success-bg)', c: 'var(--success)' };
        if (val < minR) return { text: 'Low', bg: 'var(--warning-bg)', c: 'var(--warning)' };
        return { text: 'High', bg: 'var(--danger-bg)', c: 'var(--danger)' };
      };
      const latest = values[values.length - 1];
      const inRangeCount = values.filter(v => v >= minR && v <= maxR).length;
      s[key] = {
        min: Math.min(...values), max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        latest, inRangePct: Math.round((inRangeCount / values.length) * 100),
        status: getStatus(latest),
      };
    });
    return s;
  }, [filteredReadings, activeParams, currentSetpointRanges]);

  // ── Export ──────────────────────────────────────────────────────
  const handleExportExcel = () => {
    if (filteredReadings.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(filteredReadings.map(r => ({
      Timestamp: new Date(r.timestamp).toLocaleString(), Profile: r.profile,
      pH: r.ph, TDS: r.tds, Light_Lux: r.light, Temp_C: r.temp,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sensor Data');
    XLSX.writeFile(wb, `AquaLoop_Telemetry_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // ── Chart.js data ──────────────────────────────────────────────
  const labels = filteredReadings.map(r => r.timeLabel);
  const activeKeys = Array.from(activeParams);

  const datasets = activeKeys.map(key => {
    const rawValues = filteredReadings.map(r => norm(Number(r[key]), key));
    const smoothed = rawValues.length > 4 ? polyFit(rawValues, 3) : rawValues;
    const conf = PARAMS_CONFIG[key];
    return {
      label: key,
      data: smoothed,
      borderColor: conf.color,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;
        if (!chartArea) return conf.color + '10';
        const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, conf.color + '30');
        gradient.addColorStop(0.5, conf.colorEnd + '15');
        gradient.addColorStop(1, conf.color + '00');
        return gradient;
      },
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: conf.color,
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 3,
      tension: 0.6,
      fill: true,
      borderCapStyle: 'round' as const,
      borderJoinStyle: 'round' as const,
    };
  });

  // ── Setpoint bands plugin ──────────────────────────────────────
  const bandsPlugin: Plugin<'line'> = useMemo(() => ({
    id: 'setpointBands',
    beforeDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea || !scales.y) return;
      const colors: Record<string, string> = { ph: '#4F7CDB', tds: '#2D9D78', light: '#E5943A', temp: '#C75B8E' };
      ctx.save();
      activeKeys.forEach(k => {
        const range = currentSetpointRanges[k];
        if (!range) return;
        const yTop = scales.y.getPixelForValue(norm(range[1], k));
        const yBottom = scales.y.getPixelForValue(norm(range[0], k));
        // filled band
        ctx.fillStyle = colors[k] + '14';
        ctx.fillRect(chartArea.left, yTop, chartArea.right - chartArea.left, yBottom - yTop);
        // dashed borders
        ctx.strokeStyle = colors[k] + '40';
        ctx.lineWidth = 0.75;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(chartArea.left, yTop); ctx.lineTo(chartArea.right, yTop); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(chartArea.left, yBottom); ctx.lineTo(chartArea.right, yBottom); ctx.stroke();
      });
      ctx.restore();
    },
  }), [activeKeys, currentSetpointRanges]);

  // ── Chart.js options ───────────────────────────────────────────
  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e8e8e4',
        borderWidth: 1,
        titleColor: '#888780',
        bodyColor: '#1a1a18',
        padding: 12,
        cornerRadius: 10,
        boxPadding: 4,
        callbacks: {
          label: (ctx) => {
            const k = activeKeys[ctx.datasetIndex];
            if (!k) return '';
            const actual = denorm(ctx.parsed.y ?? 0, k);
            const conf = PARAMS_CONFIG[k];
            return ` ${conf.name}: ${actual.toFixed(conf.decimals)} ${conf.unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 10 }, color: '#b4b2a9', maxTicksLimit: 8, maxRotation: 0 },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        ticks: { font: { size: 10 }, color: '#b4b2a9', callback: (v) => v + '%' },
        grid: { color: '#f1efe8', lineWidth: 1 },
        border: { display: false },
      },
    },
  }), [activeKeys]);

  // Live update — skip animation for real-time feel
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update('none');
    }
  }, [filteredReadings]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={{
      background: '#ffffff', padding: '24px', borderRadius: '16px',
      maxWidth: '100%', border: '1px solid #e8e8e4', marginBottom: '32px',
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
            {title}
          </h2>
          {subtitle && <p style={{ fontSize: '13px', color: '#888780', marginTop: '4px' }}>{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
            borderRadius: '20px', background: wsConnected ? 'var(--success-bg)' : 'var(--danger-bg)',
            fontSize: '11px', color: wsConnected ? 'var(--success)' : 'var(--danger)', fontWeight: 600,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: wsConnected ? 'var(--success)' : 'var(--danger)', animation: wsConnected ? 'pulse 2s infinite' : 'none' }} />
            {wsConnected ? 'LIVE · Connected' : 'OFFLINE'}
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button onClick={handleExportExcel} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600, border: '1px solid #e8e8e4', background: '#fafaf8', color: 'var(--text)', cursor: 'pointer', transition: 'all 0.2s', marginRight: '8px' }}>
              <Download size={12} /> Export CSV
            </button>
            {[1, 6, 24].map(h => (
              <button
                key={h}
                onClick={() => setTimeRange(h)}
                style={{
                  padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600,
                  border: `1px solid ${timeRange === h ? 'var(--primary)' : '#e8e8e4'}`,
                  background: timeRange === h ? 'var(--primary)' : '#fafaf8',
                  color: timeRange === h ? '#fff' : '#b4b2a9', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Param toggles */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {activeKeys.map(k => {
          const conf = PARAMS_CONFIG[k];
          return (
            <div key={k} onClick={() => toggleParam(k)} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
              borderRadius: '10px', background: '#fafaf8', border: `1px solid ${conf.color}`,
              cursor: 'pointer', opacity: 1,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: conf.color }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: conf.color }}>{conf.name}</span>
              {stats[k] && (
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: stats[k].status.bg, color: stats[k].status.c }}>
                  {stats[k].latest.toFixed(conf.decimals)} {conf.unit}
                </span>
              )}
            </div>
          );
        })}
        {(availableParams || (Object.keys(PARAMS_CONFIG) as ParamKey[])).filter(k => !activeParams.has(k)).map(k => {
          const pk = k as ParamKey;
          return (
            <div key={pk} onClick={() => toggleParam(pk)} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
              borderRadius: '10px', background: '#fafaf8', border: '1px solid #e8e8e4',
              cursor: 'pointer', opacity: 0.5,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: PARAMS_CONFIG[pk].color }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#b4b2a9' }}>{PARAMS_CONFIG[pk].name}</span>
            </div>
          );
        })}
      </div>

      {/* Chart area — white theme */}
      <div style={{ background: '#fafaf8', border: '1px solid #e8e8e4', borderRadius: '12px', padding: '20px', position: 'relative', height: 280, marginBottom: '16px' }}>
        <Line
          ref={chartRef}
          data={{ labels, datasets }}
          options={options}
          plugins={[bandsPlugin]}
        />
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {activeKeys.map(key => {
          const conf = PARAMS_CONFIG[key];
          const s = stats[key];
          if (!s) return null;
          return (
            <div key={key} style={{ background: '#fafaf8', borderRadius: '12px', padding: '16px', border: '1px solid #e8e8e4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: conf.color }} />
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#b4b2a9' }}>{conf.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{s.latest.toFixed(conf.decimals)}</span>
                <span style={{ fontSize: '11px', color: '#b4b2a9' }}>{conf.unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)', color: 'var(--text)' }}><span style={{ color: '#b4b2a9' }}>min</span> {s.min.toFixed(conf.decimals)}</div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)', color: 'var(--text)' }}><span style={{ color: '#b4b2a9' }}>max</span> {s.max.toFixed(conf.decimals)}</div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)', color: 'var(--text)' }}><span style={{ color: '#b4b2a9' }}>avg</span> {s.avg.toFixed(conf.decimals)}</div>
              </div>
              <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', background: s.status.bg, color: s.status.c }}>
                {s.inRangePct}% in range
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
