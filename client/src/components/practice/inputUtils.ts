import { isCustomLayoutId, type CustomKeyboardLayout, type LayoutId } from '../../lib/customLayouts';
import {
  getChordMappings,
  getKeyboardLayout,
  type ChordMapping,
  type KeyboardKey,
  type KeyboardLayout,
} from '../../lib/keyboardLayouts';

/** Chord taps landing within this window (ms) combine into one chord. */
export const CHORD_WINDOW_MS = 60;

/** Normalise lesson text: unix newlines, no trailing whitespace. */
export function normalizeLessonText(raw: string | undefined | null): string {
  return (raw ?? '').replace(/\r\n?/g, '\n').replace(/\s+$/, '');
}

/**
 * AUTO-CASE decision: the one-hand layouts have no Shift key. When the tapped
 * key matches the expected character case-insensitively, we input the expected
 * character (so tapping "a" when "A" is expected types "A"). The physical
 * keyboard stays case-exact because it reports the real character.
 */
export function applyAutoCase(keyChar: string, expected: string | undefined): string {
  if (expected && keyChar.length === 1 && keyChar !== expected && keyChar.toLowerCase() === expected.toLowerCase()) {
    return expected;
  }
  return keyChar;
}

const KEY_NAMES: Record<string, string> = {
  ',': 'comma',
  '.': 'period',
  ';': 'semicolon',
  ':': 'colon',
  "'": 'apostrophe',
  '"': 'quote',
  '/': 'slash',
  '\\': 'backslash',
  '-': 'minus',
  '=': 'equals',
  '[': 'left bracket',
  ']': 'right bracket',
  '`': 'backtick',
  '?': 'question mark',
  '!': 'exclamation mark',
};

/** Visible label for a layout key. */
export function keyLabel(key: KeyboardKey): string {
  const raw = key.displayKey && key.displayKey.length <= 2 ? key.displayKey : key.key;
  return raw.length === 1 ? raw.toUpperCase() : raw;
}

/** Accessible name for a layout key, e.g. "Key A" or "Key comma". */
export function keyAriaLabel(key: KeyboardKey): string {
  const name = KEY_NAMES[key.key] ?? key.key.toUpperCase();
  return `Key ${name}`;
}

export function layoutKeys(layout: KeyboardLayout): KeyboardKey[] {
  return layout.flat().filter((k) => k.key !== ' ');
}

let artseyCache: ChordMapping[] | null = null;
function artseyMappings(): ChordMapping[] {
  artseyCache ??= getChordMappings('artsey') ?? [];
  return artseyCache;
}

/** The chord that produces `expected` on ARTSEY, if any. */
export function chordForChar(expected: string | undefined): ChordMapping | null {
  if (!expected) return null;
  const lower = expected.toLowerCase();
  return artseyMappings().find((m) => m.output === lower) ?? null;
}

/** Whether the on-screen keyboard can produce `expected` directly. */
export function isReachable(
  expected: string | undefined,
  layout: KeyboardLayout,
  chorded: boolean,
  mirror?: KeyboardLayout | null,
): boolean {
  if (!expected) return true;
  if (expected === ' ' || expected === '\n') return true;
  if (chorded) return chordForChar(expected) !== null;
  const lower = expected.toLowerCase();
  if (layoutKeys(layout).some((k) => k.key.toLowerCase() === lower)) return true;
  return mirror ? layoutKeys(mirror).some((k) => k.key.toLowerCase() === lower) : false;
}

/**
 * Mirror layer ("half-keyboard mirroring"): the other hand's half of the same
 * base layout with every row reversed, so a key under the same finger maps to
 * its mirror partner (QWERTY right hand: j<->f, k<->d, l<->s, ;<->a, u<->r).
 * For custom layouts only characters missing from the primary layer are added.
 * Chorded layouts (ARTSEY) have no mirror layer.
 */
export function resolveMirrorLayer(
  hand: 'left' | 'right',
  layoutId: LayoutId,
  customLayouts: readonly CustomKeyboardLayout[],
  primary: KeyboardLayout,
): KeyboardLayout | null {
  if (layoutId === 'artsey') return null;
  let base: Exclude<LayoutId, `custom-${string}`> = 'qwerty';
  let primaryHand = hand;
  const custom = isCustomLayoutId(layoutId) ? customLayouts.find((l) => l.id === layoutId) : undefined;
  if (isCustomLayoutId(layoutId)) {
    if (custom) {
      if (custom.baseLayout === 'artsey') return null;
      base = custom.baseLayout;
      primaryHand = custom.hand;
    }
  } else {
    base = layoutId;
  }
  const other = getKeyboardLayout(primaryHand === 'left' ? 'right' : 'left', base);
  const have = new Set(layoutKeys(primary).map((k) => k.key.toLowerCase()));
  const rows = other
    .map((row) =>
      [...row]
        .reverse()
        .filter((k) => k.key !== ' ')
        .filter((k) => !custom || !have.has(k.key.toLowerCase())),
    )
    .filter((row) => row.length > 0);
  return rows.length > 0 ? rows : null;
}

/** Printable name for a character, for messages and markers. */
export function charName(ch: string): string {
  if (ch === ' ') return 'space';
  if (ch === '\n') return 'enter';
  return ch;
}

export function formatDuration(ms: number): string {
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rest = Math.round(s - m * 60);
  return `${m}:${String(rest).padStart(2, '0')}`;
}
