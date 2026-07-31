import React from 'react';
import { Zap, Target, Pickaxe, Star, Rocket } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useUpgradesStore } from '../../store/useUpgradesStore';
import { calculateUpgradeCost } from '../../utils/math';

// Закомментируй следующую строку, если у тебя нет локальной картинки Бобо:
// import boboImg from '../../assets/images/bobo-drone.webp'; 

const ICON_MAP = { clickPower: Pickaxe, critChance: Target, critMult: Zap, boboDmg: Rocket };
// const IMAGE_MAP = { boboDmg: boboImg }; // И расскоментируй эту

export const Footer = () => {
  const coins = useGameStore((state) => state.coins);
  const spendCoins = useGameStore((state) => state.spendCoins);
  const upgrades = useUpgradesStore((state) => state.upgrades);
  const levelUp = useUpgradesStore((state) => state.levelUp);

  const handleBuy = (key, cost) => {
    if (coins >= cost) { spendCoins(cost); levelUp(key); }
  };

  return (
    <footer className="bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 p-4 md:p-6 pb-safe pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <h3 className="text-slate-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2"><Rocket size={14} /> Модули корабля</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(upgrades).map(([key, upg]) => {
            const cost = calculateUpgradeCost(upg.baseCost, upg.mult, upg.level);
            const canAfford = coins >= cost;
            const Icon = ICON_MAP[key];
            const imgSrc = null; // Замени null на IMAGE_MAP[key], когда добавишь картинку
            
            return (
              <button key={key} onClick={() => handleBuy(key, cost)} disabled={!canAfford} className={`relative overflow-hidden flex items-center p-3 rounded-2xl border transition-all duration-200 text-left ${canAfford ? 'bg-white/5 border-white/20 hover:bg-white/10 active:scale-95 cursor-pointer' : 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'}`}>
                <div className={`w-12 h-12 rounded-xl mr-3 flex-shrink-0 flex items-center justify-center overflow-hidden ${canAfford ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                  {imgSrc ? <img src={imgSrc} alt="" className="w-full h-full object-contain" /> : <Icon size={24} className={canAfford ? 'text-indigo-400' : 'text-white/30'} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-100 flex justify-between items-center text-sm truncate"><span className="truncate pr-2">{upg.name}</span><span className="text-[10px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded flex-shrink-0">Ур. {upg.level}</span></div>
                  <div className={`font-mono font-bold text-xs mt-1 flex items-center gap-1 ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}><Star size={10} /> {cost.toLocaleString()}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
};