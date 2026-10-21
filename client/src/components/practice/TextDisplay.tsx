import { memo, useEffect, useMemo, useRef } from 'react';
import { cn } from '../../lib/utils';

interface TextDisplayProps {
  text: string;
  typed: string;
  reduceMotion: boolean;
}

interface Group {
  start: number;
  end: number;
  lineBreak: boolean;
}

/** Split text into word groups (word + trailing spaces [+ newline]) so lines wrap only between words. */
function buildGroups(text: string): Group[] {
  const groups: Group[] = [];
  const n = text.length;
  let i = 0;
  while (i < n) {
    const start = i;
    while (i < n && text[i] !== ' ' && text[i] !== '\n') i++;
    while (i < n && text[i] === ' ') i++;
    let lineBreak = false;
    if (i < n && text[i] === '\n') {
      i++;
      lineBreak = true;
    }
    groups.push({ start, end: i, lineBreak });
  }
  return groups;
}

type CharState = 'pending' | 'correct' | 'incorrect' | 'current';

const CharCell = memo(function CharCell({ ch, state }: { ch: string; state: CharState }) {
  const isSpace = ch === ' ';
  const isNewline = ch === '\n';
  // Spaces and newlines get a visible marker only when relevant (current / wrong).
  let shown = ch;
  if (isSpace) shown = state === 'incorrect' || state === 'current' ? '␣' : ' ';
  if (isNewline) shown = '↵';

  return (
    <span
      data-state={state}
      data-current={state === 'current' ? 'true' : undefined}
      className={cn(
        'inline-block whitespace-pre rounded-[0.2em] text-center',
        state === 'pending' && 'text-muted-foreground/70',
        state === 'correct' && 'text-foreground',
        state === 'incorrect' &&
          'bg-destructive/15 text-destructive underline decoration-2 underline-offset-[0.2em]',
        state === 'current' && 'practice-caret bg-primary/15 text-foreground',
        (isNewline || (isSpace && state !== 'incorrect' && state !== 'current')) && 'opacity-60',
      )}
      style={{ minWidth: '1ch' }}
    >
      {shown}
    </span>
  );
});

/**
 * Monospace lesson text. Characters are grouped by word so wrapping never
 * breaks mid-word; the viewport shows ~4 lines and keeps the current line in view.
 */
export default function TextDisplay({ text, typed, reduceMotion }: TextDisplayProps) {
  const groups = useMemo(() => buildGroups(text), [text]);
  const boxRef = useRef<HTMLDivElement>(null);
  const caretIndex = typed.length;

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const cur = box.querySelector<HTMLElement>('[data-current="true"]');
    if (!cur) return;
    const lineHeight = cur.offsetHeight || 32;
    // Keep one finished line visible above the caret.
    const target = Math.max(0, cur.offsetTop - lineHeight * 1.1);
    box.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [caretIndex, reduceMotion]);

  const stateOf = (i: number): CharState => {
    if (i < typed.length) return typed[i] === text[i] ? 'correct' : 'incorrect';
    return i === typed.length ? 'current' : 'pending';
  };

  return (
    <div
      ref={boxRef}
      data-testid="practice-text"
      className="relative mx-auto max-h-[8.6em] w-full max-w-3xl overflow-hidden font-mono text-[1.375rem] leading-[2.15] tracking-normal sm:text-[1.75rem]"
      aria-hidden="true"
    >
      <style>{`
        @keyframes practice-caret { 0%,100% { box-shadow: inset 0 -0.14em 0 hsl(var(--primary)); } 50% { box-shadow: inset 0 -0.14em 0 hsl(var(--primary) / 0.25); } }
        .practice-caret { animation: practice-caret 1.1s ease-in-out infinite; box-shadow: inset 0 -0.14em 0 hsl(var(--primary)); }
      `}</style>
      {groups.map((g) => {
        const cells: JSX.Element[] = [];
        for (let i = g.start; i < g.end; i++) {
          cells.push(<CharCell key={i} ch={text[i]} state={stateOf(i)} />);
        }
        return (
          <span key={g.start}>
            <span className="inline-block whitespace-nowrap">{cells}</span>
            {g.lineBreak && <br />}
          </span>
        );
      })}
    </div>
  );
}
