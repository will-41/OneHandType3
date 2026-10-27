import { useMemo } from 'react';
import { Card } from '../ui/card';
import { useTypingStore } from '../../lib/stores/useTypingStore';
import { computeRhythm } from '../../lib/rhythm';

const SIZE = 64;
const STROKE = 7;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/** Calm daily-goal ring. Rendered only when a daily goal is set. */
export default function RhythmRing() {
  const goal = useTypingStore((s) => s.dailyGoalMinutes);
  const log = useTypingStore((s) => s.practiceLog);
  const rhythm = useMemo(() => computeRhythm(log, goal), [log, goal]);

  if (goal <= 0) return null;

  const minutes = Math.round(rhythm.todayMinutes);
  const fraction = Math.min(1, rhythm.todayMinutes / goal);
  const showDays = rhythm.currentDays > 0;
  const fresh = rhythm.currentDays === 0 && rhythm.bestDays > 0;
  const label = `${minutes} of ${goal} minutes today${showDays ? `, ${rhythm.currentDays}-day rhythm` : ''}`;

  return (
    <Card className="flex items-center gap-4 p-4">
      <svg
        role="img"
        aria-label={label}
        data-testid="rhythm-ring"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="shrink-0 -rotate-90"
      >
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" strokeWidth={STROKE} className="stroke-muted" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - fraction)}
          className={rhythm.goalMet ? 'stroke-success' : 'stroke-primary'}
        />
      </svg>
      <div className="min-w-0">
        <p className="font-semibold">{rhythm.goalMet ? 'Goal met — nice work' : `${minutes} of ${goal} min today`}</p>
        {showDays && <p className="text-sm text-muted-foreground">{rhythm.currentDays}-day rhythm</p>}
        {fresh && <p className="text-sm text-muted-foreground">Fresh start today</p>}
        {rhythm.restDayUsedThisWeek && (
          <p className="text-sm text-muted-foreground">Rest day used — your rhythm is safe</p>
        )}
      </div>
    </Card>
  );
}
