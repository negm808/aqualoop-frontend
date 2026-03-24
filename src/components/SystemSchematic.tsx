import React from 'react';

export const SystemSchematic: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '960px', 
      margin: '0 auto', 
      background: 'var(--surface)', 
      padding: 'clamp(16px, 4vw, 48px)', 
      borderRadius: 'var(--r-xl)', 
      boxShadow: '0 20px 80px rgba(0,0,0,0.06)', 
      border: '1px solid var(--border)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* Dot-grid background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />

      <svg viewBox="0 0 880 560" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 1 }}>
        <defs>
          {/* Pipe gradients */}
          <linearGradient id="pipe-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A6B35" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#3A6B35" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3A6B35" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="pipe-vert" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A6B35" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#3A6B35" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3A6B35" stopOpacity="0.12" />
          </linearGradient>
          {/* Tank fills */}
          <linearGradient id="water-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="plant-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="bio-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="supply-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="return-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C8873A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C8873A" stopOpacity="0.15" />
          </linearGradient>
          {/* Shadows & glows */}
          <filter id="node-shadow">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="rgba(0,0,0,0.08)" />
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ====== TITLE ====== */}
        <text x="440" y="32" textAnchor="middle" fill="var(--text)" style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '2.5px' }}>SYSTEM ARCHITECTURE</text>
        <text x="440" y="50" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.5px' }}>Closed-Loop Aquaponics · Real-Time Monitoring & Control</text>
        <line x1="320" y1="60" x2="560" y2="60" stroke="var(--border)" strokeWidth="1" />

        {/* ====== FORWARD FLOW PIPES (horizontal main pipeline) ====== */}

        {/* Supply Tank → Fish Tank (vertical drop) */}
        <path d="M 140 155 Q 195 155 195 185 L 195 210" stroke="url(#pipe-vert)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 140 155 Q 195 155 195 185 L 195 210" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.25" />

        {/* Fish Tank → Pump 1 */}
        <path d="M 305 300 L 370 300" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 305 300 L 370 300" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.25" />

        {/* Pump 1 → Biofilter */}
        <path d="M 430 300 L 478 300" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 430 300 L 478 300" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.25" />

        {/* Biofilter → Pump 2 */}
        <path d="M 578 300 L 618 300" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 578 300 L 618 300" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.25" />

        {/* Pump 2 → DWC Plant Bed */}
        <path d="M 680 300 L 718 300" stroke="url(#pipe-flow)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 680 300 L 718 300" stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.25" />

        {/* ====== GRAVITY RETURN: DWC → Fish Tank (the corrected loop) ====== */}
        <path d="M 790 370 L 790 470 Q 790 490 770 490 L 250 490 Q 230 490 230 470 L 230 375" stroke="url(#return-grad)" strokeWidth="8" strokeDasharray="14 8" strokeLinecap="round" opacity="0.55" />

        {/* ====== FLOW DIRECTION ARROWS ====== */}
        <polygon points="190,208 200,208 195,218" fill="#06B6D4" fillOpacity="0.7" />
        <polygon points="365,295 365,305 375,300" fill="var(--primary)" fillOpacity="0.7" />
        <polygon points="473,295 473,305 483,300" fill="#7C3AED" fillOpacity="0.6" />
        <polygon points="613,295 613,305 623,300" fill="#7C3AED" fillOpacity="0.6" />
        <polygon points="713,295 713,305 723,300" fill="#22C55E" fillOpacity="0.7" />
        {/* Return arrows */}
        <polygon points="235,380 225,380 230,370" fill="#C8873A" fillOpacity="0.6" />

        {/* ====== ANIMATED FLOW PARTICLES ====== */}
        {/* Supply → Fish */}
        <circle r="4.5" fill="#06B6D4" filter="url(#glow-blue)">
          <animateMotion path="M 140 155 Q 195 155 195 185 L 195 210" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Fish → P1 */}
        <circle r="4" fill="#3A6B35" filter="url(#glow-green)">
          <animateMotion path="M 305 300 L 370 300" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* P1 → Biofilter */}
        <circle r="4" fill="#7C3AED" filter="url(#glow-purple)">
          <animateMotion path="M 430 300 L 478 300" dur="1.2s" repeatCount="indefinite" />
        </circle>
        {/* Biofilter → P2 */}
        <circle r="4" fill="#7C3AED" filter="url(#glow-purple)">
          <animateMotion path="M 578 300 L 618 300" dur="1.2s" repeatCount="indefinite" />
        </circle>
        {/* P2 → DWC */}
        <circle r="4" fill="#22C55E" filter="url(#glow-green)">
          <animateMotion path="M 680 300 L 718 300" dur="1.2s" repeatCount="indefinite" />
        </circle>
        {/* Gravity return: DWC → Fish Tank */}
        <circle r="4" fill="#C8873A" opacity="0.75">
          <animateMotion path="M 790 370 L 790 470 Q 790 490 770 490 L 250 490 Q 230 490 230 470 L 230 375" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle r="3.5" fill="#C8873A" opacity="0.5">
          <animateMotion path="M 790 370 L 790 470 Q 790 490 770 490 L 250 490 Q 230 490 230 470 L 230 375" dur="5s" begin="2.5s" repeatCount="indefinite" />
        </circle>

        {/* ====== TANK NODES ====== */}

        {/* --- Supply Buffer Tank --- */}
        <g transform="translate(48, 90)" filter="url(#node-shadow)">
          <rect width="120" height="110" rx="18" fill="var(--surface)" stroke="#06B6D4" strokeWidth="1.5" />
          {/* Water body */}
          <rect x="8" y="50" width="104" height="52" rx="10" fill="url(#supply-fill)" />
          {/* Animated wave */}
          <path d="M 8 58 Q 35 50 60 58 T 112 58 L 112 95 Q 112 102 104 102 L 16 102 Q 8 102 8 95 Z" fill="#06B6D4" fillOpacity="0.06">
            <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M 8 58 Q 35 50 60 58 T 112 58 L 112 95 Q 112 102 104 102 L 16 102 Q 8 102 8 95 Z;M 8 58 Q 35 66 60 58 T 112 58 L 112 95 Q 112 102 104 102 L 16 102 Q 8 102 8 95 Z;M 8 58 Q 35 50 60 58 T 112 58 L 112 95 Q 112 102 104 102 L 16 102 Q 8 102 8 95 Z" />
          </path>
          {/* Icon bg */}
          <circle cx="60" cy="30" r="17" fill="#06B6D4" fillOpacity="0.1" />
          <text x="60" y="37" textAnchor="middle" style={{ fontSize: '20px' }}>💧</text>
          {/* Labels */}
          <text x="60" y="128" textAnchor="middle" fill="var(--text)" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px' }}>SUPPLY</text>
          <text x="60" y="140" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '8px', fontWeight: 500 }}>Buffer Tank</text>
        </g>

        {/* --- Fish Tank (Main Aquarium) --- */}
        <g transform="translate(160, 210)" filter="url(#node-shadow)">
          <rect width="145" height="160" rx="22" fill="var(--surface)" stroke="#7B5E3A" strokeWidth="2" />
          {/* Water body */}
          <rect x="8" y="70" width="129" height="82" rx="12" fill="url(#water-fill)" />
          {/* Animated bubbles */}
          <circle cx="40" cy="120" r="3.5" fill="#60A5FA" fillOpacity="0.35">
            <animate attributeName="cy" values="130;85;130" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="3.5;2;3.5" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="fillOpacity" values="0.4;0.08;0.4" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="95" cy="110" r="2.5" fill="#60A5FA" fillOpacity="0.25">
            <animate attributeName="cy" values="125;80;125" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="fillOpacity" values="0.3;0.05;0.3" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="115" r="3" fill="#60A5FA" fillOpacity="0.3">
            <animate attributeName="cy" values="128;78;128" dur="3.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;1.5;3" dur="3.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="118" r="2" fill="#60A5FA" fillOpacity="0.2">
            <animate attributeName="cy" values="125;90;125" dur="4s" repeatCount="indefinite" />
          </circle>
          {/* Fish swimming */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0; 15,3; 0,0; -10,-2; 0,0" dur="5s" repeatCount="indefinite" />
            <text x="72" y="55" textAnchor="middle" style={{ fontSize: '32px' }}>🐟</text>
          </g>
          {/* Small secondary fish */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0; -8,2; 0,0; 10,-1; 0,0" dur="4s" repeatCount="indefinite" />
            <text x="105" y="105" textAnchor="middle" style={{ fontSize: '14px' }}>🐠</text>
          </g>
          {/* Labels */}
          <text x="72" y="185" textAnchor="middle" fill="var(--text)" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>FISH TANK</text>
          <text x="72" y="198" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '8px', fontWeight: 500 }}>Main Aquarium</text>
        </g>

        {/* --- Pump 1 (between Fish & Biofilter) --- */}
        <g transform="translate(400, 280)">
          <circle r="24" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" filter="url(#node-shadow)" />
          <circle r="16" fill="var(--primary)" fillOpacity="0.08" />
          {/* Spinning ring */}
          <circle r="10" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="5 10" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="4" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 900 }} fill="var(--primary)">P1</text>
          <text x="0" y="-34" textAnchor="middle" fill="var(--primary)" style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px' }}>PUMP</text>
        </g>

        {/* --- Biofilter --- */}
        <g transform="translate(478, 220)" filter="url(#node-shadow)">
          <rect width="100" height="160" rx="20" fill="var(--surface)" stroke="#7C3AED" strokeWidth="2" />
          {/* Fill */}
          <rect x="8" y="70" width="84" height="82" rx="12" fill="url(#bio-fill)" />
          {/* Animated bacteria */}
          <circle cx="28" cy="100" r="2.5" fill="#A855F7" fillOpacity="0.4">
            <animate attributeName="cy" values="108;88;108" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="fillOpacity" values="0.4;0.15;0.4" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="52" cy="95" r="2" fill="#A855F7" fillOpacity="0.3">
            <animate attributeName="cy" values="102;82;102" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="75" cy="105" r="2.5" fill="#A855F7" fillOpacity="0.35">
            <animate attributeName="cy" values="112;90;112" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="42" cy="120" r="1.5" fill="#A855F7" fillOpacity="0.25">
            <animate attributeName="cy" values="125;100;125" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Icon */}
          <circle cx="50" cy="38" r="20" fill="#7C3AED" fillOpacity="0.08" />
          <text x="50" y="46" textAnchor="middle" style={{ fontSize: '24px' }}>🦠</text>
          {/* Labels */}
          <text x="50" y="195" textAnchor="middle" fill="var(--text)" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>BIOFILTER</text>
          <text x="50" y="208" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '8px', fontWeight: 500 }}>Nitrification</text>
        </g>

        {/* --- Pump 2 (between Biofilter & DWC) --- */}
        <g transform="translate(650, 280)">
          <circle r="24" fill="var(--surface)" stroke="#22C55E" strokeWidth="2" filter="url(#node-shadow)" />
          <circle r="16" fill="#22C55E" fillOpacity="0.08" />
          <circle r="10" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeDasharray="5 10" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="4" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 900 }} fill="#22C55E">P2</text>
          <text x="0" y="-34" textAnchor="middle" fill="#22C55E" style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px' }}>PUMP</text>
        </g>

        {/* --- Plant Bed (DWC Rafts) --- */}
        <g transform="translate(700, 210)" filter="url(#node-shadow)">
          <rect width="165" height="160" rx="18" fill="var(--surface)" stroke="#22C55E" strokeWidth="2" />
          {/* Raft platform line */}
          <line x1="12" y1="72" x2="153" y2="72" stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.4" />
          {/* Water below raft */}
          <rect x="8" y="80" width="149" height="72" rx="10" fill="url(#plant-fill)" />
          {/* Roots hanging down */}
          <line x1="35" y1="72" x2="33" y2="112" stroke="#16A34A" strokeWidth="1.2" strokeOpacity="0.3" />
          <line x1="55" y1="72" x2="57" y2="118" stroke="#16A34A" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="75" y1="72" x2="73" y2="115" stroke="#16A34A" strokeWidth="1.2" strokeOpacity="0.3" />
          <line x1="95" y1="72" x2="97" y2="110" stroke="#16A34A" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="115" y1="72" x2="113" y2="116" stroke="#16A34A" strokeWidth="1.2" strokeOpacity="0.3" />
          <line x1="135" y1="72" x2="137" y2="112" stroke="#16A34A" strokeWidth="1" strokeOpacity="0.2" />
          {/* Seedlings on top of raft */}
          <text x="35" y="68" textAnchor="middle" style={{ fontSize: '12px' }}>🌱</text>
          <text x="75" y="65" textAnchor="middle" style={{ fontSize: '16px' }}>🌿</text>
          <text x="115" y="68" textAnchor="middle" style={{ fontSize: '12px' }}>🌱</text>
          {/* Main icon */}
          <circle cx="82" cy="38" r="22" fill="#22C55E" fillOpacity="0.08" />
          <text x="82" y="30" textAnchor="middle" style={{ fontSize: '28px' }}>🥬</text>
          {/* Labels */}
          <text x="82" y="180" textAnchor="middle" fill="var(--text)" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>DWC RAFTS</text>
          <text x="82" y="193" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '8px', fontWeight: 500 }}>Plant Growth Bed</text>
        </g>

        {/* ====== GRAVITY RETURN LABEL ====== */}
        <g transform="translate(440, 505)">
          <rect x="-75" y="-13" width="150" height="24" rx="12" fill="var(--surface)" stroke="#C8873A" strokeWidth="1.2" strokeOpacity="0.5" />
          <text x="-4" y="3" textAnchor="middle" fill="#C8873A" style={{ fontSize: '8.5px', fontWeight: 700, letterSpacing: '1.2px' }}>↩ GRAVITY RETURN</text>
        </g>

        {/* ====== SENSOR BADGES ====== */}
        {/* pH near Fish Tank */}
        <g transform="translate(195, 420)">
          <rect x="-30" y="-11" width="60" height="22" rx="11" fill="var(--surface)" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="-18" cy="0" r="4" fill="var(--primary)" fillOpacity="0.15" />
          <text x="4" y="4" textAnchor="middle" fill="var(--primary)" style={{ fontSize: '9px', fontWeight: 700 }}>pH 7.2</text>
        </g>
        {/* TDS near Fish Tank */}
        <g transform="translate(290, 420)">
          <rect x="-30" y="-11" width="60" height="22" rx="11" fill="var(--surface)" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="-18" cy="0" r="4" fill="#3B82F6" fillOpacity="0.15" />
          <text x="4" y="4" textAnchor="middle" fill="#3B82F6" style={{ fontSize: '9px', fontWeight: 700 }}>TDS</text>
        </g>
        {/* Temp near DWC */}
        <g transform="translate(750, 420)">
          <rect x="-30" y="-11" width="60" height="22" rx="11" fill="var(--surface)" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="-18" cy="0" r="4" fill="#EF4444" fillOpacity="0.15" />
          <text x="4" y="4" textAnchor="middle" fill="#EF4444" style={{ fontSize: '9px', fontWeight: 700 }}>25 °C</text>
        </g>
        {/* LUX near DWC */}
        <g transform="translate(840, 420)">
          <rect x="-30" y="-11" width="60" height="22" rx="11" fill="var(--surface)" stroke="#EAB308" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="-18" cy="0" r="4" fill="#EAB308" fillOpacity="0.15" />
          <text x="4" y="4" textAnchor="middle" fill="#EAB308" style={{ fontSize: '9px', fontWeight: 700 }}>LUX</text>
        </g>

        {/* ====== FLOW LABELS on pipes ====== */}
        <g transform="translate(338, 275)">
          <rect x="-22" y="-8" width="44" height="14" rx="7" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.8" />
          <text x="0" y="3" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.5px' }}>NH₃ →</text>
        </g>
        <g transform="translate(598, 275)">
          <rect x="-22" y="-8" width="44" height="14" rx="7" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.8" />
          <text x="0" y="3" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.5px' }}>NO₃ →</text>
        </g>

        {/* ====== ESP32 CONTROLLER (top right) ====== */}
        <g transform="translate(730, 78)" filter="url(#node-shadow)">
          <rect width="120" height="52" rx="12" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2" />
          <rect x="4" y="4" width="112" height="44" rx="10" fill="var(--primary)" fillOpacity="0.04" />
          <text x="60" y="22" textAnchor="middle" fill="var(--primary)" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px' }}>ESP32</text>
          <text x="60" y="36" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '8px', fontWeight: 500 }}>IoT Controller</text>
          {/* Signal waves */}
          <circle cx="105" cy="14" r="5" fill="none" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.3">
            <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="strokeOpacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Dashed lines from ESP32 to sensors */}
        <path d="M 730 110 L 530 180" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.2" />
        <path d="M 790 130 L 790 210" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.2" />

      </svg>

      {/* Status Badge */}
      <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px' }}>
        <div className="badge badge-ok" style={{ fontSize: '8px', padding: '4px 10px', letterSpacing: '0.5px' }}>🟢 LIVE</div>
      </div>
    </div>
  );
};
