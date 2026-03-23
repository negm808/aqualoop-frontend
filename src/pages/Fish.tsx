import React from 'react';
import { useStore } from '../store/useStore';
import { Fish as FishIcon } from 'lucide-react';
import { BiomassCalculator } from '../components/BiomassCalculator';
import { MultiParamChart } from '../components/MultiParamChart';
import { ActuatorToggle } from '../components/ActuatorToggle';

export const Fish: React.FC = () => {
  const activeProfile = useStore((s) => s.activeProfile);
  const setpoints = useStore((s) => s.setpoints);
  const actuators = useStore((s) => s.actuators);

  return (
    <div className="page">
      <header style={{ marginBottom: '40px' }}>
         <div className="badge badge-ok" style={{ marginBottom: '16px' }}>COMPONENT: TANK 1 (SOURCE)</div>
         <h1 className="text-display-lg">Fish Tank Environment</h1>
         <p className="text-body" style={{ color: 'var(--muted)' }}>Monitoring {setpoints?.fish || 'Grey Mullet'} health and organic waste production in the {setpoints?.name || activeProfile.toUpperCase()} aquatic habitat.</p>
      </header>

      <div className="grid-2" style={{ marginBottom: '40px' }}>
         <div style={{ minWidth: 0 }}>
            <MultiParamChart 
              title={<em>Water Chemistry, live.</em>} 
              subtitle={`AquaLoop · ${activeProfile.charAt(0).toUpperCase() + activeProfile.slice(1)} profile · Main Tank`}
              defaultParams={['ph', 'tds']} 
              availableParams={['ph', 'tds']}
            />
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <FishIcon size={20} color="var(--primary)" />
                  <div className="text-display-sm" style={{ fontSize: '18px' }}>{setpoints?.fish || 'Grey Mullet'}</div>
               </div>
               <p className="text-body-sm" style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                  Natural hardy fish species. Main role is organic waste production which initiates the nitrogen cycle.
               </p>
               <div style={{ marginTop: '20px', padding: '16px', background: 'var(--surface2)', borderRadius: 'var(--r-md)' }}>
                  <div className="text-label" style={{ marginBottom: '4px' }}>AMMONIA STATUS</div>
                  <div className="text-body" style={{ color: 'var(--success)', fontWeight: 600 }}>Optimal Process</div>
               </div>
            </div>

            <div className="card glass">
               <div className="section-label" style={{ marginBottom: '20px' }}>Filtration Control</div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <ActuatorToggle 
                    id="pump1" 
                    name="Pump 1 (Main)" 
                    subtitle="Fish → Biofilter Flow" 
                    state={actuators.pump1.state} 
                    mode={actuators.pump1.mode} 
                    icon="💧" 
                  />
                  <ActuatorToggle 
                    id="diluted_pump" 
                    name="Buffer Pump" 
                    subtitle="System Balance" 
                    state={actuators.diluted_pump.state} 
                    mode={actuators.diluted_pump.mode} 
                    icon="🔧" 
                  />
               </div>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        <div className="card">
           <div className="section-label">Biological Context</div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
              <div>
                 <h4 className="text-display-sm" style={{ fontSize: '16px', marginBottom: '8px' }}>Waste Production</h4>
                 <p className="text-body-sm" style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                    Fish release ammonia through gills and waste. This ammonia is the primary fuel source for the entire aquaponics system.
                 </p>
              </div>
              <div>
                 <h4 className="text-display-sm" style={{ fontSize: '16px', marginBottom: '8px' }}>pH Sensitivity</h4>
                 <p className="text-body-sm" style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                    {setpoints?.fish || 'Fish'} prefer pH {setpoints?.ph_min || '7.0'}–{setpoints?.ph_max || '7.5'}. Fluctuations outside this range can stress the fish and inhibit bacterial nitrification.
                 </p>
              </div>
           </div>
        </div>
        <BiomassCalculator />
      </div>
    </div>
  );
};
