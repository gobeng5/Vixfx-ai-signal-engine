import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ConfidenceChart({ signals }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!signals || signals.length === 0) return;

    const sorted = [...signals].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const labels = sorted.map(s => new Date(s.timestamp).toLocaleDateString());
    const data = sorted.map(s => s.confidence);

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

  if (!chartData) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">🧠 Confidence Over Time</h2>
      <Line data={chartData} />
    </section>
  );
}
