import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useStore } from '../store/useStore';

interface ActuatorToggleProps {
  id: string;
  name: string;
  subtitle: string;
  state: 'on' | 'off';
  mode: 'auto' | 'manual';
  icon: string;
}

export const ActuatorToggle: React.FC<ActuatorToggleProps> = ({ 
  id, name, subtitle, state, mode, icon 
}) => {
  const { sendCommand } = useWebSocket();
  const setActuatorState = useStore((s) => s.setActuatorState);

  const handleToggle = () => {
    const newState = state === 'on' ? 'off' : 'on';
    // Optimistic update
    setActuatorState(id, { state: newState });
    sendCommand('actuator_command', { actuator: id, state: newState, mode });
  };

  const handleModeChange = (newMode: 'auto' | 'manual') => {
    setActuatorState(id, { mode: newMode });
    sendCommand('actuator_command', { actuator: id, state, mode: newMode });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'clamp(12px, 2vw, 16px) 0',
      borderBottom: '1px solid var(--border)',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 16px)', minWidth: 0 }}>
        <div style={{
          width: 'clamp(40px, 10vw, 44px)',
          height: 'clamp(40px, 10vw, 44px)',
          flexShrink: 0,
          background: state === 'on' ? 'rgba(58, 107, 53, 0.1)' : 'var(--surface2)',
          borderRadius: 'var(--r-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(18px, 5vw, 22px)',
          transition: 'all 0.3s ease'
        }} className={state === 'on' ? 'animate-pulse' : ''}>{icon}</div>
        <div style={{ minWidth: 0 }}>
          <div className="text-body" style={{ fontWeight: 600, fontSize: 'clamp(13px, 3vw, 14px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div className="text-body-sm" style={{ color: 'var(--muted)', fontSize: 'clamp(11px, 2.5vw, 12px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 16px)', flexShrink: 0 }}>
        <button 
          onClick={() => handleModeChange(mode === 'auto' ? 'manual' : 'auto')}
          className="badge" 
          style={{ 
            cursor: 'pointer', 
            background: mode === 'auto' ? 'var(--info)' : 'var(--surface2)',
            color: mode === 'auto' ? 'white' : 'var(--muted)',
            border: 'none',
            fontSize: '9px',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          {mode.toUpperCase()}
        </button>
        
        <button 
          onClick={handleToggle}
          className={`toggle ${state === 'on' ? 'on' : 'off'}`}
          aria-label={`Toggle ${name}`}
          style={{ border: 'none', appearance: 'none', padding: 0 }}
        >
          <div className="toggle-knob" />
        </button>
      </div>

      <style>{`
        .toggle {
          width: 42px;
          height: 22px;
          border-radius: 11px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .toggle.on { background: var(--primary); }
        .toggle.off { background: var(--surface3); }
        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .toggle.on .toggle-knob { left: 23px; }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
