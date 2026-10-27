import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { unitAccent, unitAccentAlpha } from '../lib/theme';
import {
  Crown,
  Sword,
  Shield,
  Lock,
  CheckCircle,
  Play,
  Star,
  Map as MapIcon,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
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

function getRegionIcon(level: CurriculumLevel) {
  const region = level.title.toLowerCase();
  if (region.includes('hearth')) return <Shield className="h-5 w-5" aria-hidden="true" />;
  if (region.includes('bloom')) return <Star className="h-5 w-5" aria-hidden="true" />;
  if (region.includes('realms') || region.includes('crown')) return <Crown className="h-5 w-5" aria-hidden="true" />;
  if (region.includes('tidebreak')) return <Sword className="h-5 w-5" aria-hidden="true" />;
  return <MapIcon className="h-5 w-5" aria-hidden="true" />;
}

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
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2 text-center">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Crown className="h-6 w-6 text-accent" aria-hidden="true" />
          The Ten Realms of Typing
        </h2>
        <p className="text-muted-foreground">
          Master the art of one-handed typing through your journey across the Ten Realms
        </p>
        <Progress value={overallPercent} className="mx-auto max-w-md" aria-label="Overall curriculum progress" />
        <p className="text-sm text-muted-foreground">
          Overall progress: {overallPercent}% ({completedCount} of {TOTAL_LESSONS} lessons)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gamifiedCurriculum.map((level, levelIndex) => {
          const unlocked = isLevelUnlocked(levelIndex);
          const progress = levelProgress(level);
          const isCompleted = progress === 100;
          const expanded = selectedLevel === level.id && unlocked;
          const panelId = `realm-panel-${level.id}`;

          return (
            <Card
              key={level.id}
              className={cn(
                'overflow-hidden border-l-4 transition-shadow',
                unlocked ? 'hover:shadow-lg' : 'opacity-70',
                expanded && 'ring-2 ring-primary'
              )}
              style={{ borderLeftColor: unitAccent(level.id) }}
            >
              <button
                type="button"
                className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-disabled={!unlocked}
                onClick={() => unlocked && setSelectedLevel(expanded ? null : level.id)}
              >
                <CardHeader className="pb-3">
                  <span className="sr-only">
                    {unlocked ? '' : 'Locked. '}
                    {`Level ${levelIndex + 1}. ${progress}% complete.`}
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ background: unitAccentAlpha(level.id, 0.18), color: unitAccent(level.id) }}
                      >
                        {getRegionIcon(level)}
                      </span>
                      <div>
                        <CardTitle className="text-lg leading-tight">{level.title}</CardTitle>
                        <CardDescription className="text-sm">{level.title}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {!unlocked && <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                      {isCompleted && <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />}
                      {unlocked && (
                        <ChevronDown
                          className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-180')}
                          aria-hidden="true"
                        />
                      )}
                      <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-xs">
                        Level {levelIndex + 1}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{level.theme.tagline}</p>
                  <Progress value={progress} className="h-2" aria-hidden="true" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress}% complete</span>
                    <span>{level.lessons.length} lessons</span>
                  </div>
                  {!unlocked && (
                    <p className="text-xs text-muted-foreground">Complete the previous realm to unlock.</p>
                  )}
                </CardContent>
              </button>

              {expanded && (
                <CardContent id={panelId} className="space-y-2 border-t pt-4">
                  <h3 className="text-sm font-medium">Lessons</h3>
                  {level.lessons.map((lesson, lessonIndex) => {
                    const lessonUnlocked = isLessonUnlocked(levelIndex, lessonIndex);
                    const lessonCompleted = completed.has(lesson.id);
                    return (
                      <Button
                        key={lesson.id}
                        variant={lessonCompleted ? 'default' : 'outline'}
                        className={cn(
                          'h-auto min-h-[48px] w-full justify-between py-2 text-left',
                          !lessonUnlocked && 'cursor-not-allowed opacity-50'
                        )}
                        onClick={() => lessonUnlocked && startLesson(lesson)}
                        disabled={!lessonUnlocked}
                      >
                        <span className="flex items-center gap-2">
                          {lessonCompleted ? (
                            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                          ) : lessonUnlocked ? (
                            <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
                          ) : (
                            <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                          )}
                          <span>
                            <span className="block text-sm font-medium">{lesson.title}</span>
                            <span className="block text-xs opacity-80">
                              {lesson.theme.focusLabel}
                            </span>
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </Button>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" aria-hidden="true" /> Locked
        </span>
        <span className="flex items-center gap-1">
          <Play className="h-3 w-3" aria-hidden="true" /> Available
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-success" aria-hidden="true" /> Completed
        </span>
      </div>
    </div>
  );
}

export { RealmLessonNavigator };
