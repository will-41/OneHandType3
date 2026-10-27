import { Star } from 'lucide-react';
import { useLocation } from 'wouter';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { nextStarHint, type Stars } from '../../lib/mastery';
import type { NodeKind } from './PathNode';

export interface SheetTarget {
  id: string;
  kind: NodeKind;
  title: string;
  description: string;
  unitNumber: number;
  focusKeys: string[];
  tip: string;
  targetWpm?: number;
  targetAccuracy?: number;
  minutes?: number;
  locked: boolean;
  lockedHint?: string;
  best?: { wpm: number; accuracy: number };
  stars?: Stars;
}

interface LessonSheetProps {
  target: SheetTarget | null;
  onOpenChange: (open: boolean) => void;
}

const GOLD = 'hsl(45 90% 55%)';

function chipLabel(k: string): string {
  return k === ' ' ? 'Space' : k;
}

/** Bottom sheet describing a path stop: what it trains, targets, best result, and Start. */
export default function LessonSheet({ target, onOpenChange }: LessonSheetProps) {
  const [, navigate] = useLocation();
  return (
    <Drawer open={!!target} onOpenChange={onOpenChange}>
      <DrawerContent aria-describedby="lesson-sheet-desc" data-testid="lesson-sheet">
        {target && <Body target={target} onClose={() => onOpenChange(false)} onStart={() => navigate(`/lesson/${encodeURIComponent(target.id)}`)} />}
      </DrawerContent>
    </Drawer>
  );
}

function Body({ target, onClose, onStart }: { target: SheetTarget; onClose: () => void; onStart: () => void }) {
  const hasTargets = target.targetWpm !== undefined && target.targetAccuracy !== undefined;
  const hint = hasTargets && target.stars !== undefined && target.kind === 'lesson'
    ? nextStarHint({ targetWpm: target.targetWpm!, targetAccuracy: target.targetAccuracy! }, target.stars)
    : null;
  const tip =
    target.kind === 'checkpoint'
      ? `Pass at ${target.targetAccuracy}% accuracy to clear Unit ${target.unitNumber}.`
      : target.kind === 'strengthen'
        ? 'Built from the keys you miss most.'
        : target.tip;

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{target.title}</DrawerTitle>
        <DrawerDescription id="lesson-sheet-desc">
          {target.locked ? target.lockedHint : target.description}
        </DrawerDescription>
      </DrawerHeader>
      {!target.locked && (
        <div className="space-y-3 px-4">
          {target.focusKeys.length > 0 && (
            <ul aria-label="Keys in focus" className="flex flex-wrap gap-1.5">
              {target.focusKeys.map((k) => (
                <li
                  key={k}
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-muted px-2 font-mono text-sm font-semibold text-foreground"
                >
                  {chipLabel(k)}
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm text-foreground">{tip}</p>
          {hasTargets && (
            <p className="text-sm text-muted-foreground">
              Target {target.targetWpm} WPM · {target.targetAccuracy}% accuracy
              {target.minutes ? ` · about ${target.minutes} min` : ''}
            </p>
          )}
          {target.best && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="text-foreground">
                Your best: {Math.round(target.best.wpm)} WPM · {Math.round(target.best.accuracy)}%
              </span>
              {target.kind === 'lesson' && target.stars !== undefined && (
                <span role="img" aria-label={`${target.stars} of 3 stars`} className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={cn('h-5 w-5', i > target.stars! && 'text-muted-foreground/50')}
                      style={i <= target.stars! ? { color: GOLD, fill: GOLD } : undefined}
                    />
                  ))}
                </span>
              )}
            </div>
          )}
          {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        </div>
      )}
      <DrawerFooter>
        {!target.locked && (
          <Button type="button" className="min-h-[48px]" onClick={onStart}>
            {target.best ? 'Practice again' : 'Start'}
          </Button>
        )}
        <Button type="button" variant="ghost" className="min-h-[48px]" onClick={onClose}>
          Close
        </Button>
      </DrawerFooter>
    </>
  );
}
