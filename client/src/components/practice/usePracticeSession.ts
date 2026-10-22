import { useCallback, useEffect, useRef, useState } from 'react';

export type SessionStatus = 'idle' | 'running' | 'paused' | 'done';
export type CharOutcome = 'correct' | 'wrong' | 'complete' | 'ignored';

export interface SessionStats {
  wpm: number;
  accuracy: number;
  errors: number;
  /** 0..100 */
  progress: number;
  timeMs: number;
}

export interface SessionResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeMs: number;
}

interface Options {
  /** Called exactly once per run, when the typed text equals the target. */
  onComplete: (result: SessionResult) => void;
}

const INITIAL_STATS: SessionStats = { wpm: 0, accuracy: 100, errors: 0, progress: 0, timeMs: 0 };

/**
 * Typing session state machine. All input sources (physical keyboard, on-screen
 * keys, chords) funnel into handleChar / handleBackspace.
 *
 * Metrics (preserved from the previous implementation):
 *  - accuracy = correct keystrokes / total keystrokes, cumulative (backspace never erases a miss)
 *  - errors   = keystrokes that were ever wrong
 *  - timer starts at the first keystroke; pauses when the tab is hidden and
 *    resumes on the next keystroke
 *  - WPM      = typed chars / 5 / minutes, ticking every 500ms while running
 */
export function usePracticeSession(text: string, { onComplete }: Options) {
  const [typed, setTyped] = useState('');
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [stats, setStats] = useState<SessionStats>(INITIAL_STATS);

  const typedRef = useRef('');
  const totalRef = useRef(0);
  const correctRef = useRef(0);
  const accumRef = useRef(0); // ms accumulated in finished timer segments
  const segStartRef = useRef<number | null>(null); // start of the running segment
  const statusRef = useRef<SessionStatus>('idle');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const textRef = useRef(text);
  textRef.current = text;

  const setStatusBoth = (s: SessionStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  const elapsed = (now: number) => accumRef.current + (segStartRef.current !== null ? now - segStartRef.current : 0);

  const computeStats = useCallback((now: number): SessionStats => {
    const len = typedRef.current.length;
    const total = totalRef.current;
    const correct = correctRef.current;
    const timeMs = elapsed(now);
    const minutes = timeMs / 60000;
    return {
      wpm: minutes > 0 ? Math.round(len / 5 / minutes) : 0,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 100,
      errors: total - correct,
      progress: textRef.current.length > 0 ? Math.round((len / textRef.current.length) * 100) : 0,
      timeMs,
    };
  }, []);

  /**
   * `assist` inputs the expected character without counting a keystroke; used
   * for characters the current layout cannot produce.
   */
  const handleChar = useCallback(
    (ch: string, assist = false): CharOutcome => {
      const target = textRef.current;
      if (statusRef.current === 'done' || typedRef.current.length >= target.length) return 'ignored';
      const idx = typedRef.current.length;
      const now = Date.now();
      if (segStartRef.current === null) segStartRef.current = now;
      if (statusRef.current !== 'running') setStatusBoth('running');

      const input = assist ? target[idx] : ch;
      const isCorrect = input === target[idx];
      if (!assist) {
        totalRef.current += 1;
        if (isCorrect) correctRef.current += 1;
      }
      typedRef.current += input;
      setTyped(typedRef.current);

      const next = computeStats(now);
      setStats(next);

      if (typedRef.current === target) {
        segStartRef.current = null;
        setStatusBoth('done');
        onCompleteRef.current({ wpm: next.wpm, accuracy: next.accuracy, errors: next.errors, timeMs: next.timeMs });
        return 'complete';
      }
      return isCorrect ? 'correct' : 'wrong';
    },
    [computeStats],
  );

  const handleBackspace = useCallback((): boolean => {
    if (statusRef.current === 'done' || typedRef.current.length === 0) return false;
    typedRef.current = typedRef.current.slice(0, -1);
    setTyped(typedRef.current);
    setStats(computeStats(Date.now()));
    return true;
  }, [computeStats]);

  const reset = useCallback(() => {
    typedRef.current = '';
    totalRef.current = 0;
    correctRef.current = 0;
    accumRef.current = 0;
    segStartRef.current = null;
    setTyped('');
    setStats(INITIAL_STATS);
    setStatusBoth('idle');
  }, []);

  // Live WPM / timer ticking while running.
  useEffect(() => {
    if (status !== 'running') return undefined;
    const id = window.setInterval(() => setStats(computeStats(Date.now())), 500);
    return () => window.clearInterval(id);
  }, [status, computeStats]);

  // Pause when the tab is hidden; the next keystroke resumes.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && statusRef.current === 'running' && segStartRef.current !== null) {
        accumRef.current += Date.now() - segStartRef.current;
        segStartRef.current = null;
        setStatusBoth('paused');
        setStats(computeStats(Date.now()));
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [computeStats]);

  return { typed, status, stats, handleChar, handleBackspace, reset };
}
