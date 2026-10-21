# Owner Legal & Store Checklist

## 1. Final app name (do this before publishing)
- [ ] Trademark search: [USPTO Trademark Search](https://tmsearch.uspto.gov) for "OneType" and close variants (typing, software, education classes 9, 41).
- [ ] Search Google Play and the App Store for the name and similar names.
- [ ] Check domain and GitHub/social handle availability.
- [ ] If renaming: replace "OneType" in README.md, PRIVACY.md, THIRD_PARTY_NOTICES.md, AboutPage.tsx, PrivacyPage.tsx, plus the manifest, index.html title, and any in-app strings.
- [ ] Note: "OneType" is only a working title; this is not legal advice. Consider a trademark attorney if you plan to register.

## 2. Google Play
- [ ] Create a Google Play developer account (one-time registration fee; identity verification required).
- [ ] Check current Play requirements for new personal accounts (e.g. closed testing before production) in the Play Console help.
- [ ] Provide a **public privacy policy URL**. Play requires a URL, not just in-app text.
  - Option: enable GitHub Pages and publish PRIVACY.md (or the deployed app's `/privacy` route if hosted publicly).
  - Use the same effective date and contact as PRIVACY.md.

## 3. Content rating questionnaire (IARC)
- Category: education / utility app.
- User-generated content: custom layouts and lessons are created by the user and **never leave the device**; no sharing or user interaction.
- No violence, sexual content, gambling, controlled substances, or location sharing.
- No ads, no purchases, no accounts.
- Expected result: lowest age rating. Answer honestly in the actual questionnaire.

## 4. Data safety form (draft answers)
| Question | Answer |
|---|---|
| Does the app collect or share any required user data types? | No |
| Data collected | None |
| Data shared with third parties | None |
| Is all data processed on-device only? | Yes (progress and settings in local storage) |
| Is data encrypted in transit? | Not applicable: the app makes no network requests |
| Can users request data deletion? | Yes: clear app data or uninstall; nothing is held on any server |
| Ads | No |
| In-app purchases | No |
| Account creation | None |
| Families / children | No data collected from anyone |

Re-verify these answers if any network feature, SDK, or analytics is ever added.

## 5. Repository hygiene
- [x] MIT LICENSE present (Copyright (c) 2026 Wilmy Moise).
- [x] THIRD_PARTY_NOTICES.md lists production dependency licenses (all permissive; audited 2026-10-21).
- [ ] Re-run `npx license-checker --production --summary` after dependency changes.
