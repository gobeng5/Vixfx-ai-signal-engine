import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
// import connectDB from './db/mongo.js'; // ⛔️ Temporarily disabled

dotenv.config();
// connectDB(); // ⛔️ Temporarily disabled

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
