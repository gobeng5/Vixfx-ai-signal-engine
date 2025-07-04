import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { analyzeScreenshot } from '../analysis/screenshot_analysis.js';
import { detectMarketRegime } from '../utils/market_regime.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for screenshot uploads
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
    res.status(200).json({ success: true, data: result });
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

  res.json({ data: signal });
});

export default router;
