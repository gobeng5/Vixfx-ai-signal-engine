import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SignalHistory() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/signals')
      .then(res => setSignals(res.data))
      .catch(err => console.error('Failed to fetch signals:', err));
  }, []);

  const updateResult = async (id, result) => {
    try {
      await axios.put(`http://localhost:5000/api/signals/${id}`, { result });
      setSignals(prev =>
        prev.map(sig => sig._id === id ? { ...sig, result } : sig)
      );
    } catch (err) {
      console.error('Failed to update result:', err);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📋 Signal History</h2>
      {signals.length === 0 ? (
        <p>No signals yet.</p>
      ) : (
        signals.map(signal => (
          <div key={signal._id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: signal.result === 'win' ? '#e6ffed' :
                             signal.result === 'loss' ? '#ffe6e6' : '#fff'
          }}>
            <strong>{signal.type.toUpperCase()} | {signal.direction}</strong><br />
            Entry: {signal.entry} | SL: {signal.sl} | TP1: {signal.tp1}<br />
            Confidence: {signal.confidence}%<br />
            Note: {signal.note}<br />
            Result: {signal.result}
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => updateResult(signal._id, 'win')}>✅ Win</button>
              <button onClick={() => updateResult(signal._id, 'loss')} style={{ marginLeft: '0.5rem' }}>❌ Loss</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
