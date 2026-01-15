import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// GET /api/songs - Fetch all songs
router.get('/', async (_req, res) => {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { title: 'asc' },
    });

    // Map to frontend format
    const mapped = songs.map(s => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      spotify_url: s.spotifyUrl,
      created_at: s.createdAt.toISOString(),
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// POST /api/songs - Create a new song
router.post('/', async (req, res) => {
  try {
    const { title, artist, spotify_url } = req.body;

    const song = await prisma.song.create({
      data: {
        title,
        artist,
        spotifyUrl: spotify_url,
      },
    });

    res.status(201).json({
      id: song.id,
      title: song.title,
      artist: song.artist,
      spotify_url: song.spotifyUrl,
      created_at: song.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: 'Failed to create song' });
  }
});

// DELETE /api/songs/:id - Delete a song
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.song.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

export default router;
