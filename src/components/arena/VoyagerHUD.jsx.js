import React from 'react';
import { useVoyager } from '../../hooks/useVoyager';
import { Wifi, Activity } from 'lucide-react';

export const VoyagerHUD = () => {
  const telemetry = useVoyager();
  return (
    <div className="absolute top-4 left-4 z-20 pointer-events-none select-none hidden md:flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1"><Activity size={12} className="text-cyan-500" /> Deep Space Network</div>
      <div className="bg-slate-950/60 backdrop-blur-md border border-cyan-500/20 rounded-lg p-2.5 w-52"><div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-cyan-400">VOYAGER 1</span><Wifi size={12} className="text-cyan-400 animate-pulse" /></div><div className="font-mono text-slate-300 text-[11px] flex flex-col"><span>{telemetry.v1.km.toLocaleString()} KM</span><span className="text-cyan-200/70">{telemetry.v1.au} AU</span></div></div>
      <div className="bg-slate-950/60 backdrop-blur-md border border-indigo-500/20 rounded-lg p-2.5 w-52"><div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-indigo-400">VOYAGER 2</span><Wifi size={12} className="text-indigo-400 animate-pulse" /></div><div className="font-mono text-slate-300 text-[11px] flex flex-col"><span>{telemetry.v2.km.toLocaleString()} KM</span><span className="text-indigo-200/70">{telemetry.v2.au} AU</span></div></div>
    </div>
  );
};