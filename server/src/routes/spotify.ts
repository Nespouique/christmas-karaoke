import { Router } from 'express';

const router = Router();

// POST /api/spotify/info - Extract song info from Spotify URL
router.post('/info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Extract track ID from URL
    const trackIdMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    if (!trackIdMatch) {
      return res.status(400).json({ error: 'Invalid Spotify URL' });
    }

    const trackId = trackIdMatch[1];

    // Use Spotify oEmbed API (no auth required)
    const oembedUrl = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const data = await response.json();

    // Parse title from oEmbed (format: "Track Name" by "Artist Name")
    // The title field contains "Song Name" and provider_name may have artist info
    // But typically it's in the format: title contains song name
    const title = data.title || '';

    // Try to extract artist from the HTML or description if available
    // oEmbed typically returns title as "Song - Artist" or just the song name
    let artist = '';

    if (data.description) {
      artist = data.description;
    } else if (title.includes(' - ')) {
      // Some formats use "Artist - Song" or "Song - Artist"
      const parts = title.split(' - ');
      if (parts.length === 2) {
        // Usually it's "Song - Artist" for Spotify
        artist = parts[1];
      }
    }

    res.json({
      title: title.replace(/ - .*$/, '').trim() || title, // Remove artist part if present
      artist: artist || 'Artiste inconnu',
    });
  } catch (error) {
    console.error('Error fetching Spotify info:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify info' });
  }
});

export default router;
