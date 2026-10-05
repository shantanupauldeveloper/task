import 'dotenv/config';
import { app, connectDb } from './app.js';

async function resolveUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  // Local dev fallback: in-memory MongoDB so the app runs with zero setup.
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mem = await MongoMemoryServer.create();
  console.log('MONGODB_URI not set — using in-memory MongoDB (data resets on restart)');
  return mem.getUri();
}

const port = process.env.PORT || 5001;
await connectDb(await resolveUri());
app.listen(port, () => console.log(`API listening on :${port}`));
