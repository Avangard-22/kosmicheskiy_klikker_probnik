import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';
import { PLANET_ACH_CONFIGS, ACH_METRICS_TYPES, calculateAchTarget, calculateAchReward } from '../config/achievements';
import { useGameStore } from './useGameStore';
import { haptic } from '../utils/telegram';

export const useAchieveStore = create(persist((set, get) => ({
  progress: {}, 
  notificationsQueue: [],
  updateMetric: (planetId, metricId, value) => {
    const config = PLANET_ACH_CONFIGS[planetId]?.[metricId];
    const typeInfo = ACH_METRICS_TYPES[metricId];
    if (!config || !typeInfo) return;

    set((state) => {
      const planetData = state.progress[planetId] || { metrics: {}, masterUnlocked: false };
      const metricData = planetData.metrics[metricId] || { level: 0, progress: typeInfo.type === 'record_min' ? Infinity : 0 };
      
      let newProgress = metricData.progress;
      if (typeInfo.type === 'cumulative') newProgress += value;
      else if (typeInfo.type === 'record_max') newProgress = Math.max(newProgress, value);
      else if (typeInfo.type === 'record_min' && value > 0) newProgress = Math.min(newProgress, value);

      let currentLevel = metricData.level;
      let newlyUnlocked = [];
      
      while (true) {
        const target = calculateAchTarget(config.base, config.growth, currentLevel, typeInfo.type);
        const isUnlocked = typeInfo.type === 'record_min' ? (newProgress <= target && newProgress > 0) : (newProgress >= target);
        
        if (isUnlocked) {
          const reward = calculateAchReward(config.rewardBase, config.rewardGrowth, currentLevel);
          newlyUnlocked.push({ id: Date.now() + Math.random(), planetId, metricId, name: typeInfo.name, level: currentLevel + 1, reward, emoji: typeInfo.emoji });
          useGameStore.getState().addCoins(reward);
          haptic.success();
          currentLevel++;
        } else break;
      }

      const newState = { progress: { ...state.progress, [planetId]: { ...planetData, metrics: { ...planetData.metrics, [metricId]: { level: currentLevel, progress: newProgress } } } } };
      if (newlyUnlocked.length > 0) newState.notificationsQueue = [...state.notificationsQueue, ...newlyUnlocked];
      return newState;
    });
  },
  removeNotification: (id) => set(s => ({ notificationsQueue: s.notificationsQueue.filter(n => n.id !== id) })),
  checkMasterAchievement: (planetId, currentDamage, targetAU) => {
    set((state) => {
      const planetData = state.progress[planetId] || { metrics: {}, masterUnlocked: false };
      if (planetData.masterUnlocked) return state;

      if (currentDamage >= targetAU * 0.9999) {
        const reward = 50000;
        useGameStore.getState().addCoins(reward);
        haptic.success();
        return {
          progress: { ...state.progress, [planetId]: { ...planetData, masterUnlocked: true } },
          notificationsQueue: [...state.notificationsQueue, { id: Date.now(), isMaster: true, planetId, reward }]
        };
      }
      return state;
    });
  }
}), { name: 'cosmic-achieve', storage: jsonStorage }));