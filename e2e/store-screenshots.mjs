// Google Play store screenshots + feature graphic.
// Run (with `vite preview` serving the build): node e2e/store-screenshots.mjs http://localhost:4173
// Output: docs/store/screenshots/phone-*.png (1080x2340), tablet7-*.png (1200x1920),
//         docs/store/feature-graphic.png (1024x500), docs/store/icon-512.png
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = (process.argv[2] || 'http://localhost:4173').replace(/\/$/, '');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs/store/screenshots');
mkdirSync(outDir, { recursive: true });

const fail = (m) => { console.error('STORE-SHOTS FAIL:', m); process.exit(1); };

// ---- Seeded profile (shape = partialize() in useTypingStore.tsx) ----
const now = Date.now();
const day = 86400000;
const doneIds = ['basics-1', 'basics-2', 'basics-3', 'basics-4', 'lesson-1-1', 'lesson-1-2', 'lesson-1-3', 'lesson-2-1', 'lesson-2-2'];
const lessonProgress = Object.fromEntries(doneIds.map((id, i) => [id, {
  bestWpm: 28 + i * 1.6, bestAccuracy: 93 + (i % 4), bestTimeMs: 42000 - i * 1500, fewestErrors: 3 - (i % 3),
  completions: 1 + (i % 3), lastWpm: 27 + i * 1.5, lastAccuracy: 92 + (i % 4), lastErrors: 2, lastTimeMs: 43000 - i * 1500,
  lastCompletedAt: now - (doneIds.length - i) * day,
}]));
const lessons = Object.fromEntries(doneIds.map((id, i) => [id, {
  attempts: 2 + (i % 3), completedCount: 1 + (i % 3), bestWpm: 28 + i * 1.6, bestAccuracy: 93 + (i % 4), totalTime: 1.5 + i * 0.2,
}]));
const seed = {
  state: {
    handPreference: 'right',
    themeMode: 'dark',
    keyboardLayout: 'qwerty',
    stats: {
      totalCharactersTyped: 6840, totalErrors: 273, totalTimeTyped: 96, bestWpm: 42, bestAccuracy: 96,
      lessons, commonErrors: { g: 21, b: 17, t: 14, v: 11, r: 9 },
      layoutSpecificStats: { qwerty: { totalCharacters: 6840, bestWpmForLayout: 42, bestAccuracyForLayout: 96, hoursOfPractice: 1.6, adaptationProgress: 38 } },
    },
    completedLessons: doneIds,
    lessonProgress,
    xp: 1480,
    level: 5,
    unlockedAchievements: [],
    customLessons: [],
    customLayouts: [],
  },
  version: 1,
};

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

async function newPage(viewport, scale) {
  const ctx = await browser.newContext({
    viewport, deviceScaleFactor: scale, serviceWorkers: 'block', isMobile: true, hasTouch: true, colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.warn('pageerror:', String(e)));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate((s) => localStorage.setItem('onehandtype-store', JSON.stringify(s)), seed);
  await page.goto(base, { waitUntil: 'networkidle' });
  return { ctx, page };
}

const snap = async (page, name, w, h, scale) => {
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(outDir, name) });
  const m = await sharp(join(outDir, name)).metadata();
  if (m.width !== w * scale || m.height !== h * scale) fail(`${name} is ${m.width}x${m.height}`);
  console.log('  ok', name, `${m.width}x${m.height}`);
};
const go = async (page, path) => { await page.goto(`${base}${path}`, { waitUntil: 'networkidle' }); };

// ---- Phone: 360x780 @3x = 1080x2340 ----
{
  const [W, H, S] = [360, 780, 3];
  const { ctx, page } = await newPage({ width: W, height: H }, S);

  // Create a custom layout through the UI so the Builder screenshot shows a real saved layout.
  await go(page, '/settings');
  await page.getByRole('button', { name: 'Create custom layout' }).click();
  await page.waitForURL('**/settings/keyboard-builder');
  await page.getByRole('radio', { name: /QWERTY/ }).first().click();
  await page.getByRole('radio', { name: 'Right hand' }).click();
  await page.getByRole('button', { name: 'Start designing' }).click();
  await page.getByRole('button', { name: 'g', exact: true }).click();
  await page.getByRole('button', { name: 'h', exact: true }).click();
  await page.getByLabel('Layout name').fill('My Right-Hand Layout');
  await page.getByRole('button', { name: 'Save layout' }).click();
  await page.getByRole('button', { name: 'Not now' }).click();
  await page.waitForTimeout(400);
  const layoutId = await page.evaluate(() => JSON.parse(localStorage.getItem('onehandtype-store')).state.customLayouts[0]?.id);
  if (!layoutId) fail('custom layout was not saved');
  await go(page, `/settings/keyboard-builder/${layoutId}`);
  await page.getByRole('button', { name: 'k', exact: true }).first().click().catch(() => {});

  // Order of captures; builder first while still in editor state.
  await snap(page, 'phone-5-builder.png', W, H, S);

  await go(page, '/');
  await snap(page, 'phone-1-home.png', W, H, S);
  await go(page, '/curriculum');
  await snap(page, 'phone-2-learn.png', W, H, S);

  // Practice mid-lesson: type the first characters of basics-1 ("f f f ...")
  await go(page, '/lesson/basics-1');
  await page.locator('[data-testid="onscreen-keyboard"]').waitFor({ timeout: 8000 });
  await page.keyboard.type('f f f f f f f f', { delay: 260 }); // ~46 WPM pace for a realistic live readout
  await snap(page, 'phone-3-practice.png', W, H, S);

  // Finish the lesson for the Results sheet (same human pace)
  await page.keyboard.type(' f f f f f f f f f f f f', { delay: 260 });
  await page.getByRole('heading', { name: 'Lesson complete' }).waitFor({ timeout: 8000 })
    .catch(() => fail('results sheet did not appear'));
  await snap(page, 'phone-4-results.png', W, H, S);

  await go(page, '/stats');
  await snap(page, 'phone-6-stats.png', W, H, S);
  await go(page, '/settings');
  await snap(page, 'phone-7-settings.png', W, H, S);
  await ctx.close();
}

// ---- 7-inch tablet: 600x960 @2x = 1200x1920 ----
{
  const [W, H, S] = [600, 960, 2];
  const { ctx, page } = await newPage({ width: W, height: H }, S);
  await go(page, '/');
  await snap(page, 'tablet7-1-home.png', W, H, S);
  await go(page, '/lesson/basics-1');
  await page.locator('[data-testid="onscreen-keyboard"]').waitFor({ timeout: 8000 });
  await page.keyboard.type('f f f f f f f f', { delay: 30 });
  await snap(page, 'tablet7-2-practice.png', W, H, S);
  await ctx.close();
}
await browser.close();

// ---- Feature graphic 1024x500 ----
const iconB64 = readFileSync(join(root, 'client/public/icons/play-store-512.png')).toString('base64');
const font = 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1024" height="500" viewBox="0 0 1024 500">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1024" y2="500" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4338ca"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient>
<clipPath id="r"><rect x="70" y="100" width="300" height="300" rx="66"/></clipPath>
</defs>
<rect width="1024" height="500" fill="url(#g)"/>
<circle cx="930" cy="60" r="220" fill="#ffffff" opacity="0.06"/>
<circle cx="980" cy="470" r="160" fill="#ffffff" opacity="0.06"/>
<rect x="76" y="116" width="300" height="300" rx="66" fill="#1e1b4b" opacity="0.35"/>
<image x="70" y="100" width="300" height="300" xlink:href="data:image/png;base64,${iconB64}" clip-path="url(#r)"/>
<text x="430" y="238" font-family='${font}' font-size="64" font-weight="700" fill="#ffffff">Type fast</text>
<text x="430" y="310" font-family='${font}' font-size="64" font-weight="700" fill="#ffffff">with one hand</text>
<text x="432" y="370" font-family='${font}' font-size="30" fill="#e0e7ff">Free  •  Offline  •  Private</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(join(root, 'docs/store/feature-graphic.png'));
const fg = await sharp(join(root, 'docs/store/feature-graphic.png')).metadata();
if (fg.width !== 1024 || fg.height !== 500) fail(`feature graphic ${fg.width}x${fg.height}`);
console.log('  ok feature-graphic.png 1024x500');

copyFileSync(join(root, 'client/public/icons/play-store-512.png'), join(root, 'docs/store/icon-512.png'));
console.log('  ok icon-512.png');
console.log('STORE-SHOTS DONE');
