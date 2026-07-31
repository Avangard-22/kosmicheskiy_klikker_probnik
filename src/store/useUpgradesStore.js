import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';

export const useUpgradesStore = create(persist((set, get) => ({
  upgrades: {
    clickPower: { level: 0, baseCost: 10, mult: 1.5, name: 'Синхрофазотрон' },
    critChance: { level: 0, baseCost: 50, mult: 1.3, name: 'Оптика прицела' },
    critMult:   { level: 0, baseCost: 100, mult: 1.4, name: 'Квантовый резонатор' },
    boboDmg:    { level: 0, baseCost: 200, mult: 1.6, name: 'Дроны Bobo' },
  },
  getStats: () => {
    const { upgrades } = get();
    return {
      clickPower: 1 + (upgrades.clickPower.level * 2),
      critChance: Math.min(1.0, 0.05 + (upgrades.critChance.level * 0.01)),
      critMult: 2.0 + (upgrades.critMult.level * 0.2),
      boboDmg: upgrades.boboDmg.level * 5,
    };
  },
  levelUp: (key) => set(s => ({ upgrades: { ...s.upgrades, [key]: { ...s.upgrades[key], level: s.upgrades[key].level + 1 } } }))
}), { name: 'cosmic-upgrades', storage: jsonStorage }));