import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { analyzeScreenshot } from '../analysis/screenshot_analysis.js';
import { detectMarketRegime } from '../utils/market_regime.js';
import { optimizeStrategies } from '../optimizer/strategy_optimizer.js';
import Signal from '../models/Signal.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Screenshot upload route
router.post('/upload', upload.single('screenshot'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const result = await analyzeScreenshot(imagePath);

    const saved = await Signal.create({
      type: 'screenshot',
      ...result
    });

    res.status(200).json({ success: true, data: saved });
  } catch (err) {
    console.error('❌ Screenshot analysis error:', err);
    res.status(500).json({ success: false, error: 'Analysis failed' });
  }
});

// Live chart analysis route
router.post('/live', async (req, res) => {
  const { symbol, price, history } = req.body;

  const regime = detectMarketRegime(history || [price]);

  let signal = {
    direction: 'Neutral',
    entry: price.toFixed(2),
    sl: (price - 3).toFixed(2),
    tp1: (price + 3).toFixed(2),
    tp2: (price + 6).toFixed(2),
    tp3: (price + 9).toFixed(2),
    confidence: 70,
    note: `Market regime: ${regime}`
  };

  if (regime === 'trending') {
    signal.direction = price % 2 === 0 ? 'Buy' : 'Sell';
    signal.confidence = 85;
    signal.note += ' — trend-following strategy applied';
  } else if (regime === 'ranging') {
    signal.direction = 'Buy';
    signal.sl = (price - 2).toFixed(2);
    signal.tp1 = (price + 2).toFixed(2);
    signal.confidence = 78;
    signal.note += ' — range-reversal strategy applied';
  } else {
    signal.note += ' — no clear edge, neutral stance';
  }

  const saved = await Signal.create({
    type: 'live',
    ...signal
  });

  res.json({ data: saved });
});

// Get all signals
router.get('/signals', async (req, res) => {
  const signals = await Signal.find().sort({ createdAt: -1 });
  res.json(signals);
});

// Update signal result (win/loss)
router.put('/signals/:id', async (req, res) => {
  const { result } = req.body;
  const updated = await Signal.findByIdAndUpdate(req.params.id, { result }, { new: true });
  res.json(updated);
});

// Stats route
router.get('/stats', async (req, res) => {
  const total = await Signal.countDocuments();
  const wins = await Signal.countDocuments({ result: 'win' });
  const losses = await Signal.countDocuments({ result: 'loss' });

  res.json({
    total,
    wins,
    losses,
    winRate: total ? ((wins / total) * 100).toFixed(2) + '%' : '0%'
  });
});

// Strategy optimizer route
router.get('/optimize', async (req, res) => {
  const summary = await optimizeStrategies();
  res.json(summary);
});

export default router;
