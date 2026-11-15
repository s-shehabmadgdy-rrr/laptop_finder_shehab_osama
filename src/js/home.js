import { loadLaptops } from './api.js';
import { getFavorites } from './storage.js';
import { money, renderLaptopCards, setupLayout, showError, showSkeletons, statCard } from './ui.js';

setupLayout();
const cards = document.querySelector('#featured-laptops');
const stats = document.querySelector('#home-stats');
showSkeletons(cards, 3);

async function startHome() {
  try {
    const laptops = await loadLaptops();
    function renderHome() {
      const cheapest = laptops.reduce((lowest, laptop) => Math.min(lowest, laptop.price), Infinity);
      stats.innerHTML = [
        statCard('Available laptops', laptops.length, 'Across five categories'),
        statCard('Starting from', money(cheapest), 'Lowest listed price'),
        statCard('Your favorites', getFavorites().length, 'Saved on this browser')
      ].join('');
      renderLaptopCards(laptops.slice(0, 3), cards, renderHome);
    }
    renderHome();
    window.addEventListener('favorites-changed', renderHome);
  } catch (error) {
    stats.innerHTML = '';
    showError(cards, error.message);
  }
}
startHome();
