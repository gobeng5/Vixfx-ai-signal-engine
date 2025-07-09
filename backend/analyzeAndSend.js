import axios from 'axios';
import { scoreSignal } from './strategies/scoreSignal.js';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function analyzeAndSend(symbol, history) {
  try {
    const price = history[history.length - 1].close;
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

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      });

      console.log(`✅ Signal sent for ${symbol}`);
    } else {
      console.log(`⚠️ No strong signal for ${symbol} (score: ${score.total})`);
    }
  } catch (err) {
    console.error(`❌ Error analyzing ${symbol}:`, err.message);
  }
}

export default analyzeAndSend;
