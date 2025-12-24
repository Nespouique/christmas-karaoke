import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageCropper } from '@/components/ImageCropper';
import { Camera, Trash2, X } from 'lucide-react';
import type { Participant } from '@/types';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, photoUrl: string | null) => void;
  onDelete?: () => void;
  participant?: Participant | null;
}

export function ParticipantModal({ isOpen, onClose, onSave, onDelete, participant }: ParticipantModalProps) {
  const [name, setName] = useState(participant?.name || '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(participant?.photo_url || null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(participant?.photo_url || null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Open cropper instead of directly setting the photo
        setImageToCrop(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setPhotoUrl(croppedImage);
    setPhotoPreview(croppedImage);
    setImageToCrop(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), photoUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setPhotoUrl(null);
    setPhotoPreview(null);
    onClose();
  };

  const clearPhoto = () => {
    setPhotoUrl(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset form when participant changes
  useEffect(() => {
    if (participant) {
      setName(participant.name);
      setPhotoUrl(participant.photo_url);
      setPhotoPreview(participant.photo_url);
    } else {
      setName('');
      setPhotoUrl(null);
      setPhotoPreview(null);
    }
  }, [participant]);

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {imageToCrop 
              ? 'Recadrer la photo' 
              : participant 
                ? 'Modifier le participant' 
                : 'Nouveau participant'}
          </DialogTitle>
        </DialogHeader>

        {imageToCrop ? (
          /* Image cropper view */
          <ImageCropper
            image={imageToCrop}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        ) : (
          /* Normal form view */
          <div className="flex flex-col items-center gap-6 py-4">
            {/* Photo upload */}
            <div className="relative">
              <div 
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={photoPreview || undefined} alt="Photo" />
                  <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              {photoPreview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearPhoto();
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            
            <p className="text-sm text-muted-foreground -mt-4">
              Appuyez pour choisir une image
            </p>

            {/* Name input */}
            <div className="w-full space-y-2">
              <Label htmlFor="name">Prénom</Label>
              <Input
                id="name"
                placeholder="Exemple : Tonton Michel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>

            {/* Save button */}
            <Button 
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full gap-2"
              size="lg"
            >
              Enregistrer le participant
            </Button>

            {/* Delete button - only show in edit mode */}
            {onDelete && (
              <Button 
                onClick={onDelete}
                variant="ghost"
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                size="lg"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer le participant
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
