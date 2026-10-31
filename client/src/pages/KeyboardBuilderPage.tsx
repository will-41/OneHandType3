import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  Eraser,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Undo2,
  Upload,
} from 'lucide-react';
import PageContainer from '../components/shell/PageContainer';
import PageHeader from '../components/shell/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import KeyboardGrid, { keyLabel, type KeyCoord } from '../components/keyboard-builder/KeyboardGrid';
import KeySheet from '../components/keyboard-builder/KeySheet';
import {
  MAX_NAME_LENGTH,
  addKey,
  addRow,
  canAddKey,
  canAddRow,
  clearKey,
  downloadText,
  parseImportedLayout,
  removeKey,
  removeRow,
  serializeLayout,
  slugify,
  swapKeys,
  updateKey,
} from '../components/keyboard-builder/layoutOps';
import {
  cloneLayout,
  newCustomLayoutId,
  type BuiltInLayoutId,
  type CustomKeyboardLayout,
  type CustomLayoutId,
} from '../lib/customLayouts';
import { availableLayouts, getKeyboardLayout, type KeyboardLayout } from '../lib/keyboardLayouts';
import { validateCustomLayout } from '../lib/layoutValidator';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { cn } from '../lib/utils';
import { mirrorRow } from '../lib/theme';

const SAMPLE = 'the quick brown fox';
const HISTORY_LIMIT = 20;
type Hand = 'left' | 'right';

/** Route wrapper: resolves the layout being edited (if any) then mounts the builder. */
export default function KeyboardBuilderPage() {
  const [, params] = useRoute<{ id: string }>('/settings/keyboard-builder/:id');
  const id = params?.id ? decodeURIComponent(params.id) : null;
  const existing = useTypingStore((s) => (id ? s.customLayouts.find((l) => l.id === id) ?? null : null));
  // Keep editing the loaded copy even after the store updates (e.g. on save).
  const loaded = useRef(existing);
  if (existing && !loaded.current) loaded.current = existing;

  if (id && !loaded.current) {
    return (
      <PageContainer className="max-w-2xl">
        <PageHeader title="Layout not found" description="This custom layout no longer exists." />
        <Button asChild className="min-h-[48px]">
          <Link href="/settings">Back to settings</Link>
        </Button>
      </PageContainer>
    );
  }
  return <Builder key={id ?? 'new'} initial={loaded.current} />;
}

interface Snapshot {
  name: string;
  layout: KeyboardLayout;
}

function Builder({ initial }: { initial: CustomKeyboardLayout | null }) {
  const [, navigate] = useLocation();
  const storeHand = useTypingStore((s) => s.handPreference);
  const saveCustomLayout = useTypingStore((s) => s.saveCustomLayout);
  const setKeyboardLayout = useTypingStore((s) => s.setKeyboardLayout);

  // Identity of the draft (changes when a file is imported).
  const [meta, setMeta] = useState<{ id: CustomLayoutId; createdAt: number; baseLayout: BuiltInLayoutId; hand: Hand }>(() => ({
    id: initial?.id ?? newCustomLayoutId(),
    createdAt: initial?.createdAt ?? Date.now(),
    baseLayout: initial?.baseLayout ?? 'qwerty',
    hand: initial?.hand ?? storeHand,
  }));
  const [phase, setPhase] = useState<'start' | 'edit'>(initial ? 'edit' : 'start');
  const [name, setName] = useState(initial?.name ?? 'My Layout');
  const [draft, setDraft] = useState<KeyboardLayout>(() => (initial ? cloneLayout(initial.layout) : []));
  const [history, setHistory] = useState<KeyboardLayout[]>([]);
  const [baseline, setBaseline] = useState(() => JSON.stringify([initial?.name ?? 'My Layout', initial ? initial.layout : []]));

  const [selected, setSelected] = useState<KeyCoord | null>(null);
  const [tab, setTab] = useState<'edit' | 'test'>('edit');
  const [sheet, setSheet] = useState<{ mode: 'edit' | 'add'; row: number; col: number } | null>(null);
  const [status, setStatus] = useState('');
  const [importError, setImportError] = useState('');
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [savedId, setSavedId] = useState<CustomLayoutId | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = phase === 'edit' && JSON.stringify([name, draft]) !== baseline;
  const { errors, warnings } = useMemo(() => validateCustomLayout(draft), [draft]);
  const trimmedName = name.trim();
  const nameError = trimmedName === '' ? 'Give your layout a name.' : '';
  const canSave = errors.length === 0 && nameError === '';

  useEffect(() => {
    if (!dirty) return undefined;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [dirty]);

  /* ---------------- editing helpers ---------------- */
  const commit = (next: KeyboardLayout, message?: string) => {
    setHistory((h) => [...h.slice(-(HISTORY_LIMIT - 1)), draft]);
    setDraft(next);
    if (message) setStatus(message);
  };

  const undo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setDraft(prev);
    setSelected(null);
    setStatus('Undid the last change.');
  };

  const resetToBase = () => {
    commit(cloneLayout(getKeyboardLayout(meta.hand, meta.baseLayout)), 'Layout reset to its starting point.');
    setSelected(null);
  };

  const startFrom = (base: BuiltInLayoutId, hand: Hand) => {
    setMeta((m) => ({ ...m, baseLayout: base, hand }));
    const layout = cloneLayout(getKeyboardLayout(hand, base));
    setDraft(layout);
    setBaseline(JSON.stringify([name, layout]));
    setHistory([]);
    setPhase('edit');
  };

  const onKeyPress = (row: number, col: number) => {
    if (tab === 'test') {
      pressTest(row, col);
      return;
    }
    if (!selected) {
      setSelected({ row, col });
      return;
    }
    if (selected.row === row && selected.col === col) {
      setSelected(null);
      return;
    }
    const a = draft[selected.row][selected.col];
    const b = draft[row][col];
    commit(swapKeys(draft, selected, { row, col }), `Swapped ${keyLabel(a.key, a.displayKey) || 'blank'} and ${keyLabel(b.key, b.displayKey) || 'blank'}.`);
    setSelected(null);
  };

  const selectedKey = selected ? draft[selected.row]?.[selected.col] : undefined;
  const usedChars = draft.flat().filter((k) => k.key !== '').map((k) => k.key.toLowerCase());

  const applySheet = (char: string, finger: string) => {
    if (!sheet) return;
    if (sheet.mode === 'add') {
      commit(addKey(draft, sheet.row, char, finger), `Added ${char === ' ' ? 'Space' : char} to row ${sheet.row + 1}.`);
    } else {
      commit(updateKey(draft, { row: sheet.row, col: sheet.col }, char, finger), `Key changed to ${char === ' ' ? 'Space' : char}.`);
    }
    setSheet(null);
    setSelected(null);
  };

  /* ---------------- test drive ---------------- */
  const hasSpace = draft.some((row) => row.some((k) => k.key === ' '));
  const [testIdx, setTestIdx] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const skipSpaces = (i: number) => {
    let n = i;
    while (n < SAMPLE.length && SAMPLE[n] === ' ' && !hasSpace) n += 1;
    return n;
  };
  const cur = skipSpaces(testIdx);
  const done = cur >= SAMPLE.length;
  const target = done ? null : SAMPLE[cur];
  const accuracy = hits + misses === 0 ? 100 : Math.round((hits / (hits + misses)) * 100);

  const pressTest = (row: number, col: number) => {
    if (done) return;
    const k = draft[row][col];
    if (k.key === '') return;
    if (k.key.toLowerCase() === target) {
      setHits((n) => n + 1);
      setTestIdx(cur + 1);
    } else {
      setMisses((n) => n + 1);
    }
  };
  const restartTest = () => {
    setTestIdx(0);
    setHits(0);
    setMisses(0);
  };

  /* ---------------- save / export / import ---------------- */
  const buildLayout = (): CustomKeyboardLayout => ({
    id: meta.id,
    name: trimmedName || 'My Layout',
    baseLayout: meta.baseLayout,
    hand: meta.hand,
    layout: cloneLayout(draft),
    createdAt: meta.createdAt,
    updatedAt: Date.now(),
  });

  const save = () => {
    if (!canSave) return;
    const out = buildLayout();
    saveCustomLayout(out);
    setBaseline(JSON.stringify([name, draft]));
    setSavedId(out.id);
    setSavedOpen(true);
  };

  const exportJson = () => {
    downloadText(`onehandtype-layout-${slugify(trimmedName)}.json`, serializeLayout(buildLayout()));
    setStatus('Layout exported.');
  };

  const onImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 200_000) {
      setImportError('That file is too large to be a layout.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setImportError('Could not read that file.');
    reader.onload = () => {
      const result = parseImportedLayout(String(reader.result ?? ''));
      if (!result.ok) {
        setImportError(result.error);
        return;
      }
      const l = result.layout;
      setImportError('');
      setMeta({ id: l.id, createdAt: l.createdAt, baseLayout: l.baseLayout, hand: l.hand });
      setName(l.name);
      setDraft(l.layout);
      setHistory([]);
      setSelected(null);
      setBaseline(JSON.stringify(['', []]));
      setPhase('edit');
      setStatus(`Imported "${l.name}". It will be saved as a new layout.`);
    };
    reader.readAsText(file);
  };

  const goBack = () => {
    if (dirty) setLeaveOpen(true);
    else navigate('/settings');
  };

  const finished = useRef(false);
  const finishSaved = (useNow: boolean) => {
    if (finished.current) return;
    finished.current = true;
    if (useNow && savedId) setKeyboardLayout(savedId);
    setSavedOpen(false);
    navigate('/settings');
  };

  const hiddenInput = (
    <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onImportFile} />
  );

  const backButton = (
    <Button type="button" variant="ghost" className="-ml-2 mb-2 min-h-[48px] gap-2" onClick={goBack}>
      <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to settings
    </Button>
  );

  const importErrorEl = importError ? (
    <p role="alert" className="mt-3 flex items-start gap-3 rounded-lg border border-destructive bg-card px-4 py-3 text-base text-foreground">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" /> {importError}
    </p>
  ) : null;

  /* ---------------- step 1 ---------------- */
  if (phase === 'start') {
    return (
      <PageContainer className="max-w-2xl">
        {backButton}
        <PageHeader title="New keyboard layout" description="Design a key arrangement that fits your reach." />
        {hiddenInput}
        <StartStep initialHand={meta.hand} uiHand={storeHand} onStart={startFrom} onImport={() => fileRef.current?.click()} />
        {importErrorEl}
        <LeaveDialog open={leaveOpen} onOpenChange={setLeaveOpen} onLeave={() => navigate('/settings')} />
      </PageContainer>
    );
  }

  /* ---------------- editor ---------------- */
  const baseName = availableLayouts.find((l) => l.id === meta.baseLayout)?.name ?? meta.baseLayout;
  const row = selected?.row ?? draft.length - 1;
  return (
    <PageContainer className="max-w-2xl">
      {backButton}
      <PageHeader
        title={initial ? 'Edit layout' : 'Design your layout'}
        description={`Based on ${baseName}, ${meta.hand} hand.`}
       
      />
      {hiddenInput}

      <div className="space-y-6">
        <section className="space-y-1.5">
          <Label htmlFor="layout-name">Layout name</Label>
          <Input
            id="layout-name"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={nameError !== ''}
            aria-describedby="layout-name-hint"
            className="h-12"
          />
          <p id="layout-name-hint" className={cn('text-sm', nameError ? 'text-destructive' : 'text-muted-foreground')}>
            {nameError || `${name.length}/${MAX_NAME_LENGTH} characters`}
          </p>
        </section>

        <section className="space-y-3 rounded-lg border bg-card p-3" aria-label="Layout editor">
          <div role="tablist" aria-label="Editor mode" className="flex gap-1 rounded-lg border border-input bg-background p-1">
            {(
              [
                ['edit', 'Edit layout'],
                ['test', 'Test drive'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => {
                  setTab(id);
                  setSelected(null);
                  if (id === 'test') restartTest();
                }}
                className={cn(
                  'min-h-[44px] flex-1 rounded-md px-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  tab === id ? 'bg-primary font-bold text-primary-foreground' : 'font-medium text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'test' && (
            <div className="rounded-lg border border-border bg-background p-3" aria-label="Test drive">
              <p className="mb-2 text-sm leading-5 text-muted-foreground">
                Tap the highlighted key to type the sample. {!hasSpace && 'Spaces are skipped because this layout has no Space key.'}
              </p>
              <p className="break-words font-mono text-2xl leading-8 tracking-[0.02em]" aria-label={`Sample text: ${SAMPLE}`}>
                {[...SAMPLE].map((ch, i) => (
                  <span
                    key={i}
                    className={cn(
                      i < cur && 'text-foreground',
                      i === cur && 'border-b-2 border-foreground text-foreground',
                      i > cur && 'text-muted-foreground',
                    )}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span role="status" aria-live="polite" className="mr-auto text-sm font-medium">
                  {done ? `Done! Accuracy ${accuracy}%` : `Accuracy ${accuracy}% · ${hits} correct, ${misses} missed`}
                </span>
                {!done && (
                  <Button type="button" variant="outline" className="min-h-[48px]" onClick={() => setTestIdx(cur + 1)}>
                    Skip letter
                  </Button>
                )}
                <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={restartTest}>
                  <RotateCcw className="h-5 w-5" aria-hidden="true" /> Restart
                </Button>
              </div>
            </div>
          )}

          <KeyboardGrid
            layout={draft}
            mode={tab === 'edit' ? 'edit' : 'preview'}
            selected={selected}
            highlightKey={tab === 'test' ? target : null}
            onKeyPress={onKeyPress}
            label={tab === 'edit' ? 'Layout editor keys' : 'Test drive keys'}
            hand={meta.hand}
          />

          {tab === 'edit' && (
            <>
              <p className="text-sm text-muted-foreground">
                {selected && selectedKey
                  ? `Selected ${keyLabel(selectedKey.key, selectedKey.displayKey) || 'blank key'}. Tap another key to swap, or tap it again to deselect.`
                  : 'Tap a key to select it, then tap a second key to swap their characters.'}
              </p>

              {selected && selectedKey && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="min-h-[48px] gap-2"
                    onClick={() => setSheet({ mode: 'edit', row: selected.row, col: selected.col })}
                  >
                    <Pencil className="h-5 w-5" aria-hidden="true" /> Edit key
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-[48px] gap-2"
                    onClick={() => {
                      commit(removeKey(draft, selected), 'Key removed.');
                      setSelected(null);
                    }}
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" /> Remove key
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={undo} disabled={history.length === 0}>
                  <Undo2 className="h-5 w-5" aria-hidden="true" /> Undo
                </Button>
                <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={resetToBase}>
                  <RotateCcw className="h-5 w-5" aria-hidden="true" /> Reset to base
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-[48px] gap-2"
                  onClick={() => commit(addRow(draft), 'Row added.')}
                  disabled={!canAddRow(draft)}
                >
                  <Plus className="h-5 w-5" aria-hidden="true" /> Add row
                </Button>
              </div>

              <ul className="divide-y divide-border border-y border-border" aria-label="Rows">
                {draft.map((r, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-1.5">
                    <span className="text-sm">
                      Row {i + 1} <span className="text-muted-foreground">&middot; {r.length}/10 keys</span>
                    </span>
                    <span className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="min-h-[48px] gap-1"
                        aria-label={`Add key to row ${i + 1}`}
                        disabled={!canAddKey(draft, i)}
                        onClick={() => setSheet({ mode: 'add', row: i, col: r.length })}
                      >
                        <Plus className="h-5 w-5" aria-hidden="true" /> Add key
                      </Button>
                      {r.length === 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="min-h-[48px] gap-1 text-destructive"
                          aria-label={`Remove empty row ${i + 1}`}
                          onClick={() => {
                            commit(removeRow(draft, i), 'Row removed.');
                            setSelected(null);
                          }}
                        >
                          <Eraser className="h-5 w-5" aria-hidden="true" /> Remove row
                        </Button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="sr-only" role="status" aria-live="polite">
            {status}
          </p>
        </section>

        <section aria-label="Layout checks" className="space-y-2">
          <h2 className="text-lg font-bold leading-[1.625rem]">Checks</h2>
          {errors.length === 0 && warnings.length === 0 && (
            <p className="flex items-start gap-3 rounded-lg border border-success bg-card px-4 py-3 text-base">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" /> Looks good. Every letter has a key.
            </p>
          )}
          {errors.map((m) => (
            <p key={m} role="alert" className="flex items-start gap-3 rounded-lg border border-destructive bg-card px-4 py-3 text-base text-foreground">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" /> {m}
            </p>
          ))}
          {warnings.map((m) => (
            <p key={m} className="flex items-start gap-3 rounded-lg border border-primary bg-card px-4 py-3 text-base">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> {m}
            </p>
          ))}
        </section>

        <section aria-label="Save and share" className="space-y-3">
          <div className={cn('flex flex-wrap gap-2', mirrorRow(storeHand))}>
            <Button type="button" className="min-h-[48px] flex-1 gap-2" onClick={save} disabled={!canSave}>
              <Save className="h-5 w-5" aria-hidden="true" /> Save layout
            </Button>
            <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={exportJson}>
              <Download className="h-5 w-5" aria-hidden="true" /> Export JSON
            </Button>
            <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={() => fileRef.current?.click()}>
              <Upload className="h-5 w-5" aria-hidden="true" /> Import JSON
            </Button>
          </div>
          {!canSave && (
            <p className="text-sm leading-5 text-muted-foreground">Fix the problems above to save. Warnings never block saving.</p>
          )}
          {importErrorEl}
        </section>
      </div>

      <KeySheet
        open={sheet !== null}
        mode={sheet?.mode ?? 'edit'}
        rowLabel={`row ${(sheet?.row ?? row) + 1}`}
        initialChar={sheet?.mode === 'edit' ? draft[sheet.row]?.[sheet.col]?.key ?? '' : ''}
        initialFinger={sheet?.mode === 'edit' ? draft[sheet.row]?.[sheet.col]?.finger ?? '' : draft[sheet?.row ?? 0]?.[draft[sheet?.row ?? 0].length - 1]?.finger ?? 'index'}
        usedChars={usedChars}
        onOpenChange={(o) => !o && setSheet(null)}
        onApply={applySheet}
        onClear={
          sheet?.mode === 'edit'
            ? () => {
                commit(clearKey(draft, { row: sheet.row, col: sheet.col }), 'Key cleared. It is now a blank spacer.');
                setSheet(null);
                setSelected(null);
              }
            : undefined
        }
      />

      <LeaveDialog open={leaveOpen} onOpenChange={setLeaveOpen} onLeave={() => navigate('/settings')} />

      <AlertDialog open={savedOpen} onOpenChange={(o) => !o && finishSaved(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Layout saved</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{trimmedName}&rdquo; is saved on this device. Use it for practice right away?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => finishSaved(false)}>
              Not now
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => finishSaved(true)}>
              Use this layout now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}

function LeaveDialog({ open, onOpenChange, onLeave }: { open: boolean; onOpenChange: (o: boolean) => void; onLeave: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard your changes?</AlertDialogTitle>
          <AlertDialogDescription>You have unsaved changes to this layout. If you leave now they will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep editing</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground active:bg-destructive/80" onClick={onLeave}>
            Discard and leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function StartStep({
  initialHand,
  uiHand,
  onStart,
  onImport,
}: {
  initialHand: Hand;
  uiHand: Hand;
  onStart: (base: BuiltInLayoutId, hand: Hand) => void;
  onImport: () => void;
}) {
  const [base, setBase] = useState<BuiltInLayoutId>('qwerty');
  const [hand, setHand] = useState<Hand>(initialHand);
  return (
    <div className="space-y-6">
      <section aria-labelledby="start-from">
        <h2 id="start-from" className="mb-3 text-lg font-bold leading-[1.625rem]">
          Step 1 &middot; Start from
        </h2>
        <div role="radiogroup" aria-label="Start from layout" className="grid gap-2">
          {availableLayouts.map((l) => {
            const on = l.id === base;
            return (
              <button
                key={l.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setBase(l.id as BuiltInLayoutId)}
                className={cn(
                  'flex min-h-[56px] items-start gap-3 rounded-lg bg-card text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  on ? 'border-2 border-primary p-[15px]' : 'border border-input p-4',
                )}
              >
                <span aria-hidden="true" className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', on ? 'border-primary' : 'border-input')}>
                  {on && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">
                    {l.name}
                    {l.specialized ? ' (one-hand)' : ''}
                  </span>
                  <span className="block text-sm leading-5 text-muted-foreground">{l.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="which-hand" className="space-y-2">
        <h2 id="which-hand" className="text-lg font-bold leading-[1.625rem]">
          Which hand?
        </h2>
        <div role="radiogroup" aria-label="Hand for this layout" className="flex gap-1 rounded-lg border border-input bg-background p-1">
          {(['left', 'right'] as const).map((h) => (
            <button
              key={h}
              type="button"
              role="radio"
              aria-checked={hand === h}
              onClick={() => setHand(h)}
              className={cn(
                'min-h-[44px] flex-1 rounded-md px-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                hand === h ? 'bg-primary font-bold text-primary-foreground' : 'font-medium text-foreground',
              )}
            >
              {h === 'left' ? 'Left hand' : 'Right hand'}
            </button>
          ))}
        </div>
      </section>

      <div className={cn('flex flex-wrap gap-2', mirrorRow(uiHand))}>
        <Button type="button" className="min-h-[48px] flex-1" onClick={() => onStart(base, hand)}>
          Start designing
        </Button>
        <Button type="button" variant="outline" className="min-h-[48px] gap-2" onClick={onImport}>
          <Upload className="h-5 w-5" aria-hidden="true" /> Import JSON
        </Button>
      </div>
    </div>
  );
}
