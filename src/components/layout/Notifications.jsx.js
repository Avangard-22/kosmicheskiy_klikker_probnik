import React, { useEffect } from 'react';
import { useAchieveStore } from '../../store/useAchieveStore';
import { Trophy, Crown } from 'lucide-react';

export const Notifications = () => {
  const queue = useAchieveStore((state) => state.notificationsQueue);
  const removeNotification = useAchieveStore((state) => state.removeNotification);

  useEffect(() => {
    if (queue.length > 0) {
      const timer = setTimeout(() => removeNotification(queue[0].id), 4000);
      return () => clearTimeout(timer);
    }
  }, [queue, removeNotification]);

  return (
    <div className="fixed top-20 left-0 right-0 flex flex-col items-center gap-2 z-[9999] pointer-events-none">
      {queue.map((note) => (
        <div key={note.id} className="animate-in slide-in-from-top-10 fade-in duration-500 max-w-sm w-[90%]">
          {note.isMaster ? (
            <div className="bg-gradient-to-br from-yellow-400 to-amber-600 p-1 rounded-2xl shadow-[0_10px_40px_rgba(255,215,0,0.6)]">
              <div className="bg-black/90 px-6 py-4 rounded-xl text-center"><Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2" /><h3 className="text-xl font-black text-yellow-400">ПЛАНЕТА ПОКОРЕНА!</h3><p className="text-yellow-400 font-mono font-bold">+ {note.reward.toLocaleString()} 💎</p></div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-[2px] rounded-2xl shadow-lg">
              <div className="bg-slate-900/95 px-5 py-3 rounded-[14px] flex items-center gap-4"><div className="text-4xl">{note.emoji}</div><div className="flex-1"><div className="text-xs text-indigo-300 font-bold flex items-center gap-1"><Trophy size={12} /> Достижение!</div><div className="font-bold text-white">{note.name} <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">Ур. {note.level}</span></div><div className="text-emerald-400 font-mono font-bold text-sm mt-1">+ {note.reward.toLocaleString()} 💎</div></div></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};