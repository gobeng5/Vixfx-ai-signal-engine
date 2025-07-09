import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import analyzeAndSend from './analyzeAndSend.js';
import fetchCandles from './fetchCandles.js';
import { SYMBOLS } from './symbols.js';
import signalsRoutes from './routes/signals.js';

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// 🔌 Register /api/signals route
app.use('/api/signals', signalsRoutes);

// 🧠 Manual trigger endpoint
app.get('/api/run', async (req, res) => {
  console.log('🚀 Manual run initiated via /api/run');
  try {
    await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const history = await fetchCandles(symbol);
        await analyzeAndSend(symbol, history);
      })
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Manual run failed:', err);
    res.status(500).json({ error: 'Signal engine error' });
  }
});

// ❤️ Health check
app.get('/', (req, res) => {
  res.send('✅ VixFX Signal Engine is running');
});

// ⏰ Auto-run when mode is cron
if (process.env.MODE === 'cron') {
  (async () => {
    console.log('⏰ Running signal engine via scheduler');
    try {
      await Promise.all(
        SYMBOLS.map(async (symbol) => {
          const history = await fetchCandles(symbol);
          await analyzeAndSend(symbol, history);
        })
      );
    } catch (err) {
      console.error('❌ Cron job error:', err);
    }
    process.exit(0);
  })();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ VixFX Signal Engine listening on port ${PORT}`);
});
