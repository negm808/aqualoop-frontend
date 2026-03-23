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
    <div className="card card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
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

      <div className="text-label" style={{ color: 'var(--muted)', marginBottom: '12px' }}>{label}</div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
        <div className="text-display-md text-mono" style={{ fontSize: '32px', fontWeight: 600 }}>{value}</div>
        <div className="text-mono-sm" style={{ color: 'var(--muted)', fontWeight: 500 }}>{unit}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
        <div>
          <div className={`badge ${getStatusBadgeClass()}`}>
             {status === 'Normal' ? '● Normal' : status === 'Low' ? '▼ Low' : status === 'High' ? '▲ High' : '✕ Offline'}
          </div>
          {min !== undefined && max !== undefined && (
            <div className="text-mono-sm" style={{ color: 'var(--muted)', marginTop: '6px' }}>
               LIMITS: {min}–{max}
            </div>
          )}
        </div>
        <Sparkline data={history} color={color} />
      </div>
    </div>
  );
};
