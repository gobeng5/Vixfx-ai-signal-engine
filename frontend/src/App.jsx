import React from 'react';
import SignalTable from './components/SignalTable.jsx';
import StatsPanel from './components/StatsPanel.jsx';

export default function App() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">📊 VixFX AI Signal Dashboard</h1>
      <StatsPanel />
      <SignalTable />
    </main>
  );
}

