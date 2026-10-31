import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, useReducedMotion } from 'framer-motion';
import { Home, Map, Keyboard, BarChart3, Settings, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTypingStore } from '../../lib/stores/useTypingStore';
import { mirrorRow } from '../../lib/theme';

interface TabDef {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Extra path prefixes that keep this tab highlighted. */
  match?: string[];
}

const TABS: TabDef[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/curriculum', label: 'Learn', icon: Map },
  { href: '/practice', label: 'Practice', icon: Keyboard },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings, match: ['/about', '/privacy'] },
];

/** Immersive routes hide the tab bar. */
function isImmersive(path: string): boolean {
  return path === '/tutorial' || path.startsWith('/lesson/');
}

function isActive(tab: TabDef, path: string): boolean {
  if (tab.href === '/') return path === '/';
  return [tab.href, ...(tab.match ?? [])].some((p) => path === p || path.startsWith(`${p}/`));
}

function topSegment(path: string): string {
  return `/${path.split('/')[1] ?? ''}`;
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const hand = useTypingStore((s) => s.handPreference);
  const appReduce = useTypingStore((s) => s.accessibilitySettings.reduceMotion);
  const systemReduce = useReducedMotion();
  const reduceMotion = Boolean(appReduce || systemReduce);
  const immersive = isImmersive(location);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded-lg focus:bg-primary focus:px-4 focus:font-bold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <motion.main
        id="main-content"
        key={topSegment(location)}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
        className={cn(!immersive && 'pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))]')}
      >
        {children}
      </motion.main>

      {!immersive && (
        <nav
          aria-label="Main"
          data-hand={hand}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-[hsl(var(--shell-border))] bg-[hsl(var(--shell-bg))] pb-[env(safe-area-inset-bottom)]"
        >
          <ul className={cn('mx-auto flex h-[var(--tabbar-height)] max-w-2xl items-stretch', mirrorRow(hand))}>
            {TABS.map((tab) => {
              const active = isActive(tab, location);
              const Icon = tab.icon;
              return (
                <li key={tab.href} className="flex flex-1">
                  <Link
                    href={tab.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 px-1 text-[0.8125rem] leading-[1.125rem] transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                      active
                        ? 'font-bold text-foreground before:absolute before:-top-px before:left-1/2 before:h-[3px] before:w-8 before:-translate-x-1/2 before:bg-primary before:content-[""]'
                        : 'font-medium text-muted-foreground'
                    )}
                  >
                    <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
                    <span>{tab.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
