import type { Participant, Song, Punchline } from '@/types';
import { WHEEL_COLORS } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || '';

// Get a color for a new participant (client-side helper)
export const getNextColor = (existingParticipants: Participant[]): string => {
  const usedColors = existingParticipants.map(p => p.color);
  const availableColors = WHEEL_COLORS.filter(c => !usedColors.includes(c));

  if (availableColors.length > 0) {
    return availableColors[0];
  }

  // If all colors are used, cycle through
  return WHEEL_COLORS[existingParticipants.length % WHEEL_COLORS.length];
};

// ============ PARTICIPANTS ============

export const fetchParticipants = async (): Promise<Participant[]> => {
  try {
    const response = await fetch(`${API_URL}/api/participants`);
    if (!response.ok) throw new Error('Failed to fetch participants');
    return await response.json();
  } catch (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
};

export const createParticipant = async (
  name: string,
  photoUrl: string | null,
  _existingParticipants: Participant[] // Color is now assigned server-side
): Promise<Participant | null> => {
  try {
    const response = await fetch(`${API_URL}/api/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, photo_url: photoUrl }),
    });
    if (!response.ok) throw new Error('Failed to create participant');
    return await response.json();
  } catch (error) {
    console.error('Error creating participant:', error);
    return null;
  }
};

export const updateParticipant = async (
  id: string,
  name: string,
  photoUrl: string | null
): Promise<Participant | null> => {
  try {
    const response = await fetch(`${API_URL}/api/participants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, photo_url: photoUrl }),
    });
    if (!response.ok) throw new Error('Failed to update participant');
    return await response.json();
  } catch (error) {
    console.error('Error updating participant:', error);
    return null;
  }
};

export const deleteParticipant = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/participants/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting participant:', error);
    return false;
  }
};

// ============ SONGS ============

export const fetchSongs = async (): Promise<Song[]> => {
  try {
    const response = await fetch(`${API_URL}/api/songs`);
    if (!response.ok) throw new Error('Failed to fetch songs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
};

export const createSong = async (
  title: string,
  artist: string,
  spotifyUrl: string
): Promise<Song | null> => {
  try {
    const response = await fetch(`${API_URL}/api/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, artist, spotify_url: spotifyUrl }),
    });
    if (!response.ok) throw new Error('Failed to create song');
    return await response.json();
  } catch (error) {
    console.error('Error creating song:', error);
    return null;
  }
};

export const deleteSong = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/songs/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting song:', error);
    return false;
  }
};

// ============ PUNCHLINES ============

export const fetchPunchlines = async (): Promise<Punchline[]> => {
  try {
    const response = await fetch(`${API_URL}/api/punchlines`);
    if (!response.ok) throw new Error('Failed to fetch punchlines');
    return await response.json();
  } catch (error) {
    console.error('Error fetching punchlines:', error);
    return [];
  }
};

export const getRandomPunchline = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/api/punchlines/random`);
    if (!response.ok) throw new Error('Failed to get random punchline');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error getting random punchline:', error);
    return "Une voix d'ange de Noel"; // Fallback
  }
};

// ============ UTILITIES ============

// Get a random song from the list
export const getRandomSong = (songs: Song[]): Song | null => {
  if (songs.length === 0) return null;
  return songs[Math.floor(Math.random() * songs.length)];
};

// Validate Spotify URL
export const isValidSpotifyUrl = (url: string): boolean => {
  return url.includes('spotify.com/track/') || url.includes('open.spotify.com');
};
