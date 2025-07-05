import express from 'express';
import cors from 'cors';
import liveRoute from './routes/live.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', liveRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ AI Signal Engine running on port ${PORT}`);
});
