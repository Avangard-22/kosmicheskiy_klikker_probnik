import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PLANETS } from '../../config/planets';

export const Block = ({ onHit }) => {
  const blockHp = useGameStore((state) => state.blockHp);
  const maxBlockHp = useGameStore((state) => state.maxBlockHp);
  const currentPlanetIndex = useGameStore((state) => state.currentPlanetIndex);
  const planet = PLANETS[currentPlanetIndex];
  
  const hpPercent = maxBlockHp > 0 ? (blockHp / maxBlockHp) : 0;
  let cracks = 0;
  if (hpPercent < 0.2) cracks = 3; else if (hpPercent < 0.5) cracks = 2; else if (hpPercent < 0.8) cracks = 1;

  return (
    <div className="relative group cursor-crosshair transform transition-transform duration-75 active:scale-95 active:rotate-2 touch-none" onPointerDown={(e) => onHit(e.clientX, e.clientY, false)}>
      <div className={`absolute inset-0 bg-gradient-to-br ${planet.colors.block} blur-3xl opacity-40 group-active:opacity-70 transition-opacity`} />
      <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-[2rem] shadow-[inset_0_0_50px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden border border-white/20 bg-gradient-to-br ${planet.colors.block}`}>
        {cracks > 0 && (
          <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50 0 L55 20 L40 40 L60 60 L45 80 L50 100" stroke="#000" strokeWidth="2" fill="none" strokeOpacity={cracks * 0.3} />
            {cracks > 1 && <path d="M0 50 L20 45 L40 60 L60 40 L80 55 L100 50" stroke="#000" strokeWidth="1.5" fill="none" strokeOpacity={cracks * 0.3} />}
            {cracks > 2 && <path d="M20 0 L30 30 L10 50 L40 70 L20 100" stroke="#000" strokeWidth="1" fill="none" strokeOpacity={cracks * 0.3} />}
          </svg>
        )}
        <div className="z-10 font-mono text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] pointer-events-none">{Math.max(0, Math.floor(blockHp)).toLocaleString()}</div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-black/60"><div className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-150 ease-out" style={{ width: `${hpPercent * 100}%` }} /></div>
      </div>
    </div>
  );
};