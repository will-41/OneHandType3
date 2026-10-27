# Google Play listing copy (paste into Play Console)

Final app name: **One-Type**. Play title below sets it apart from the unrelated iOS game "Typing games - OneType".

## Store listing

- **App name (max 30):** `One-Type: One-Hand Typing` (24)
- **Short description (max 80):** `Learn to type fast with one hand. Free, offline, no ads, no accounts.` (68)
- **Category:** Education (app type: App)
- **Tags:** Education, Typing, Accessibility, Productivity (choose the closest available in Console)
- **Contact email:** wilmymoise@gmail.com
- **Website:** https://will-41.github.io/OneHandType3/
- **Privacy policy URL:** https://will-41.github.io/OneHandType3/privacy
- **Default language:** English (United States)

### Full description (max 4000)

```
One-Type teaches you to type quickly and comfortably with one hand - whether you type one-handed because of an injury, a disability, amputation, a stroke, or simply because your other hand is busy.

Everything runs on your phone. No account, no ads, no tracking, no internet needed.

LEARN AT YOUR OWN PACE
- A 10-unit skill path takes you from the first home-row key to full sentences and advanced text
- Short lessons with instant feedback on speed (WPM), accuracy and mistakes
- Earn XP, levels and achievements for effort and improvement - no dark patterns
- A gentle daily goal with a built-in rest day — no guilt, no nagging
- Practice mode for free typing, plus your own custom lessons

LAYOUTS BUILT FOR ONE HAND
- 8 one-hand keyboard layouts, including QWERTY with a Mirror key (hold to type the other hand's letters), and ARTSEY chords
- Left-hand and right-hand modes, with the whole interface mirrored for your side
- Keyboard builder: design your own layout, test-drive it, save it, export and import it as a file

SEE YOUR PROGRESS
- Stats for best WPM, accuracy, practice time and your most common mistakes
- Per-lesson bests so you can beat your own record

ACCESSIBILITY FIRST
- Large touch targets, high-contrast dark theme, reduced-motion support
- Works with TalkBack and keyboard navigation
- Optional sound and vibration feedback you can turn off
- Works in portrait and landscape; physical keyboards are supported too

PRIVATE BY DESIGN
- All progress, settings and custom layouts stay on your device
- The app collects no personal data and has no ads, no in-app purchases and no sign-in
- Delete everything at any time by clearing app storage or uninstalling

One-Type is free. Feedback and ideas are welcome at wilmymoise@gmail.com.
```

(about 1,500 characters; limit 4000)

## Graphics (upload from `docs/store/`)

| Console slot | File | Size |
|---|---|---|
| App icon | `docs/store/icon-512.png` | 512x512 |
| Feature graphic | `docs/store/feature-graphic.png` | 1024x500 |
| Phone screenshots (upload all 7, in order) | `docs/store/screenshots/phone-1-home.png` ... `phone-7-settings.png` | 1080x2340 |
| 7-inch tablet screenshots | `docs/store/screenshots/tablet7-1-home.png`, `tablet7-2-practice.png` | 1200x1920 |

Regenerate with `npm run build && npx vite preview --port 4173` then `npm run store:screenshots`. The 10-inch tablet slot is optional and can be skipped.

## App content declarations

- **Ads:** No, the app contains no ads.
- **In-app purchases / paid app:** Free, no in-app purchases.
- **Target audience and content:** Age group **13 and over** (do not select the under-13 groups; this avoids the Designed for Families program obligations). The app is suitable for everyone, but do not opt into Families.
- **App access:** All functionality available without login; no special instructions needed.
- **News app / government app / financial features / health features:** No to all.
- **Advertising ID:** Not used (declare "No"; the app declares no AD_ID permission and contains no ad SDK).

### Data safety form

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **No** |
| Is all of the user data collected by your app encrypted in transit? | Not applicable - nothing is collected or transmitted (Console hides this when you answer No to collection) |
| Do you provide a way for users to request data deletion? | Not applicable; all data is on-device. In the privacy policy: users can delete everything by clearing app storage or uninstalling. |
| Security practices | Data is stored only on the device; no data leaves the device |

Notes for your own records: the manifest includes `INTERNET` only because Capacitor serves the bundled app from a local `https://localhost` origin. The app code makes no network requests, loads no remote scripts, fonts or analytics, and uses no third-party SDKs that collect data. Progress is stored in the WebView's local storage on the device.

### Content rating (IARC questionnaire)

Category: **Utility, Productivity, Communication, or Other** (educational tool, not a game). Answer **No** to every question:
violence, blood, fear/horror, sexual content or nudity, profanity/crude humor, controlled substances (drugs, alcohol, tobacco), gambling/simulated gambling, user-generated content shared with other users, user-to-user interaction/communication, sharing of the user's location, digital purchases, and unrestricted internet access.
Expected result: **IARC Everyone / PEGI 3 / ESRB Everyone**.

(The keyboard builder lets users export/import layout files; this is local file exchange, not in-app sharing between users.)
