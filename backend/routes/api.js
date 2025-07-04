import { computeIndicators } from '../utils/indicators.js';

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

  const sl = (price - indicators.atr * 1.5).toFixed(2);
  const tp1 = (price + indicators.atr * 1.5).toFixed(2);
  const tp2 = (price + indicators.atr * 2).toFixed(2);
  const tp3 = (price + indicators.atr * 3).toFixed(2);

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

  const saved = await Signal.create({
    type: 'live',
    ...signal
  });

  res.json({ data: saved });
});
