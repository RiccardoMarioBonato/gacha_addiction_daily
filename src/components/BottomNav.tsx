import React from 'react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'summon', label: 'Summon', icon: '🌟' },
  { id: 'adventure', label: 'Battle', icon: '⚔️' },
  { id: 'collection', label: 'Heroes', icon: '📖' },
  { id: 'party', label: 'Party', icon: '👥' },
  { id: 'shop', label: 'Shop', icon: '🛒' },
];

export const BottomNav = ({ currentPage, onNavigate }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pixel-border-gold flex items-center justify-around py-1"
      style={{ background: 'linear-gradient(0deg, hsl(234 45% 14%), hsl(234 50% 8%))' }}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-all ${
            currentPage === item.id ? 'scale-110' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className={`font-pixel text-[6px] ${currentPage === item.id ? 'text-primary' : 'text-foreground'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};
