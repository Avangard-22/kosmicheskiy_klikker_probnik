import { GAME_CONSTANTS } from '../config/constants';

export const formatNumber = (num, useAU = false) => {
  if (num === undefined || num === null) return '0';
  if (useAU || num >= GAME_CONSTANTS.AU_TO_DAMAGE) {
    const au = num / GAME_CONSTANTS.AU_TO_DAMAGE;
    if (au >= 1000000000) return (au / 1000000000).toFixed(2) + 'B а.е.';
    if (au >= 1000000) return (au / 1000000).toFixed(2) + 'M а.е.';
    if (au >= 1000) return (au / 1000).toFixed(2) + 'K а.е.';
    return au.toFixed(4) + ' а.е.';
  }
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return Math.floor(num).toLocaleString();
};