const FAVORITES_KEY = 'campus-favorites';
const COMPARE_KEY = 'campus-compare';
const THEME_KEY = 'campus-theme';

function readList(key) {
  try {
    const list = JSON.parse(localStorage.getItem(key));
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

export const getFavorites = () => readList(FAVORITES_KEY);
export const isFavorite = (id) => getFavorites().includes(Number(id));
export const getCompareIds = () => readList(COMPARE_KEY);

export function toggleFavorite(id) {
  const laptopId = Number(id);
  const favorites = getFavorites();
  const updated = favorites.includes(laptopId)
    ? favorites.filter((savedId) => savedId !== laptopId)
    : [...favorites, laptopId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  if (!updated.includes(laptopId)) {
    setCompareIds(getCompareIds().filter((savedId) => savedId !== laptopId));
  }
  window.dispatchEvent(new Event('favorites-changed'));
  return updated.includes(laptopId);
}

export function clearFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
  setCompareIds([]);
  window.dispatchEvent(new Event('favorites-changed'));
}

export function setCompareIds(ids) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
}

export function getTheme() {
  try {
    return JSON.parse(localStorage.getItem(THEME_KEY)) === 'performance' ? 'performance' : 'saver';
  } catch (error) {
    return 'saver';
  }
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
}
