import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export const useWebSocket = () => {
  const setLatestReading = useStore((s) => s.setLatestReading);
  const addReading = useStore((s) => s.addReading);
  const setActuatorState = useStore((s) => s.setActuatorState);
  const setWsConnected = useStore((s) => s.setWsConnected);
  const setActiveProfile = useStore((s) => s.setActiveProfile);
  const setProfileConfirmed = useStore((s) => s.setProfileConfirmed);
  const setSetpoints = useStore((s) => s.setSetpoints);
  
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Fetch initial state
    const apiBase = import.meta.env.VITE_API_BASE || '';
    fetch(`${apiBase}/api/state`)
      .then(res => res.json())
      .then(data => {
        if (data.activeProfile) setActiveProfile(data.activeProfile, false);
        if (data.profile) setSetpoints(data.profile);
        useStore.getState().setEspConnected(data.espConnected);
      })
      .catch(err => console.error('Failed to fetch initial state', err));

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const url = import.meta.env.VITE_WS_URL || `${protocol}://${window.location.host}/ws/sensors`;
      let socket: WebSocket;

      try {
        socket = new WebSocket(url);
      } catch (err) {
        console.error('WebSocket init failed', err);
        setWsConnected(false);
        setTimeout(connect, 3000);
        return;
      }

      socket.onopen = () => {
        console.log('Connected to AquaLoop Server');
        setWsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'sensor_reading') {
            setLatestReading(data);
            addReading(data);
            // If we receive a reading, the hardware is clearly connected
            useStore.getState().setEspConnected(true);
          }
          
          if (data.type === 'hardware_status') {
            useStore.getState().setEspConnected(data.connected);
          }

          if (data.type === 'actuator_status' || data.type === 'actuator_command') {
            if (data.actuator) {
              setActuatorState(data.actuator, { state: data.state, mode: data.mode });
            } else {
              // Handle bulk status
              Object.entries(data).forEach(([key, val]: [string, any]) => {
                if (typeof val === 'object' && val.state) {
                  setActuatorState(key, val);
                }
              });
            }
          }

          if (data.type === 'set_profile') {
            setActiveProfile(data.profile, false);
          }

          if (data.type === 'profile_switched') {
            setProfileConfirmed(data.profile);
          }

          if (data.type === 'setpoints_updated') {
            setSetpoints(data.setpoints);
          }
        } catch (e) {
          console.error('WS Message parsing error', e);
        }
      };

      socket.onclose = () => {
        console.log('Disconnected from AquaLoop Server');
        setWsConnected(false);
        setTimeout(connect, 3000); // Reconnect after 3s
      };

      socket.onerror = (err) => {
        console.error('WebSocket error', err);
        setWsConnected(false);
      };

      ws.current = socket;
    };

    connect();

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendCommand = (type: string, payload: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, ...payload }));
    }
  };

  return { sendCommand };
};
