import { useEffect } from 'react';
import { useTypingStore } from './stores/useTypingStore';

/**
 * Theme + one-hand mirror helpers.
 *
 * Palette lives in index.css as HSL triplets (`H S% L%`) on `:root` (light) and
 * `.dark` (dark). Tailwind reads them through `hsl(var(--token))`.
 */

export type HandSide = 'left' | 'right';

/** Region accent colours (HSL triplets) keyed by curriculum level id. */
export const REGION_ACCENTS: Record<string, string> = {
  'level-1-hearthlands': '19 81% 69%',
  'level-2-silverflow': '194 55% 70%',
  'level-3-bloomvale': '109 39% 65%',
  'level-4-gildmoor': '41 74% 65%',
  'level-5-stormcrest': '211 63% 69%',
  'level-6-skyreach': '182 51% 72%',
  'level-7-sunscar': '33 70% 68%',
  'level-8-tidebreak': '165 49% 61%',
  'level-9-frostmarch': '234 47% 80%',
  'level-10-crown-of-keys': '289 54% 76%',
};

export const DEFAULT_REGION_ACCENT = '33 82% 66%';

export function regionAccent(levelId: string): string {
  return `hsl(${REGION_ACCENTS[levelId] ?? DEFAULT_REGION_ACCENT})`;
}

export function regionAccentAlpha(levelId: string, alpha: number): string {
  return `hsl(${REGION_ACCENTS[levelId] ?? DEFAULT_REGION_ACCENT} / ${alpha})`;
}

/**
 * Mirror helpers. Left-handed mode flips horizontal ordering of the shell and
 * aligns prominent actions to the left edge (thumb side of the left hand).
 */
export function mirrorRow(hand: HandSide): string {
  return hand === 'left' ? 'flex-row-reverse' : 'flex-row';
}

export function mirrorJustify(hand: HandSide): string {
  return hand === 'left' ? 'justify-start' : 'justify-end';
}

export function mirrorText(hand: HandSide): string {
  return hand === 'left' ? 'text-left' : 'text-right';
}

export function mirrorSelf(hand: HandSide): string {
  return hand === 'left' ? 'self-start' : 'self-end';
}

/** Applies store-driven display settings to <html>. Mount once in App. */
export function useDocumentTheme(): void {
  const themeMode = useTypingStore((s) => s.themeMode);
  const hand = useTypingStore((s) => s.handPreference);
  const highContrast = useTypingStore((s) => s.accessibilitySettings.highContrast);
  const largeText = useTypingStore((s) => s.accessibilitySettings.largeText);
  const fontSize = useTypingStore((s) => s.accessibilitySettings.fontSize);
  const reduceMotion = useTypingStore((s) => s.accessibilitySettings.reduceMotion);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode === 'dark');
    root.style.colorScheme = themeMode;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', themeMode === 'dark' ? '#16120d' : '#f8f4ec');
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-hand', hand);
  }, [hand]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('large-text', largeText);
    root.classList.toggle('reduce-motion', reduceMotion);
    root.style.fontSize = `${fontSize || 16}px`;
  }, [highContrast, largeText, fontSize, reduceMotion]);
}
