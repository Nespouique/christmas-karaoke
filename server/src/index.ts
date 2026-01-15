import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { prisma } from './lib/prisma.js';
import participantsRouter from './routes/participants.js';
import songsRouter from './routes/songs.js';
import punchlinesRouter from './routes/punchlines.js';
import spotifyRouter from './routes/spotify.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Re-export prisma for routes
export { prisma };

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // For base64 images

// API Routes
app.use('/api/participants', participantsRouter);
app.use('/api/songs', songsRouter);
app.use('/api/punchlines', punchlinesRouter);
app.use('/api/spotify', spotifyRouter);

// Serve static files from the frontend build
const staticPath = path.join(process.cwd(), 'public');
app.use(express.static(staticPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(staticPath, 'index.html'));
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
