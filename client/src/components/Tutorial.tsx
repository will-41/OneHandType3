import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, FlipHorizontal2, Hand, Keyboard, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useTypingStore, type HandPreference } from '../lib/stores/useTypingStore';
import { availableLayouts, getKeyboardLayout, type KeyboardKey } from '../lib/keyboardLayouts';
import { resolveLayout, type LayoutId } from '../lib/customLayouts';
import { resolveMirrorLayer } from './practice/inputUtils';
import OneHandKeyboard from './practice/OneHandKeyboard';
import { mirrorRow } from '../lib/theme';
import { cn } from '../lib/utils';

export type TutorialDestination = 'lesson' | 'home';

interface TutorialProps {
  onFinish: (destination: TutorialDestination) => void;
}

const STEP_COUNT = 5;

/** Layouts offered during onboarding, with plain-language descriptions. */
const LAYOUT_CHOICES: { id: LayoutId; name: string; blurb: string }[] = [
  { id: 'qwerty', name: 'QWERTY', blurb: 'The familiar layout. Keys are where you already expect them. Recommended to start.' },
  { id: 'dvorak-one-hand', name: 'Dvorak One-Hand', blurb: 'Common letters sit close together under your fingers, so there is less reaching.' },
  { id: 'maltron', name: 'Maltron One-Hand', blurb: 'An ergonomic one-hand arrangement designed to keep strain low.' },
  { id: 'colemak', name: 'Colemak', blurb: 'A modern, efficient layout that stays close to QWERTY.' },
  { id: 'artsey', name: 'ARTSEY Chorded', blurb: 'Eight keys, pressed in combinations. Compact, but takes the longest to learn.' },
];

const BTN =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-transparent px-5 text-base font-bold touch-manipulation transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const BTN_PRIMARY = cn(BTN, 'bg-primary text-primary-foreground active:bg-primary/80');
const BTN_SECONDARY = cn(BTN, 'border-input bg-transparent text-foreground active:bg-secondary');

function StepHeading({ children, headingRef }: { children: ReactNode; headingRef: React.RefObject<HTMLHeadingElement> }) {
  return (
    <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-medium leading-[1.875rem] focus:outline-none">
      {children}
    </h1>
  );
}

/** Decorative half-keyboard that mirrors with the chosen hand. */
function HandPreview({ hand }: { hand: HandPreference }) {
  const rows = useMemo(
    () =>
      getKeyboardLayout(hand, 'qwerty')
        .slice(0, 3)
        .map((row) => row.filter((k: KeyboardKey) => k.key !== ' ')),
    [hand],
  );
  return (
    <div aria-hidden="true" data-testid="hand-preview" data-hand={hand} className={cn('mx-auto flex w-full max-w-xs flex-col gap-1.5 border-input', hand === 'left' ? 'border-r-2 pr-2.5' : 'border-l-2 pl-2.5')}>
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((k) => (
            <span
              key={`${i}-${k.key}`}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-parchment font-mono text-sm font-medium text-parchment-foreground"
            >
              {k.key}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function RadioCard({
  selected,
  onSelect,
  title,
  description,
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex min-h-[56px] w-full items-start gap-3 rounded-lg border bg-card text-left transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        selected ? 'border-2 border-primary p-[15px]' : 'border-input p-4',
      )}
    >
      <span
        aria-hidden="true"
        className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', selected ? 'border-primary' : 'border-input')}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex w-full items-center justify-between gap-2 font-bold text-foreground">
          {title}
          {badge && <span className="inline-flex h-6 items-center rounded-md bg-secondary px-2 text-sm font-bold text-secondary-foreground">{badge}</span>}
        </span>
        {description && <span className="text-sm leading-5 text-muted-foreground">{description}</span>}
      </span>
    </button>
  );
}

function MirrorDemo({ hand, layoutId, reduceMotion }: { hand: HandPreference; layoutId: LayoutId; reduceMotion: boolean }) {
  const customLayouts = useTypingStore((s) => s.customLayouts);
  // Chord layouts have no mirror layer; demo the idea on QWERTY instead.
  const demoLayoutId: LayoutId = layoutId === 'artsey' ? 'qwerty' : layoutId;
  const layout = useMemo(() => resolveLayout(hand, demoLayoutId, customLayouts), [hand, demoLayoutId, customLayouts]);
  const mirrorLayout = useMemo(
    () => resolveMirrorLayer(hand, demoLayoutId, customLayouts, layout),
    [hand, demoLayoutId, customLayouts, layout],
  );
  const [typed, setTyped] = useState('');

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card p-3">
        <p className="text-[0.8125rem] font-medium leading-[1.125rem] text-muted-foreground">What you typed</p>
        <output
          data-testid="tutorial-demo-output"
          aria-live="polite"
          className="block min-h-[2rem] break-all font-mono text-base text-foreground"
        >
          {typed || <span className="text-muted-foreground">Nothing yet. Try the Mirror key below.</span>}
        </output>
      </div>
      <div
        className={cn('border-input', hand === 'left' ? 'border-r-2 pr-2.5' : 'border-l-2 pl-2.5')}
        style={{ ['--key-height' as string]: '3rem' }}
      >
      <OneHandKeyboard
        layout={layout}
        mirrorLayout={mirrorLayout}
        chorded={false}
        hand={hand}
        expected={undefined}
        showEnter={false}
        reduceMotion={reduceMotion}
        highlightNext={false}
        onChar={(ch) => setTyped((t) => (t + ch).slice(-24))}
        onAssist={() => undefined}
        onBackspace={() => setTyped((t) => t.slice(0, -1))}
        onInvalidChord={() => undefined}
      />
      </div>
    </div>
  );
}

export default function Tutorial({ onFinish }: TutorialProps) {
  const hand = useTypingStore((s) => s.handPreference);
  const setHandPreference = useTypingStore((s) => s.setHandPreference);
  const layoutId = useTypingStore((s) => s.keyboardLayout);
  const setKeyboardLayout = useTypingStore((s) => s.setKeyboardLayout);
  const setOnboardingComplete = useTypingStore((s) => s.setOnboardingComplete);
  const appReduce = useTypingStore((s) => s.accessibilitySettings.reduceMotion);
  const systemReduce = useReducedMotion();
  const reduceMotion = Boolean(appReduce || systemReduce);

  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move focus to the new step's heading so screen readers announce it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: false });
  }, [step]);

  const finish = (destination: TutorialDestination) => {
    setOnboardingComplete(true);
    onFinish(destination);
  };

  const isLast = step === STEP_COUNT - 1;
  const handLabel = hand === 'left' ? 'left' : 'right';

  const body: ReactNode = (() => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center text-primary">
              <Keyboard className="h-12 w-12" />
            </div>
            <StepHeading headingRef={headingRef}>Welcome to One-Type</StepHeading>
            <p className="text-base text-muted-foreground">
              Learn to type comfortably with one hand. Short lessons, a full on-screen keyboard built for a single hand, and a
              pace that is entirely yours.
            </p>
            <ul className="divide-y divide-border overflow-hidden rounded-lg border bg-card">
              {[
                { icon: <Hand className="h-5 w-5" />, text: 'Made for left or right hand, with every control within thumb reach.' },
                { icon: <Sparkles className="h-5 w-5" />, text: 'Gentle progress and achievements. No timers, no daily streaks, no pressure.' },
                { icon: <ShieldCheck className="h-5 w-5" />, text: 'Free, offline, and private. Everything stays on this device.' },
              ].map((f) => (
                <li key={f.text} className="flex items-start gap-3 px-4 py-3 text-base text-foreground">
                  <span aria-hidden="true" className="mt-0.5 text-primary">
                    {f.icon}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">This quick tour takes about a minute and you can skip it at any time.</p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <StepHeading headingRef={headingRef}>Which hand do you type with?</StepHeading>
            <p className="text-base text-muted-foreground">
              We will put the keys, and the main buttons, where your {handLabel} hand reaches them most easily. You can change this
              later in Settings.
            </p>
            <div role="radiogroup" aria-label="Typing hand" className="grid grid-cols-2 gap-3">
              <RadioCard selected={hand === 'left'} onSelect={() => setHandPreference('left')} title="Left hand" />
              <RadioCard selected={hand === 'right'} onSelect={() => setHandPreference('right')} title="Right hand" />
            </div>
            <HandPreview hand={hand} />
            <p className="text-center text-sm text-muted-foreground">Preview: the keys your {handLabel} hand covers.</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <StepHeading headingRef={headingRef}>Pick a keyboard layout</StepHeading>
            <p className="text-base text-muted-foreground">
              Not sure? Keep QWERTY. You can switch any time, and in Settings you can also design your own custom layout.
            </p>
            <div role="radiogroup" aria-label="Keyboard layout" className="space-y-2">
              {LAYOUT_CHOICES.filter((c) => availableLayouts.some((a) => a.id === c.id)).map((c) => (
                <RadioCard
                  key={c.id}
                  selected={layoutId === c.id}
                  onSelect={() => setKeyboardLayout(c.id)}
                  title={c.name}
                  description={c.blurb}
                  badge={c.id === 'qwerty' ? 'Default' : undefined}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <StepHeading headingRef={headingRef}>Meet the Mirror key</StepHeading>
            <p className="text-base text-muted-foreground">
              Your keyboard shows one half of the letters. Tap{' '}
              <span className="inline-flex items-center gap-1 font-bold text-foreground">
                <FlipHorizontal2 aria-hidden="true" className="h-4 w-4" /> Mirror
              </span>{' '}
              and the keys flip to the other half. Then tap a letter to type it.
            </p>
            <ol className="list-decimal space-y-0.5 pl-5 text-sm leading-5 text-foreground">
              <li>Tap Mirror. The keys flip.</li>
              <li>Tap any key. It types, and the keyboard flips back.</li>
              <li>
                Double-tap Mirror to keep it on <Lock aria-hidden="true" className="inline h-3.5 w-3.5" />
              </li>
            </ol>
            <MirrorDemo hand={hand} layoutId={layoutId} reduceMotion={reduceMotion} />
          </div>
        );
      default:
        return (
          <div className="space-y-5 text-center">
            <div aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center text-primary">
              <Sparkles className="h-12 w-12" />
            </div>
            <StepHeading headingRef={headingRef}>You are ready</StepHeading>
            <p className="text-base text-muted-foreground">
              Your first lesson takes about two minutes and starts on the home row. Go at your own pace; there is no clock to beat.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <button type="button" className={cn(BTN_PRIMARY, 'w-full')} onClick={() => finish('lesson')}>
                Start your first lesson
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>
              <button type="button" className={cn(BTN_SECONDARY, 'w-full')} onClick={() => finish('home')}>
                Go home
              </button>
            </div>
          </div>
        );
    }
  })();

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className={cn('flex items-center justify-between gap-3', mirrorRow(hand))}>
        <ol aria-label={`Tour progress, step ${step + 1} of ${STEP_COUNT}`} className="flex items-center gap-2 px-1">
          {Array.from({ length: STEP_COUNT }, (_, i) => (
            <li
              key={i}
              aria-current={i === step ? 'step' : undefined}
              className={cn('h-2 rounded-full transition-all', i === step ? 'w-6 bg-primary' : i < step ? 'w-2 bg-foreground' : 'box-border w-2 border-2 border-input')}
            >
              <span className="sr-only">
                Step {i + 1}
                {i === step ? ' (current)' : i < step ? ' (done)' : ''}
              </span>
            </li>
          ))}
        </ol>
        {!isLast && (
          <button type="button" className={cn(BTN, 'bg-transparent px-3 text-muted-foreground active:bg-secondary')} onClick={() => finish('home')}>
            Skip tour
          </button>
        )}
      </div>

      <div className="flex-1 py-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={cn('flex items-center gap-3', mirrorRow(hand))}>
        <button type="button" className={cn(BTN_SECONDARY, 'flex-1', step === 0 && 'invisible')} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} aria-hidden={step === 0} tabIndex={step === 0 ? -1 : undefined}>
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          Back
        </button>
        {!isLast && (
          <button type="button" className={cn(BTN_PRIMARY, 'flex-[2]')} onClick={() => setStep((s) => Math.min(STEP_COUNT - 1, s + 1))}>
            Next
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
