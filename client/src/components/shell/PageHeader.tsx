import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { useTypingStore } from '../../lib/stores/useTypingStore';
import { mirrorRow } from '../../lib/theme';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Accepted for compatibility; page titles no longer carry a decorative icon tile. */
  icon?: ReactNode;
  /** Prominent action; aligned to the thumb side (left in left-hand mode). */
  action?: ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  const hand = useTypingStore((s) => s.handPreference);
  return (
    <header className={cn('flex flex-wrap items-center justify-between gap-3 pb-6', mirrorRow(hand))}>
      <div className={cn('flex flex-col gap-2', hand === 'left' && 'text-right')}>
        <h1 className="font-display text-[2rem] font-medium leading-[2.375rem] tracking-[-0.01em]">{title}</h1>
        {description && <p className="text-base text-muted-foreground">{description}</p>}
      </div>
      {action}
    </header>
  );
}
