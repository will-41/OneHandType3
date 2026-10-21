import { useTypingStore } from './stores/useTypingStore';

export type HapticKind = 'tap' | 'error' | 'success';

const PATTERNS: Record<HapticKind, number | number[]> = {
  tap: 10,
  error: [30, 40, 30],
  success: [20, 30, 60],
};

/**
 * Fire a short vibration. Gated by the store's `hapticFeedback` accessibility
 * setting. This is the single seam for tactile feedback: a future Capacitor
 * Haptics plugin can be swapped in behind this function without touching callers.
 *
 * Note: `hapticFeedback` defaults to false in the store; the settings screen
 * owns that default and the toggle.
 */
export function haptic(kind: HapticKind): void {
  try {
    if (!useTypingStore.getState().accessibilitySettings.hapticFeedback) return;
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    navigator.vibrate(PATTERNS[kind]);
  } catch {
    // Vibration is best-effort and may be blocked by the browser.
  }
}
