import { scoreSignal } from './strategies/scoreSignal.js';

// Inside analyzeAndSend():
const score = scoreSignal(history);

if (score.total >= 80) {
  const direction = score.reasons.includes('Uptrend (EMA20 > EMA50)') ? 'buy' : 'sell';

  const message = `
📡 *VixFX Signal*
Symbol: ${symbol}
Direction: ${direction.toUpperCase()}
Entry: ${price}
SL: ${direction === 'buy' ? price - 100 : price + 100}
TP1: ${direction === 'buy' ? price + 100 : price - 100}
TP2: ${direction === 'buy' ? price + 200 : price - 200}
TP3: ${direction === 'buy' ? price + 300 : price - 300}
Confidence: ${score.total}%
Note: ${score.reasons.join(', ')}
  `;

  // Send to Telegram...
}
