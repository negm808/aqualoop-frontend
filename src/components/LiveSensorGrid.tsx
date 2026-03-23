import React from 'react';
import { useStore } from '../store/useStore';
import { Activity, Droplets, Zap, Ruler } from 'lucide-react';

export const LiveSensorGrid: React.FC = () => {
  const latestReading = useStore(s => s.latestReading);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
      {[
        { label: 'pH LEVEL', val: latestReading?.ph || 7.2, icon: <Activity size={20} color="var(--primary)" />, color: 'var(--primary)' },
        { label: 'TDS (PPM)', val: latestReading?.tds || 512, icon: <Droplets size={20} color="var(--secondary)" />, color: 'var(--secondary)' },
        { label: 'LIGHT (LUX)', val: latestReading?.light || 14200, icon: <Zap size={20} color="var(--warning)" />, color: 'var(--warning)' },
        { label: 'WATER TEMP', val: `${latestReading?.temp || 24.5}°C`, icon: <Ruler size={20} color="var(--accent)" />, color: 'var(--accent)' }
      ].map((s, i) => (
        <div key={i} className="card glass-dark" style={{ 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          borderRadius: 'var(--r-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>{s.icon}</div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
          </div>
          <div>
            <div className="text-label" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '2px' }}>{s.label}</div>
            <div className="text-display-md" style={{ color: 'white', marginTop: '4px', fontSize: '28px' }}>{s.val}</div>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', background: s.color, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      ))}
    </div>
  );
};
