import express from 'express';
import { scoreSignal } from '../strategies/scoreSignal.js';

const router = express.Router();

router.post('/live', (req, res) => {
  const { symbol, price, history } = req.body;

  if (!symbol || !price || !history || history.length < 50) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const score = scoreSignal(history);

  if (score.total >= 80) {
    const direction = score.reasons.includes('Uptrend (EMA20 > EMA50)') ? 'buy' : 'sell';

    return res.json({
      data: {
        direction,
        entry: price,
        sl: direction === 'buy' ? price - 100 : price + 100,
        tp1: direction === 'buy' ? price + 100 : price - 100,
        tp2: direction === 'buy' ? price + 200 : price - 200,
        tp3: direction === 'buy' ? price + 300 : price - 300,
        confidence: score.total,
        note: score.reasons.join(', ')
      }
    });
  } else {
    return res.json({ data: null });
  }
});

export default router;
