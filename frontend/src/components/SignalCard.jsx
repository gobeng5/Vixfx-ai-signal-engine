import React from 'react';

export default function SignalCard({ signal }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: signal.confidence >= 80 ? '#e6ffed' : '#fff8e1'
    }}>
      <h3>{signal.direction} Signal</h3>
      <p><strong>Entry:</strong> {signal.entry}</p>
      <p><strong>Stop Loss:</strong> {signal.sl}</p>
      <p><strong>Take Profit 1:</strong> {signal.tp1}</p>
      <p><strong>Take Profit 2:</strong> {signal.tp2}</p>
      <p><strong>Take Profit 3:</strong> {signal.tp3}</p>
      <p><strong>Confidence:</strong> {signal.confidence}%</p>
      <p><em>{signal.note}</em></p>
    </div>
  );
}
