import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StatsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('https://vixfx-ai-signal-engine.onrender.com/api/stats/winrate')
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.error('Failed to load stats', err);
      });
  }, []);

  if (!stats) return <p>📡 Loading performance stats...</p>;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">📈 Performance Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats.winrate).map(([symbol, rate]) => (
          <div
            key={symbol}
            className="bg-white dark:bg-gray-800 shadow rounded p-4 border dark:border-gray-700"
          >
            <h3 className="font-bold mb-2">{symbol}</h3>
            <p className="text-2xl">{rate}% win rate</p>
          </div>
        ))}
      </div>
    </section>
  );
}

