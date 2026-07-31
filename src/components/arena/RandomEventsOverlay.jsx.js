import React from 'react';
import { useRandomEvents } from '../../hooks/useRandomEvents';

export const RandomEventsOverlay = () => {
  const { events, handleEventClick } = useRandomEvents();
  if (events.length === 0) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {events.map((ev) => {
        const deltaX = ev.endX - ev.startX;
        const deltaY = ev.endY - ev.startY;
        const angle = ev.type === 'comet' ? Math.atan2(deltaY, deltaX) * (180 / Math.PI) + (ev.startLeft ? 0 : 180) : 0;
        return (
          <div key={ev.id} onClick={() => handleEventClick(ev.id, ev.reward)} className="absolute pointer-events-auto cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-90 transition-transform" style={{ left: ev.startX, top: ev.startY, '--tx': `${deltaX}px`, '--ty': `${deltaY}px`, '--rot': ev.type === 'asteroid' ? '360deg' : `${angle}deg`, animation: `flyAcross ${ev.duration}ms linear forwards` }}>
            {ev.type === 'comet' ? <div className="relative text-4xl">☄️<div className={`absolute top-1/2 -translate-y-1/2 w-16 h-2 bg-gradient-to-r from-transparent to-cyan-400 blur-sm rounded-full ${ev.startLeft ? '-left-12' : '-right-12'}`} /></div> : <div className="text-4xl filter grayscale contrast-125">🪨</div>}
          </div>
        );
      })}
    </div>
  );
};