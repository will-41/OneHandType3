import sharp from 'sharp';
import { readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'client', 'public');
const out = join(root, 'icons');
if (existsSync(out)) rmSync(out, { recursive: true });
mkdirSync(out, { recursive: true });

const logo = readFileSync(join(root, 'logo.svg'));
const maskable = readFileSync(join(root, 'logo-maskable.svg'));
const favicon = readFileSync(join(root, 'favicon.svg'));
const BG = { r: 22, g: 18, b: 13, alpha: 1 };

const render = (svg, size, file, flatten) => {
  let p = sharp(svg, { density: Math.max(72, (size / 512) * 72 * 4) }).resize(size, size);
  if (flatten) p = p.flatten({ background: BG });
  return p.png().toFile(join(out, file));
};

const jobs = [];
for (const s of [48, 72, 96, 128, 144, 152, 192, 256, 384, 512]) jobs.push(render(logo, s, `icon-${s}.png`));
for (const s of [192, 512]) jobs.push(render(maskable, s, `maskable-${s}.png`, true));
// iOS and Play apply their own corner mask with no keyline: use the logo square, opaque.
const square = Buffer.from(logo.toString().replace(' rx="112"', ''));
jobs.push(render(square, 180, 'apple-touch-icon-180.png', true));
jobs.push(render(favicon, 32, 'favicon-32.png'));
jobs.push(render(square, 512, 'play-store-512.png', true));
await Promise.all(jobs);
console.log('icons generated in', out);
