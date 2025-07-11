import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import analyzeAndSend from './analyzeAndSend.js';
import fetchCandles from './fetchCandles.js';
import { SYMBOLS } from './symbols.js';
import signalsRoutes from './routes/signals.js';
import { Parser } from 'json2csv'; // ← for CSV export

const app = express();

const allowedOrigins = ['https://vixfx-ai-signal-engine-1.onrender.com'];
app.use(cors({ origin: allowedOrigins, methods: ['GET'], credentials: true }));
app.use(express.json());

// 🔌 MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

app.use('/api/signals', signalsRoutes);

// 🧠 Manual run trigger
app.get('/api/run', async (req, res) => {
  try {
    await Promise.all(SYMBOLS.map(async symbol => {
      const history = await fetchCandles(symbol);
      await analyzeAndSend(symbol, history);
    }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Manual run failed' });
  }
});

// 📊 General stats
app.get('/api/stats', async (req, res) => {
  try {
    const Signal = (await import('./models/Signal.js')).default;
    const total = await Signal.countDocuments();
    const hits = await Signal.countDocuments({ confidence: { $gte: 80 } });
    const confidenceAvg = await Signal.aggregate([
      { $group: { _id: null, avg: { $avg: '$confidence' } } },
    ]);
    res.json({
      total,
      hits,
      confidence: Math.round(confidenceAvg[0]?.avg || 0)
    });
  } catch (err) {
    res.status(500).json({ error: 'Stats failed' });
  }
});

// 📊 Winrate stats
app.get('/api/stats/winrate', async (req, res) => {
  try {
    const Signal = (await import('./models/Signal.js')).default;
    const total = await Signal.countDocuments({ result: { $ne: 'pending' } });
    const wins = await Signal.countDocuments({ result: 'win' });
    const winrate = total > 0 ? Math.round((wins / total) * 100) : 0;

    res.json({ total, wins, winrate });
  } catch (err) {
    console.error('❌ Winrate error:', err);
    res.status(500).json({ error: 'Winrate calculation failed' });
  }
});

// 📊 Symbol-specific stats
app.get('/api/stats/:symbol', async (req, res) => {
  try {
    const Signal = (await import('./models/Signal.js')).default;
    const { symbol } = req.params;
    const total = await Signal.countDocuments({ symbol });
    const hits = await Signal.countDocuments({ symbol, confidence: { $gte: 80 } });
    const confidenceAvg = await Signal.aggregate([
      { $match: { symbol } },
      { $group: { _id: null, avg: { $avg: '$confidence' } } },
    ]);
    res.json({
      symbol,
      total,
      hits,
      confidence: Math.round(confidenceAvg[0]?.avg || 0)
    });
  } catch (err) {
    res.status(500).json({ error: 'Symbol stats failed' });
  }
});

// 📤 CSV export
app.get('/api/export', async (req, res) => {
  try {
    const Signal = (await import('./models/Signal.js')).default;
    const signals = await Signal.find().lean();
    const fields = ['type', 'direction', 'entry', 'sl', 'tp1', 'tp2', 'tp3', 'confidence', 'note', 'result', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(signals);

    res.header('Content-Type', 'text/csv');
    res.attachment('signals.csv');
    res.send(csv);
  } catch (err) {
    console.error('❌ Export error:', err);
    res.status(500).send('CSV export failed');
  }
});

// ❤️ Health check
app.get('/', (req, res) => {
  res.send('✅ Backend running');
});

// ⏰ Cron mode
if (process.env.MODE === 'cron') {
  (async () => {
    try {
      await Promise.all(SYMBOLS.map(async symbol => {
        const history = await fetchCandles(symbol);
        await analyzeAndSend(symbol, history);
      }));
    } catch (err) {
      console.error('❌ Cron error:', err);
    }
    process.exit(0);
  })();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend listening on port ${PORT}`));
