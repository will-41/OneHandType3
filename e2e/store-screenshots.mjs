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

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' });

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
// ---- Feature graphic 1024x500 ----
// Rendered in the browser so it uses the app's own bundled fonts.
const fontB64 = (pkg, file) => readFileSync(join(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64');
const logoSvg = readFileSync(join(root, 'client/public/logo.svg'), 'utf8');
const fgPage = await browser.newPage({ viewport: { width: 1024, height: 500 }, deviceScaleFactor: 1 });
await fgPage.setContent(`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Literata;font-weight:500;src:url(data:font/woff2;base64,${fontB64('literata', 'literata-latin-500-normal.woff2')})}
@font-face{font-family:Atkinson;font-weight:400;src:url(data:font/woff2;base64,${fontB64('atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-400-normal.woff2')})}
html,body{margin:0;width:1024px;height:500px;background:#16120d;color:#eee6d7;overflow:hidden}
.mark{position:absolute;left:76px;top:120px;width:260px;height:260px}
.axis{position:absolute;left:396px;top:64px;bottom:64px;width:2px;background:#efaf61}
.copy{position:absolute;left:444px;top:50%;transform:translateY(-50%)}
h1{margin:0;font:500 64px/76px Literata,serif;letter-spacing:-.01em}
p{margin:24px 0 0;font:400 28px/36px Atkinson,sans-serif;color:hsl(32 12% 72%)}
</style><div class="mark">${logoSvg.replace('width="512" height="512"', 'width="260" height="260"')}</div><div class="axis"></div>
<div class="copy"><h1>Type fast<br>with one hand</h1><p>Free  •  Offline  •  Private</p></div>`);
await fgPage.evaluate(() => document.fonts.ready);
await fgPage.screenshot({ path: join(root, 'docs/store/feature-graphic.png') });
await fgPage.close();
await browser.close();
const fg = await sharp(join(root, 'docs/store/feature-graphic.png')).metadata();
if (fg.width !== 1024 || fg.height !== 500) fail(`feature graphic ${fg.width}x${fg.height}`);
console.log('  ok feature-graphic.png 1024x500');


copyFileSync(join(root, 'client/public/icons/play-store-512.png'), join(root, 'docs/store/icon-512.png'));
console.log('  ok icon-512.png');
console.log('STORE-SHOTS DONE');
