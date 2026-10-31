import { memo, useEffect, useMemo, useRef } from 'react';
import { CornerDownLeft } from 'lucide-react';
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
  // A space shows a bracket marker only when it is the current or a wrong character; a newline shows its return arrow.
  const spaceMarker = isSpace && (state === 'current' || state === 'incorrect');

  return (
    <span
      data-state={state}
      data-current={state === 'current' ? 'true' : undefined}
      className={cn(
        'relative inline-flex h-11 min-w-[1ch] items-center justify-center whitespace-pre align-top',
        state === 'pending' && 'text-muted-foreground',
        state === 'correct' && 'text-foreground',
        state === 'incorrect' && 'text-destructive underline decoration-2 underline-offset-[6px]',
        // The caret is a 2 px bar at the left edge of the current character.
        state === 'current' && 'text-muted-foreground before:absolute before:-left-px before:top-2 before:h-7 before:w-0.5 before:bg-foreground before:content-[""]',
        spaceMarker && 'after:absolute after:inset-x-[3px] after:bottom-2.5 after:h-[5px] after:border-2 after:border-t-0 after:border-muted-foreground after:content-[""]',
        isNewline && 'text-muted-foreground',
      )}
    >
      {isNewline ? <CornerDownLeft aria-hidden="true" className="h-[18px] w-[18px]" /> : ch}
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
      className="relative mx-auto max-h-[11rem] w-full max-w-3xl overflow-hidden font-mono text-[1.5rem] leading-none tracking-normal"
      aria-hidden="true"
    >
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
