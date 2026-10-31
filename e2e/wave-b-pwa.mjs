// Wave B gate: installable, fully-offline PWA.
// Run: node e2e/wave-b-pwa.mjs <baseURL>   (against `vite preview`)
import { chromium } from '@playwright/test';

const base = (process.argv[2] || 'http://localhost:4176').replace(/\/$/, '');
const fail = (msg) => { console.error('WAVE-B FAIL:', msg); process.exit(1); };
const ok = (msg) => console.log('  ✓', msg);

const pngSize = async (res) => {
  const b = Buffer.from(await res.body());
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
const page = await ctx.newPage();
const errors = [];
const apiCalls = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
page.on('request', (r) => { if (r.url().includes('/api/')) apiCalls.push(r.url()); });

// (a) manifest
const mres = await ctx.request.get(`${base}/manifest.webmanifest`);
if (mres.status() !== 200) fail(`manifest status ${mres.status()}`);
let manifest;
try { manifest = await mres.json(); } catch { fail('manifest is not valid JSON'); }
if (!manifest.name) fail('manifest.name missing');
if (!manifest.icons?.some((i) => i.purpose === 'maskable')) fail('no maskable icon');
if (manifest.orientation === 'landscape') fail('orientation must not be forced');
for (const i of manifest.icons) {
  const r = await ctx.request.get(new URL(i.src, `${base}/manifest.webmanifest`).href);
  if (r.status() !== 200) fail(`icon ${i.src} -> ${r.status()}`);
  const dim = await pngSize(r);
  if (!dim) fail(`icon ${i.src} is not a PNG`);
  const [w, h] = i.sizes.split('x').map(Number);
  if (dim[0] !== w || dim[1] !== h) fail(`icon ${i.src} declared ${i.sizes}, actual ${dim.join('x')}`);
}
ok(`manifest valid, ${manifest.icons.length} icons verified (PNG + size)`);
const routes = ['/', '/curriculum', '/practice', '/stats', '/settings', '/tutorial', '/about', '/privacy'];
if (!manifest.shortcuts?.length) fail('no shortcuts');
for (const s of manifest.shortcuts) {
  const p = new URL(s.url, base).pathname;
  if (!routes.includes(p)) fail(`shortcut ${s.name} -> unknown route ${p}`);
  for (const i of s.icons || []) {
    const r = await ctx.request.get(new URL(i.src, `${base}/`).href);
    if (r.status() !== 200) fail(`shortcut icon ${i.src} -> ${r.status()}`);
  }
}
ok('shortcuts point to real routes');

// (b) service worker
await page.goto(base + '/', { waitUntil: 'networkidle' });
const active = await page.evaluate(async () => {
  const reg = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000)),
  ]);
  return !!reg.active;
}).catch((e) => fail('service worker not ready: ' + e.message));
if (!active) fail('service worker not active');
ok('service worker active');
await page.waitForTimeout(1500); // let precache settle

// (d) head links
for (const sel of ['link[rel="apple-touch-icon"]', 'link[rel="icon"]', 'link[rel="manifest"]']) {
  const hrefs = await page.$$eval(sel, (els) => els.map((e) => e.href));
  if (!hrefs.length) fail(`${sel} missing`);
  for (const h of hrefs) {
    const r = await ctx.request.get(h);
    if (r.status() !== 200) fail(`${sel} ${h} -> ${r.status()}`);
  }
}
ok('apple-touch-icon, favicon, manifest links resolve 200');

// (c) offline
await ctx.setOffline(true);
const nav = page.locator('nav[aria-label="Main"]');
for (const path of ['/', '/practice']) {
  await page.goto(base + path, { waitUntil: 'load' }).catch((e) => fail(`offline ${path}: ${e.message}`));
  await nav.waitFor({ timeout: 8000 }).catch(() => fail(`offline ${path}: tab bar not rendered`));
  ok(`offline ${path} renders`);
}
await page.reload({ waitUntil: 'load' });
await nav.waitFor({ timeout: 8000 }).catch(() => fail('offline reload: tab bar missing'));
await ctx.setOffline(false);

// (e) console + api
const real = errors.filter((e) => !/Failed to load resource.*(ERR_INTERNET_DISCONNECTED)/.test(e));
if (real.length) fail('console errors: ' + real.join(' | '));
if (apiCalls.length) fail('/api requests: ' + apiCalls.join(', '));
ok('zero console errors, zero /api requests');

await browser.close();
console.log('WAVE-B PASS');
