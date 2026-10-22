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
  'level-1-hearthlands': '24 90% 58%',
  'level-2-silverflow': '200 80% 58%',
  'level-3-bloomvale': '145 55% 48%',
  'level-4-gildmoor': '45 85% 56%',
  'level-5-stormcrest': '225 75% 66%',
  'level-6-skyreach': '190 70% 56%',
  'level-7-sunscar': '10 80% 62%',
  'level-8-tidebreak': '175 65% 46%',
  'level-9-frostmarch': '265 75% 72%',
  'level-10-crown-of-keys': '48 95% 60%',
};

export const DEFAULT_REGION_ACCENT = '252 90% 72%';

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
    meta?.setAttribute('content', themeMode === 'dark' ? '#0e1020' : '#faf7f0');
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
