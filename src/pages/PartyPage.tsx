import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { ALL_CHARACTERS, ELEMENT_ICONS, RARITY_COLORS } from '@/data/gameConfig';
import { CharacterCard } from '@/components/CharacterCard';

export const PartyPage = () => {
  const { state, setParty, getCharStats } = useGame();
  const partyMembers = state.party.map(id => state.ownedCharacters.find(oc => oc.id === id)).filter(Boolean);
  const nonParty = state.ownedCharacters.filter(oc => !state.party.includes(oc.id));

  const hasHealer = partyMembers.some(m => {
    const char = ALL_CHARACTERS.find(c => c.id === m!.characterId);
    return char?.charClass === 'Healer';
  });

  const totalStats = partyMembers.reduce((acc, m) => {
    if (!m) return acc;
    const s = getCharStats(m);
    return { hp: acc.hp + s.hp, atk: acc.atk + s.atk, def: acc.def + s.def, spd: acc.spd + s.spd };
  }, { hp: 0, atk: 0, def: 0, spd: 0 });

  const elements = new Set(partyMembers.map(m => ALL_CHARACTERS.find(c => c.id === m!.characterId)?.element));

  return (
    <div className="space-y-4 pb-4">
      <h2 className="font-pixel text-[10px] text-primary text-center">👥 Party Builder</h2>

      {!hasHealer && partyMembers.length > 0 && (
        <div className="pixel-card border-destructive" style={{ borderColor: 'hsl(var(--destructive))' }}>
          <p className="font-pixel text-[7px] text-destructive">⚠ No Healer in party!</p>
        </div>
      )}

      {/* Current party */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }, (_, i) => {
          const member = partyMembers[i];
          if (member) {
            return (
              <div key={i} className="relative">
                <CharacterCard owned={member} onClick={() => setParty(state.party.filter(id => id !== member.id))} />
                <span className="absolute -top-1 -right-1 font-pixel text-[6px] bg-destructive text-destructive-foreground px-1 rounded-sm cursor-pointer"
                  onClick={() => setParty(state.party.filter(id => id !== member.id))}>✕</span>
              </div>
            );
          }
          return (
            <div key={i} className="pixel-border rounded-sm p-4 flex items-center justify-center min-h-[100px]">
              <span className="font-pixel text-[8px] text-muted-foreground">Empty</span>
            </div>
          );
        })}
      </div>

      {/* Combined stats */}
      <div className="pixel-card">
        <h3 className="font-pixel text-[8px] text-foreground mb-2">Party Stats</h3>
        <div className="grid grid-cols-4 gap-1 text-center">
          {[['HP', totalStats.hp], ['ATK', totalStats.atk], ['DEF', totalStats.def], ['SPD', totalStats.spd]].map(([l, v]) => (
            <div key={l as string}>
              <p className="font-pixel text-[6px] text-muted-foreground">{l}</p>
              <p className="font-pixel text-[8px] text-foreground">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1">
          <span className="font-pixel text-[6px] text-muted-foreground">Elements:</span>
          {[...elements].map(e => e && <span key={e} className="text-sm">{ELEMENT_ICONS[e]}</span>)}
        </div>
      </div>

      {/* Available characters */}
      <h3 className="font-pixel text-[8px] text-foreground">Available Heroes</h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {nonParty.map(oc => (
          <CharacterCard
            key={oc.id}
            owned={oc}
            compact
            onClick={() => {
              if (state.party.length < 4) {
                setParty([...state.party, oc.id]);
              }
            }}
          />
        ))}
      </div>
      {nonParty.length === 0 && (
        <p className="font-retro text-sm text-muted-foreground text-center">Summon more heroes!</p>
      )}
    </div>
  );
};
