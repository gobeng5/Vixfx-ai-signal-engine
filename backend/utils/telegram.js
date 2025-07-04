import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

export function sendSignalToTelegram(signal) {
  const {
    direction, entry, sl, tp1, tp2, tp3, confidence, note
  } = signal;

  const message = `
📡 *New Signal Alert*
*Direction:* ${direction}
*Entry:* ${entry}
*SL:* ${sl}
*TP1:* ${tp1}
*TP2:* ${tp2}
*TP3:* ${tp3}
*Confidence:* ${confidence}%
🧠 _${note}_
  `.trim();

  return bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });
}
