import { ALL_CHARACTERS, RARITY_COLORS, ELEMENT_COLORS, type Rarity } from '@/data/gameConfig';

interface CharacterSpriteProps {
  characterId: string;
  size?: number;
  className?: string;
}

const CLASS_SHAPES: Record<string, (color: string, size: number) => React.ReactNode> = {
  Warrior: (color, s) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <rect x="12" y="2" width="8" height="8" fill={color} />
      <rect x="8" y="10" width="16" height="12" fill={color} />
      <rect x="4" y="12" width="4" height="8" fill={color} />
      <rect x="24" y="12" width="4" height="8" fill={color} />
      <rect x="10" y="22" width="5" height="8" fill={color} />
      <rect x="17" y="22" width="5" height="8" fill={color} />
      <rect x="26" y="10" width="4" height="2" fill="#aaa" />
    </svg>
  ),
  Mage: (color, s) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <polygon points="16,0 20,8 12,8" fill={color} />
      <rect x="12" y="4" width="8" height="8" fill={color} />
      <rect x="10" y="12" width="12" height="10" fill={color} />
      <rect x="6" y="14" width="4" height="6" fill={color} />
      <rect x="22" y="14" width="4" height="6" fill={color} />
      <rect x="10" y="22" width="5" height="8" fill={color} />
      <rect x="17" y="22" width="5" height="8" fill={color} />
      <circle cx="28" cy="12" r="3" fill="#ffdd66" opacity="0.8" />
    </svg>
  ),
  Archer: (color, s) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <rect x="12" y="2" width="8" height="8" fill={color} />
      <rect x="10" y="10" width="12" height="10" fill={color} />
      <rect x="6" y="12" width="4" height="6" fill={color} />
      <rect x="22" y="12" width="4" height="6" fill={color} />
      <rect x="11" y="20" width="4" height="10" fill={color} />
      <rect x="17" y="20" width="4" height="10" fill={color} />
      <line x1="26" y1="6" x2="26" y2="24" stroke="#8B4513" strokeWidth="2" />
      <line x1="26" y1="6" x2="24" y2="15" stroke="#8B4513" strokeWidth="1" />
      <line x1="26" y1="24" x2="24" y2="15" stroke="#8B4513" strokeWidth="1" />
    </svg>
  ),
  Healer: (color, s) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <rect x="12" y="2" width="8" height="8" fill={color} />
      <rect x="10" y="10" width="12" height="12" fill={color} />
      <rect x="6" y="12" width="4" height="8" fill={color} />
      <rect x="22" y="12" width="4" height="8" fill={color} />
      <rect x="11" y="22" width="4" height="8" fill={color} />
      <rect x="17" y="22" width="4" height="8" fill={color} />
      <rect x="14" y="13" width="4" height="8" fill="#fff" opacity="0.8" />
      <rect x="12" y="15" width="8" height="4" fill="#fff" opacity="0.8" />
    </svg>
  ),
  Assassin: (color, s) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <rect x="12" y="2" width="8" height="6" fill={color} />
      <rect x="10" y="8" width="12" height="10" fill={color} opacity="0.9" />
      <rect x="8" y="10" width="4" height="6" fill={color} opacity="0.7" />
      <rect x="20" y="10" width="4" height="6" fill={color} opacity="0.7" />
      <rect x="11" y="18" width="4" height="10" fill={color} />
      <rect x="17" y="18" width="4" height="10" fill={color} />
      <line x1="24" y1="8" x2="28" y2="4" stroke="#ccc" strokeWidth="2" />
    </svg>
  ),
  Summoner: (color, s) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <rect x="12" y="2" width="8" height="8" fill={color} />
      <rect x="10" y="10" width="12" height="10" fill={color} />
      <rect x="6" y="12" width="4" height="8" fill={color} />
      <rect x="22" y="12" width="4" height="8" fill={color} />
      <rect x="11" y="20" width="4" height="10" fill={color} />
      <rect x="17" y="20" width="4" height="10" fill={color} />
      <circle cx="6" cy="8" r="3" fill={color} opacity="0.5" />
      <circle cx="26" cy="8" r="3" fill={color} opacity="0.5" />
      <circle cx="16" cy="0" r="2" fill="#ffdd66" opacity="0.6" />
    </svg>
  ),
  Tank: (color, s) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <rect x="12" y="2" width="8" height="8" fill={color} />
      <rect x="8" y="10" width="16" height="14" fill={color} />
      <rect x="4" y="12" width="4" height="10" fill={color} />
      <rect x="24" y="12" width="4" height="10" fill={color} />
      <rect x="10" y="24" width="5" height="6" fill={color} />
      <rect x="17" y="24" width="5" height="6" fill={color} />
      <rect x="2" y="12" width="6" height="10" fill="#888" opacity="0.6" rx="1" />
    </svg>
  ),
};

import React from 'react';

export const CharacterSprite = ({ characterId, size = 64, className = '' }: CharacterSpriteProps) => {
  const char = ALL_CHARACTERS.find(c => c.id === characterId);
  if (!char) return null;
  const color = ELEMENT_COLORS[char.element];
  const shape = CLASS_SHAPES[char.charClass];
  
  return (
    <div className={`inline-flex items-center justify-center shimmer ${className}`} style={{ width: size, height: size }}>
      {shape ? shape(color, size) : (
        <div style={{ width: size * 0.6, height: size * 0.8, backgroundColor: color, borderRadius: 2 }} />
      )}
    </div>
  );
};

interface EnemySpriteProps {
  element: string;
  size?: number;
}

export const EnemySprite = ({ element, size = 48 }: EnemySpriteProps) => {
  const color = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] || '#888';
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shimmer">
      <rect x="8" y="4" width="16" height="12" fill={color} rx="2" />
      <rect x="6" y="8" width="4" height="6" fill={color} />
      <rect x="22" y="8" width="4" height="6" fill={color} />
      <rect x="10" y="16" width="5" height="8" fill={color} />
      <rect x="17" y="16" width="5" height="8" fill={color} />
      <rect x="10" y="7" width="4" height="4" fill="#fff" />
      <rect x="18" y="7" width="4" height="4" fill="#fff" />
      <rect x="11" y="8" width="2" height="2" fill="#f00" />
      <rect x="19" y="8" width="2" height="2" fill="#f00" />
    </svg>
  );
};
