# Start Here — what's done, and the few things only you can do

The app is built, tested, and packaged. Every step below is something that legally or
physically requires **you** (your identity, your accounts, your money). Each takes minutes.

## What you have

- **The app** (`client/`): one-handed typing trainer. 10-unit skill path with checkpoints, mastery stars and a weak-key coach
  (29 lessons) + 25 practice lessons, 8 one-hand keyboard layouts with a Mirror key, ARTSEY
  chords, a custom keyboard builder, custom lessons, fair achievements, onboarding tour,
  dark/light mode, high contrast, text sizes, left-hand mirror mode. Works fully offline.
- **No server, no database, no accounts, no ads, no tracking.** Nothing to host or pay for.
  All progress stays on the user's device. (The old Neon database is no longer used — you
  can delete it from your Neon dashboard.)
- **Android app** (`android/`), built automatically by GitHub on every push.
- **Store kit** (`docs/store/`): screenshots, feature graphic, 512 icon.
- **Drafted listing** (`docs/PLAY_LISTING.md`): title, descriptions, data-safety and
  content-rating answers — copy/paste ready.
- **Legal**: MIT license, privacy policy (in-app + `PRIVACY.md`), third-party license audit
  (all permissive, no copyleft), original icon and content. Git history scrubbed.

## Your steps, in order

1. **Name: done — "One-Type"** (Play title "One-Type: One-Hand Typing"). No registered
   "ONETYPE" trademark turned up; an unrelated iOS game "Typing games - OneType" exists, and
   the hyphen plus descriptive title set you apart. Optional: confirm yourself at
   https://tmsearch.uspto.gov (classes 9 and 41) before paid marketing — I couldn't reach the
   USPTO database from my environment.
2. **Save the signing keys** (`One-Type-Signing-Keys.zip`) in a password manager or
   encrypted folder. **Never commit, email, or lose them.** The repo is **public**, so these
   must never go into it.
3. **Add 4 GitHub secrets** — github.com/will-41/OneHandType3 → Settings → Secrets and
   variables → Actions → New repository secret. Names and values are in the zip's
   `SECRETS-HOW-TO.txt`.
4. **Merged to `main`: done.**
5. **Turn on GitHub Pages (free — the repo is public)** — Settings → Pages → Source:
   "GitHub Actions". Then re-run the "Deploy to GitHub Pages" workflow once. Your privacy URL:
   `https://will-41.github.io/OneHandType3/privacy`.
6. **Build the store file** — Actions → "Android release" → Run workflow → download the
   `.aab` artifact.
7. **When you're ready:** Google Play Console ($25 one-time) → follow
   `docs/RELEASE_CHECKLIST.md`. New personal accounts need 12 testers for 14 days first.

Costs: see `docs/COSTS.md`. Competition: see `docs/COMPETITION.md`.

## Try it right now

- **Browser:** `npm install && npm run dev`, open the URL on your phone or computer.
- **Android phone:** repo → Actions → latest "CI" run → download `onetype-debug-apk` →
  install the APK on your phone (allow "install unknown apps").

## Quality gates (run automatically on every push)

TypeScript strict (0 errors) · production build · 5 browser test suites: navigation &
persistence, practice (physical + tap-only typing, Mirror, ARTSEY chords), keyboard builder,
offline PWA, and accessibility (WCAG 2.2 AA, axe, 0 serious issues on 10 screens in both
themes) · Android APK compile.
