import express from 'express';
import { computeIndicators } from '../utils/indicators.js';
import { detectMarketRegime } from '../utils/regime.js';
import { sendSignalToTelegram } from '../utils/telegram.js'; // ✅ NEW

const router = express.Router();

router.post('/live', async (req, res) => {
  const { symbol, price, history } = req.body;

  if (!history || history.length < 50) {
    return res.status(400).json({ error: 'Not enough price history for indicators' });
  }

  const indicators = computeIndicators(history);
  const regime = detectMarketRegime(history.map(p => p.close));

  let direction = 'Neutral';
  let confidence = 60;
  let note = `Market regime: ${regime}`;

  if (regime === 'trending' && indicators.adx > 20 && indicators.macd?.MACD > indicators.macd?.signal) {
    direction = 'Buy';
    confidence = 85;
    note += ' — strong trend confirmed by ADX & MACD';
  } else if (regime === 'ranging' && indicators.rsi < 30) {
    direction = 'Buy';
    confidence = 78;
    note += ' — RSI oversold in range';
  } else if (regime === 'ranging' && indicators.rsi > 70) {
    direction = 'Sell';
    confidence = 78;
    note += ' — RSI overbought in range';
  } else if (regime === 'consolidating' && indicators.bb && price < indicators.bb.lower) {
    direction = 'Buy';
    confidence = 75;
    note += ' — Bollinger Band bounce';
  }

  let sl = 'N/A', tp1 = 'N/A', tp2 = 'N/A', tp3 = 'N/A';

  if (indicators.atr) {
    sl = (price - indicators.atr * 1.5).toFixed(2);
    tp1 = (price + indicators.atr * 1.5).toFixed(2);
    tp2 = (price + indicators.atr * 2).toFixed(2);
    tp3 = (price + indicators.atr * 3).toFixed(2);
  }

  const signal = {
    direction,
    entry: price.toFixed(2),
    sl,
    tp1,
    tp2,
    tp3,
    confidence,
    note
  };

  const saved = { id: 'mock-id', type: 'live', ...signal };

  await sendSignalToTelegram(signal); // ✅ Send to Telegram

  res.json({ data: saved });
});

export default router;
