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
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm pt-10 pb-4 px-4">
      <h1 className="text-white text-3xl font-bold text-center">{title}</h1>
    </header>
  );
}
