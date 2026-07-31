import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useRandomEvents = () => {
  const [events, setEvents] = useState([]);
  
  const spawnEvent = useCallback(() => {
    const isComet = Math.random() > 0.8; 
    const type = isComet ? 'comet' : 'asteroid';
    const id = Date.now() + Math.random();
    const startLeft = Math.random() > 0.5;
    const startX = startLeft ? -100 : window.innerWidth + 100;
    const endX = startLeft ? window.innerWidth + 100 : -100;
    const startY = Math.random() * (window.innerHeight - 300) + 150;
    const endY = Math.random() * (window.innerHeight - 300) + 150;
    const duration = isComet ? 2000 + Math.random() * 2000 : 6000 + Math.random() * 4000;
    const planetMultiplier = useGameStore.getState().currentPlanetIndex + 1;
    const reward = (isComet ? 500 : 50) * planetMultiplier;

    setEvents(prev => [...prev, { id, type, startX, startY, endX, endY, duration, reward, startLeft }]);
    setTimeout(() => setEvents(prev => prev.filter(e => e.id !== id)), duration);
  }, []);

  useEffect(() => {
    let timeoutId;
    const spawnLoop = () => {
      timeoutId = setTimeout(() => { spawnEvent(); spawnLoop(); }, 10000 + Math.random() * 20000);
    };
    spawnLoop();
    return () => clearTimeout(timeoutId);
  }, [spawnEvent]);

  const handleEventClick = useCallback((id, reward) => {
    useGameStore.getState().addCoins(reward);
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  return { events, handleEventClick };
};