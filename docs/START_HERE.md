# Start Here — what's done, and the few things only you can do

The app is built, tested, and packaged. Every step below is something that legally or
physically requires **you** (your identity, your accounts, your money). Each takes minutes.

## What you have

- **The app** (`client/`): one-handed typing trainer. 10-realm "Realm of Keys" curriculum
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

1. **Pick the final app name.** "OneType" is a placeholder. Search it before you commit:
   USPTO trademark search (https://tmsearch.uspto.gov), the Play Store, and the App Store.
   Tell me the name and I'll swap it everywhere (app, store kit, app id).
2. **Save the signing key** I sent you (`upload-keystore.jks` + its password) somewhere
   safe — a password manager. **Never commit it, email it, or lose it.** (If lost, Google's
   Play App Signing lets you request a reset, but it's slow.)
3. **Add 4 GitHub secrets** — repo → Settings → Secrets and variables → Actions:
   | Secret | Value |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | contents of `upload-keystore.jks.base64` |
   | `ANDROID_KEYSTORE_PASSWORD` | the password from `keystore-password.txt` |
   | `ANDROID_KEY_ALIAS` | `upload` |
   | `ANDROID_KEY_PASSWORD` | same password as above |
4. **Merge to `main`** (I worked on branch `claude/jolly-babbage-wh3d9u` — ask me to open a
   pull request, or merge it yourself).
5. **Turn on GitHub Pages** — repo → Settings → Pages → Source: "GitHub Actions". This
   publishes the privacy policy URL Google requires:
   `https://will-41.github.io/OneHandType3/privacy`.
   ⚠️ Pages on a **private** repo needs a paid GitHub plan; otherwise make the repo public
   (the code is MIT-licensed and contains no secrets).
6. **Build the store file** — repo → Actions → "Android release" → Run workflow. Download
   the `.aab` from the run's artifacts.
7. **Google Play Console** — create a developer account ($25 one-time), then follow
   `docs/RELEASE_CHECKLIST.md`. Google currently requires new personal accounts to run a
   closed test with 12+ testers for 14 days before production — start that early.

## Try it right now

- **Browser:** `npm install && npm run dev`, open the URL on your phone or computer.
- **Android phone:** repo → Actions → latest "CI" run → download `onetype-debug-apk` →
  install the APK on your phone (allow "install unknown apps").

## Quality gates (run automatically on every push)

TypeScript strict (0 errors) · production build · 5 browser test suites: navigation &
persistence, practice (physical + tap-only typing, Mirror, ARTSEY chords), keyboard builder,
offline PWA, and accessibility (WCAG 2.2 AA, axe, 0 serious issues on 10 screens in both
themes) · Android APK compile.
