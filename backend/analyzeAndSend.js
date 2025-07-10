// backend/analyzeAndSend.js

import { SYMBOLS } from './symbols.js';
import fetchCandles from './fetchCandles.js';
import Signal from './models/Signal.js';

export default async function analyzeAndSend(symbol, candles) {
  if (!candles || candles.length < 2) {
    console.warn(`⚠️ Not enough data to analyze ${symbol}`);
    return;
  }

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const direction = last.close > last.open ? 'buy' : 'sell';
  const spread = Math.abs(last.close - last.open);
  const volatility = Math.max(last.high - last.low, prev.high - prev.low);
  const momentum = last.close - prev.close;

  let confidence = 50;
  let notes = [];

  // 📈 Signal scoring logic
  if (spread > volatility * 0.6) {
    confidence += 20;
    notes.push('Strong candle body');
  }

  if (Math.abs(momentum) > spread * 0.5) {
    confidence += 15;
    notes.push('Momentum continuation');
  }

  if (last.close > last.high || last.close < last.low) {
    confidence += 10;
    notes.push('Breakout candle');
  }

  // 🧠 Optional: Tailored logic per asset class
  if (symbol.includes('BOOM') || symbol.includes('CRASH')) {
    notes.push('Synthetic spike-prone asset');
    confidence += 5;
  }

  if (confidence >= 80) {
    const signal = {
      symbol,
      direction,
      confidence,
      entry: last.close,
      tp1: direction === 'buy' ? last.close + spread * 1.5 : last.close - spread * 1.5,
      tp2: direction === 'buy' ? last.close + spread * 2.5 : last.close - spread * 2.5,
      tp3: direction === 'buy' ? last.close + spread * 4 : last.close - spread * 4,
      sl: direction === 'buy' ? last.low : last.high,
      notes,
      timestamp: new Date()
    };

    await Signal.create(signal);
    console.log(`✅ ${symbol} signal saved: ${direction.toUpperCase()} @ ${last.close} [${confidence}%]`);
  } else {
    console.log(`🔍 ${symbol} evaluated — no signal triggered (${confidence}%)`);
  }
}
