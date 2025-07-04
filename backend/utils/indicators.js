import {
  RSI,
  MACD,
  ADX,
  ATR,
  BollingerBands
} from 'technicalindicators';

export function computeIndicators(history) {
  const closes = history.map(p => p.close);
  const highs = history.map(p => p.high || p.close); // fallback if high is missing
  const lows = history.map(p => p.low || p.close);   // fallback if low is missing

  const rsi = RSI.calculate({ values: closes, period: 14 }).slice(-1)[0];
  const atr = ATR.calculate({ high: highs, low: lows, close: closes, period: 14 }).slice(-1)[0];
  const adx = ADX.calculate({ high: highs, low: lows, close: closes, period: 14 }).slice(-1)[0]?.adx;

  const macdSeries = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
  const macd = macdSeries.slice(-1)[0];

  const bb = BollingerBands.calculate({
    period: 20,
    values: closes,
    stdDev: 2
  }).slice(-1)[0];

  return {
    rsi,
    atr,
    adx,
    macd,
    bb
  };
}
