import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PLANETS } from '../../config/planets';

export const Background = () => {
  const canvasRef = useRef(null);
  const currentPlanetIndex = useGameStore((state) => state.currentPlanetIndex);
  const planet = PLANETS[currentPlanetIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationId;
    const layer1Distant = [], layer2Particles = [], layer3Foreground = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 100; i++) layer1Distant.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 1.2, speed: Math.random() * 0.2 + 0.05, alpha: Math.random() * 0.5 + 0.1 });
    for (let i = 0; i < 50; i++) layer2Particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 2 + 0.5, speed: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.6 + 0.4, twinkle: Math.random() * Math.PI * 2 });
    for (let i = 0; i < 15; i++) layer3Foreground.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, length: Math.random() * 30 + 10, speed: Math.random() * 5 + 4, alpha: Math.random() * 0.3 + 0.1 });

    const render = () => {
      const grd = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, 0, canvas.height);
      grd.addColorStop(0, '#1a0b2e'); grd.addColorStop(1, '#020005'); 
      ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      layer1Distant.forEach(p => { p.y += p.speed; if (p.y > canvas.height) p.y = 0; ctx.globalAlpha = p.alpha; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); });
      layer2Particles.forEach(p => { p.y += p.speed; if (p.y > canvas.height) { p.y = 0; p.x = Math.random() * canvas.width; } p.twinkle += 0.03; ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.abs(Math.sin(p.twinkle))); ctx.fillStyle = Math.random() > 0.98 ? '#67e8f9' : '#ffffff'; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); });
      ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round';
      layer3Foreground.forEach(p => { p.y += p.speed; if (p.y > canvas.height) { p.y = -p.length; p.x = Math.random() * canvas.width; } ctx.globalAlpha = p.alpha; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - p.length); ctx.stroke(); });

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationId); };
  }, [planet]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};