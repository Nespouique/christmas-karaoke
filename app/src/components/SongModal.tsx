import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidSpotifyUrl } from '@/lib/supabase-storage';
import { Loader2 } from 'lucide-react';

interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, artist: string, spotifyUrl: string) => void;
}

// Extract song info via Supabase Edge Function (avoids CORS)
async function fetchSpotifyInfo(url: string): Promise<{ title: string; artist: string } | null> {
  try {
    const response = await fetch(
      'https://frhngmquudixcxhabdvl.supabase.co/functions/v1/spotify-info',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      title: data.title || '',
      artist: data.artist || ''
    };
  } catch {
    return null;
  }
}

export function SongModal({ isOpen, onClose, onSave }: SongModalProps) {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlChange = async (url: string) => {
    setSpotifyUrl(url);
    
    if (!url) {
      setUrlError('');
      return;
    }
    
    if (!isValidSpotifyUrl(url)) {
      setUrlError('URL Spotify invalide');
      return;
    }
    
    setUrlError('');
    setIsLoading(true);
    
    // Fetch song info from Spotify
    const info = await fetchSpotifyInfo(url);
    setIsLoading(false);
    
    if (info) {
      if (info.title) setTitle(info.title);
      if (info.artist) setArtist(info.artist);
    }
  };

  const handleSave = () => {
    if (title.trim() && artist.trim() && spotifyUrl && isValidSpotifyUrl(spotifyUrl)) {
      onSave(title.trim(), artist.trim(), spotifyUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setSpotifyUrl('');
    setTitle('');
    setArtist('');
    setUrlError('');
    onClose();
  };

  const isValid = title.trim() && artist.trim() && spotifyUrl && !urlError;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un chant</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Spotify URL */}
          <div className="space-y-2">
            <Label htmlFor="spotifyUrl">Lien Spotify</Label>
            <Input
              id="spotifyUrl"
              placeholder="https://open.spotify.com/track/..."
              value={spotifyUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className={urlError ? 'border-destructive' : ''}
            />
            {urlError && (
              <p className="text-sm text-destructive">{urlError}</p>
            )}
          </div>

          {/* Preview section */}
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground">Aperçu du chant</h4>
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Chargement...</span>
                </div>
              )}
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre du chant</Label>
              <Input
                id="title"
                placeholder="All I Want for Christmas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Artist */}
            <div className="space-y-2">
              <Label htmlFor="artist">Artiste</Label>
              <Input
                id="artist"
                placeholder="Mariah Carey"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>
          </div>

          {/* Save button */}
          <Button 
            onClick={handleSave}
            disabled={!isValid || isLoading}
            className="w-full gap-2"
            size="lg"
          >
            Ajouter le chant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
