import type { KeyboardLayout } from '../../lib/keyboardLayouts';
import { cn } from '../../lib/utils';

export interface KeyCoord {
  row: number;
  col: number;
}

export interface KeyboardGridProps {
  layout: KeyboardLayout;
  /** 'edit' shows selection state; 'preview' shows the highlight only. */
  mode: 'edit' | 'preview';
  selected?: KeyCoord | null;
  /** Character (key value) to highlight as the next target. */
  highlightKey?: string | null;
  showFingers?: boolean;
  onKeyPress?: (row: number, col: number) => void;
  className?: string;
  label?: string;
}

const FINGER_SHORT: Record<string, string> = {
  thumb: 'thumb',
  index: 'index',
  middle: 'mid',
  ring: 'ring',
  pinky: 'pinky',
};

export function keyLabel(key: string, displayKey?: string): string {
  if (displayKey) return displayKey;
  if (key === ' ') return 'Space';
  return key;
}

function keyAccessibleName(key: string, displayKey?: string): string {
  if (key === '') return 'Empty key';
  if (key === ' ') return 'Space';
  return displayKey && displayKey.length === 1 ? displayKey : key;
}

/**
 * Lightweight layout renderer for the keyboard builder. Each row is its own
 * CSS grid so keys keep a 44px minimum and never push the page sideways; very
 * wide rows scroll inside the card instead.
 */
export default function KeyboardGrid({
  layout,
  mode,
  selected,
  highlightKey,
  showFingers = true,
  onKeyPress,
  className,
  label = 'Keyboard layout',
}: KeyboardGridProps) {
  const cols = Math.max(
    1,
    ...layout.map((row) => (row.length === 0 ? 0 : (row[0].position ?? 0) + row.length)),
  );
  const target = highlightKey ? highlightKey.toLowerCase() : null;

  return (
    <div role="group" aria-label={label} className={cn('max-w-full overflow-x-auto rounded-xl', className)}>
      <div className="mx-auto flex w-fit min-w-full flex-col gap-1.5 p-1">
        {layout.map((row, r) => {
          const offset = row.length > 0 ? row[0].position ?? 0 : 0;
          return (
            <div
              key={r}
              role="group"
              aria-label={`Row ${r + 1}`}
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(44px, 1fr))` }}
            >
              {row.length === 0 && (
                <div
                  className="flex min-h-[48px] items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground"
                  style={{ gridColumn: `1 / span ${cols}` }}
                >
                  Empty row
                </div>
              )}
              {row.map((k, c) => {
                const isSelected = mode === 'edit' && selected?.row === r && selected?.col === c;
                const isTarget = target !== null && k.key !== '' && k.key.toLowerCase() === target;
                const blank = k.key === '';
                const finger = k.finger ? FINGER_SHORT[k.finger] ?? k.finger : '';
                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={keyAccessibleName(k.key, k.displayKey)}
                    aria-pressed={mode === 'edit' ? isSelected : undefined}
                    title={k.finger ? `${k.finger} finger` : undefined}
                    onClick={() => onKeyPress?.(r, c)}
                    style={{ gridColumn: `${offset + c + 1}` }}
                    className={cn(
                      'relative flex min-h-[48px] min-w-[44px] flex-col items-center justify-center rounded-lg border px-1 py-1 text-base font-semibold leading-none transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      blank
                        ? 'border-dashed border-border bg-muted/40 text-muted-foreground'
                        : 'border-border bg-card text-card-foreground hover:bg-muted',
                      isTarget && 'border-accent bg-accent text-accent-foreground',
                      isSelected && 'border-primary bg-primary/15 ring-2 ring-primary ring-offset-2 ring-offset-background',
                    )}
                  >
                    <span aria-hidden="true" className={cn(k.key === ' ' && 'text-xs')}>
                      {blank ? '·' : keyLabel(k.key, k.displayKey)}
                    </span>
                    {showFingers && finger && !blank && (
                      <span aria-hidden="true" className="mt-0.5 text-[9px] font-normal uppercase tracking-wide opacity-70">
                        {finger}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
