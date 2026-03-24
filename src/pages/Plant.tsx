import React from 'react';
import { useStore } from '../store/useStore';
import { Sun, Zap } from 'lucide-react';
import { HarvestCountdown } from '../components/HarvestCountdown';
import { MultiParamChart } from '../components/MultiParamChart';
import { ActuatorToggle } from '../components/ActuatorToggle';

export const Plant: React.FC = () => {
  const latestReading = useStore((s) => s.latestReading);
  const activeProfile = useStore((s) => s.activeProfile);
  const setpoints = useStore((s) => s.setpoints);
  const actuators = useStore((s) => s.actuators);

  return (
    <div className="page">
      <header style={{ marginBottom: '40px' }}>
         <div className="badge badge-ok" style={{ marginBottom: '16px', background: 'var(--secondary)', color: 'white', border: 'none' }}>COMPONENT: TANK 3 (DWC)</div>
         <h1 className="text-display-lg">Plant Tank Environment</h1>
         <p className="text-body" style={{ color: 'var(--muted)' }}>Managing {setpoints?.plant || 'Lettuce'} growth in Deep Water Culture (DWC) with floating raft system.</p>
      </header>

      <div className="grid-2" style={{ marginBottom: '40px' }}>
         <div style={{ minWidth: 0 }}>
            <MultiParamChart 
              title={<em>Environment Trends, live.</em>} 
              subtitle={`AquaLoop · ${activeProfile.charAt(0).toUpperCase() + activeProfile.slice(1)} profile · DWC Tank`}
              defaultParams={['light', 'temp']} 
              availableParams={['light', 'temp']}
            />
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <HarvestCountdown />
              <div className="card glass">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                   <Zap size={20} color="var(--warning)" />
                   <div className="text-display-sm" style={{ fontSize: '18px' }}>DWC Actuators</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <ActuatorToggle 
                    id="pump2" 
                    name="Pump 2 (Nutrient)" 
                    subtitle="Biofilter → Plant Rafts" 
                    state={actuators.pump2.state} 
                    mode={actuators.pump2.mode} 
                    icon="💧" 
                  />
                  <ActuatorToggle 
                    id="led" 
                    name="Grow Lights" 
                    subtitle="BH1750 Controlled" 
                    state={actuators.led.state} 
                    mode={actuators.led.mode} 
                    icon="💡" 
                  />
                </div>
              </div>

            <div className="card">
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <Sun size={20} color="var(--warning)" />
                  <div className="text-display-sm" style={{ fontSize: '18px' }}>BH1750 Sensor</div>
               </div>
               <div className="text-display-md">{latestReading?.light || setpoints?.lux_min || '15200'} <span style={{ fontSize: '14px' }}>lux</span></div>
               <div style={{ marginTop: '20px', padding: '16px', background: 'var(--surface2)', borderRadius: 'var(--r-md)' }}>
                  <div className="text-label" style={{ marginBottom: '4px' }}>LED STATUS</div>
                  <div className="text-body" style={{ color: actuators.led.state === 'on' ? 'var(--warning)' : 'var(--muted)', fontWeight: 600 }}>
                     {actuators.led.state.toUpperCase()} · {actuators.led.mode.toUpperCase()}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="card">
         <div className="section-label" style={{ color: 'var(--secondary)', marginBottom: '24px' }}>DWC Technical Specs</div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div>
               <h4 className="text-display-sm" style={{ fontSize: '16px', marginBottom: '12px' }}>DWC Layout</h4>
               <p className="text-body-sm" style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                  A 1m x 0.5m floating polystyrene raft system. Plants grow on top while roots soak in nutrient-rich water filtered from the fish tank.
               </p>
            </div>
            <div>
               <h4 className="text-display-sm" style={{ fontSize: '16px', marginBottom: '12px' }}>Nutrient Uptake</h4>
               <p className="text-body-sm" style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                  Plants act as the system's biofilter, absorbing nitrates (NO₃) and cleaning the water before it cycles back to the fish habitat.
               </p>
            </div>
            <div>
               <h4 className="text-display-sm" style={{ fontSize: '16px', marginBottom: '12px' }}>Lighting Cycle</h4>
               <p className="text-body-sm" style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                  Managed by the BH1750 sensor. Targeted intensity is {setpoints?.lux_min}–{setpoints?.lux_max} lux for optimized {setpoints?.plant || 'plant'} photosynthesis.
               </p>
            </div>
         </div>
         <div className="stack-on-mobile" style={{ marginTop: '32px', padding: '24px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--r-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div>
               <h3 className="text-display-sm" style={{ margin: 0 }}>Biological Cleaning Log</h3>
               <p className="text-body-sm" style={{ opacity: 0.9, marginBottom: 0 }}>Plants have filtered approximately 120L of water today.</p>
            </div>
            <div className="text-display-md" style={{ margin: 0, whiteSpace: 'nowrap' }}>4.2 <span style={{ fontSize: '14px' }}>mg/L O₂</span></div>
         </div>
      </div>
    </div>
  );
};
