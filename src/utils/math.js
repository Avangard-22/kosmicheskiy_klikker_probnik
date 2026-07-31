export const calculateBlockHp = (globalBaseHp, planetScale, planetIndex, blocksDestroyed = 0) => {
  const planetMultiplier = Math.pow(1.5, planetIndex);
  const progressionMultiplier = 1 + (blocksDestroyed * 0.05);
  const rawHp = globalBaseHp * planetScale * planetMultiplier * progressionMultiplier;
  const jitter = 0.9 + (Math.random() * 0.2); 
  return Math.max(1, Math.floor(rawHp * jitter));
};

export const calculateUpgradeCost = (baseCost, multiplier, currentLevel) => 
  Math.floor(baseCost * Math.pow(multiplier, currentLevel));