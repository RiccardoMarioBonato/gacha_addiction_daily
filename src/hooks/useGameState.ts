import { useState, useCallback, useEffect } from 'react';
import {
  ALL_CHARACTERS, DROP_RATES, FEATURED_RATE, PITY_THRESHOLD,
  STARTING_GEMS, STARTING_GOLD, DAILY_LOGIN_GEMS, DAILY_LOGIN_GOLD,
  STAR_UPGRADE_COSTS, STAR_STAT_MULTIPLIER, MAX_LEVEL, expForLevel,
  FEATURED_CHARACTER_ID, DAILY_QUESTS,
  type Rarity, type OwnedCharacter, type CharacterData,
} from '@/data/gameConfig';
import { v4 } from '@/lib/utils';

interface GameState {
  playerName: string;
  playerLevel: number;
  gems: number;
  gold: number;
  ownedCharacters: OwnedCharacter[];
  party: string[]; // OwnedCharacter ids
  pityCounter: number;
  featuredPityGuarantee: boolean; // true = next legendary on featured banner IS the featured char
  pullHistory: { characterId: string; rarity: Rarity; banner: string; timestamp: number }[];
  stageProgress: Record<string, number>; // zoneId -> highest cleared stage
  lastLoginDate: string;
  dailyFreePullUsed: boolean;
  dailyQuestProgress: Record<string, number>;
  dailyQuestsClaimed: string[];
  totalPulls: number;
  battlesCompleted: number;
}

const DEFAULT_STATE: GameState = {
  playerName: 'Traveler',
  playerLevel: 1,
  gems: STARTING_GEMS,
  gold: STARTING_GOLD,
  ownedCharacters: [],
  party: [],
  pityCounter: 0,
  featuredPityGuarantee: false,
  pullHistory: [],
  stageProgress: {},
  lastLoginDate: '',
  dailyFreePullUsed: false,
  dailyQuestProgress: {},
  dailyQuestsClaimed: [],
  totalPulls: 0,
  battlesCompleted: 0,
};

const STORAGE_KEY = 'isekai-gacha-state';

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_STATE };
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState);
  const [showDailyLogin, setShowDailyLogin] = useState(false);
  const [dailyLoginReward, setDailyLoginReward] = useState<CharacterData | null>(null);

  useEffect(() => { saveState(state); }, [state]);

  // Check daily login
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastLoginDate !== today) {
      // Grant daily login
      const rareChars = ALL_CHARACTERS.filter(c => c.rarity === 'Rare');
      const randomRare = rareChars[Math.floor(Math.random() * rareChars.length)];
      setDailyLoginReward(randomRare);
      setShowDailyLogin(true);
    }
  }, []);

  const claimDailyLogin = useCallback(() => {
    const today = new Date().toDateString();
    setState(prev => {
      const rareChars = ALL_CHARACTERS.filter(c => c.rarity === 'Rare');
      const randomRare = dailyLoginReward || rareChars[0];
      const existing = prev.ownedCharacters.find(oc => oc.characterId === randomRare.id);
      let newOwned = [...prev.ownedCharacters];
      if (existing) {
        newOwned = newOwned.map(oc => oc.characterId === randomRare.id ? { ...oc, soulShards: oc.soulShards + 5 } : oc);
      } else {
        newOwned.push({ id: v4(), characterId: randomRare.id, level: 1, exp: 0, stars: 1, soulShards: 0 });
      }
      return {
        ...prev,
        gems: prev.gems + DAILY_LOGIN_GEMS,
        gold: prev.gold + DAILY_LOGIN_GOLD,
        lastLoginDate: today,
        dailyFreePullUsed: false,
        dailyQuestProgress: {},
        dailyQuestsClaimed: [],
        ownedCharacters: newOwned,
      };
    });
    setShowDailyLogin(false);
  }, [dailyLoginReward]);

  const rollRarity = useCallback((pity: number): Rarity => {
    if (pity >= PITY_THRESHOLD - 1) return 'Legendary';
    const roll = Math.random();
    let cumulative = 0;
    for (const [rarity, rate] of Object.entries(DROP_RATES) as [Rarity, number][]) {
      cumulative += rate;
      if (roll < cumulative) return rarity;
    }
    return 'Common';
  }, []);

  const pullCharacter = useCallback((banner: 'standard' | 'featured'): { character: CharacterData; rarity: Rarity; isNew: boolean } => {
    let currentPity = state.pityCounter;
    const rarity = rollRarity(currentPity);

    let pool = ALL_CHARACTERS.filter(c => c.rarity === rarity);
    let selectedChar: CharacterData;

    if (rarity === 'Legendary' && banner === 'featured') {
      const isFeatured = state.featuredPityGuarantee || Math.random() < FEATURED_RATE;
      if (isFeatured) {
        selectedChar = ALL_CHARACTERS.find(c => c.id === FEATURED_CHARACTER_ID)!;
      } else {
        const nonFeatured = pool.filter(c => c.id !== FEATURED_CHARACTER_ID);
        selectedChar = nonFeatured[Math.floor(Math.random() * nonFeatured.length)] || pool[0];
      }
    } else {
      selectedChar = pool[Math.floor(Math.random() * pool.length)];
    }

    return { character: selectedChar, rarity, isNew: !state.ownedCharacters.some(oc => oc.characterId === selectedChar.id) };
  }, [state.pityCounter, state.featuredPityGuarantee, state.ownedCharacters, rollRarity]);

  const executePulls = useCallback((count: number, banner: 'standard' | 'featured') => {
    const results: { character: CharacterData; rarity: Rarity; isNew: boolean }[] = [];
    
    setState(prev => {
      let pity = prev.pityCounter;
      let featuredGuarantee = prev.featuredPityGuarantee;
      let owned = [...prev.ownedCharacters];
      const history = [...prev.pullHistory];
      
      for (let i = 0; i < count; i++) {
        const rarity = pity >= PITY_THRESHOLD - 1 ? 'Legendary' as Rarity : (() => {
          const roll = Math.random();
          let cum = 0;
          for (const [r, rate] of Object.entries(DROP_RATES) as [Rarity, number][]) {
            cum += rate;
            if (roll < cum) return r;
          }
          return 'Common' as Rarity;
        })();
        
        let pool = ALL_CHARACTERS.filter(c => c.rarity === rarity);
        let selectedChar: CharacterData;

        if (rarity === 'Legendary' && banner === 'featured') {
          const isFeatured = featuredGuarantee || Math.random() < FEATURED_RATE;
          if (isFeatured) {
            selectedChar = ALL_CHARACTERS.find(c => c.id === FEATURED_CHARACTER_ID)!;
            featuredGuarantee = false;
          } else {
            const nonFeatured = pool.filter(c => c.id !== FEATURED_CHARACTER_ID);
            selectedChar = nonFeatured[Math.floor(Math.random() * nonFeatured.length)] || pool[0];
            featuredGuarantee = true;
          }
        } else {
          selectedChar = pool[Math.floor(Math.random() * pool.length)];
        }

        const isNew = !owned.some(oc => oc.characterId === selectedChar.id);
        results.push({ character: selectedChar, rarity, isNew });

        if (isNew) {
          owned.push({ id: v4(), characterId: selectedChar.id, level: 1, exp: 0, stars: 1, soulShards: 0 });
        } else {
          owned = owned.map(oc => oc.characterId === selectedChar.id ? { ...oc, soulShards: oc.soulShards + 5 } : oc);
        }

        history.unshift({ characterId: selectedChar.id, rarity, banner, timestamp: Date.now() });
        pity = rarity === 'Legendary' ? 0 : pity + 1;
      }

      return {
        ...prev,
        pityCounter: pity,
        featuredPityGuarantee: featuredGuarantee,
        ownedCharacters: owned,
        pullHistory: history.slice(0, 50),
        totalPulls: prev.totalPulls + count,
        dailyQuestProgress: { ...prev.dailyQuestProgress, pull1: (prev.dailyQuestProgress.pull1 || 0) + count },
      };
    });

    return results;
  }, []);

  const spendGems = useCallback((amount: number) => {
    setState(prev => ({ ...prev, gems: prev.gems - amount }));
  }, []);

  const addGold = useCallback((amount: number) => {
    setState(prev => ({ ...prev, gold: prev.gold + amount }));
  }, []);

  const addGems = useCallback((amount: number) => {
    setState(prev => ({ ...prev, gems: prev.gems + amount }));
  }, []);

  const setParty = useCallback((partyIds: string[]) => {
    setState(prev => ({ ...prev, party: partyIds }));
  }, []);

  const addExp = useCallback((characterId: string, amount: number) => {
    setState(prev => {
      const newOwned = prev.ownedCharacters.map(oc => {
        if (oc.id !== characterId) return oc;
        let exp = oc.exp + amount;
        let level = oc.level;
        while (level < MAX_LEVEL && exp >= expForLevel(level)) {
          exp -= expForLevel(level);
          level++;
        }
        return { ...oc, exp, level };
      });
      return { ...prev, ownedCharacters: newOwned };
    });
  }, []);

  const upgradeStars = useCallback((ownedId: string) => {
    setState(prev => {
      const char = prev.ownedCharacters.find(oc => oc.id === ownedId);
      if (!char || char.stars >= 5) return prev;
      const cost = STAR_UPGRADE_COSTS[char.stars];
      if (char.soulShards < cost) return prev;
      return {
        ...prev,
        ownedCharacters: prev.ownedCharacters.map(oc =>
          oc.id === ownedId ? { ...oc, stars: oc.stars + 1, soulShards: oc.soulShards - cost } : oc
        ),
      };
    });
  }, []);

  const clearStage = useCallback((zoneId: string, stageNum: number) => {
    setState(prev => ({
      ...prev,
      stageProgress: {
        ...prev.stageProgress,
        [zoneId]: Math.max(prev.stageProgress[zoneId] || 0, stageNum),
      },
    }));
  }, []);

  const completeBattle = useCallback((goldReward: number, expReward: number, gemReward: number) => {
    setState(prev => {
      const newOwned = prev.ownedCharacters.map(oc => {
        if (!prev.party.includes(oc.id)) return oc;
        let exp = oc.exp + expReward;
        let level = oc.level;
        while (level < MAX_LEVEL && exp >= expForLevel(level)) {
          exp -= expForLevel(level);
          level++;
        }
        return { ...oc, exp, level };
      });
      return {
        ...prev,
        gold: prev.gold + goldReward,
        gems: prev.gems + gemReward,
        ownedCharacters: newOwned,
        battlesCompleted: prev.battlesCompleted + 1,
        dailyQuestProgress: {
          ...prev.dailyQuestProgress,
          battle3: (prev.dailyQuestProgress.battle3 || 0) + 1,
          battle5: (prev.dailyQuestProgress.battle5 || 0) + 1,
        },
      };
    });
  }, []);

  const useFreePull = useCallback(() => {
    setState(prev => ({ ...prev, dailyFreePullUsed: true }));
  }, []);

  const claimQuest = useCallback((questId: string) => {
    const quest = DAILY_QUESTS.find(q => q.id === questId);
    if (!quest) return;
    setState(prev => ({
      ...prev,
      gems: quest.rewardType === 'gems' ? prev.gems + quest.rewardAmount : prev.gems,
      gold: quest.rewardType === 'gold' ? prev.gold + quest.rewardAmount : prev.gold,
      dailyQuestsClaimed: [...prev.dailyQuestsClaimed, questId],
    }));
  }, []);

  const getCharStats = useCallback((owned: OwnedCharacter) => {
    const base = ALL_CHARACTERS.find(c => c.id === owned.characterId)!;
    const mult = 1 + (owned.stars - 1) * STAR_STAT_MULTIPLIER;
    const levelMult = 1 + (owned.level - 1) * 0.02;
    return {
      hp: Math.floor(base.baseHP * mult * levelMult),
      atk: Math.floor(base.baseATK * mult * levelMult),
      def: Math.floor(base.baseDEF * mult * levelMult),
      spd: Math.floor(base.baseSPD * mult * levelMult),
      crit: Math.min(base.baseCRIT + owned.stars * 2, 80),
    };
  }, []);

  return {
    state,
    setState,
    showDailyLogin,
    dailyLoginReward,
    claimDailyLogin,
    executePulls,
    spendGems,
    addGold,
    addGems,
    setParty,
    addExp,
    upgradeStars,
    clearStage,
    completeBattle,
    useFreePull,
    claimQuest,
    getCharStats,
  };
}
