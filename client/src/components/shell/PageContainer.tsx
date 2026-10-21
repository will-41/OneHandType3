import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export default function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-5xl px-4 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))]', className)}>
      {children}
    </div>
  );
}
