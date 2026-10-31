import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import PageContainer from '../components/shell/PageContainer';
import PageHeader from '../components/shell/PageHeader';
import { cn } from '../lib/utils';
import { useTypingStore, type HandPreference } from '../lib/stores/useTypingStore';
import { availableLayouts } from '../lib/keyboardLayouts';
import { mirrorRow } from '../lib/theme';
import { isCustomLayoutId, type CustomKeyboardLayout, type LayoutId } from '../lib/customLayouts';

const TAB_PREVIEW = ['Home', 'Learn', 'Practice', 'Stats', 'Settings'];
const TEXT_SIZES = [
  { label: 'Default', px: 16 },
  { label: 'Large', px: 18 },
  { label: 'Extra large', px: 20 },
];

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8" aria-label={title}>
      <h2 className="mb-3 text-lg font-bold leading-[1.625rem]">{title}</h2>
      <div className="divide-y divide-border overflow-hidden rounded-lg border bg-card">{children}</div>
    </section>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex min-h-[56px] items-center justify-between gap-4 px-4 py-3">
      <label htmlFor={id} className="flex-1 cursor-pointer">
        <span className="block font-medium">{label}</span>
        {description && <span className="block text-sm leading-5 text-muted-foreground">{description}</span>}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-lg border border-input bg-background p-1">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              'min-h-[44px] flex-1 rounded-md px-2 text-base transition-colors',
              selected ? 'bg-primary font-bold text-primary-foreground' : 'font-medium text-foreground'
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function SettingsPage() {
  const hand = useTypingStore((s) => s.handPreference);
  const setHandPreference = useTypingStore((s) => s.setHandPreference);
  const keyboardLayout = useTypingStore((s) => s.keyboardLayout);
  const setKeyboardLayout = useTypingStore((s) => s.setKeyboardLayout);
  const themeMode = useTypingStore((s) => s.themeMode);
  const setThemeMode = useTypingStore((s) => s.setThemeMode);
  const a11y = useTypingStore((s) => s.accessibilitySettings);
  const setSoundEnabled = useTypingStore((s) => s.setSoundEnabled);
  const setHighContrast = useTypingStore((s) => s.setHighContrast);
  const setFontSize = useTypingStore((s) => s.setFontSize);
  const setLargeText = useTypingStore((s) => s.setLargeText);
  const update = useTypingStore((s) => s.updateAccessibilitySettings);
  const customLayouts = useTypingStore((s) => s.customLayouts);
  const deleteCustomLayout = useTypingStore((s) => s.deleteCustomLayout);
  const [, navigate] = useLocation();
  const [pendingDelete, setPendingDelete] = useState<CustomKeyboardLayout | null>(null);

  const handOptions: { label: string; value: HandPreference }[] = [
    { label: 'Left hand', value: 'left' },
    { label: 'Right hand', value: 'right' },
  ];

  const activeCustom = customLayouts.find((l) => l.id === keyboardLayout);
  const layoutName = activeCustom
    ? `${activeCustom.name} (${activeCustom.hand} hand)`
    : availableLayouts.find((l) => l.id === keyboardLayout)?.name;
  const activeDescription = isCustomLayoutId(keyboardLayout)
    ? activeCustom
      ? 'Your custom layout, saved on this device.'
      : undefined
    : availableLayouts.find((l) => l.id === keyboardLayout)?.description;

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader title="Settings" description="Tune One-Type to the way you type." />

      <Group title="Typing">
        <div className="flex flex-col gap-3 p-4">
          <div>
            <div className="font-medium">Typing hand</div>
            <p className="text-sm leading-5 text-muted-foreground">
              Left-hand mode mirrors the navigation bar and moves main actions to the left edge.
            </p>
          </div>
          <Segmented label="Typing hand" value={hand} options={handOptions} onChange={setHandPreference} />
          {/* Tab-order preview: information, not a control. The mirror axis sits on its inner edge. */}
          <div
            aria-hidden="true"
            className={cn(
              'flex items-stretch gap-1.5 rounded-lg border border-dashed border-input py-2 text-[0.8125rem] leading-[1.125rem]',
              hand === 'left' ? 'flex-row-reverse pl-2' : 'pr-2'
            )}
          >
            <span className={cn('w-[var(--mirror-axis)] shrink-0 bg-input', hand === 'left' ? 'ml-1' : 'mr-1')} />
            {TAB_PREVIEW.map((t) => (
              <span key={t} className="flex-1 rounded-md bg-secondary py-1.5 text-center">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <label htmlFor="layout-select" className="block font-medium">
            Keyboard layout
          </label>
          <Select value={keyboardLayout} onValueChange={(v) => setKeyboardLayout(v as LayoutId)}>
            <SelectTrigger id="layout-select" className="min-h-[48px]" aria-label="Keyboard layout">
              <SelectValue placeholder={layoutName ?? 'Choose a layout'} />
            </SelectTrigger>
            <SelectContent>
              {availableLayouts.map((l) => (
                <SelectItem key={l.id} value={l.id} className="min-h-[44px]">
                  {l.name}
                  {l.specialized ? ' (one-hand)' : ''}
                </SelectItem>
              ))}
              {customLayouts.length > 0 && (
                <SelectGroup>
                  <SelectLabel>My layouts</SelectLabel>
                  {customLayouts.map((l) => (
                    <SelectItem key={l.id} value={l.id} className="min-h-[44px]">
                      {l.name} ({l.hand} hand)
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          {activeDescription && <p className="text-sm leading-5 text-muted-foreground">{activeDescription}</p>}
          <Button type="button" variant="outline" className="min-h-[48px] w-full gap-2" onClick={() => navigate('/settings/keyboard-builder')}>
            <Plus className="h-5 w-5" aria-hidden="true" /> Create custom layout
          </Button>
          {customLayouts.length > 0 && (
            <ul aria-label="My layouts" className="divide-y divide-border border-y border-border">
              {customLayouts.map((l) => (
                <li key={l.id} className="flex min-h-[56px] items-center justify-between gap-2 py-1">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{l.name}</span>
                    <span className="block text-sm leading-5 text-muted-foreground">{l.hand === 'left' ? 'Left' : 'Right'} hand</span>
                  </span>
                  <span className="flex shrink-0">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/settings/keyboard-builder/${l.id}`} aria-label={`Edit ${l.name}`}>
                        <Pencil className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      aria-label={`Delete ${l.name}`}
                      onClick={() => setPendingDelete(l)}
                    >
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ToggleRow
          id="sound"
          label="Sound effects"
          description="Key clicks and completion chimes."
          checked={a11y.soundEnabled}
          onChange={(v) => {
            setSoundEnabled(v);
          }}
        />
        <ToggleRow
          id="vibration"
          label="Vibration"
          description="A gentle buzz on each key, mistakes, and lesson completion."
          checked={a11y.hapticFeedback}
          onChange={(v) => update({ hapticFeedback: v })}
        />
      </Group>

      <Group title="Appearance">
        <ToggleRow
          id="dark-mode"
          label="Dark mode"
          checked={themeMode === 'dark'}
          onChange={(v) => setThemeMode(v ? 'dark' : 'light')}
        />
        <div className="flex flex-col gap-3 p-4">
          <div className="font-medium">Text size</div>
          <Segmented
            label="Text size"
            value={a11y.fontSize || 16}
            options={TEXT_SIZES.map((t) => ({ label: t.label, value: t.px }))}
            onChange={(px) => {
              setFontSize(px);
              setLargeText(px > 16);
            }}
          />
        </div>
      </Group>

      <Group title="Accessibility">
        <ToggleRow
          id="high-contrast"
          label="High contrast"
          description="Stronger borders and text colours."
          checked={a11y.highContrast}
          onChange={setHighContrast}
        />
        <ToggleRow
          id="reduce-motion"
          label="Reduce motion"
          description="Turn off page transitions and animations."
          checked={a11y.reduceMotion}
          // store's setReducedMotion writes a mismatched key (reducedMotion); use the generic updater.
          onChange={(v) => update({ reduceMotion: v })}
        />
      </Group>

      <Group title="More">
        {[
          { href: '/tutorial', label: 'Tutorial', hint: 'Learn the one-handed layout basics' },
          { href: '/about', label: 'About One-Type', hint: 'Mission, credits and licence' },
          { href: '/privacy', label: 'Privacy', hint: 'Everything stays on your device' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-[56px] items-center justify-between gap-4 px-4 py-2 active:bg-secondary focus-visible:bg-secondary"
          >
            <span>
              <span className="block font-medium">{item.label}</span>
              <span className="block text-sm leading-5 text-muted-foreground">{item.hint}</span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </Link>
        ))}
      </Group>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this layout?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.name}&rdquo; will be removed from this device. If it is your active layout, QWERTY is used instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground active:bg-destructive/80"
              onClick={() => {
                if (pendingDelete) deleteCustomLayout(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete layout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
