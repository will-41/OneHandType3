import { useMemo, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Compass, Gauge, Keyboard, CheckCircle2, Map as MapIcon, Play, Wrench, Sparkles, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import PageContainer from '../components/shell/PageContainer';
import { gamifiedCurriculum } from '../lib/gamifiedCurriculum';
import { staticLessons } from '../lib/lessons';
import { useTypingStore, levelFromXp } from '../lib/stores/useTypingStore';
import { mirrorRow } from '../lib/theme';
import { cn } from '../lib/utils';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const PRIMARY_BTN = cn(
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 touch-manipulation',
  FOCUS,
);
const CURATED_IDS = ['basics-1', 'basics-2', 'words-1', 'sentences-1'];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Hello';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function QuickAction({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-card px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted touch-manipulation',
        FOCUS,
      )}
    >
      <span aria-hidden="true" className="text-primary">
        {icon}
      </span>
      <span className="text-center leading-tight">{label}</span>
    </Link>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-3 py-2.5">
      <span aria-hidden="true" className="text-primary">
        {icon}
      </span>
      <div>
        <div className="text-lg font-bold leading-tight tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [, navigate] = useLocation();
  const hand = useTypingStore((s) => s.handPreference);
  const xp = useTypingStore((s) => s.xp);
  const completed = useTypingStore((s) => s.completedLessons);
  const bestWpm = useTypingStore((s) => s.stats.bestWpm);
  const onboardingComplete = useTypingStore((s) => s.onboardingComplete);

  const level = levelFromXp(xp);
  const levelStart = 100 * (level - 1) ** 2;
  const levelEnd = 100 * level ** 2;
  const levelPercent = Math.min(100, Math.max(0, ((xp - levelStart) / (levelEnd - levelStart)) * 100));

  const next = useMemo(() => {
    const done = new Set(completed);
    for (const realm of gamifiedCurriculum) {
      const lesson = realm.lessons.find((l) => !done.has(l.id));
      if (lesson) return { lesson, realm: realm.storyTheme.region };
    }
    return null;
  }, [completed]);

  const curated = useMemo(
    () => CURATED_IDS.map((id) => staticLessons.find((l) => l.id === id)).filter((l): l is NonNullable<typeof l> => Boolean(l)),
    [],
  );

  const isNew = !onboardingComplete && completed.length === 0;
  const rowDir = mirrorRow(hand);

  return (
    <PageContainer className="max-w-2xl">
      {/* Hero */}
      <header className="pb-5">
        <h1 className="text-3xl font-bold tracking-tight">{isNew ? 'Welcome to OneType' : `${greeting()}`}</h1>
        <p className="mt-1 text-muted-foreground">
          {isNew ? 'Comfortable one-handed typing, at your own pace.' : 'Ready when you are. Pick up wherever suits you.'}
        </p>
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              Level {level}
            </span>
            <span className="tabular-nums text-muted-foreground">{xp} XP</span>
          </div>
          <Progress value={levelPercent} aria-label={`Level ${level} progress, ${Math.round(levelPercent)} percent`} />
          <p className="mt-2 text-xs text-muted-foreground">{levelEnd - xp} XP to level {level + 1}</p>
        </div>
      </header>

      {/* First-launch tour */}
      {isNew && (
        <section aria-labelledby="home-tour" className="mb-5">
          <Card className="border-primary/50 bg-primary/10 p-4">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Compass className="h-6 w-6" />
              </span>
              <div>
                <h2 id="home-tour" className="text-lg font-semibold">
                  New here? Take the 1-minute tour
                </h2>
                <p className="text-sm text-muted-foreground">Choose your hand and layout, and try the Mirror key.</p>
              </div>
            </div>
            <div className={cn('mt-4 flex', rowDir)}>
              <button type="button" className={cn(PRIMARY_BTN, 'w-full sm:w-auto')} onClick={() => navigate('/tutorial')}>
                Get started
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </Card>
        </section>
      )}

      {/* Continue */}
      <section aria-labelledby="home-continue" className="mb-5">
        <h2 id="home-continue" className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {completed.length === 0 ? 'Start here' : 'Continue'}
        </h2>
        <Card className="p-4">
          {next ? (
            <>
              <p className="text-sm text-muted-foreground">{next.realm}</p>
              <p className="text-lg font-semibold leading-snug">{next.lesson.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden="true" />
                About {next.lesson.estimatedTime} min
              </p>
              <div className={cn('mt-4 flex', rowDir)}>
                <button
                  type="button"
                  className={cn(PRIMARY_BTN, 'w-full sm:w-auto')}
                  onClick={() => navigate(`/lesson/${encodeURIComponent(next.lesson.id)}`)}
                >
                  <Play aria-hidden="true" className="h-5 w-5" />
                  {completed.length === 0 ? 'Start lesson' : 'Continue'}
                  <span className="sr-only">: {next.lesson.title}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">Every realm cleared</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You have completed the whole journey. Revisit any lesson in Learn, or keep practising.
              </p>
              <div className={cn('mt-4 flex', rowDir)}>
                <Link href="/curriculum" className={cn(PRIMARY_BTN, 'w-full sm:w-auto')}>
                  Open Learn
                </Link>
              </div>
            </>
          )}
        </Card>
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions" className="mb-5">
        <div className="grid grid-cols-3 gap-3">
          <QuickAction href="/practice" icon={<Keyboard className="h-6 w-6" />} label="Practice" />
          <QuickAction href="/curriculum" icon={<MapIcon className="h-6 w-6" />} label="Learn" />
          <QuickAction href="/settings/keyboard-builder" icon={<Wrench className="h-6 w-6" />} label="Keyboard builder" />
        </div>
      </section>

      {/* At a glance */}
      <section aria-labelledby="home-glance" className="mb-5">
        <h2 id="home-glance" className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          At a glance
        </h2>
        <div className="flex gap-3">
          <Stat icon={<Gauge className="h-5 w-5" />} label="Best WPM" value={String(Math.round(bestWpm))} />
          <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Lessons done" value={String(completed.length)} />
        </div>
      </section>

      {/* Curated lessons */}
      <section aria-labelledby="home-quick" className="mb-2">
        <div className="mb-2 flex items-center justify-between">
          <h2 id="home-quick" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Quick lessons
          </h2>
          <Link href="/practice" className={cn('inline-flex min-h-[48px] items-center rounded-lg px-2 text-sm font-medium text-primary hover:underline', FOCUS)}>
            See all
          </Link>
        </div>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {curated.map((l) => (
            <li key={l.id}>
              <Link
                href={`/lesson/${encodeURIComponent(l.id)}`}
                className={cn('flex min-h-[56px] items-center justify-between gap-3 px-4 py-2 hover:bg-muted', FOCUS)}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{l.title}</span>
                  <span className="block truncate text-sm text-muted-foreground">{l.description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  );
}
