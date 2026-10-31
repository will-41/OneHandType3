import { useState } from 'react';
import { useLocation } from 'wouter';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import PageContainer from '../components/shell/PageContainer';
import PageHeader from '../components/shell/PageHeader';
import LessonBuilder from '../components/LessonBuilder';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { staticLessons, type Lesson } from '../lib/lessons';
import { useTypingStore } from '../lib/stores/useTypingStore';

const CATEGORIES: { id: Lesson['category']; title: string; blurb: string }[] = [
  { id: 'basics', title: 'Basics', blurb: 'Single-finger drills to build a foundation.' },
  { id: 'words', title: 'Words', blurb: 'Build vocabulary and rhythm.' },
  { id: 'sentences', title: 'Sentences', blurb: 'Flow, punctuation and endurance.' },
  { id: 'advanced', title: 'Advanced', blurb: 'Speed, symbols and stamina.' },
];

function handNote(lesson: Lesson, hand: 'left' | 'right'): { text: string; ok: boolean } {
  const hands = lesson.handCompatibility ?? [];
  if (hands.includes('left') && hands.includes('right')) return { text: 'Works with either hand', ok: true };
  if (hands.includes(hand)) return { text: `${hand === 'left' ? 'Left' : 'Right'} hand`, ok: true };
  const only = hands[0] ?? 'right';
  return { text: `Designed for ${only} hand`, ok: false };
}

const H2 = 'text-lg font-bold leading-[1.625rem]';
const CARD = 'flex flex-col gap-2 rounded-lg border bg-card p-4';

export default function PracticePage() {
  const [, navigate] = useLocation();
  const hand = useTypingStore((s) => s.handPreference);
  const customLessons = useTypingStore((s) => s.customLessons);
  const removeCustomLesson = useTypingStore((s) => s.removeCustomLesson);
  const [building, setBuilding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Lesson | null>(null);

  return (
    <PageContainer>
      <PageHeader title="Practice" description={`Free practice with any bundled lesson. Hand preference: ${hand}.`} />

      <div className="flex flex-col gap-8">
        {CATEGORIES.map((cat) => {
          const items = staticLessons.filter((l) => l.category === cat.id);
          if (items.length === 0) return null;
          const headingId = `practice-${cat.id}`;
          return (
            <section key={cat.id} aria-labelledby={headingId} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 id={headingId} className={H2}>
                  {cat.title}
                </h2>
                <p className="text-sm leading-5 text-muted-foreground">{cat.blurb}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((lesson) => {
                  const note = handNote(lesson, hand);
                  return (
                    <article key={lesson.id} className={CARD}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold leading-snug">{lesson.title}</h3>
                        <Badge variant="outline" className="shrink-0 font-mono font-medium">
                          {lesson.difficulty}/5
                        </Badge>
                      </div>
                      <p className="text-sm leading-5 text-muted-foreground">{lesson.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-5 text-muted-foreground">
                        <span>{lesson.targetWpm} WPM</span>
                        {lesson.estimatedMinutes ? <span>{lesson.estimatedMinutes} min</span> : null}
                        <span className={note.ok ? undefined : 'font-medium text-foreground'}>{note.text}</span>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-1 self-start"
                        onClick={() => navigate(`/lesson/${encodeURIComponent(lesson.id)}`)}
                        aria-label={`Start ${lesson.title}`}
                      >
                        Start
                      </Button>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section aria-labelledby="practice-custom" data-section="custom-lessons" className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="practice-custom" className={H2}>
              My lessons
            </h2>
            <p className="text-sm leading-5 text-muted-foreground">Your own practice text, saved on this device.</p>
          </div>
          {!building && (
            <Button type="button" className="self-start" onClick={() => setBuilding(true)}>
              <Plus className="h-5 w-5" aria-hidden="true" /> New lesson
            </Button>
          )}

          {building && (
            <div className="rounded-lg border bg-card p-4">
              <LessonBuilder onSave={() => setBuilding(false)} onClose={() => setBuilding(false)} />
            </div>
          )}

          {customLessons.length === 0 && !building && (
            <p className="rounded-lg border border-dashed border-input p-4 text-base text-muted-foreground">
              No lessons yet. Create one to practise exactly the words you need.
            </p>
          )}

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="My lessons">
            {customLessons.map((lesson) => (
              <li key={lesson.id}>
                <div className={`${CARD} h-full`}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="break-words text-lg font-bold leading-snug">{lesson.title}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="-mr-3 -mt-2.5 shrink-0 text-destructive"
                      aria-label={`Delete ${lesson.title}`}
                      onClick={() => setPendingDelete(lesson)}
                    >
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </div>
                  <p className="text-sm leading-5 text-muted-foreground">{lesson.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-5 text-muted-foreground">
                    <span>{lesson.targetWpm} WPM</span>
                    <span>{handNote(lesson, hand).text}</span>
                    <Badge variant="outline" className="font-mono font-medium">
                      {lesson.difficulty}/5
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-1 self-start"
                    onClick={() => navigate(`/lesson/${encodeURIComponent(lesson.id)}`)}
                    aria-label={`Start ${lesson.title}`}
                  >
                    Start
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; will be removed from this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground active:bg-destructive/80"
              onClick={() => {
                if (pendingDelete) removeCustomLesson(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete lesson
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
