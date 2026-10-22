import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Zap, Target, Gauge } from 'lucide-react';
import { useTypingStore } from '../../lib/stores/useTypingStore';
import { resolveLayout } from '../../lib/customLayouts';
import { getAchievementById } from '../../lib/achievements';
import { playCompletionChime, playErrorThud, playKeyClick } from '../../lib/soundFx';
import { haptic } from '../../lib/haptics';
import { cn } from '../../lib/utils';
import TextDisplay from './TextDisplay';
import OneHandKeyboard from './OneHandKeyboard';
import ResultsSheet, { type ResultsData } from './ResultsSheet';
import { usePracticeSession, type CharOutcome, type SessionResult } from './usePracticeSession';
import { normalizeLessonText, resolveMirrorLayer } from './inputUtils';

export interface PracticeScreenProps {
  lessonId: string;
  title: string;
  text: string;
  targetWpm?: number;
  onBack: () => void;
  /** Next lesson in the same list, if any. */
  nextLesson?: { id: string; title: string } | null;
  onNext?: (lessonId: string) => void;
}

const iconBtn =
  'inline-flex h-12 w-12 items-center justify-center rounded-xl text-foreground touch-manipulation transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function humanizeId(id: string): string {
  return id.replace(/[-_]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function Pill({ icon, label, value, testId }: { icon: React.ReactNode; label: string; value: string; testId: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm" data-testid={testId}>
      <span aria-hidden="true" className="text-primary">
        {icon}
      </span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * Core practice screen: compact top bar, stats pills, text display and an
 * on-screen one-hand keyboard anchored to the bottom (thumb zone).
 *
 * Input model: every source (physical keydown, on-screen taps, ARTSEY chords)
 * funnels through `onChar` / `onBackspace`. There is deliberately no focused
 * textarea, so the OS keyboard never covers the app keyboard.
 */
export default function PracticeScreen({ lessonId, title, text: rawText, targetWpm, onBack, nextLesson, onNext }: PracticeScreenProps) {
  const text = useMemo(() => normalizeLessonText(rawText), [rawText]);

  const hand = useTypingStore((s) => s.handPreference);
  const layoutId = useTypingStore((s) => s.keyboardLayout);
  const customLayouts = useTypingStore((s) => s.customLayouts);
  const settings = useTypingStore((s) => s.accessibilitySettings);
  const systemReduce = useReducedMotion();
  const reduceMotion = Boolean(settings.reduceMotion || systemReduce);

  const layout = useMemo(() => resolveLayout(hand, layoutId, customLayouts), [hand, layoutId, customLayouts]);
  const mirrorLayout = useMemo(
    () => resolveMirrorLayer(hand, layoutId, customLayouts, layout),
    [hand, layoutId, customLayouts, layout],
  );
  const chorded = layoutId === 'artsey';
  const needsEnter = text.includes('\n');

  const [results, setResults] = useState<ResultsData | null>(null);
  const [flash, setFlash] = useState<{ ch: string; n: number } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const mainRef = useRef<HTMLDivElement>(null);
  const restartRef = useRef<HTMLButtonElement>(null);

  const handleComplete = useCallback(
    (r: SessionResult) => {
      const before = useTypingStore.getState();
      const prev = before.lessonProgress[lessonId];
      const xpBefore = before.xp;
      const achievementsBefore = new Set(before.unlockedAchievements);

      before.completeLesson(lessonId, r);

      const after = useTypingStore.getState();
      const unlocked = after.unlockedAchievements
        .filter((id) => !achievementsBefore.has(id))
        .map((id) => getAchievementById(id)?.title ?? humanizeId(id));

      playCompletionChime();
      haptic('success');
      setResults({
        wpm: r.wpm,
        accuracy: r.accuracy,
        errors: r.errors,
        timeMs: r.timeMs,
        xpEarned: Math.max(0, after.xp - xpBefore),
        badge: !prev ? 'first-clear' : r.wpm > prev.bestWpm ? 'new-best' : null,
        achievements: unlocked,
        targetWpm,
      });
      setAnnouncement(`Lesson complete. ${r.wpm} words per minute, ${r.accuracy} percent accuracy.`);
    },
    [lessonId, targetWpm],
  );

  const session = usePracticeSession(text, { onComplete: handleComplete });
  const { typed, status, stats } = session;
  const expected = typed.length < text.length ? text[typed.length] : undefined;
  const done = status === 'done';

  const feedback = useCallback((outcome: CharOutcome) => {
    if (outcome === 'correct') {
      playKeyClick();
      haptic('tap');
    } else if (outcome === 'wrong') {
      playErrorThud();
      haptic('error');
    }
  }, []);

  const onChar = useCallback(
    (ch: string) => {
      feedback(session.handleChar(ch));
    },
    [session, feedback],
  );
  const onAssist = useCallback(() => {
    feedback(session.handleChar('', true));
  }, [session, feedback]);
  const onBackspace = useCallback(() => {
    if (session.handleBackspace()) haptic('tap');
  }, [session]);
  const onInvalidChord = useCallback(() => feedback('wrong'), [feedback]);

  const restart = useCallback(() => {
    session.reset();
    setResults(null);
    setAnnouncement('');
  }, [session]);

  // Escape closes the results sheet; focus moves to the restart control once the page is active again.
  const dismissResults = useCallback(() => {
    setResults(null);
    window.setTimeout(() => restartRef.current?.focus(), 0);
  }, []);

  // Physical keyboard -> same handlers (latest-ref pattern keeps one listener).
  const latest = useRef({ onChar, onBackspace, expected, done });
  latest.current = { onChar, onBackspace, expected, done };
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const cur = latest.current;
      if (cur.done || e.isComposing) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
        return;
      }
      const altGr = e.getModifierState?.('AltGraph');
      if ((e.ctrlKey || e.metaKey || e.altKey) && !altGr) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        cur.onBackspace();
        setFlash((f) => ({ ch: '\b', n: (f?.n ?? 0) + 1 }));
        return;
      }
      if (e.key === 'Enter') {
        if (cur.expected === '\n') {
          e.preventDefault();
          if (!e.repeat) {
            cur.onChar('\n');
            setFlash((f) => ({ ch: '\n', n: (f?.n ?? 0) + 1 }));
          }
        }
        return;
      }
      if (e.key.length === 1) {
        e.preventDefault(); // stops space scrolling and browser quick-find on ' and /
        if (e.repeat) return;
        cur.onChar(e.key);
        setFlash((f) => ({ ch: e.key, n: (f?.n ?? 0) + 1 }));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Throttled screen-reader announcements (every ~5s while typing).
  const statsRef = useRef(stats);
  statsRef.current = stats;
  useEffect(() => {
    if (status !== 'running') return undefined;
    const id = window.setInterval(() => {
      const s = statsRef.current;
      setAnnouncement(`${s.wpm} words per minute, ${s.accuracy} percent accuracy, ${s.progress} percent complete`);
    }, 5000);
    return () => window.clearInterval(id);
  }, [status]);

  // Make the background inert while the results dialog is open.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    if (results) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  }, [results]);

  if (text.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
        <h1 className="text-xl font-semibold">Nothing to practice here yet</h1>
        <p className="max-w-sm text-muted-foreground">This lesson has no text. Pick another lesson to keep practicing.</p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          Go back
        </button>
      </div>
    );
  }

  const leftHand = hand === 'left';

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <div ref={mainRef} className="flex min-h-0 flex-1 flex-col">
        {/* Top bar: controls sit on the thumb side */}
        <header className={cn('flex shrink-0 items-center gap-1 px-2 pt-[max(0.25rem,env(safe-area-inset-top))]', leftHand ? 'flex-row' : 'flex-row-reverse')}>
          <div className={cn('flex items-center', leftHand ? 'flex-row' : 'flex-row-reverse')}>
            <button type="button" onClick={onBack} aria-label="Back" className={iconBtn}>
              <ArrowLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button ref={restartRef} type="button" onClick={restart} aria-label="Restart lesson" className={iconBtn}>
              <RotateCcw aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <h1 className={cn('min-w-0 flex-1 truncate px-2 text-base font-semibold', leftHand ? 'text-left' : 'text-left')}>{title}</h1>
        </header>

        {/* Progress hairline */}
        <div
          role="progressbar"
          aria-label="Lesson progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.progress}
          className="mx-4 h-1 shrink-0 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-150" style={{ width: `${stats.progress}%` }} />
        </div>

        {/* Stats pills */}
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 px-3 py-2" data-testid="practice-stats">
          {settings.showWPM && <Pill testId="stat-wpm" icon={<Zap className="h-4 w-4" />} value={String(stats.wpm)} label="WPM" />}
          {settings.showAccuracy && <Pill testId="stat-accuracy" icon={<Target className="h-4 w-4" />} value={`${stats.accuracy}%`} label="accuracy" />}
          <Pill testId="stat-progress" icon={<Gauge className="h-4 w-4" />} value={`${stats.progress}%`} label="done" />
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" data-testid="practice-live">
            {announcement}
          </div>
        </div>

        {/* Text */}
        <section aria-label="Typing area" className="flex min-h-0 flex-1 flex-col justify-center px-4 py-2">
          <p className="sr-only">Lesson text: {text.replace(/\n/g, ' ')}</p>
          <TextDisplay text={text} typed={typed} reduceMotion={reduceMotion} />
          <p className="mt-2 h-5 text-center text-xs text-muted-foreground" aria-hidden="true">
            {status === 'idle' && 'Start typing to begin. The timer starts on your first key.'}
            {status === 'paused' && 'Paused. Keep typing to resume.'}
          </p>
        </section>

        {/* Keyboard: bottom thumb zone */}
        <div className="shrink-0 border-t border-border bg-card/70 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
          <OneHandKeyboard
            layout={layout}
            mirrorLayout={mirrorLayout}
            chorded={chorded}
            hand={hand}
            expected={expected}
            showEnter={needsEnter}
            reduceMotion={reduceMotion}
            highlightNext={settings.highlightNextKey}
            disabled={done}
            flash={flash}
            onChar={onChar}
            onAssist={onAssist}
            onBackspace={onBackspace}
            onInvalidChord={onInvalidChord}
          />
        </div>
      </div>

      {results && (
        <ResultsSheet
          title={title}
          data={results}
          reduceMotion={reduceMotion}
          hasNext={Boolean(nextLesson && onNext)}
          nextTitle={nextLesson?.title}
          onAgain={restart}
          onNext={() => nextLesson && onNext?.(nextLesson.id)}
          onDone={onBack}
          onDismiss={dismissResults}
        />
      )}
    </div>
  );
}
