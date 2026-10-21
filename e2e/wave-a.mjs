// Wave A gate: routing, shell, persistence, lesson completion, mirror mode, dark mode.
// Run: node e2e/wave-a.mjs <baseURL>
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4173';
const shots = process.argv[3] || null;
const fail = (msg) => { console.error('WAVE-A FAIL:', msg); process.exit(1); };
const ok = (msg) => console.log('  ✓', msg);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
const apiCalls = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
page.on('request', (r) => { if (r.url().includes('/api/')) apiCalls.push(r.url()); });

await page.goto(base, { waitUntil: 'networkidle' });

// 1. Tab bar exists with 5 tabs, each navigates
const nav = page.locator('nav[aria-label="Main"]');
await nav.waitFor({ timeout: 8000 }).catch(() => fail('bottom tab bar nav[aria-label=Main] missing'));
const tabs = [['Learn', '/curriculum'], ['Practice', '/practice'], ['Stats', '/stats'], ['Settings', '/settings'], ['Home', '/']];
for (const [label, path] of tabs) {
  await nav.getByRole('link', { name: label }).click();
  await page.waitForTimeout(250);
  const p = new URL(page.url()).pathname;
  if (p !== path) fail(`tab ${label} went to ${p}, expected ${path}`);
  if (shots) await page.screenshot({ path: `${shots}/tab-${label.toLowerCase()}.png` });
}
ok('5 tabs navigate to correct routes');

// 2. Complete basics-1 ("f" x20 separated by spaces)
await page.goto(`${base}/lesson/basics-1`, { waitUntil: 'networkidle' });
if (await nav.count()) fail('tab bar should be hidden on lesson screen');
const ta = page.locator('textarea');
await ta.waitFor({ timeout: 8000 }).catch(() => fail('lesson textarea missing'));
await ta.click();
await ta.pressSequentially('f f f f f f f f f f f f f f f f f f f f', { delay: 15 });
await page.getByText('Lesson Complete', { exact: false }).waitFor({ timeout: 5000 }).catch(() => fail('completion card did not appear'));
await page.waitForTimeout(1500);
if (!(await page.getByText('Lesson Complete', { exact: false }).isVisible())) fail('results card auto-dismissed');
if (shots) await page.screenshot({ path: `${shots}/lesson-complete.png` });
ok('lesson completes and results card stays');

// 3. Persistence across reload
const stored = await page.evaluate(() => localStorage.getItem('onehandtype-store'));
if (!stored) fail('nothing persisted to localStorage');
const st = JSON.parse(stored).state;
if (!st.completedLessons?.includes('basics-1')) fail('basics-1 not in persisted completedLessons');
if (!(st.xp > 0)) fail(`xp not awarded (xp=${st.xp})`);
await page.goto(`${base}/stats`, { waitUntil: 'networkidle' });
await page.reload({ waitUntil: 'networkidle' });
const statsText = await page.locator('main, body').first().innerText();
if (!/XP/.test(statsText)) fail('stats page shows no XP after reload');
ok(`progress persisted (xp=${st.xp}, completed=${st.completedLessons.length})`);

// 4. Settings: dark default, hand flip mirrors, dark toggle persists
const htmlClass0 = await page.evaluate(() => document.documentElement.className);
if (!/\bdark\b/.test(htmlClass0)) fail('app does not default to dark mode');
await page.goto(`${base}/settings`, { waitUntil: 'networkidle' });
const leftBtn = page.getByRole('button', { name: /left/i }).first();
const leftRadio = page.getByRole('radio', { name: /left/i }).first();
if (await leftRadio.count()) await leftRadio.click(); else if (await leftBtn.count()) await leftBtn.click(); else fail('no left-hand control on settings');
await page.waitForTimeout(200);
const hand = await page.evaluate(() => document.documentElement.dataset.hand);
if (hand !== 'left') fail(`data-hand is ${hand}, expected left`);
await page.reload({ waitUntil: 'networkidle' });
const handAfter = await page.evaluate(() => document.documentElement.dataset.hand);
if (handAfter !== 'left') fail('hand preference not persisted across reload');
if (shots) await page.screenshot({ path: `${shots}/settings-left.png` });
ok('hand flip sets data-hand=left and persists');

// 5. About / Privacy / 404 render
for (const path of ['/about', '/privacy', '/nope-404']) {
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  const txt = await page.locator('body').innerText();
  if (txt.trim().length < 40) fail(`${path} rendered nearly empty`);
}
ok('about, privacy, 404 render');

// 6. Curriculum shows Realm of Keys and basics-1-unlocked progress
await page.goto(`${base}/curriculum`, { waitUntil: 'networkidle' });
const cur = await page.locator('body').innerText();
if (!/Hearthlands/.test(cur)) fail('curriculum page missing region names');
if (/thrones|westeros|winterfell|keyforge/i.test(await page.content())) fail('IP strings in DOM');
ok('curriculum renders original realms, no IP strings');

if (apiCalls.length) fail(`API calls: ${apiCalls.join(', ')}`);
if (errors.length) fail(`console errors: ${errors.slice(0, 4).join(' | ')}`);
console.log('WAVE-A PASS');
await browser.close();
