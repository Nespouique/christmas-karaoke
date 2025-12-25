interface TabHeaderProps {
  activeTab: string;
}

const TAB_TITLES = {
  wheel: 'Karaoké de Papa Noël',
  songs: 'Chants de Noël',
  participants: 'Participants'
} as const;

export function TabHeader({ activeTab }: TabHeaderProps) {
  const title = TAB_TITLES[activeTab as keyof typeof TAB_TITLES] || TAB_TITLES.wheel;

  return (
    <header className="relative sticky top-0 z-30 bg-background/95 backdrop-blur-sm pt-10 pb-4 px-4 overflow-hidden">
      {/* Snow overlay */}
      <div className="absolute inset-0 snow-overlay pointer-events-none" />
      <h1 className="relative text-primary text-3xl font-bold text-center z-10">{title}</h1>
    </header>
  );
}
