import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import {
  ALL_CHARACTERS, CLASS_SKILLS, ELEMENT_COLORS, ELEMENT_ICONS,
  type ZoneData, type OwnedCharacter,
} from '@/data/gameConfig';
import { CharacterSprite, EnemySprite } from '@/components/CharacterSprite';

interface BattlePageProps {
  zone: ZoneData;
  stageIndex: number;
  onExit: () => void;
}

interface BattleUnit {
  id: string;
  name: string;
  isEnemy: boolean;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  spd: number;
  crit: number;
  sp: number;
  maxSp: number;
  element: string;
  charClass: string;
  characterId?: string;
  stunned: boolean;
  buffDef: number;
}

type BattleAction = 'attack' | 'skill' | 'item';

export const BattlePage = ({ zone, stageIndex, onExit }: BattlePageProps) => {
  const { state, completeBattle, clearStage, getCharStats } = useGame();
  const stage = zone.stages[stageIndex];

  const initUnits = useCallback((): BattleUnit[] => {
    const playerUnits: BattleUnit[] = state.party.map((id, i) => {
      const owned = state.ownedCharacters.find(oc => oc.id === id)!;
      const char = ALL_CHARACTERS.find(c => c.id === owned.characterId)!;
      const stats = getCharStats(owned);
      return {
        id: `player-${i}`,
        name: char.name,
        isEnemy: false,
        hp: stats.hp,
        maxHp: stats.hp,
        atk: stats.atk,
        def: stats.def,
        spd: stats.spd,
        crit: stats.crit,
        sp: 100,
        maxSp: 100,
        element: char.element,
        charClass: char.charClass,
        characterId: char.id,
        stunned: false,
        buffDef: 0,
      };
    });

    const enemyUnits: BattleUnit[] = stage.enemies.map((e, i) => ({
      id: `enemy-${i}`,
      name: e.name,
      isEnemy: true,
      hp: e.hp,
      maxHp: e.hp,
      atk: e.atk,
      def: e.def,
      spd: e.spd,
      crit: 5,
      sp: 0,
      maxSp: 0,
      element: e.element,
      charClass: 'Warrior',
      stunned: false,
      buffDef: 0,
    }));

    return [...playerUnits, ...enemyUnits];
  }, [state.party, state.ownedCharacters, stage, getCharStats]);

  const [units, setUnits] = useState<BattleUnit[]>(initUnits);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>(['⚔️ Battle Start!']);
  const [battleState, setBattleState] = useState<'player-turn' | 'enemy-turn' | 'victory' | 'defeat'>('player-turn');
  const [selectedAction, setSelectedAction] = useState<BattleAction | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [attackEffect, setAttackEffect] = useState<{ targetId: string; type: string } | null>(null);
  const [lootPopup, setLootPopup] = useState<{ gold: number; exp: number; gems: number } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const playerUnits = units.filter(u => !u.isEnemy);
  const enemyUnits = units.filter(u => u.isEnemy);
  const alivePlayerUnits = playerUnits.filter(u => u.hp > 0);
  const aliveEnemyUnits = enemyUnits.filter(u => u.hp > 0);

  const currentPlayerUnit = alivePlayerUnits.find((_, i) => {
    const idx = playerUnits.indexOf(alivePlayerUnits[i]);
    return idx >= currentUnitIndex;
  }) || alivePlayerUnits[0];

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [battleLog]);

  const addLog = useCallback((msg: string) => {
    setBattleLog(prev => [...prev, msg]);
  }, []);

  const calcDamage = (attacker: BattleUnit, defender: BattleUnit, multiplier: number = 1) => {
    const isCrit = Math.random() * 100 < attacker.crit;
    const baseDmg = Math.max(1, attacker.atk * multiplier - (defender.def + defender.buffDef) * 0.5);
    const dmg = Math.floor(baseDmg * (0.9 + Math.random() * 0.2) * (isCrit ? 2 : 1));
    return { dmg, isCrit };
  };

  const executePlayerAction = useCallback((action: BattleAction, targetId?: string) => {
    if (!currentPlayerUnit || battleState !== 'player-turn') return;

    setUnits(prev => {
      const newUnits = [...prev];
      const attacker = newUnits.find(u => u.id === currentPlayerUnit.id)!;
      const skill = CLASS_SKILLS[attacker.charClass as keyof typeof CLASS_SKILLS];

      if (action === 'attack') {
        const target = newUnits.find(u => u.id === (targetId || aliveEnemyUnits[0]?.id));
        if (!target) return prev;
        const { dmg, isCrit } = calcDamage(attacker, target);
        target.hp = Math.max(0, target.hp - dmg);
        setAttackEffect({ targetId: target.id, type: 'slash' });
        setTimeout(() => setAttackEffect(null), 300);
        addLog(`${attacker.name} attacks ${target.name} for ${dmg} dmg${isCrit ? ' CRIT!' : ''}`);
      } else if (action === 'skill') {
        if (attacker.sp < skill.spCost) {
          addLog(`${attacker.name} doesn't have enough SP!`);
          return prev;
        }
        attacker.sp -= skill.spCost;

        if (skill.type === 'heal') {
          const healTarget = [...newUnits].filter(u => !u.isEnemy && u.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
          if (healTarget) {
            const healAmt = Math.floor(attacker.atk * skill.multiplier);
            healTarget.hp = Math.min(healTarget.maxHp, healTarget.hp + healAmt);
            addLog(`${attacker.name} uses ${skill.name}! Heals ${healTarget.name} for ${healAmt} HP`);
            setAttackEffect({ targetId: healTarget.id, type: 'magic' });
            setTimeout(() => setAttackEffect(null), 500);
          }
        } else if (skill.type === 'aoe') {
          const alive = newUnits.filter(u => u.isEnemy && u.hp > 0);
          alive.forEach(target => {
            const { dmg } = calcDamage(attacker, target, skill.multiplier * 0.7);
            target.hp = Math.max(0, target.hp - dmg);
          });
          addLog(`${attacker.name} uses ${skill.name}! Hits all enemies!`);
          setAttackEffect({ targetId: 'all-enemies', type: 'magic' });
          setTimeout(() => setAttackEffect(null), 500);
        } else if (skill.type === 'stun') {
          const target = newUnits.find(u => u.id === (targetId || aliveEnemyUnits[0]?.id));
          if (target) {
            const { dmg } = calcDamage(attacker, target, skill.multiplier);
            target.hp = Math.max(0, target.hp - dmg);
            target.stunned = true;
            addLog(`${attacker.name} uses ${skill.name}! ${target.name} is stunned! ${dmg} dmg`);
            setAttackEffect({ targetId: target.id, type: 'slash' });
            setTimeout(() => setAttackEffect(null), 300);
          }
        } else if (skill.type === 'damage') {
          const target = newUnits.find(u => u.id === (targetId || aliveEnemyUnits[0]?.id));
          if (target) {
            const { dmg } = calcDamage(attacker, target, skill.multiplier);
            target.hp = Math.max(0, target.hp - dmg);
            addLog(`${attacker.name} uses ${skill.name}! ${dmg} dmg to ${target.name}!`);
            setAttackEffect({ targetId: target.id, type: 'slash' });
            setTimeout(() => setAttackEffect(null), 300);
          }
        } else if (skill.type === 'buff') {
          newUnits.filter(u => !u.isEnemy && u.hp > 0).forEach(u => { u.buffDef += 50; });
          addLog(`${attacker.name} uses ${skill.name}! Party DEF increased!`);
        }
      } else if (action === 'item') {
        // Simple potion
        const healTarget = [...newUnits].filter(u => !u.isEnemy && u.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
        if (healTarget) {
          const healAmt = Math.floor(healTarget.maxHp * 0.3);
          healTarget.hp = Math.min(healTarget.maxHp, healTarget.hp + healAmt);
          addLog(`Used Potion on ${healTarget.name}! +${healAmt} HP`);
        }
      }

      return newUnits;
    });

    // Move to next unit or enemy turn
    const aliveCount = alivePlayerUnits.length;
    const currentIdx = alivePlayerUnits.indexOf(currentPlayerUnit);
    if (currentIdx < aliveCount - 1) {
      setCurrentUnitIndex(prev => prev + 1);
    } else {
      setCurrentUnitIndex(0);
      setBattleState('enemy-turn');
    }

    setSelectedAction(null);
    setSelectedTarget(null);
  }, [currentPlayerUnit, battleState, aliveEnemyUnits, alivePlayerUnits, addLog]);

  // Enemy turn
  useEffect(() => {
    if (battleState !== 'enemy-turn') return;

    const timeout = setTimeout(() => {
      setUnits(prev => {
        const newUnits = [...prev];
        const aliveEnemies = newUnits.filter(u => u.isEnemy && u.hp > 0);
        const alivePlayers = newUnits.filter(u => !u.isEnemy && u.hp > 0);

        aliveEnemies.forEach(enemy => {
          if (enemy.stunned) {
            enemy.stunned = false;
            addLog(`${enemy.name} is stunned and can't act!`);
            return;
          }
          if (alivePlayers.length === 0) return;

          // Simple AI: 60% attack weakest, 30% attack strongest, 10% random
          const roll = Math.random();
          let target: BattleUnit;
          if (roll < 0.6) {
            target = alivePlayers.reduce((a, b) => a.hp < b.hp ? a : b);
          } else if (roll < 0.9) {
            target = alivePlayers.reduce((a, b) => a.atk > b.atk ? a : b);
          } else {
            target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          }

          const { dmg, isCrit } = calcDamage(enemy, target);
          target.hp = Math.max(0, target.hp - dmg);
          addLog(`${enemy.name} attacks ${target.name} for ${dmg} dmg${isCrit ? ' CRIT!' : ''}`);
          setAttackEffect({ targetId: target.id, type: 'slash' });
        });

        return newUnits;
      });

      setTimeout(() => {
        setAttackEffect(null);
        setBattleState('player-turn');
        setCurrentUnitIndex(0);
      }, 500);
    }, 800);

    return () => clearTimeout(timeout);
  }, [battleState, addLog]);

  // Check win/lose
  useEffect(() => {
    if (battleState === 'victory' || battleState === 'defeat') return;
    const alivePlayers = units.filter(u => !u.isEnemy && u.hp > 0);
    const aliveEnemies = units.filter(u => u.isEnemy && u.hp > 0);

    if (aliveEnemies.length === 0) {
      setBattleState('victory');
      addLog('🎉 VICTORY!');
      const gemRoll = Math.random() < stage.rewards.gemChance;
      const gems = gemRoll ? stage.rewards.gemAmount : 0;
      completeBattle(stage.rewards.gold, stage.rewards.exp, gems);
      clearStage(zone.id, stageIndex + 1);
      setLootPopup({ gold: stage.rewards.gold, exp: stage.rewards.exp, gems });
    } else if (alivePlayers.length === 0) {
      setBattleState('defeat');
      addLog('💀 DEFEAT...');
    }
  }, [units, battleState, stage, zone, stageIndex, completeBattle, clearStage, addLog]);

  return (
    <div className="space-y-2 pb-4">
      <div className="flex justify-between items-center">
        <button onClick={onExit} className="pixel-btn-secondary text-[7px]">← RETREAT</button>
        <span className="font-pixel text-[8px] text-foreground">{zone.name} — Stage {stageIndex + 1}</span>
      </div>

      {/* Battle field */}
      <div className="pixel-border rounded-sm p-3 min-h-[200px] relative"
        style={{ background: 'linear-gradient(180deg, hsl(234 55% 10%) 0%, hsl(234 45% 6%) 100%)' }}>

        {/* Enemies (top right) */}
        <div className="flex justify-end gap-2 mb-6">
          {enemyUnits.map(enemy => (
            <div
              key={enemy.id}
              className={`text-center relative transition-all ${enemy.hp <= 0 ? 'opacity-20' : ''} ${
                selectedAction && enemy.hp > 0 ? 'cursor-pointer hover:scale-110' : ''
              }`}
              onClick={() => {
                if (selectedAction && enemy.hp > 0 && selectedAction !== 'item') {
                  executePlayerAction(selectedAction, enemy.id);
                }
              }}
            >
              <EnemySprite element={enemy.element} size={40} />
              <p className="font-pixel text-[5px] text-foreground">{enemy.name}</p>
              <div className="hp-bar mt-0.5" style={{ width: 40 }}>
                <div className="hp-bar-fill" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%`, background: enemy.hp / enemy.maxHp < 0.3 ? 'hsl(var(--destructive))' : undefined }} />
              </div>
              {attackEffect?.targetId === enemy.id && (
                <div className={`absolute inset-0 ${attackEffect.type === 'slash' ? 'animate-slash bg-foreground/50' : 'animate-magic-burst bg-accent/50'}`} />
              )}
              {attackEffect?.targetId === 'all-enemies' && enemy.hp > 0 && (
                <div className="absolute inset-0 animate-magic-burst bg-accent/50" />
              )}
            </div>
          ))}
        </div>

        {/* Players (bottom left) */}
        <div className="flex gap-2">
          {playerUnits.map(unit => (
            <div key={unit.id} className={`text-center relative ${unit.hp <= 0 ? 'opacity-20' : ''} ${
              unit.id === currentPlayerUnit?.id && battleState === 'player-turn' ? 'ring-2 ring-primary rounded-sm' : ''
            }`}>
              <CharacterSprite characterId={unit.characterId!} size={40} />
              <p className="font-pixel text-[5px] text-foreground">{unit.name}</p>
              <div className="hp-bar mt-0.5" style={{ width: 40 }}>
                <div className="hp-bar-fill" style={{ width: `${(unit.hp / unit.maxHp) * 100}%`, background: unit.hp / unit.maxHp < 0.3 ? 'hsl(var(--destructive))' : undefined }} />
              </div>
              <div className="hp-bar mt-0.5" style={{ width: 40 }}>
                <div className="sp-bar-fill" style={{ width: `${(unit.sp / unit.maxSp) * 100}%` }} />
              </div>
              {attackEffect?.targetId === unit.id && (
                <div className={`absolute inset-0 ${attackEffect.type === 'slash' ? 'animate-slash bg-destructive/50' : 'animate-magic-burst bg-game-hp/50'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {battleState === 'player-turn' && currentPlayerUnit && currentPlayerUnit.hp > 0 && (
        <div className="space-y-2">
          <p className="font-pixel text-[7px] text-primary text-center">
            {currentPlayerUnit.name}'s turn {selectedAction ? `→ Select target` : ''}
          </p>
          {!selectedAction ? (
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setSelectedAction('attack')} className="pixel-btn-primary text-[7px]">
                ⚔️ Attack
              </button>
              <button
                onClick={() => {
                  const skill = CLASS_SKILLS[currentPlayerUnit.charClass as keyof typeof CLASS_SKILLS];
                  if (currentPlayerUnit.sp >= skill.spCost) {
                    if (skill.type === 'heal' || skill.type === 'aoe' || skill.type === 'buff') {
                      executePlayerAction('skill');
                    } else {
                      setSelectedAction('skill');
                    }
                  }
                }}
                className={`pixel-btn text-[7px] ${
                  currentPlayerUnit.sp >= CLASS_SKILLS[currentPlayerUnit.charClass as keyof typeof CLASS_SKILLS].spCost
                    ? 'pixel-btn-secondary' : 'pixel-btn-disabled'
                }`}
              >
                ✨ Skill ({CLASS_SKILLS[currentPlayerUnit.charClass as keyof typeof CLASS_SKILLS].spCost} SP)
              </button>
              <button onClick={() => executePlayerAction('item')} className="pixel-btn-secondary text-[7px]">
                🧪 Potion
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setSelectedAction(null)} className="pixel-btn-secondary text-[7px]">← Back</button>
              <p className="font-retro text-sm text-muted-foreground self-center">Click an enemy to target</p>
            </div>
          )}
        </div>
      )}

      {/* Victory/Defeat */}
      {battleState === 'victory' && lootPopup && (
        <div className="pixel-border-gold p-4 text-center animate-bounce-in" style={{ background: 'hsl(var(--card))' }}>
          <h3 className="font-pixel text-sm text-primary mb-2">🎉 VICTORY!</h3>
          <div className="space-y-1">
            <p className="font-retro text-lg text-game-gold animate-float-up">🪙 +{lootPopup.gold} Gold</p>
            <p className="font-retro text-lg text-game-hp animate-float-up" style={{ animationDelay: '0.2s' }}>⭐ +{lootPopup.exp} EXP</p>
            {lootPopup.gems > 0 && (
              <p className="font-retro text-lg text-game-gem animate-float-up" style={{ animationDelay: '0.4s' }}>💎 +{lootPopup.gems} Gems!</p>
            )}
          </div>
          <button onClick={onExit} className="pixel-btn-primary mt-3">CONTINUE</button>
        </div>
      )}

      {battleState === 'defeat' && (
        <div className="pixel-card text-center">
          <h3 className="font-pixel text-sm text-destructive mb-2">💀 DEFEAT</h3>
          <p className="font-retro text-sm text-muted-foreground">Your party has fallen...</p>
          <button onClick={onExit} className="pixel-btn-secondary mt-3">RETREAT</button>
        </div>
      )}

      {/* Battle Log */}
      <div ref={logRef} className="pixel-card max-h-32 overflow-y-auto">
        <p className="font-pixel text-[7px] text-muted-foreground mb-1">Battle Log</p>
        {battleLog.map((msg, i) => (
          <p key={i} className="font-retro text-xs text-foreground">{msg}</p>
        ))}
      </div>
    </div>
  );
};
