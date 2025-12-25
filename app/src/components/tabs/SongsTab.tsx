import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SongModal } from '@/components/SongModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, Music } from 'lucide-react';
import type { Song } from '@/types';

interface SongsTabProps {
  songs: Song[];
  onAdd: (title: string, artist: string, spotifyUrl: string) => void;
  onDelete: (id: string) => void;
}

export function SongsTab({ songs, onAdd, onDelete }: SongsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);

  return (
    <div className="relative flex flex-col h-full pb-20 overflow-hidden">
      {/* Snow overlay pattern */}
      <div className="absolute inset-0 snow-overlay pointer-events-none" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4 gap-6 w-full overflow-hidden relative z-10">
        {/* Subtitle & instruction */}
        <div className="text-center space-y-1 flex-shrink-0">
          <p className="text-white/80 text-lg font-medium">Nos plus belles chansons</p>
          <p className="text-white/50 text-sm">Retrouvez ici tous les chants</p>
        </div>

        {/* Songs list */}
        <div className="w-full flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="space-y-3 pb-4">
              {songs.map((song) => (
                <a
                  key={song.id}
                  href={song.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors overflow-hidden min-w-0 text-left cursor-pointer"
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

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSongToDelete(song);
                    }}
                    className="flex-shrink-0 p-2 hover:bg-destructive/20 rounded-md transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </a>
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

      <AlertDialog open={!!songToDelete} onOpenChange={(open) => !open && setSongToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce chant ?</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer "{songToDelete?.title}" de {songToDelete?.artist} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (songToDelete) {
                  onDelete(songToDelete.id);
                  setSongToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
