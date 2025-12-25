import { useMemo } from 'react';

interface SnowflakeProps {
  style: React.CSSProperties;
  size: 'small' | 'medium' | 'large';
}

function Snowflake({ style, size }: SnowflakeProps) {
  return <div className={`snowflake ${size}`} style={style} />;
}

interface SnowfallProps {
  count?: number;
}

export function Snowfall({ count = 50 }: SnowfallProps) {
  const snowflakes = useMemo(() => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

    return Array.from({ length: count }, (_, i) => {
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const duration = 8 + Math.random() * 12; // 8-20s
      const delay = Math.random() * -20; // Negative delay for immediate start
      const left = Math.random() * 100;
      const opacity = 0.3 + Math.random() * 0.5; // 0.3-0.8

      return {
        id: i,
        size,
        style: {
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity,
        } as React.CSSProperties,
      };
    });
  }, [count]);

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <Snowflake key={flake.id} style={flake.style} size={flake.size} />
      ))}
    </div>
  );
}
