import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { ALL_CHARACTERS, RARITY_COLORS, ELEMENT_ICONS, STAR_UPGRADE_COSTS, type Rarity, type Element, type CharClass } from '@/data/gameConfig';
import { CharacterCard } from '@/components/CharacterCard';
import { CharacterSprite } from '@/components/CharacterSprite';

export const CollectionPage = () => {
  const { state, upgradeStars, setParty, getCharStats } = useGame();
  const [filterRarity, setFilterRarity] = useState<Rarity | 'All'>('All');
  const [filterElement, setFilterElement] = useState<Element | 'All'>('All');
  const [filterClass, setFilterClass] = useState<CharClass | 'All'>('All');
  const [filterOwned, setFilterOwned] = useState<'All' | 'Owned' | 'Not Owned'>('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'Rarity' | 'Level' | 'Stars' | 'ATK' | 'HP'>('Newest');
  const [selectedOwned, setSelectedOwned] = useState<string | null>(null);

  const rarityOrder: Record<Rarity, number> = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4 };

  const allWithOwnership = ALL_CHARACTERS.map(char => {
    const owned = state.ownedCharacters.find(oc => oc.characterId === char.id);
    return { char, owned };
  });

  let filtered = allWithOwnership.filter(({ char, owned }) => {
    if (filterRarity !== 'All' && char.rarity !== filterRarity) return false;
    if (filterElement !== 'All' && char.element !== filterElement) return false;
    if (filterClass !== 'All' && char.charClass !== filterClass) return false;
    if (filterOwned === 'Owned' && !owned) return false;
    if (filterOwned === 'Not Owned' && owned) return false;
    return true;
  });

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'Rarity': return rarityOrder[b.char.rarity] - rarityOrder[a.char.rarity];
      case 'Level': return (b.owned?.level || 0) - (a.owned?.level || 0);
      case 'Stars': return (b.owned?.stars || 0) - (a.owned?.stars || 0);
      case 'ATK': return b.char.baseATK - a.char.baseATK;
      case 'HP': return b.char.baseHP - a.char.baseHP;
      default: return 0;
    }
  });

  const selectedOwnedChar = selectedOwned ? state.ownedCharacters.find(oc => oc.id === selectedOwned) : null;
  const selectedCharData = selectedOwnedChar ? ALL_CHARACTERS.find(c => c.id === selectedOwnedChar.characterId) : null;
  const selectedStats = selectedOwnedChar ? getCharStats(selectedOwnedChar) : null;

  return (
    <div className="space-y-3 pb-4">
      <h2 className="font-pixel text-[10px] text-primary text-center">📖 Hero Collection</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-1">
        <select value={filterRarity} onChange={e => setFilterRarity(e.target.value as any)}
          className="font-pixel text-[7px] bg-input text-foreground border border-border rounded-sm px-2 py-1">
          <option value="All">All Rarity</option>
          {(['Common','Uncommon','Rare','Epic','Legendary'] as Rarity[]).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterElement} onChange={e => setFilterElement(e.target.value as any)}
          className="font-pixel text-[7px] bg-input text-foreground border border-border rounded-sm px-2 py-1">
          <option value="All">All Elements</option>
          {(['Fire','Water','Earth','Wind','Light','Dark'] as Element[]).map(e => <option key={e} value={e}>{ELEMENT_ICONS[e]} {e}</option>)}
        </select>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value as any)}
          className="font-pixel text-[7px] bg-input text-foreground border border-border rounded-sm px-2 py-1">
          <option value="All">All Classes</option>
          {(['Warrior','Mage','Archer','Healer','Assassin','Summoner','Tank'] as CharClass[]).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterOwned} onChange={e => setFilterOwned(e.target.value as any)}
          className="font-pixel text-[7px] bg-input text-foreground border border-border rounded-sm px-2 py-1">
          <option value="All">All</option>
          <option value="Owned">Owned</option>
          <option value="Not Owned">Not Owned</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          className="font-pixel text-[7px] bg-input text-foreground border border-border rounded-sm px-2 py-1">
          {['Newest','Rarity','Level','Stars','ATK','HP'].map(s => <option key={s} value={s}>Sort: {s}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {filtered.map(({ char, owned }) => {
          if (owned) {
            return <CharacterCard key={char.id} owned={owned} onClick={() => setSelectedOwned(owned.id)} compact />;
          }
          return (
            <div key={char.id} className="pixel-border rounded-sm p-1 opacity-40 text-center" style={{ borderColor: RARITY_COLORS[char.rarity] }}>
              <div className="w-10 h-10 mx-auto flex items-center justify-center">
                <span className="text-2xl">❓</span>
              </div>
              <p className="font-pixel text-[6px] text-muted-foreground truncate">{char.name}</p>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedOwnedChar && selectedCharData && selectedStats && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80" onClick={() => setSelectedOwned(null)}>
          <div className="pixel-border-gold p-4 max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto" style={{ background: 'hsl(var(--card))' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <CharacterSprite characterId={selectedCharData.id} size={64} />
              <div>
                <h3 className="font-pixel text-[9px]" style={{ color: RARITY_COLORS[selectedCharData.rarity] }}>{selectedCharData.name}</h3>
                <p className="font-retro text-sm text-muted-foreground">{selectedCharData.title}</p>
                <p className="font-retro text-xs text-muted-foreground">
                  {ELEMENT_ICONS[selectedCharData.element]} {selectedCharData.element} {selectedCharData.charClass}
                </p>
                <p className="font-pixel text-[7px]" style={{ color: RARITY_COLORS[selectedCharData.rarity] }}>
                  {'★'.repeat(selectedOwnedChar.stars)}{'☆'.repeat(5 - selectedOwnedChar.stars)} Lv.{selectedOwnedChar.level}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-1 mb-3">
              {[
                ['HP', selectedStats.hp], ['ATK', selectedStats.atk],
                ['DEF', selectedStats.def], ['SPD', selectedStats.spd],
                ['CRIT', `${selectedStats.crit}%`],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between px-2 py-0.5 bg-muted rounded-sm">
                  <span className="font-pixel text-[7px] text-muted-foreground">{label}</span>
                  <span className="font-pixel text-[7px] text-foreground">{val}</span>
                </div>
              ))}
            </div>

            {/* Skill */}
            <div className="pixel-card mb-3">
              <p className="font-pixel text-[7px] text-accent mb-1">Skill: {selectedCharData.skillName}</p>
              <p className="font-retro text-sm text-muted-foreground">{selectedCharData.skillDesc}</p>
            </div>

            {/* Lore */}
            <div className="pixel-card mb-3">
              <p className="font-pixel text-[7px] text-muted-foreground mb-1">LORE</p>
              <p className="font-retro text-sm text-foreground">{selectedCharData.lore}</p>
            </div>

            {/* Star upgrade */}
            {selectedOwnedChar.stars < 5 && (
              <div className="mb-3">
                <p className="font-retro text-sm text-muted-foreground">
                  Soul Shards: {selectedOwnedChar.soulShards} / {STAR_UPGRADE_COSTS[selectedOwnedChar.stars]}
                </p>
                <button
                  onClick={() => upgradeStars(selectedOwnedChar.id)}
                  disabled={selectedOwnedChar.soulShards < STAR_UPGRADE_COSTS[selectedOwnedChar.stars]}
                  className={selectedOwnedChar.soulShards >= STAR_UPGRADE_COSTS[selectedOwnedChar.stars] ? 'pixel-btn-primary w-full mt-1' : 'pixel-btn-disabled w-full mt-1'}
                >
                  UPGRADE ★
                </button>
              </div>
            )}

            {/* Add to Party */}
            <button
              onClick={() => {
                const current = [...state.party];
                if (current.includes(selectedOwnedChar.id)) {
                  setParty(current.filter(id => id !== selectedOwnedChar.id));
                } else if (current.length < 4) {
                  setParty([...current, selectedOwnedChar.id]);
                }
              }}
              className="pixel-btn-secondary w-full"
            >
              {state.party.includes(selectedOwnedChar.id) ? 'REMOVE FROM PARTY' : 'ADD TO PARTY'}
            </button>

            <button onClick={() => setSelectedOwned(null)} className="pixel-btn w-full mt-2 border-muted text-muted-foreground">
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
