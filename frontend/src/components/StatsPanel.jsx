import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StatsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div style={{
      marginTop: '2rem',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>📊 Performance Stats</h2>
      <p><strong>Total Signals:</strong> {stats.total}</p>
      <p><strong>Wins:</strong> {stats.wins}</p>
      <p><strong>Losses:</strong> {stats.losses}</p>
      <p><strong>Win Rate:</strong> {stats.winRate}</p>
    </div>
  );
}
