// Verifies that all 24 real photos were saved and are different files.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const photos = JSON.parse(await readFile('./scripts/photos.json', 'utf8'));
const used = new Set();
let good = 0;
for (const photo of photos) {
  try {
    const bytes = await readFile(join('assets/laptops', photo.file));
    if (bytes.length < 10000 || bytes[0] !== 255 || bytes[1] !== 216) {
      throw new Error('Invalid JPG');
    }
    const fingerprint = createHash('sha256').update(bytes).digest('hex');
    if (used.has(fingerprint)) throw new Error('Duplicate image');
    used.add(fingerprint);
    good++;
  } catch (error) {
    console.error(`${photo.file}: ${error.message}`);
  }
}
console.log(`${good}/${photos.length} different JPG photos checked.`);
if (good !== photos.length) process.exitCode = 1;
