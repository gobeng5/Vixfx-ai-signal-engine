import { useState } from 'react';
import axios from 'axios';

export default function SignalForm() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [history, setHistory] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const parsedHistory = JSON.parse(history);
      const response = await axios.post('https://vixfx-ai-signal-engine.onrender.com/api/live', {
        symbol,
        price: parseFloat(price),
        history: parsedHistory
      });

      setResult(response.data.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">📡 VixFX Signal Engine</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Symbol (e.g. BTCUSD)"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Current Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Paste 50-candle history as JSON"
          value={history}
          onChange={e => setHistory(e.target.value)}
          rows={10}
          className="w-full p-2 border rounded font-mono text-sm"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Analyzing...' : 'Generate Signal'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          {result.error ? (
            <p className="text-red-600 font-semibold">❌ {result.error}</p>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-2">✅ Signal Generated</h2>
              <p><strong>Direction:</strong> {result.direction}</p>
              <p><strong>Entry:</strong> {result.entry}</p>
              <p><strong>SL:</strong> {result.sl}</p>
              <p><strong>TP1:</strong> {result.tp1}</p>
              <p><strong>TP2:</strong> {result.tp2}</p>
              <p><strong>TP3:</strong> {result.tp3}</p>
              <p><strong>Confidence:</strong> {result.confidence}%</p>
              <p><strong>Note:</strong> {result.note}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
