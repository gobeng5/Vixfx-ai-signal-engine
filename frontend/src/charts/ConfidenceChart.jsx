import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ConfidenceChart({ signals }) {
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // 💡 Prepare chart data from incoming signals
  useEffect(() => {
    if (!signals || signals.length === 0) return;

    const sorted = [...signals].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    const labels = sorted.map((s) =>
      new Date(s.timestamp).toLocaleDateString()
    );
    const data = sorted.map((s) => s.confidence);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Signal Confidence',
          data,
          fill: false,
          borderColor: '#4f46e5',
          backgroundColor: '#818cf8',
          tension: 0.3,
        },
      ],
    });
  }, [signals]);

  // 🧠 Fetch backend stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('https://vixfx-backend.onrender.com/api/stats');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setStats(json);
      } catch (err) {
        console.error('❌ Stats fetch failed:', err);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">🧠 Confidence Over Time</h2>

      {/* 📊 Backend Stats Summary */}
      {!loadingStats && stats && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6 text-sm text-indigo-900 shadow">
          <p>📦 Total Signals: <strong>{stats.total}</strong></p>
          <p>✅ Confidence Hits (≥ 80): <strong>{stats.hits}</strong></p>
          <p>📈 Avg Confidence: <strong>{stats.confidence}%</strong></p>
        </div>
      )}

      {/* 📉 Confidence Line Chart */}
      {chartData ? (
        <div className="bg-white p-4 rounded shadow">
          <Line data={chartData} />
        </div>
      ) : (
        <p className="text-gray-500">No signal data available to render chart.</p>
      )}
    </section>
  );
}
