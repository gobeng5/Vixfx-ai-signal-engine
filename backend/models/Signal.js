import mongoose from 'mongoose';

const SignalSchema = new mongoose.Schema({
  type: { type: String },          // 'live' or 'screenshot'
  direction: { type: String },     // 'buy' or 'sell'
  entry: { type: String },
  sl: { type: String },
  tp1: { type: String },
  tp2: { type: String },
  tp3: { type: String },
  confidence: { type: Number },
  note: { type: String },
  result: { type: String, default: 'pending' }, // 'win', 'loss', 'pending'
  symbol: { type: String },        // used for stats filtering
  createdAt: { type: Date, default: Date.now }
});

const SignalModel = mongoose.model('Signal', SignalSchema);
export default SignalModel;
