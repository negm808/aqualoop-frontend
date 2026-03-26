import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useStore } from '../store/useStore';
import type { ActuatorState } from '../store/useStore';
import { Power, Zap, RotateCcw, Cpu } from 'lucide-react';

interface ActuatorControlCardProps {
  id: string;
  name: string;
  state: ActuatorState;
  icon: React.ReactNode;
}

export const ActuatorControlCard: React.FC<ActuatorControlCardProps> = ({ 
  id, name, state, icon 
}) => {
  const { sendCommand } = useWebSocket();
  const setActuatorState = useStore((s) => s.setActuatorState);
  const resetEnergy = useStore((s) => s.resetEnergy);

  const handleToggle = () => {
    const newState = state.state === 'on' ? 'off' : 'on';
    setActuatorState(id, { state: newState });
    sendCommand('actuator_command', { actuator: id, state: newState, mode: state.mode });
  };

  const handleModeChange = () => {
    const newMode = state.mode === 'auto' ? 'manual' : 'auto';
    setActuatorState(id, { mode: newMode });
    sendCommand('actuator_command', { actuator: id, state: state.state, mode: newMode });
  };

  const isOn = state.state === 'on';
  const isAuto = state.mode === 'auto';

  return (
    <div className={`card card-hover actuator-card ${isOn ? 'active' : ''}`} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative',
      padding: 'var(--card-padding-mobile, 16px)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: isOn ? 'var(--success-bg)' : 'var(--surface2)',
            borderRadius: 'var(--r-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isOn ? 'var(--success)' : 'var(--muted)',
            transition: 'all 0.3s ease'
          }}>
            {icon}
          </div>
          <div>
            <h3 className="text-display-sm" style={{ margin: 0, fontSize: '16px' }}>{name}</h3>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <span className={`badge ${isOn ? 'badge-ok' : 'badge-neutral'}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                {state.state.toUpperCase()}
              </span>
              <span className={`badge ${isAuto ? 'badge-info' : 'badge-warn'}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                {state.mode.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleModeChange}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px'
          }}
          title={`Switch to ${state.mode === 'auto' ? 'Manual' : 'Auto'}`}
        >
          <Cpu size={16} />
        </button>
      </div>

      {/* Energy & Power Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '16px',
        background: 'var(--surface2)',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="text-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={10} /> Power
          </div>
          <div className="text-display-sm" style={{ display: 'baseline', gap: '4px' }}>
            {state.power}<span className="text-body-sm" style={{ color: 'var(--muted)', marginLeft: '2px' }}>W</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="text-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RotateCcw size={10} /> Energy
          </div>
          <div className="text-display-sm" style={{ display: 'baseline', gap: '4px' }}>
            {state.energy.toFixed(4)}<span className="text-body-sm" style={{ color: 'var(--muted)', marginLeft: '2px' }}>Wh</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
        <button 
          className="btn-primary" 
          onClick={handleToggle}
          style={{ 
            flex: 1, 
            background: isOn ? 'var(--danger)' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Power size={16} />
          {isOn ? 'Turn OFF' : 'Turn ON'}
        </button>
        <button 
          className="btn-secondary" 
          onClick={() => resetEnergy(id)}
          style={{ width: '48px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Reset Energy"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <style>{`
        .card.active {
          border-color: var(--primary);
          box-shadow: 0 8px 30px rgba(58, 107, 53, 0.1);
        }
        @media (min-width: 768px) {
          .actuator-card {
            padding: 24px !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};
