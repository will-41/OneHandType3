import { useEffect } from 'react';
import { useTypingStore } from './stores/useTypingStore';

/**
 * Theme + one-hand mirror helpers.
 *
 * Palette lives in index.css as HSL triplets (`H S% L%`) on `:root` (light) and
 * `.dark` (dark). Tailwind reads them through `hsl(var(--token))`.
 */

export type HandSide = 'left' | 'right';

/** Unit accent colours (HSL triplets) keyed by curriculum unit id. */
export const UNIT_ACCENTS: Record<string, string> = {
  'unit-1-home-row': '24 90% 58%',
  'unit-2-common-words': '200 80% 58%',
  'unit-3-sentences': '145 55% 48%',
  'unit-4-numbers-symbols': '45 85% 56%',
  'unit-5-speed': '225 75% 66%',
  'unit-6-precision': '190 70% 56%',
  'unit-7-endurance': '10 80% 62%',
  'unit-8-technical': '175 65% 46%',
  'unit-9-mastery': '265 75% 72%',
  'unit-10-graduation': '48 95% 60%',
};

export const DEFAULT_UNIT_ACCENT = '252 90% 72%';

export function unitAccent(unitId: string): string {
  return `hsl(${UNIT_ACCENTS[unitId] ?? DEFAULT_UNIT_ACCENT})`;
}

export function unitAccentAlpha(unitId: string, alpha: number): string {
  return `hsl(${UNIT_ACCENTS[unitId] ?? DEFAULT_UNIT_ACCENT} / ${alpha})`;
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
