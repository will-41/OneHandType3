import { useTypingStore } from './stores/useTypingStore';

/**
 * Synthesized Web Audio feedback (no audio files). The AudioContext is created
 * lazily on the first call, which always happens inside a user gesture
 * (key press / tap), so autoplay policies are satisfied.
 */

type SoundKind = 'key' | 'error' | 'complete';

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
  return ctx;
}

/** Returns the master gain (0..~0.3) or 0 when this sound is disabled. */
function volumeFor(kind: SoundKind): number {
  const s = useTypingStore.getState().accessibilitySettings;
  if (!s.soundEnabled || !s.audioFeedback) return 0;
  if (kind === 'key' && !s.keyClickSoundEnabled) return 0;
  if (kind === 'error' && !s.errorSoundEnabled) return 0;
  if (kind === 'complete' && !s.completionSoundEnabled) return 0;
  const v = Math.min(100, Math.max(0, s.soundVolume ?? 70)) / 100;
  return v * 0.3; // keep everything modest
}

function tone(
  c: AudioContext,
  opts: { freq: number; start: number; dur: number; gain: number; type?: OscillatorType; endFreq?: number },
): void {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = opts.type ?? 'sine';
  const t0 = c.currentTime + opts.start;
  osc.frequency.setValueAtTime(opts.freq, t0);
  if (opts.endFreq) osc.frequency.exponentialRampToValueAtTime(opts.endFreq, t0 + opts.dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, opts.gain), t0 + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + opts.dur + 0.02);
}

/** Soft click on a correct key. */
export function playKeyClick(): void {
  const vol = volumeFor('key');
  if (!vol) return;
  const c = getContext();
  if (!c) return;
  tone(c, { freq: 1500, endFreq: 900, start: 0, dur: 0.035, gain: vol * 0.5, type: 'triangle' });
}

/** Low, muted thud on a mistake. */
export function playErrorThud(): void {
  const vol = volumeFor('error');
  if (!vol) return;
  const c = getContext();
  if (!c) return;
  tone(c, { freq: 160, endFreq: 90, start: 0, dur: 0.12, gain: vol * 0.9, type: 'sine' });
}

/** Pleasant ascending 3-note chime (C5, E5, G5). */
export function playCompletionChime(): void {
  const vol = volumeFor('complete');
  if (!vol) return;
  const c = getContext();
  if (!c) return;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    tone(c, { freq, start: i * 0.12, dur: 0.5, gain: vol * 0.8, type: 'sine' });
  });
}

/** Release the audio context (e.g. on screen unmount). */
export function disposeSoundFx(): void {
  if (ctx) {
    void ctx.close().catch(() => undefined);
    ctx = null;
  }
}
