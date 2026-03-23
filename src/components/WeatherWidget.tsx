import React, { useState, useEffect } from 'react';
import { Sun, Droplets, MapPin, Wind } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.78&longitude=31.00&current=temperature_2m,relative_humidity_2m&timezone=auto');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setWeather(data.current);
        setError(false);
      } catch (e) {
        setError(true);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // 10 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass" style={{ 
      padding: '24px', 
      borderRadius: 'var(--r-xl)', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '20px',
      border: '1px solid var(--border)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
      background: 'linear-gradient(135deg, var(--glass-bg), rgba(255,255,255,0.95))',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={14} color="var(--primary)" />
          <span className="text-label" style={{ fontSize: '10px', color: 'var(--primary)' }}>Tanta, Egypt</span>
        </div>
        <div className="badge badge-ok" style={{ fontSize: '8px', padding: '3px 8px' }}>LIVE FEED</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: '56px', height: '56px', 
          background: 'var(--primary)', 
          borderRadius: '16px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 20px rgba(58, 107, 53, 0.2)'
        }}>
          <Sun size={28} color="white" />
        </div>
        <div>
          <div className="text-display-lg" style={{ fontSize: '38px', lineHeight: 1, margin: 0, fontWeight: 700 }}>
            {error ? '24' : Math.round(weather?.temperature_2m || 24)}°C
          </div>
          <div className="text-label" style={{ color: 'var(--muted)', marginTop: '4px' }}>Ecosystem Base</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
         <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--r-md)', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid var(--border)' }}>
            <Droplets size={16} color="var(--info)" />
            <div>
              <div className="text-label" style={{ fontSize: '8px', opacity: 0.6 }}>HUMIDITY</div>
              <div className="text-number" style={{ fontSize: '14px' }}>{error ? '45' : weather?.relative_humidity_2m}%</div>
            </div>
         </div>
         <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 'var(--r-md)', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid var(--border)' }}>
            <Wind size={16} color="var(--primary)" />
            <div>
              <div className="text-label" style={{ fontSize: '8px', opacity: 0.6 }}>FLOW RATE</div>
              <div className="text-number" style={{ fontSize: '14px' }}>STABLE</div>
            </div>
         </div>
      </div>
      
      <div style={{ 
        position: 'absolute', 
        top: '-10px', 
        right: '20px', 
        fontSize: '40px', 
        opacity: 0.05, 
        pointerEvents: 'none' 
      }}>☁️</div>
    </div>
  );
};
