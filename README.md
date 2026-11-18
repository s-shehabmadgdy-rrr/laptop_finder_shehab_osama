# CampusGear - Student Laptop Finder

SW302 Assignment 2 - Individual project - Shehab Osama

A simple five-page website to browse laptops, view specifications, save favorites, and compare laptops.

## First-time setup (Windows)

Open this folder in VS Code and run these commands in its terminal:

```powershell
npm install
npm run photos
npm run check-photos
npm run build
npm start
```

Then open **http://localhost:3000**. The homepage loads automatically.
Alternatively, double-click **SETUP_WINDOWS.cmd** to run all five steps.

**Important:** The actual photos cannot be packaged from this environment, so the ZIP initially contains the photo download script and image references, not the 24 JPEG files. **You must run `npm run photos` once while connected to the internet.** It downloads 24 different real photographs into `assets/laptops/`. `npm run check-photos` will confirm the files exist, are JPGs, and are different. It does not verify the exact laptop model shown.

## Next time you run it

Run only `npm start` (or double-click `RUN_SITE_WINDOWS.cmd`). If you edit the Tailwind styles, use `npm run dev` in another terminal and leave it running.

## Pages

- `index.html` - homepage, current statistics, featured laptops.
- `laptops.html` - live search, category and numeric filters, sorting.
- `details.html?id=1` - one laptop's full specifications.
- `favorites.html` - saved favorites, totals, average price, remove and clear.
- `compare.html` - compare 2 to 4 saved favorites and highlight the best values.

## Photo sources

The 24 real, free stock photos are from Pexels, not AI-generated images. These are **illustrative laptop photos, not verified product photos of the exact models**. Every entry has a different source photo and local file path. See `PHOTO_SOURCES.md` and `scripts/photos.json` for the individual source pages. Photo license: https://www.pexels.com/license/ .

The small laptop logo is an SVG icon stored at `assets/logo-laptop.svg`; product photos are JPG files stored in `assets/laptops/`.

## Test the project

1. Search for a brand, set maximum price, sort by battery life, open Details.
2. Save three laptops from different pages, reload, compare them side by side.
3. Switch Battery Saver / Performance theme, navigate between pages, reload.
4. Test at 375, 768, and 1280px in Chrome or Edge.

## Files and code

- `data/laptops.json` - 24 example laptops with all required fields.
- `src/input.css` - Tailwind 4, forms plugin, components, and themes.
- `src/js` - small JavaScript modules for each part of the website.
- `dist/output.css` - local compiled Tailwind CSS.
- `scripts/download-photos.mjs` - downloads 24 real local photos.
- `scripts/check-photos.mjs` - checks that all photos are present and different.
- `scripts/server.mjs` - simple local server; preserves the laptop ID query string.

Prices are example USD prices, not live offers. Keep `assets/laptops/*.jpg` and `dist/output.css` in the GitHub repository. Do not upload `node_modules`.

GitHub repository link: add your actual URL after creating the repository.
