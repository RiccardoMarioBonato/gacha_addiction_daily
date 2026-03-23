import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { ALL_CHARACTERS, ELEMENT_ICONS, RARITY_COLORS } from '@/data/gameConfig';

interface DailyLoginModalProps {
  onClose: () => void;
}

export const DailyLoginModal = ({ onClose }: DailyLoginModalProps) => {
  const { claimDailyLogin, dailyLoginReward } = useGame();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="pixel-border-gold p-6 max-w-sm w-full mx-4 text-center" style={{ background: 'hsl(var(--card))' }}>
        <h2 className="font-pixel text-sm text-primary mb-4">⭐ Daily Login ⭐</h2>
        <p className="font-retro text-lg text-foreground mb-4">Welcome back, Traveler!</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-center gap-2">
            <span>💎</span>
            <span className="font-retro text-lg text-game-gem">+300 Gems</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>🪙</span>
            <span className="font-retro text-lg text-game-gold">+1,000 Gold</span>
          </div>
          {dailyLoginReward && (
            <div className="flex items-center justify-center gap-2">
              <span>{ELEMENT_ICONS[dailyLoginReward.element]}</span>
              <span className="font-retro text-lg" style={{ color: RARITY_COLORS[dailyLoginReward.rarity] }}>
                +{dailyLoginReward.name} ({dailyLoginReward.rarity})
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => { claimDailyLogin(); onClose(); }}
          className="pixel-btn-primary w-full"
        >
          CLAIM!
        </button>
      </div>
    </div>
  );
};
