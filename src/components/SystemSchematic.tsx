import React from 'react';

export const SystemSchematic: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '960px', 
      margin: '0 auto', 
      background: 'var(--surface)', 
      padding: 'clamp(20px, 5vw, 48px)', 
      borderRadius: 'var(--r-xl)', 
      boxShadow: '0 20px 80px rgba(0,0,0,0.06)', 
      border: '1px solid var(--border)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* Decorative background grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

      <svg viewBox="0 0 880 520" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 1 }}>
        <defs>
          {/* Gradients */}
          <linearGradient id="pipe-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A6B35" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#3A6B35" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3A6B35" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="water-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="plant-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="bio-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="supply-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="return-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C8873A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C8873A" stopOpacity="0.15" />
          </linearGradient>
          <filter id="node-shadow">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="rgba(0,0,0,0.08)" />
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ====== CONNECTION PIPES ====== */}

        {/* Supply → Fish Tank */}
        <path d="M 145 135 Q 200 135 200 170 L 200 200" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 145 135 Q 200 135 200 170 L 200 200" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* Fish Tank → Pump 1 */}
        <path d="M 310 285 L 370 285" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 310 285 L 370 285" stroke="#3A6B35" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* Pump 1 → Biofilter */}
        <path d="M 430 285 L 480 285" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 430 285 L 480 285" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* Biofilter → Pump 2 */}
        <path d="M 580 285 L 620 285" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 580 285 L 620 285" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* Pump 2 → DWC Plant Bed */}
        <path d="M 680 285 L 720 285" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 680 285 L 720 285" stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* DWC → Gravity Return */}
        <path d="M 790 355 L 790 440 Q 790 460 770 460 L 130 460 Q 110 460 110 440 L 110 180" stroke="url(#return-grad)" strokeWidth="8" strokeDasharray="12 8" strokeLinecap="round" opacity="0.5" />

        {/* ====== ANIMATED FLOW PARTICLES ====== */}
        <circle r="4" fill="#06B6D4" filter="url(#glow-blue)">
          <animateMotion path="M 145 135 Q 200 135 200 170 L 200 200" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="#3A6B35" filter="url(#glow-green)">
          <animateMotion path="M 310 285 L 370 285" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="#3A6B35" filter="url(#glow-green)">
          <animateMotion path="M 430 285 L 480 285" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="#7C3AED">
          <animateMotion path="M 580 285 L 620 285" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="#22C55E" filter="url(#glow-green)">
          <animateMotion path="M 680 285 L 720 285" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle r="3.5" fill="#C8873A" opacity="0.7">
          <animateMotion path="M 790 355 L 790 440 Q 790 460 770 460 L 130 460 Q 110 460 110 440 L 110 180" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle r="3.5" fill="#C8873A" opacity="0.5">
          <animateMotion path="M 790 355 L 790 440 Q 790 460 770 460 L 130 460 Q 110 460 110 440 L 110 180" dur="6s" begin="3s" repeatCount="indefinite" />
        </circle>

        {/* ====== TANK NODES ====== */}

        {/* --- Supply Buffer Tank --- */}
        <g transform="translate(50, 80)" filter="url(#node-shadow)">
          <rect width="120" height="100" rx="16" fill="var(--surface)" stroke="#06B6D4" strokeWidth="1.5" />
          <rect x="8" y="45" width="104" height="47" rx="8" fill="url(#supply-fill)" />
          {/* Wave animation */}
          <path d="M 8 55 Q 30 48 60 55 T 112 55 L 112 92 Q 112 100 104 100 L 16 100 Q 8 100 8 92 Z" fill="#06B6D4" fillOpacity="0.08">
            <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M 8 55 Q 30 48 60 55 T 112 55 L 112 92 Q 112 100 104 100 L 16 100 Q 8 100 8 92 Z;M 8 55 Q 30 62 60 55 T 112 55 L 112 92 Q 112 100 104 100 L 16 100 Q 8 100 8 92 Z;M 8 55 Q 30 48 60 55 T 112 55 L 112 92 Q 112 100 104 100 L 16 100 Q 8 100 8 92 Z" />
          </path>
          {/* Icon */}
          <circle cx="60" cy="28" r="16" fill="#06B6D4" fillOpacity="0.12" />
          <text x="60" y="34" textAnchor="middle" style={{ fontSize: '18px' }}>💧</text>
          {/* Label */}
          <text x="60" y="120" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}>SUPPLY</text>
        </g>

        {/* --- Fish Tank (Main Aquarium) --- */}
        <g transform="translate(170, 200)" filter="url(#node-shadow)">
          <rect width="140" height="150" rx="20" fill="var(--surface)" stroke="#7B5E3A" strokeWidth="2" />
          <rect x="8" y="65" width="124" height="77" rx="12" fill="url(#water-fill)" />
          {/* Bubbles */}
          <circle cx="40" cy="110" r="3" fill="#60A5FA" fillOpacity="0.3">
            <animate attributeName="cy" values="120;80;120" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="fillOpacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="90" cy="100" r="2" fill="#60A5FA" fillOpacity="0.2">
            <animate attributeName="cy" values="115;75;115" dur="3s" repeatCount="indefinite" />
            <animate attributeName="fillOpacity" values="0.3;0.05;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="105" r="2.5" fill="#60A5FA" fillOpacity="0.25">
            <animate attributeName="cy" values="118;70;118" dur="3.5s" repeatCount="indefinite" />
          </circle>
          {/* Fish icon */}
          <circle cx="70" cy="40" r="22" fill="#7B5E3A" fillOpacity="0.1" />
          <text x="70" y="48" textAnchor="middle" style={{ fontSize: '28px' }}>🐟</text>
          {/* Label */}
          <text x="70" y="170" textAnchor="middle" fill="var(--text)" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>FISH TANK</text>
          <text x="70" y="183" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '9px', fontWeight: 500 }}>Main Aquarium</text>
        </g>

        {/* --- Pump 1 --- */}
        <g transform="translate(400, 265)">
          <circle r="22" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" filter="url(#node-shadow)" />
          <circle r="14" fill="var(--primary)" fillOpacity="0.1" />
          {/* Spinning indicator */}
          <circle r="8" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="4" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 900 }} fill="var(--primary)">P1</text>
          <text x="0" y="-32" textAnchor="middle" fill="var(--primary)" style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px' }}>PUMP</text>
        </g>

        {/* --- Biofilter --- */}
        <g transform="translate(480, 210)" filter="url(#node-shadow)">
          <rect width="100" height="150" rx="18" fill="var(--surface)" stroke="#7C3AED" strokeWidth="2" />
          <rect x="8" y="65" width="84" height="77" rx="10" fill="url(#bio-fill)" />
          {/* Bacteria particles */}
          <circle cx="30" cy="95" r="2" fill="#A855F7" fillOpacity="0.4">
            <animate attributeName="cy" values="100;85;100" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="90" r="1.5" fill="#A855F7" fillOpacity="0.3">
            <animate attributeName="cy" values="95;80;95" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="75" cy="100" r="2" fill="#A855F7" fillOpacity="0.35">
            <animate attributeName="cy" values="105;88;105" dur="2.3s" repeatCount="indefinite" />
          </circle>
          {/* Icon */}
          <circle cx="50" cy="35" r="18" fill="#7C3AED" fillOpacity="0.1" />
          <text x="50" y="42" textAnchor="middle" style={{ fontSize: '22px' }}>🦠</text>
          {/* Label */}
          <text x="50" y="175" textAnchor="middle" fill="var(--text)" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>BIOFILTER</text>
          <text x="50" y="188" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '9px', fontWeight: 500 }}>Nitrification</text>
        </g>

        {/* --- Pump 2 --- */}
        <g transform="translate(650, 265)">
          <circle r="22" fill="var(--surface)" stroke="#22C55E" strokeWidth="2" filter="url(#node-shadow)" />
          <circle r="14" fill="#22C55E" fillOpacity="0.1" />
          <circle r="8" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="4" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 900 }} fill="#22C55E">P2</text>
          <text x="0" y="-32" textAnchor="middle" fill="#22C55E" style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px' }}>PUMP</text>
        </g>

        {/* --- Plant Bed (DWC Rafts) --- */}
        <g transform="translate(700, 200)" filter="url(#node-shadow)">
          <rect width="160" height="155" rx="16" fill="var(--surface)" stroke="#22C55E" strokeWidth="2" />
          {/* Raft lines */}
          <line x1="15" y1="70" x2="145" y2="70" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="15" y1="90" x2="145" y2="90" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.15" />
          <rect x="8" y="80" width="144" height="67" rx="8" fill="url(#plant-fill)" />
          {/* Roots hanging down from raft */}
          <line x1="40" y1="70" x2="38" y2="105" stroke="#16A34A" strokeWidth="1" strokeOpacity="0.25" />
          <line x1="60" y1="70" x2="62" y2="110" stroke="#16A34A" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="80" y1="70" x2="78" y2="108" stroke="#16A34A" strokeWidth="1" strokeOpacity="0.25" />
          <line x1="100" y1="70" x2="102" y2="105" stroke="#16A34A" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="120" y1="70" x2="118" y2="112" stroke="#16A34A" strokeWidth="1" strokeOpacity="0.25" />
          {/* Icon */}
          <circle cx="80" cy="38" r="22" fill="#22C55E" fillOpacity="0.1" />
          <text x="80" y="46" textAnchor="middle" style={{ fontSize: '28px' }}>🌿</text>
          {/* Label */}
          <text x="80" y="175" textAnchor="middle" fill="var(--text)" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>DWC RAFTS</text>
          <text x="80" y="188" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '9px', fontWeight: 500 }}>Plant Growth Bed</text>
        </g>

        {/* ====== FLOW DIRECTION ARROWS ====== */}
        <polygon points="195,198 205,198 200,208" fill="#06B6D4" fillOpacity="0.6" />
        <polygon points="365,280 365,290 375,285" fill="var(--primary)" fillOpacity="0.6" />
        <polygon points="475,280 475,290 485,285" fill="#7C3AED" fillOpacity="0.6" />
        <polygon points="615,280 615,290 625,285" fill="#7C3AED" fillOpacity="0.5" />
        <polygon points="715,280 715,290 725,285" fill="#22C55E" fillOpacity="0.6" />

        {/* Gravity Return Label */}
        <g transform="translate(440, 475)">
          <rect x="-60" y="-12" width="120" height="22" rx="11" fill="var(--surface)" stroke="#C8873A" strokeWidth="1" strokeOpacity="0.4" />
          <text x="0" y="3" textAnchor="middle" fill="#C8873A" style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px' }}>GRAVITY RETURN</text>
        </g>

        {/* ====== SENSOR INDICATORS ====== */}
        {/* pH Sensor near Fish Tank */}
        <g transform="translate(325, 370)">
          <rect x="-28" y="-10" width="56" height="20" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="var(--primary)" style={{ fontSize: '9px', fontWeight: 700 }}>📊 pH</text>
        </g>
        {/* TDS Sensor */}
        <g transform="translate(245, 395)">
          <rect x="-28" y="-10" width="56" height="20" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="#3B82F6" style={{ fontSize: '9px', fontWeight: 700 }}>📊 TDS</text>
        </g>
        {/* Light Sensor near DWC */}
        <g transform="translate(790, 395)">
          <rect x="-28" y="-10" width="56" height="20" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="#EAB308" style={{ fontSize: '9px', fontWeight: 700 }}>☀️ LUX</text>
        </g>
        {/* Temp Sensor */}
        <g transform="translate(700, 395)">
          <rect x="-28" y="-10" width="56" height="20" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="#EF4444" style={{ fontSize: '9px', fontWeight: 700 }}>🌡️ °C</text>
        </g>

        {/* ====== TITLE ====== */}
        <text x="440" y="30" textAnchor="middle" fill="var(--text)" style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '2px' }}>SYSTEM ARCHITECTURE</text>
        <text x="440" y="48" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '10px', fontWeight: 500 }}>Closed-Loop Aquaponics · Real-Time Monitoring</text>
      </svg>
      
      {/* Status Badge */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
        <div className="badge badge-ok" style={{ fontSize: '9px', padding: '4px 10px' }}>🟢 SYSTEM ACTIVE</div>
      </div>
    </div>
  );
};
