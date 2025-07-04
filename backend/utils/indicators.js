import {
  RSI,
  MACD,
  BollingerBands,
  ATR,
  ADX,
  EMA
} from 'technicalindicators';

export function computeIndicators(prices) {
  const close = prices.map(p => p.close);
  const high = prices.map(p => p.high);
  const low = prices.map(p => p.low);

  const rsi = RSI.calculate({ values: close, period: 14 }).slice(-1)[0];
  const macd = MACD.calculate({
    values: close,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  }).slice(-1)[0];

  const bb = BollingerBands.calculate({
    period: 20,
    values: close,
    stdDev: 2
  }).slice(-1)[0];

  const atr = ATR.calculate({ high, low, close, period: 14 }).slice(-1)[0];
  const adx = ADX.calculate({ high, low, close, period: 14 }).slice(-1)[0];
  const ema50 = EMA.calculate({ values: close, period: 50 }).slice(-1)[0];
  const ema200 = EMA.calculate({ values: close, period: 200 }).slice(-1)[0];

  return {
    rsi,
    macd,
    bb,
    atr,
    adx: adx?.adx,
    ema50,
    ema200
  };
}
