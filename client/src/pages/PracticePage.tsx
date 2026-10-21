import { useState } from 'react';
import { useLocation } from 'wouter';
import { Clock, Hand, Play, Target, Keyboard, Plus, Trash2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
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

export default function PracticePage() {
  const [, navigate] = useLocation();
  const hand = useTypingStore((s) => s.handPreference);
  const customLessons = useTypingStore((s) => s.customLessons);
  const removeCustomLesson = useTypingStore((s) => s.removeCustomLesson);
  const [building, setBuilding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Lesson | null>(null);

  return (
    <PageContainer>
      <PageHeader
        title="Practice"
        description={`Free practice with any bundled lesson. Hand preference: ${hand}.`}
        icon={<Keyboard className="h-5 w-5" />}
      />

      <div className="space-y-10">
        {CATEGORIES.map((cat) => {
          const items = staticLessons.filter((l) => l.category === cat.id);
          if (items.length === 0) return null;
          const headingId = `practice-${cat.id}`;
          return (
            <section key={cat.id} aria-labelledby={headingId}>
              <div className="mb-4">
                <h2 id={headingId} className="text-xl font-semibold">
                  {cat.title}
                </h2>
                <p className="text-sm text-muted-foreground">{cat.blurb}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((lesson) => {
                  const note = handNote(lesson, hand);
                  return (
                    <Card key={lesson.id} className="flex flex-col justify-between gap-4 p-5">
                      <div>
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-tight">{lesson.title}</h3>
                          <Badge variant="outline" className="shrink-0">
                            {lesson.difficulty}/5
                          </Badge>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">{lesson.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target className="h-3.5 w-3.5" aria-hidden="true" />
                            {lesson.targetWpm} WPM
                          </span>
                          {lesson.estimatedMinutes ? (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              {lesson.estimatedMinutes} min
                            </span>
                          ) : null}
                          <span className={note.ok ? 'flex items-center gap-1' : 'flex items-center gap-1 font-medium text-foreground'}>
                            <Hand className="h-3.5 w-3.5" aria-hidden="true" />
                            {note.text}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="min-h-[48px] w-full"
                        onClick={() => navigate(`/lesson/${encodeURIComponent(lesson.id)}`)}
                        aria-label={`Start ${lesson.title}`}
                      >
                        <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                        Start
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section aria-labelledby="practice-custom" data-section="custom-lessons">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="practice-custom" className="text-xl font-semibold">
                My lessons
              </h2>
              <p className="text-sm text-muted-foreground">Your own practice text, saved on this device.</p>
            </div>
            {!building && (
              <Button type="button" className="min-h-[48px] gap-2" onClick={() => setBuilding(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" /> New lesson
              </Button>
            )}
          </div>

          {building && (
            <Card className="mb-4 p-4">
              <LessonBuilder onSave={() => setBuilding(false)} onClose={() => setBuilding(false)} />
            </Card>
          )}

          {customLessons.length === 0 && !building && (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No lessons yet. Create one to practise exactly the words you need.
            </p>
          )}

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="My lessons">
            {customLessons.map((lesson) => (
              <li key={lesson.id}>
                <Card className="flex h-full flex-col justify-between gap-4 p-5">
                  <div>
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="break-words font-semibold leading-tight">{lesson.title}</h3>
                      <Badge variant="outline" className="shrink-0">
                        {lesson.difficulty}/5
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{lesson.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" aria-hidden="true" />
                        {lesson.targetWpm} WPM
                      </span>
                      <span className="flex items-center gap-1">
                        <Hand className="h-3.5 w-3.5" aria-hidden="true" />
                        {handNote(lesson, hand).text}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="min-h-[48px] flex-1"
                      onClick={() => navigate(`/lesson/${encodeURIComponent(lesson.id)}`)}
                      aria-label={`Start ${lesson.title}`}
                    >
                      <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                      Start
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 text-destructive"
                      aria-label={`Delete ${lesson.title}`}
                      onClick={() => setPendingDelete(lesson)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </Card>
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
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-[48px]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-[48px]"
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
