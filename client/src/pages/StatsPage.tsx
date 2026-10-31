import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { Lock, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import PageContainer from '../components/shell/PageContainer';
import PageHeader from '../components/shell/PageHeader';
import { useTypingStore, levelFromXp } from '../lib/stores/useTypingStore';
import { gamifiedCurriculum } from '../lib/gamifiedCurriculum';
import { staticLessons } from '../lib/lessons';
import { achievements, achievementCategoryLabels } from '../lib/achievements';

const lessonTitles = new Map<string, string>([
  ...staticLessons.map((l) => [l.id, l.title] as [string, string]),
  ...gamifiedCurriculum.flatMap((lv) => lv.lessons.map((l) => [l.id, l.title] as [string, string])),
]);

/** One cell of the summary card: label, mono figure, optional hint. */
function Cell({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1 p-4">
      <span className="text-sm leading-5 text-muted-foreground">{label}</span>
      <span className="font-mono text-[2rem] font-medium leading-[2.375rem] tabular-nums">{value}</span>
      {hint && <span className="text-sm leading-5 text-muted-foreground">{hint}</span>}
    </div>
  );
}

const H2 = 'text-lg font-bold leading-[1.625rem]';

export default function StatsPage() {
  const [, navigate] = useLocation();
  const stats = useTypingStore((s) => s.stats);
  const completedLessons = useTypingStore((s) => s.completedLessons);

  const xp = useTypingStore((s) => s.xp);
  const unlockedIds = useTypingStore((s) => s.unlockedAchievements);
  const achievementDates = useTypingStore((s) => s.achievementDates);
  const unlockedSet = useMemo(() => new Set(unlockedIds), [unlockedIds]);
  const unlockedList = achievements.filter((a) => unlockedSet.has(a.id));
  const lockedList = achievements.filter((a) => !unlockedSet.has(a.id));
  const level = levelFromXp(xp);
  // Level N starts at 100 * (N-1)^2 XP (matches levelFromXp in the store).
  const levelStart = 100 * (level - 1) ** 2;
  const levelEnd = 100 * level ** 2;
  const xpIntoLevel = xp - levelStart;
  const xpForLevel = levelEnd - levelStart;

  // Per-lesson bests (the store keeps bests, not a full run history).
  const lessonBests = useMemo(
    () =>
      Object.entries(stats.lessons)
        .filter(([, v]) => v.attempts > 0 || v.bestWpm > 0)
        .sort(([, a], [, b]) => b.attempts - a.attempts)
        .slice(0, 8),
    [stats.lessons]
  );

  const minutes = Math.round(stats.totalTimeTyped / 60);
  const hasData = stats.bestWpm > 0 || completedLessons.length > 0 || lessonBests.length > 0;

  return (
    <PageContainer>
      <PageHeader title="Stats" description="Your progress, stored privately on this device." />

      {!hasData && (
        <div className="mb-6 flex flex-col items-start gap-1 rounded-lg border bg-card p-4">
          <p className="text-lg font-bold leading-snug">No results yet</p>
          <p className="mb-3 text-base text-muted-foreground">Finish a lesson and your stats will appear here.</p>
          <Button className="min-h-[48px]" onClick={() => navigate('/curriculum')}>
            Start learning
          </Button>
        </div>
      )}

      {/* Summary: one card, four cells divided by hairlines */}
      <section aria-label="Summary">
        <div className="grid grid-cols-2 divide-x divide-border rounded-lg border bg-card lg:grid-cols-4 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-border lg:[&>*:nth-child(n+3)]:border-t-0 [&>*:nth-child(3)]:border-l-0 lg:[&>*:nth-child(3)]:border-l">
          <Cell label="Best WPM" value={String(Math.round(stats.bestWpm))} />
          <Cell label="Best accuracy" value={`${Math.round(stats.bestAccuracy)}%`} />
          <Cell
            label="Lessons completed"
            value={String(completedLessons.length)}
            hint={`of ${staticLessons.length + gamifiedCurriculum.reduce((n, l) => n + l.lessons.length, 0)} available`}
          />
          <Cell label="Time practised" value={`${minutes} min`} />
        </div>
      </section>

      <div className="mt-3 flex flex-col gap-3 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <span className={H2}>Level {level}</span>
          <span className="font-mono tabular-nums text-muted-foreground">{xp} XP total</span>
        </div>
        <Progress value={(xpIntoLevel / xpForLevel) * 100} aria-label={`Level ${level} progress`} />
        <p className="text-sm leading-5 text-muted-foreground">
          {levelEnd - xp} XP to level {level + 1}. Earn XP by completing lessons, with bonuses for speed and accuracy.
        </p>
      </div>

      <section aria-labelledby="stats-achievements" className="mt-8 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="stats-achievements" className={H2}>
            Achievements{' '}
            <span className="font-normal text-muted-foreground">
              {unlockedList.length} of {achievements.length}
            </span>
          </h2>
          <p className="text-sm leading-5 text-muted-foreground">
            Earned through practice, accuracy and progress. No timers, no daily streaks, nothing to lose.
          </p>
        </div>

        {unlockedList.length === 0 ? (
          <p className="rounded-lg border border-dashed border-input p-4 text-base text-muted-foreground">
            Your first achievement is one lesson away.
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border bg-card" aria-label="Unlocked achievements">
            {unlockedList.map((a) => {
              const when = achievementDates[a.id];
              return (
                <li key={a.id} className="flex min-h-[56px] flex-col px-4 py-2">
                  <span className="font-medium">{a.title}</span>
                  <span className="text-sm leading-5 text-muted-foreground">{a.description}</span>
                  {when && (
                    <span className="text-sm leading-5 text-muted-foreground">
                      Unlocked <time dateTime={new Date(when).toISOString()}>{new Date(when).toLocaleDateString()}</time>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {lockedList.length > 0 && (
          <details className="group overflow-hidden rounded-lg border bg-card">
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              <span>Still to explore ({lockedList.length})</span>
              <ChevronDown aria-hidden="true" className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="divide-y divide-border border-t" aria-label="Locked achievements">
              {lockedList.map((a) => (
                <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                  <Lock aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="font-medium text-muted-foreground">
                      {a.title} <span className="sr-only">(locked)</span>
                      <span className="ml-1 text-sm font-normal">· {achievementCategoryLabels[a.category]}</span>
                    </div>
                    <div className="text-sm leading-5 text-muted-foreground">{a.requirement}</div>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section aria-labelledby="stats-recent" className="mt-8 flex flex-col gap-3">
        <h2 id="stats-recent" className={H2}>
          Recent lessons
        </h2>
        {lessonBests.length === 0 ? (
          <p className="text-base text-muted-foreground">Nothing here yet.</p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border bg-card">
            {lessonBests.map(([id, v]) => (
              <li key={id} className="flex min-h-[56px] items-center justify-between gap-3 px-4 py-2">
                <div className="min-w-0">
                  <div className="font-medium">{lessonTitles.get(id) ?? id}</div>
                  <div className="text-sm leading-5 text-muted-foreground">
                    {v.attempts} attempt{v.attempts === 1 ? '' : 's'}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <span className="font-mono font-medium tabular-nums">{Math.round(v.bestWpm)} WPM</span>
                  <span className="text-sm leading-5 text-muted-foreground">{Math.round(v.bestAccuracy)}% acc</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  );
}
