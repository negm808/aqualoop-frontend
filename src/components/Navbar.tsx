import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '../store/useStore';
import { Bell, Home, LayoutDashboard, Fish, Leaf, Bot, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  const wsConnected = useStore((s) => s.wsConnected);
  const navigate = useNavigate();

  return (
    <>
    <nav style={{
      height: '62px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(var(--bg-rgb, 247, 243, 238), 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <img src="/source-logo.png" alt="AquaLoop Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
      </div>

      <div className="desktop-only" style={{ display: 'flex', gap: '4px' }}>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
        <NavLink to="/fish" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Fish</NavLink>
        <NavLink to="/plant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Plant</NavLink>
        <NavLink to="/readings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Readings</NavLink>
        <NavLink to="/ai" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>AI Terminal</NavLink>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="badge badge-neutral" style={{ padding: '6px 12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: wsConnected ? 'var(--success)' : 'var(--danger)'
          }} />
          <span className="text-label" style={{ fontSize: '9px' }}>
            {wsConnected ? 'System Live' : 'Offline'}
          </span>
        </div>

        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => navigate('/dashboard')}
        >
          Open Dashboard →
        </button>

        <div className="desktop-only" style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="var(--muted)" />
          <div style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: '8px',
            height: '8px',
            background: 'var(--danger)',
            borderRadius: '50%',
            border: '2px solid var(--surface)'
          }} />
        </div>

        <ThemeToggle />
      </div>

      <style>{`
        .nav-link {
          padding: 8px 16px;
          border-radius: var(--r-md);
          text-decoration: none;
          color: var(--muted);
          font-family: var(--ff-body);
          font-size: 14px;
          font-weight: 500;
          transition: 0.2s;
        }
        .nav-link:hover {
          background: rgba(58,107,53,0.05);
          color: var(--text);
        }
        .nav-link.active {
          color: var(--primary);
          background: rgba(58,107,53,0.1);
          font-weight: 600;
        }
      `}</style>
    </nav>

    <div className="mobile-tab-bar mobile-only">
      <NavLink to="/" className={({ isActive }) => `mobile-tab-link ${isActive ? 'active' : ''}`}>
        <Home size={20} /> Home
      </NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => `mobile-tab-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} /> Dash
      </NavLink>
      <NavLink to="/fish" className={({ isActive }) => `mobile-tab-link ${isActive ? 'active' : ''}`}>
        <Fish size={20} /> Fish
      </NavLink>
      <NavLink to="/plant" className={({ isActive }) => `mobile-tab-link ${isActive ? 'active' : ''}`}>
        <Leaf size={20} /> Plant
      </NavLink>
      <NavLink to="/readings" className={({ isActive }) => `mobile-tab-link ${isActive ? 'active' : ''}`}>
        <Activity size={20} /> Data
      </NavLink>
      <NavLink to="/ai" className={({ isActive }) => `mobile-tab-link ${isActive ? 'active' : ''}`}>
        <Bot size={20} /> AI
      </NavLink>
    </div>
    </>
  );
};
