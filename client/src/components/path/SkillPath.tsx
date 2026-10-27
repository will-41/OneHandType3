import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTypingStore } from '../../lib/stores/useTypingStore';
import { gamifiedCurriculum, unitNumber, type CurriculumUnit } from '../../lib/gamifiedCurriculum';
import {
  isCheckpointCleared,
  isCheckpointUnlocked,
  isLessonUnlocked,
  isUnitUnlocked,
  nextPathItem,
  starsFor,
  unitLessonsDone,
} from '../../lib/mastery';
import {
  STRENGTHEN_ID,
  STRENGTHEN_MIN_LESSONS,
  buildCheckpoint,
  checkpointId,
  isStrengthenUnlocked,
  reachableKeys,
  weakKeys,
} from '../../lib/generatedLessons';
import PathNode, { type NodeKind, type NodeState } from './PathNode';
import UnitHeader from './UnitHeader';
import LessonSheet, { type SheetTarget } from './LessonSheet';

const OFFSET = 56;

interface Stop {
  key: string;
  kind: NodeKind;
  state: NodeState;
  testId: string;
  ariaLabel: string;
  number?: number;
  stars?: 0 | 1 | 2 | 3;
  target: SheetTarget;
}

/** The learner's vertical skill path: ten units of lessons, a weak-key drill and a checkpoint each. */
export default function SkillPath() {
  const completedLessons = useTypingStore((s) => s.completedLessons);
  const lessonProgress = useTypingStore((s) => s.lessonProgress);
  const keyStats = useTypingStore((s) => s.keyStats);
  const hand = useTypingStore((s) => s.handPreference);
  const layout = useTypingStore((s) => s.keyboardLayout);
  const customLayouts = useTypingStore((s) => s.customLayouts);
  const storeReduce = useTypingStore((s) => s.accessibilitySettings.reduceMotion);
  const framerReduce = useReducedMotion();
  const reduceMotion = !!storeReduce || !!framerReduce;

  const [selected, setSelected] = useState<SheetTarget | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const completed = useMemo(() => new Set(completedLessons), [completedLessons]);
  const current = useMemo(
    () => nextPathItem(gamifiedCurriculum, completed, lessonProgress),
    [completed, lessonProgress],
  );
  const reachable = useMemo(() => reachableKeys(hand, layout, customLayouts), [hand, layout, customLayouts]);
  const strengthenUnlocked = isStrengthenUnlocked(completedLessons.length, keyStats, reachable);
  const weak = useMemo(() => weakKeys(keyStats, reachable).map((w) => w.key), [keyStats, reachable]);

  // Bring the current stop into view once, unless the learner hasn't started.
  const didScroll = useRef(false);
  useEffect(() => {
    if (didScroll.current) return;
    didScroll.current = true;
    if (!current || completedLessons.length === 0) return;
    const el = rootRef.current?.querySelector(`[data-testid="${current.kind === 'lesson' ? `path-node-${current.id}` : `path-checkpoint-${current.unitIndex + 1}`}"]`);
    el?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopsFor(unit: CurriculumUnit, unitIndex: number): Stop[] {
    const n = unitNumber(unit);
    const stops: Stop[] = [];

    unit.lessons.forEach((lesson, lessonIndex) => {
      const unlocked = isLessonUnlocked(unitIndex, lessonIndex, gamifiedCurriculum, completed);
      const done = completed.has(lesson.id);
      const entry = lessonProgress[lesson.id];
      const stars = done ? starsFor(lesson, entry) : 0;
      const isCurrent = current?.kind === 'lesson' && current.id === lesson.id;
      const state: NodeState = !unlocked ? 'locked' : done ? 'completed' : isCurrent ? 'current' : 'available';
      const lockedHint = !isUnitUnlocked(unitIndex, gamifiedCurriculum, completed)
        ? `Finish Unit ${n - 1} to unlock`
        : 'Finish the previous lesson first';
      const status = state === 'locked' ? `locked, ${lockedHint}` : state === 'completed' ? `completed, ${stars} of 3 stars` : state === 'current' ? 'next up' : 'available';
      stops.push({
        key: lesson.id,
        kind: 'lesson',
        state,
        testId: `path-node-${lesson.id}`,
        ariaLabel: `Lesson ${lessonIndex + 1}, ${lesson.title}, ${status}`,
        number: lessonIndex + 1,
        stars,
        target: {
          id: lesson.id,
          kind: 'lesson',
          title: lesson.title,
          description: lesson.description,
          unitNumber: n,
          focusKeys: lesson.keyFocus,
          tip: lesson.theme.tip,
          targetWpm: lesson.targetWpm,
          targetAccuracy: lesson.targetAccuracy,
          minutes: lesson.estimatedTime,
          locked: !unlocked,
          lockedHint,
          best: entry ? { wpm: entry.bestWpm, accuracy: entry.bestAccuracy } : undefined,
          stars,
        },
      });
    });

    // Strengthen weak keys
    const sLockedHint =
      completedLessons.length < STRENGTHEN_MIN_LESSONS
        ? `Finish ${STRENGTHEN_MIN_LESSONS} lessons to unlock`
        : "Keep practicing and we'll spot your tricky keys";
    const sEntry = lessonProgress[STRENGTHEN_ID];
    stops.push({
      key: `strengthen-${n}`,
      kind: 'strengthen',
      state: strengthenUnlocked ? 'available' : 'locked',
      testId: `path-strengthen-${n}`,
      ariaLabel: strengthenUnlocked
        ? 'Strengthen weak keys, available'
        : `Strengthen weak keys, locked: ${sLockedHint}`,
      target: {
        id: STRENGTHEN_ID,
        kind: 'strengthen',
        title: 'Strengthen weak keys',
        description: 'A short drill on the keys that trip you up most.',
        unitNumber: n,
        focusKeys: weak,
        tip: '',
        locked: !strengthenUnlocked,
        lockedHint: sLockedHint,
        best: sEntry ? { wpm: sEntry.bestWpm, accuracy: sEntry.bestAccuracy } : undefined,
      },
    });

    // Checkpoint
    const cp = buildCheckpoint(unit);
    const cpId = checkpointId(n);
    const cpUnlocked = isCheckpointUnlocked(unit, completed);
    const cpCleared = isCheckpointCleared(unit, completed, lessonProgress);
    const cpCurrent = current?.kind === 'checkpoint' && current.id === cpId;
    const cpState: NodeState = !cpUnlocked ? 'locked' : cpCleared ? 'completed' : cpCurrent ? 'current' : 'available';
    const cpHint = 'Finish every lesson in this unit first';
    const cpEntry = lessonProgress[cpId];
    stops.push({
      key: cpId,
      kind: 'checkpoint',
      state: cpState,
      testId: `path-checkpoint-${n}`,
      ariaLabel: `Unit ${n} checkpoint, ${cpState === 'locked' ? `locked: ${cpHint}` : cpState === 'completed' ? 'cleared' : cpState === 'current' ? 'next up' : 'available'}`,
      target: {
        id: cpId,
        kind: 'checkpoint',
        title: cp.title,
        description: cp.description,
        unitNumber: n,
        focusKeys: cp.focusKeys ?? [],
        tip: '',
        targetWpm: cp.targetWpm,
        targetAccuracy: cp.targetAccuracy,
        minutes: cp.estimatedMinutes,
        locked: !cpUnlocked,
        lockedHint: cpHint,
        best: cpEntry ? { wpm: cpEntry.bestWpm, accuracy: cpEntry.bestAccuracy } : undefined,
      },
    });
    return stops;
  }

  return (
    <div ref={rootRef} className="space-y-10 pb-24">
      {gamifiedCurriculum.map((unit, unitIndex) => {
        const n = unitNumber(unit);
        const stops = stopsFor(unit, unitIndex);
        const cleared = isCheckpointCleared(unit, completed, lessonProgress);
        return (
          <section key={unit.id} aria-labelledby={`unit-${n}-title`}>
            <UnitHeader unit={unit} lessonsDone={unitLessonsDone(unit, completed)} checkpointCleared={cleared} />
            <ol className="mt-4 flex flex-col items-center">
              {stops.map((stop, i) => {
                const shiftRight = (i % 2 === 0) !== (hand === 'left');
                return (
                  <li key={stop.key} className="flex w-full flex-col items-center">
                    {i > 0 && (
                      <div
                        aria-hidden="true"
                        className="h-6 w-1.5 rounded-full bg-border"
                      />
                    )}
                    <div
                      className="flex justify-center"
                      style={shiftRight ? { marginLeft: OFFSET } : { marginRight: OFFSET }}
                    >
                      <PathNode
                        kind={stop.kind}
                        state={stop.state}
                        unitId={unit.id}
                        testId={stop.testId}
                        ariaLabel={stop.ariaLabel}
                        number={stop.number}
                        stars={stop.stars}
                        reduceMotion={reduceMotion}
                        onSelect={() => setSelected(stop.target)}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
      <LessonSheet target={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
