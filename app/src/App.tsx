import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { FerrisWheel, Users, Music } from 'lucide-react';
import { WheelTab } from '@/components/tabs/WheelTab';
import { ParticipantsTab } from '@/components/tabs/ParticipantsTab';
import { SongsTab } from '@/components/tabs/SongsTab';
import { TabHeader } from '@/components/TabHeader';
import type { Participant, Song } from '@/types';
import {
  fetchParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  fetchSongs,
  createSong,
  deleteSong
} from '@/lib/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('wheel');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  const loadData = useCallback(async () => {
    setLoading(true);
    const [participantsData, songsData] = await Promise.all([
      fetchParticipants(),
      fetchSongs()
    ]);
    setParticipants(participantsData);
    setSongs(songsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Participant handlers
  const handleAddParticipant = async (name: string, photoUrl: string | null) => {
    const newParticipant = await createParticipant(name, photoUrl, participants);
    if (newParticipant) {
      setParticipants(prev => [...prev, newParticipant].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success(`${name} a été ajouté !`);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleUpdateParticipant = async (id: string, name: string, photoUrl: string | null) => {
    const updated = await updateParticipant(id, name, photoUrl);
    if (updated) {
      setParticipants(prev => prev.map(p => p.id === id ? updated : p).sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Participant modifié !');
    } else {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    const participant = participants.find(p => p.id === id);
    const success = await deleteParticipant(id);
    if (success) {
      setParticipants(prev => prev.filter(p => p.id !== id));
      toast.success(`${participant?.name} a été supprimé`);
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Song handlers
  const handleAddSong = async (title: string, artist: string, spotifyUrl: string) => {
    const newSong = await createSong(title, artist, spotifyUrl);
    if (newSong) {
      setSongs(prev => [...prev, newSong].sort((a, b) => a.title.localeCompare(b.title)));
      toast.success(`"${title}" a été ajouté !`);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDeleteSong = async (id: string) => {
    const song = songs.find(s => s.id === id);
    const success = await deleteSong(id);
    if (success) {
      setSongs(prev => prev.filter(s => s.id !== id));
      toast.success(`"${song?.title}" a été supprimé`);
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const goToSongs = () => {
    setActiveTab('songs');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-bounce">🎄</div>
          <p className="text-white/60">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-background overflow-hidden">
      <div className="relative max-w-md mx-auto h-full flex flex-col">
        {/* Fixed Header */}
        <TabHeader activeTab={activeTab} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          {/* Content area - pb-20 accounts for fixed bottom nav */}
          <div className="flex-1 min-h-0 pb-20">
            <TabsContent value="wheel" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <WheelTab 
                participants={participants}
                songs={songs}
                onGoToSongs={goToSongs}
              />
            </TabsContent>
            
            <TabsContent value="participants" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ParticipantsTab
                participants={participants}
                onAdd={handleAddParticipant}
                onUpdate={handleUpdateParticipant}
                onDelete={handleDeleteParticipant}
              />
            </TabsContent>
            
            <TabsContent value="songs" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <SongsTab
                songs={songs}
                onAdd={handleAddSong}
                onDelete={handleDeleteSong}
              />
            </TabsContent>
          </div>

          {/* Bottom navigation - z-50 ensures it stays above content on mobile */}
          <TabsList className="fixed bottom-0 left-0 right-0 z-50 h-auto w-full rounded-none bg-background-muted px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <TabsTrigger
              value="songs"
              className="relative flex flex-col items-center gap-1 px-6 py-2 border-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-white/40 hover:text-white/60 transition-colors data-[state=active]:text-primary before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-8 before:h-1 before:rounded-full before:bg-transparent data-[state=active]:before:bg-primary before:transition-colors"
            >
              <Music className="w-5 h-5" />
              <span className="text-xs font-medium">Chants</span>
            </TabsTrigger>
            <TabsTrigger
              value="wheel"
              className="relative flex flex-col items-center gap-1 px-6 py-2 border-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-white/40 hover:text-white/60 transition-colors data-[state=active]:text-primary before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-8 before:h-1 before:rounded-full before:bg-transparent data-[state=active]:before:bg-primary before:transition-colors"
            >
              <FerrisWheel className="w-5 h-5" />
              <span className="text-xs font-medium">Roue</span>
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              className="relative flex flex-col items-center gap-1 px-6 py-2 border-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-white/40 hover:text-white/60 transition-colors data-[state=active]:text-primary before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-8 before:h-1 before:rounded-full before:bg-transparent data-[state=active]:before:bg-primary before:transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium">Participants</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
}

export default App;
