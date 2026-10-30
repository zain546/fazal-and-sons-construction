import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'design', 'hero-options', 'hero.jpeg');
const outputHero = path.join(root, 'dist', 'assets', 'hero.webp');
const outputHero960 = path.join(root, 'dist', 'assets', 'hero-960.webp');
const outputSocial = path.join(root, 'dist', 'assets', 'social.jpg');

// Preserve the full photograph; CSS handles responsive hero cropping.
await sharp(input)
  .rotate()
  .resize({ width: 1672, withoutEnlargement: true })
  .webp({ quality: 85, effort: 6 })
  .toFile(outputHero);
console.log('Generated:', outputHero);

// Generate 960px webp
await sharp(input)
  .rotate()
  .resize({ width: 960, withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(outputHero960);
console.log('Generated:', outputHero960);

// Generate 1200x630 social share image
await sharp(input)
  .resize(1200, 630, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 86, progressive: true })
  .toFile(outputSocial);
console.log('Generated:', outputSocial);
