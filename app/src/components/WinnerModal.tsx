import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {Gift, Music } from 'lucide-react';
import type { Participant, Song } from '@/types';
import { getRandomPunchline, getRandomSong } from '@/lib/supabase-storage';

interface WinnerModalProps {
  winner: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToSongs: () => void;
  songs: Song[];
}

export function WinnerModal({ winner, isOpen, onClose, onGoToSongs, songs }: WinnerModalProps) {
  const [punchline, setPunchline] = useState<string>("Une voix d'ange de Noël");
  const [assignedSong, setAssignedSong] = useState<Song | null>(null);
  const [showSong, setShowSong] = useState(false);

  // Load punchline and assign song when modal opens
  useEffect(() => {
    if (isOpen && winner) {
      setShowSong(false);
      getRandomPunchline().then(setPunchline);
      setAssignedSong(getRandomSong(songs));
    }
  }, [isOpen, winner, songs]);

  if (!winner) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleDiscoverSong = () => {
    if (assignedSong) {
      setShowSong(true);
    } else {
      onGoToSongs();
      onClose();
    }
  };

  const openSpotify = () => {
    if (assignedSong) {
      window.open(assignedSong.spotify_url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-center">
            C'est ton moment !
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Avatar */}
          <Avatar className="w-24 h-24">
            <AvatarImage src={winner.photo_url || undefined} alt={winner.name} />
            <AvatarFallback
              className="text-2xl font-bold"
              style={{ backgroundColor: winner.color, color: 'white' }}
            >
              {getInitials(winner.name)}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <h2 className="text-2xl font-bold">{winner.name}</h2>

          {/* Punchline badge */}
          <Badge variant="secondary" className="text-sm px-3 py-1">
            ✨ {punchline}
          </Badge>

          {/* Message */}
          {!showSong ? (
            <>
              <div className="text-center space-y-2 mt-2">
                <p className="text-lg font-semibold text-primary">
                  Tu as été choisi par Papa Noël !
                </p>
                <p className="text-muted-foreground text-sm">
                  {assignedSong 
                    ? "Ouvre ton cadeau pour découvrir le beau chant que tu vas nous faire."
                    : "Choisis un chant de Noël à interpréter !"}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 w-full mt-4">
                <Button 
                  onClick={handleDiscoverSong}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Gift className="w-5 h-5" />
                  {assignedSong ? "Découvrir mon chant" : "Voir les chants"}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    onGoToSongs();
                    onClose();
                  }}
                  className="text-muted-foreground"
                >
                  Je choisis moi-même
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Show assigned song */}
              <div className="w-full p-4 bg-muted rounded-lg text-center space-y-2">
                <Music className="w-8 h-8 mx-auto text-primary" />
                <h3 className="font-bold text-lg">{assignedSong?.title}</h3>
                <p className="text-muted-foreground">{assignedSong?.artist}</p>
              </div>

              <div className="flex flex-col gap-2 w-full mt-4">
                <Button 
                  onClick={openSpotify}
                  className="w-full gap-2 bg-[#1DB954] hover:bg-[#1ed760]"
                  size="lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Ouvrir sur Spotify
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    onGoToSongs();
                    onClose();
                  }}
                >
                  Choisir un autre chant
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
