import { gamifiedCurriculum, unitNumber } from './gamifiedCurriculum';
import { countThreeStarLessons, isCheckpointCleared, isUnitCleared, type ProgressMap } from './mastery';
import { STRENGTHEN_ID } from './generatedLessons';

/**
 * Achievements reward effort, accuracy and improvement. They are spread across
 * meaningful milestones and never reward time pressure. Rhythm achievements use
 * the forgiving daily rhythm (lib/rhythm.ts): one missed day a week is an
 * automatic rest day, so real life never wipes out progress.
 *
 * Pacing rules (see `evaluateAchievements`):
 *  - the very first completed lesson unlocks only "First Steps";
 *  - at most `MAX_UNLOCKS_PER_RUN` achievements unlock per finished lesson; anything
 *    else that is already earned simply unlocks after the next lesson.
 */

export type AchievementCategory = 'milestone' | 'unit' | 'accuracy' | 'speed' | 'rhythm' | 'explore';

export interface Achievement {
  id: string;
  title: string;
  /** What you did to earn it. */
  description: string;
  /** Plain-language requirement, shown while locked (transparency). */
  requirement: string;
  category: AchievementCategory;
}

export interface RecentResult {
  lessonId: string;
  wpm: number;
  accuracy: number;
}

/** Everything the checks need; built by the store after each completed lesson. */
export interface AchievementContext {
  completedLessons: string[];
  totalMinutes: number;
  lessonCompletions: Record<string, number>;
  /** Newest last. */
  recent: RecentResult[];
  keyboardLayout: string;
  customLayoutIds: string[];
  /** Best results per lesson id (stars, checkpoints). */
  lessonProgress: ProgressMap;
  /** Daily rhythm (see lib/rhythm.ts). */
  rhythm: { currentDays: number; bestDays: number };
}

export const MAX_UNLOCKS_PER_RUN = 2;

interface Def extends Achievement {
  test: (ctx: AchievementContext) => boolean;
}

/** Last `n` runs all had at least `min` percent accuracy. */
function accuracyStreak(ctx: AchievementContext, n: number, min: number): boolean {
  if (ctx.recent.length < n) return false;
  return ctx.recent.slice(-n).every((r) => r.accuracy >= min);
}

/** Some run reached `wpm` while staying accurate (speed never counts at the cost of accuracy). */
function steadySpeed(ctx: AchievementContext, wpm: number): boolean {
  return ctx.recent.some((r) => r.wpm >= wpm && r.accuracy >= 90);
}

const lessonCount = (ctx: AchievementContext) => ctx.completedLessons.length;

const milestoneDefs: Def[] = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'You finished your first lesson.',
    requirement: 'Complete any lesson.',
    category: 'milestone',
    test: (c) => lessonCount(c) >= 1,
  },
  {
    id: 'lessons-5',
    title: 'Finding Your Rhythm',
    description: 'Five different lessons completed.',
    requirement: 'Complete 5 different lessons.',
    category: 'milestone',
    test: (c) => lessonCount(c) >= 5,
  },
  {
    id: 'lessons-10',
    title: 'Ten Down',
    description: 'Ten different lessons completed.',
    requirement: 'Complete 10 different lessons.',
    category: 'milestone',
    test: (c) => lessonCount(c) >= 10,
  },
  {
    id: 'lessons-25',
    title: 'Course Navigator',
    description: 'Twenty-five different lessons completed.',
    requirement: 'Complete 25 different lessons.',
    category: 'milestone',
    test: (c) => lessonCount(c) >= 25,
  },
  {
    id: 'practice-30m',
    title: 'Half an Hour In',
    description: 'You have practised for 30 minutes in total.',
    requirement: 'Practise for 30 minutes in total, at your own pace.',
    category: 'milestone',
    test: (c) => c.totalMinutes >= 30,
  },
  {
    id: 'practice-2h',
    title: 'Steady Practice',
    description: 'You have practised for 2 hours in total.',
    requirement: 'Practise for 2 hours in total, across any number of days.',
    category: 'milestone',
    test: (c) => c.totalMinutes >= 120,
  },
];

const unitDefs: Def[] = gamifiedCurriculum.map((unit) => {
  const n = unitNumber(unit);
  return {
    id: `unit-${n}`,
    title: `Unit cleared: ${unit.title}`,
    description: `You finished every lesson in ${unit.title} and passed its checkpoint.`,
    requirement: `Complete all ${unit.lessons.length} lessons in Unit ${n} (${unit.title}) and pass the Unit ${n} checkpoint.`,
    category: 'unit' as const,
    test: (c: AchievementContext) => isUnitCleared(unit, new Set(c.completedLessons), c.lessonProgress),
  };
});

const pathDefs: Def[] = [
  {
    id: 'checkpoint-first',
    title: 'Checkpoint Passed',
    description: 'You passed your first unit checkpoint.',
    requirement: 'Pass any unit checkpoint at its accuracy target.',
    category: 'unit',
    test: (c) => gamifiedCurriculum.some((u) => isCheckpointCleared(u, new Set(c.completedLessons), c.lessonProgress)),
  },
  {
    id: 'stars-3-first',
    title: 'Three Stars',
    description: 'You earned all three stars on a lesson.',
    requirement: 'Reach both the accuracy and speed targets on any path lesson.',
    category: 'accuracy',
    test: (c) => countThreeStarLessons(gamifiedCurriculum, c.lessonProgress) >= 1,
  },
  {
    id: 'stars-3-ten',
    title: 'Star Collector',
    description: 'Ten lessons mastered with three stars.',
    requirement: 'Earn three stars on 10 different path lessons.',
    category: 'accuracy',
    test: (c) => countThreeStarLessons(gamifiedCurriculum, c.lessonProgress) >= 10,
  },
];

const rhythmDefs: Def[] = [
  {
    id: 'rhythm-7',
    title: 'Week of Rhythm',
    description: 'You kept your daily rhythm for 7 days.',
    requirement: 'Reach your daily goal on 7 days in a row (one rest day a week is allowed).',
    category: 'rhythm',
    test: (c) => c.rhythm.bestDays >= 7,
  },
  {
    id: 'rhythm-30',
    title: 'Month of Rhythm',
    description: 'You kept your daily rhythm for 30 days.',
    requirement: 'Reach your daily goal on 30 days in a row (one rest day a week is allowed).',
    category: 'rhythm',
    test: (c) => c.rhythm.bestDays >= 30,
  },
];

const accuracyDefs: Def[] = [
  {
    id: 'accuracy-steady-3',
    title: 'Steady Hands',
    description: 'Three lessons in a row at 90% accuracy or better.',
    requirement: 'Finish 3 lessons in a row with at least 90% accuracy.',
    category: 'accuracy',
    test: (c) => accuracyStreak(c, 3, 90),
  },
  {
    id: 'accuracy-careful-5',
    title: 'Careful Typist',
    description: 'Five lessons in a row at 95% accuracy or better.',
    requirement: 'Finish 5 lessons in a row with at least 95% accuracy.',
    category: 'accuracy',
    test: (c) => accuracyStreak(c, 5, 95),
  },
  {
    id: 'accuracy-flawless',
    title: 'Flawless Run',
    description: 'A lesson with no mistakes at all.',
    requirement: 'Finish a lesson with 100% accuracy (after your first lesson).',
    category: 'accuracy',
    test: (c) => lessonCount(c) >= 2 && c.recent.some((r) => r.accuracy >= 100),
  },
];

const speedDefs: Def[] = [15, 25, 40, 60].map((wpm) => ({
  id: `speed-${wpm}`,
  title: { 15: 'Warming Up', 25: 'Finding Your Pace', 40: 'Swift Hand', 60: 'Fleet Fingers' }[wpm] as string,
  description: `You reached ${wpm} words per minute with at least 90% accuracy.`,
  requirement: `Reach ${wpm} WPM in a lesson while keeping accuracy at 90% or higher (after your first lesson).`,
  category: 'speed' as const,
  test: (c: AchievementContext) => lessonCount(c) >= 2 && steadySpeed(c, wpm),
}));

const exploreDefs: Def[] = [
  {
    id: 'practice-again',
    title: 'Practice Makes Progress',
    description: 'You came back to a lesson you had already finished.',
    requirement: 'Complete the same lesson a second time.',
    category: 'explore',
    test: (c) => Object.values(c.lessonCompletions).some((n) => n >= 2),
  },
  {
    id: 'custom-layout',
    title: 'Made It Yours',
    description: 'You finished a lesson on a keyboard layout you designed.',
    requirement: 'Build a custom layout in Settings, select it, then complete a lesson.',
    category: 'explore',
    test: (c) => c.customLayoutIds.includes(c.keyboardLayout),
  },
  {
    id: 'strengthen-first',
    title: 'Weak Spots, Stronger',
    description: 'You finished a Strengthen weak keys session.',
    requirement: 'Complete a Strengthen weak keys session from the Learn path.',
    category: 'explore',
    test: (c) => c.completedLessons.includes(STRENGTHEN_ID),
  },
];

const defs: Def[] = [...milestoneDefs, ...unitDefs, ...pathDefs, ...accuracyDefs, ...speedDefs, ...rhythmDefs, ...exploreDefs];

/** Public catalog (without the check functions). */
export const achievements: Achievement[] = defs.map(({ test: _test, ...a }) => a);

export const achievementCategoryLabels: Record<AchievementCategory, string> = {
  milestone: 'Milestones',
  unit: 'Units',
  accuracy: 'Accuracy',
  speed: 'Pace',
  rhythm: 'Rhythm',
  explore: 'Exploring',
};

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

/**
 * Returns the ids to unlock now, honouring the pacing rules above.
 * Definitions are ordered by importance, so milestones win ties.
 */
export function evaluateAchievements(ctx: AchievementContext, alreadyUnlocked: readonly string[]): string[] {
  const have = new Set(alreadyUnlocked);
  const earned = defs.filter((d) => !have.has(d.id) && d.test(ctx));
  // First lesson ever: celebrate that alone.
  if (ctx.completedLessons.length <= 1) {
    return earned.filter((d) => d.id === 'first-lesson').map((d) => d.id);
  }
  return earned.slice(0, MAX_UNLOCKS_PER_RUN).map((d) => d.id);
}
