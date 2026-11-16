import { loadLaptops } from './api.js';
import { getCompareIds, isFavorite, setCompareIds, toggleFavorite } from './storage.js';
import { laptopCategory, money, setupLayout, showError } from './ui.js';

setupLayout();
const content = document.querySelector('#details-content');
const message = document.querySelector('#details-message');
// Some local servers redirect .html pages and may drop the query string.
// The hash keeps the selected laptop id even after that redirect.
const queryId = new URLSearchParams(window.location.search).get('id');
const hashId = new URLSearchParams(window.location.hash.slice(1)).get('id');
const laptopId = Number(queryId || hashId);

async function startDetails() {
  if (!Number.isInteger(laptopId) || laptopId < 1) {
    showError(content, 'No laptop selected. Please choose one from the catalogue.');
    return;
  }
  try {
    const laptops = await loadLaptops();
    const laptop = laptops.find((item) => item.id === laptopId);
    if (!laptop) {
      showError(content, 'We could not find that laptop. Please choose another one.');
      return;
    }
    const specs = [
      ['ID', laptop.id], ['Name', laptop.name], ['Brand', laptop.brand],
      ['Category', laptopCategory(laptop.category)], ['Price', money(laptop.price)],
      ['Processor', laptop.cpu], ['RAM', `${laptop.ramGB} GB`],
      ['Storage', `${laptop.storageGB} GB`], ['Battery life', `${laptop.batteryHours} hours`],
      ['Weight', `${laptop.weightKg} kg`], ['Screen', `${laptop.screenInches} inches`],
      ['Image', laptop.image], ['Description', laptop.description]
    ];
    function renderDetails() {
      content.innerHTML = `
        <div class="grid gap-8 lg:grid-cols-2"><div><img class="w-full rounded-2xl border" src="${laptop.image}" alt="Photo for ${laptop.name}"><div class="panel mt-5"><h2 class="text-xl font-bold">About this laptop</h2><p class="mt-3 subtle">${laptop.description}</p></div></div>
        <div><p class="text-sm font-bold uppercase tracking-widest text-blue-600">${laptop.brand} · ${laptopCategory(laptop.category)}</p><h1 class="mt-3 text-3xl sm:text-4xl font-extrabold">${laptop.name}</h1><p class="mt-4 text-3xl font-extrabold">${money(laptop.price)}</p><div class="mt-6 flex flex-wrap gap-3"><button class="btn-action" id="detail-favorite" aria-pressed="${isFavorite(laptop.id)}">${isFavorite(laptop.id) ? '♥ Remove favorite' : '♡ Add to favorites'}</button><button class="btn-quiet" id="detail-compare">Add to comparison</button></div>
        <h2 class="mt-9 text-xl font-bold">Full specifications</h2><div class="mt-4 overflow-x-auto rounded-xl border"><table class="min-w-full text-sm"><tbody>${specs.map(([name, value], i) => `<tr class="border-b"><th scope="row" class="p-3 text-left font-semibold ${i % 2 ? 'bg-slate-500/5' : ''}">${name}</th><td class="p-3 break-words ${i % 2 ? 'bg-slate-500/5' : ''}">${value}</td></tr>`).join('')}</tbody></table></div></div></div>`;
      document.querySelector('#detail-favorite').addEventListener('click', () => {
        toggleFavorite(laptop.id);
        message.textContent = isFavorite(laptop.id) ? 'Added to favorites.' : 'Removed from favorites.';
        renderDetails();
      });
      document.querySelector('#detail-compare').addEventListener('click', () => {
        const selected = getCompareIds();
        if (selected.includes(laptop.id)) {
          message.textContent = 'This laptop is already in your comparison.';
          return;
        }
        if (selected.length >= 4) {
          message.textContent = 'You can compare up to four laptops. Remove one first.';
          return;
        }
        if (!isFavorite(laptop.id)) toggleFavorite(laptop.id);
        setCompareIds([...selected, laptop.id]);
        message.innerHTML = 'Added to comparison. <a class="font-bold underline" href="compare.html">View comparison →</a>';
        renderDetails();
      });
    }
    renderDetails();
  } catch (error) {
    showError(content, error.message);
  }
}
startDetails();
