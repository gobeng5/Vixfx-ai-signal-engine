// backend/routes/signals.js
import express from 'express';
import Signal from '../models/Signal.js';

const router = express.Router();

// GET all signals
router.get('/', async (req, res) => {
  try {
    const signals = await Signal.find().sort({ timestamp: -1 });
    res.json(signals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch signals' });
  }
});

export default router;
