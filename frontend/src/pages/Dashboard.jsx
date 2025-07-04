import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import SignalChart from '../components/SignalChart';
import SignalHistory from '../components/SignalHistory';
import StatsPanel from '../components/StatsPanel';

export default function Dashboard() {
  const [signals, setSignals] = useState([]);

  const handleNewSignal = (signal) => {
    setSignals(prev => [signal, ...prev]);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#1e90ff' }}>📈 VixFx AI Signal Dashboard</h1>
      <UploadForm onSignal={handleNewSignal} />
      {signals.length > 0 && <SignalChart signals={signals} />}
      <StatsPanel />
      <SignalHistory />
    </div>
  );
}
