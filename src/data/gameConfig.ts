// =============================================
// DROP RATES — Edit these values to adjust gacha rates
// =============================================
export const DROP_RATES = {
  Common: 0.40,      // 40%
  Uncommon: 0.30,    // 30%
  Rare: 0.20,        // 20%
  Epic: 0.08,        // 8%
  Legendary: 0.02,   // 2%
};

// Featured banner rate-up: if Legendary, 50% chance to be featured character
export const FEATURED_RATE = 0.5;

// Pity system: guaranteed Legendary after this many pulls without one
export const PITY_THRESHOLD = 90;

// Pull costs
export const SINGLE_PULL_COST = 100;
export const MULTI_PULL_COST = 900;

// Starting resources
export const STARTING_GEMS = 3000;
export const STARTING_GOLD = 10000;

// Daily login rewards
export const DAILY_LOGIN_GEMS = 300;
export const DAILY_LOGIN_GOLD = 1000;

// Level cap
export const MAX_LEVEL = 60;

// Star upgrade costs (soul shards needed per star level)
export const STAR_UPGRADE_COSTS = [0, 10, 20, 40, 80]; // 1★→2★, 2★→3★, etc.

// Stats increase per star level
export const STAR_STAT_MULTIPLIER = 0.15; // 15% per star

// EXP needed per level (simplified: level * 100)
export const expForLevel = (level: number) => level * 100;

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type Element = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Light' | 'Dark';
export type CharClass = 'Warrior' | 'Mage' | 'Archer' | 'Healer' | 'Assassin' | 'Summoner' | 'Tank';

export interface CharacterData {
  id: string;
  name: string;
  title: string;
  charClass: CharClass;
  element: Element;
  rarity: Rarity;
  baseHP: number;
  baseATK: number;
  baseDEF: number;
  baseSPD: number;
  baseCRIT: number;
  skillName: string;
  skillDesc: string;
  lore: string;
}

export interface OwnedCharacter {
  id: string;
  characterId: string;
  level: number;
  exp: number;
  stars: number;
  soulShards: number;
}

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: '#aaaaaa',
  Uncommon: '#44ff88',
  Rare: '#4488ff',
  Epic: '#cc44ff',
  Legendary: '#ffaa00',
};

export const ELEMENT_COLORS: Record<Element, string> = {
  Fire: '#ff5533',
  Water: '#3388ff',
  Earth: '#aa8844',
  Wind: '#44cc88',
  Light: '#ffdd66',
  Dark: '#8844aa',
};

export const ELEMENT_ICONS: Record<Element, string> = {
  Fire: '🔥', Water: '💧', Earth: '🌍', Wind: '💨', Light: '✨', Dark: '🌑',
};

export const CLASS_SKILLS: Record<CharClass, { name: string; type: 'damage' | 'heal' | 'aoe' | 'stun' | 'buff'; multiplier: number; spCost: number }> = {
  Warrior: { name: 'Shield Bash', type: 'stun', multiplier: 1.5, spCost: 30 },
  Mage: { name: 'Fireball', type: 'aoe', multiplier: 1.8, spCost: 40 },
  Archer: { name: 'Rain of Arrows', type: 'aoe', multiplier: 1.4, spCost: 35 },
  Healer: { name: 'Holy Light', type: 'heal', multiplier: 2.0, spCost: 35 },
  Assassin: { name: 'Shadow Strike', type: 'damage', multiplier: 2.5, spCost: 30 },
  Summoner: { name: 'Spirit Barrage', type: 'aoe', multiplier: 1.6, spCost: 45 },
  Tank: { name: 'Iron Wall', type: 'buff', multiplier: 0, spCost: 25 },
};

// =============================================
// CHARACTER ROSTER — 24 Isekai-themed characters
// =============================================
export const ALL_CHARACTERS: CharacterData[] = [
  {
    id: 'kaito', name: 'Kaito', title: 'The Reborn Gamer', charClass: 'Summoner', element: 'Dark', rarity: 'Legendary',
    baseHP: 850, baseATK: 220, baseDEF: 140, baseSPD: 180, baseCRIT: 15,
    skillName: 'Dark Summon', skillDesc: 'Summons shadow beasts to attack all enemies',
    lore: 'A competitive gamer who died during a tournament and woke up with the ability to tame monsters. His gaming knowledge gives him unparalleled tactical awareness.',
  },
  {
    id: 'aldric', name: 'Aldric', title: 'The Unwilling Hero', charClass: 'Tank', element: 'Earth', rarity: 'Legendary',
    baseHP: 1200, baseATK: 150, baseDEF: 280, baseSPD: 100, baseCRIT: 5,
    skillName: 'Plot Armor', skillDesc: 'Massively increases DEF and taunts all enemies for 2 turns',
    lore: 'Summoned from a fantasy novel he was writing — he already knows how this world is supposed to end. His meta-knowledge makes him nearly unkillable.',
  },
  {
    id: 'luna', name: 'Luna', title: 'Moonlight Sovereign', charClass: 'Mage', element: 'Light', rarity: 'Legendary',
    baseHP: 750, baseATK: 280, baseDEF: 120, baseSPD: 190, baseCRIT: 20,
    skillName: 'Celestial Nova', skillDesc: 'Unleashes a devastating beam of moonlight on all enemies',
    lore: 'An astronomer who fell into a wormhole and was reborn as the vessel of a moon goddess. She sees the threads of fate in the stars above.',
  },
  {
    id: 'yuna', name: 'Yuna', title: 'The Fallen Idol', charClass: 'Healer', element: 'Light', rarity: 'Epic',
    baseHP: 900, baseATK: 160, baseDEF: 180, baseSPD: 150, baseCRIT: 8,
    skillName: 'Encore Heal', skillDesc: 'Heals all party members with the power of song',
    lore: 'A pop star reincarnated as a saint with miraculous healing powers she can\'t fully control. Her concerts now literally save lives.',
  },
  {
    id: 'ryo', name: 'Ryō', title: 'Ironheart', charClass: 'Warrior', element: 'Fire', rarity: 'Epic',
    baseHP: 1050, baseATK: 240, baseDEF: 200, baseSPD: 130, baseCRIT: 12,
    skillName: 'Demolition Strike', skillDesc: 'A devastating blow that ignores 50% of enemy DEF',
    lore: 'A construction worker whose absurd physical stats broke the world\'s leveling system. He punches harder than most swords can cut.',
  },
  {
    id: 'mei', name: 'Mei', title: 'Shadowthread', charClass: 'Assassin', element: 'Dark', rarity: 'Rare',
    baseHP: 680, baseATK: 210, baseDEF: 110, baseSPD: 220, baseCRIT: 25,
    skillName: 'Code: Delete', skillDesc: 'Strikes from the shadows with a critical multiplier',
    lore: 'A shy programmer reborn as a shadow-walker; writes code-like kill commands in her mind. Her debugging skills translate to finding enemy weak points.',
  },
  {
    id: 'sora', name: 'Sora', title: 'Stormwing', charClass: 'Archer', element: 'Wind', rarity: 'Rare',
    baseHP: 720, baseATK: 200, baseDEF: 130, baseSPD: 200, baseCRIT: 18,
    skillName: 'Gale Volley', skillDesc: 'Fires a barrage of wind-infused arrows at all enemies',
    lore: 'A delivery driver who gained supernatural aim; can hit targets across entire battlefields. Never misses a deadline or a target.',
  },
  {
    id: 'hana', name: 'Hana', title: 'Bloom Witch', charClass: 'Mage', element: 'Earth', rarity: 'Epic',
    baseHP: 800, baseATK: 250, baseDEF: 140, baseSPD: 160, baseCRIT: 14,
    skillName: 'Thorny Embrace', skillDesc: 'Entangles enemies in magical vines dealing AoE damage',
    lore: 'A botanist who was swallowed by a carnivorous plant and emerged in a world where her plant knowledge grants her terrifying magical power.',
  },
  {
    id: 'takeshi', name: 'Takeshi', title: 'The Salary Knight', charClass: 'Warrior', element: 'Light', rarity: 'Rare',
    baseHP: 950, baseATK: 190, baseDEF: 190, baseSPD: 140, baseCRIT: 10,
    skillName: 'Overtime Slash', skillDesc: 'A powerful strike that gets stronger the longer the battle lasts',
    lore: 'A salaryman who was summoned during his overtime shift. His work ethic is so strong that the Demon King offered him a management position.',
  },
  {
    id: 'rin', name: 'Rin', title: 'Frostbite Chef', charClass: 'Mage', element: 'Water', rarity: 'Rare',
    baseHP: 770, baseATK: 230, baseDEF: 120, baseSPD: 170, baseCRIT: 16,
    skillName: 'Flash Freeze', skillDesc: 'Encases enemies in ice, dealing damage and reducing SPD',
    lore: 'A sushi chef who was reborn with cryomancy. Her knife skills combined with ice magic make her a terrifyingly precise combatant.',
  },
  {
    id: 'daisuke', name: 'Daisuke', title: 'The Shieldmaiden\'s Son', charClass: 'Tank', element: 'Water', rarity: 'Uncommon',
    baseHP: 1100, baseATK: 120, baseDEF: 250, baseSPD: 90, baseCRIT: 3,
    skillName: 'Tidal Wall', skillDesc: 'Creates a water barrier that absorbs damage for all allies',
    lore: 'A lifeguard who drowned saving a child and was reborn as the son of a legendary shieldmaiden. His protective instincts are supernatural.',
  },
  {
    id: 'aoi', name: 'Aoi', title: 'Pixel Dancer', charClass: 'Assassin', element: 'Wind', rarity: 'Uncommon',
    baseHP: 650, baseATK: 180, baseDEF: 100, baseSPD: 230, baseCRIT: 22,
    skillName: 'Blade Dance', skillDesc: 'A flurry of attacks hitting random enemies multiple times',
    lore: 'A rhythm game champion whose perfect timing translated into deadly combat reflexes. She fights to the beat of an otherworldly soundtrack.',
  },
  {
    id: 'kenji', name: 'Kenji', title: 'Iron Chef Berserker', charClass: 'Warrior', element: 'Fire', rarity: 'Uncommon',
    baseHP: 980, baseATK: 210, baseDEF: 160, baseSPD: 120, baseCRIT: 8,
    skillName: 'Flame Cleave', skillDesc: 'A fiery slash that burns enemies over time',
    lore: 'A hot-headed street food vendor who literally became a fire warrior. His wok is now his shield, his spatula a legendary blade.',
  },
  {
    id: 'miku', name: 'Miku', title: 'Crystal Songstress', charClass: 'Healer', element: 'Water', rarity: 'Uncommon',
    baseHP: 880, baseATK: 130, baseDEF: 160, baseSPD: 140, baseCRIT: 5,
    skillName: 'Healing Melody', skillDesc: 'A soothing song that restores HP to the most injured ally',
    lore: 'A karaoke enthusiast whose voice literally heals wounds in this world. She sings ballads that mend bones and cure diseases.',
  },
  {
    id: 'jin', name: 'Jin', title: 'Phantom Courier', charClass: 'Archer', element: 'Dark', rarity: 'Uncommon',
    baseHP: 700, baseATK: 190, baseDEF: 120, baseSPD: 210, baseCRIT: 20,
    skillName: 'Shadow Arrow', skillDesc: 'Fires a dark-infused arrow that pierces through defenses',
    lore: 'A bike messenger who could navigate any city blindfolded, now navigates dungeons with the same uncanny sense of direction.',
  },
  {
    id: 'sakura', name: 'Sakura', title: 'Petal Guard', charClass: 'Tank', element: 'Wind', rarity: 'Common',
    baseHP: 1000, baseATK: 110, baseDEF: 220, baseSPD: 100, baseCRIT: 4,
    skillName: 'Petal Shield', skillDesc: 'Surrounds party with protective petals reducing damage',
    lore: 'A florist who was whisked away by cherry blossom petals into another world. Her gentle nature hides an iron will.',
  },
  {
    id: 'taro', name: 'Taro', title: 'Fumbling Apprentice', charClass: 'Mage', element: 'Fire', rarity: 'Common',
    baseHP: 650, baseATK: 170, baseDEF: 100, baseSPD: 150, baseCRIT: 10,
    skillName: 'Spark Burst', skillDesc: 'An unstable fire spell that deals random damage',
    lore: 'A chemistry student whose failed experiments in the real world make him a dangerously unpredictable mage here.',
  },
  {
    id: 'yuki', name: 'Yuki', title: 'Frost Maiden', charClass: 'Healer', element: 'Water', rarity: 'Common',
    baseHP: 800, baseATK: 120, baseDEF: 150, baseSPD: 130, baseCRIT: 5,
    skillName: 'Frost Aid', skillDesc: 'Heals one ally with a cooling touch',
    lore: 'A nurse who always had cold hands — turns out they were meant for ice healing magic. Patients love and fear her equally.',
  },
  {
    id: 'goro', name: 'Goro', title: 'Stone Fist', charClass: 'Warrior', element: 'Earth', rarity: 'Common',
    baseHP: 1050, baseATK: 180, baseDEF: 200, baseSPD: 80, baseCRIT: 6,
    skillName: 'Rock Smash', skillDesc: 'A powerful earth-infused punch',
    lore: 'A retired sumo wrestler who found that his bulk translates perfectly into fantasy warrior stats. He misses rice bowls.',
  },
  {
    id: 'nami', name: 'Nami', title: 'Tide Caller', charClass: 'Summoner', element: 'Water', rarity: 'Rare',
    baseHP: 780, baseATK: 200, baseDEF: 130, baseSPD: 175, baseCRIT: 12,
    skillName: 'Tidal Summon', skillDesc: 'Summons water spirits to attack all enemies',
    lore: 'A marine biologist who can communicate with sea creatures. In this world, she commands water elementals with a scientist\'s precision.',
  },
  {
    id: 'kira', name: 'Kira', title: 'Neon Blade', charClass: 'Assassin', element: 'Light', rarity: 'Epic',
    baseHP: 700, baseATK: 260, baseDEF: 120, baseSPD: 240, baseCRIT: 28,
    skillName: 'Luminous Edge', skillDesc: 'A blinding strike that deals massive critical damage',
    lore: 'A cosplayer who became the character she was dressed as — a legendary light assassin. Her costume is now real enchanted armor.',
  },
  {
    id: 'haruki', name: 'Haruki', title: 'The Chronicler', charClass: 'Summoner', element: 'Light', rarity: 'Rare',
    baseHP: 800, baseATK: 190, baseDEF: 140, baseSPD: 165, baseCRIT: 10,
    skillName: 'Story Summon', skillDesc: 'Brings characters from written stories to fight',
    lore: 'A librarian who discovered that the books in this world\'s library contain living stories. He reads enemies to defeat.',
  },
  {
    id: 'misaki', name: 'Misaki', title: 'Venom Dancer', charClass: 'Archer', element: 'Earth', rarity: 'Common',
    baseHP: 690, baseATK: 175, baseDEF: 115, baseSPD: 185, baseCRIT: 15,
    skillName: 'Poison Dart', skillDesc: 'Fires a poisoned arrow that deals damage over time',
    lore: 'A pharmacist who knows exactly how much poison is too much. Her arrows carry precisely measured doses of doom.',
  },
  {
    id: 'zen', name: 'Zen', title: 'The Enlightened', charClass: 'Healer', element: 'Wind', rarity: 'Common',
    baseHP: 820, baseATK: 110, baseDEF: 140, baseSPD: 160, baseCRIT: 4,
    skillName: 'Meditation', skillDesc: 'Channels inner peace to heal one ally',
    lore: 'A yoga instructor whose meditation accidentally opened a portal. His inner peace is so powerful it literally heals wounds.',
  },
];

// Zone & Stage data
export interface StageData {
  id: number;
  enemies: { name: string; hp: number; atk: number; def: number; spd: number; element: Element; level: number }[];
  rewards: { gold: number; exp: number; gemChance: number; gemAmount: number };
}

export interface ZoneData {
  id: string;
  name: string;
  description: string;
  stages: StageData[];
  requiredLevel: number;
}

const generateEnemies = (zoneTier: number, stageNum: number) => {
  const level = zoneTier * 10 + stageNum;
  const elements: Element[] = ['Fire', 'Water', 'Earth', 'Wind', 'Light', 'Dark'];
  const names = ['Slime', 'Goblin', 'Wolf', 'Skeleton', 'Golem', 'Wraith', 'Drake', 'Ogre', 'Bandit', 'Imp'];
  const count = Math.min(1 + Math.floor(stageNum / 3), 4);
  return Array.from({ length: count }, (_, i) => ({
    name: `${elements[(zoneTier + i) % 6]} ${names[(stageNum + i) % names.length]}`,
    hp: 200 + level * 30 + i * 50,
    atk: 30 + level * 5 + i * 10,
    def: 20 + level * 3 + i * 5,
    spd: 80 + level * 2,
    element: elements[(zoneTier + stageNum + i) % 6],
    level,
  }));
};

const generateStages = (zoneTier: number): StageData[] =>
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    enemies: generateEnemies(zoneTier, i + 1),
    rewards: {
      gold: 100 + zoneTier * 50 + (i + 1) * 20,
      exp: 50 + zoneTier * 30 + (i + 1) * 15,
      gemChance: 0.1 + zoneTier * 0.02,
      gemAmount: 10 + zoneTier * 5,
    },
  }));

export const ZONES: ZoneData[] = [
  { id: 'forest', name: "Beginner's Forest", description: 'A peaceful woodland where newborn heroes take their first steps.', stages: generateStages(0), requiredLevel: 1 },
  { id: 'kingdom', name: 'Ruined Kingdom', description: 'Once a proud civilization, now overrun by monsters and decay.', stages: generateStages(1), requiredLevel: 10 },
  { id: 'fortress', name: 'Sky Fortress', description: 'A floating citadel guarded by wind elementals and ancient golems.', stages: generateStages(2), requiredLevel: 20 },
  { id: 'abyss', name: 'Abyssal Dungeon', description: 'The deepest dungeon where light itself fears to enter.', stages: generateStages(3), requiredLevel: 35 },
  { id: 'tower', name: 'Final Boss Tower', description: 'The Demon King awaits at the top. Only the strongest may enter.', stages: generateStages(4), requiredLevel: 50 },
];

// Featured character (rotates — for now, fixed)
export const FEATURED_CHARACTER_ID = 'luna';

// Daily quest definitions
export interface DailyQuest {
  id: string;
  description: string;
  target: number;
  rewardType: 'gems' | 'gold';
  rewardAmount: number;
}

export const DAILY_QUESTS: DailyQuest[] = [
  { id: 'battle3', description: 'Complete 3 battles', target: 3, rewardType: 'gold', rewardAmount: 500 },
  { id: 'pull1', description: 'Pull once today', target: 1, rewardType: 'gems', rewardAmount: 50 },
  { id: 'battle5', description: 'Complete 5 battles', target: 5, rewardType: 'gems', rewardAmount: 100 },
  { id: 'level1', description: 'Level up a character', target: 1, rewardType: 'gold', rewardAmount: 300 },
];
