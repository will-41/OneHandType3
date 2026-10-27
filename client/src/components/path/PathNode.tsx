import { Check, Dumbbell, Flag, Lock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { unitAccent, unitAccentAlpha } from '../../lib/theme';
import type { Stars } from '../../lib/mastery';

export type NodeKind = 'lesson' | 'strengthen' | 'checkpoint';
export type NodeState = 'locked' | 'current' | 'available' | 'completed';

interface PathNodeProps {
  kind: NodeKind;
  state: NodeState;
  unitId: string;
  testId: string;
  ariaLabel: string;
  /** Lesson number shown inside available/current lesson nodes. */
  number?: number;
  stars?: Stars;
  reduceMotion: boolean;
  onSelect: () => void;
}

const INK = 'hsl(224 30% 10%)';
const GOLD = 'hsl(45 90% 55%)';

/** One 64px stop on the skill path. Decorations are spans/divs so global button sizing never inflates them. */
export default function PathNode({
  kind,
  state,
  unitId,
  testId,
  ariaLabel,
  number,
  stars = 0,
  reduceMotion,
  onSelect,
}: PathNodeProps) {
  const accent = unitAccent(unitId);
  const locked = state === 'locked';
  const completed = state === 'completed';
  const current = state === 'current';

  let Icon: React.ReactNode;
  if (locked) Icon = <Lock className="h-6 w-6" aria-hidden="true" />;
  else if (kind === 'strengthen') Icon = <Dumbbell className="h-7 w-7" aria-hidden="true" />;
  else if (kind === 'checkpoint') Icon = <Flag className="h-7 w-7" aria-hidden="true" />;
  else if (completed) Icon = <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true" />;
  else Icon = <span aria-hidden="true" className="text-xl font-bold">{number}</span>;

  const filled = completed && kind !== 'strengthen';
  const style: React.CSSProperties = locked
    ? {}
    : filled
      ? { backgroundColor: kind === 'checkpoint' ? GOLD : accent, color: INK, borderColor: 'transparent' }
      : { borderColor: kind === 'checkpoint' ? GOLD : accent, backgroundColor: unitAccentAlpha(unitId, 0.14) };

  return (
    <div className={cn('relative flex flex-col items-center', current && 'pt-5')}>
      {current && (
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 flex justify-center"
        >
          <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow">
            Start
          </span>
        </span>
      )}
      <div className="relative h-16 w-16">
        {current && !reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: accent }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <button
          type="button"
          data-testid={testId}
          aria-label={ariaLabel}
          aria-disabled={locked ? 'true' : undefined}
          onClick={onSelect}
          style={style}
          className={cn(
            'relative flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-md transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95',
            locked ? 'border-border bg-muted text-muted-foreground' : !filled && 'text-foreground',
          )}
        >
          {Icon}
        </button>
      </div>
      {kind === 'lesson' && completed && (
        <span aria-hidden="true" className="mt-1 flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <span key={i} className="flex h-4 w-4 items-center justify-center">
              <Star
                className={cn('h-4 w-4', i > stars && 'text-muted-foreground/50')}
                style={i <= stars ? { color: GOLD, fill: GOLD } : undefined}
              />
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
