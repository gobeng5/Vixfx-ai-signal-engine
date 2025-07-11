import mongoose from 'mongoose';

const SignalSchema = new mongoose.Schema({
  type: String, // 'live' or 'screenshot'
  symbol: String
  direction: String,
  entry: String,
  sl: String,
  tp1: String,
  tp2: String,
  tp3: String,
  confidence: Number,
  note: String,
  result: { type: String, default: 'pending' }, // 'win', 'loss', 'pending'
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Signal', SignalSchema);
