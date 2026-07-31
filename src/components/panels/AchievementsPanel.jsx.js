import React from 'react';
import { useAchieveStore } from '../../store/useAchieveStore';
import { useGameStore } from '../../store/useGameStore';
import { PLANETS } from '../../config/planets';
import { ACH_METRICS_TYPES, PLANET_ACH_CONFIGS, calculateAchTarget } from '../../config/achievements';
import { Trophy, X } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const AchievementsPanel = ({ isOpen, onClose }) => {
  const currentPlanetIndex = useGameStore((state) => state.currentPlanetIndex);
  const progressState = useAchieveStore((state) => state.progress);
  const planet = PLANETS[currentPlanetIndex];
  const planetProgress = progressState[planet.id] || { metrics: {}, masterUnlocked: false };
  const planetConfig = PLANET_ACH_CONFIGS[planet.id];

  if (!isOpen || !planetConfig) return null;
  const totalUnlocked = Object.values(planetProgress.metrics).reduce((sum, m) => sum + m.level, 0) + (planetProgress.masterUnlocked ? 1 : 0);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl pointer-events-auto">
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5"><div className="flex items-center gap-3"><div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400"><Trophy size={24} /></div><div><h2 className="text-xl font-bold text-white">Достижения</h2><div className="text-xs text-indigo-300">{planet.emoji} {planet.name} • {totalUnlocked} открыто</div></div></div><button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400"><X size={24} /></button></div>
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
        {Object.keys(planetConfig).map((metricId) => {
          const typeInfo = ACH_METRICS_TYPES[metricId];
          const config = planetConfig[metricId];
          const mState = planetProgress.metrics[metricId] || { level: 0, progress: 0 };
          const target = calculateAchTarget(config.base, config.growth, mState.level, typeInfo.type);
          const percent = typeInfo.type === 'record_min' ? (target / (mState.progress || 1)) * 100 : (mState.progress / target) * 100;

          return (
            <div key={metricId} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col"><div className="flex justify-between items-start mb-2"><div className="text-3xl">{typeInfo.emoji}</div><div className="bg-black/50 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded">УР. {mState.level}</div></div><div className="text-xs font-bold text-slate-300 mb-1">{typeInfo.name}</div><div className="mt-auto pt-2"><div className="text-[10px] text-slate-500 flex justify-between font-mono mb-1"><span>{formatNumber(mState.progress)}</span><span>{formatNumber(target)}</span></div><div className="w-full h-1 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} /></div></div></div>
          );
        })}
      </div>
    </div>
  );
};