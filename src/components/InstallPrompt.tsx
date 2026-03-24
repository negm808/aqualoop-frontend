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
      top: 0,
      left: 0,
      right: 0,
      background: 'var(--primary)',
      color: '#fff',
      padding: '12px 16px',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontFamily: 'var(--ff-body)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '6px', color: 'var(--primary)', display: 'flex' }}>
          <Download size={20} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Get AquaLoop App</h4>
          <p style={{ margin: 0, fontSize: '11px', opacity: 0.9 }}>
            {isIOS ? "Tap Share icon ⍗ then 'Add to Home Screen'" : "Add to home screen for full experience"}
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
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontWeight: 600, 
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Install
          </button>
        )}
        <button 
          onClick={() => setIsVisible(false)} 
          style={{ background: 'transparent', border: 'none', color: '#fff', display: 'flex', cursor: 'pointer', padding: 0 }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
