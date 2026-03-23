import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import * as XLSX from 'xlsx';

interface Reading {
  id: number;
  timestamp: string;
  profile: string;
  ph: number;
  tds: number;
  light: number;
  temp: number;
}

export const Readings: React.FC = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const activeProfile = useStore((s) => s.activeProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/readings?limit=100`)
      .then(res => res.json())
      .then(data => setReadings(data));
  }, []);

  const filteredReadings = readings.filter(r => r.profile === activeProfile);

  const downloadCSV = () => {
    const ws = XLSX.utils.json_to_sheet(readings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Readings");
    XLSX.writeFile(wb, `aqualoop-readings-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      console.log('Ingested Excel Data:', data);
      // In a real app, send to backend
      alert(`Imported ${data.length} records into local view.`);
      setReadings(prev => [...(data as Reading[]), ...prev]);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
         <div>
            <h1 className="text-display-lg">Sensor Readings</h1>
            <p className="text-body" style={{ color: 'var(--muted)' }}>Complete data log from all connected sensors.</p>
         </div>
         <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
              accept=".xlsx,.xls,.csv" 
            />
            <button className="btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Upload size={18} /> Upload Data
            </button>
            <button onClick={downloadCSV} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Download size={18} /> Download Excel
            </button>
         </div>
      </header>

      <div className="card glass" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ background: 'rgba(58, 107, 53, 0.05)', textAlign: 'left' }}>
                     <th style={{ padding: '20px 24px' }} className="text-label">Timestamp</th>
                     <th style={{ padding: '20px 24px' }} className="text-label">Profile</th>
                     <th style={{ padding: '20px 24px' }} className="text-label">pH</th>
                     <th style={{ padding: '20px 24px' }} className="text-label">TDS (ppm)</th>
                     <th style={{ padding: '20px 24px' }} className="text-label">Light (lux)</th>
                     <th style={{ padding: '20px 24px' }} className="text-label">Temp (°C)</th>
                     <th style={{ padding: '20px 24px' }} className="text-label">Status</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredReadings.length > 0 ? filteredReadings.map((r, i) => (
                    <tr key={i} style={{ 
                      borderBottom: '1px solid var(--border)', 
                      background: i % 2 === 0 ? 'transparent' : 'rgba(58, 107, 53, 0.02)',
                      transition: 'background 0.2s ease'
                    }} className="table-row-hover">
                       <td style={{ padding: '16px 24px' }} className="text-mono-sm">{r.timestamp ? new Date(r.timestamp).toLocaleString() : 'N/A'}</td>
                       <td style={{ padding: '16px 24px' }}>
                          <div className={`badge ${r.profile === 'main' ? 'badge-ok' : 'badge-neutral'}`}>{r.profile}</div>
                       </td>
                       <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--primary)' }} className="text-mono">{(r.ph || 0).toFixed(2)}</td>
                       <td style={{ padding: '16px 24px', fontWeight: 600 }} className="text-mono">{r.tds || 0}</td>
                       <td style={{ padding: '16px 24px', color: 'var(--accent)' }} className="text-mono">{r.light || 0}</td>
                       <td style={{ padding: '16px 24px', color: 'var(--secondary)' }} className="text-mono">{(r.temp || 0).toFixed(1)}</td>
                       <td style={{ padding: '16px 24px' }}>
                          <span className="badge badge-ok" style={{ background: 'transparent', padding: 0 }}>✓ Active</span>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={7} style={{ padding: '80px', textAlign: 'center', color: 'var(--muted)' }}>
                          <div className="text-display-sm" style={{ fontWeight: 400, opacity: 0.5 }}>No archival records found for this profile.</div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <style>{`
        .table-row-hover:hover { background: rgba(58, 107, 53, 0.05) !important; }
      `}</style>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div className="text-body-sm" style={{ color: 'var(--muted)' }}>Showing {filteredReadings.length} of {readings.length} total records ({activeProfile.toUpperCase()} filtered)</div>
         <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Previous</button>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Next</button>
         </div>
      </div>
    </div>
  );
};
