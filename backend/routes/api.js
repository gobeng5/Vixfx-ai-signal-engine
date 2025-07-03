import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeScreenshot } from '../analysis/screenshot_analysis.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Multer to handle image uploads to a temporary folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('screenshot'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const result = await analyzeScreenshot(imagePath);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('❌ Error analyzing screenshot:', err);
    res.status(500).json({ success: false, error: 'Analysis failed' });
  }
});

export default router;
