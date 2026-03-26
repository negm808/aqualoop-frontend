import { create } from 'zustand';

export interface SensorReading {
  ph: number;
  tds: number;
  light: number;
  temp: number;
  timestamp: string;
  profile: 'main' | 'db1' | 'db2';
}

export interface ActuatorReading {
  pump1: number;
  pump2: number;
  diluted_pump: number;
  led: number;
  timestamp: string;
}

export interface ActuatorState {
  state: 'on' | 'off';
  mode: 'auto' | 'manual';
  energy: number; // accumulated energy in Wh
  power: number;  // instantaneous power in W
}

export interface ProfileSetpoints {
  id: string;
  name?: string;
  fish?: string;
  plant?: string;
  ph_min: number;
  ph_max: number;
  tds_min: number;
  tds_max: number;
  lux_min: number;
  lux_max: number;
}

interface AppStore {
  // Live data
  latestReading: SensorReading | null;
  readings: SensorReading[];          // rolling buffer
  actuatorReadings: ActuatorReading[];  // history for chart
  actuators: {
    pump1: ActuatorState;
    pump2: ActuatorState;
    diluted_pump: ActuatorState;
    led: ActuatorState;
  };
  activeProfile: 'main' | 'db1' | 'db2';
  setpoints: ProfileSetpoints | null;
  profileConfirmationPending: boolean;
  lastEnergyUpdate: number | null; // Timestamp for deltaTime calculation

  // Connection
  wsConnected: boolean;
  espConnected: boolean;               // Hardware status
  lastSyncTime: Date | null;

  // Alerts
  unreadAlertCount: number;

  // Theme
  theme: 'light' | 'dark';

  // Actions
  setLatestReading: (reading: SensorReading) => void;
  setActuatorState: (actuator: string, state: Partial<ActuatorState>) => void;
  setActiveProfile: (profile: 'main' | 'db1' | 'db2', optimistic?: boolean) => void;
  setProfileConfirmed: (profile: 'main' | 'db1' | 'db2') => void;
  setSetpoints: (setpoints: ProfileSetpoints) => void;
  setWsConnected: (connected: boolean) => void;
  setEspConnected: (connected: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addReading: (reading: SensorReading) => void;
  tickEnergy: () => void;
  resetEnergy: (actuator?: string) => void;
}

const PROFILE_METADATA = {
  main: { name: 'Standard', fish: 'Grey Mullet', plant: 'Lettuce' },
  db1: { name: 'Premium Flow', fish: 'Mabroka', plant: 'Strawberry' },
  db2: { name: 'Eco-Basics', fish: 'Tilapia', plant: 'Basil' },
};

export const useStore = create<AppStore>((set, get) => ({
  latestReading: null,
  readings: [],
  actuatorReadings: [],
  actuators: {
    pump1: { state: 'off', mode: 'auto', energy: 0, power: 0 },
    pump2: { state: 'off', mode: 'auto', energy: 0, power: 0 },
    diluted_pump: { state: 'off', mode: 'auto', energy: 0, power: 0 },
    led: { state: 'off', mode: 'auto', energy: 0, power: 0 },
  },
  activeProfile: 'main',
  setpoints: null,
  profileConfirmationPending: false,
  lastEnergyUpdate: null,
  wsConnected: false,
  espConnected: false,
  lastSyncTime: null,
  unreadAlertCount: 0,
  theme: (localStorage.getItem('aqualoop-theme') as 'light' | 'dark') || 'light',

  setLatestReading: (reading) => set({ latestReading: reading, lastSyncTime: new Date() }),
  setActuatorState: (actuator, state) => set((s) => ({
    actuators: {
      ...s.actuators,
      [actuator]: { ...s.actuators[actuator as keyof typeof s.actuators], ...state }
    }
  })),
  setActiveProfile: (profile, optimistic = true) => {
    if (optimistic) {
      set({ 
        activeProfile: profile, 
        profileConfirmationPending: true 
      });
    } else {
      set({ activeProfile: profile });
    }

    // Fetch setpoints for this profile to update UI immediately
    const apiBase = import.meta.env.VITE_API_BASE || '';
    fetch(`${apiBase}/api/profiles`)
      .then(res => res.json())
      .then(profiles => {
        const p = profiles.find((x: any) => x.id === profile);
        if (p) {
          const meta = PROFILE_METADATA[profile as keyof typeof PROFILE_METADATA];
          set({ setpoints: { ...p, ...meta } });
        }
      });
  },
  setProfileConfirmed: (profile) => {
    const currentActive = get().activeProfile;
    if (currentActive === profile) {
      set({ profileConfirmationPending: false });
    } else {
      // Hardware is ahead or we missed a message? Sync to hardware.
      get().setActiveProfile(profile, false);
      set({ profileConfirmationPending: false });
    }
  },
  setSetpoints: (setpoints) => set({ setpoints }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
  setEspConnected: (connected: boolean) => set({ espConnected: connected }),
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('aqualoop-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },
  addReading: (reading) => set((s) => ({
    readings: [reading, ...s.readings].slice(0, 720) // Keep last hour (5s interval)
  })),
  tickEnergy: () => {
    const now = Date.now();
    const lastUpdate = get().lastEnergyUpdate;
    if (!lastUpdate) {
      set({ lastEnergyUpdate: now });
      return;
    }

    const deltaTimeHours = (now - lastUpdate) / (1000 * 3600);
    const POWER_RATINGS: Record<string, number> = {
      pump1: 5,
      pump2: 5,
      diluted_pump: 4,
      led: 6
    };

    set((s) => {
      const nextActuators = { ...s.actuators };
      
      Object.keys(POWER_RATINGS).forEach((id) => {
        const actKey = id as keyof typeof s.actuators;
        const actuator = nextActuators[actKey];
        const ratedPower = POWER_RATINGS[id];
        
        // Update instantaneous power
        actuator.power = actuator.state === 'on' ? ratedPower : 0;
        
        // Accumulate energy if ON
        if (actuator.state === 'on') {
          actuator.energy += ratedPower * deltaTimeHours;
        }
      });

      // Add to history buffer (keep last 300 points ~ 5 minutes if 1s interval)
      const newActReading: ActuatorReading = {
        pump1: nextActuators.pump1.power,
        pump2: nextActuators.pump2.power,
        diluted_pump: nextActuators.diluted_pump.power,
        led: nextActuators.led.power,
        timestamp: new Date().toISOString()
      };

      return { 
        actuators: nextActuators,
        actuatorReadings: [...s.actuatorReadings, newActReading].slice(-300),
        lastEnergyUpdate: now
      };
    });
  },
  resetEnergy: (actuator) => set((s) => {
    if (actuator) {
      return {
        actuators: {
          ...s.actuators,
          [actuator]: { ...s.actuators[actuator as keyof typeof s.actuators], energy: 0 }
        }
      };
    } else {
      // Reset all
      const nextActuators = { ...s.actuators };
      Object.keys(nextActuators).forEach(k => {
        nextActuators[k as keyof typeof nextActuators].energy = 0;
      });
      return { actuators: nextActuators };
    }
  })
}));
