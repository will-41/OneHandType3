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
  /** Typing hand of the layout; the quiet mirror axis sits on its inner edge. */
  hand?: 'left' | 'right';
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
  hand,
}: KeyboardGridProps) {
  const cols = Math.max(
    1,
    ...layout.map((row) => (row.length === 0 ? 0 : (row[0].position ?? 0) + row.length)),
  );
  const target = highlightKey ? highlightKey.toLowerCase() : null;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('max-w-full overflow-x-auto', hand && 'border-input', hand === 'left' ? 'border-r-2 pr-2.5' : hand === 'right' ? 'border-l-2 pl-2.5' : '', className)}
    >
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
                  className="flex min-h-[48px] items-center justify-center rounded-lg border border-dashed border-input text-sm text-muted-foreground"
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
                      'relative flex min-h-[64px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1 transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      blank
                        ? 'border-2 border-dashed border-input bg-transparent text-muted-foreground'
                        : 'bg-parchment text-parchment-foreground active:bg-parchment/80',
                      isTarget && 'bg-accent text-accent-foreground',
                      isSelected && 'outline outline-[3px] outline-offset-2 outline-primary',
                    )}
                  >
                    <span aria-hidden="true" className={cn('font-mono text-xl font-medium leading-6', k.key === ' ' && 'text-sm')}>
                      {blank ? '·' : keyLabel(k.key, k.displayKey)}
                    </span>
                    {showFingers && finger && !blank && (
                      <span aria-hidden="true" className="text-[0.8125rem] font-normal leading-[1.125rem]">
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
