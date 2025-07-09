import React, { useEffect, useState } from 'react';
import { fetchWinRateStats } from '../api.js';

export default function StatsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchWinRateStats()
      .then(data => {
        setStats(data);
      })
      .catch(err => {
        console.error('Failed to load stats', err);
      });
  }, []);

  if (!stats) return <p>📡 Loading performance stats...</p>;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">📈 Performance Summary</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Object.entries(stats.winrate).map(([symbol, rate]) => (
          <div
            key={symbol}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded shadow text-center"
          >
            <h3 className="font-semibold">{symbol}</h3>
            <p className="text-xl font-bold text-green-500">{rate}%</p>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Win Rate</p>
          </div>
        ))}
      </div>
    </section>
  );
}
