import React, { useEffect, useState } from 'react';
import SignalTable from './components/SignalTable.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import ConfidenceChart from './charts/ConfidenceChart.jsx';
import { fetchSignals } from './api.js';

export default function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals()
      .then(data => {
        setSignals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch signals:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">📊 VixFX AI Signal Dashboard</h1>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <StatsPanel />
          <ConfidenceChart signals={signals} />
          <SignalTable signals={signals} />
        </>
      )}
    </main>
  );
}
