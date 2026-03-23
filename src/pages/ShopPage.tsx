import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { DAILY_QUESTS } from '@/data/gameConfig';

export const ShopPage = () => {
  const { state, addGems, claimQuest } = useGame();

  const gemBundles = [
    { name: 'Starter Pack', gems: 300, price: '$0.99' },
    { name: 'Adventurer Pack', gems: 1000, price: '$4.99' },
    { name: 'Hero Pack', gems: 3000, price: '$14.99' },
    { name: 'Legendary Pack', gems: 10000, price: '$49.99' },
  ];

  return (
    <div className="space-y-4 pb-4">
      <h2 className="font-pixel text-[10px] text-primary text-center">🛒 Shop</h2>

      {/* Gem Bundles */}
      <div className="space-y-2">
        <h3 className="font-pixel text-[8px] text-foreground">💎 Gem Bundles (Demo Only)</h3>
        <div className="grid grid-cols-2 gap-2">
          {gemBundles.map(b => (
            <div key={b.name} className="pixel-card text-center">
              <p className="font-pixel text-[7px] text-foreground">{b.name}</p>
              <p className="font-retro text-lg text-game-gem">💎 {b.gems}</p>
              <p className="font-pixel text-[7px] text-muted-foreground line-through">{b.price}</p>
              <button onClick={() => addGems(b.gems)} className="pixel-btn-primary w-full mt-1 text-[7px]">
                CLAIM FREE
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Quests */}
      <div className="space-y-2">
        <h3 className="font-pixel text-[8px] text-foreground">📋 Daily Quests</h3>
        {DAILY_QUESTS.map(quest => {
          const progress = state.dailyQuestProgress[quest.id] || 0;
          const completed = progress >= quest.target;
          const claimed = state.dailyQuestsClaimed.includes(quest.id);
          return (
            <div key={quest.id} className="pixel-card flex items-center justify-between">
              <div>
                <p className="font-retro text-sm text-foreground">{quest.description}</p>
                <p className="font-pixel text-[6px] text-muted-foreground">
                  {Math.min(progress, quest.target)}/{quest.target} • Reward: {quest.rewardType === 'gems' ? '💎' : '🪙'} {quest.rewardAmount}
                </p>
              </div>
              {claimed ? (
                <span className="font-pixel text-[7px] text-game-hp">✓</span>
              ) : completed ? (
                <button onClick={() => claimQuest(quest.id)} className="pixel-btn-primary text-[7px]">CLAIM</button>
              ) : (
                <span className="font-pixel text-[6px] text-muted-foreground">In Progress</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
