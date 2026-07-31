import React from 'react';
import { Rocket, Star, Save, Trophy } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useSaveSystem } from '../../hooks/useSaveSystem';
import { PLANETS } from '../../config/planets';
import { GAME_CONSTANTS } from '../../config/constants';
import { formatNumber } from '../../utils/formatters';

export const Header = ({ onOpenAch }) => {
  const { coins, currentPlanetIndex, planetDamageDealt, combo } = useGameStore();
  const { manualSave } = useSaveSystem();
  const currentPlanet = PLANETS[currentPlanetIndex];
  const targetDamage = currentPlanet.targetAU * GAME_CONSTANTS.AU_TO_DAMAGE;
  const progressPercent = Math.min(100, (planetDamageDealt / targetDamage) * 100);

  return (
    <header className="flex flex-col gap-2 p-4 md:p-6 pointer-events-auto z-20">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors" onClick={onOpenAch}>
            <div className="text-3xl">{currentPlanet.emoji}</div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white uppercase">{currentPlanet.name}</h1>
              <div className="text-xs text-white/50 flex items-center gap-1">
                <Rocket size={12} /> {formatNumber(planetDamageDealt, true)} / {formatNumber(targetDamage, true)}
              </div>
            </div>
            <Trophy size={16} className="text-indigo-400 ml-2 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-gradient-to-r from-emerald-900/60 to-teal-900/60 backdrop-blur-md border border-emerald-500/30 px-5 py-2.5 rounded-2xl flex items-center gap-2">
            <Star className="text-emerald-400 fill-emerald-400" size={18} />
            <span className="font-mono text-xl font-bold text-emerald-50">{coins.toLocaleString()}</span>
          </div>
          <div className={`transition-all duration-300 origin-right ${combo > 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="bg-orange-900/60 border border-orange-500/50 px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="text-orange-400 text-xs font-bold">COMBO</span>
              <span className="text-white font-mono font-black italic">x{combo}</span>
            </div>
          </div>
          <button onClick={manualSave} className="mt-1 bg-white/10 hover:bg-white/20 p-2 rounded-full border border-white/10 text-slate-300"><Save size={16} /></button>
        </div>
      </div>
      <div className="w-full h-1.5 bg-black/50 rounded-full mt-2 overflow-hidden border border-white/5">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>
    </header>
  );
};