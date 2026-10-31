import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDuration } from './inputUtils';

export interface ResultsData {
  wpm: number;
  accuracy: number;
  errors: number;
  timeMs: number;
  xpEarned: number;
  badge: 'new-best' | 'first-clear' | null;
  achievements: string[];
  targetWpm?: number;
}

interface ResultsSheetProps {
  title: string;
  data: ResultsData;
  reduceMotion: boolean;
  hasNext: boolean;
  nextTitle?: string;
  onAgain: () => void;
  onNext: () => void;
  onDone: () => void;
  /** Escape key: close the sheet without choosing an action. */
  onDismiss: () => void;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0 px-3 py-3">
      <div className="font-mono text-xl font-medium leading-7 tabular-nums text-foreground">{value}</div>
      <div className="text-sm leading-5 text-muted-foreground">{label}</div>
    </div>
  );
}

const BTN =
  'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-transparent px-5 text-base font-bold touch-manipulation transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover';

/** Bottom sheet shown when a lesson is finished. Slides up; fades under reduced motion. */
export default function ResultsSheet({
  title,
  data,
  reduceMotion,
  hasNext,
  nextTitle,
  onAgain,
  onNext,
  onDone,
  onDismiss,
}: ResultsSheetProps) {
  const primaryRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    primaryRef.current?.focus();
  }, []);

  // Escape closes the sheet from anywhere on the page.
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissRef.current();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  // Focus trap.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const items = sheetRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
    if (!items || items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    } else if (!sheetRef.current?.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  };

  const badgeText = data.badge === 'new-best' ? 'New best!' : data.badge === 'first-clear' ? 'First clear!' : null;

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-end justify-center bg-background/[0.72]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.24, ease: [0.2, 0, 0, 1] }}
    >
      <motion.section
        ref={sheetRef}
        onKeyDown={onKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-title"
        data-testid="results-sheet"
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-popover px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-0 text-popover-foreground shadow-[0_-8px_32px_rgb(0_0_0/0.35)]"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0.12 } : { duration: 0.24, ease: [0.2, 0, 0, 1] }}
      >
        <div aria-hidden="true" className="flex h-6 items-center justify-center">
          <div className="h-1 w-10 rounded-sm bg-input" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Check aria-hidden="true" className="h-6 w-6 text-success" strokeWidth={2.5} />
          <h2 id="results-title" className="font-display text-2xl font-medium leading-[1.875rem] text-foreground">
            Lesson complete
          </h2>
        </div>
        <p className="mt-1 text-base text-muted-foreground">{title}</p>

        <div className="mt-5 flex items-baseline gap-2">
          <span data-testid="results-wpm" className="font-mono text-[2rem] font-bold leading-[2.375rem] tabular-nums text-foreground">
            {data.wpm}
          </span>
          <span className="text-base text-muted-foreground">words per minute</span>
          {badgeText && (
            <span
              data-testid="results-badge"
              className={cn(
                'ml-auto inline-flex h-6 items-center self-center rounded-md px-2 text-sm font-bold',
                data.badge === 'new-best' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground',
              )}
            >
              {badgeText}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-4 divide-x divide-border rounded-lg border bg-card">
          <Stat label="Accuracy" value={`${data.accuracy}%`} />
          <Stat label="Time" value={formatDuration(data.timeMs)} />
          <Stat label="Errors" value={String(data.errors)} />
          <Stat label="XP" value={`+${data.xpEarned}`} />
        </div>

        {data.achievements.length > 0 && (
          <ul className="mt-3 divide-y divide-border rounded-lg border bg-card" aria-label="Achievements unlocked">
            {data.achievements.slice(0, 3).map((a) => (
              <li key={a} className="flex min-h-[48px] items-center px-4 py-2 text-base text-foreground">
                <span>
                  Achievement unlocked: <b>{a}</b>
                </span>
              </li>
            ))}
            {data.achievements.length > 3 && (
              <li className="flex min-h-[48px] items-center px-4 py-2 text-base text-muted-foreground">
                +{data.achievements.length - 3} more in your profile
              </li>
            )}
          </ul>
        )}

        <div className="mt-5 flex flex-col gap-3">
          {hasNext && (
            <button
              ref={primaryRef}
              type="button"
              onClick={onNext}
              className={cn(BTN, 'bg-primary text-primary-foreground active:bg-primary/80')}
            >
              Next lesson
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
              {nextTitle && <span className="sr-only">: {nextTitle}</span>}
            </button>
          )}
          <button
            ref={hasNext ? undefined : primaryRef}
            type="button"
            onClick={onAgain}
            className={cn(
              BTN,
              hasNext ? 'border-input bg-transparent text-foreground active:bg-secondary' : 'bg-primary text-primary-foreground active:bg-primary/80',
            )}
          >
            <RotateCcw aria-hidden="true" className="h-5 w-5" />
            Practice again
          </button>
          <button type="button" onClick={onDone} className={cn(BTN, 'bg-transparent text-foreground active:bg-secondary')}>
            Done
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
