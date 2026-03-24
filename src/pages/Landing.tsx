import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SystemSchematic } from '../components/SystemSchematic';
import { Cpu, Zap, Activity, Brain, Shield, Database, Droplets, Sun } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Section A — Hero */}
      <section style={{
        minHeight: '88vh',
        padding: 'var(--section-gap) var(--page-pad)',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        alignItems: 'center',
        position: 'relative',
        maxWidth: '1700px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          position: 'absolute', top: '10%', right: '5%', width: 'clamp(200px, 40vw, 400px)', height: 'clamp(200px, 40vw, 400px)',
          background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0
        }} />
        
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-ok" style={{ marginBottom: '24px', padding: '6px 16px', margin: '0 auto 24px', width: 'fit-content' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', marginRight: '8px' }} />
            G11 Capstone Project · STEM School, Tanta
          </div>
          
          <h1 className="text-display-xl" style={{ marginBottom: '32px' }}>
            Where <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>fish</span> feed the <span style={{ color: 'var(--secondary)' }}>plants</span> that clean the water.
          </h1>

          <p className="text-body-lg" style={{ color: 'var(--muted)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            AquaLoop is a professional IoT-based closed-loop aquaponics monitoring and control system designed to automate the management of a small-scale ecosystem.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '48px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>View Live Dashboard →</button>
            <button className="btn-secondary" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>System Architecture ↓</button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            paddingTop: '32px', 
            borderTop: '1px solid var(--border)',
            gap: '24px'
          }}>
            {[
              ['4', 'Monitored Parameters'],
              ['5s', 'Sensor Cycle'],
              ['3', 'Ecosystem Profiles'],
              ['4', 'Automated Actuators']
            ].map(([val, label]) => (
              <div key={label}>
                <div className="text-display-sm text-number" style={{ color: 'var(--text)' }}>{val}</div>
                <div className="text-label" style={{ color: 'var(--muted)', fontSize: '9px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-float hero-schematic" style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
           <SystemSchematic />
        </div>
      </section>

      {/* About AquaLoop */}
      <section style={{ padding: '60px 5%', background: 'var(--surface)' }}>
         <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="section-label" style={{ color: 'var(--primary)' }}>ABOUT AQUALOOP</div>
            <h2 className="text-display-lg" style={{ marginBottom: '32px' }}>A self-sustaining <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>biological foundation.</span></h2>
            <div className="text-body-lg" style={{ lineHeight: '1.8', color: 'var(--text)' }}>
               <p style={{ marginBottom: '24px' }}>
                  AquaLoop integrates fish farming and hydroponic plant cultivation into a single sustainable loop. 
                  In this system, fish produce waste containing ammonia. Beneficial bacteria then convert this ammonia into 
                  nitrates through biological filtration. Plants absorb these nutrients as fertilizer, naturally purifying 
                  the water before it returns to the fish tank.
               </p>
               <p>
                  This creates a self-sustaining ecosystem where <strong>fish feed plants and plants clean the water</strong>, 
                  reducing waste and improving sustainability. The AquaLoop platform allows users to monitor these water conditions, 
                  control system components, and manage configurations in real time.
               </p>
            </div>
         </div>
      </section>

      {/* System Architecture */}
      <section id="system-architecture" style={{ padding: '60px 5%', background: 'var(--bg)' }}>
         <div className="section-label">THE INFRASTRUCTURE</div>
         <h2 className="text-display-lg" style={{ marginBottom: '48px' }}>Architecture & <span style={{ fontStyle: 'italic', color: 'var(--secondary)' }}>Components</span></h2>
         
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { t: 'Fish Tank', d: 'The main aquatic environment where Grey Mullet live and produce organic waste.', i: '🐟', c: 'Main Tank' },
              { t: 'Biofilter Tank', d: 'Contains bio-balls for beneficial bacteria that convert toxic ammonia into nitrates (NH₃ → NO₂ → NO₃).', i: '🧬', c: 'Nitrification' },
              { t: 'Plant Tank', d: 'Deep Water Culture (DWC) hydroponic system (1m x 0.5m) with floating polystyrene rafts.', i: '🌿', c: 'Nutrient Absorption' },
              { t: 'Control Tank', d: '5-liter correction tank used for automated pH or TDS adjustment when needed.', i: '🔧', c: 'Water Correction' }
            ].map((comp, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                 <div style={{ fontSize: '40px', background: 'var(--surface2)', padding: '20px', borderRadius: 'var(--r-md)' }}>{comp.i}</div>
                 <div>
                    <div className="text-label" style={{ color: 'var(--primary)', marginBottom: '4px' }}>{comp.c}</div>
                    <h3 className="text-display-sm" style={{ marginBottom: '8px' }}>{comp.t}</h3>
                    <p className="text-body-sm" style={{ color: 'var(--muted)' }}>{comp.d}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Circulation Cycle */}
      <section id="how-it-works" className="section-responsive" style={{ background: 'var(--surface)' }}>
         <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
               <div className="section-label" style={{ color: 'var(--primary)' }}>🔄 CIRCULATION</div>
               <h2 className="text-display-lg" style={{ marginBottom: '24px' }}>The Water Cycle</h2>
               <div style={{ padding: '24px', background: 'var(--surface2)', borderRadius: 'var(--r-md)', marginBottom: '32px' }}>
                  <div className="text-mono" style={{ fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                     Fish Tank → P1 → Biofilter → P2 → Plant Tank → Gravity → Fish Tank
                  </div>
               </div>
               <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Filter fish waste efficiently', 'Deliver nutrients directly to plant roots', 'Maintain stable environmental conditions'].map(li => (
                    <li key={li} style={{ display: 'flex', gap: '12px', alignItems: 'center' }} className="text-body">
                       <span style={{ color: 'var(--success)' }}>✓</span> {li}
                    </li>
                  ))}
               </ul>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
               <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
                  <div className="text-display-sm" style={{ marginBottom: '12px' }}>Monitoring</div>
                  <p className="text-body-sm" style={{ opacity: 0.8 }}>Continuous tracking of pH, TDS, Light, and Water Temperature for ecosystem stability.</p>
               </div>
               <div className="card" style={{ background: 'var(--secondary)', color: 'white' }}>
                  <div className="text-display-sm" style={{ marginBottom: '12px' }}>Automation</div>
                  <p className="text-body-sm" style={{ opacity: 0.8 }}>Powered by ESP32 via WebSocket for real-time water correction and lighting control.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Ecosystem Profiles */}
      <section style={{ padding: '80px 5%', background: 'var(--bg)' }}>
         <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-label">CONFIGURATIONS</div>
            <h2 className="text-display-lg">Ecosystem <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Profiles</span></h2>
         </div>
         
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            {[
              { id: 'Main', fish: 'Grey Mullet', plant: 'Lettuce', ph: '7.0–7.5', tds: '300–700', lux: '13.5k–16.5k', color: 'var(--primary)' },
              { id: 'DB1', fish: 'Mabroka', plant: 'Strawberry', ph: '6.0–7.0', tds: '700–1200', lux: '16k–20k', color: 'var(--secondary)' },
              { id: 'DB2', fish: 'Tilapia', plant: 'Basil', ph: '6.5–7.5', tds: '600–1000', lux: '14k–18k', color: 'var(--accent)' }
            ].map(profile => (
              <div key={profile.id} className="card" style={{ borderTop: `4px solid ${profile.color}`, padding: '40px' }}>
                 <div className="text-label" style={{ marginBottom: '8px' }}>{profile.id} SYSTEM</div>
                 <h3 className="text-display-md" style={{ marginBottom: '24px' }}>{profile.fish} + {profile.plant}</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                       <span className="text-body-sm" style={{ color: 'var(--muted)' }}>Target pH</span>
                       <span className="text-mono-sm">{profile.ph}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                       <span className="text-body-sm" style={{ color: 'var(--muted)' }}>Target TDS</span>
                       <span className="text-mono-sm">{profile.tds} ppm</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span className="text-body-sm" style={{ color: 'var(--muted)' }}>Target Lux</span>
                       <span className="text-mono-sm">{profile.lux} lux</span>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* NEW: System Intelligence (AI Section) */}
      <section className="section-responsive" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%)' }}>
          <div className="grid-2" style={{ alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
            <div>
               <div className="section-label" style={{ color: 'var(--accent)' }}>🧠 COGNITIVE LAYER</div>
               <h2 className="text-display-lg" style={{ marginBottom: '32px' }}>Biological <span style={{ color: 'var(--accent)' }}>Intelligence</span> by AquaLoop AI</h2>
               <div className="text-body-lg" style={{ color: 'var(--muted)', marginBottom: '40px' }}>
                  Our proprietary AI system doesn't just monitor data—it understands biology. By analyzing trends in pH, TDS, and lighting, it predicts ecosystem events before they happen.
               </div>
               
               <div className="grid-auto">
                  {[
                    { i: <Brain size={24} />, t: 'Predictive Analytics', d: 'Predicts nitrate spikes and pH drifts 12 hours in advance.' },
                    { i: <Activity size={24} />, t: 'Trend Identification', d: 'Recognizes patterns in fish metabolism and plant nutrient uptake.' },
                    { i: <Shield size={24} />, t: 'Safety Interlocks', d: 'Automated emergency protocols for critical parameter failures.' },
                    { i: <Zap size={24} />, t: 'Live Advising', d: 'Natural language interface for Capstone researchers and students.' }
                  ].map((feat, idx) => (
                    <div key={idx} style={{ padding: '24px', background: 'var(--surface2)', borderRadius: 'var(--r-md)', borderLeft: '3px solid var(--accent)' }}>
                      <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>{feat.i}</div>
                      <h4 className="text-display-sm" style={{ fontSize: '16px', marginBottom: '8px' }}>{feat.t}</h4>
                      <p className="text-body-sm" style={{ color: 'var(--muted)' }}>{feat.d}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div style={{ position: 'relative', marginTop: '40px' }}>
               <div style={{ padding: 'clamp(20px, 5vw, 40px)', background: 'var(--surface-dark)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', position: 'relative', zIndex: 1, boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>AI</div>
                    <div className="text-display-sm" style={{ fontSize: '16px' }}>AquaLoop Assistant</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: 'var(--r-md)', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                     <div className="text-label" style={{ color: 'var(--accent)', marginBottom: '4px', fontSize: '10px' }}>PREDICTION</div>
                     <div className="text-body-sm" style={{ color: 'white' }}>"I've detected a slow rise in TDS. This indicates evaporation in the DWC bed. I recommend a 5L supply top-up."</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--r-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div className="text-label" style={{ color: 'var(--success)', marginBottom: '4px', fontSize: '10px' }}>STATUS</div>
                     <div className="text-body-sm" style={{ color: 'var(--muted)' }}>Biofilter efficiency at 94%. Optimal nitrification confirmed.</div>
                  </div>
               </div>
               <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100%', height: '100%', background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.1, zIndex: 0 }} />
            </div>
          </div>
      </section>

      {/* NEW: Hardware Deep Dive */}
      <section style={{ padding: '80px 5%', background: 'var(--surface)' }}>
         <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-label">THE HARDWARE</div>
            <h2 className="text-display-lg">Industrial Grade <span style={{ color: 'var(--primary)' }}>Components</span></h2>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', maxWidth: '1400px', margin: '0 auto' }}>
            {[
              { i: <Cpu />, t: 'ESP32 Dual-Core', d: 'The central processor handling 5s sensor cycles and WS telemetry.', c: 'Processing' },
              { i: <Database />, t: 'Zustand State', d: 'High-performance reactive store for lag-free dashboard updates.', c: 'Memory' },
              { i: <Droplets />, t: 'Liquid Sensors', d: 'Analog ADC-driven pH and TDS monitoring with linear calibration.', c: 'Sensing' },
              { i: <Sun />, t: 'BH1750 Digital', d: 'I2C intensity monitoring for optimized Lettuce photosynthesis.', c: 'Light' }
            ].map((hw, idx) => (
              <div key={idx} style={{ textAlign: 'center', padding: '32px', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', background: 'var(--bg)' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--surface2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
                  {hw.i}
                </div>
                <div className="text-label" style={{ color: 'var(--muted)', marginBottom: '8px', fontSize: '10px' }}>{hw.c}</div>
                <h4 className="text-display-sm" style={{ fontSize: '18px', marginBottom: '12px' }}>{hw.t}</h4>
                <p className="text-body-sm" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{hw.d}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '60px 5%', textAlign: 'center', background: 'var(--primary)', color: 'white' }}>
         <h2 className="text-display-lg" style={{ marginBottom: '24px' }}>Ready to monitor your ecosystem?</h2>
         <p className="text-body-lg" style={{ marginBottom: '40px', opacity: 0.9 }}>Navigate to the dashboard to see live sensor data and automated control states.</p>
         <button className="btn-secondary" style={{ background: 'white', color: 'var(--primary)', border: 'none' }} onClick={() => navigate('/dashboard')}>
            Open Dashboard →
         </button>
      </section>

      {/* STEM Storyboard */}
      <section style={{ padding: '60px 5%', background: 'var(--surface2)', borderTop: '1px solid var(--border)' }}>
         <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div className="section-label">STEM INNOVATION</div>
            <h2 className="text-display-lg">The Project <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Storyboard</span></h2>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
            {[
              { year: 'Phase 1', title: 'Conceptualization', detail: 'Design of the closed-loop system and selection of biological components (Grey Mullet & Lettuce).' },
              { year: 'Phase 2', title: 'Hardware Assembly', detail: 'Construction of the 1m x 0.5m DWC plant bed and integration of ESP32 sensor suite.' },
              { year: 'Phase 3', title: 'Cloud & AI Sync', detail: 'Final software rollout including real-time WebSocket dashboard and AI biological assistant.' }
            ].map((step, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div style={{ height: '2px', background: 'var(--border2)', position: 'absolute', top: '15px', left: idx === 0 ? '50%' : 0, right: idx === 2 ? '50%' : 0, zIndex: 0 }} />
                <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '50%', border: '6px solid var(--surface)', margin: '0 auto 24px', position: 'relative', zIndex: 1 }} />
                <div style={{ textAlign: 'center' }}>
                  <div className="text-label" style={{ color: 'var(--primary)', marginBottom: '8px' }}>{step.year}</div>
                  <h3 className="text-display-sm" style={{ marginBottom: '16px' }}>{step.title}</h3>
                  <p className="text-body-sm" style={{ color: 'var(--muted)' }}>{step.detail}</p>
                </div>
              </div>
            ))}
         </div>

         <div className="card glass" style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
               <div style={{ width: '120px', height: '120px', background: 'var(--surface3)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🏢</div>
               <div className="text-display-sm">STEM School</div>
               <div className="text-label" style={{ color: 'var(--muted)' }}>Tanta, Egypt</div>
            </div>
            <div>
               <h3 className="text-display-sm" style={{ marginBottom: '16px' }}>Meet the Engineers</h3>
               <p className="text-body" style={{ color: 'var(--muted)', marginBottom: '24px' }}>
                  Developed by Grade 11 STEM students as a Semester 2 Capstone project. 
                  Focused on sustainable urban farming and IoT environmental management.
               </p>
               <div style={{ display: 'flex', gap: '8px' }}>
                  {['Research', 'Hardware', 'Software', 'Biology'].map(tag => (
                    <span key={tag} className="badge badge-neutral">{tag}</span>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 5%', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="text-display-sm" style={{ fontSize: '18px' }}>Aqua<span style={{ color: 'var(--primary)' }}>Loop</span></div>
        <div className="text-body-sm" style={{ color: 'var(--muted)' }}>G11 Capstone · STEM School Tanta · 2025</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['Aquaponics', 'IoT', 'React'].map(tag => (
            <div key={tag} className="badge badge-neutral">{tag}</div>
          ))}
        </div>
      </footer>
      <style>{`
        @media (min-width: 1024px) {
          section {
            padding-top: 100px !important;
            padding-bottom: 100px !important;
          }
          .hero-schematic {
            grid-column: 2 / span 1 !important;
            margin-top: 0 !important;
          }
          .Landing_section__hero {
            display: grid !important;
            grid-template-columns: 1.2fr 0.8fr !important;
            text-align: left !important;
            align-items: center !important;
          }
          .Landing_section__hero div:first-child {
            margin: 0 !important;
            text-align: left !important;
          }
          .Landing_section__hero .badge {
            margin: 0 0 24px 0 !important;
          }
          .Landing_section__hero p {
            margin: 0 0 40px 0 !important;
          }
          .Landing_section__hero div:nth-child(4) {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
};
