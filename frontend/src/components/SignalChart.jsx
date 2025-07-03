import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function SignalChart({ signals }) {
  const data = {
    labels: signals.map((_, i) => `Signal ${i + 1}`),
    datasets: [
      {
        label: 'Confidence (%)',
        data: signals.map(s => s.confidence),
        borderColor: '#1e90ff',
        backgroundColor: 'rgba(30,144,255,0.2)',
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📊 Signal Confidence Trend</h2>
      <Line data={data} />
    </div>
  );
}
