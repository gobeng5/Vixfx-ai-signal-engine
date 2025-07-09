import express from 'express';
import cors from 'cors';
import analyzeAndSend from './analyzeAndSend.js';
import fetchCandles from './fetchCandles.js'; // Modularize WebSocket
import { SYMBOLS } from './symbols.js';

const app = express();
app.use(cors());
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Manual trigger endpoint
app.get('/api/run', async (req, res) => {
  console.log('🚀 Manual run initiated via /api/run');
  await Promise.all(
    SYMBOLS.map(async symbol => {
      const history = await fetchCandles(symbol);
      await analyzeAndSend(symbol, history);
    })
  );
  res.json({ success: true });
});

// Optional: health check
app.get('/', (req, res) => {
  res.send('✅ VixFX Signal Engine is running');
});

// Auto-run for scheduler
if (process.env.MODE === 'cron') {
  (async () => {
    console.log('⏰ Running signal engine via scheduler');
    await Promise.all(
      SYMBOLS.map(async symbol => {
        const history = await fetchCandles(symbol);
        await analyzeAndSend(symbol, history);
      })
    );
    process.exit(0);
  })();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ VixFX Signal Engine listening on port ${PORT}`);
});
