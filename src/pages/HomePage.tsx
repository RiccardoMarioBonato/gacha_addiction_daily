import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { ALL_CHARACTERS, FEATURED_CHARACTER_ID, RARITY_COLORS, ELEMENT_ICONS } from '@/data/gameConfig';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const { state } = useGame();
  const totalHeroes = state.ownedCharacters.length;
  const featuredChar = ALL_CHARACTERS.find(c => c.id === FEATURED_CHARACTER_ID)!;

  return (
    <div className="space-y-4 pb-4">
      {/* Featured Banner */}
      <div className="pixel-border-gold rounded-sm p-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--rarity-legendary) / 0.15) 100%)' }}>
        <div className="absolute inset-0 scanline-bg pointer-events-none" />
        <h2 className="font-pixel text-[10px] text-primary mb-2">✦ FEATURED BANNER ✦</h2>
        <p className="font-pixel text-[8px] text-rarity-legendary mb-1">{featuredChar.name} — {featuredChar.title}</p>
        <p className="font-retro text-sm text-muted-foreground mb-3">{ELEMENT_ICONS[featuredChar.element]} {featuredChar.element} {featuredChar.charClass}</p>
        <button onClick={() => onNavigate('summon')} className="pixel-btn-primary">
          SUMMON NOW
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="pixel-card text-center">
          <p className="font-pixel text-[7px] text-muted-foreground">Heroes</p>
          <p className="font-pixel text-sm text-primary">{totalHeroes}</p>
        </div>
        <div className="pixel-card text-center">
          <p className="font-pixel text-[7px] text-muted-foreground">Pity</p>
          <p className="font-pixel text-sm text-destructive">{state.pityCounter}/90</p>
        </div>
        <div className="pixel-card text-center">
          <p className="font-pixel text-[7px] text-muted-foreground">Pulls</p>
          <p className="font-pixel text-sm text-foreground">{state.totalPulls}</p>
        </div>
      </div>

      {/* Continue Adventure */}
      <div className="pixel-card">
        <h3 className="font-pixel text-[9px] text-foreground mb-2">⚔️ Continue Adventure</h3>
        <p className="font-retro text-sm text-muted-foreground mb-2">
          Battles completed: {state.battlesCompleted}
        </p>
        <button onClick={() => onNavigate('adventure')} className="pixel-btn-secondary w-full">
          ENTER ADVENTURE
        </button>
      </div>

      {/* Daily Quests Preview */}
      <div className="pixel-card">
        <h3 className="font-pixel text-[9px] text-foreground mb-2">📋 Daily Quests</h3>
        <button onClick={() => onNavigate('shop')} className="pixel-btn-secondary w-full text-[8px]">
          VIEW QUESTS & SHOP
        </button>
      </div>
    </div>
  );
};
