// backend/fetchCandles.js
export default async function fetchCandles(symbol) {
  const ws = new WebSocket('wss://ws.derivws.com/websockets/v3');

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({
        ticks_history: symbol,
        end: 'latest',
        style: 'candles',
        granularity: 60, // 1-minute candles
        count: 100
      }));
    };

    ws.onmessage = (msg) => {
      const response = JSON.parse(msg.data);

      if (response.error) {
        console.error(`❌ Deriv API error for ${symbol}:`, response.error.message);
        ws.close();
        return reject(response.error.message);
      }

      if (response.history?.candles) {
        const candles = response.history.candles.map(c => ({
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          epoch: c.epoch
        }));
        ws.close();
        resolve(candles);
      }
    };

    ws.onerror = (err) => {
      console.error(`❌ WebSocket error for ${symbol}:`, err.message);
      ws.close();
      reject(err.message);
    };
  });
}
