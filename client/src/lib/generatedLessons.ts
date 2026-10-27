import type { Lesson } from './lessons';
import { gamifiedCurriculum, unitNumber, type CurriculumUnit } from './gamifiedCurriculum';
import { resolveLayout, type CustomKeyboardLayout, type LayoutId } from './customLayouts';
import { layoutKeys, resolveMirrorLayer } from '../components/practice/inputUtils';
import { wordsContaining } from './wordBank';

/**
 * Lessons generated at runtime: one checkpoint per unit, and an adaptive
 * "Strengthen weak keys" drill built from the learner's own mistakes.
 *
 * Note: this module must never import the store (the store imports it).
 */

export const CHECKPOINT_XP = 60;
export const STRENGTHEN_XP = 30;
export const STRENGTHEN_ID = 'strengthen-weak-keys';
export const STRENGTHEN_MIN_LESSONS = 3;
export const STRENGTHEN_MIN_KEYS = 2;
const WEAK_MIN_MISSES = 3;
const WEAK_MIN_RATE = 0.15;
const WEAK_MAX_KEYS = 5;

export type KeyStats = Record<string, { hits: number; misses: number }>;

/** A generated lesson also carries its accuracy target (curriculum lessons do too). */
export interface GeneratedLesson extends Lesson {
  targetAccuracy: number;
  practiceText: string[];
}

export const checkpointId = (n: number): string => `checkpoint-${n}`;
export const isCheckpointId = (id: string): boolean => /^checkpoint-\d+$/.test(id);
export function unitNumberFromCheckpointId(id: string): number | null {
  const m = /^checkpoint-(\d+)$/.exec(id);
  return m ? parseInt(m[1], 10) : null;
}

function estimateMinutes(lines: string[], targetWpm: number): number {
  const chars = lines.join('\n').length;
  return Math.max(2, Math.ceil((chars / (Math.max(1, targetWpm) * 5)) * 1.5));
}

function makeLesson(fields: {
  id: string;
  title: string;
  description: string;
  level: number;
  lines: string[];
  targetWpm: number;
  targetAccuracy: number;
  focusKeys: string[];
  difficulty: number;
}): GeneratedLesson {
  const text = fields.lines.join('\n');
  const minutes = estimateMinutes(fields.lines, fields.targetWpm);
  return {
    id: fields.id,
    title: fields.title,
    description: fields.description,
    category: 'curriculum',
    level: fields.level,
    difficulty: fields.difficulty,
    content: text,
    text,
    practiceText: fields.lines,
    targetWpm: fields.targetWpm,
    targetAccuracy: fields.targetAccuracy,
    timeLimit: 60,
    handCompatibility: ['left', 'right'],
    focusKeys: fields.focusKeys,
    prerequisites: [],
    wordCount: text.split(/\s+/).filter(Boolean).length,
    estimatedMinutes: minutes,
    estimatedTime: minutes,
  };
}

/** Unit checkpoint: line 1 of every lesson in the unit, plus line 2 of the last lesson. */
export function buildCheckpoint(unit: CurriculumUnit): GeneratedLesson {
  const n = unitNumber(unit);
  const last = unit.lessons[unit.lessons.length - 1];
  const lines = [
    ...unit.lessons.map((l) => l.practiceText[0]).filter(Boolean),
    last.practiceText[1] ?? last.practiceText[0],
  ];
  return makeLesson({
    id: checkpointId(n),
    title: `Unit ${n} checkpoint`,
    description: `A short mixed review of ${unit.title}. Pass it to clear the unit.`,
    level: n,
    lines,
    targetWpm: Math.max(...unit.lessons.map((l) => l.targetWpm)),
    targetAccuracy: Math.max(...unit.lessons.map((l) => l.targetAccuracy)),
    focusKeys: [...new Set(unit.lessons.flatMap((l) => l.keyFocus))],
    difficulty: Math.max(...unit.lessons.map((l) => l.difficulty)),
  });
}

export function checkpointForUnitNumber(n: number): GeneratedLesson | null {
  const unit = gamifiedCurriculum.find((u) => unitNumber(u) === n);
  return unit ? buildCheckpoint(unit) : null;
}

/** Characters the learner can produce on their current layout (primary + mirror layer). */
export function reachableKeys(
  hand: 'left' | 'right',
  layoutId: LayoutId,
  customLayouts: readonly CustomKeyboardLayout[],
): Set<string> {
  // ARTSEY is chorded: chords cover the whole alphabet.
  if (layoutId === 'artsey') return new Set('abcdefghijklmnopqrstuvwxyz'.split(''));
  const primary = resolveLayout(hand, layoutId, customLayouts);
  const mirror = resolveMirrorLayer(hand, layoutId, customLayouts, primary);
  const keys = new Set<string>();
  for (const k of layoutKeys(primary)) keys.add(k.key.toLowerCase());
  if (mirror) for (const k of layoutKeys(mirror)) keys.add(k.key.toLowerCase());
  return keys;
}

/** Keys the learner misses most (rate >= 15%, at least 3 misses), worst first, max 5. */
export function weakKeys(keyStats: KeyStats, reachable: ReadonlySet<string>): { key: string; missRate: number }[] {
  return Object.entries(keyStats)
    .map(([key, s]) => ({ key, missRate: s.hits + s.misses > 0 ? s.misses / (s.hits + s.misses) : 0, misses: s.misses }))
    .filter((k) => k.misses >= WEAK_MIN_MISSES && k.missRate >= WEAK_MIN_RATE && reachable.has(k.key))
    .sort((a, b) => b.missRate - a.missRate || a.key.localeCompare(b.key))
    .slice(0, WEAK_MAX_KEYS)
    .map(({ key, missRate }) => ({ key, missRate }));
}

export function isStrengthenUnlocked(
  completedCount: number,
  keyStats: KeyStats,
  reachable: ReadonlySet<string>,
): boolean {
  return completedCount >= STRENGTHEN_MIN_LESSONS && weakKeys(keyStats, reachable).length >= STRENGTHEN_MIN_KEYS;
}

const ANCHORS = ['f', 'j', 'd', 'k'];

/** Adaptive drill for the learner's weakest keys, or null if there aren't enough yet. */
export function buildStrengthenLesson(
  keyStats: KeyStats,
  hand: 'left' | 'right',
  layoutId: LayoutId,
  customLayouts: readonly CustomKeyboardLayout[],
  bestWpm: number,
): GeneratedLesson | null {
  const reachable = reachableKeys(hand, layoutId, customLayouts);
  const weak = weakKeys(keyStats, reachable).map((w) => w.key);
  if (weak.length < STRENGTHEN_MIN_KEYS) return null;

  const anchors = ANCHORS.filter((a) => reachable.has(a));
  const lines: string[] = [];
  // 1. Isolated drills, two keys per line.
  for (let i = 0; i < weak.length; i += 2) {
    lines.push(weak.slice(i, i + 2).map((k) => `${k}${k} ${k}${k} ${k}${k}`).join(' '));
  }
  // 2. Bigrams with home-row anchors.
  if (anchors.length) lines.push(weak.flatMap((k) => anchors.slice(0, 2).map((a) => `${a}${k}`)).join(' '));
  // 3. Real words, 4. a short sentence (letters only).
  const words = wordsContaining(weak, 8);
  if (words.length) {
    lines.push(words.join(' '));
    const sentence = words.slice(0, 6).join(' ');
    lines.push(`${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`);
  }

  return makeLesson({
    id: STRENGTHEN_ID,
    title: 'Strengthen weak keys',
    description: `Targeted practice for the keys you miss most: ${weak.map((k) => k.toUpperCase()).join(', ')}.`,
    level: 0,
    lines,
    targetWpm: Math.max(10, Math.round(bestWpm * 0.8)),
    targetAccuracy: 92,
    focusKeys: weak,
    difficulty: 3,
  });
}
