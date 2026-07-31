import React from 'react';
import { useUpgradesStore } from '../../store/useUpgradesStore';
// import boboImg from '../../assets/images/bobo-drone.webp'; // Расскоментировать, когда добавишь ассет

export const BoboDrone = () => {
  const boboLevel = useUpgradesStore((state) => state.upgrades.boboDmg.level);
  if (boboLevel === 0) return null;

  return (
    <div className="absolute z-20 pointer-events-none" style={{ animation: 'orbit 6s linear infinite', transformOrigin: '200px center', left: 'calc(50% - 200px)', top: '45%' }}>
      {/* <img src={boboImg} alt="Bobo Drone" className="w-16 h-16 object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-pulse" /> */}
      <div className="text-4xl animate-pulse">🤖</div> {/* Удалить, когда будет картинка */}
    </div>
  );
};