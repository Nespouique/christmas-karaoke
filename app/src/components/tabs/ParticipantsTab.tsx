import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ParticipantModal } from '@/components/ParticipantModal';
import { Snowfall } from '@/components/Snowfall';
import { Plus, Users } from 'lucide-react';
import type { Participant } from '@/types';

interface ParticipantsTabProps {
  participants: Participant[];
  onAdd: (name: string, photoUrl: string | null) => void;
  onUpdate: (id: string, name: string, photoUrl: string | null) => void;
  onDelete: (id: string) => void;
}

export function ParticipantsTab({ participants, onAdd, onUpdate, onDelete }: ParticipantsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSave = (name: string, photoUrl: string | null) => {
    if (editingParticipant) {
      onUpdate(editingParticipant.id, name, photoUrl);
    } else {
      onAdd(name, photoUrl);
    }
    setEditingParticipant(null);
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingParticipant(null);
  };

  return (
    <div className="relative flex flex-col h-full pb-20 overflow-hidden">
      {/* Falling snow */}
      <Snowfall count={40} />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4 gap-6 w-full overflow-hidden relative z-10">
        {/* Subtitle & instruction */}
        <div className="text-center space-y-1 flex-shrink-0">
          <p className="text-white/80 text-lg font-medium">Les lutins du Père Noël</p>
          <p className="text-white/50 text-sm">Ajoutez des participants à la liste</p>
        </div>

        {/* Participants grid */}
        <div className="w-full flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="grid grid-cols-3 gap-3 pb-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  onClick={() => handleEdit(participant)}
                  className="flex flex-col items-center gap-3 p-4 bg-card/40 rounded-lg hover:bg-card/50 transition-colors cursor-pointer"
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={participant.photo_url || undefined} alt={participant.name} />
                    <AvatarFallback
                      style={{ backgroundColor: participant.color }}
                      className="text-white font-semibold"
                    >
                      {getInitials(participant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-center truncate w-full text-white">
                    {participant.name}
                  </span>
                </div>
              ))}

              {participants.length === 0 && (
                <div className="col-span-3 text-center py-8 text-white/50">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun participant</p>
                  <p className="text-sm">Ajoutez des participants pour commencer !</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary hover:bg-[#d43030] text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-20"
        aria-label="Ajouter un participant"
      >
        <Plus className="w-6 h-6" />
      </button>

      <ParticipantModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={editingParticipant ? () => {
          onDelete(editingParticipant.id);
          handleCloseModal();
        } : undefined}
        participant={editingParticipant}
      />
    </div>
  );
}
