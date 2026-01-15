import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Wheel colors palette
const WHEEL_COLORS = [
  '#E53935', // Rouge Noel
  '#43A047', // Vert sapin
  '#FDD835', // Or
  '#1E88E5', // Bleu glace
  '#8E24AA', // Violet
  '#FB8C00', // Orange
  '#00ACC1', // Cyan
  '#D81B60', // Rose
];

// Get next available color
const getNextColor = (usedColors: string[]): string => {
  const availableColors = WHEEL_COLORS.filter(c => !usedColors.includes(c));
  if (availableColors.length > 0) {
    return availableColors[0];
  }
  return WHEEL_COLORS[usedColors.length % WHEEL_COLORS.length];
};

// GET /api/participants - Fetch all participants
router.get('/', async (_req, res) => {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { name: 'asc' },
    });

    // Map to frontend format (camelCase to snake_case for compatibility)
    const mapped = participants.map(p => ({
      id: p.id,
      name: p.name,
      photo_url: p.photoUrl,
      color: p.color,
      created_at: p.createdAt.toISOString(),
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// POST /api/participants - Create a new participant
router.post('/', async (req, res) => {
  try {
    const { name, photo_url } = req.body;

    // Get all existing colors to assign next available
    const existing = await prisma.participant.findMany({
      select: { color: true },
    });
    const usedColors = existing.map(p => p.color);
    const color = getNextColor(usedColors);

    const participant = await prisma.participant.create({
      data: {
        name,
        photoUrl: photo_url,
        color,
      },
    });

    res.status(201).json({
      id: participant.id,
      name: participant.name,
      photo_url: participant.photoUrl,
      color: participant.color,
      created_at: participant.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(500).json({ error: 'Failed to create participant' });
  }
});

// PUT /api/participants/:id - Update a participant
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo_url } = req.body;

    const participant = await prisma.participant.update({
      where: { id },
      data: {
        name,
        photoUrl: photo_url,
      },
    });

    res.json({
      id: participant.id,
      name: participant.name,
      photo_url: participant.photoUrl,
      color: participant.color,
      created_at: participant.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating participant:', error);
    res.status(500).json({ error: 'Failed to update participant' });
  }
});

// DELETE /api/participants/:id - Delete a participant
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.participant.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting participant:', error);
    res.status(500).json({ error: 'Failed to delete participant' });
  }
});

export default router;
