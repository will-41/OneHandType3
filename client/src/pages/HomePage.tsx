import { useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Play } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import PageContainer from '../components/shell/PageContainer';
import { gamifiedCurriculum } from '../lib/gamifiedCurriculum';
import { staticLessons } from '../lib/lessons';
import { useTypingStore, levelFromXp } from '../lib/stores/useTypingStore';
import { mirrorRow } from '../lib/theme';
import { cn } from '../lib/utils';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const BTN = cn(
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-transparent px-5 text-base font-bold transition-colors touch-manipulation',
  FOCUS,
);
const PRIMARY_BTN = cn(BTN, 'bg-primary text-primary-foreground active:bg-primary/80');
const SECONDARY_BTN = cn(BTN, 'border-input bg-transparent text-foreground active:bg-secondary');
const CURATED_IDS = ['basics-1', 'basics-2', 'words-1', 'sentences-1'];

/** Section heading: 18 px bold, sentence case. */
const H2 = 'text-lg font-bold leading-[1.625rem]';
/** One row in a hairline list: 56 px tall, label left, chevron right. */
const ROW = cn('flex min-h-[56px] w-full items-center gap-3 px-4 py-2 text-left active:bg-secondary', FOCUS);

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Hello';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
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
      {/* Header: Literata title, one muted line, the level card */}
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[2rem] font-medium leading-[2.375rem] tracking-[-0.01em]">
          {isNew ? 'Welcome to One-Type' : `${greeting()}`}
        </h1>
        <p className="text-base text-muted-foreground">
          {isNew ? 'Comfortable one-handed typing, at your own pace.' : 'Ready when you are. Pick up wherever suits you.'}
        </p>
        <div className="mt-4 flex flex-col gap-3 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <span className={H2}>Level {level}</span>
            <span className="font-mono tabular-nums text-muted-foreground">{xp} XP</span>
          </div>
          <Progress value={levelPercent} aria-label={`Level ${level} progress, ${Math.round(levelPercent)} percent`} />
          <p className="text-sm leading-5 text-muted-foreground">{levelEnd - xp} XP to level {level + 1}</p>
        </div>
      </header>

      {/* First-launch tour */}
      {isNew && (
        <section aria-labelledby="home-tour" className="mt-8 flex flex-col gap-3">
          <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <h2 id="home-tour" className={H2}>
              New here? Take the 1-minute tour
            </h2>
            <p className="text-base text-muted-foreground">Choose your hand and layout, and try the Mirror key.</p>
            <div className={cn('flex', rowDir)}>
              <button type="button" className={cn(PRIMARY_BTN, 'w-full sm:w-auto')} onClick={() => navigate('/tutorial')}>
                Get started
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Continue */}
      <section aria-labelledby="home-continue" className="mt-8 flex flex-col gap-3">
        <h2 id="home-continue" className={H2}>
          {completed.length === 0 ? 'Start here' : 'Continue'}
        </h2>
        <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
          {next ? (
            <>
              <p className="text-sm leading-5 text-muted-foreground">{next.realm}</p>
              <p className="text-xl font-bold leading-7">{next.lesson.title}</p>
              <p className="text-sm leading-5 text-muted-foreground">About {next.lesson.estimatedTime} min</p>
              <div className={cn('mt-3 flex', rowDir)}>
                <button
                  type="button"
                  className={cn(isNew ? SECONDARY_BTN : PRIMARY_BTN, 'w-full sm:w-auto')}
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
              <p className="text-xl font-bold leading-7">Every realm cleared</p>
              <p className="text-base text-muted-foreground">
                You have completed the whole journey. Revisit any lesson in Learn, or keep practising.
              </p>
              <div className={cn('mt-3 flex', rowDir)}>
                <Link href="/curriculum" className={cn(PRIMARY_BTN, 'w-full sm:w-auto')}>
                  Open Learn
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick actions: one hairline list, label and chevron */}
      <section aria-label="Quick actions" className="mt-8">
        <div className="divide-y divide-border overflow-hidden rounded-lg border bg-card md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            { href: '/practice', label: 'Practice' },
            { href: '/curriculum', label: 'Learn' },
            { href: '/settings/keyboard-builder', label: 'Keyboard builder' },
          ].map((q) => (
            <Link key={q.href} href={q.href} className={cn(ROW, 'justify-between font-medium')}>
              <span>{q.label}</span>
              <ChevronRight aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* At a glance: two figures divided by one hairline */}
      <section aria-labelledby="home-glance" className="mt-8 flex flex-col gap-3">
        <h2 id="home-glance" className={H2}>
          At a glance
        </h2>
        <div className="grid grid-cols-2 divide-x divide-border rounded-lg border bg-card">
          <div className="flex flex-col gap-1 p-4">
            <span className="font-mono text-[2rem] font-medium leading-[2.375rem] tabular-nums">{String(Math.round(bestWpm))}</span>
            <span className="text-sm leading-5 text-muted-foreground">Best WPM</span>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <span className="font-mono text-[2rem] font-medium leading-[2.375rem] tabular-nums">{String(completed.length)}</span>
            <span className="text-sm leading-5 text-muted-foreground">Lessons done</span>
          </div>
        </div>
      </section>

      {/* Curated lessons */}
      <section aria-labelledby="home-quick" className="mt-8 flex flex-col gap-3">
        <div className="flex min-h-[26px] items-center justify-between gap-3">
          <h2 id="home-quick" className={H2}>
            Quick lessons
          </h2>
          <Link href="/practice" className={cn('inline-flex min-h-[44px] items-center font-bold text-primary underline decoration-1 underline-offset-4', FOCUS)}>
            See all
          </Link>
        </div>
        <ul className="divide-y divide-border overflow-hidden rounded-lg border bg-card">
          {curated.map((l) => (
            <li key={l.id}>
              <Link href={`/lesson/${encodeURIComponent(l.id)}`} className={ROW}>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{l.title}</span>
                  <span className="block text-sm leading-5 text-muted-foreground">{l.description}</span>
                </span>
                <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  );
}
