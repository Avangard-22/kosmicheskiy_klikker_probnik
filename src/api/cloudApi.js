import { GAME_CONSTANTS } from '../config/constants';

const getAuthData = () => window.Telegram?.WebApp?.initData || '';

export const cloudApi = {
  syncToCloud: async (saveCache) => {
    const initData = getAuthData();
    if (!initData) return false;
    try {
      const response = await fetch(`${GAME_CONSTANTS.CLOUD_API_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${initData}` },
        body: JSON.stringify(saveCache)
      });
      return response.ok;
    } catch (error) { return false; }
  },
  loadFromCloud: async () => {
    const initData = getAuthData();
    if (!initData) return null;
    try {
      const response = await fetch(`${GAME_CONSTANTS.CLOUD_API_URL}/load`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${initData}` }
      });
      if (response.ok) return await response.json();
    } catch (error) {}
    return null;
  }
};