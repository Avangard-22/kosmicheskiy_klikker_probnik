import React from 'react';

export const FloatingDamage = ({ floatingTexts }) => (
  <>
    {floatingTexts.map(ft => (
      <div key={ft.id} className={`absolute pointer-events-none font-black font-mono select-none flex items-center justify-center ${ft.isCrit ? 'text-4xl italic z-50' : 'text-2xl z-40'}`} style={{ left: ft.x, top: ft.y, color: ft.color || (ft.isCrit ? '#FFD700' : '#ffffff'), textShadow: '0 2px 10px rgba(0,0,0,0.8)', transform: `translate(calc(-50% + ${ft.tx}px), calc(-50% + ${ft.ty}px)) scale(${ft.isCrit ? 1.2 : 1})`, animation: 'fadeUp 0.8s ease-out forwards' }}>
        {ft.text}
      </div>
    ))}
  </>
);