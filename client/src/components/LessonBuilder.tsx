import { useRef, useState, type ChangeEvent } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import type { Lesson } from '../lib/lessons';
import { Save, Download, Upload, Eye, Pencil, RotateCcw, BookOpen, X } from 'lucide-react';

interface LessonBuilderProps {
  /** Called after the lesson has been saved to the store. */
  onSave?: (lesson: Lesson) => void;
  onClose?: () => void;
  existingLesson?: Lesson;
  className?: string;
}

type Category = 'basics' | 'words' | 'sentences' | 'advanced';
const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'basics', label: 'Basics' },
  { id: 'words', label: 'Words' },
  { id: 'sentences', label: 'Sentences' },
  { id: 'advanced', label: 'Advanced' },
];

interface Draft {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: number;
  content: string;
  targetWpm: number;
  hands: ('left' | 'right')[];
  focusKeys: string[];
}

export const CUSTOM_LESSON_PREFIX = 'custom-lesson-';

function newLessonId(): string {
  return `${CUSTOM_LESSON_PREFIX}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function blankDraft(): Draft {
  return {
    id: newLessonId(),
    title: '',
    description: '',
    category: 'basics',
    difficulty: 1,
    content: '',
    targetWpm: 15,
    hands: ['left', 'right'],
    focusKeys: [],
  };
}

function fromLesson(l: Lesson): Draft {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    category: (CATEGORIES.some((c) => c.id === l.category) ? l.category : 'basics') as Category,
    difficulty: l.difficulty,
    content: l.content,
    targetWpm: l.targetWpm,
    hands: l.handCompatibility.length > 0 ? l.handCompatibility : ['left', 'right'],
    focusKeys: l.focusKeys ?? [],
  };
}

const wordsOf = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Strictly parses an exported lesson file; always assigns a fresh id. */
function parseImportedLesson(text: string): Draft | string {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return 'That file is not valid JSON.';
  }
  if (!isObj(data)) return 'That file is not a lesson.';
  const { title, description, content } = data;
  if (typeof title !== 'string' || typeof description !== 'string' || typeof content !== 'string') {
    return 'That file is missing a title, description or content.';
  }
  if (content.length > 5000) return 'The lesson text is too long.';
  const category = CATEGORIES.find((c) => c.id === data.category)?.id ?? 'basics';
  const clampNum = (v: unknown, min: number, max: number, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
  const hands = Array.isArray(data.handCompatibility)
    ? (data.handCompatibility.filter((h) => h === 'left' || h === 'right') as ('left' | 'right')[])
    : (['left', 'right'] as ('left' | 'right')[]);
  const focus = Array.isArray(data.focusKeys)
    ? data.focusKeys.filter((k): k is string => typeof k === 'string' && k.length > 0 && k.length <= 12).slice(0, 20)
    : [];
  return {
    id: newLessonId(),
    title: title.slice(0, 80),
    description: description.slice(0, 300),
    category,
    difficulty: clampNum(data.difficulty, 1, 5, 1),
    content,
    targetWpm: clampNum(data.targetWpm, 5, 100, 15),
    hands: hands.length > 0 ? hands : ['left', 'right'],
    focusKeys: focus,
  };
}

export default function LessonBuilder({ onSave, onClose, existingLesson, className }: LessonBuilderProps) {
  const addCustomLesson = useTypingStore((s) => s.addCustomLesson);
  const removeCustomLesson = useTypingStore((s) => s.removeCustomLesson);
  const [lesson, setLesson] = useState<Draft>(() => (existingLesson ? fromLesson(existingLesson) : blankDraft()));
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const [focusInput, setFocusInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof Draft>(field: K, value: Draft[K]) => {
    setLesson((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!lesson.title.trim()) next.title = 'Title is required';
    if (!lesson.description.trim()) next.description = 'Description is required';
    if (!lesson.content.trim()) next.content = 'Lesson text is required';
    else if (lesson.content.trim().length < 5) next.content = 'Lesson text must be at least 5 characters';
    if (lesson.hands.length === 0) next.hands = 'Pick at least one hand';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const toLesson = (): Lesson => {
    const content = lesson.content.trim();
    return {
      id: lesson.id,
      title: lesson.title.trim(),
      description: lesson.description.trim(),
      category: lesson.category,
      level: 1,
      difficulty: lesson.difficulty,
      content,
      text: content,
      targetWpm: lesson.targetWpm,
      handCompatibility: lesson.hands,
      focusKeys: lesson.focusKeys,
      wordCount: wordsOf(content),
      estimatedMinutes: Math.max(1, Math.ceil(content.length / 50)),
    };
  };

  const handleSave = () => {
    if (!validate()) return;
    const finalLesson = toLesson();
    if (existingLesson) removeCustomLesson(existingLesson.id);
    addCustomLesson(finalLesson);
    onSave?.(finalLesson);
  };

  const handleExport = () => {
    if (!validate()) return;
    const blob = new Blob([JSON.stringify(toLesson(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lesson-${lesson.title.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Lesson exported.');
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => setNotice('Could not read that file.');
    reader.onload = () => {
      const result = parseImportedLesson(String(reader.result ?? ''));
      if (typeof result === 'string') {
        setNotice(result);
        return;
      }
      setLesson(result);
      setErrors({});
      setNotice('Lesson imported. Review it, then save.');
    };
    reader.readAsText(file);
  };

  const addFocusKey = () => {
    const k = focusInput.trim();
    if (k && !lesson.focusKeys.includes(k) && lesson.focusKeys.length < 20) update('focusKeys', [...lesson.focusKeys, k]);
    setFocusInput('');
  };

  const toggleHand = (hand: 'left' | 'right', on: boolean) =>
    update('hands', on ? [...lesson.hands.filter((h) => h !== hand), hand] : lesson.hands.filter((h) => h !== hand));

  const words = wordsOf(lesson.content);
  const field = (name: string) => (errors[name] ? 'border-destructive' : '');
  const errorText = (name: string) =>
    errors[name] ? (
      <p id={`lb-${name}-err`} role="alert" className="mt-1 text-sm font-medium leading-5 text-destructive">
        {errors[name]}
      </p>
    ) : null;

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold leading-[1.625rem]">
                        {existingLesson ? 'Edit lesson' : 'New lesson'}
          </h3>
          <p className="text-sm text-muted-foreground">Write your own text to practice.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={() => setPreview((p) => !p)}>
            {preview ? <Pencil className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            {preview ? 'Edit' : 'Preview'}
          </Button>
          {onClose && (
            <Button type="button" variant="ghost" className="min-h-[48px] gap-2" onClick={onClose}>
              <X className="h-5 w-5" aria-hidden="true" /> Close
            </Button>
          )}
        </div>
      </div>

      {preview ? (
        <Card className="space-y-3 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="text-lg font-bold">{lesson.title || 'Untitled lesson'}</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{lesson.category}</Badge>
              <Badge variant="outline">Difficulty {lesson.difficulty}/5</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{lesson.description || 'No description yet.'}</p>
          <p className="text-sm text-muted-foreground">
            {lesson.targetWpm} WPM &middot; {words} words &middot; {lesson.hands.join(' & ') || 'no'} hand
          </p>
          <p className="rounded-lg border bg-background p-3 font-mono text-base leading-relaxed">
            {lesson.content || 'No text yet.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="lb-title">Title</Label>
            <Input
              id="lb-title"
              value={lesson.title}
              maxLength={80}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. My home row warm-up"
              className={cn('h-12', field('title'))}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'lb-title-err' : undefined}
            />
            {errorText('title')}
          </div>
          <div>
            <Label htmlFor="lb-description">Description</Label>
            <Textarea
              id="lb-description"
              value={lesson.description}
              maxLength={300}
              onChange={(e) => update('description', e.target.value)}
              placeholder="What is this lesson for?"
              className={cn('min-h-20', field('description'))}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'lb-description-err' : undefined}
            />
            {errorText('description')}
          </div>
          <div>
            <Label htmlFor="lb-content">Text to type</Label>
            <Textarea
              id="lb-content"
              value={lesson.content}
              maxLength={5000}
              onChange={(e) => update('content', e.target.value)}
              placeholder="Type the text you want to practice..."
              className={cn('min-h-32 font-mono', field('content'))}
              aria-invalid={Boolean(errors.content)}
              aria-describedby={errors.content ? 'lb-content-err' : undefined}
            />
            {errorText('content')}
            <p className="mt-1 font-mono text-[0.8125rem] leading-[1.125rem] text-muted-foreground">
              {lesson.content.length} characters &middot; {words} words
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="lb-category">Category</Label>
              <select
                id="lb-category"
                value={lesson.category}
                onChange={(e) => update('category', e.target.value as Category)}
                className="mt-1 h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label id="lb-hands">Works with</Label>
              <div className="mt-1 flex gap-4" role="group" aria-labelledby="lb-hands">
                {(['left', 'right'] as const).map((h) => (
                  <div key={h} className="flex min-h-[48px] items-center gap-2">
                    <Switch id={`lb-${h}`} checked={lesson.hands.includes(h)} onCheckedChange={(on) => toggleHand(h, on)} />
                    <Label htmlFor={`lb-${h}`}>{h === 'left' ? 'Left hand' : 'Right hand'}</Label>
                  </div>
                ))}
              </div>
              {errorText('hands')}
            </div>
          </div>

          <div>
            <Label htmlFor="lb-difficulty">Difficulty: {lesson.difficulty}/5</Label>
            <Slider
              id="lb-difficulty"
              aria-label="Difficulty"
              value={[lesson.difficulty]}
              onValueChange={(v) => update('difficulty', v[0])}
              min={1}
              max={5}
              step={1}
              className="py-3"
            />
          </div>
          <div>
            <Label htmlFor="lb-wpm">Target speed: {lesson.targetWpm} WPM</Label>
            <Slider
              id="lb-wpm"
              aria-label="Target words per minute"
              value={[lesson.targetWpm]}
              onValueChange={(v) => update('targetWpm', v[0])}
              min={5}
              max={100}
              step={5}
              className="py-3"
            />
          </div>

          <div>
            <Label htmlFor="lb-focus">Focus keys (optional)</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="lb-focus"
                value={focusInput}
                maxLength={12}
                onChange={(e) => setFocusInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFocusKey();
                  }
                }}
                placeholder="e.g. f"
                className="h-12"
              />
              <Button type="button" variant="outline" className="min-h-[48px]" onClick={addFocusKey}>
                Add
              </Button>
            </div>
            {lesson.focusKeys.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2" aria-label="Focus keys">
                {lesson.focusKeys.map((k) => (
                  <li key={k}>
                    <button
                      type="button"
                      aria-label={`Remove focus key ${k}`}
                      onClick={() => update('focusKeys', lesson.focusKeys.filter((x) => x !== k))}
                      className="flex min-h-[44px] items-center gap-1 rounded-md border border-input bg-transparent px-3 font-mono text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {k} <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {notice && (
        <p role="status" className="text-sm leading-5 text-muted-foreground">
          {notice}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="button" className="min-h-[48px] flex-1 gap-2" onClick={handleSave}>
          <Save className="h-5 w-5" aria-hidden="true" /> Save lesson
        </Button>
        <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={() => { setLesson(existingLesson ? fromLesson(existingLesson) : blankDraft()); setErrors({}); setNotice(''); }}>
          <RotateCcw className="h-5 w-5" aria-hidden="true" /> Reset
        </Button>
        <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={handleExport}>
          <Download className="h-5 w-5" aria-hidden="true" /> Export
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={handleImport} />
        <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={() => fileRef.current?.click()}>
          <Upload className="h-5 w-5" aria-hidden="true" /> Import
        </Button>
      </div>
    </div>
  );
}
