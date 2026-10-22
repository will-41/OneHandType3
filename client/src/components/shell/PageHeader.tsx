import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { useTypingStore } from '../../lib/stores/useTypingStore';
import { mirrorRow } from '../../lib/theme';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Prominent action; aligned to the thumb side (left in left-hand mode). */
  action?: ReactNode;
}

export default function PageHeader({ title, description, icon, action }: PageHeaderProps) {
  const hand = useTypingStore((s) => s.handPreference);
  return (
    <header className={cn('flex flex-wrap items-center justify-between gap-3 pb-6', mirrorRow(hand))}>
      <div className={cn('flex items-center gap-3', hand === 'left' && 'flex-row-reverse text-right')}>
        {icon && (
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"
          >
            {icon}
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action}
    </header>
  );
}
