import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';
import { calculateBlockHp } from '../utils/math';
import { PLANETS } from '../config/planets';

export const useGameStore = create(persist((set, get) => ({
  coins: 0,
  totalCoinsEarned: 0,
  currentPlanetIndex: 0,
  planetDamageDealt: 0,
  blocksDestroyedCurrentPlanet: 0,
  blockHp: calculateBlockHp(500, PLANETS[0].scale, 0, 0),
  maxBlockHp: calculateBlockHp(500, PLANETS[0].scale, 0, 0),
  combo: 0,
  maxCombo: 0,

  addCoins: (amount) => set(s => ({ coins: s.coins + amount, totalCoinsEarned: s.totalCoinsEarned + amount })),
  spendCoins: (amount) => set(s => ({ coins: Math.max(0, s.coins - amount) })),
  dealDamage: (amount) => set(s => ({ blockHp: Math.max(0, s.blockHp - amount), planetDamageDealt: s.planetDamageDealt + amount })),
  destroyBlock: () => set(s => {
    const nextBlocks = s.blocksDestroyedCurrentPlanet + 1;
    const newHp = calculateBlockHp(500, PLANETS[s.currentPlanetIndex].scale, s.currentPlanetIndex, nextBlocks);
    return { blockHp: newHp, maxBlockHp: newHp, blocksDestroyedCurrentPlanet: nextBlocks };
  }),
  nextPlanet: () => set(s => {
    if (s.currentPlanetIndex >= PLANETS.length - 1) return s;
    const nextIdx = s.currentPlanetIndex + 1;
    const newHp = calculateBlockHp(500, PLANETS[nextIdx].scale, nextIdx, 0);
    return { currentPlanetIndex: nextIdx, planetDamageDealt: 0, blocksDestroyedCurrentPlanet: 0, blockHp: newHp, maxBlockHp: newHp };
  }),
  setCombo: (c) => set(s => ({ combo: c, maxCombo: Math.max(s.maxCombo, c) })),
  resetCombo: () => set({ combo: 0 }),
}), {
  name: 'cosmic-save',
  storage: jsonStorage,
  partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['combo'].includes(key))),
}));