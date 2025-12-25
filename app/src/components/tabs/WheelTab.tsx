import { useState, useRef } from 'react';
import { SpinningWheel } from '@/components/SpinningWheel';
import type { SpinningWheelHandle } from '@/components/SpinningWheel';
import { WinnerModal } from '@/components/WinnerModal';
import { Snowfall } from '@/components/Snowfall';
import type { Participant, Song } from '@/types';

interface WheelTabProps {
  participants: Participant[];
  songs: Song[];
  onGoToSongs: () => void;
}

export function WheelTab({ participants, songs, onGoToSongs }: WheelTabProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const wheelRef = useRef<SpinningWheelHandle>(null);

  const handleSpinEnd = (selectedParticipant: Participant) => {
    setWinner(selectedParticipant);
    setShowWinnerModal(true);
  };

  const handleCloseModal = () => {
    setShowWinnerModal(false);
    setWinner(null);
  };

  const handleSpin = () => {
    if (wheelRef.current && !isSpinning && participants.length > 0) {
      wheelRef.current.spin();
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full pb-20">
      {/* Falling snow */}
      <Snowfall count={40} />

      {/* Content - centered vertically */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-12 z-10">
        {/* Subtitle & instruction */}
        <div className="text-center space-y-1">
          <p className="text-white/80 text-lg font-medium">Qui va chanter ?</p>
          <p className="text-white/50 text-sm">Tournez la roue pour le savoir</p>
        </div>

        {/* Wheel */}
        <div>
          <SpinningWheel
            ref={wheelRef}
            participants={participants}
            onSpinEnd={handleSpinEnd}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
        </div>

        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || participants.length === 0}
          className="spin-button relative group cursor-pointer flex items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary hover:bg-[#d43030] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(196,40,40,0.5),0_0_40px_rgba(196,40,40,0.3)]"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative text-primary-foreground text-sm font-extrabold leading-normal tracking-wide uppercase flex items-center gap-2">
            Lancer la Roue
          </span>
        </button>
      </div>

      <WinnerModal
        winner={winner}
        isOpen={showWinnerModal}
        onClose={handleCloseModal}
        onGoToSongs={onGoToSongs}
        songs={songs}
      />
    </div>
  );
}
