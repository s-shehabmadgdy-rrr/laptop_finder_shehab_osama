// Downloads 24 real laptop photos from Pexels to the local assets folder.
// Run with: npm run photos
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const photos = JSON.parse(await readFile('./scripts/photos.json', 'utf8'));
const folder = './assets/laptops';
await mkdir(folder, { recursive: true });

const photoHash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const isJpeg = (bytes) => bytes.length > 10000 && bytes[0] === 255 && bytes[1] === 216;
const usedImages = new Set();
let saved = 0;

for (const photo of photos) {
  const path = join(folder, photo.file);
  const id = photo.pexelsId;
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

  try {
    // Reuse files that were already downloaded successfully.
    let bytes;
    try {
      bytes = await readFile(path);
    } catch {
      bytes = null;
    }

    if (!bytes || !isJpeg(bytes)) {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Photo host returned HTTP ${response.status}`);
      bytes = Buffer.from(await response.arrayBuffer());
      if (!isJpeg(bytes)) throw new Error('The downloaded file is not a valid JPG photo');
      await writeFile(path, bytes);
    }

    const hash = photoHash(bytes);
    if (usedImages.has(hash)) throw new Error('This photo is a duplicate');
    usedImages.add(hash);
    saved++;
    console.log(`OK ${saved}/${photos.length} ${photo.file} - ${photo.name}`);
  } catch (error) {
    console.error(`FAILED ${photo.file}: ${error.message}`);
  }
}

console.log(`\n${saved} of ${photos.length} different photos are saved in ${folder}`);
if (saved !== photos.length) {
  console.error('Some images are missing. Check the internet connection and run npm run photos again.');
  process.exitCode = 1;
}
