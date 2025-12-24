import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SongModal } from '@/components/SongModal';
import { Plus, Trash2, ExternalLink, Music } from 'lucide-react';
import type { Song } from '@/types';

interface SongsTabProps {
  songs: Song[];
  onAdd: (title: string, artist: string, spotifyUrl: string) => void;
  onDelete: (id: string) => void;
}

export function SongsTab({ songs, onAdd, onDelete }: SongsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openSpotify = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="relative flex flex-col h-full pb-20 overflow-hidden">
      {/* Content - centered vertically */}
      <div className="flex-1 flex flex-col items-center p-4 gap-10 w-full overflow-hidden">
        {/* Subtitle & instruction */}
        <div className="text-center space-y-1">
          <p className="text-white/80 text-lg font-medium">Nos plus belles chansons</p>
          <p className="text-white/50 text-sm">Retrouvez ici tous les chants</p>
        </div>

        {/* Songs list */}
        <div className="w-full overflow-hidden">
        <ScrollArea className="w-full max-h-[50vh]">
        <div className="space-y-3 pb-4">
          {songs.map((song) => (
            <div 
              key={song.id}
              className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors overflow-hidden min-w-0"
            >
              {/* Music icon badge */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-primary/20 text-primary">
                <Music className="w-4 h-4" />
              </div>

              {/* Song info */}
              <div className="flex-1 w-0">
                <h3 className="font-medium truncate text-white">{song.title}</h3>
                <p className="text-sm text-primary truncate">{song.artist}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openSpotify(song.spotify_url)}
                  className="p-2 hover:bg-white/10 rounded-md transition-colors"
                  title="Ouvrir sur Spotify"
                >
                  <ExternalLink className="w-4 h-4 text-white/60" />
                </button>
                <button
                  onClick={() => onDelete(song.id)}
                  className="p-2 hover:bg-destructive/20 rounded-md transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}

          {songs.length === 0 && (
            <div className="text-center py-8 text-white/50">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun chant ajouté</p>
              <p className="text-sm">Ajoutez vos chants de Noël préférés !</p>
            </div>
          )}
        </div>
      </ScrollArea>
        </div>
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary hover:bg-[#28c769] text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-20"
        aria-label="Ajouter un chant"
      >
        <Plus className="w-6 h-6" />
      </button>

      <SongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAdd}
      />
    </div>
  );
}
