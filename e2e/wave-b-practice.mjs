// Wave B gate: the core practice screen (input sources, keyboard layouts, results, curriculum text).
// Run: node e2e/wave-b-practice.mjs <baseURL> [screenshotDir]
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4173';
const shots = process.argv[3] || null;
const fail = (msg) => { console.error('WAVE-B FAIL:', msg); process.exit(1); };
const ok = (msg) => console.log('  ✓', msg);

const BASICS_1 = 'f f f f f f f f f f f f f f f f f f f f';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
const apiCalls = [];

/** Fresh context per scenario so persisted state never leaks between checks. */
async function freshPage(seed) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => { if (r.url().includes('/api/')) apiCalls.push(r.url()); });
  if (seed) {
    // Write the persisted store (zustand persist shape: { state, version }) before the app boots.
    await page.addInitScript((s) => {
      if (!localStorage.getItem('onehandtype-store')) {
        localStorage.setItem('onehandtype-store', JSON.stringify({ state: s, version: 1 }));
      }
    }, seed);
  }
  return page;
}
const shot = async (page, name) => { if (shots) await page.screenshot({ path: `${shots}/${name}.png` }); };

async function openLesson(page, id) {
  await page.goto(`${base}/lesson/${id}`, { waitUntil: 'networkidle' });
  await page.locator('[data-testid="onscreen-keyboard"]').waitFor({ timeout: 8000 })
    .catch(() => fail(`on-screen keyboard missing on /lesson/${id}`));
  // The shell's one-time "Ready to work offline" toast sits over the keyboard; dismiss it if shown.
  const toastOk = page.getByRole('status').getByRole('button', { name: 'Dismiss' });
  await toastOk.waitFor({ timeout: 1200 }).then(() => toastOk.click()).catch(() => {});
}

async function expectResults(page, label) {
  await page.getByRole('heading', { name: 'Lesson complete' }).waitFor({ timeout: 6000 })
    .catch(() => fail(`${label}: results sheet did not appear`));
  await page.waitForTimeout(1500);
  if (!(await page.getByRole('heading', { name: 'Lesson complete' }).isVisible())) fail(`${label}: results sheet vanished`);
}

async function storeState(page) {
  const raw = await page.evaluate(() => localStorage.getItem('onehandtype-store'));
  if (!raw) fail('nothing persisted');
  return JSON.parse(raw).state;
}

const noHScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

// (a) physical keyboard completes basics-1 ---------------------------------------
{
  const page = await freshPage();
  await openLesson(page, 'basics-1');
  if (await page.locator('textarea').count()) fail('a textarea exists (OS keyboard would pop up)');
  await page.keyboard.type(BASICS_1, { delay: 12 });
  await expectResults(page, '(a)');
  await shot(page, 'b-a-results');
  const st = await storeState(page);
  if (!st.completedLessons?.includes('basics-1') || !(st.xp > 0)) fail('(a) basics-1 not persisted with xp');
  const sheet = await page.getByTestId('results-sheet').innerText();
  if (!/\+\d+/.test(sheet) || !/Accuracy/.test(sheet)) fail('(a) results sheet missing XP/accuracy');
  if (!/First clear|New best/.test(sheet)) fail('(a) results sheet missing badge');
  ok('(a) physical typing completes lesson; results persist, XP and badge shown');
  await page.context().close();
}

// (b) on-screen taps on DEFAULT right-hand QWERTY via one-shot Mirror, incl. a mistake + backspace
{
  const page = await freshPage();
  await openLesson(page, 'basics-1');
  const mirror = page.getByRole('button', { name: 'Mirror keyboard' });
  const space = page.locator('button[aria-label="Space"]');
  // Next-key hint: F lives on the mirror layer, so the Mirror key glows first.
  if ((await mirror.getAttribute('data-next')) !== 'true') fail('(b) Mirror key is not highlighted for an F');
  await page.locator('button[aria-label="Key K"]').click(); // primary-layer K: wrong
  if ((await page.locator('[data-testid="practice-text"] [data-state="incorrect"]').count()) !== 1) fail('(b) wrong tap not marked incorrect');
  await page.locator('button[aria-label="Backspace"]').click();
  if ((await page.locator('[data-testid="practice-text"] [data-state="incorrect"]').count()) !== 0) fail('(b) backspace did not clear error');
  for (let i = 0; i < 20; i++) {
    await mirror.click();
    if ((await mirror.getAttribute('aria-pressed')) !== 'true') fail('(b) Mirror not pressed after tap');
    // The key that sits under J now shows F.
    await page.locator('button[aria-label="Key F"][data-layer="mirror"]').click();
    if ((await mirror.getAttribute('aria-pressed')) !== 'false') fail('(b) one-shot Mirror did not auto-return');
    if (await page.getByTestId('assist-key').count()) fail('(b) Insert fallback appeared');
    if (i < 19) await space.click();
  }
  await expectResults(page, '(b)');
  const sheet = await page.getByTestId('results-sheet').innerText();
  if (/100%/.test(sheet.split('Time')[0])) fail('(b) accuracy shows 100% despite a mistake');
  await shot(page, 'b-b-results');
  await page.getByRole('button', { name: 'Practice again' }).click();
  await page.getByTestId('results-sheet').waitFor({ state: 'detached', timeout: 3000 }).catch(() => fail('(b) sheet did not close on Practice again'));
  const st = await storeState(page);
  if (st.lessonProgress?.['basics-1']?.completions !== 1) fail('(b) completeLesson not called exactly once');
  ok('(b) right-hand QWERTY lesson completes by taps only (Mirror one-shot), no Insert; mistakes kept; practice-again resets');
  await page.context().close();
}

// (b2) Mirror lock: double-tap locks, several mirrored letters, tap unlocks, j<->f mapping
{
  const page = await freshPage();
  await openLesson(page, 'basics-1');
  const mirror = page.getByRole('button', { name: 'Mirror keyboard' });
  await mirror.dblclick();
  if ((await mirror.getAttribute('data-mirror')) !== 'locked') fail('(b2) double-tap did not lock Mirror');
  if (!(await page.getByTestId('mirror-lock').count())) fail('(b2) no lock indicator');
  // qwerty right-hand: J <-> F
  const jPartner = await page.evaluate(() => {
    const prim = [...document.querySelectorAll('[data-testid="onscreen-keyboard"] [data-key]')].map((b) => b.dataset.key);
    return prim.includes('f');
  });
  if (!jPartner) fail('(b2) mirror layer does not expose f');
  const f = page.locator('button[aria-label="Key F"]');
  const space = page.locator('button[aria-label="Space"]');
  for (let i = 0; i < 3; i++) { await f.click(); await space.click(); }
  if ((await mirror.getAttribute('data-mirror')) !== 'locked') fail('(b2) lock dropped after typing');
  if ((await page.locator('[data-testid="practice-text"] [data-state="correct"]').count()) !== 6) fail('(b2) mirrored letters not typed');
  await mirror.click();
  if ((await mirror.getAttribute('data-mirror')) !== 'off') fail('(b2) tap did not unlock');
  if (!(await page.locator('button[aria-label="Key J"]').count())) fail('(b2) primary layer not restored (J missing)');
  ok('(b2) Mirror lock/unlock works; j<->f mirror mapping on right-hand QWERTY');
  await page.context().close();
}

// (c) left hand + dvorak-one-hand --------------------------------------------------
{
  const page = await freshPage({ handPreference: 'left', keyboardLayout: 'dvorak-one-hand' });
  await openLesson(page, 'basics-1');
  const keys = await page.locator('[data-testid="onscreen-keyboard"] button').count();
  if (keys < 20) fail(`(c) only ${keys} key buttons`);
  if (!(await noHScroll(page))) fail('(c) horizontal overflow at 390px');
  const small = await page.evaluate(() => [...document.querySelectorAll('[data-testid="onscreen-keyboard"] button')]
    .filter((b) => { const r = b.getBoundingClientRect(); return r.width < 44 || r.height < 44; }).length);
  if (small) fail(`(c) ${small} keys smaller than 44px`);
  const back = await page.getByRole('button', { name: 'Back', exact: true }).boundingBox();
  if (!back || back.x > 195) fail('(c) back button is not on the left in left-hand mode');
  // Every a-z must be reachable on primary U mirror layer.
  const readKeys = () => page.evaluate(() => [...document.querySelectorAll('[data-testid="onscreen-keyboard"] [data-key]')].map((b) => b.dataset.key.toLowerCase()));
  const primaryKeys = await readKeys();
  await page.getByRole('button', { name: 'Mirror keyboard' }).click();
  await page.waitForTimeout(250);
  const mirrorKeys = await readKeys();
  const all = new Set([...primaryKeys, ...mirrorKeys]);
  const missing = 'abcdefghijklmnopqrstuvwxyz'.split('').filter((c) => !all.has(c));
  if (missing.length) fail(`(c) letters unreachable on dvorak-one-hand left: ${missing.join('')}`);
  if (await page.getByTestId('assist-key').count()) fail('(c) Insert fallback shown although mirror covers F');
  await shot(page, 'b-c-left-dvorak');
  ok(`(c) left-hand dvorak-one-hand: ${keys} keys, no overflow, keys >=44px, controls on left, a-z reachable via mirror`);
  await page.context().close();
}

// (c2) right hand control side + custom-size sanity on qwerty ------------------------
{
  const page = await freshPage();
  await openLesson(page, 'basics-1');
  const back = await page.getByRole('button', { name: 'Back', exact: true }).boundingBox();
  if (!back || back.x < 195) fail('(c2) back button is not on the right in right-hand mode');
  if (!(await noHScroll(page))) fail('(c2) horizontal overflow');
  if (await page.getByTestId('assist-key').count()) fail('(c2) Insert fallback shown on right-hand QWERTY');
  await shot(page, 'b-c2-right-qwerty');
  ok('(c2) right-hand default mirrors controls to the right');
  await page.context().close();
}

// (d) ARTSEY: keyboard, chord hint, touch chords -------------------------------------
{
  const page = await freshPage({ keyboardLayout: 'artsey' });
  await openLesson(page, 'words-1'); // "the and for ..."
  await page.getByTestId('chord-hint').waitFor({ timeout: 3000 }).catch(() => fail('(d) chord hint missing'));
  const hint = await page.getByTestId('chord-hint').innerText();
  if (!/T/.test(hint)) fail(`(d) chord hint for "t" unexpected: ${hint}`);
  if ((await page.locator('[data-testid="onscreen-keyboard"] button[aria-label^="Key "]').count()) < 8) fail('(d) ARTSEY keys missing');
  if (await page.getByTestId('mirror-key').count()) fail('(d) Mirror key must be hidden for ARTSEY');
  await shot(page, 'b-d-artsey');
  // t = single key; h = R+S; e = A+R (pressed in the same tick => one chord)
  await page.locator('button[aria-label="Key T"]').click();
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    const press = (label) => {
      const el = document.querySelector(`button[aria-label="${label}"]`);
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', button: 0 }));
      el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch', button: 0 }));
    };
    press('Key R'); press('Key S');
  });
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const press = (label) => {
      const el = document.querySelector(`button[aria-label="${label}"]`);
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', button: 0 }));
      el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch', button: 0 }));
    };
    press('Key A'); press('Key R');
  });
  await page.waitForTimeout(200);
  const correct = await page.locator('[data-testid="practice-text"] [data-state="correct"]').count();
  if (correct !== 3) fail(`(d) expected "the" typed by chords, got ${correct} correct chars`);
  ok('(d) ARTSEY keyboard, chord hint and 60ms touch chords work');
  await page.context().close();
}

// (e) curriculum lesson shows practice text, Enter key, Next lesson -------------------
{
  const page = await freshPage();
  await openLesson(page, 'lesson-1-1');
  const shown = await page.getByTestId('practice-text').textContent();
  if (!shown.includes('asdf')) fail(`(e) curriculum practice text not shown: ${shown.slice(0, 60)}`);
  if (/Basic finger positioning/.test(shown)) fail('(e) description sentence shown instead of practice text');
  if (!(await page.locator('button[aria-label="Enter"]').count())) fail('(e) Enter key missing for multi-line lesson');
  await shot(page, 'b-e-curriculum');
  await page.keyboard.type('asdf jkl;\nfjfj fjfj fjfj\nasdf jkl; asdf jkl;\nff jj ff jj dd kk dd kk', { delay: 8 });
  await expectResults(page, '(e)');
  const next = page.getByRole('button', { name: /Next lesson/ });
  if (!(await next.count())) fail('(e) Next lesson button missing');
  await next.click();
  await page.waitForURL(/lesson\/lesson-1-2/, { timeout: 4000 }).catch(() => fail('(e) Next lesson did not navigate'));
  await page.locator('[data-testid="onscreen-keyboard"]').waitFor({ timeout: 5000 });
  ok('(e) curriculum lesson shows practice text, multi-line completes, Next lesson navigates');
  await page.context().close();
}

if (apiCalls.length) fail(`API calls: ${apiCalls.join(', ')}`);
const real = errors.filter((e) => !/accounts\.google\.com/.test(e));
if (real.length) fail(`console errors: ${real.slice(0, 4).join(' | ')}`);
ok('(f) zero console errors, zero /api requests');
console.log('WAVE-B PASS');
await browser.close();
