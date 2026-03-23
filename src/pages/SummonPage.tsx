import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import {
  ALL_CHARACTERS, SINGLE_PULL_COST, MULTI_PULL_COST, RARITY_COLORS, ELEMENT_ICONS,
  FEATURED_CHARACTER_ID, type CharacterData, type Rarity,
} from '@/data/gameConfig';
import { CharacterSprite } from '@/components/CharacterSprite';

export const SummonPage = () => {
  const { state, executePulls, spendGems, useFreePull } = useGame();
  const [banner, setBanner] = useState<'standard' | 'featured'>('featured');
  const [results, setResults] = useState<{ character: CharacterData; rarity: Rarity; isNew: boolean }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const [showBurst, setShowBurst] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const featuredChar = ALL_CHARACTERS.find(c => c.id === FEATURED_CHARACTER_ID)!;

  const doPull = useCallback((count: number, free = false) => {
    const cost = count === 1 ? SINGLE_PULL_COST : MULTI_PULL_COST;
    if (!free && state.gems < cost) return;
    if (!free) spendGems(cost);
    if (free) useFreePull();

    const pulled = executePulls(count, banner);
    setResults(pulled);
    setShowResults(true);
    setAnimatingIndex(0);
  }, [state.gems, banner, executePulls, spendGems, useFreePull]);

  useEffect(() => {
    if (!showResults || animatingIndex < 0) return;
    if (animatingIndex >= results.length) return;

    const r = results[animatingIndex];
    if (r.rarity === 'Legendary' || r.rarity === 'Epic') {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 800);
    }

    const timer = setTimeout(() => {
      setAnimatingIndex(prev => prev + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [animatingIndex, showResults, results]);

  return (
    <div className="space-y-4 pb-4">
      {/* Banner selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setBanner('featured')}
          className={`flex-1 pixel-btn ${banner === 'featured' ? 'pixel-btn-primary' : 'pixel-btn-secondary'}`}
        >
          FEATURED
        </button>
        <button
          onClick={() => setBanner('standard')}
          className={`flex-1 pixel-btn ${banner === 'standard' ? 'pixel-btn-primary' : 'pixel-btn-secondary'}`}
        >
          STANDARD
        </button>
      </div>

      {/* Banner info */}
      <div className="pixel-border-gold rounded-sm p-4 text-center"
        style={{ background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--rarity-legendary) / 0.1) 100%)' }}>
        {banner === 'featured' ? (
          <>
            <h2 className="font-pixel text-[10px] text-rarity-legendary mb-1">✦ {featuredChar.name} Banner ✦</h2>
            <p className="font-retro text-sm text-muted-foreground">Rate-up: {featuredChar.name} — {featuredChar.title}</p>
            <p className="font-retro text-xs text-muted-foreground mt-1">50/50 system • Guaranteed on lost 50/50</p>
          </>
        ) : (
          <>
            <h2 className="font-pixel text-[10px] text-foreground mb-1">Standard Banner</h2>
            <p className="font-retro text-sm text-muted-foreground">All characters available at normal rates</p>
          </>
        )}
      </div>

      {/* Pity counter */}
      <div className="pixel-card flex items-center justify-between">
        <span className="font-pixel text-[8px] text-muted-foreground">Pity Counter</span>
        <span className="font-pixel text-sm text-destructive">{state.pityCounter} / 90</span>
      </div>

      {/* Pull buttons */}
      {!showResults && (
        <div className="space-y-2">
          {!state.dailyFreePullUsed && (
            <button onClick={() => doPull(1, true)} className="pixel-btn-primary w-full py-3">
              🎁 FREE DAILY PULL
            </button>
          )}
          <button
            onClick={() => doPull(1)}
            disabled={state.gems < SINGLE_PULL_COST}
            className={`w-full py-3 ${state.gems >= SINGLE_PULL_COST ? 'pixel-btn-primary' : 'pixel-btn-disabled'}`}
          >
            SINGLE PULL — 💎{SINGLE_PULL_COST}
          </button>
          <button
            onClick={() => doPull(10)}
            disabled={state.gems < MULTI_PULL_COST}
            className={`w-full py-3 ${state.gems >= MULTI_PULL_COST ? 'pixel-btn-secondary' : 'pixel-btn-disabled'}`}
          >
            10x PULL — 💎{MULTI_PULL_COST}
          </button>
        </div>
      )}

      {/* Particle burst */}
      {showBurst && (
        <div className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center">
          <div className="w-32 h-32 rounded-full animate-particle-burst"
            style={{ background: `radial-gradient(circle, ${RARITY_COLORS.Legendary}88, transparent)` }} />
          <div className="absolute w-24 h-24 rounded-full animate-particle-burst"
            style={{ background: `radial-gradient(circle, ${RARITY_COLORS.Epic}88, transparent)`, animationDelay: '0.1s' }} />
        </div>
      )}

      {/* Pull results */}
      {showResults && (
        <div className="space-y-3">
          <h3 className="font-pixel text-[9px] text-center text-primary">✦ SUMMON RESULTS ✦</h3>
          <div className="grid grid-cols-5 gap-2">
            {results.map((r, i) => {
              const visible = i <= animatingIndex;
              return (
                <div
                  key={i}
                  className={`pixel-border rounded-sm p-1 text-center transition-all ${visible ? 'animate-card-flip' : 'opacity-0'}`}
                  style={{
                    borderColor: RARITY_COLORS[r.rarity],
                    boxShadow: visible ? `0 0 12px ${RARITY_COLORS[r.rarity]}88` : 'none',
                    background: 'hsl(var(--card))',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <CharacterSprite characterId={r.character.id} size={36} />
                  <p className="font-pixel text-[5px] truncate" style={{ color: RARITY_COLORS[r.rarity] }}>
                    {r.character.name}
                  </p>
                  {r.isNew && <p className="font-pixel text-[5px] text-primary">NEW!</p>}
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowResults(false)} className="pixel-btn-primary w-full">
            CONTINUE
          </button>
        </div>
      )}

      {/* History toggle */}
      <button onClick={() => setShowHistory(!showHistory)} className="pixel-btn-secondary w-full text-[8px]">
        {showHistory ? 'HIDE' : 'SHOW'} PULL HISTORY
      </button>

      {showHistory && (
        <div className="pixel-card max-h-60 overflow-y-auto space-y-1">
          {state.pullHistory.length === 0 && (
            <p className="font-retro text-sm text-muted-foreground text-center">No pulls yet</p>
          )}
          {state.pullHistory.map((pull, i) => {
            const char = ALL_CHARACTERS.find(c => c.id === pull.characterId)!;
            return (
              <div key={i} className="flex items-center justify-between py-1 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{ELEMENT_ICONS[char.element]}</span>
                  <span className="font-retro text-sm" style={{ color: RARITY_COLORS[pull.rarity] }}>{char.name}</span>
                </div>
                <span className="font-pixel text-[6px] text-muted-foreground">{pull.banner}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
