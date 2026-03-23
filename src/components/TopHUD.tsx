import React from 'react';
import { useGame } from '@/contexts/GameContext';

export const TopHUD = () => {
  const { state } = useGame();
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pixel-border-gold flex items-center justify-between px-3 py-2"
      style={{ background: 'linear-gradient(180deg, hsl(234 45% 14%), hsl(234 50% 8%))' }}>
      <div className="flex items-center gap-2">
        <span className="font-pixel text-[8px] text-primary">Lv.{state.playerLevel}</span>
        <span className="font-pixel text-[8px] text-foreground">{state.playerName}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-sm">💎</span>
          <span className="font-pixel text-[9px] text-game-gem">{state.gems.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">🪙</span>
          <span className="font-pixel text-[9px] text-game-gold">{state.gold.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
