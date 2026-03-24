import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherWidget } from '../components/WeatherWidget';
import { useStore } from '../store/useStore';
import { SensorCard } from '../components/SensorCard';
import { ActuatorToggle } from '../components/ActuatorToggle';
import { useWebSocket } from '../hooks/useWebSocket';
import { Info } from 'lucide-react';
import { MultiParamChart } from '../components/MultiParamChart';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { sendCommand } = useWebSocket();
  const latestReading = useStore((s) => s.latestReading);
  const readings = useStore((s) => s.readings);
  const actuators = useStore((s) => s.actuators);
  const activeProfile = useStore((s) => s.activeProfile);
  const setpoints = useStore((s) => s.setpoints);
  const profileConfirmationPending = useStore((s) => s.profileConfirmationPending);
  const setActiveProfile = useStore((s) => s.setActiveProfile);
  const wsConnected = useStore((s) => s.wsConnected);

  // Filtering and formatting for multi-curve chart
  const filteredReadings = readings.filter(r => r.profile === activeProfile);

  const getHistory = (key: 'ph' | 'tds' | 'light' | 'temp') => {
    const history = filteredReadings.slice(0, 20).map(r => r[key]).reverse();
    return history.length > 0 ? history : [0];
  };

  const getStatus = (val: number, min: number, max: number) => {
    if (!wsConnected) return 'Offline';
    if (val < min) return 'Low';
    if (val > max) return 'High';
    return 'Normal';
  };

  const ph_min = setpoints?.ph_min || 7.0;
  const ph_max = setpoints?.ph_max || 7.5;
  const tds_min = setpoints?.tds_min || 300;
  const tds_max = setpoints?.tds_max || 700;
  const lux_min = setpoints?.lux_min || 13500;
  const lux_max = setpoints?.lux_max || 16500;

  return (
    <div className="page">
      <header style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="stack-on-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <h1 className="text-display-lg" style={{ marginBottom: '12px', lineHeight: 1.1 }}>
              Good afternoon,<br/><span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Negm.</span>
            </h1>
            <div className="text-body" style={{ color: 'var(--muted)', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                System is running normally · {readings.length} readings recorded
                {profileConfirmationPending && (
                  <span className="badge badge-neutral" style={{ fontSize: '10px', animation: 'pulse 1.5s infinite' }}>SYNCING...</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: wsConnected ? 'var(--success)' : 'var(--danger)', boxShadow: wsConnected ? '0 0 8px var(--success-bg)' : 'none' }} />
                  Server {wsConnected ? 'Live' : 'Offline'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: useStore.getState().espConnected ? 'var(--success)' : 'var(--muted)', boxShadow: useStore.getState().espConnected ? '0 0 8px var(--success-bg)' : 'none' }} />
                  Hardware {useStore.getState().espConnected ? 'Connected' : 'Search...'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="weather-container" style={{ width: '100%', maxWidth: '300px' }}>
            <WeatherWidget />
          </div>
        </div>

        {/* Global System Switcher - Top Level Navigation */}
        <div className="profile-switcher-container">
          <div className="profile-switcher-scroll">
            {[
              { id: 'main', label: 'MAIN ECOSYSTEM', sub: 'Mullet + Lettuce', icon: '🌿' },
              { id: 'db1', label: 'DB1 CLUSTER', sub: 'Mabroka + Strawberry', icon: '🍓' },
              { id: 'db2', label: 'DB2 CLUSTER', sub: 'Tilapia + Basil', icon: '🍃' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProfile(p.id as any);
                  sendCommand('set_profile', { profile: p.id });
                }}
                className={`profile-btn ${activeProfile === p.id ? 'active' : ''}`}
              >
                <div className="profile-icon">{p.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <div className="text-label" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>{p.label}</div>
                  <div className="text-body" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{p.sub}</div>
                </div>
                {activeProfile === p.id && <div className="profile-active-bar" />}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Sensor Strip */}
      <div className="grid-auto" style={{ marginBottom: '40px' }}>
        <SensorCard 
          label="pH Level" 
          value={latestReading?.ph || ph_min.toFixed(1)} 
          unit="pH" 
          min={ph_min} max={ph_max}
          history={getHistory('ph')}
          color="var(--primary)"
          status={getStatus(latestReading?.ph || ph_min, ph_min, ph_max)}
        />
        <SensorCard 
          label="TDS" 
          value={latestReading?.tds || tds_min} 
          unit="ppm" 
          min={tds_min} max={tds_max}
          history={getHistory('tds')}
          color="var(--secondary)"
          status={getStatus(latestReading?.tds || tds_min, tds_min, tds_max)}
        />
        <SensorCard 
          label="Light Intensity" 
          value={latestReading?.light || lux_min} 
          unit="lux" 
          min={lux_min} max={lux_max}
          history={getHistory('light')}
          color="var(--warning)"
          status={getStatus(latestReading?.light || lux_min, lux_min, lux_max)}
        />
        <SensorCard 
          label="Temperature (Plant)" 
          value={latestReading?.temp || '24.3'} 
          unit="°C" 
          history={getHistory('temp')}
          color="var(--accent)"
          status="Normal"
        />
      </div>

      <div className="grid-2">
        {/* Left: Charts and Summaries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <MultiParamChart 
            title={<em>All parameters, live.</em>} 
            subtitle={`AquaLoop · ${setpoints?.name || activeProfile.charAt(0).toUpperCase() + activeProfile.slice(1)} profile`}
            defaultParams={['ph', 'tds', 'light', 'temp']} 
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card card-hover">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                     <div style={{ width: '48px', height: '48px', borderRadius: 'var(--r-md)', background: 'rgba(58,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🐟</div>
                     <div>
                        <div className="text-display-sm">Fish Tank</div>
                        <div className="text-body-sm" style={{ color: 'var(--muted)' }}>{setpoints?.fish || 'Unknown Fish'} · ~10L</div>
                     </div>
                  </div>
                  <button className="btn-secondary" onClick={() => navigate('/fish')} style={{ padding: '6px 16px', fontSize: '12px' }}>View page →</button>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {[
                    ['pH Value', latestReading?.ph || ph_min.toFixed(1)],
                    ['TDS Level', `${latestReading?.tds || tds_min} ppm`]
                  ].map(([l, v]) => (
                    <div key={l} style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 'var(--r-md)' }}>
                      <div className="text-label" style={{ marginBottom: '4px', fontSize: '9px' }}>{l}</div>
                      <div className="text-display-sm" style={{ fontSize: '18px' }}>{v}</div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="card card-hover">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                     <div style={{ width: '48px', height: '48px', borderRadius: 'var(--r-md)', background: 'rgba(200,135,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🌿</div>
                     <div>
                        <div className="text-display-sm">Plant Tank</div>
                        <div className="text-body-sm" style={{ color: 'var(--muted)' }}>{setpoints?.plant || 'Unknown Plant'} · DWC 1m×0.5m</div>
                     </div>
                  </div>
                  <button className="btn-secondary" onClick={() => navigate('/plant')} style={{ padding: '6px 16px', fontSize: '12px' }}>View page →</button>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    ['Light Lux', latestReading?.light || lux_min],
                    ['Temp', `${latestReading?.temp || '24.3'}°C`],
                    ['LED State', actuators.led.state.toUpperCase()]
                  ].map(([l, v]) => (
                    <div key={l} style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 'var(--r-md)' }}>
                      <div className="text-label" style={{ marginBottom: '4px', fontSize: '9px' }}>{l}</div>
                      <div className="text-display-sm" style={{ fontSize: '18px' }}>{v}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Actuators & Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card glass card-hover" style={{ padding: '32px' }}>
            <div className="section-label" style={{ marginBottom: '24px' }}>Actuator Control</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ActuatorToggle id="pump1" name="Pump 1 · Filtration" subtitle="Fish → Biofilter" state={actuators.pump1.state} mode={actuators.pump1.mode} icon="💧" />
              <ActuatorToggle id="pump2" name="Pump 2 · Nutrient" subtitle="Biofilter → Plant" state={actuators.pump2.state} mode={actuators.pump2.mode} icon="💧" />
              <ActuatorToggle id="diluted_pump" name="Diluted Pump" subtitle="Control tank injection" state={actuators.diluted_pump.state} mode={actuators.diluted_pump.mode} icon="🔧" />
              <ActuatorToggle id="led" name="LED Grow Light" subtitle="Plant tank · BH1750" state={actuators.led.state} mode={actuators.led.mode} icon="💡" />
            </div>
          </div>
          
          <div className="card glass" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(58,107,53,0.05), rgba(200,135,58,0.05))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Info size={20} />
                </div>
                <h3 className="text-display-sm" style={{ margin: 0 }}>System Health</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <div className="text-label" style={{ marginBottom: '8px' }}>AMMONIA CYCLE EFFICIENCY</div>
                  <div style={{ height: '8px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '94%', height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <span className="text-body-sm" style={{ color: 'var(--muted)' }}>Optimized</span>
                    <span className="text-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>94%</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                  <div className="text-label" style={{ marginBottom: '16px' }}>MAINTENANCE TOOLS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button className="btn-secondary" style={{ padding: '12px', fontSize: '12px', background: 'var(--surface)' }}>Reset System</button>
                    <button className="btn-secondary" style={{ padding: '12px', fontSize: '12px', background: 'var(--surface)' }}>Export Logs</button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-switcher-container {
          overflow: hidden;
          margin: 0 calc(-1 * var(--page-pad));
        }
        .profile-switcher-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 8px var(--page-pad) 20px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .profile-switcher-scroll::-webkit-scrollbar { display: none; }
        
        .profile-btn {
          flex: 0 0 auto;
          min-width: 240px;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          border-radius: var(--r-md);
          border: 1px solid var(--border);
          background: var(--surface);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          scroll-snap-align: start;
        }
        .profile-btn.active {
          border: 2px solid var(--primary);
          box-shadow: 0 8px 24px rgba(58, 107, 53, 0.1);
        }
        .profile-icon {
          font-size: 24px;
          transition: transform 0.3s;
        }
        .profile-btn.active .profile-icon { transform: scale(1.1); }
        .profile-btn .text-label { color: var(--muted); }
        .profile-btn.active .text-label { color: var(--primary); }
        .profile-active-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 4px; background: var(--primary);
        }

        @media (max-width: 768px) {
          .profile-btn {
            min-width: 200px;
            padding: 12px 16px;
          }
          .weather-container {
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};
