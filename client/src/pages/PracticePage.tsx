import { useLocation } from 'wouter';
import { Clock, Hand, Play, Target, Keyboard } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import PageContainer from '../components/shell/PageContainer';
import PageHeader from '../components/shell/PageHeader';
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
                          <span className={note.ok ? 'flex items-center gap-1' : 'flex items-center gap-1 text-accent'}>
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

        {/* TODO(phase-3): "My lessons" section — custom lessons from store.customLessons + LessonBuilder. */}
        <section aria-labelledby="practice-custom" hidden data-section="custom-lessons">
          <h2 id="practice-custom" className="text-xl font-semibold">
            My lessons
          </h2>
        </section>
      </div>
    </PageContainer>
  );
}
