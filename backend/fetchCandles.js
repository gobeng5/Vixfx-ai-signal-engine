import WebSocket from 'ws';

export default async function fetchCandles(symbol) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error(`⏱ Timeout while fetching candles for ${symbol}`));
    }, 10000); // 10 seconds

    ws.onopen = () => {
      ws.send(JSON.stringify({
        candles: symbol,
        subscribe: 0,
        count: 50,
        granularity: 60
      }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.candles) {
        clearTimeout(timeout);
        const candles = data.candles.map(c => ({
          open: +c.open,
          high: +c.high,
          low: +c.low,
          close: +c.close,
          volume: +c.volume || 0
        }));
        ws.close();
        resolve(candles);
      }
    };

    ws.onerror = (err) => {
      clearTimeout(timeout);
      reject(err);
    };
  });
}
