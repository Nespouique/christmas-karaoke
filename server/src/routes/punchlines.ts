import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

const DEFAULT_PUNCHLINE = "Une voix d'ange de Noel";

// GET /api/punchlines - Fetch all punchlines
router.get('/', async (_req, res) => {
  try {
    const punchlines = await prisma.punchline.findMany();

    const mapped = punchlines.map(p => ({
      id: p.id,
      text: p.text,
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching punchlines:', error);
    res.status(500).json({ error: 'Failed to fetch punchlines' });
  }
});

// GET /api/punchlines/random - Get a random punchline
router.get('/random', async (_req, res) => {
  try {
    const count = await prisma.punchline.count();

    if (count === 0) {
      return res.json({ text: DEFAULT_PUNCHLINE });
    }

    const skip = Math.floor(Math.random() * count);
    const punchline = await prisma.punchline.findFirst({
      skip,
    });

    res.json({ text: punchline?.text || DEFAULT_PUNCHLINE });
  } catch (error) {
    console.error('Error getting random punchline:', error);
    res.json({ text: DEFAULT_PUNCHLINE });
  }
});

// POST /api/punchlines - Create a new punchline
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    const punchline = await prisma.punchline.create({
      data: { text },
    });

    res.status(201).json({
      id: punchline.id,
      text: punchline.text,
    });
  } catch (error) {
    console.error('Error creating punchline:', error);
    res.status(500).json({ error: 'Failed to create punchline' });
  }
});

// DELETE /api/punchlines/:id - Delete a punchline
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.punchline.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting punchline:', error);
    res.status(500).json({ error: 'Failed to delete punchline' });
  }
});

export default router;
