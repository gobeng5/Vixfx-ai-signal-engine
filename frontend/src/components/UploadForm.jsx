import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connectToDeriv } from '../utils/derivClient';

export default function UploadForm({ onSignal }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useLiveChart, setUseLiveChart] = useState(false);
  const [livePrice, setLivePrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (useLiveChart) {
      const ws = connectToDeriv('R_75');
      setSocket(ws);

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.tick) {
          const newPrice = data.tick.quote;
          setLivePrice(newPrice);
          setPriceHistory(prev => [...prev.slice(-99), newPrice]);
        }
      };

      return () => ws.close();
    } else {
      if (socket) socket.close();
    }
  }, [useLiveChart]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (useLiveChart) {
      if (!livePrice || priceHistory.length < 50) {
        alert('Waiting for enough live data...');
        return;
      }

      const history = priceHistory.map(p => ({
        open: p,
        high: p + 1,
        low: p - 1,
        close: p
      }));

      setLoading(true);
      try {
        const res = await axios.post('http://localhost:5000/api/live', {
          symbol: 'R_75',
          price: livePrice,
          history
        });
        if (res.data?.data) {
          onSignal(res.data.data);
        } else {
          alert('No signal returned from AI.');
        }
      } catch (err) {
        console.error('Live analysis failed:', err);
        alert('Live chart analysis failed.');
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!image) {
      alert('Please select a screenshot to upload.');
      return;
    }

    const form = new FormData();
    form.append('screenshot', image);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', form);
      if (res.data?.data) {
        onSignal(res.data.data);
      } else {
        alert('No signal returned from AI.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Something went wrong while uploading the screenshot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={useLiveChart}
            onChange={(e) => setUseLiveChart(e.target.checked)}
          />
          {' '}Use Live Chart Mode
        </label>
        {useLiveChart && livePrice && (
          <span style={{ marginLeft: '1rem' }}>📡 Live Price: {livePrice.toFixed(2)}</span>
        )}
      </div>

      {!useLiveChart && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : useLiveChart ? 'Analyze Live Data' : 'Analyze Screenshot'}
      </button>
    </form>
  );
}
