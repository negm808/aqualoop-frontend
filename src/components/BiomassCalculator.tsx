import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

export const BiomassCalculator: React.FC = () => {
  const [fishCount, setFishCount] = useState(10);
  const [avgWeight, setAvgWeight] = useState(150); // grams
  const [proteinContent, setProteinContent] = useState(32); // %

  const totalBiomass = (fishCount * avgWeight) / 1000; // kg
  const dailyFeed = totalBiomass * 0.02; // Assuming 2% of body weight fed daily
  const ammoniaProduction = dailyFeed * (proteinContent / 100) * 0.092; // Rough biological formula (kg NH3 per day)
  
  const tankCapacity = 100; // liters (mocked)
  const biomassDensity = totalBiomass / (tankCapacity / 1000); // kg/m3

  return (
    <div className="card glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: 'var(--r-md)' }}>
          <Calculator size={20} />
        </div>
        <div>
          <h3 className="text-display-sm">Biomass Calculator</h3>
          <p className="text-body-sm" style={{ color: 'var(--muted)' }}>Estimate nutrient output & bio-load</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Fish Count</label>
          <input 
            type="number" 
            value={fishCount} 
            onChange={(e) => setFishCount(Number(e.target.value))}
            style={{ width: '100%', background: 'var(--surface3)', border: 'none', padding: '10px', borderRadius: 'var(--r-sm)', color: 'var(--text)', fontFamily: 'var(--ff-mono)' }}
          />
        </div>
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Avg Weight (g)</label>
          <input 
            type="number" 
            value={avgWeight} 
            onChange={(e) => setAvgWeight(Number(e.target.value))}
            style={{ width: '100%', background: 'var(--surface3)', border: 'none', padding: '10px', borderRadius: 'var(--r-sm)', color: 'var(--text)', fontFamily: 'var(--ff-mono)' }}
          />
        </div>
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Feed Protein %</label>
          <input 
            type="number" 
            value={proteinContent} 
            onChange={(e) => setProteinContent(Number(e.target.value))}
            style={{ width: '100%', background: 'var(--surface3)', border: 'none', padding: '10px', borderRadius: 'var(--r-sm)', color: 'var(--text)', fontFamily: 'var(--ff-mono)' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--surface2)', padding: '24px', borderRadius: 'var(--r-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <div className="text-label" style={{ marginBottom: '8px', color: 'var(--muted)' }}>Total Biomass</div>
          <div className="text-display-md" style={{ color: 'var(--primary)' }}>{totalBiomass.toFixed(2)} <span style={{ fontSize: '14px' }}>kg</span></div>
        </div>
        <div>
          <div className="text-label" style={{ marginBottom: '8px', color: 'var(--muted)' }}>Est. Daily NH₃</div>
          <div className="text-display-md" style={{ color: 'var(--accent)' }}>{(ammoniaProduction * 1000).toFixed(2)} <span style={{ fontSize: '14px' }}>g/day</span></div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Info size={16} color="var(--primary)" style={{ marginTop: '2px' }} />
        <p className="text-body-sm" style={{ color: 'var(--muted)' }}>
          Your current density is <strong>{biomassDensity.toFixed(1)} kg/m³</strong>. 
          {biomassDensity > 20 ? (
            <span style={{ color: 'var(--danger)', fontWeight: 600 }}> (CRITICAL: Overstocked)</span>
          ) : (
            <span> (Optimal range for STEM School systems.)</span>
          )}
        </p>
      </div>
    </div>
  );
};
