import { loadLaptops } from './api.js';
import { renderComparison } from './compare.js';
import { getCompareIds, getFavorites, setCompareIds } from './storage.js';
import { money, setupLayout, showError } from './ui.js';

setupLayout();
const choices = document.querySelector('#compare-options');
const table = document.querySelector('#comparison-table');
const message = document.querySelector('#compare-message');

async function startComparison() {
  try {
    const laptops = await loadLaptops();
    function renderPage() {
      const savedIds = getFavorites();
      const savedLaptops = laptops.filter((laptop) => savedIds.includes(laptop.id));
      const selected = getCompareIds().filter((id) => savedIds.includes(id));
      setCompareIds(selected);
      document.querySelector('#selected-count').textContent = `(${selected.length} of 4)`;
      choices.innerHTML = savedLaptops.length ? savedLaptops.map((laptop) => `
        <label class="flex cursor-pointer items-center gap-3 rounded-xl border p-3"><input class="rounded" type="checkbox" data-compare-id="${laptop.id}" ${selected.includes(laptop.id) ? 'checked' : ''}><span class="min-w-0"><span class="block text-sm font-bold">${laptop.name}</span><span class="block text-xs subtle">${money(laptop.price)}</span></span></label>`).join('') : '<p class="subtle">You have no saved laptops yet. <a class="underline font-semibold" href="laptops.html">Browse laptops →</a></p>';
      choices.querySelectorAll('[data-compare-id]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          const id = Number(checkbox.dataset.compareId);
          const current = getCompareIds();
          if (checkbox.checked && current.length >= 4) {
            checkbox.checked = false;
            message.textContent = 'You can compare a maximum of four laptops. Remove one before adding another.';
            return;
          }
          const next = checkbox.checked ? [...current, id] : current.filter((item) => item !== id);
          setCompareIds(next);
          message.textContent = '';
          renderPage();
        });
      });
      renderComparison(laptops.filter((laptop) => selected.includes(laptop.id)), table);
    }
    renderPage();
  } catch (error) {
    showError(table, error.message);
  }
}
startComparison();
