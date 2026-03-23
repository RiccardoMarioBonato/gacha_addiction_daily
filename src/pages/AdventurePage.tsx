import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { ZONES, type ZoneData } from '@/data/gameConfig';
import { EnemySprite } from '@/components/CharacterSprite';
import { BattlePage } from './BattlePage';

interface AdventurePageProps {
  onNavigate: (page: string) => void;
}

export const AdventurePage = ({ onNavigate }: AdventurePageProps) => {
  const { state } = useGame();
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [battleStage, setBattleStage] = useState<{ zone: ZoneData; stageIndex: number } | null>(null);

  if (battleStage) {
    return (
      <BattlePage
        zone={battleStage.zone}
        stageIndex={battleStage.stageIndex}
        onExit={() => setBattleStage(null)}
      />
    );
  }

  if (selectedZone) {
    const clearedStage = state.stageProgress[selectedZone.id] || 0;
    return (
      <div className="space-y-3 pb-4">
        <button onClick={() => setSelectedZone(null)} className="pixel-btn-secondary text-[8px]">← BACK</button>
        <h2 className="font-pixel text-[10px] text-primary text-center">{selectedZone.name}</h2>
        <p className="font-retro text-sm text-muted-foreground text-center">{selectedZone.description}</p>

        <div className="space-y-2">
          {selectedZone.stages.map((stage, i) => {
            const unlocked = i <= clearedStage;
            const cleared = i < clearedStage;
            return (
              <div
                key={stage.id}
                onClick={() => {
                  if (unlocked && state.party.length > 0) setBattleStage({ zone: selectedZone, stageIndex: i });
                }}
                className={`pixel-card flex items-center justify-between cursor-pointer transition-all ${
                  !unlocked ? 'opacity-30' : cleared ? 'opacity-70' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {!unlocked ? <span className="text-lg">🔒</span> : <span className="text-lg">⚔️</span>}
                  <div>
                    <p className="font-pixel text-[8px] text-foreground">Stage {stage.id}</p>
                    <p className="font-retro text-xs text-muted-foreground">
                      {stage.enemies.length} enemies • Lv.{stage.enemies[0]?.level}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {stage.enemies.slice(0, 3).map((e, j) => (
                    <EnemySprite key={j} element={e.element} size={24} />
                  ))}
                </div>
                {cleared && <span className="font-pixel text-[7px] text-game-hp">✓</span>}
              </div>
            );
          })}
        </div>

        {state.party.length === 0 && (
          <div className="pixel-card text-center">
            <p className="font-pixel text-[8px] text-destructive mb-2">Set up your party first!</p>
            <button onClick={() => onNavigate('party')} className="pixel-btn-primary">GO TO PARTY</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <h2 className="font-pixel text-[10px] text-primary text-center">⚔️ Adventure Map</h2>

      {/* World map */}
      <div className="relative">
        {ZONES.map((zone, i) => {
          const unlocked = state.playerLevel >= zone.requiredLevel || i === 0;
          const progress = state.stageProgress[zone.id] || 0;
          return (
            <div key={zone.id} className="mb-2">
              {i > 0 && (
                <div className="flex justify-center py-1">
                  <div className="border-l-2 border-dashed border-border h-4" />
                </div>
              )}
              <div
                onClick={() => unlocked && setSelectedZone(zone)}
                className={`pixel-card cursor-pointer transition-all ${
                  !unlocked ? 'opacity-30' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-pixel text-[8px] text-foreground flex items-center gap-2">
                      {!unlocked && '🔒 '}{zone.name}
                    </h3>
                    <p className="font-retro text-xs text-muted-foreground">{zone.description}</p>
                    {unlocked && (
                      <p className="font-pixel text-[6px] text-muted-foreground mt-1">
                        Progress: {progress}/10 stages
                      </p>
                    )}
                  </div>
                  {!unlocked && (
                    <span className="font-pixel text-[7px] text-muted-foreground">Req Lv.{zone.requiredLevel}</span>
                  )}
                </div>
                {unlocked && (
                  <div className="mt-2 hp-bar">
                    <div className="hp-bar-fill" style={{ width: `${(progress / 10) * 100}%` }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
