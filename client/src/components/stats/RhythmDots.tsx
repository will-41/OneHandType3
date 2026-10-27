import { useMemo } from 'react';
import { computeRhythm, goalThreshold, lastNDays, localDateKey, type DailyGoal, type PracticeLog } from '../../lib/rhythm';
import { cn } from '../../lib/utils';

/** 28 calm dots: filled = goal reached, half = some practice, empty = rest. */
export default function RhythmDots({ practiceLog, goal }: { practiceLog: PracticeLog; goal: DailyGoal }) {
  const today = localDateKey();
  const days = useMemo(() => lastNDays(today, 28), [today]);
  const threshold = goalThreshold(goal);
  const rhythm = useMemo(() => computeRhythm(practiceLog, goal), [practiceLog, goal]);

  const states = days.map((d) => {
    const m = practiceLog[d] ?? 0;
    return m >= threshold ? 'full' : m > 0 ? 'half' : 'none';
  });
  const fullCount = states.filter((s) => s === 'full').length;
  const partialCount = states.filter((s) => s === 'half').length;
  const summary = goal === 0 ? 'Daily goal is off' : `Daily goal: ${goal} min · best rhythm ${rhythm.bestDays} days`;

  return (
    <div>
      <div
        role="img"
        aria-label={`Last 28 days: ${fullCount} days at goal, ${partialCount} partial days. ${summary}`}
        data-testid="rhythm-dots"
        className="grid grid gap-1.5"
        style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
      >
        {states.map((s, i) => (
          <span
            key={days[i]}
            aria-hidden="true"
            className={cn(
              'aspect-square w-full max-w-[1.25rem] justify-self-center rounded-full border',
              s === 'full' && 'border-primary bg-primary',
              s === 'half' && 'border-primary bg-gradient-to-r from-primary from-50% to-transparent to-50%',
              s === 'none' && 'border-border bg-muted',
            )}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{summary}</p>
    </div>
  );
}
