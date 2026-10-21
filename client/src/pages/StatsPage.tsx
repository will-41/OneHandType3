import { useMemo, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { BarChart3, Gauge, Target, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import PageContainer from '../components/shell/PageContainer';
import PageHeader from '../components/shell/PageHeader';
import { useTypingStore, levelFromXp } from '../lib/stores/useTypingStore';
import { gamifiedCurriculum } from '../lib/gamifiedCurriculum';
import { staticLessons } from '../lib/lessons';


const lessonTitles = new Map<string, string>([
  ...staticLessons.map((l) => [l.id, l.title] as [string, string]),
  ...gamifiedCurriculum.flatMap((lv) => lv.lessons.map((l) => [l.id, l.title] as [string, string])),
]);

function StatCard({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <span aria-hidden="true" className="text-primary">
          {icon}
        </span>
        {label}
      </div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

export default function StatsPage() {
  const [, navigate] = useLocation();
  const stats = useTypingStore((s) => s.stats);
  const completedLessons = useTypingStore((s) => s.completedLessons);

  const xp = useTypingStore((s) => s.xp);
  const level = levelFromXp(xp);
  // Level N starts at 100 * (N-1)^2 XP (matches levelFromXp in the store).
  const levelStart = 100 * (level - 1) ** 2;
  const levelEnd = 100 * level ** 2;
  const xpIntoLevel = xp - levelStart;
  const xpForLevel = levelEnd - levelStart;

  // TODO(wave-reconcile): store keeps no per-run history/timestamps; show per-lesson bests until it does.
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
      <PageHeader title="Stats" description="Your progress, stored privately on this device." icon={<BarChart3 className="h-5 w-5" />} />

      {!hasData && (
        <Card className="mb-6 p-8 text-center">
          <p className="mb-1 font-medium">No results yet</p>
          <p className="mb-4 text-sm text-muted-foreground">Finish a lesson and your stats will appear here.</p>
          <Button className="min-h-[48px]" onClick={() => navigate('/curriculum')}>
            Start learning
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Gauge className="h-4 w-4" />} label="Best WPM" value={String(Math.round(stats.bestWpm))} />
        <StatCard icon={<Target className="h-4 w-4" />} label="Best accuracy" value={`${Math.round(stats.bestAccuracy)}%`} />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Lessons completed"
          value={String(completedLessons.length)}
          hint={`of ${staticLessons.length + gamifiedCurriculum.reduce((n, l) => n + l.lessons.length, 0)} available`}
        />
        <StatCard icon={<Clock className="h-4 w-4" />} label="Time practised" value={`${minutes} min`} />
      </div>

      <Card className="mt-4 p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
            Level {level}
          </div>
          <span className="text-sm tabular-nums text-muted-foreground">{xp} XP total</span>
        </div>
        <Progress value={(xpIntoLevel / xpForLevel) * 100} aria-label={`Level ${level} progress`} />
        <p className="mt-2 text-xs text-muted-foreground">
          {levelEnd - xp} XP to level {level + 1}. Earn XP by completing lessons, with bonuses for speed and accuracy.
        </p>
      </Card>

      <section aria-labelledby="stats-recent" className="mt-8">
        <h2 id="stats-recent" className="mb-3 text-lg font-semibold">
          Recent lessons
        </h2>
        {lessonBests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {lessonBests.map(([id, v]) => (
              <li key={id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{lessonTitles.get(id) ?? id}</div>
                  <div className="text-xs text-muted-foreground">
                    {v.attempts} attempt{v.attempts === 1 ? '' : 's'}
                  </div>
                </div>
                <div className="shrink-0 text-right text-sm tabular-nums">
                  <div>{Math.round(v.bestWpm)} WPM</div>
                  <div className="text-xs text-muted-foreground">{Math.round(v.bestAccuracy)}% acc</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  );
}
