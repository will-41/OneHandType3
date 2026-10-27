import { useMemo } from 'react';
import type { KeyboardLayout } from '../../lib/keyboardLayouts';
import type { KeyStats } from '../../lib/generatedLessons';
import { cn } from '../../lib/utils';

function accuracyOf(s: { hits: number; misses: number } | undefined): number | null {
  if (!s || s.hits + s.misses === 0) return null;
  return s.hits / (s.hits + s.misses);
}

function tone(acc: number | null): string {
  if (acc === null) return 'bg-muted text-muted-foreground';
  if (acc >= 0.97) return 'bg-success text-success-foreground';
  if (acc >= 0.85) return 'bg-amber-300 text-black';
  return 'bg-destructive text-destructive-foreground';
}

const LEGEND = [
  { label: '97%+', cls: 'bg-success' },
  { label: '85–97%', cls: 'bg-amber-300' },
  { label: 'Under 85%', cls: 'bg-destructive' },
  { label: 'No data', cls: 'bg-muted border border-border' },
];

/** Non-interactive per-key accuracy map for the current layout. */
export default function KeyHeatmap({ keyStats, layout }: { keyStats: KeyStats; layout: KeyboardLayout }) {
  const rows = useMemo(
    () =>
      layout
        .map((row) => row.filter((k) => k.key !== ' ' && k.key.length === 1))
        .filter((row) => row.length > 0),
    [layout],
  );

  const worst = useMemo(() => {
    const seen = new Set<string>();
    const out: { key: string; acc: number }[] = [];
    for (const row of rows)
      for (const k of row) {
        const key = k.key.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const acc = accuracyOf(keyStats[key]);
        if (acc !== null) out.push({ key, acc });
      }
    return out.sort((a, b) => a.acc - b.acc || a.key.localeCompare(b.key)).slice(0, 5);
  }, [rows, keyStats]);

  const pct = (a: number) => `${Math.round(a * 100)}%`;
  const label =
    worst.length === 0
      ? 'Key accuracy. No data yet.'
      : `Key accuracy. Weakest keys: ${worst.map((w) => `${w.key.toUpperCase()} ${pct(w.acc)}`).join(', ')}`;

  return (
    <div data-testid="key-heatmap">
      <div role="img" aria-label={label} className="flex flex-col items-center gap-1">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((k) => {
              const acc = accuracyOf(keyStats[k.key.toLowerCase()]);
              return (
                <span
                  key={`${k.row}-${k.position}-${k.key}`}
                  aria-hidden="true"
                  className={cn(
                    'inline-flex h-8 min-w-[1.75rem] items-center justify-center rounded-md text-xs font-semibold uppercase',
                    tone(acc),
                  )}
                >
                  {k.displayKey && k.displayKey.length <= 2 ? k.displayKey : k.key}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Weakest keys</caption>
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {worst.map((w) => (
            <tr key={w.key}>
              <td>{w.key.toUpperCase()}</td>
              <td>{pct(w.acc)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Legend">
        {LEGEND.map((l) => (
          <li key={l.label} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn('h-3 w-3 rounded-sm', l.cls)} />
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
