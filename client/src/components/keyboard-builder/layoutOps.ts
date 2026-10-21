import { cloneLayout, type BuiltInLayoutId, type CustomKeyboardLayout, newCustomLayoutId } from '../../lib/customLayouts';
import { availableLayouts, type KeyboardKey, type KeyboardLayout } from '../../lib/keyboardLayouts';
import { MAX_LAYOUT_ROWS, MAX_ROW_KEYS } from '../../lib/layoutValidator';
import type { KeyCoord } from './KeyboardGrid';

export const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const;
export const MAX_NAME_LENGTH = 30;

/** Re-derives `row` and `position` so they always match array indexes (row offsets preserved). */
function renumber(layout: KeyboardLayout): KeyboardLayout {
  return layout.map((row, r) => {
    const offset = row.length > 0 ? row[0].position ?? 0 : 0;
    return row.map((k, c) => ({ ...k, row: r, position: offset + c }));
  });
}

export function swapKeys(layout: KeyboardLayout, a: KeyCoord, b: KeyCoord): KeyboardLayout {
  const next = cloneLayout(layout);
  const ka = next[a.row][a.col];
  const kb = next[b.row][b.col];
  const keyA = ka.key;
  const displayA = ka.displayKey;
  ka.key = kb.key;
  ka.displayKey = kb.displayKey;
  kb.key = keyA;
  kb.displayKey = displayA;
  if (ka.displayKey === undefined) delete ka.displayKey;
  if (kb.displayKey === undefined) delete kb.displayKey;
  return next;
}

export function isSingleChar(value: string): boolean {
  return [...value].length === 1 && !/[\u0000-\u001f\u007f]/.test(value);
}

export function updateKey(layout: KeyboardLayout, at: KeyCoord, char: string, finger: string): KeyboardLayout {
  const next = cloneLayout(layout);
  const k = next[at.row][at.col];
  k.key = char;
  if (char === ' ') k.displayKey = 'Space';
  else delete k.displayKey;
  if (finger) k.finger = finger;
  else delete k.finger;
  return next;
}

export function clearKey(layout: KeyboardLayout, at: KeyCoord): KeyboardLayout {
  const next = cloneLayout(layout);
  const k = next[at.row][at.col];
  k.key = '';
  delete k.displayKey;
  return next;
}

export function addKey(layout: KeyboardLayout, row: number, char: string, finger: string): KeyboardLayout {
  const next = cloneLayout(layout);
  const key: KeyboardKey = { key: char, row, position: 0 };
  if (char === ' ') key.displayKey = 'Space';
  if (finger) key.finger = finger;
  next[row].push(key);
  return renumber(next);
}

export function removeKey(layout: KeyboardLayout, at: KeyCoord): KeyboardLayout {
  const next = cloneLayout(layout);
  next[at.row].splice(at.col, 1);
  return renumber(next);
}

export function addRow(layout: KeyboardLayout): KeyboardLayout {
  return renumber([...cloneLayout(layout), []]);
}

export function removeRow(layout: KeyboardLayout, row: number): KeyboardLayout {
  const next = cloneLayout(layout);
  if (next[row]?.length === 0) next.splice(row, 1);
  return renumber(next);
}

export function canAddRow(layout: KeyboardLayout): boolean {
  return layout.length < MAX_LAYOUT_ROWS;
}

export function canAddKey(layout: KeyboardLayout, row: number): boolean {
  return (layout[row]?.length ?? MAX_ROW_KEYS) < MAX_ROW_KEYS;
}

/* ------------------------------------------------------------------ */
/* Export / import                                                    */
/* ------------------------------------------------------------------ */

export const EXPORT_FORMAT = 'onehandtype-layout';
export const EXPORT_VERSION = 1;

export function serializeLayout(layout: CustomKeyboardLayout): string {
  return JSON.stringify({ format: EXPORT_FORMAT, version: EXPORT_VERSION, layout }, null, 2);
}

export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'layout';
}

type Parsed = { ok: true; layout: CustomKeyboardLayout } | { ok: false; error: string };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 99;

/** Strictly validates an exported layout file; returns a sanitized layout with a fresh id. */
export function parseImportedLayout(text: string): Parsed {
  const bad = (error: string): Parsed => ({ ok: false, error });
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return bad('That file is not valid JSON.');
  }
  if (!isObj(data) || data.format !== EXPORT_FORMAT) return bad('This is not a OneType layout file.');
  if (data.version !== EXPORT_VERSION) return bad('This layout file version is not supported.');
  const src = data.layout;
  if (!isObj(src)) return bad('The layout data is missing.');
  if (typeof src.name !== 'string' || src.name.trim() === '') return bad('The layout needs a name.');
  if (src.hand !== 'left' && src.hand !== 'right') return bad('The layout hand must be left or right.');
  const base = availableLayouts.find((l) => l.id === src.baseLayout);
  if (!base) return bad('The base layout is not recognised.');
  const rows = src.layout;
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > MAX_LAYOUT_ROWS) {
    return bad(`A layout needs between 1 and ${MAX_LAYOUT_ROWS} rows.`);
  }
  const clean: KeyboardLayout = [];
  for (let r = 0; r < rows.length; r += 1) {
    const row: unknown = rows[r];
    if (!Array.isArray(row) || row.length > MAX_ROW_KEYS) return bad(`Row ${r + 1} is malformed or too long.`);
    const outRow: KeyboardKey[] = [];
    for (let c = 0; c < row.length; c += 1) {
      const k: unknown = row[c];
      if (!isObj(k) || typeof k.key !== 'string' || (k.key !== '' && !isSingleChar(k.key))) {
        return bad(`Key ${c + 1} in row ${r + 1} is invalid.`);
      }
      if (k.displayKey !== undefined && (typeof k.displayKey !== 'string' || k.displayKey.length > 8)) {
        return bad(`Key ${c + 1} in row ${r + 1} has an invalid label.`);
      }
      if (k.finger !== undefined && !(FINGERS as readonly unknown[]).includes(k.finger)) {
        return bad(`Key ${c + 1} in row ${r + 1} has an invalid finger.`);
      }
      if (!isInt(k.row) || !isInt(k.position)) return bad(`Key ${c + 1} in row ${r + 1} has an invalid position.`);
      if (
        k.chordKeys !== undefined &&
        (!Array.isArray(k.chordKeys) || k.chordKeys.length > 8 || !k.chordKeys.every((x) => typeof x === 'string' && x.length <= 2))
      ) {
        return bad(`Key ${c + 1} in row ${r + 1} has invalid chord data.`);
      }
      const key: KeyboardKey = { key: k.key, row: r, position: k.position };
      if (typeof k.displayKey === 'string' && k.displayKey) key.displayKey = k.displayKey;
      if (typeof k.finger === 'string') key.finger = k.finger;
      if (Array.isArray(k.chordKeys)) key.chordKeys = [...(k.chordKeys as string[])];
      if (k.isModifier === true) key.isModifier = true;
      if (typeof k.ergonomicScore === 'number' && Number.isFinite(k.ergonomicScore)) key.ergonomicScore = k.ergonomicScore;
      outRow.push(key);
    }
    clean.push(outRow);
  }
  const now = Date.now();
  return {
    ok: true,
    layout: {
      id: newCustomLayoutId(),
      name: src.name.trim().slice(0, MAX_NAME_LENGTH),
      baseLayout: base.id as BuiltInLayoutId,
      hand: src.hand,
      layout: renumber(clean),
      createdAt: now,
      updatedAt: now,
    },
  };
}
