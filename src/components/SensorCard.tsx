import { Sparkline } from './Sparkline';

interface SensorCardProps {
  label: string;
  value: number | string;
  unit: string;
  min?: number;
  max?: number;
  history: number[];
  color: string;
  status: 'Normal' | 'Low' | 'High' | 'Offline';
}

export const SensorCard: React.FC<SensorCardProps> = ({ 
  label, value, unit, min, max, history, color, status 
}) => {
  const getStatusBadgeClass = () => {
    switch (status) {
      case 'Normal': return 'badge-ok';
      case 'Low':
      case 'High': return 'badge-warn';
      case 'Offline': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="card card-hover" style={{ 
      position: 'relative', 
      overflow: 'hidden',
      padding: 'clamp(16px, 3vw, 24px)'
    }}>
      <div style={{
        position: 'absolute',
        top: -30,
        right: -30,
        width: '60px',
        height: '60px',
        background: color,
        opacity: 0.12,
        borderRadius: '50%'
      }} />

      <div className="text-label" style={{ color: 'var(--muted)', marginBottom: '12px', fontSize: 'clamp(9px, 2vw, 10px)' }}>{label}</div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
        <div className="text-display-md text-mono" style={{ fontSize: 'clamp(24px, 7vw, 32px)', fontWeight: 600 }}>{value}</div>
        <div className="text-mono-sm" style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 'clamp(11px, 2vw, 13px)' }}>{unit}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', gap: '8px' }}>
        <div style={{ minWidth: 0 }}>
          <div className={`badge ${getStatusBadgeClass()}`} style={{ fontSize: 'clamp(8px, 1.8vw, 10px)', whiteSpace: 'nowrap' }}>
             {status === 'Normal' ? '● Normal' : status === 'Low' ? '▼ Low' : status === 'High' ? '▲ High' : '✕ Offline'}
          </div>
          {min !== undefined && max !== undefined && (
            <div className="text-mono-sm" style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '9px' }}>
               {min}–{max}
            </div>
          )}
        </div>
        <div style={{ flexShrink: 0 }}>
          <Sparkline data={history} color={color} />
        </div>
      </div>
    </div>
  );
};
