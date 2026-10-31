# Redesign: Ember Study

The visual layer was redesigned in October 2026. Nothing about how the app works changed: same screens, routes,
controls, settings, copy and behaviour. The five browser suites (including the WCAG 2.2 AA audit) pass unchanged.

## What changed

- **Palette**: a warm tonal ground (dark is the default), amber primary, slate-blue accent. All four theme scopes
  (`:root`, `.dark`, `.high-contrast`, `.dark.high-contrast`) keep their token names; values changed. Realm accents
  in `client/src/lib/theme.ts` are re-tuned for the new ground.
- **Type**: Atkinson Hyperlegible Next (text), Atkinson Hyperlegible Mono (key caps, typing text, figures) and
  Literata 500 (display, 24 and 32 px only), all SIL OFL 1.1 and bundled through `@fontsource`. Inter is removed.
  Scale 13, 14, 16, 18, 20, 24, 32 px; weights 400, 500, 700.
- **Signature, the mirror axis**: a 2 px rule on the inner edge of the live half keyboard (input tone while Mirror is
  off, primary while on). Full strength on the Lesson screen; quiet on Settings (tab-order strip), the Tutorial
  keyboard and the builder grid. `--mirror-axis` and `--key-height` are new tokens.
- **Key caps**: parchment tiles with a 3 px finger mark; the next key inverts (ground fill, primary legend, 2 px
  primary edge). No glow, pulse or hover lift.
- **Components**: one radius step down (8 px controls and cards, 6 px caps and badges, 16 px sheets and dialogs);
  hairline cards and lists instead of tiles, pills and coloured borders; opaque tab bar with a 3 px primary bar on the
  active tab; no blur; shadows only on the bottom sheet and the alert dialog.

## Files

Tokens: `client/src/index.css`, `tailwind.config.ts` (`font-display`). Primitives: `client/src/components/ui/*`.
Shell: `components/shell/*`. Lesson: `components/practice/*`. Screens: `client/src/pages/*`, `components/Tutorial.tsx`,
`components/RealmLessonNavigator.tsx`, `components/LessonBuilder.tsx`, `components/keyboard-builder/*`.

## App mark

`client/public/logo.svg`, `logo-maskable.svg` and `favicon.svg` follow the design: same rounded square, key cap and "1",
flat amber ground, key cap in the ground tone. `npm run icons` and `npm run android:icons` regenerate everything from them.
The Android adaptive background is amber. The splash stays dark, so it uses `ic_splash_foreground`, which carries the amber
behind the glyph; the launcher foreground would vanish on it. Play and iOS icons use the logo square without the keyline
inset, since those stores apply their own mask.

## Copy changes (the only ones)

- About credits now name Atkinson Hyperlegible and Literata instead of Inter, matching the bundled fonts.

## Checking

`bash run-gates.sh` serves the build and runs the five suites (set `PW_CHROMIUM` to a Chromium path; defaults to
Chrome on Windows). `e2e/store-screenshots.mjs` regenerates the store images from a seeded profile.
