import React from 'react';
import { Leaf, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export const HarvestCountdown: React.FC = () => {
  const activeProfile = useStore((s) => s.activeProfile);
  
  const growthSettings: Record<string, { days: number, label: string }> = {
    main: { days: 30, label: 'Butterhead Lettuce' },
    db1: { days: 45, label: 'Strawberry' },
    db2: { days: 25, label: 'Genovese Basil' }
  };

  const current = growthSettings[activeProfile] || growthSettings.main;
  const daysElapsed = 12; // Simulated: would normally be calculated from launch date
  const progress = (daysElapsed / current.days) * 100;
  
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="card glass" style={{ border: '1px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <div>
            <div className="text-label" style={{ color: 'var(--primary)' }}>MATURITY PROGRESS</div>
            <h3 className="text-display-sm">{current.label}</h3>
         </div>
         <div style={{ background: 'var(--surface2)', padding: '10px', borderRadius: 'var(--r-md)' }}>
            <Leaf size={20} color="var(--primary)" />
         </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0', position: 'relative' }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          <circle 
            cx="80" cy="80" r={radius} 
            fill="transparent" 
            stroke="var(--surface3)" 
            strokeWidth="12" 
          />
          <circle 
            cx="80" cy="80" r={radius} 
            fill="transparent" 
            stroke="var(--primary)" 
            strokeWidth="12" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div className="text-display-md" style={{ fontSize: '28px' }}>{Math.round(progress)}%</div>
          <div className="text-label" style={{ fontSize: '9px' }}>ELAPSED</div>
        </div>
      </div>

      <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 'var(--r-md)', display: 'flex', gap: '16px', alignItems: 'center' }}>
         <Clock size={16} color="var(--muted)" />
         <div className="text-body-sm" style={{ color: 'var(--muted)' }}>
            <strong>{current.days - daysElapsed} days</strong> remaining until estimated harvest window.
         </div>
      </div>
    </div>
  );
};
