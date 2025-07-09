import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SignalTable() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://vixfx-ai-signal-engine.onrender.com/api/signals')
      .then(res => {
        setSignals(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching signals:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">📋 Signal History</h2>
      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800 text-left">
                <th className="p-2">Symbol</th>
                <th className="p-2">Direction</th>
                <th className="p-2">Confidence</th>
                <th className="p-2">Entry</th>
                <th className="p-2">TP1</th>
                <th className="p-2">SL</th>
                <th className="p-2">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((s, index) => (
                <tr key={index} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="p-2">{s.symbol}</td>
                  <td className="p-2">{s.direction.toUpperCase()}</td>
                  <td className="p-2">{s.confidence}%</td>
                  <td className="p-2">{s.entry}</td>
                  <td className="p-2">{s.tp1}</td>
                  <td className="p-2">{s.sl}</td>
                  <td className="p-2">{s.outcome || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

