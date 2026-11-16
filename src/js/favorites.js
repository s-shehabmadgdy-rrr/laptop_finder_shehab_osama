import { loadLaptops } from './api.js';
import { clearFavorites, getFavorites } from './storage.js';
import { money, renderLaptopCards, setupLayout, showError, showSkeletons, statCard } from './ui.js';

setupLayout();
const cards = document.querySelector('#favorite-results');
const stats = document.querySelector('#favorite-stats');
const message = document.querySelector('#favorites-message');
showSkeletons(cards, 3);

async function startFavorites() {
  try {
    const laptops = await loadLaptops();
    function updateFavorites() {
      const selected = laptops.filter((laptop) => getFavorites().includes(laptop.id));
      const total = selected.reduce((sum, laptop) => sum + laptop.price, 0);
      const average = selected.length ? total / selected.length : 0;
      stats.innerHTML = [
        statCard('Saved laptops', selected.length),
        statCard('Total price', money(total)),
        statCard('Average price', money(Math.round(average)))
      ].join('');
      renderLaptopCards(selected, cards, updateFavorites);
      message.textContent = selected.length ? '' : 'No favorites yet. Visit the catalogue and save a few laptops.';
      document.querySelector('#clear-favorites').disabled = selected.length === 0;
    }
    document.querySelector('#clear-favorites').addEventListener('click', () => {
      if (getFavorites().length && window.confirm('Remove all saved laptops?')) clearFavorites();
      updateFavorites();
    });
    updateFavorites();
  } catch (error) {
    showError(cards, error.message);
  }
}
startFavorites();
