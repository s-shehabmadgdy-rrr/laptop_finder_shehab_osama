import { loadLaptops } from './api.js';
import { renderLaptopCards, setupLayout, showError, showSkeletons } from './ui.js';

setupLayout();
const results = document.querySelector('#laptop-results');
const count = document.querySelector('#result-count');
const message = document.querySelector('#catalogue-message');
const search = document.querySelector('#search');
const category = document.querySelector('#category');
const maxPrice = document.querySelector('#max-price');
const minRam = document.querySelector('#min-ram');
const sort = document.querySelector('#sort');
showSkeletons(results, 8);

async function startCatalogue() {
  try {
    const laptops = await loadLaptops();
    function updateResults() {
      const text = search.value.trim().toLowerCase();
      const priceLimit = maxPrice.value === '' ? Infinity : Number(maxPrice.value);
      const matches = laptops.filter((laptop) =>
        (laptop.name.toLowerCase().includes(text) || laptop.brand.toLowerCase().includes(text)) &&
        (category.value === '' || laptop.category === category.value) &&
        laptop.price <= priceLimit && laptop.ramGB >= Number(minRam.value)
      );
      const [field, direction] = sort.value.split('-');
      const sorted = [...matches].sort((a, b) => direction === 'asc' ? a[field] - b[field] : b[field] - a[field]);
      count.textContent = `${sorted.length} laptop${sorted.length === 1 ? '' : 's'} found`;
      message.textContent = sorted.length ? '' : 'No laptops match your filters. Try a different search or reset the filters.';
      renderLaptopCards(sorted, results, updateResults);
    }
    [search, category, maxPrice, minRam, sort].forEach((control) => {
      control.addEventListener('input', updateResults);
    });
    document.querySelector('#reset-filters').addEventListener('click', () => {
      [search, maxPrice].forEach((control) => control.value = '');
      category.value = '';
      minRam.value = '0';
      sort.value = 'price-asc';
      updateResults();
    });
    updateResults();
  } catch (error) {
    count.textContent = 'Unable to load laptops';
    showError(results, error.message);
  }
}
startCatalogue();
