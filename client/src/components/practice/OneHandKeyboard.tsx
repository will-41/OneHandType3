import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Delete, FlipHorizontal2, Lock } from 'lucide-react';
import { findChordForKeys, type KeyboardKey, type KeyboardLayout } from '../../lib/keyboardLayouts';
import { cn } from '../../lib/utils';
import {
  CHORD_WINDOW_MS,
  applyAutoCase,
  charName,
  chordForChar,
  isReachable,
  keyAriaLabel,
  keyLabel,
  layoutKeys,
} from './inputUtils';

interface OneHandKeyboardProps {
  /** Layout from resolveLayout(hand, layoutId, customLayouts). */
  layout: KeyboardLayout;
  /** Mirror layer (other hand's half, rows reversed); null when not applicable (chorded layouts). */
  mirrorLayout: KeyboardLayout | null;
  /** True when the selected layout is the ARTSEY chorded layout. */
  chorded: boolean;
  hand: 'left' | 'right';
  /** Next expected character (undefined when finished). */
  expected: string | undefined;
  /** Whether to render an Enter key (lesson text contains newlines). */
  showEnter: boolean;
  reduceMotion: boolean;
  /** Highlight the next expected key (store setting `highlightNextKey`). */
  highlightNext: boolean;
  disabled?: boolean;
  /** Physical key press echo, so on-screen keys flash too. */
  flash?: { ch: string; n: number } | null;
  onChar: (ch: string) => void;
  /** Insert the expected char for keys the layout cannot produce (not counted as a keystroke). */
  onAssist: () => void;
  onBackspace: () => void;
  /** A chord that matched nothing. */
  onInvalidChord: () => void;
}

const FINGER_TOKEN: Record<string, string> = {
  pinky: '--chart-5',
  ring: '--chart-3',
  middle: '--chart-4',
  index: '--chart-2',
  thumb: '--chart-1',
};

const KEY_BASE =
  'relative flex h-12 min-h-[48px] min-w-[44px] select-none items-center justify-center rounded-xl border border-border bg-card font-mono text-lg font-semibold text-card-foreground touch-manipulation transition-[transform,background-color,box-shadow] duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50';
const KEY_PRESSED = 'bg-secondary';
const KEY_NEXT =
  'border-primary bg-primary/15 text-foreground shadow-[0_0_0_2px_hsl(var(--primary)),0_0_16px_hsl(var(--primary)/0.55)]';

/**
 * On-screen keyboard for one-handed typing. Renders whatever layout it is
 * given (built-in or custom), so it never needs to know about layout ids.
 *
 * Input is handled on pointerdown for latency; keyboard-activated clicks
 * (click with detail === 0, e.g. Tab + Enter/Space) are handled separately.
 */
export default function OneHandKeyboard({
  layout,
  mirrorLayout,
  chorded,
  hand,
  expected,
  showEnter,
  reduceMotion,
  highlightNext,
  disabled,
  flash,
  onChar,
  onAssist,
  onBackspace,
  onInvalidChord,
}: OneHandKeyboardProps) {
  const [pressed, setPressed] = useState<ReadonlySet<string>>(new Set());

  // Mirror: 'once' = next character key only, 'locked' = until tapped again.
  const [mirrorMode, setMirrorMode] = useState<'off' | 'once' | 'locked'>('off');
  const lastMirrorTap = useRef(0);
  const mirrorActive = mirrorMode !== 'off' && mirrorLayout !== null;
  const shown = mirrorActive && mirrorLayout ? mirrorLayout : layout;

  const onMirrorTap = () => {
    if (!mirrorLayout) return;
    const now = Date.now();
    setMirrorMode((m) => {
      if (m === 'locked') return 'off';
      if (m === 'once') return now - lastMirrorTap.current < 300 ? 'locked' : 'off';
      return 'once';
    });
    lastMirrorTap.current = now;
  };

  const rows = useMemo(
    () =>
      shown
        .map((row) => row.filter((k) => k.key !== ' '))
        .filter((row) => row.length > 0),
    [shown],
  );

  const chord = chorded ? chordForChar(expected) : null;
  const nextKeys = useMemo(() => {
    const set = new Set<string>();
    if (!expected) return set;
    if (chorded) {
      chord?.keys.forEach((k) => set.add(k));
    } else if (expected !== ' ' && expected !== '\n') {
      set.add(expected.toLowerCase());
    }
    return set;
  }, [expected, chorded, chord]);

  const reachable = useMemo(
    () => isReachable(expected, layout, chorded, mirrorLayout),
    [expected, layout, chorded, mirrorLayout],
  );
  // Which layer holds the expected character (the displayed layer wins when both do).
  const hasChar = (l: KeyboardLayout | null) =>
    Boolean(expected && l && layoutKeys(l).some((k) => k.key.toLowerCase() === expected.toLowerCase()));
  const onShown = hasChar(shown);
  const mirrorHint =
    !chorded && mirrorLayout !== null && expected && expected !== ' ' && expected !== '\n' && !onShown && reachable;
  const needsUpper = Boolean(expected && expected !== expected.toLowerCase() && expected === expected.toUpperCase());

  const markPressed = useCallback((id: string, on: boolean) => {
    setPressed((prev) => {
      if (prev.has(id) === on) return prev;
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const releaseSoon = useCallback(
    (id: string) => {
      window.setTimeout(() => markPressed(id, false), 80);
    },
    [markPressed],
  );

  // Echo physical key presses.
  useEffect(() => {
    if (!flash) return undefined;
    const id = flash.ch === ' ' ? 'space' : flash.ch === '\n' ? 'enter' : flash.ch === '\b' ? 'backspace' : flash.ch.toLowerCase();
    markPressed(id, true);
    const t = window.setTimeout(() => markPressed(id, false), 80);
    return () => window.clearTimeout(t);
  }, [flash, markPressed]);

  // ---- ARTSEY chord assembly -------------------------------------------------
  const chordKeysRef = useRef<Set<string>>(new Set());
  const chordTimerRef = useRef<number | null>(null);
  const expectedRef = useRef(expected);
  expectedRef.current = expected;
  const cbRef = useRef({ onChar, onInvalidChord });
  cbRef.current = { onChar, onInvalidChord };

  const flushChord = useCallback(() => {
    chordTimerRef.current = null;
    const keys = Array.from(chordKeysRef.current);
    chordKeysRef.current = new Set();
    if (keys.length === 0) return;
    const match = findChordForKeys(keys, 'artsey');
    if (match) cbRef.current.onChar(applyAutoCase(match.output, expectedRef.current));
    else cbRef.current.onInvalidChord();
  }, []);

  useEffect(
    () => () => {
      if (chordTimerRef.current !== null) window.clearTimeout(chordTimerRef.current);
    },
    [],
  );

  const addChordKey = (k: KeyboardKey) => {
    chordKeysRef.current.add(k.key);
    if (chordTimerRef.current === null) {
      chordTimerRef.current = window.setTimeout(flushChord, CHORD_WINDOW_MS);
    }
  };

  const pressLayoutKey = (k: KeyboardKey) => {
    if (chorded) addChordKey(k);
    else {
      onChar(applyAutoCase(k.key, expected));
      if (mirrorMode === 'once') setMirrorMode('off');
    }
  };

  // ---- Backspace hold-to-repeat -----------------------------------------------
  const repeatRef = useRef<{ delay?: number; interval?: number }>({});
  const stopRepeat = useCallback(() => {
    if (repeatRef.current.delay) window.clearTimeout(repeatRef.current.delay);
    if (repeatRef.current.interval) window.clearInterval(repeatRef.current.interval);
    repeatRef.current = {};
  }, []);
  useEffect(() => stopRepeat, [stopRepeat]);
  const onBackspaceRef = useRef(onBackspace);
  onBackspaceRef.current = onBackspace;

  const keyHandlers = (id: string, action: () => void, repeat = false) => ({
    onMouseDown: (e: React.MouseEvent) => e.preventDefault(), // keep focus off the key
    onPointerDown: (e: React.PointerEvent) => {
      if (disabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
      markPressed(id, true);
      action();
      if (repeat) {
        stopRepeat();
        repeatRef.current.delay = window.setTimeout(() => {
          repeatRef.current.interval = window.setInterval(() => onBackspaceRef.current(), 70);
        }, 420);
      }
    },
    onPointerUp: () => {
      stopRepeat();
      releaseSoon(id);
    },
    onPointerCancel: () => {
      stopRepeat();
      releaseSoon(id);
    },
    onPointerLeave: () => {
      stopRepeat();
      releaseSoon(id);
    },
    onClick: (e: React.MouseEvent) => {
      // Pointer clicks were handled on pointerdown; only keyboard activation (detail 0) lands here.
      if (e.detail === 0 && !disabled) action();
    },
  });

  const motionClass = (id: string) => (pressed.has(id) ? (reduceMotion ? KEY_PRESSED : `${KEY_PRESSED} scale-95`) : '');

  const renderKey = (k: KeyboardKey) => {
    const id = k.key.toLowerCase();
    const isNext = highlightNext && nextKeys.has(id) && !disabled;
    const token = k.finger ? FINGER_TOKEN[k.finger] : undefined;
    return (
      <button
        key={`${k.row}-${k.position}-${k.key}`}
        type="button"
        aria-label={keyAriaLabel(k)}
        data-key={k.key}
        data-layer={mirrorActive ? 'mirror' : 'primary'}
        data-next={isNext ? 'true' : undefined}
        disabled={disabled}
        className={cn(KEY_BASE, 'flex-1 basis-[44px] max-w-[76px]', motionClass(id), isNext && KEY_NEXT)}
        style={
          !isNext && token ? { boxShadow: `inset 0 -3px 0 hsl(var(${token}) / 0.35)` } : undefined
        }
        {...keyHandlers(id, () => pressLayoutKey(k))}
      >
        {keyLabel(k)}
        {isNext && needsUpper && !chorded && (
          <span aria-hidden="true" className="absolute right-1 top-0.5 text-[0.65rem] font-bold text-primary">
            {'⇧'}
          </span>
        )}
      </button>
    );
  };

  const spaceNext = highlightNext && expected === ' ' && !disabled;
  const enterNext = highlightNext && expected === '\n' && !disabled;

  const bottomRow = (
    <div className={cn('flex gap-1.5', hand === 'left' ? 'flex-row' : 'flex-row-reverse')}>
      {mirrorLayout && (
        <button
          type="button"
          aria-label="Mirror keyboard"
          aria-pressed={mirrorMode !== 'off'}
          data-testid="mirror-key"
          data-mirror={mirrorMode}
          data-next={mirrorHint && highlightNext && !disabled ? 'true' : undefined}
          disabled={disabled}
          className={cn(
            KEY_BASE,
            'flex-[1.3] flex-col gap-0 text-[0.7rem] leading-tight',
            mirrorMode !== 'off' ? 'border-primary bg-primary text-primary-foreground' : 'bg-secondary',
            mirrorHint && highlightNext && !disabled && KEY_NEXT,
            motionClass('mirror'),
          )}
          {...keyHandlers('mirror', onMirrorTap)}
        >
          <span className="relative flex items-center">
            <FlipHorizontal2 aria-hidden="true" className="h-5 w-5" />
            {mirrorMode === 'locked' && <Lock aria-hidden="true" data-testid="mirror-lock" className="absolute -right-3 -top-2 h-3 w-3" />}
          </span>
          <span aria-hidden="true">Mirror</span>
        </button>
      )}
      <button
        type="button"
        aria-label="Space"
        data-next={spaceNext ? 'true' : undefined}
        disabled={disabled}
        className={cn(KEY_BASE, 'flex-[3] text-sm', motionClass('space'), spaceNext && KEY_NEXT)}
        {...keyHandlers('space', () => onChar(' '))}
      >
        <span aria-hidden="true" className="tracking-widest">
          space
        </span>
      </button>
      {showEnter && (
        <button
          type="button"
          aria-label="Enter"
          data-next={enterNext ? 'true' : undefined}
          disabled={disabled}
          className={cn(KEY_BASE, 'flex-1', motionClass('enter'), enterNext && KEY_NEXT)}
          {...keyHandlers('enter', () => onChar('\n'))}
        >
          <CornerDownLeft aria-hidden="true" className="h-5 w-5" />
        </button>
      )}
      <button
        type="button"
        aria-label="Backspace"
        disabled={disabled}
        className={cn(KEY_BASE, 'flex-1 bg-muted', motionClass('backspace'))}
        {...keyHandlers('backspace', onBackspace, true)}
      >
        <Delete aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );

  const keyCount = layoutKeys(shown).length;

  return (
    <div
      data-testid="onscreen-keyboard"
      data-key-count={keyCount}
      role="group"
      aria-label={chorded ? 'On-screen chord keyboard' : 'On-screen keyboard'}
      className="mx-auto flex w-full max-w-xl flex-col gap-1.5"
    >
      {chorded && (
        <p
          data-testid="chord-hint"
          className="rounded-lg bg-primary/10 px-3 py-1.5 text-center text-sm text-foreground"
        >
          {!expected ? null : chord ? (
            <>
              Press together:{' '}
              <strong className="font-mono text-primary">
                {chord.keys.map((k) => k.toUpperCase()).join(' + ')}
              </strong>{' '}
              for <span className="font-mono">{charName(expected)}</span>
            </>
          ) : reachable ? (
            <>Tap Space or Enter</>
          ) : (
            <>
              No chord for <span className="font-mono">{charName(expected)}</span>. Use Insert below.
            </>
          )}
        </p>
      )}

      {mirrorHint && expected && (
        <p data-testid="mirror-caption" className="text-center text-xs text-muted-foreground">
          {mirrorActive ? 'Mirror is on' : 'Mirror'} for <span className="font-mono font-bold text-primary">{charName(expected)}</span>
          {mirrorActive ? ': tap Mirror to switch back' : ''}
        </p>
      )}

      <style>{`@keyframes kb-flip { from { transform: rotateY(90deg); opacity: .3; } to { transform: rotateY(0); opacity: 1; } }`}</style>
      <div
        key={mirrorActive ? 'mirror' : 'primary'}
        className="flex flex-col gap-1.5"
        style={!reduceMotion ? { animation: 'kb-flip 160ms ease-out' } : undefined}
      >
        {rows.map((row, ri) => (
          <div key={ri} className="flex flex-wrap justify-center gap-1.5">
            {row.map(renderKey)}
          </div>
        ))}
      </div>

      {!reachable && expected && (
        <button
          type="button"
          data-testid="assist-key"
          aria-label={`Insert ${charName(expected)} (not available on this layout)`}
          disabled={disabled}
          onClick={onAssist}
          className="min-h-[48px] rounded-xl border border-dashed border-primary px-3 text-sm font-medium text-primary touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Insert <span className="font-mono font-bold">{charName(expected)}</span>
          <span className="ml-1 text-muted-foreground">(not on this layout)</span>
        </button>
      )}

      {bottomRow}
    </div>
  );
}
