import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { type Lesson as LessonType } from '../lib/lessons';
import LessonPage from '../pages/LessonPage';
import { type CurriculumLevel } from '../lib/gamifiedCurriculum';
import { useTypingStore } from '../lib/stores/useTypingStore';

interface LessonRendererProps {
  selectedLessonId: string;
  lessons: LessonType[] | undefined | null;
  gamifiedCurriculum: CurriculumLevel[] | undefined;
  onBack: () => void;
}

interface Resolved {
  lesson: LessonType | null;
  next: { id: string; title: string } | null;
}

/** Convert a curriculum lesson to the standard lesson shape (practiceText lines joined by real newlines). */
function fromCurriculum(source: CurriculumLevel['lessons'][number], levelNum: number): LessonType {
  const text = source.practiceText?.join('\n') || source.content || '';
  return {
    id: source.id,
    title: source.title || 'Typing Lesson',
    description: source.description || 'Practice your typing skills',
    content: text,
    text,
    category: 'curriculum',
    level: levelNum,
    difficulty: source.difficulty || 3,
    targetWpm: source.targetWpm || 30,
    timeLimit: 60,
    handCompatibility: ['left', 'right'],
    focusKeys: source.keyFocus || [],
    prerequisites: source.prerequisites || [],
    wordCount: text.split(/\s+/).filter(Boolean).length,
    estimatedMinutes: source.estimatedTime || 5,
    estimatedTime: source.estimatedTime || 5,
  };
}

function levelNumber(level: CurriculumLevel): number {
  const n = parseInt(level.id.split('-')[1] ?? '', 10);
  return Number.isNaN(n) ? 1 : n;
}

/**
 * Resolves a lesson id to a lesson (bundled, custom or curriculum) plus the
 * next lesson in the same list, then renders the practice screen.
 */
export default function LessonRenderer({ selectedLessonId, lessons, gamifiedCurriculum, onBack }: LessonRendererProps) {
  const [, navigate] = useLocation();
  const customLessons = useTypingStore((s) => s.customLessons);

  const { lesson, next } = useMemo<Resolved>(() => {
    // Bundled lessons: next is the following entry in the bundled order.
    const bundled = lessons ?? [];
    const bundledIdx = bundled.findIndex((l) => l.id === selectedLessonId);
    if (bundledIdx >= 0) {
      const n = bundled[bundledIdx + 1];
      return { lesson: bundled[bundledIdx], next: n ? { id: n.id, title: n.title } : null };
    }

    const custom = customLessons?.find((l) => l.id === selectedLessonId);
    if (custom) return { lesson: custom, next: null };

    // Curriculum: next is the following lesson, continuing into the next level.
    const flat: { lesson: CurriculumLevel['lessons'][number]; level: number }[] = [];
    for (const level of gamifiedCurriculum ?? []) {
      for (const l of level?.lessons ?? []) if (l) flat.push({ lesson: l, level: levelNumber(level) });
    }
    const idx = flat.findIndex((f) => f.lesson.id === selectedLessonId);
    if (idx >= 0) {
      const n = flat[idx + 1];
      return {
        lesson: fromCurriculum(flat[idx].lesson, flat[idx].level),
        next: n ? { id: n.lesson.id, title: n.lesson.title } : null,
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
