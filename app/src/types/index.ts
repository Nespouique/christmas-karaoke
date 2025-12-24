// Types for the Christmas Karaoke application

export interface Participant {
  id: string;
  name: string;
  photo_url: string | null;
  color: string;
  created_at: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  spotify_url: string;
  created_at: string;
}

export interface Punchline {
  id: string;
  text: string;
}

// Color palette for the wheel - Christmas themed
export const WHEEL_COLORS = [
  '#E53935', // Rouge Noël
  '#43A047', // Vert sapin
  '#FDD835', // Or
  '#1E88E5', // Bleu glacé
  '#8E24AA', // Violet
  '#FB8C00', // Orange
  '#00ACC1', // Cyan
  '#D81B60', // Rose
];

// Default punchlines for when someone is selected
export const DEFAULT_PUNCHLINES = [
  "Une voix d'ange de Noël",
  "Le prochain Mariah Carey !",
  "Le lutin chanteur",
  "La star du sapin",
  "Voix en or massif",
  "Le rossignol de l'hiver",
  "Talent caché de la famille",
  "Future étoile de Noël",
];
