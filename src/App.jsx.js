import React, { useEffect, useState } from 'react';
import { Camera, EyeOff } from 'lucide-react';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Notifications } from './components/layout/Notifications';
import { AchievementsPanel } from './components/panels/AchievementsPanel';

import { Background } from './components/arena/Background';
import { Block } from './components/arena/Block';
import { FloatingDamage } from './components/arena/FloatingDamage';
import { RandomEventsOverlay } from './components/arena/RandomEventsOverlay';
import { VoyagerHUD } from './components/arena/VoyagerHUD';
import { BoboDrone } from './components/arena/BoboDrone';

import { useCombat } from './hooks/useCombat';
import { useAutoClicker } from './hooks/useAutoClicker';
import { useSaveSystem } from './hooks/useSaveSystem';
import { useGameStore } from './store/useGameStore';
import { initTelegram } from './utils/telegram';
import { PLANETS } from './config/planets';
import { GAME_CONSTANTS } from './config/constants';

export default function App() {
  const [isAchOpen, setAchOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false); 

  useEffect(() => { initTelegram(); }, []);
  useSaveSystem();
  
  const { handleHit, floatingTexts } = useCombat();
  useAutoClicker(handleHit);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe(
      (state) => state.planetDamageDealt,
      (damage) => {
        const state = useGameStore.getState();
        const currentIndex = state.currentPlanetIndex;
        if (currentIndex >= PLANETS.length - 1) return;
        const targetDamage = PLANETS[currentIndex].targetAU * GAME_CONSTANTS.AU_TO_DAMAGE;
        if (damage >= targetDamage) state.nextPlanet();
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-slate-100 flex flex-col font-sans">
      <Background />
      <button onClick={() => setIsZenMode(!isZenMode)} className={`absolute top-4 right-4 z-[9999] p-3 rounded-full backdrop-blur-md transition-all duration-500 flex items-center justify-center ${isZenMode ? 'bg-transparent text-white/10 hover:text-white/50 scale-75' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-lg'}`}>
        {isZenMode ? <EyeOff size={20} /> : <Camera size={20} />}
      </button>

      <div className={`relative z-10 w-full h-full flex flex-col pointer-events-none transition-opacity duration-700 ease-in-out ${isZenMode ? 'opacity-0' : 'opacity-100'}`}>
        <Header onOpenAch={() => setAchOpen(true)} />
        <Notifications />
        <div className="flex-1 relative flex items-center justify-center"><VoyagerHUD /></div>
        <Footer />
        <AchievementsPanel isOpen={isAchOpen} onClose={() => setAchOpen(false)} />
      </div>

      <main className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto">
        <RandomEventsOverlay />
        <BoboDrone />
        <Block onHit={handleHit} />
        <FloatingDamage floatingTexts={floatingTexts} />
      </main>
    </div>
  );
}