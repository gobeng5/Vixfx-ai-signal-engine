import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { sendSignal } from '../services/telegram_bot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PY_SCRIPT_PATH = path.join(__dirname, '../../ml-core/image_processing/vision_pipeline.py');

// Replace with your actual Telegram chat ID (or load from .env)
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'your_chat_id_here';

export const analyzeScreenshot = async (imagePath) => {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [PY_SCRIPT_PATH, imagePath]);

    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      fs.unlink(imagePath, () => {});

      if (code !== 0) {
        return reject(`Python script error: ${error}`);
      }

      try {
        const result = JSON.parse(output);

        // ✅ Send to Telegram if confidence is high
        if (result.confidence >= 80) {
          sendSignal(TELEGRAM_CHAT_ID, result);
        }

        resolve(result);
      } catch (err) {
        reject(`Failed to parse AI output: ${err}`);
      }
    });
  });
};
