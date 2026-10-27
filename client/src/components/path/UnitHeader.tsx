import { Code2, GraduationCap, Hash, Keyboard, Quote, Target, Timer, Trophy, Type, Zap, type LucideIcon } from 'lucide-react';
import type { CurriculumUnit, UnitIcon } from '../../lib/gamifiedCurriculum';
import { unitNumber } from '../../lib/gamifiedCurriculum';
import { unitAccent, unitAccentAlpha } from '../../lib/theme';

const ICONS: Record<UnitIcon, LucideIcon> = {
  home: Keyboard,
  words: Type,
  sentences: Quote,
  numbers: Hash,
  speed: Zap,
  precision: Target,
  endurance: Timer,
  code: Code2,
  trophy: Trophy,
  graduation: GraduationCap,
};

interface UnitHeaderProps {
  unit: CurriculumUnit;
  lessonsDone: number;
  checkpointCleared: boolean;
}

/** Sticky unit card at the top of each unit on the skill path. */
export default function UnitHeader({ unit, lessonsDone, checkpointCleared }: UnitHeaderProps) {
  const n = unitNumber(unit);
  const Icon = ICONS[unit.theme.icon] ?? Keyboard;
  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-3 rounded-xl border border-l-4 bg-card/95 p-3 shadow-sm backdrop-blur"
      style={{ borderLeftColor: unitAccent(unit.id) }}
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: unitAccentAlpha(unit.id, 0.2), color: unitAccent(unit.id) }}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 id={`unit-${n}-title`} className="truncate text-base font-semibold leading-tight text-foreground">
          Unit {n} · {unit.title}
        </h2>
        <p className="truncate text-sm text-muted-foreground">{unit.theme.tagline}</p>
        <p className="truncate text-xs text-muted-foreground">
          {lessonsDone}/{unit.lessons.length} lessons · {checkpointCleared ? 'checkpoint passed' : 'checkpoint to go'}
        </p>
      </div>
    </div>
  );
}
