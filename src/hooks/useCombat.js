import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useUpgradesStore } from '../store/useUpgradesStore';
import { useAchieveStore } from '../store/useAchieveStore';
import { GAME_CONSTANTS } from '../config/constants';
import { PLANETS } from '../config/planets';
import { haptic } from '../utils/telegram';

export const useCombat = () => {
  const [floatingTexts, setFloatingTexts] = useState([]);
  const lastHitTime = useRef(0);

  const handleHit = useCallback((x, y, isAuto = false) => {
    const game = useGameStore.getState();
    const stats = useUpgradesStore.getState().getStats();
    const achieve = useAchieveStore.getState();
    const planetId = PLANETS[game.currentPlanetIndex].id;
    const now = Date.now();

    let baseDamage = isAuto ? stats.boboDmg : stats.clickPower;
    if (baseDamage <= 0) return;

    let finalDamage = baseDamage;
    let isCrit = false;
    let currentCombo = game.combo;

    if (!isAuto) {
      currentCombo = (now - lastHitTime.current < GAME_CONSTANTS.COMBO_WINDOW) ? Math.min(currentCombo + 1, GAME_CONSTANTS.MAX_COMBO) : 1;
      lastHitTime.current = now;
      game.setCombo(currentCombo);

      if (Math.random() < stats.critChance) {
        finalDamage *= stats.critMult;
        isCrit = true;
      }
      finalDamage *= (1 + (currentCombo * 0.01));
      
      if (isCrit) haptic.heavy(); else haptic.light();
    }

    finalDamage = Math.max(1, Math.floor(finalDamage));

    achieve.updateMetric(planetId, 'damage', finalDamage);
    if (isCrit) achieve.updateMetric(planetId, 'crits', 1);
    if (!isAuto) achieve.updateMetric(planetId, 'combo', currentCombo);
    if (isAuto) achieve.updateMetric(planetId, 'boboDmg', finalDamage);

    const id = Date.now() + Math.random();
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 40;
    
    setFloatingTexts(prev => [...prev, { id, x, y, isCrit, isAuto, text: `-${finalDamage}`, tx: Math.cos(angle) * distance, ty: Math.sin(angle) * distance - 50 }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 800);

    if (game.blockHp - finalDamage <= 0) {
      haptic.medium();
      achieve.updateMetric(planetId, 'blocks', 1);
      const targetAU = PLANETS[game.currentPlanetIndex].targetAU * GAME_CONSTANTS.AU_TO_DAMAGE;
      achieve.checkMasterAchievement(planetId, game.planetDamageDealt + finalDamage, targetAU);

      const reward = Math.floor((game.maxBlockHp / 10) * (1 + (currentCombo * 0.05)));
      game.dealDamage(game.blockHp);
      game.destroyBlock();
      game.addCoins(reward);

      const rId = Date.now() + Math.random();
      setFloatingTexts(prev => [...prev, { id: rId, x: window.innerWidth/2, y: window.innerHeight/2, text: `+${reward} 💎`, isCrit: true, color: '#4ade80', tx: 0, ty: -100 }]);
      setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== rId)), 1000);
    } else {
      game.dealDamage(finalDamage);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (useGameStore.getState().combo > 0 && Date.now() - lastHitTime.current > GAME_CONSTANTS.COMBO_WINDOW) {
        useGameStore.getState().resetCombo();
      }
    }, GAME_CONSTANTS.COMBO_DECAY_RATE);
    return () => clearInterval(interval);
  }, []);

  return { handleHit, floatingTexts };
};