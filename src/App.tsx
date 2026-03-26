import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Fish } from './pages/Fish';
import { Plant } from './pages/Plant';
import { AI } from './pages/AI';
import { Readings } from './pages/Readings';
import { ActuatorsDashboard } from './pages/ActuatorsDashboard';
import { useWebSocket } from './hooks/useWebSocket';
import { useEnergyTracker } from './hooks/useEnergyTracker';

import { InstallPrompt } from './components/InstallPrompt';

const App: React.FC = () => {
  // Initialize WebSocket and Energy tracking globally
  useWebSocket();
  useEnergyTracker();

  return (
    <BrowserRouter>
      <InstallPrompt />
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 62px)' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fish" element={<Fish />} />
          <Route path="/plant" element={<Plant />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/readings" element={<Readings />} />
          <Route path="/actuators" element={<ActuatorsDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
