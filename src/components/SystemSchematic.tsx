import React from 'react';

export const SystemSchematic: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      background: 'var(--surface)', 
      padding: '40px', 
      borderRadius: 'var(--r-xl)', 
      boxShadow: '0 20px 60px rgba(0,0,0,0.05)', 
      border: '1px solid var(--border)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <svg viewBox="0 0 900 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id="pipe-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
          </linearGradient>
          <filter id="glass-blur">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="drop-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="15" floodColor="rgba(0,0,0,0.1)" />
          </filter>
        </defs>

        {/* --- Background Elements --- */}
        <rect x="0" y="0" width="900" height="500" rx="20" fill="rgba(58, 107, 53, 0.02)" />
        
        {/* --- Connection Pipes --- */}
        {/* Supply to Fish Tank */}
        <path d="M 120 120 L 250 120 L 250 180" stroke="url(#pipe-grad)" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M 120 120 L 250 120 L 250 180" stroke="var(--primary)" strokeWidth="2" fill="none" strokeOpacity="0.2" />
        
        {/* Fish Tank to Biofilter */}
        <path d="M 350 250 L 450 250" stroke="url(#pipe-grad)" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M 350 250 L 450 250" stroke="var(--primary)" strokeWidth="2" fill="none" strokeOpacity="0.2" />

        {/* Biofilter to Plant Bed */}
        <path d="M 550 250 L 650 250" stroke="url(#pipe-grad)" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M 550 250 L 650 250" stroke="var(--primary)" strokeWidth="2" fill="none" strokeOpacity="0.2" />

        {/* Plant Bed Return to Sump (conceptually) */}
        <path d="M 750 310 L 750 420 L 150 420 L 150 120" stroke="var(--accent)" strokeWidth="8" strokeDasharray="10 10" fill="none" strokeLinecap="round" opacity="0.4" />

        {/* --- Nodes (Tanks) --- */}

        {/* Supply Tank */}
        <g transform="translate(60, 70)">
          <rect width="120" height="100" rx="16" fill="var(--surface2)" stroke="var(--border)" filter="url(#drop-shadow)" />
          <path d="M 5 50 Q 60 40 115 50 L 115 95 L 5 95 Z" fill="url(#water-grad)" />
          <text x="60" y="40" textAnchor="middle" style={{ fontSize: '24px' }}>💧</text>
          <text x="60" y="125" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '11px', fontWeight: 600 }}>SUPPLY BUFFER</text>
        </g>

        {/* Fish Tank */}
        <g transform="translate(200, 180)">
          <rect width="150" height="140" rx="24" fill="var(--surface2)" stroke="var(--secondary)" strokeWidth="2" filter="url(#drop-shadow)" />
          <path d="M 5 70 Q 75 55 145 70 L 145 135 L 5 135 Z" fill="url(#water-grad)" />
          <text x="75" y="60" textAnchor="middle" style={{ fontSize: '40px' }}>🐟</text>
          <text x="75" y="165" textAnchor="middle" fill="var(--text)" style={{ fontSize: '13px', fontWeight: 700 }}>MAIN AQUARIUM</text>
        </g>

        {/* Biofilter */}
        <g transform="translate(450, 180)">
          <rect width="100" height="140" rx="20" fill="var(--surface2)" stroke="var(--primary)" strokeWidth="2" filter="url(#drop-shadow)" />
          <path d="M 5 80 Q 50 70 95 80 L 95 135 L 5 135 Z" fill="url(#water-grad)" opacity="0.6" />
          <text x="50" y="60" textAnchor="middle" style={{ fontSize: '32px' }}>🦠</text>
          <text x="50" y="165" textAnchor="middle" fill="var(--text)" style={{ fontSize: '13px', fontWeight: 700 }}>BIOFILTER</text>
        </g>

        {/* Plant Bed (DWC) */}
        <g transform="translate(650, 180)">
          <rect width="200" height="130" rx="12" fill="var(--surface2)" stroke="#27ae60" strokeWidth="2" filter="url(#drop-shadow)" />
          <rect x="10" y="10" width="180" height="110" rx="6" fill="rgba(39, 174, 96, 0.03)" />
          <text x="100" y="65" textAnchor="middle" style={{ fontSize: '48px' }}>🌿</text>
          <text x="100" y="155" textAnchor="middle" fill="var(--text)" style={{ fontSize: '13px', fontWeight: 700 }}>DWC RAFTS</text>
        </g>

        {/* Pumps */}
        <g transform="translate(400, 250)">
          <circle r="20" fill="var(--bg)" stroke="var(--primary)" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" style={{ fontSize: '12px', fontWeight: 800 }} fill="var(--primary)">P1</text>
          <text x="0" y="-30" textAnchor="middle" fill="var(--primary)" style={{ fontSize: '10px', fontWeight: 700 }}>PUMP A</text>
        </g>

        {/* Flow Indicator Dots (Animated conceptually) */}
        <circle r="3" fill="var(--primary)">
          <animateMotion path="M 120 120 L 250 120 L 250 180" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="var(--primary)">
          <animateMotion path="M 350 250 L 450 250" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="var(--primary)">
          <animateMotion path="M 550 250 L 650 250" dur="2s" repeatCount="indefinite" />
        </circle>

      </svg>
      
      {/* Absolute Overlays for status */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
        <div className="badge badge-ok">SYSTEM ACTIVE</div>
      </div>
    </div>
  );
};

