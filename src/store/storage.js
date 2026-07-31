import { createJSONStorage } from 'zustand/middleware';
import { cloudApi } from '../api/cloudApi';

const saveCache = {};

export const forceSaveToStorage = () => {
  const keys = Object.keys(saveCache);
  if (keys.length === 0) return false;
  keys.forEach((key) => localStorage.setItem(key, saveCache[key]));
  
  cloudApi.syncToCloud(saveCache).then(success => {
    if (success) console.log(`☁️ Данные успешно отправлены в Yandex`);
  });
  
  return true;
};

export const jsonStorage = createJSONStorage(() => ({
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => { saveCache[name] = value; },
  removeItem: (name) => { delete saveCache[name]; localStorage.removeItem(name); },
}));