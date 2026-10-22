// Wave B gate: custom keyboard builder + custom lessons.
// Run: node e2e/wave-b-builder.mjs <baseURL> [screenshotDir]
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4175';
const shots = process.argv[3] || null;
const fail = (msg) => { console.error('WAVE-B FAIL:', msg); process.exit(1); };
const ok = (msg) => console.log('  ok', msg);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true, serviceWorkers: 'block' });
const page = await ctx.newPage();
const errors = [];
const apiCalls = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
page.on('request', (r) => { if (r.url().includes('/api/')) apiCalls.push(r.url()); });

const shot = async (name) => { if (shots) await page.screenshot({ path: `${shots}/${name}.png` }); };
const state = async () => page.evaluate(() => JSON.parse(localStorage.getItem('onehandtype-store') || '{}').state || {});
const path = () => new URL(page.url()).pathname;
const noHScroll = async (label) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (over > 0) fail(`horizontal page scroll (${over}px) on ${label}`);
};

try {
  // 1. Create a layout
  await page.goto(`${base}/settings`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Create custom layout' }).click();
  await page.waitForURL('**/settings/keyboard-builder');
  await page.getByRole('radio', { name: /QWERTY/ }).first().click();
  await page.getByRole('radio', { name: 'Right hand' }).click();
  await shot('builder-start');
  await noHScroll('builder start');
  await page.getByRole('button', { name: 'Start designing' }).click();
  ok('started from QWERTY / right hand');

  // 2. Swap two keys (right-hand QWERTY has g and h on the home row)
  await page.getByRole('button', { name: 'g', exact: true }).click();
  await page.getByRole('button', { name: 'g', exact: true }).waitFor();
  const pressed = await page.getByRole('button', { name: 'g', exact: true }).getAttribute('aria-pressed');
  if (pressed !== 'true') fail('selected key not marked aria-pressed');
  await page.getByRole('button', { name: 'h', exact: true }).click();
  await shot('builder-edit');
  await noHScroll('builder editor');
  // After swapping, the first home-row key should now read h.
  const firstHome = await page.locator('[aria-label="Row 3"] button').first().getAttribute('aria-label');
  if (firstHome !== 'h') fail(`swap did not apply (row 3 first key = ${firstHome})`);
  ok('swapped g and h');

  // Undo then redo the swap via another swap
  await page.getByRole('button', { name: 'Undo' }).click();
  const undone = await page.locator('[aria-label="Row 3"] button').first().getAttribute('aria-label');
  if (undone !== 'g') fail('undo did not restore the key');
  await page.getByRole('button', { name: 'g', exact: true }).click();
  await page.getByRole('button', { name: 'h', exact: true }).click();
  ok('undo works');

  // Edit key sheet: clear nothing, just open and cancel
  await page.getByRole('button', { name: 'k', exact: true }).click();
  await page.getByRole('button', { name: 'Edit key' }).click();
  await page.getByRole('dialog').waitFor();
  await shot('builder-sheet');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  await page.getByRole('button', { name: 'k', exact: true }).click(); // deselect
  ok('edit-key sheet opens and closes');

  // Validation panel shows missing letters warning
  await page.getByText('Missing letters:', { exact: false }).waitFor();
  ok('validation warning shown');

  // 3. Name + save + use now
  await page.getByLabel('Layout name').fill('Test Layout');
  await page.getByRole('button', { name: 'Save layout' }).click();
  await page.getByRole('button', { name: 'Use this layout now' }).click();
  await page.waitForURL('**/settings');
  await page.waitForTimeout(200);
  const trigger = await page.locator('#layout-select').innerText();
  if (!trigger.includes('Test Layout')) fail(`select shows "${trigger}", expected Test Layout`);
  await shot('settings-with-custom');
  await noHScroll('settings');
  let st = await state();
  if (!st.customLayouts || st.customLayouts.length !== 1) fail('customLayouts not persisted');
  const saved = st.customLayouts[0];
  if (st.keyboardLayout !== saved.id) fail('keyboardLayout is not the saved custom id');
  const homeRow = saved.layout[2].map((k) => k.key).join('');
  if (!homeRow.startsWith('hg')) fail(`swapped chars not persisted (home row = ${homeRow})`);
  ok(`saved + activated ${saved.id}`);

  // 4. Reload persistence
  await page.reload({ waitUntil: 'networkidle' });
  if (!(await page.locator('#layout-select').innerText()).includes('Test Layout')) fail('custom layout not active after reload');
  ok('persists after reload');

  // 5. Edit: rename and save
  await page.getByRole('link', { name: 'Edit Test Layout' }).click();
  await page.waitForURL(`**/settings/keyboard-builder/${saved.id}`);
  await page.getByLabel('Layout name').fill('Test Layout B');
  await page.getByRole('button', { name: 'Save layout' }).click();
  await page.getByRole('button', { name: 'Not now' }).click();
  await page.waitForURL('**/settings');
  st = await state();
  if (st.customLayouts[0].name !== 'Test Layout B' || st.customLayouts[0].id !== saved.id) fail('edit did not update in place');
  if (st.customLayouts[0].createdAt !== saved.createdAt) fail('createdAt changed on edit');
  ok('edit renames in place');

  // 6. Unsaved-changes guard, export, bad import
  await page.getByRole('link', { name: 'Edit Test Layout B' }).click();
  await page.getByLabel('Layout name').fill('Dirty name');
  await page.getByRole('button', { name: 'Back to settings' }).click();
  await page.getByRole('alertdialog').waitFor();
  await page.getByRole('button', { name: 'Keep editing' }).click();
  if (path().endsWith('/settings')) fail('guard let us leave');
  await page.getByLabel('Layout name').fill('Test Layout B');
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 5000 }),
    page.getByRole('button', { name: 'Export JSON' }).click(),
  ]);
  if (!download.suggestedFilename().endsWith('.json')) fail('export filename not .json');
  ok('unsaved guard + export download');
  await page.locator('input[type=file]').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"format":"nope"}') });
  await page.getByRole('alert').filter({ hasText: 'not a One-Type layout file' }).waitFor({ timeout: 3000 });
  ok('malformed import rejected');
  await page.getByRole('button', { name: 'Back to settings' }).click(); // not dirty now

  // 7. Delete resets active layout to qwerty
  await page.waitForURL('**/settings');
  await page.getByRole('button', { name: 'Delete Test Layout B' }).click();
  await page.getByRole('button', { name: 'Delete layout' }).click();
  await page.waitForTimeout(200);
  st = await state();
  if (st.customLayouts.length !== 0) fail('layout not deleted');
  if (st.keyboardLayout !== 'qwerty') fail(`keyboardLayout is ${st.keyboardLayout}, expected qwerty`);
  ok('delete resets to qwerty');

  // 8. Custom lesson
  await page.goto(`${base}/practice`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'New lesson' }).click();
  await page.getByLabel('Title').fill('E2E Lesson');
  await page.getByLabel('Description').fill('Made by the e2e test');
  await page.getByLabel('Text to type').fill('hello there friend');
  await shot('practice-builder');
  await noHScroll('practice builder');
  await page.getByRole('button', { name: 'Save lesson' }).click();
  await page.getByRole('heading', { name: 'E2E Lesson' }).waitFor();
  await shot('practice-my-lessons');
  st = await state();
  const lesson = st.customLessons?.find((l) => l.title === 'E2E Lesson');
  if (!lesson || !lesson.id.startsWith('custom-lesson-')) fail('custom lesson not stored with custom-lesson- id');
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'E2E Lesson' }).waitFor({ timeout: 3000 });
  ok('custom lesson created and persists');
} catch (e) {
  fail(String(e && e.message ? e.message : e));
}

if (errors.length) fail(`console errors: ${errors.join(' | ')}`);
if (apiCalls.length) fail(`unexpected /api calls: ${apiCalls.join(', ')}`);
await browser.close();
console.log('WAVE-B PASS');
