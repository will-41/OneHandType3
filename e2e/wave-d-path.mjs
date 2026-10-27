// Wave D gate: the skill path (stars, checkpoints, strengthen lesson, daily rhythm, store migration).
// Run: node e2e/wave-d-path.mjs <baseURL> [screenshotDir]
import { chromium } from '@playwright/test';

const base = (process.argv[2] || 'http://localhost:4173').replace(/\/$/, '');
const shots = process.argv[3] || null;
const fail = (msg) => { console.error('WAVE-D FAIL:', msg); process.exit(1); };
const ok = (msg) => console.log('  ✓', msg);
const STORE_KEY = 'onehandtype-store';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
const apiCalls = [];

/** Fresh context per scenario so persisted state never leaks between checks. */
async function freshPage(seed) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error' && !/accounts\.google|ERR_PROXY|ERR_TUNNEL|Failed to load resource/i.test(m.text())) errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => { if (r.url().includes('/api/')) apiCalls.push(r.url()); });
  if (seed) {
    // Legacy persisted shape (version 1) so every scenario also exercises the v1 -> v2 migration.
    await page.addInitScript(([key, s]) => {
      try { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ state: s, version: 1 })); } catch { /* ignore */ }
    }, [STORE_KEY, seed]);
  }
  return page;
}
const shot = async (page, name) => { if (shots) await page.screenshot({ path: `${shots}/${name}.png` }); };

async function dismissToast(page) {
  const toastOk = page.getByRole('status').getByRole('button', { name: 'Dismiss' });
  await toastOk.waitFor({ timeout: 1200 }).then(() => toastOk.click()).catch(() => {});
}

async function openLesson(page, id) {
  await page.goto(`${base}/lesson/${id}`, { waitUntil: 'networkidle' });
  await page.locator('[data-testid="onscreen-keyboard"]').waitFor({ timeout: 8000 })
    .catch(() => fail(`on-screen keyboard missing on /lesson/${id}`));
  await dismissToast(page);
}

async function expectResults(page, label) {
  await page.getByRole('heading', { name: 'Lesson complete' }).waitFor({ timeout: 8000 })
    .catch(() => fail(`${label}: results sheet did not appear`));
  await page.waitForTimeout(800);
}

async function storeState(page) {
  const raw = await page.evaluate((k) => localStorage.getItem(k), STORE_KEY);
  if (!raw) fail('nothing persisted');
  return JSON.parse(raw);
}

const entry = (over = {}) => ({
  bestWpm: 20, bestAccuracy: 95, bestTimeMs: 30000, fewestErrors: 1, completions: 1,
  lastWpm: 20, lastAccuracy: 95, lastErrors: 1, lastTimeMs: 30000, lastCompletedAt: Date.now() - 86400000, ...over,
});

const LESSON_1_1 = 'asdf jkl;\nfjfj fjfj fjfj\nasdf jkl; asdf jkl;\nff jj ff jj dd kk dd kk';
const CHECKPOINT_1 = 'asdf jkl;\nfed red jet\ncab can man van\nmix zinc box';

// (1) STARS ----------------------------------------------------------------------------
{
  const page = await freshPage({
    completedLessons: ['lesson-1-1'],
    lessonProgress: { 'lesson-1-1': entry({ bestWpm: 3, bestAccuracy: 95 }) },
    onboardingComplete: true,
  });
  await page.goto(`${base}/curriculum`, { waitUntil: 'networkidle' });
  const node = page.locator('[data-testid="path-node-lesson-1-1"]');
  await node.waitFor({ timeout: 6000 }).catch(() => fail('(1) path-node-lesson-1-1 missing on /curriculum'));
  const label = (await node.getAttribute('aria-label')) || '';
  if (!/2 of 3 stars/.test(label)) fail(`(1) node aria-label lacks "2 of 3 stars": "${label}"`);
  await shot(page, 'd-1-path');

  await openLesson(page, 'lesson-1-1');
  await page.keyboard.type(LESSON_1_1, { delay: 8 });
  await expectResults(page, '(1)');
  const stars = page.getByTestId('results-stars');
  const sl = (await stars.getAttribute('aria-label')) || '';
  if (sl !== '3 of 3 stars') fail(`(1) results-stars aria-label "${sl}", expected "3 of 3 stars"`);
  await shot(page, 'd-1-results');
  ok('(1) node shows "2 of 3 stars"; fast clean run on lesson-1-1 earns "3 of 3 stars"');
  await page.context().close();
}

// (2) CHECKPOINT -----------------------------------------------------------------------
{
  const page = await freshPage({
    completedLessons: ['lesson-1-1', 'lesson-1-2', 'lesson-1-3'],
    lessonProgress: {
      'lesson-1-1': entry(), 'lesson-1-2': entry(), 'lesson-1-3': entry(),
    },
    xp: 100,
    onboardingComplete: true,
  });
  await openLesson(page, 'checkpoint-1');
  const body = await page.locator('body').innerText();
  if (!body.includes('asdf jkl;')) fail('(2) checkpoint-1 page text lacks "asdf jkl;"');
  await page.keyboard.type(CHECKPOINT_1, { delay: 8 });
  await expectResults(page, '(2)');
  await shot(page, 'd-2-checkpoint-results');
  let st = (await storeState(page)).state;
  if (!st.completedLessons?.includes('checkpoint-1')) fail('(2) checkpoint-1 not in persisted completedLessons');
  if (!(st.xp >= 160)) fail(`(2) xp ${st.xp}, expected >= 160 (+60)`);
  const unlocked = st.unlockedAchievements || [];
  if (!unlocked.includes('unit-1') && !unlocked.includes('checkpoint-first')) {
    fail(`(2) neither unit-1 nor checkpoint-first unlocked: ${JSON.stringify(unlocked)}`);
  }
  await page.getByRole('button', { name: /Next lesson/ }).click();
  await page.waitForURL(/\/lesson\/lesson-2-1/, { timeout: 5000 })
    .catch(() => fail(`(2) Next lesson did not navigate to /lesson/lesson-2-1 (at ${page.url()})`));
  ok(`(2) checkpoint-1 resolves, completes (+${st.xp - 100} xp), unlocks ${unlocked.filter((a) => /unit-1|checkpoint-first/.test(a)).join('+')}, Next -> lesson-2-1`);
  await page.context().close();
}

// (3) STRENGTHEN -----------------------------------------------------------------------
{
  const page = await freshPage({
    completedLessons: ['lesson-1-1'],
    lessonProgress: { 'lesson-1-1': entry() },
    onboardingComplete: true,
  });
  await page.goto(`${base}/curriculum`, { waitUntil: 'networkidle' });
  const node = page.locator('[data-testid="path-strengthen-1"]');
  await node.waitFor({ timeout: 6000 }).catch(() => fail('(3) path-strengthen-1 missing on /curriculum'));
  const label = (await node.getAttribute('aria-label')) || '';
  if (!/locked/i.test(label)) fail(`(3) strengthen node not locked with 1 lesson: "${label}"`);
  await page.context().close();

  const page2 = await freshPage({
    completedLessons: ['lesson-1-1', 'lesson-1-2', 'lesson-1-3'],
    lessonProgress: { 'lesson-1-1': entry(), 'lesson-1-2': entry(), 'lesson-1-3': entry() },
    keyStats: { g: { hits: 10, misses: 5 }, h: { hits: 10, misses: 4 } },
    onboardingComplete: true,
  });
  await page2.goto(`${base}/curriculum`, { waitUntil: 'networkidle' });
  const node2 = page2.locator('[data-testid="path-strengthen-1"]');
  await node2.waitFor({ timeout: 6000 }).catch(() => fail('(3) path-strengthen-1 missing after seeding keyStats'));
  const label2 = (await node2.getAttribute('aria-label')) || '';
  if (/locked/i.test(label2) && !/unlocked/i.test(label2)) fail(`(3) strengthen node still locked with weak keys: "${label2}"`);
  await page2.goto(`${base}/lesson/strengthen-weak-keys`, { waitUntil: 'networkidle' });
  await page2.locator('[data-testid="onscreen-keyboard"]').waitFor({ timeout: 8000 }).catch(() => fail('(3) strengthen lesson did not open'));
  const text = await page2.locator('body').innerText();
  if (!text.includes('gg') || !text.includes('hh')) fail('(3) strengthen lesson text lacks "gg"/"hh"');
  ok('(3) strengthen node locked with 1 lesson, unlocked with weak keys; lesson drills g and h');
  await page2.context().close();
}

// (4) RHYTHM ---------------------------------------------------------------------------
{
  const page = await freshPage();
  await openLesson(page, 'basics-1');
  await page.keyboard.type('f f f f f f f f f f f f f f f f f f f f', { delay: 60 });
  await expectResults(page, '(4)');
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const ring = page.getByTestId('rhythm-ring');
  await ring.waitFor({ timeout: 6000 }).catch(() => fail('(4) rhythm-ring missing on Home'));
  const label = (await ring.getAttribute('aria-label')) || '';
  if (!/of 10 minutes today/.test(label)) fail(`(4) rhythm-ring aria-label "${label}"`);
  const today = await page.evaluate(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const st = (await storeState(page)).state;
  const keys = Object.keys(st.practiceLog || {});
  if (keys.length !== 1 || keys[0] !== today) fail(`(4) practiceLog keys ${JSON.stringify(keys)}, expected [${today}]`);
  if (!(st.practiceLog[today] > 0)) fail(`(4) practiceLog minutes ${st.practiceLog[today]} not > 0`);
  await shot(page, 'd-4-home');
  ok(`(4) basics-1 logged ${st.practiceLog[today]} min for ${today}; rhythm ring: "${label}"`);
  await page.context().close();
}

// (5) MIGRATION ------------------------------------------------------------------------
{
  const page = await freshPage({
    unlockedAchievements: ['first-lesson', 'realm-3'],
    achievementDates: { 'realm-3': 1 },
  });
  await page.goto(`${base}/stats`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const persisted = await storeState(page);
  if (persisted.version !== 2) fail(`(5) persisted version ${persisted.version}, expected 2`);
  const ids = persisted.state.unlockedAchievements || [];
  if (!ids.includes('unit-3') || ids.includes('realm-3')) fail(`(5) achievements not migrated: ${JSON.stringify(ids)}`);
  const ks = persisted.state.keyStats;
  if (!ks || typeof ks !== 'object' || Object.keys(ks).length !== 0) fail(`(5) keyStats not {}: ${JSON.stringify(ks)}`);
  const text = await page.locator('body').innerText();
  if (!text.includes('Unit cleared: Sentences')) fail('(5) /stats lacks "Unit cleared: Sentences"');
  if (!(await page.getByTestId('key-heatmap').count())) fail('(5) key-heatmap missing on /stats');
  await shot(page, 'd-5-stats');
  ok('(5) v1 store migrates to v2: realm-3 -> unit-3, keyStats {}, Stats shows "Unit cleared: Sentences"');
  await page.context().close();
}

if (apiCalls.length) fail(`API calls: ${apiCalls.join(', ')}`);
if (errors.length) fail(`console errors: ${[...new Set(errors)].slice(0, 4).join(' | ')}`);
console.log('WAVE-D PASS');
await browser.close();
