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
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
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
          className="fixed inset-x-0 bottom-0 z-50 border-t border-[hsl(var(--shell-border))] bg-[hsl(var(--shell-bg))] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-[hsl(var(--shell-bg))]"
        >
          <ul className={cn('mx-auto flex h-[var(--tabbar-height)] max-w-2xl items-stretch px-2', mirrorRow(hand))}>
            {TABS.map((tab) => {
              const active = isActive(tab, location);
              const Icon = tab.icon;
              return (
                <li key={tab.href} className="flex flex-1">
                  <Link
                    href={tab.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-xs font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex h-8 w-14 items-center justify-center rounded-full transition-colors',
                        active ? 'bg-primary/15' : 'group-hover:bg-muted'
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                    </span>
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
