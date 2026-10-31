// Wave C gate: accessibility (axe, touch targets, overflow), tutorial/onboarding flow, achievement pacing.
// Run: node e2e/wave-c-a11y.mjs <baseURL> [screenshotDir]
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.argv[2] || 'http://localhost:4173';
const shots = process.argv[3] || null;
const fail = (msg) => { console.error('WAVE-C FAIL:', msg); failures.push(msg); };
const ok = (msg) => console.log('  ✓', msg);
const failures = [];

const ROUTES = ['/', '/curriculum', '/practice', '/stats', '/settings', '/settings/keyboard-builder', '/tutorial', '/about', '/privacy', '/lesson/basics-1'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const STORE_KEY = 'onehandtype-store';

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' });
const errors = [];
const apiCalls = [];

async function freshPage(theme, seed = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/accounts\.google|ERR_PROXY|ERR_TUNNEL|Failed to load resource/i.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => { if (r.url().includes('/api/')) apiCalls.push(r.url()); });
  await page.addInitScript(([key, state]) => {
    try {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ state, version: 1 }));
    } catch { /* ignore */ }
  }, [STORE_KEY, { themeMode: theme, ...seed }]);
  return page;
}

/** Visible interactive elements that are too small. */
function measureTargets(page) {
  return page.evaluate(() => {
    const sel = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=switch], [role=radio], [role=checkbox], [role=slider], [role=link]';
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (r.width <= 1 || r.height <= 1) continue; // sr-only
      if (el.closest('[inert]')) continue;
      // Inline text links are exempt (WCAG 2.5.8 inline exception).
      if (el.tagName === 'A' && cs.display === 'inline' && el.closest('p, li, span')?.textContent.trim() !== el.textContent.trim()) continue;
      // Hidden-but-focusable radio/checkbox inputs wrapped by a visible label are measured via the label.
      if ((el.tagName === 'INPUT') && el.closest('label') && r.width < 4) continue;
      const inKeyboard = Boolean(el.closest('[data-testid="onscreen-keyboard"]'));
      const minH = inKeyboard ? 48 : 44;
      const minW = 44;
      if (r.height + 0.5 < minH || r.width + 0.5 < minW) {
        out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}${inKeyboard ? ' [kb]' : ''}`);
      }
    }
    return out;
  });
}

for (const theme of ['dark', 'light']) {
  console.log(`\n[${theme}] axe + targets + overflow`);
  for (const route of ROUTES) {
    const page = await freshPage(theme);
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700); // let route transition settle (opacity affects contrast)
    const themeClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if ((theme === 'dark') !== themeClass) fail(`${route}: expected ${theme} theme, html.dark=${themeClass}`);

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    const minor = results.violations.filter((v) => !(v.impact === 'serious' || v.impact === 'critical'));
    if (bad.length) {
      for (const v of bad) {
        fail(`${theme} ${route}: axe ${v.impact} ${v.id} (${v.nodes.length}): ${v.help}`);
        for (const n of v.nodes.slice(0, 4)) console.error('      ', n.target.join(' '), '|', (n.any[0]?.message || n.failureSummary || '').split('\n')[0].slice(0, 160));
      }
    }
    if (minor.length) console.log(`    (${route} ${theme} non-blocking axe: ${minor.map((v) => `${v.id}/${v.impact}`).join(', ')})`);

    const small = await measureTargets(page);
    if (small.length) fail(`${theme} ${route}: ${small.length} undersized targets: ${small.slice(0, 6).join('; ')}`);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) fail(`${theme} ${route}: horizontal overflow ${overflow}px`);

    const h1 = await page.locator('h1').count();
    const mains = await page.locator('main').count();
    if (h1 !== 1) fail(`${theme} ${route}: expected exactly one h1, found ${h1}`);
    if (mains !== 1) fail(`${theme} ${route}: expected exactly one main, found ${mains}`);

    if (shots) await page.screenshot({ path: `${shots}/${theme}${route.replace(/\//g, '_') || '_'}.png` });
    if (!bad.length && !small.length && overflow <= 0) ok(`${theme} ${route}: axe clean (0 serious/critical), targets ok, no overflow`);
    await page.context().close();
  }
}

// Home first-launch hero + tutorial flow ------------------------------------------------
console.log('\ntutorial / onboarding');
{
  const page = await freshPage('dark');
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const tour = page.getByText(/Take the 1-minute tour/i);
  if (!(await tour.count())) fail('home: first-launch "Take the 1-minute tour" hero missing');
  else ok('home shows first-launch tour hero');
  if (new URL(page.url()).pathname !== '/') fail('home force-redirected away from /');

  await page.goto(`${base}/tutorial`, { waitUntil: 'networkidle' });
  const next = () => page.getByRole('button', { name: /^Next/ });
  // 1 welcome
  await page.getByRole('heading', { level: 1 }).waitFor();
  if (shots) await page.screenshot({ path: `${shots}/tutorial-1.png` });
  await next().click();
  // 2 hand
  await page.getByRole('radio', { name: /left/i }).click();
  const hand = await page.evaluate(() => document.documentElement.dataset.hand);
  if (hand !== 'left') fail(`tutorial: choosing left hand set data-hand=${hand}`);
  if (shots) await page.screenshot({ path: `${shots}/tutorial-2.png` });
  await next().click();
  // 3 layout
  const radios = await page.getByRole('radio').count();
  if (radios < 2) fail(`tutorial: layout step has ${radios} options`);
  if (shots) await page.screenshot({ path: `${shots}/tutorial-3.png` });
  await next().click();
  // 4 mirror demo
  await page.locator('[data-testid="onscreen-keyboard"]').waitFor({ timeout: 5000 });
  await page.locator('[data-testid="mirror-key"]').dispatchEvent('pointerdown', { pointerType: 'touch', button: 0 });
  await page.locator('[data-testid="mirror-key"]').dispatchEvent('pointerup');
  const layer = await page.locator('[data-testid="onscreen-keyboard"] button[data-layer]').first().getAttribute('data-layer');
  if (layer !== 'mirror') fail(`tutorial: mirror key did not switch layer (layer=${layer})`);
  const key = page.locator('[data-testid="onscreen-keyboard"] button[data-layer="mirror"]').first();
  const keyChar = await key.getAttribute('data-key');
  await key.dispatchEvent('pointerdown', { pointerType: 'touch', button: 0 });
  const typed = await page.locator('[data-testid="tutorial-demo-output"]').innerText();
  if (!typed.includes(keyChar)) fail(`tutorial: demo output "${typed}" lacks "${keyChar}"`);
  else ok(`tutorial mirror demo typed "${keyChar}" via Mirror`);
  if (shots) await page.screenshot({ path: `${shots}/tutorial-4.png` });
  await next().click();
  // 5 finish
  const startBtn = page.getByRole('button', { name: /Start your first lesson/i });
  await startBtn.waitFor();
  if (shots) await page.screenshot({ path: `${shots}/tutorial-5.png` });
  await startBtn.click();
  await page.waitForURL(/\/lesson\/lesson-1-1/, { timeout: 5000 }).catch(() => fail('tutorial: start did not route to /lesson/lesson-1-1'));
  const st = JSON.parse(await page.evaluate((k) => localStorage.getItem(k), STORE_KEY)).state;
  if (st.onboardingComplete !== true) fail('tutorial: onboardingComplete not persisted true');
  if (st.handPreference !== 'left') fail(`tutorial: handPreference persisted as ${st.handPreference}`);
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  if (await page.getByText(/Take the 1-minute tour/i).count()) fail('home: tour hero still shown after onboarding');
  else ok('tutorial complete -> onboardingComplete true, hero gone, hand saved');
  await page.context().close();
}
{
  // Skip path also completes onboarding and returns focusable UI.
  const page = await freshPage('dark');
  await page.goto(`${base}/tutorial`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Skip/i }).click();
  await page.waitForTimeout(300);
  const st = JSON.parse(await page.evaluate((k) => localStorage.getItem(k), STORE_KEY)).state;
  if (st.onboardingComplete !== true) fail('tutorial: skip did not mark onboardingComplete');
  else ok('tutorial skip marks onboarding complete');
  await page.context().close();
}

// First-lesson achievement pacing ---------------------------------------------------------
console.log('\nachievements');
{
  const page = await freshPage('dark');
  await page.goto(`${base}/lesson/basics-1`, { waitUntil: 'networkidle' });
  await page.locator('[data-testid="onscreen-keyboard"]').waitFor();
  await page.keyboard.type('f f f f f f f f f f f f f f f f f f f f', { delay: 10 });
  await page.getByRole('heading', { name: 'Lesson complete' }).waitFor({ timeout: 6000 }).catch(() => fail('achievements: results sheet missing'));
  await page.waitForTimeout(300);
  const st = JSON.parse(await page.evaluate((k) => localStorage.getItem(k), STORE_KEY)).state;
  const n = st.unlockedAchievements?.length ?? -1;
  if (n < 1 || n > 2) fail(`achievements: first lesson unlocked ${n} (${JSON.stringify(st.unlockedAchievements)}), expected 1-2`);
  else ok(`first lesson unlocked ${n} achievement(s): ${st.unlockedAchievements.join(', ')}`);
  // Results sheet: Escape dismisses it, focus lands back in the page.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  if (await page.getByRole('dialog').count()) fail('results sheet: Escape did not close it');
  else ok('results sheet closes on Escape');
  await page.context().close();
}

if (apiCalls.length) fail(`API calls: ${apiCalls.join(', ')}`);
if (errors.length) fail(`console errors: ${[...new Set(errors)].slice(0, 4).join(' | ')}`);
await browser.close();
if (failures.length) {
  console.error(`\nWAVE-C FAIL (${failures.length} problem${failures.length === 1 ? '' : 's'})`);
  process.exit(1);
}
console.log('WAVE-C PASS');
