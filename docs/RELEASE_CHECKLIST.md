# Release checklist (owner)

Work top to bottom. Tick as you go.

## 1. Name and identity
- [x] App name decided: **One-Type** (Play title "One-Type: One-Hand Typing"). Search found no registered "ONETYPE" mark; an unrelated iOS game "Typing games - OneType" exists, which the hyphenated name and descriptive title set apart. Before paid marketing, confirm on https://tmsearch.uspto.gov (classes 9 and 41).
- [ ] If the name or application id changes, follow "Changing the app id / name" in `docs/ANDROID_BUILD.md` **before** the first upload (the id is permanent after that). Update `docs/PLAY_LISTING.md` and regenerate screenshots if the name appears in the UI.

## 2. Accounts and build
- [ ] Create a Google Play Console developer account (one-time US$25 fee, identity verification): https://play.google.com/console/signup
- [ ] Make the repo public, or have a paid GitHub plan, so GitHub Pages can serve the privacy policy (see step 5).
- [ ] Add the 4 repo secrets and run the **Android release** workflow (`docs/ANDROID_BUILD.md`, route A). Download `onetype-release-aab`.
- [ ] Back up the upload keystore and passwords somewhere safe.

## 3. Create the app in Play Console
- [ ] Create app: name, default language English (US), App, Free, accept declarations.
- [ ] Keep **Play App Signing** enabled.

## 4. Store listing
- [ ] Paste title, short and full descriptions from `docs/PLAY_LISTING.md`.
- [ ] Upload `docs/store/icon-512.png`, `docs/store/feature-graphic.png`, the 7 `phone-*.png` and 2 `tablet7-*.png` screenshots.
- [ ] Set category Education, contact email, website.

## 5. Policy and App content
- [ ] Enable GitHub Pages (Settings > Pages > Source: GitHub Actions); run the **Deploy PWA to GitHub Pages** workflow; confirm https://will-41.github.io/OneHandType3/privacy loads in a private browser window. (Private repos need a paid GitHub plan for Pages; alternatives: make the repo public, or host the content of `PRIVACY.md` on any public HTTPS page and use that URL.)
- [ ] Enter the privacy policy URL.
- [ ] Data safety: answer exactly as in `docs/PLAY_LISTING.md` (no data collected or shared).
- [ ] Content rating questionnaire (all No, expect "Everyone").
- [ ] Target audience 13+, ads: No, app access: no login, other declarations.

## 6. Internal testing
- [ ] Testing > Internal testing > Create release > upload the `.aab` > add yourself as a tester > roll out.
- [ ] Install via the opt-in link on a **real phone** and check:
  - [ ] App icon looks right (round and adaptive masks); splash is dark with no white flash
  - [ ] Home > start a lesson > type with the on-screen keyboard; Mirror key works
  - [ ] Finish a lesson: results sheet, XP, Stats update
  - [ ] Learn shows all realms; Practice free typing works
  - [ ] Settings: change hand, layout, theme; toggle vibration (feel it) and sound
  - [ ] Keyboard builder: create, save, use a custom layout
  - [ ] Rotate to landscape and back; no layout breakage
  - [ ] Airplane mode: everything still works; kill and reopen: progress is kept
  - [ ] Back button navigates sensibly and exits from Home
  - [ ] TalkBack on: tabs and keys are announced
  - [ ] About and Privacy pages open

## 7. Production
- [ ] Google currently requires **new personal developer accounts** to run a **closed test with at least 12 testers opted in for 14 continuous days** before applying for production access. Organization accounts and accounts created earlier are generally exempt. Check the current rules: https://support.google.com/googleplay/android-developer/answer/14151465
- [ ] If required: Testing > Closed testing > create release with the same `.aab`, add 12+ testers (email list or Google Group), have them opt in and keep the app installed for 14 days.
- [ ] Apply for production access (Dashboard), then Production > Create release > upload `.aab` (bump versionCode if you rebuilt) > review and roll out.
- [ ] Review typically takes from a few hours to several days; fix anything Play flags.
