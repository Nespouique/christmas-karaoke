import {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Music } from "lucide-react";
import type { Participant } from "@/types";

export interface SpinningWheelHandle {
  spin: () => void;
}

interface SpinningWheelProps {
  participants: Participant[];
  onSpinEnd: (winner: Participant) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const SEGMENT_COLORS = ["#1a3324", "#2d5a3d"];

export const SpinningWheel = forwardRef<SpinningWheelHandle, SpinningWheelProps>(
  function SpinningWheel(
    { participants, onSpinEnd, isSpinning, setIsSpinning },
    ref
  ) {
    const [rotation, setRotation] = useState(0);

    // Add "Rejoue" if even number of participants for color alternation
    const getWheelSegments = () => {
      if (participants.length === 0) return [];

      if (participants.length > 1 && participants.length % 2 !== 0) {
        return [
          ...participants,
          {
            id: "rejoue",
            name: "Rejoue !",
            photo_url: null,
            color: "#30e87a",
            created_at: "",
          } as Participant,
        ];
      }
      return participants;
    };

    const segments = getWheelSegments();
    const segmentCount = segments.length || 1;
    const segmentAngle = 360 / segmentCount;

    const spin = (forceRespin = false) => {
      if ((!forceRespin && isSpinning) || segments.length === 0) return;

      setIsSpinning(true);

      const fullRotations = 5 + Math.random() * 3;
      const randomAngle = Math.random() * 360;
      const newRotation = rotation + fullRotations * 360 + randomAngle;

      setRotation(newRotation);

      setTimeout(() => {
        const normalizedRotation = ((newRotation % 360) + 360) % 360;
        const angleUnderPointer = (360 - normalizedRotation) % 360;
        const winnerIndex =
          Math.floor(angleUnderPointer / segmentAngle) % segments.length;

        const winner = segments[winnerIndex];

        if (winner.id === "rejoue") {
          setTimeout(() => {
            const newFullRotations = 5 + Math.random() * 3;
            const newRandomAngle = Math.random() * 360;
            const respinRotation =
              newRotation + newFullRotations * 360 + newRandomAngle;

            setRotation(respinRotation);

            setTimeout(() => {
              setIsSpinning(false);

              const respinNormalized = ((respinRotation % 360) + 360) % 360;
              const respinAngleUnderPointer = (360 - respinNormalized) % 360;
              const respinWinnerIndex =
                Math.floor(respinAngleUnderPointer / segmentAngle) %
                segments.length;
              const respinWinner = segments[respinWinnerIndex];

              if (respinWinner.id === "rejoue") {
                setTimeout(() => spin(true), 500);
              } else {
                onSpinEnd(respinWinner);
              }
            }, 4000);
          }, 800);
        } else {
          setIsSpinning(false);
          onSpinEnd(winner);
        }
      }, 4000);
    };

    useImperativeHandle(
      ref,
      () => ({
        spin: () => spin(false),
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [segments, rotation, isSpinning]
    );

    // SVG dimensions
    const size = 300;
    const center = size / 2;
    const radius = size / 2 - 4;
    const innerRadius = 32;

    // Create SVG path for a segment
    const createSegmentPath = (index: number) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArc = segmentAngle > 180 ? 1 : 0;

      return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    // Calculate text position and rotation for each segment
    const getTextTransform = (index: number) => {
      const midAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
      const textRadius = (radius + innerRadius) / 2 + 15;
      const x = center + textRadius * Math.cos(midAngle);
      const y = center + textRadius * Math.sin(midAngle);

      // Rotate text to follow the segment direction (radial)
      const rotationAngle = index * segmentAngle + segmentAngle / 2;

      return { x, y, rotation: rotationAngle };
    };

    return (
      <div className="relative">
        {/* Pointer arrow at top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#30e87a"
            className="drop-shadow-lg"
          >
            <path d="M12 18l-8-10h16l-8 10z" />
          </svg>
        </div>

        {/* Wheel */}
        <div
          className="relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="drop-shadow-2xl"
          >
            {/* Outer ring */}
            <circle
              cx={center}
              cy={center}
              r={radius + 2}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />

            {/* Segments */}
            {segments.map((segment, index) => (
              <path
                key={segment.id}
                d={createSegmentPath(index)}
                fill={SEGMENT_COLORS[index % 2]}
              />
            ))}

            {/* Segment divider lines */}
            {segments.map((_, index) => {
              const angle = (index * segmentAngle - 90) * (Math.PI / 180);
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);
              return (
                <line
                  key={`line-${index}`}
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Text labels */}
            {segments.map((segment, index) => {
              const { x, y, rotation: textRotation } = getTextTransform(index);
              const displayName = segment.name.length > 10
                ? segment.name.slice(0, 10) + "…"
                : segment.name;

              return (
                <text
                  key={`text-${segment.id}`}
                  x={x}
                  y={y}
                  fill="white"
                  fontSize="14"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${x}, ${y})`}
                  style={{
                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                    fontFamily: "system-ui, sans-serif"
                  }}
                >
                  {displayName}
                </text>
              );
            })}

            {/* Center circle background */}
            <circle
              cx={center}
              cy={center}
              r={innerRadius}
              fill="#112117"
              stroke="#2d5a3d"
              strokeWidth="4"
            />
          </svg>

          {/* Center icon (positioned absolutely over SVG) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ width: innerRadius * 2, height: innerRadius * 2 }}
          >
            <Music className="w-7 h-7 text-[#30e87a]" />
          </div>
        </div>

        {/* Shadow under wheel */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/40 blur-xl rounded-full" />
      </div>
    );
  }
);
