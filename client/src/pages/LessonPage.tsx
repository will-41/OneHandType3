import { ArrowLeft } from 'lucide-react';
import { type Lesson } from '../lib/lessons';
import PracticeScreen from '../components/practice/PracticeScreen';

interface LessonPageProps {
  lesson: Lesson | null;
  onBack: () => void;
  nextLesson?: { id: string; title: string } | null;
  onNext?: (lessonId: string) => void;
}

/** Route-level wrapper: renders the practice screen, or a friendly not-found state. */
export default function LessonPage({ lesson, onBack, nextLesson, onNext }: LessonPageProps) {
  if (!lesson) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
        <h1 className="font-display text-2xl font-medium leading-[1.875rem]">Lesson not found</h1>
        <p className="max-w-sm text-muted-foreground">We could not find that lesson. It may have been renamed or removed.</p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-primary px-5 font-bold text-primary-foreground active:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          Go back
        </button>
      </div>
    );
  }

  return (
    <PracticeScreen
      lessonId={lesson.id}
      title={lesson.title}
      text={lesson.content || lesson.text || ''}
      targetWpm={lesson.targetWpm}
      onBack={onBack}
      nextLesson={nextLesson}
      onNext={onNext}
    />
  );
}
