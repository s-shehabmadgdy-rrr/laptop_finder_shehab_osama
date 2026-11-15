import { getFavorites, getTheme, isFavorite, setTheme, toggleFavorite } from './storage.js';

export const money = (value) => `$${Number(value).toLocaleString('en-US')}`;
export const laptopCategory = (value) => value === '2-in-1' ? '2-in-1' : value.charAt(0).toUpperCase() + value.slice(1);

export function setupLayout() {
  const menuButton = document.querySelector('#menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  menuButton.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('hidden') === false;
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  const themeButton = document.querySelector('[data-theme-toggle]');
  function showTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeButton.textContent = theme === 'saver' ? '🌙 Performance' : '☀️ Battery Saver';
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'saver' ? 'Performance' : 'Battery Saver'} Mode`);
  }
  // Restore the saved color mode when moving between pages or reloading.
  showTheme(getTheme());
  themeButton.addEventListener('click', () => {
    const next = getTheme() === 'saver' ? 'performance' : 'saver';
    setTheme(next);
    showTheme(next);
  });

  function updateHeaderCount() {
    document.querySelectorAll('[data-favorite-count]').forEach((item) => {
      item.textContent = getFavorites().length;
    });
  }
  updateHeaderCount();
  window.addEventListener('favorites-changed', updateHeaderCount);
}

export function showSkeletons(target, count = 4) {
  target.innerHTML = Array.from({ length: count }, () => `
    <div class="laptop-card animate-pulse" aria-hidden="true">
      <div class="h-44 bg-slate-300/40"></div>
      <div class="p-5 space-y-3"><div class="h-4 w-1/2 bg-slate-300/40 rounded"></div><div class="h-5 w-3/4 bg-slate-300/40 rounded"></div><div class="h-4 w-full bg-slate-300/40 rounded"></div><div class="h-10 bg-slate-300/40 rounded"></div></div>
    </div>`).join('');
}

export function renderLaptopCards(laptops, target, refreshPage) {
  target.innerHTML = laptops.map((laptop) => `
    <article class="laptop-card flex flex-col">
      <a href="details.html?id=${laptop.id}" aria-label="See details for ${laptop.name}"><img class="w-full aspect-[3/2] object-cover" src="${laptop.image}" alt="Photo for ${laptop.name}" loading="lazy"></a>
      <div class="flex flex-1 flex-col p-5">
        <div class="flex items-center justify-between gap-2"><span class="subtle text-xs font-bold uppercase tracking-wider">${laptop.brand} · ${laptopCategory(laptop.category)}</span><span class="font-extrabold">${money(laptop.price)}</span></div>
        <h3 class="mt-3 text-lg font-bold leading-snug"><a class="hover:underline" href="details.html?id=${laptop.id}">${laptop.name}</a></h3>
        <p class="mt-2 text-sm subtle">${laptop.cpu}</p><div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold"><span class="rounded-lg px-2 py-1 bg-slate-500/10">${laptop.ramGB} GB RAM</span><span class="rounded-lg px-2 py-1 bg-slate-500/10">${laptop.batteryHours}h battery</span><span class="rounded-lg px-2 py-1 bg-slate-500/10">${laptop.weightKg} kg</span></div>
        <div class="mt-auto flex gap-2 pt-5"><a href="details.html?id=${laptop.id}" class="btn-action flex-1">Details</a><button type="button" class="btn-quiet flex-1" data-favorite-id="${laptop.id}" aria-pressed="${isFavorite(laptop.id)}">${isFavorite(laptop.id) ? '♥ Saved' : '♡ Save'}</button></div>
      </div>
    </article>`).join('');

  target.querySelectorAll('[data-favorite-id]').forEach((button) => {
    button.addEventListener('click', () => {
      toggleFavorite(button.dataset.favoriteId);
      refreshPage();
    });
  });
}

export function showError(target, message) {
  target.innerHTML = `<div class="panel text-sm" role="alert">${message}</div>`;
}

export function statCard(label, value, note = '') {
  return `<div class="panel"><p class="text-sm subtle">${label}</p><p class="mt-2 text-3xl font-extrabold">${value}</p><p class="mt-2 text-xs subtle">${note}</p></div>`;
}
