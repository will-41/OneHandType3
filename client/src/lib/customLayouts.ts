import {
  getKeyboardLayout,
  type InternationalLayout,
  type KeyboardLayout,
  type SpecializedLayoutType,
} from './keyboardLayouts';

/** Built-in layout ids shipped with the app. */
export type BuiltInLayoutId = InternationalLayout | SpecializedLayoutType;

/** User-made layouts are stored with ids of the form `custom-<suffix>`. */
export type CustomLayoutId = `custom-${string}`;

/** Any layout the user can select: built-in or custom. */
export type LayoutId = BuiltInLayoutId | CustomLayoutId;

/** A user-designed keyboard layout, persisted on-device in the store. */
export interface CustomKeyboardLayout {
  id: CustomLayoutId;
  name: string;
  /** The built-in layout this one was forked from. */
  baseLayout: BuiltInLayoutId;
  /** Which hand this layout is designed for. */
  hand: 'left' | 'right';
  /** Same shape as built-in layouts: rows of keys. */
  layout: KeyboardLayout;
  createdAt: number;
  updatedAt: number;
}

export function isCustomLayoutId(id: string): id is CustomLayoutId {
  return id.startsWith('custom-');
}

export function newCustomLayoutId(): CustomLayoutId {
  return `custom-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Single source of truth for turning a layout id into keys on screen.
 * Custom ids resolve from the user's saved layouts (falling back to QWERTY
 * if the layout was deleted); built-in ids resolve per hand.
 */
export function resolveLayout(
  hand: 'left' | 'right',
  layoutId: LayoutId,
  customLayouts: readonly CustomKeyboardLayout[],
): KeyboardLayout {
  if (isCustomLayoutId(layoutId)) {
    const custom = customLayouts.find((l) => l.id === layoutId);
    return custom ? custom.layout : getKeyboardLayout(hand, 'qwerty');
  }
  return getKeyboardLayout(hand, layoutId);
}

/** Deep copy so edits to a draft never mutate built-in layout data. */
export function cloneLayout(layout: KeyboardLayout): KeyboardLayout {
  return layout.map((row) => row.map((key) => ({ ...key, chordKeys: key.chordKeys ? [...key.chordKeys] : undefined })));
}
