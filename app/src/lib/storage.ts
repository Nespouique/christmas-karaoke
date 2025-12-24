import type { Participant, Song } from '@/types';
import { WHEEL_COLORS, DEFAULT_PUNCHLINES } from '@/types';

const STORAGE_KEYS = {
  PARTICIPANTS: 'christmas-karaoke-participants',
  SONGS: 'christmas-karaoke-songs',
};

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get a color for a new participant
export const getNextColor = (existingParticipants: Participant[]): string => {
  const usedColors = existingParticipants.map(p => p.color);
  const availableColors = WHEEL_COLORS.filter(c => !usedColors.includes(c));
  
  if (availableColors.length > 0) {
    return availableColors[0];
  }
  
  // If all colors are used, cycle through
  return WHEEL_COLORS[existingParticipants.length % WHEEL_COLORS.length];
};

// Participants CRUD operations
export const getParticipants = (): Participant[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveParticipants = (participants: Participant[]): void => {
  localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
};

export const addParticipant = (name: string, photoUrl: string | null): Participant => {
  const participants = getParticipants();
  const newParticipant: Participant = {
    id: generateId(),
    name,
    photo_url: photoUrl,
    color: getNextColor(participants),
    created_at: new Date().toISOString(),
  };
  participants.push(newParticipant);
  saveParticipants(participants);
  return newParticipant;
};

export const updateParticipant = (id: string, name: string, photoUrl: string | null): Participant | null => {
  const participants = getParticipants();
  const index = participants.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  participants[index] = {
    ...participants[index],
    name,
    photo_url: photoUrl,
  };
  saveParticipants(participants);
  return participants[index];
};

export const deleteParticipant = (id: string): boolean => {
  const participants = getParticipants();
  const filtered = participants.filter(p => p.id !== id);
  if (filtered.length === participants.length) return false;
  saveParticipants(filtered);
  return true;
};

// Songs CRUD operations
export const getSongs = (): Song[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SONGS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveSongs = (songs: Song[]): void => {
  localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
};

export const addSong = (title: string, artist: string, spotifyUrl: string): Song => {
  const songs = getSongs();
  const newSong: Song = {
    id: generateId(),
    title,
    artist,
    spotify_url: spotifyUrl,
    created_at: new Date().toISOString(),
  };
  songs.push(newSong);
  saveSongs(songs);
  return newSong;
};

export const deleteSong = (id: string): boolean => {
  const songs = getSongs();
  const filtered = songs.filter(s => s.id !== id);
  if (filtered.length === songs.length) return false;
  saveSongs(filtered);
  return true;
};

// Get a random punchline
export const getRandomPunchline = (): string => {
  return DEFAULT_PUNCHLINES[Math.floor(Math.random() * DEFAULT_PUNCHLINES.length)];
};

// Get a random song
export const getRandomSong = (): Song | null => {
  const songs = getSongs();
  if (songs.length === 0) return null;
  return songs[Math.floor(Math.random() * songs.length)];
};

// Parse Spotify URL to extract track info
export const parseSpotifyUrl = async (url: string): Promise<{ title: string; artist: string } | null> => {
  // Extract track ID from URL
  const trackIdMatch = url.match(/track\/([a-zA-Z0-9]+)/);
  if (!trackIdMatch) return null;

  // For now, return placeholder - in production, you'd use Spotify API
  // The user will need to enter title/artist manually or implement Spotify API
  return null;
};

// Validate Spotify URL
export const isValidSpotifyUrl = (url: string): boolean => {
  return url.includes('spotify.com/track/') || url.includes('open.spotify.com');
};
