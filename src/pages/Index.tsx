import React, { useState } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { TopHUD } from '@/components/TopHUD';
import { BottomNav } from '@/components/BottomNav';
import { DailyLoginModal } from '@/components/DailyLoginModal';
import { HomePage } from './HomePage';
import { SummonPage } from './SummonPage';
import { AdventurePage } from './AdventurePage';
import { CollectionPage } from './CollectionPage';
import { PartyPage } from './PartyPage';
import { ShopPage } from './ShopPage';

const GameApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { showDailyLogin } = useGame();
  const [loginDismissed, setLoginDismissed] = useState(false);

  return (
    <div className="min-h-screen pb-16 pt-12 scanline-bg">
      <TopHUD />

      {showDailyLogin && !loginDismissed && (
        <DailyLoginModal onClose={() => setLoginDismissed(true)} />
      )}

      <div className="max-w-lg mx-auto px-3 py-2">
        {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === 'summon' && <SummonPage />}
        {currentPage === 'adventure' && <AdventurePage onNavigate={setCurrentPage} />}
        {currentPage === 'collection' && <CollectionPage />}
        {currentPage === 'party' && <PartyPage />}
        {currentPage === 'shop' && <ShopPage />}
      </div>

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

const Index = () => (
  <GameProvider>
    <GameApp />
  </GameProvider>
);

export default Index;
