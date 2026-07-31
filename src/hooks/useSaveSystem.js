import { useEffect, useCallback } from 'react';
import { forceSaveToStorage } from '../store/storage';
import { cloudApi } from '../api/cloudApi';
import { GAME_CONSTANTS } from '../config/constants';
import { useGameStore } from '../store/useGameStore';
import { useUpgradesStore } from '../store/useUpgradesStore';
import { useAchieveStore } from '../store/useAchieveStore';

export const useSaveSystem = () => {
  const manualSave = useCallback(() => forceSaveToStorage(), []);

  useEffect(() => {
    const initCloudData = async () => {
      const cloudData = await cloudApi.loadFromCloud();
      if (cloudData) {
        Object.keys(cloudData).forEach(key => localStorage.setItem(key, cloudData[key]));
        useGameStore.persist.rehydrate();
        useUpgradesStore.persist.rehydrate();
        useAchieveStore.persist.rehydrate();
      }
    };
    initCloudData();

    const intervalId = setInterval(() => forceSaveToStorage(), GAME_CONSTANTS.SAVE_INTERVAL);
    const handleBeforeUnload = () => forceSaveToStorage();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return { manualSave };
};