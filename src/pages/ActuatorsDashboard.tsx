import React from 'react';
import { useStore } from '../store/useStore';
import { useEnergyTracker } from '../hooks/useEnergyTracker';
import { ActuatorControlCard } from '../components/ActuatorControlCard';
import { ActuatorActivityChart } from '../components/ActuatorActivityChart';
import { Droplets, Lightbulb, Zap, Info, RotateCcw } from 'lucide-react';

export const ActuatorsDashboard: React.FC = () => {
  // Start energy tracking
  useEnergyTracker();

  const { actuators, resetEnergy } = useStore();

  const totalEnergy = Object.values(actuators).reduce((sum, a) => sum + a.energy, 0);
  const totalPower = Object.values(actuators).reduce((sum, a) => sum + a.power, 0);

  return (
    <div className="page">
      <header className="page-header" style={{ marginBottom: '24px' }}>
        <h1 className="text-display-lg" style={{ margin: 0, fontSize: 'clamp(24px, 5vw, 36px)' }}>Actuators Dashboard</h1>
        <p className="text-body-lg" style={{ color: 'var(--muted)', marginTop: '8px', fontSize: 'clamp(14px, 3vw, 16px)' }}>
          Real-time monitoring and control for system pumps and lights.
        </p>
      </header>

      <div className="actuator-layout-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: 'var(--section-gap)' 
      }}>
        {/* Left Column: Chart and Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          <ActuatorActivityChart />
          
          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <ActuatorControlCard 
              id="pump1" 
              name="Main Pump" 
              state={actuators.pump1} 
              icon={<Droplets size={24} />} 
            />
            <ActuatorControlCard 
              id="pump2" 
              name="Secondary Pump" 
              state={actuators.pump2} 
              icon={<Droplets size={24} />} 
            />
            <ActuatorControlCard 
              id="diluted_pump" 
              name="Nutrient Pump" 
              state={actuators.diluted_pump} 
              icon={<Droplets size={24} />} 
            />
            <ActuatorControlCard 
              id="led" 
              name="Growth LED" 
              state={actuators.led} 
              icon={<Lightbulb size={24} />} 
            />
          </div>
        </div>

        {/* Right Column: Energy Summary & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          <div className="card" style={{ background: 'var(--surface2)', border: '1px solid var(--primary)' }}>
            <h3 className="section-label" style={{ color: 'var(--primary)' }}>System Energy Summary</h3>
            
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={16} color="var(--primary)" />
                  <span className="text-body-sm" style={{ fontWeight: 600 }}>Total Current Draw</span>
                </div>
                <div style={{ fontSize: '32px', fontFamily: 'var(--ff-display)', fontWeight: 700 }}>
                  {totalPower} <span style={{ fontSize: '16px', color: 'var(--muted)' }}>W</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <RotateCcw size={16} color="var(--primary)" />
                  <span className="text-body-sm" style={{ fontWeight: 600 }}>Total Accumulated Energy</span>
                </div>
                <div style={{ fontSize: '32px', fontFamily: 'var(--ff-display)', fontWeight: 700 }}>
                  {totalEnergy.toFixed(4)} <span style={{ fontSize: '16px', color: 'var(--muted)' }}>Wh</span>
                </div>
              </div>

              <button 
                className="btn-secondary" 
                onClick={() => resetEnergy()}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <RotateCcw size={16} />
                Reset All Counters
              </button>
            </div>
          </div>

          <div className="card" style={{ background: 'rgba(58, 107, 53, 0.05)', border: '1px dashed var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Info size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 className="text-display-sm" style={{ fontSize: '14px', margin: 0 }}>Calculation Method</h4>
                <p className="text-body-sm" style={{ marginTop: '8px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  Power and energy values are estimated based on actuator rated power and real-time runtime tracking. 
                  These are not direct hardware sensor measurements but high-fidelity engineering estimates.
                </p>
                <div style={{ marginTop: '12px', padding: '10px', background: 'var(--surface)', borderRadius: '8px', fontSize: '11px' }}>
                  <ul style={{ paddingLeft: '16px', margin: 0 }}>
                    <li>Pump 1/2: 5.0W</li>
                    <li>Nutrient Pump: 4.0W</li>
                    <li>Growth LED: 6.0W</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 1024px) {
          .actuator-layout-grid {
            grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) !important;
          }
        }
        .page-header {
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
};
