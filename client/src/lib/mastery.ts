import type { LessonProgressEntry } from './stores/useTypingStore';
import type { CurriculumUnit } from './gamifiedCurriculum';
import { unitNumber } from './gamifiedCurriculum';
import { buildCheckpoint, checkpointId } from './generatedLessons';

/**
 * Mastery stars and path rules. All derived from persisted progress; nothing new
 * is stored.
 *
 *  stars: 0 not completed · 1 completed · 2 best accuracy >= target ·
 *         3 best accuracy >= target AND best WPM >= target
 *  unit unlocked: previous unit's lessons all completed (the checkpoint is not a gate)
 *  unit cleared: all lessons completed AND checkpoint passed at its accuracy target
 */

export interface Targets {
  targetWpm: number;
  targetAccuracy: number;
}
export type Stars = 0 | 1 | 2 | 3;
export type ProgressMap = Record<string, Pick<LessonProgressEntry, 'bestWpm' | 'bestAccuracy'>>;

export function starsFor(target: Targets, entry: Pick<LessonProgressEntry, 'bestWpm' | 'bestAccuracy'> | undefined): Stars {
  if (!entry) return 0;
  if (entry.bestAccuracy < target.targetAccuracy) return 1;
  if (entry.bestWpm < target.targetWpm) return 2;
  return 3;
}

export function nextStarHint(target: Targets, stars: Stars): string | null {
  if (stars === 0) return 'Complete the lesson for your first star';
  if (stars === 1) return `Reach ${target.targetAccuracy}% accuracy for 2 stars`;
  if (stars === 2) return `Reach ${target.targetWpm} WPM for 3 stars`;
  return null;
}

export function unitLessonsDone(unit: CurriculumUnit, completed: ReadonlySet<string>): number {
  return unit.lessons.filter((l) => completed.has(l.id)).length;
}

export function isUnitUnlocked(unitIndex: number, units: readonly CurriculumUnit[], completed: ReadonlySet<string>): boolean {
  if (unitIndex <= 0) return true;
  const prev = units[unitIndex - 1];
  return !!prev && prev.lessons.every((l) => completed.has(l.id));
}

export function isLessonUnlocked(
  unitIndex: number,
  lessonIndex: number,
  units: readonly CurriculumUnit[],
  completed: ReadonlySet<string>,
): boolean {
  if (!isUnitUnlocked(unitIndex, units, completed)) return false;
  if (lessonIndex <= 0) return true;
  const prev = units[unitIndex]?.lessons[lessonIndex - 1];
  return !!prev && completed.has(prev.id);
}

export function isCheckpointUnlocked(unit: CurriculumUnit, completed: ReadonlySet<string>): boolean {
  return unit.lessons.every((l) => completed.has(l.id));
}

export function isCheckpointCleared(unit: CurriculumUnit, completed: ReadonlySet<string>, progress: ProgressMap): boolean {
  const id = checkpointId(unitNumber(unit));
  const entry = progress[id];
  if (!completed.has(id) || !entry) return false;
  return entry.bestAccuracy >= buildCheckpoint(unit).targetAccuracy;
}

export function isUnitCleared(unit: CurriculumUnit, completed: ReadonlySet<string>, progress: ProgressMap): boolean {
  return isCheckpointUnlocked(unit, completed) && isCheckpointCleared(unit, completed, progress);
}

export function countThreeStarLessons(units: readonly CurriculumUnit[], progress: ProgressMap): number {
  let n = 0;
  for (const unit of units) for (const l of unit.lessons) if (starsFor(l, progress[l.id]) === 3) n++;
  return n;
}

export type PathItem =
  | { kind: 'lesson'; id: string; title: string; unitIndex: number; lessonIndex: number }
  | { kind: 'checkpoint'; id: string; title: string; unitIndex: number };

/**
 * The learner's next step on the path: the first unfinished lesson in order,
 * otherwise the first unit whose checkpoint isn't cleared yet. null = all cleared.
 */
export function nextPathItem(
  units: readonly CurriculumUnit[],
  completed: ReadonlySet<string>,
  progress: ProgressMap,
): PathItem | null {
  for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
    const unit = units[unitIndex];
    const lessonIndex = unit.lessons.findIndex((l) => !completed.has(l.id));
    if (lessonIndex >= 0) {
      const l = unit.lessons[lessonIndex];
      return { kind: 'lesson', id: l.id, title: l.title, unitIndex, lessonIndex };
    }
  }
  for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
    const unit = units[unitIndex];
    if (!isCheckpointCleared(unit, completed, progress)) {
      const n = unitNumber(unit);
      return { kind: 'checkpoint', id: checkpointId(n), title: `Unit ${n} checkpoint`, unitIndex };
    }
  }
  return null;
}
