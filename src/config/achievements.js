export const ACH_METRICS_TYPES = {
  blocks: { type: 'cumulative', emoji: '🔨', name: 'Уничтожено блоков' },
  crits: { type: 'cumulative', emoji: '⚡', name: 'Критических ударов' },
  combo: { type: 'record_max', emoji: '🔥', name: 'Максимальное комбо' },
  damage: { type: 'cumulative', emoji: '💥', name: 'Нанесено урона' },
  boboDmg: { type: 'cumulative', emoji: '🔧', name: 'Урона нанесено Bobo' },
  speed: { type: 'record_min', emoji: '🏃', name: 'Рекорд скорости' }
};

export const PLANET_ACH_CONFIGS = {
  mercury: {
    blocks: { base: 1, growth: 1.50, rewardBase: 10, rewardGrowth: 1.08 },
    crits: { base: 5, growth: 1.60, rewardBase: 25, rewardGrowth: 1.10 },
    combo: { base: 3, growth: 1.40, rewardBase: 35, rewardGrowth: 1.12 },
    damage: { base: 100, growth: 1.70, rewardBase: 20, rewardGrowth: 1.09 },
    boboDmg: { base: 200, growth: 1.55, rewardBase: 25, rewardGrowth: 1.10 },
    speed: { base: 50000, growth: 0.85, rewardBase: 45, rewardGrowth: 1.12 },
  }
};

export const calculateAchTarget = (base, growth, tier, type) => 
  Math.floor(base * Math.pow(growth, tier));

export const calculateAchReward = (rewardBase, rewardGrowth, tier) => 
  Math.floor(rewardBase * Math.pow(rewardGrowth, tier));