import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import SignalCard from '../components/SignalCard';
import SignalChart from '../components/SignalChart';

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

      <h2 style={{ marginTop: '2rem' }}>📋 Signal History</h2>
      {signals.length === 0 ? (
        <p>No signals yet. Upload a chart to get started.</p>
      ) : (
        signals.map((signal, index) => (
          <SignalCard key={index} signal={signal} />
        ))
      )}
    </div>
  );
}
