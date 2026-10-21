import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FINGERS, isSingleChar } from './layoutOps';

interface KeySheetProps {
  open: boolean;
  mode: 'edit' | 'add';
  /** Where the key lives, for the title (e.g. "Row 2"). */
  rowLabel: string;
  initialChar: string;
  initialFinger: string;
  /** Characters already used by other keys (lower-case), to warn early. */
  usedChars: string[];
  onOpenChange: (open: boolean) => void;
  onApply: (char: string, finger: string) => void;
  onClear?: () => void;
}

/** Bottom sheet for typing a key's character and choosing its finger. */
export default function KeySheet(props: KeySheetProps) {
  // Remount the body per open so fields always start from the key's current values.
  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerContent aria-describedby="key-sheet-desc">
        {props.open && <SheetBody {...props} />}
      </DrawerContent>
    </Drawer>
  );
}

function SheetBody({ mode, rowLabel, initialChar, initialFinger, usedChars, onOpenChange, onApply, onClear }: KeySheetProps) {
  const [char, setChar] = useState(initialChar);
  const [finger, setFinger] = useState(initialFinger);

  const valid = isSingleChar(char);
  const taken = valid && char.toLowerCase() !== initialChar.toLowerCase() && usedChars.includes(char.toLowerCase());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onApply(char, finger);
      }}
    >
      <DrawerHeader>
        <DrawerTitle>{mode === 'add' ? `Add key to ${rowLabel}` : 'Edit key'}</DrawerTitle>
        <DrawerDescription id="key-sheet-desc">
          Type one character and pick the finger that should press it.
        </DrawerDescription>
      </DrawerHeader>
      <div className="space-y-4 px-4">
        <div className="space-y-1.5">
          <Label htmlFor="key-char">Character</Label>
          <Input
            id="key-char"
            value={char}
            maxLength={2}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={(e) => setChar([...e.target.value].slice(-1).join(''))}
            aria-invalid={!valid}
            aria-describedby="key-char-hint"
            className="h-12 text-center font-mono text-xl"
          />
          <p id="key-char-hint" className={`text-sm ${taken ? 'text-destructive' : 'text-muted-foreground'}`}>
            {!valid
              ? 'Enter exactly one printable character.'
              : taken
                ? 'Another key already uses this character. Applying will create a duplicate you must fix before saving.'
                : 'Tip: press the space bar here to make this a Space key.'}
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="key-finger">Finger</Label>
          <select
            id="key-finger"
            value={finger}
            onChange={(e) => setFinger(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Not assigned</option>
            {FINGERS.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DrawerFooter>
        <Button type="submit" className="min-h-[48px]" disabled={!valid}>
          {mode === 'add' ? 'Add key' : 'Apply'}
        </Button>
        {mode === 'edit' && onClear && (
          <Button type="button" variant="outline" className="min-h-[48px]" onClick={onClear}>
            Clear key
          </Button>
        )}
        <Button type="button" variant="ghost" className="min-h-[48px]" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
      </DrawerFooter>
    </form>
  );
}
