import React, { useEffect } from 'react';
import { cn } from '../lib/utils.ts';
import { useTypingStore } from '../lib/stores/useTypingStore.tsx';

type Finger = 'I' | 'II' | 'III' | 'IV' | 'V' | 'thumb' | 'none';

interface KeyData {
  key: string;
  displayKey?: string;
  finger: Finger;
  recommended: boolean;
  row: number;
  width?: number;
  isSpacerKey?: boolean;
}

interface VirtualKeyboardProps {
  onKeyPress?: (key: string) => void;
  highlightedKey?: string;
  className?: string;
  viewMode?: 'portrait' | 'landscape';
  targetText?: string;
  currentPosition?: number;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  highlightedKey,
  className,
  viewMode = 'portrait',
  targetText = '',
  currentPosition = 0,
}) => {
  const { handPreference } = useTypingStore();
  const nextChar = targetText[currentPosition] || '';
  const shouldShowUppercase = nextChar === nextChar.toUpperCase() && nextChar !== nextChar.toLowerCase();

  const getOneHandedLayout = (): KeyData[] => {
    const isLeftHand = handPreference === 'left';

    return [
      // Row 1: Numbers with backspace
      { key: '1', finger: 'IV', recommended: isLeftHand, row: 1 },
      { key: '2', finger: 'III', recommended: isLeftHand, row: 1 },
      { key: '3', finger: 'II', recommended: isLeftHand, row: 1 },
      { key: '4', finger: 'I', recommended: isLeftHand, row: 1 },
      { key: '5', finger: 'I', recommended: isLeftHand, row: 1 },
      { key: '6', finger: 'I', recommended: !isLeftHand, row: 1 },
      { key: '7', finger: 'I', recommended: !isLeftHand, row: 1 },
      { key: '8', finger: 'II', recommended: !isLeftHand, row: 1 },
      { key: '9', finger: 'III', recommended: !isLeftHand, row: 1 },
      { key: '0', finger: 'IV', recommended: !isLeftHand, row: 1 },
      { key: 'backspace', finger: 'V', recommended: true, row: 1, width: 2 },
      
      // Row 2: QWERTY top row
      { key: 'q', finger: 'IV', recommended: isLeftHand, row: 2 },
      { key: 'w', finger: 'III', recommended: isLeftHand, row: 2 },
      { key: 'e', finger: 'II', recommended: isLeftHand, row: 2 },
      { key: 'r', finger: 'I', recommended: isLeftHand, row: 2 },
      { key: 't', finger: 'I', recommended: isLeftHand, row: 2 },
      { key: 'y', finger: 'I', recommended: !isLeftHand, row: 2 },
      { key: 'u', finger: 'I', recommended: !isLeftHand, row: 2 },
      { key: 'i', finger: 'II', recommended: !isLeftHand, row: 2 },
      { key: 'o', finger: 'III', recommended: !isLeftHand, row: 2 },
      { key: 'p', finger: 'IV', recommended: !isLeftHand, row: 2 },
      
      // Row 3: ASDF home row
      { key: 'a', finger: 'IV', recommended: isLeftHand, row: 3 },
      { key: 's', finger: 'III', recommended: isLeftHand, row: 3 },
      { key: 'd', finger: 'II', recommended: isLeftHand, row: 3 },
      { key: 'f', finger: 'I', recommended: isLeftHand, row: 3 },
      { key: 'g', finger: 'I', recommended: isLeftHand, row: 3 },
      { key: 'h', finger: 'I', recommended: !isLeftHand, row: 3 },
      { key: 'j', finger: 'I', recommended: !isLeftHand, row: 3 },
      { key: 'k', finger: 'II', recommended: !isLeftHand, row: 3 },
      { key: 'l', finger: 'III', recommended: !isLeftHand, row: 3 },
      { key: ';', finger: 'IV', recommended: !isLeftHand, row: 3 },
      { key: 'enter', finger: 'V', recommended: true, row: 3, width: 2 },
      
      // Row 4: ZXCV bottom row
      { key: 'shift', finger: 'V', recommended: true, row: 4, width: 2 },
      { key: 'z', finger: 'IV', recommended: isLeftHand, row: 4 },
      { key: 'x', finger: 'III', recommended: isLeftHand, row: 4 },
      { key: 'c', finger: 'II', recommended: isLeftHand, row: 4 },
      { key: 'v', finger: 'I', recommended: isLeftHand, row: 4 },
      { key: 'b', finger: 'I', recommended: isLeftHand, row: 4 },
      { key: 'n', finger: 'I', recommended: !isLeftHand, row: 4 },
      { key: 'm', finger: 'I', recommended: !isLeftHand, row: 4 },
      { key: ',', finger: 'II', recommended: !isLeftHand, row: 4 },
      { key: '.', finger: 'III', recommended: !isLeftHand, row: 4 },
      { key: '/', finger: 'IV', recommended: !isLeftHand, row: 4 },
      
      // Row 5: Spacebar
      { key: '', isSpacerKey: true, finger: 'none', recommended: false, row: 5 },
      { key: '', isSpacerKey: true, finger: 'none', recommended: false, row: 5 },
      { key: '', isSpacerKey: true, finger: 'none', recommended: false, row: 5 },
      { key: 'space', finger: 'thumb', recommended: true, row: 5, width: 4 },
      { key: '', isSpacerKey: true, finger: 'none', recommended: false, row: 5 },
      { key: '', isSpacerKey: true, finger: 'none', recommended: false, row: 5 },
      { key: '', isSpacerKey: true, finger: 'none', recommended: false, row: 5 },
    ];
  };

  // Local key handler to avoid referencing stale closures in global handler
  const handleKeyPress = (key: string) => {
    onKeyPress?.(key);
  };

  // Setup and cleanup for global virtual key handler
  useEffect(() => {
    // Store original handler if it exists
    const originalHandler = (window as any).virtualKeyHandler;
    
    // Set up our handler
    (window as any).virtualKeyHandler = (key: string) => {
      // Call our component's handler
      onKeyPress?.(key);
    };

    // Cleanup function to prevent memory leaks
    return () => {
      // Restore original handler if it existed, otherwise remove our handler
      if (originalHandler) {
        (window as any).virtualKeyHandler = originalHandler;
      } else {
        delete (window as any).virtualKeyHandler;
      }
    };
  }, [onKeyPress]);

  const handleKeyClick = (key: string) => {
    // Handle special keys
    if (key === 'space') {
      handleKeyPress(' ');
    } else if (key === 'backspace') {
      handleKeyPress('Backspace');
    } else if (key === 'enter') {
      handleKeyPress('Enter');
    } else if (key === 'shift') {
      // Handle shift toggle logic if needed
      return;
    } else {
      const displayKey = shouldShowUppercase ? key.toUpperCase() : key;
      handleKeyPress(displayKey);
    }

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const getKeyColor = (keyData: KeyData): string => {
    if (keyData.isSpacerKey) return 'bg-transparent border-transparent';
    
    const fingerColors: Record<Finger, string> = {
      'I': 'bg-blue-100 border-blue-300 text-blue-800',
      'II': 'bg-green-100 border-green-300 text-green-800',
      'III': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'IV': 'bg-purple-100 border-purple-300 text-purple-800',
      'V': 'bg-red-100 border-red-300 text-red-800',
      'thumb': 'bg-orange-100 border-orange-300 text-orange-800',
      'none': 'bg-gray-100 border-gray-300 text-gray-600',
    };

    return fingerColors[keyData.finger] || fingerColors.none;
  };

  const getKeyWidth = (keyData: KeyData): string => {
    if (keyData.width === 2) return 'col-span-2';
    if (keyData.width === 4) return 'col-span-4';
    return 'col-span-1';
  };

  const getKeyDisplay = (keyData: KeyData): string => {
    if (keyData.key === 'space') return 'Space';
    if (keyData.key === 'backspace') return '⌫';
    if (keyData.key === 'enter') return '↵';
    if (keyData.key === 'shift') return '⇧';
    
    return shouldShowUppercase ? keyData.key.toUpperCase() : keyData.key;
  };

  const currentLayout = getOneHandedLayout();
  
  // Group keys by row
  const keysByRow = currentLayout.reduce((acc, key) => {
    if (!acc[key.row]) acc[key.row] = [];
    acc[key.row].push(key);
    return acc;
  }, {} as Record<number, KeyData[]>);

  return (
    <div className={cn('p-4 bg-slate-50 rounded-lg', className)}>
      <div className="space-y-2">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {handPreference === 'left' ? 'Left' : 'Right'} Hand Optimized Keyboard
          </h3>
          <p className="text-sm text-gray-600">
            {nextChar ? `Next: "${nextChar}" | ` : ''}
            Keys auto-adjust case. Orange spacebar (thumb), Red backspace (pinky).
          </p>
        </div>

        {Object.entries(keysByRow)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([rowNum, keys]) => (
            <div 
              key={rowNum} 
              className={`grid gap-1 ${
                rowNum === '5' ? 'grid-cols-10 justify-center' : 'grid-cols-10'
              }`}
            >
              {keys.map((keyData, index) => (
                <button
                  key={`${keyData.key}-${index}`}
                  onClick={() => !keyData.isSpacerKey && handleKeyClick(keyData.key)}
                  disabled={keyData.isSpacerKey}
                  className={cn(
                    'h-12 border-2 rounded-md font-medium text-sm transition-all duration-200',
                    !keyData.isSpacerKey && 'hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    getKeyColor(keyData),
                    getKeyWidth(keyData),
                    keyData.key === highlightedKey && 'ring-4 ring-blue-400',
                    keyData.isSpacerKey && 'cursor-default'
                  )}
                  title={!keyData.isSpacerKey ? `${getKeyDisplay(keyData)} - Finger ${keyData.finger}${keyData.recommended ? ' (Recommended)' : ''}` : ''}
                >
                  {!keyData.isSpacerKey && (
                    <div className="flex flex-col items-center">
                      <span>{getKeyDisplay(keyData)}</span>
                      <span className="text-xs opacity-60">{keyData.finger}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
