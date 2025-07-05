import WebSocket from 'ws';
import axios from 'axios';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const SYMBOLS = ['R_10', 'R_25', 'R_50', 'R_75', 'R_100', 'BOOM1000', 'BOOM500', 'CRASH1000', 'CRASH500'];

async function fetchCandles(symbol) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error(`Timeout while fetching candles for ${symbol}`));
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


async function analyzeAndSend(symbol) {
  try {
    const history = await fetchCandles(symbol);
    const price = history[history.length - 1].close;

    const { data } = await axios.post('https://vixfx-ai-signal-engine.onrender.com/api/live', {
      symbol,
      price,
      history
    });

    const signal = data.data;
    if (signal && signal.direction && signal.confidence >= 80) {
      const message = `
📡 *VixFX Signal*
Symbol: ${symbol}
Direction: ${signal.direction.toUpperCase()}
Entry: ${signal.entry}
SL: ${signal.sl}
TP1: ${signal.tp1}
TP2: ${signal.tp2}
TP3: ${signal.tp3}
Confidence: ${signal.confidence}%
Note: ${signal.note}
      `;

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      });

      console.log(`✅ Signal sent for ${symbol}`);
    } else {
      console.log(`⚠️ No strong signal for ${symbol}`);
    }
  } catch (err) {
    console.error(`❌ Error for ${symbol}:`, err.message);
  }
}

async function runAll() {
  for (const symbol of SYMBOLS) {
    await analyzeAndSend(symbol);
  }
}

runAll(); // ✅ Run once and exit (perfect for GitHub Actions)
