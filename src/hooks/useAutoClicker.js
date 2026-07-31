import { useEffect } from 'react';
import { useUpgradesStore } from '../store/useUpgradesStore';
import { GAME_CONSTANTS } from '../config/constants';

export const useAutoClicker = (handleHit) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = useUpgradesStore.getState().getStats();
      if (stats.boboDmg > 0) {
        const x = window.innerWidth / 2 + (Math.random() * 40 - 20);
        const y = window.innerHeight / 2 + (Math.random() * 40 - 20);
        handleHit(x, y, true);
      }
    }, GAME_CONSTANTS.TICK_RATE);
    return () => clearInterval(interval);
  }, [handleHit]);
};