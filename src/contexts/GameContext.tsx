import React, { createContext, useContext, ReactNode } from 'react';
import { useGameState } from '@/hooks/useGameState';

type GameContextType = ReturnType<typeof useGameState>;

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useGameState();
  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
