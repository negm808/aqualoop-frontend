import { useEffect } from 'react';
import { useStore } from '../store/useStore';

/**
 * Hook to continuously track actuator energy consumption
 * based on rated power and runtime.
 */
export const useEnergyTracker = () => {
  const tickEnergy = useStore((s) => s.tickEnergy);

  useEffect(() => {
    // Tick every second for smooth UI updates
    const interval = setInterval(() => {
      tickEnergy();
    }, 1000);

    return () => clearInterval(interval);
  }, [tickEnergy]);
};
