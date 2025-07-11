import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import analyzeAndSend from './analyzeAndSend.js';
import fetchCandles from './fetchCandles.js';
import { SYMBOLS } from './symbols.js';
import signalsRoutes from './routes/signals.js';

const app = express();

// ✅ CORS: Allow frontend to access backend from Render
const allowedOrigins = ['https://vixfx-ai-signal-engine-1.onrender.com'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// 🔗 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// 📦 CRUD routes for signals
app.use('/api/signals', signalsRoutes);

// 🧠 Trigger signal analysis manually
app.get('/api/run', async (req, res) => {
  console.log('🚀 Manual signal run triggered');
  try {
    await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const history = await fetchCandles(symbol);
        await analyzeAndSend(symbol, history);
      })
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Run error:', err);
    res.status(500).json({ error: 'Signal engine error' });
  }
});

// 📊 Dashboard stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const Signal = (await import('./models/Signal.js')).default;
    const total = await Signal.countDocuments();
    const hits = await Signal.countDocuments({ confidence: { $gte: 80 } });

    const confidenceAvg = await Signal.aggregate([
      { $group: { _id: null, avg: { $avg: '$confidence' } } }
    ]);

    res.json({
      total,
      hits,
      confidence: Math.round(confidenceAvg[0]?.avg || 0)
    });
  } catch (err) {
    console.error('❌ Stats error:', err);
    res.status(500).json({ error: 'Stats generation failed' });
  }
});

// 🫀 Health check
app.get('/', (req, res) => {
  res.send('✅ VixFX Signal Engine is active');
});

// ⏰ Auto-trigger analysis in cron mode
if (process.env.MODE === 'cron') {
  (async () => {
    console.log('⏰ Cron-triggered signal engine start');
    try {
      await Promise.all(
        SYMBOLS.map(async (symbol) => {
          const history = await fetchCandles(symbol);
          await analyzeAndSend(symbol, history);
        })
      );
    } catch (err) {
      console.error('❌ Cron error:', err);
    }
    process.exit(0);
  })();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ VixFX backend listening on port ${PORT}`);
});
