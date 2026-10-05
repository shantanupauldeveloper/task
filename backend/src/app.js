import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import taskRoutes from './routes/tasks.js';

export const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*' }));
app.use(express.json());

// Connection is cached so serverless invocations reuse it.
let conn;
export function connectDb(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('MONGODB_URI is not set');
  return (conn ??= mongoose.connect(uri));
}

const prefixes = (p) => [`/api${p}`, `/.netlify/functions/api${p}`];

app.get(prefixes('/health'), (_req, res) => res.json({ ok: true }));
app.use(prefixes('/tasks'), async (_req, _res, next) => {
  try { await connectDb(); next(); } catch (e) { next(e); }
}, taskRoutes);

app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors)[0].message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  console.error(err);
  res.status(500).json({ message: err.message === 'MONGODB_URI is not set' ? err.message : 'Server error' });
});
