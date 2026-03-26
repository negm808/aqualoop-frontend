import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useStore } from '../store/useStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// ── Polynomial regression (degree 3) for smoothing ──────────────────
function polyFit(ys: number[], degree = 3): number[] {
  const n = ys.length;
  if (n <= degree + 1) return ys;
  const xs = ys.map((_, i) => i / (n - 1));
  const cols = degree + 1;
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
  const coeffs = new Array(cols).fill(0);
  for (let i = cols - 1; i >= 0; i--) {
    coeffs[i] = aug[i][cols];
    for (let j = i + 1; j < cols; j++) coeffs[i] -= aug[i][j] * coeffs[j];
    coeffs[i] /= aug[i][i];
  }
  return xs.map(x => coeffs.reduce((sum, c, p) => sum + c * Math.pow(x, p), 0));
}

export const ActuatorActivityChart: React.FC = () => {
  const { actuatorReadings, wsConnected } = useStore();

  const data = useMemo(() => {
    const labels = actuatorReadings.map(r => {
      const d = new Date(r.timestamp);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Pump 1 (5W)',
          data: actuatorReadings.length > 4 ? polyFit(actuatorReadings.map(r => r.pump1)) : actuatorReadings.map(r => r.pump1),
          borderColor: '#3A6B35', // --primary
          backgroundColor: 'rgba(58, 107, 53, 0.1)',
          fill: true,
          tension: 0.5,
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'Pump 2 (5W)',
          data: actuatorReadings.length > 4 ? polyFit(actuatorReadings.map(r => r.pump2)) : actuatorReadings.map(r => r.pump2),
          borderColor: '#7B5E3A', // --secondary
          backgroundColor: 'rgba(123, 94, 58, 0.1)',
          fill: true,
          tension: 0.5,
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'Diluted Pump (4W)',
          data: actuatorReadings.length > 4 ? polyFit(actuatorReadings.map(r => r.diluted_pump)) : actuatorReadings.map(r => r.diluted_pump),
          borderColor: '#C8873A', // --accent
          backgroundColor: 'rgba(200, 135, 58, 0.1)',
          fill: true,
          tension: 0.5,
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'LED (6W)',
          data: actuatorReadings.length > 4 ? polyFit(actuatorReadings.map(r => r.led)) : actuatorReadings.map(r => r.led),
          borderColor: '#2563EB', // --info
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.5,
          borderWidth: 2,
          pointRadius: 0,
        }
      ]
    };
  }, [actuatorReadings]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Smooth real-time feel
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 8, // Just above the highest power (6W)
        title: {
          display: true,
          text: 'Power (W)',
          font: { size: 10, weight: 'bold' },
          color: '#b4b2a9'
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: { size: 10 },
          color: '#b4b2a9'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 10,
          font: { size: 10 },
          color: '#b4b2a9',
          maxRotation: 0
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 11, family: 'var(--ff-body)' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1C2B1A',
        bodyColor: '#1C2B1A',
        borderColor: 'rgba(58, 107, 53, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    }
  };

  return (
    <div className="card" style={{ height: '400px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 className="text-display-sm" style={{ margin: 0 }}>Activity & Power Usage</h2>
          <p className="text-body-sm" style={{ color: 'var(--muted)', marginTop: '4px' }}>Real-time power consumption across all actuators (W)</p>
        </div>
        <div className={`badge ${wsConnected ? 'badge-ok' : 'badge-danger'}`}>
          {wsConnected ? 'Live' : 'Offline'}
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative', height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
