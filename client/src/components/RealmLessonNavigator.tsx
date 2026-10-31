import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { regionAccent } from '../lib/theme';
import { Lock, Check, Play, ChevronDown } from 'lucide-react';
import {
  gamifiedCurriculum,
  type CurriculumLevel,
  type CurriculumLesson,
} from '../lib/gamifiedCurriculum';

interface RealmLessonNavigatorProps {
  /** Override the default behaviour (navigate to /lesson/:id). */
  onStartLesson?: (lesson: CurriculumLesson) => void;
  className?: string;
}

const TOTAL_LESSONS = gamifiedCurriculum.reduce((sum, level) => sum + level.lessons.length, 0);

export default function RealmLessonNavigator({ onStartLesson, className }: RealmLessonNavigatorProps) {
  const completedLessons = useTypingStore((s) => s.completedLessons);
  const [, navigate] = useLocation();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const completed = useMemo(() => new Set(completedLessons), [completedLessons]);

  const levelProgress = (level: CurriculumLevel): number => {
    if (level.lessons.length === 0) return 0;
    const done = level.lessons.filter((l) => completed.has(l.id)).length;
    return Math.round((done / level.lessons.length) * 100);
  };

  const isLevelUnlocked = (levelIndex: number): boolean => {
    if (levelIndex === 0) return true;
    const prev = gamifiedCurriculum[levelIndex - 1];
    return prev.lessons.every((l) => completed.has(l.id));
  };

  const isLessonUnlocked = (levelIndex: number, lessonIndex: number): boolean => {
    if (!isLevelUnlocked(levelIndex)) return false;
    if (lessonIndex === 0) return true;
    return completed.has(gamifiedCurriculum[levelIndex].lessons[lessonIndex - 1].id);
  };

  const completedCount = gamifiedCurriculum.reduce(
    (sum, level) => sum + level.lessons.filter((l) => completed.has(l.id)).length,
    0
  );
  const overallPercent = TOTAL_LESSONS > 0 ? Math.round((completedCount / TOTAL_LESSONS) * 100) : 0;

  const startLesson = (lesson: CurriculumLesson) => {
    if (onStartLesson) onStartLesson(lesson);
    else navigate(`/lesson/${encodeURIComponent(lesson.id)}`);
  };

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-medium leading-[1.875rem]">The Ten Realms of Typing</h2>
        <p className="text-base text-muted-foreground">
          Master the art of one-handed typing through your journey across the Ten Realms
        </p>
        <Progress value={overallPercent} aria-label="Overall curriculum progress" />
        <p className="text-sm leading-5 text-muted-foreground">
          Overall progress: {overallPercent}% ({completedCount} of {TOTAL_LESSONS} lessons)
        </p>
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {gamifiedCurriculum.map((level, levelIndex) => {
          const unlocked = isLevelUnlocked(levelIndex);
          const progress = levelProgress(level);
          const isCompleted = progress === 100;
          const expanded = selectedLevel === level.id && unlocked;
          const panelId = `realm-panel-${level.id}`;
          const StateGlyph = isCompleted ? Check : unlocked ? Play : Lock;

          return (
            <article
              key={level.id}
              className={cn('overflow-hidden rounded-lg border bg-card', !unlocked && 'text-muted-foreground')}
            >
              <button
                type="button"
                className="flex w-full flex-col gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-disabled={!unlocked}
                onClick={() => unlocked && setSelectedLevel(expanded ? null : level.id)}
              >
                <span className="sr-only">
                  {unlocked ? '' : 'Locked. '}
                  {`Level ${levelIndex + 1}. ${progress}% complete.`}
                </span>
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: regionAccent(level.id), color: '#1d140d' }}
                  >
                    <StateGlyph aria-hidden="true" className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={cn('font-bold leading-snug', unlocked && 'text-foreground')}>{level.title}</div>
                    <div className="text-sm leading-5 text-muted-foreground">{level.storyTheme.region}</div>
                  </div>
                  <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-md border border-input px-2 text-sm font-bold text-foreground">
                    Level {levelIndex + 1}
                  </span>
                  {unlocked && (
                    <ChevronDown
                      className={cn('h-5 w-5 shrink-0 text-foreground transition-transform', expanded && 'rotate-180')}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">{level.storyTheme.storyline}</p>
                <Progress value={progress} aria-hidden="true" />
                <div className="flex justify-between text-sm leading-5">
                  <span className={isCompleted ? 'font-bold text-success' : 'text-muted-foreground'}>{progress}% complete</span>
                  <span className="text-muted-foreground">{level.lessons.length} lessons</span>
                </div>
                {!unlocked && <p className="text-sm leading-5 text-muted-foreground">Complete the previous realm to unlock.</p>}
              </button>

              {expanded && (
                <div id={panelId} className="flex flex-col gap-2 px-4 pb-4">
                  <h3 className="mt-2 text-lg font-bold leading-[1.625rem] text-foreground">Lessons</h3>
                  <div className="divide-y divide-border border-y">
                    {level.lessons.map((lesson, lessonIndex) => {
                      const lessonUnlocked = isLessonUnlocked(levelIndex, lessonIndex);
                      const lessonCompleted = completed.has(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          className={cn(
                            'flex min-h-[56px] w-full items-center gap-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                            lessonUnlocked ? 'active:bg-secondary' : 'cursor-not-allowed text-muted-foreground',
                          )}
                          onClick={() => lessonUnlocked && startLesson(lesson)}
                          disabled={!lessonUnlocked}
                        >
                          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center', lessonCompleted ? 'text-success' : lessonUnlocked ? 'text-primary' : 'text-muted-foreground')}>
                            {lessonCompleted ? (
                              <Check className="h-5 w-5" aria-hidden="true" />
                            ) : lessonUnlocked ? (
                              <Play className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <Lock className="h-[18px] w-[18px]" aria-hidden="true" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={cn('block font-medium', lessonUnlocked && 'text-foreground')}>{lesson.title}</span>
                            <span className="block text-sm leading-5 text-muted-foreground">
                              {lesson.storyTheme.character} &bull; {lesson.storyTheme.guild}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm leading-5" aria-label="Legend">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Lock className="h-4 w-4" aria-hidden="true" /> Locked
        </span>
        <span className="flex items-center gap-1 text-primary">
          <Play className="h-4 w-4" aria-hidden="true" /> <span className="text-foreground">Available</span>
        </span>
        <span className="flex items-center gap-1 text-success">
          <Check className="h-4 w-4" aria-hidden="true" /> <span className="text-foreground">Completed</span>
        </span>
      </div>
    </div>
  );
}

export { RealmLessonNavigator };
