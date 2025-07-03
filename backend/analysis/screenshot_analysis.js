import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Python ML script
const PY_SCRIPT_PATH = path.join(__dirname, '../../ml-core/image_processing/vision_pipeline.py');

// Main function to analyze uploaded screenshot
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
      // Cleanup uploaded image
      fs.unlink(imagePath, () => {});

      if (code !== 0) {
        return reject(`Python script error: ${error}`);
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        reject(`Failed to parse AI output: ${err}`);
      }
    });
  });
};
