import React from 'react';
import { ALL_CHARACTERS, RARITY_COLORS, ELEMENT_ICONS, type OwnedCharacter } from '@/data/gameConfig';
import { CharacterSprite } from './CharacterSprite';

interface CharacterCardProps {
  owned: OwnedCharacter;
  onClick?: () => void;
  compact?: boolean;
}

export const CharacterCard = ({ owned, onClick, compact = false }: CharacterCardProps) => {
  const char = ALL_CHARACTERS.find(c => c.id === owned.characterId)!;
  const rarityClass = `rarity-glow-${char.rarity.toLowerCase()}`;
  
  return (
    <div
      onClick={onClick}
      className={`pixel-border ${rarityClass} rounded-sm cursor-pointer transition-transform hover:scale-105 ${compact ? 'p-1' : 'p-2'}`}
      style={{ background: `linear-gradient(180deg, hsl(var(--card)) 0%, ${RARITY_COLORS[char.rarity]}11 100%)`, borderWidth: 2 }}
    >
      <div className="flex flex-col items-center gap-1">
        <CharacterSprite characterId={char.id} size={compact ? 40 : 56} />
        <span className="font-pixel text-[7px] text-foreground text-center leading-tight truncate w-full">
          {char.name}
        </span>
        {!compact && (
          <>
            <span className="font-retro text-xs text-muted-foreground">{char.title}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">{ELEMENT_ICONS[char.element]}</span>
              <span className="font-pixel text-[6px]" style={{ color: RARITY_COLORS[char.rarity] }}>
                {'★'.repeat(owned.stars)}{'☆'.repeat(5 - owned.stars)}
              </span>
            </div>
            <span className="font-retro text-xs text-muted-foreground">Lv.{owned.level}</span>
          </>
        )}
      </div>
    </div>
  );
};
