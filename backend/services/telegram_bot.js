import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Optional: handle /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Welcome to VixFx AI Signal Bot! Get ready for market-moving alerts.`);
});

// Function to send formatted signal to a Telegram chat
export const sendSignal = (chatId, signal) => {
  const message = `
📢 *VixFx Signal* 🚦

*Direction:* ${signal.direction}
*Entry:* ${signal.entry}
*Stop Loss:* ${signal.sl}
*Take Profit 1:* ${signal.tp1}
*Take Profit 2:* ${signal.tp2}
*Take Profit 3:* ${signal.tp3}
*Confidence:* ${signal.confidence}%

📝 _${signal.note}_
`;

  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
};

export default bot;
