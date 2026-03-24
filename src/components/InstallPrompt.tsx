import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // For iOS, show the prompt to instruct manual installation
      setIsVisible(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '12px',
      left: '12px',
      right: '12px',
      background: 'rgba(3, 105, 161, 0.95)',
      backdropFilter: 'blur(12px)',
      color: '#fff',
      padding: '12px 16px',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      borderRadius: '16px',
      fontFamily: 'var(--ff-body)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '6px', color: 'var(--primary)', display: 'flex' }}>
          <Download size={18} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, letterSpacing: '-0.3px' }}>Download AquaLoop App</h4>
          <p style={{ margin: 0, fontSize: '11px', opacity: 0.9, fontWeight: 500 }}>
            {isIOS ? "Tap Share ⍗ -> 'Add to Home Screen'" : "Add to home screen for full experience"}
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {!isIOS && (
          <button 
            onClick={handleInstallClick}
            style={{ 
              background: '#fff', 
              color: 'var(--primary)', 
              border: 'none', 
              padding: '6px 14px', 
              borderRadius: '10px', 
              fontWeight: 700, 
              fontSize: '11px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Install
          </button>
        )}
        <button 
          onClick={() => setIsVisible(false)} 
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', display: 'flex', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
