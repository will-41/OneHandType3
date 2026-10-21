import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, RotateCcw, ArrowRight, Check, Sparkles } from 'lucide-react';
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
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 px-2 py-3 text-center">
      <div className="text-xl font-bold tabular-nums text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

const BTN =
  'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold touch-manipulation transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card';

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
}: ResultsSheetProps) {
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    primaryRef.current?.focus();
  }, []);

  const badgeText = data.badge === 'new-best' ? 'New best!' : data.badge === 'first-clear' ? 'First clear!' : null;

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-end justify-center bg-background/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-title"
        data-testid="results-sheet"
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-b-0 border-border bg-card px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl"
        initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
        animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
        transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 320, damping: 32 }}
      >
        <div className="mb-1 flex items-center justify-center gap-2 text-success">
          <Check aria-hidden="true" className="h-5 w-5" />
          <h2 id="results-title" className="text-lg font-semibold text-foreground">
            Lesson complete
          </h2>
        </div>
        <p className="mb-3 truncate text-center text-sm text-muted-foreground">{title}</p>

        <div className="mb-4 text-center">
          <motion.div
            data-testid="results-wpm"
            className="inline-block text-6xl font-extrabold tabular-nums text-primary"
            initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    scale: [0.7, 1.12, 1],
                    opacity: 1,
                    textShadow: [
                      '0 0 0px hsl(var(--primary) / 0)',
                      '0 0 28px hsl(var(--primary) / 0.7)',
                      '0 0 12px hsl(var(--primary) / 0.35)',
                    ],
                  }
            }
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: 'easeOut' }}
          >
            {data.wpm}
          </motion.div>
          <div className="text-sm font-medium text-muted-foreground">words per minute</div>
          {badgeText && (
            <div
              data-testid="results-badge"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground"
            >
              <Award aria-hidden="true" className="h-4 w-4" />
              {badgeText}
            </div>
          )}
        </div>

        <div className="mb-3 grid grid-cols-4 gap-2">
          <Stat label="Accuracy" value={`${data.accuracy}%`} />
          <Stat label="Time" value={formatDuration(data.timeMs)} />
          <Stat label="Errors" value={String(data.errors)} />
          <Stat label="XP" value={`+${data.xpEarned}`} />
        </div>

        {data.achievements.length > 0 && (
          <ul className="mb-3 space-y-1" aria-label="Achievements unlocked">
            {data.achievements.slice(0, 3).map((a) => (
              <li
                key={a}
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-foreground"
              >
                <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">Achievement unlocked: {a}</span>
              </li>
            ))}
            {data.achievements.length > 3 && (
              <li className="px-3 text-sm text-muted-foreground">+{data.achievements.length - 3} more in your profile</li>
            )}
          </ul>
        )}

        <div className="flex flex-col gap-2">
          {hasNext && (
            <button
              ref={primaryRef}
              type="button"
              onClick={onNext}
              className={cn(BTN, 'bg-primary text-primary-foreground hover:bg-primary/90')}
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
              hasNext
                ? 'border border-border bg-background text-foreground hover:bg-muted'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            <RotateCcw aria-hidden="true" className="h-5 w-5" />
            Practice again
          </button>
          <button
            type="button"
            onClick={onDone}
            className={cn(BTN, 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground')}
          >
            Done
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
