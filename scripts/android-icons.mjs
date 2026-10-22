// Generates Android launcher icons (legacy square/round + adaptive foreground)
// from the PWA brand assets. Run: npm run android:icons
// Adaptive foreground keeps the glyph inside the 66dp safe zone of the 108dp canvas;
// the adaptive background is the solid colour #0f101a (ic_launcher_background.xml).
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const res = join(root, 'android/app/src/main/res');
const BG = '#0f101a';
const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

const maskable = join(root, 'client/public/icons/maskable-512.png');
const svg = readFileSync(join(root, 'client/public/logo-maskable.svg'), 'utf8');

// Glyph = everything inside the outer <g transform=...> of the maskable logo.
const inner = svg.match(/<g transform="[^"]*">\s*([\s\S]*)<\/g>\s*<\/svg>/)?.[1];
if (!inner) throw new Error('Could not extract glyph from logo-maskable.svg');

// Glyph bbox in the 512 source space is roughly x 116..420, y 70..378 (centre 268,224).
const fgSvg = (px) => `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 108 108">
<g transform="translate(54 54) scale(0.15) translate(-268 -224)">${inner}</g></svg>`;

const circle = (px) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"><circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}"/></svg>`);

for (const [name, scale] of Object.entries(densities)) {
  const dir = join(res, `mipmap-${name}`);
  mkdirSync(dir, { recursive: true });
  const size = Math.round(48 * scale);
  const fg = Math.round(108 * scale);

  const square = await sharp(maskable).resize(size, size).png().toBuffer();
  writeFileSync(join(dir, 'ic_launcher.png'), square);
  await sharp(square).composite([{ input: circle(size), blend: 'dest-in' }]).png()
    .toFile(join(dir, 'ic_launcher_round.png'));
  await sharp(Buffer.from(fgSvg(fg))).png().toFile(join(dir, 'ic_launcher_foreground.png'));
}

writeFileSync(join(res, 'values/ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BG}</color>\n</resources>\n`);

// Drop the Capacitor template's vector foreground; the PNG mipmap foreground replaces it.
const v24 = join(res, 'drawable-v24');
if (existsSync(v24)) rmSync(v24, { recursive: true, force: true });
console.log('Android launcher icons written to', res);
