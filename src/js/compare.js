import { laptopCategory, money } from './ui.js';

const rows = [
  ['Price', 'price', 'min', money],
  ['RAM', 'ramGB', 'max', (value) => `${value} GB`],
  ['Storage', 'storageGB', 'max', (value) => `${value} GB`],
  ['Battery life', 'batteryHours', 'max', (value) => `${value} hours`],
  ['Weight', 'weightKg', 'min', (value) => `${value} kg`],
  ['Screen', 'screenInches', null, (value) => `${value} inches`],
  ['CPU', 'cpu', null, (value) => value],
  ['Brand', 'brand', null, (value) => value],
  ['Category', 'category', null, laptopCategory]
];

export function renderComparison(laptops, target) {
  if (laptops.length < 2) {
    target.innerHTML = '<div class="panel subtle">Select at least two favorite laptops to see a comparison.</div>';
    return;
  }

  const headers = laptops.map((laptop) => `
    <th scope="col" class="comparison-product">
      <a href="details.html?id=${laptop.id}" class="comparison-product-link">
        <img src="${laptop.image}" alt="${laptop.name}" class="comparison-photo" loading="lazy">
        <span class="comparison-name">${laptop.name}</span>
        <span class="comparison-brand">${laptop.brand}</span>
      </a>
    </th>
  `).join('');

  const tableRows = rows.map(([label, field, better, format]) => {
    // Only numeric specifications have a best value. Matching values are highlighted together.
    const values = laptops.map((laptop) => laptop[field]);
    const best = better === 'min' ? Math.min(...values) : better === 'max' ? Math.max(...values) : null;

    const cells = laptops.map((laptop) => {
      const isBest = best !== null && laptop[field] === best;
      return `<td class="comparison-value ${isBest ? 'highlight-best' : ''}">
        <span>${format(laptop[field])}</span>${isBest ? '<span class="comparison-best">Best</span>' : ''}
      </td>`;
    }).join('');

    return `<tr><th scope="row" class="comparison-label">${label}</th>${cells}</tr>`;
  }).join('');

  target.innerHTML = `
    <div class="comparison-scroll" role="region" aria-label="Laptop comparison table" tabindex="0">
      <table class="comparison-table ${laptops.length > 2 ? 'comparison-table-wide' : ''}">
        <thead><tr><th scope="col" class="comparison-corner">Specification</th>${headers}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
    <p class="mt-2 text-xs subtle sm:hidden">Swipe left or right to see all laptops.</p>
  `;
}
