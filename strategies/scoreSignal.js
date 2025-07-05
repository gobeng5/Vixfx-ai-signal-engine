export function scoreSignal(candles) {
  const score = {
    total: 0,
    reasons: [],
  };

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  // === Trend (EMA 20 vs EMA 50) ===
  const ema = (period) => {
    const k = 2 / (period + 1);
    return candles.reduce((acc, c, i) => {
      if (i === 0) return c.close;
      return c.close * k + acc * (1 - k);
    }, candles[0].close);
  };

  const ema20 = ema(20);
  const ema50 = ema(50);

  if (ema20 > ema50) {
    score.total += 25;
    score.reasons.push('Uptrend (EMA20 > EMA50)');
  }

  // === Momentum (RSI) ===
  const rsi = (() => {
    let gains = 0, losses = 0;
    for (let i = 1; i < candles.length; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      if (diff > 0) gains += diff;
      else losses -= diff;
    }
    const rs = gains / (losses || 1);
    return 100 - 100 / (1 + rs);
  })();

  if (rsi > 55) {
    score.total += 20;
    score.reasons.push(`Bullish momentum (RSI ${rsi.toFixed(1)})`);
  }

  // === Price Action (Bullish Engulfing) ===
  const isBullishEngulfing = (
    prev.close < prev.open &&
    last.close > last.open &&
    last.close > prev.open &&
    last.open < prev.close
  );

  if (isBullishEngulfing) {
    score.total += 25;
    score.reasons.push('Bullish engulfing pattern');
  }

  // === Volatility (ATR) ===
  const atr = candles.reduce((acc, c, i) => {
    if (i === 0) return 0;
    const range = Math.max(
      c.high - c.low,
      Math.abs(c.high - candles[i - 1].close),
      Math.abs(c.low - candles[i - 1].close)
    );
    return acc + range;
  }, 0) / (candles.length - 1);

  const lastRange = last.high - last.low;
  if (lastRange > atr * 0.8) {
    score.total += 20;
    score.reasons.push('Healthy volatility (ATR filter passed)');
  }

  return score;
}
