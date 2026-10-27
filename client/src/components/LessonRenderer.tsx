import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { type Lesson as LessonType } from '../lib/lessons';
import LessonPage from '../pages/LessonPage';
import { unitNumber, type CurriculumUnit } from '../lib/gamifiedCurriculum';
import {
  STRENGTHEN_ID,
  buildStrengthenLesson,
  checkpointForUnitNumber,
  checkpointId,
  unitNumberFromCheckpointId,
} from '../lib/generatedLessons';
import { useTypingStore } from '../lib/stores/useTypingStore';

interface LessonRendererProps {
  selectedLessonId: string;
  lessons: LessonType[] | undefined | null;
  gamifiedCurriculum: CurriculumUnit[] | undefined;
  onBack: () => void;
}

interface Resolved {
  lesson: LessonType | null;
  next: { id: string; title: string } | null;
}

/** Convert a curriculum lesson to the standard lesson shape (practiceText lines joined by real newlines). */
function fromCurriculum(source: CurriculumUnit['lessons'][number], unitNum: number): LessonType {
  const text = source.practiceText?.join('\n') || source.content || '';
  return {
    id: source.id,
    title: source.title || 'Typing Lesson',
    description: source.description || 'Practice your typing skills',
    content: text,
    text,
    category: 'curriculum',
    level: unitNum,
    difficulty: source.difficulty || 3,
    targetWpm: source.targetWpm || 30,
    targetAccuracy: source.targetAccuracy,
    timeLimit: 60,
    handCompatibility: ['left', 'right'],
    focusKeys: source.keyFocus || [],
    prerequisites: [],
    wordCount: text.split(/\s+/).filter(Boolean).length,
    estimatedMinutes: source.estimatedTime || 5,
    estimatedTime: source.estimatedTime || 5,
  };
}

/**
 * Resolves a lesson id to a lesson plus the next step, then renders the practice screen.
 * Order: bundled -> custom -> unit checkpoint -> strengthen weak keys -> path lesson.
 * On the path, the last lesson of a unit leads to that unit's checkpoint, and a
 * checkpoint leads to the first lesson of the next unit.
 */
export default function LessonRenderer({ selectedLessonId, lessons, gamifiedCurriculum, onBack }: LessonRendererProps) {
  const [, navigate] = useLocation();
  const customLessons = useTypingStore((s) => s.customLessons);

  const { lesson, next } = useMemo<Resolved>(() => {
    const units = gamifiedCurriculum ?? [];

    // Bundled lessons: next is the following entry in the bundled order.
    const bundled = lessons ?? [];
    const bundledIdx = bundled.findIndex((l) => l.id === selectedLessonId);
    if (bundledIdx >= 0) {
      const n = bundled[bundledIdx + 1];
      return { lesson: bundled[bundledIdx], next: n ? { id: n.id, title: n.title } : null };
    }

    const custom = customLessons?.find((l) => l.id === selectedLessonId);
    if (custom) return { lesson: custom, next: null };

    // Unit checkpoint.
    const cpUnit = unitNumberFromCheckpointId(selectedLessonId);
    if (cpUnit !== null) {
      const cp = checkpointForUnitNumber(cpUnit);
      const nextUnit = units.find((u) => unitNumber(u) === cpUnit + 1);
      const first = nextUnit?.lessons[0];
      return { lesson: cp, next: first ? { id: first.id, title: first.title } : null };
    }

    // Strengthen weak keys: built once from the learner's data when the lesson opens
    // (read via getState so finishing it doesn't rebuild the text under the results).
    if (selectedLessonId === STRENGTHEN_ID) {
      const s = useTypingStore.getState();
      const drill = buildStrengthenLesson(s.keyStats, s.handPreference, s.keyboardLayout, s.customLayouts, s.stats.bestWpm);
      return { lesson: drill, next: null };
    }

    // Path lesson.
    for (const unit of units) {
      const idx = unit.lessons.findIndex((l) => l.id === selectedLessonId);
      if (idx < 0) continue;
      const n = unitNumber(unit);
      const following = unit.lessons[idx + 1];
      return {
        lesson: fromCurriculum(unit.lessons[idx], n),
        next: following
          ? { id: following.id, title: following.title }
          : { id: checkpointId(n), title: `Unit ${n} checkpoint` },
      };
    }
    return { lesson: null, next: null };
  }, [selectedLessonId, lessons, gamifiedCurriculum, customLessons]);

  return (
    <LessonPage
      lesson={lesson}
      onBack={onBack}
      nextLesson={next}
      // Replace so "back" from the next lesson still returns to where the user came from.
      onNext={(id) => navigate(`/lesson/${encodeURIComponent(id)}`, { replace: true })}
    />
  );
}
