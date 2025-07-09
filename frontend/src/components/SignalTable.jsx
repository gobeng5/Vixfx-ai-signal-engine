import React, { useEffect, useState } from 'react';
import { fetchSignals } from '../api.js';

export default function SignalTable() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSymbol, setFilterSymbol] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('');

  useEffect(() => {
    fetchSignals()
      .then(data => {
        setSignals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching signals:', err);
        setLoading(false);
      });
  }, []);

  const filtered = signals.filter(s =>
    (!filterSymbol || s.symbol === filterSymbol) &&
    (!filterOutcome || s.outcome === filterOutcome)
  );

  const exportCSV = () => {
    const rows = filtered.map(s =>
      [
        s.timestamp,
        s.symbol,
        s.direction,
        s.confidence,
        s.entry,
        s.tp1,
        s.tp2,
        s.tp3,
        s.sl,
        s.outcome,
        `"${s.notes.join(', ')}"`
      ].join(',')
    );

    const header = [
      'timestamp',
      'symbol',
      'direction',
      'confidence',
      'entry',
      'tp1',
      'tp2',
      'tp3',
      'sl',
      'outcome',
      'notes'
    ].join(',');

    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'signals.csv';
    link.click();
  };

  return (
    <section className="mt-8">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📋 Signal History</h2>
        <button
          onClick={exportCSV}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
        >
          Export CSV
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          value={filterSymbol}
          onChange={e => setFilterSymbol(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800"
        >
          <option value="">All Symbols</option>
          {[...new Set(signals.map(s => s.symbol))].map(sym => (
            <option key={sym} value={sym}>{sym}</option>
          ))}
        </select>

        <select
          value={filterOutcome}
          onChange={e => setFilterOutcome(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800"
        >
          <option value="">All Outcomes</option>
          <option value="tp1">TP1 Hit</option>
          <option value="tp2">TP2 Hit</option>
          <option value="tp3">TP3 Hit</option>
          <option value="sl">SL Hit</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded text-sm">
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
              {filtered.map((s, index) => (
                <tr key={index} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="p-2">{s.symbol}</td>
                  <td className="p-2">{s.direction.toUpperCase()}</td>
                  <td className="p-2">
                    <span className={`font-semibold ${s.confidence >= 80 ? 'text-green-500' : s.confidence >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {s.confidence}%
                    </span>
                  </td>
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
