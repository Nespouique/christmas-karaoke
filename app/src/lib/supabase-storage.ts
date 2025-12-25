import { supabase } from './supabase';
import type { Participant, Song, Punchline } from '@/types';
import { WHEEL_COLORS } from '@/types';

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

// ============ PARTICIPANTS ============

export const fetchParticipants = async (): Promise<Participant[]> => {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
  return data || [];
};

export const createParticipant = async (
  name: string, 
  photoUrl: string | null,
  existingParticipants: Participant[]
): Promise<Participant | null> => {
  const color = getNextColor(existingParticipants);
  
  const { data, error } = await supabase
    .from('participants')
    .insert({ name, photo_url: photoUrl, color })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating participant:', error);
    return null;
  }
  return data;
};

export const updateParticipant = async (
  id: string, 
  name: string, 
  photoUrl: string | null
): Promise<Participant | null> => {
  const { data, error } = await supabase
    .from('participants')
    .update({ name, photo_url: photoUrl })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating participant:', error);
    return null;
  }
  return data;
};

export const deleteParticipant = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('participants')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting participant:', error);
    return false;
  }
  return true;
};

// ============ SONGS ============

export const fetchSongs = async (): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('title', { ascending: true });
  
  if (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
  return data || [];
};

export const createSong = async (
  title: string, 
  artist: string, 
  spotifyUrl: string
): Promise<Song | null> => {
  const { data, error } = await supabase
    .from('songs')
    .insert({ title, artist, spotify_url: spotifyUrl })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating song:', error);
    return null;
  }
  return data;
};

export const deleteSong = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting song:', error);
    return false;
  }
  return true;
};

// ============ PUNCHLINES ============

export const fetchPunchlines = async (): Promise<Punchline[]> => {
  const { data, error } = await supabase
    .from('punchlines')
    .select('*');
  
  if (error) {
    console.error('Error fetching punchlines:', error);
    return [];
  }
  return data || [];
};

export const getRandomPunchline = async (): Promise<string> => {
  const punchlines = await fetchPunchlines();
  if (punchlines.length === 0) {
    return "Une voix d'ange de Noël"; // Fallback
  }
  return punchlines[Math.floor(Math.random() * punchlines.length)].text;
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
