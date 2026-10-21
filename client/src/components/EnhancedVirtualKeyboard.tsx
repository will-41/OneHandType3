import React, { useState, useEffect, useCallback } from 'react';
import { resolveLayout } from '../lib/customLayouts';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  getKeyboardLayout, 
  isSpecializedLayout, 
  getChordMappings, 
  findChordForKeys,
  type ChordMapping,
  type InternationalLayout,
  type SpecializedLayoutType,
  type KeyboardKey 
} from '../lib/keyboardLayouts';

interface EnhancedVirtualKeyboardProps {
  onKeyPress?: (key: string) => void;
  highlightedKey?: string;
  className?: string;
  viewMode?: 'portrait' | 'landscape';
  targetText?: string;
  currentPosition?: number;
  errors?: Array<{ position: number; character: string; timestamp: number }>;
}

interface KeyData {
  key: string;
  displayKey?: string;
  finger: 'I' | 'II' | 'III' | 'IV' | 'V' | 'thumb' | 'none' | 'pinky' | 'ring' | 'middle' | 'index';
  recommended: boolean;
  row: number;
  width?: number;
  isSpacerKey?: boolean;
  chordKeys?: string[];
  isModifier?: boolean;
  ergonomicScore?: number;
}

// Haptic feedback for mobile devices
const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    navigator.vibrate(patterns[intensity]);
  }
};

// Key press wave effect component
const KeyPressWave: React.FC<{ 
  isActive: boolean; 
  position: { x: number; y: number };
  color: string;
}> = ({ isActive, position, color }) => {
  if (!isActive) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div 
        className={`w-4 h-4 rounded-full ${color} opacity-70 animate-ping`}
        style={{ animationDuration: '0.8s' }}
      />
      <div 
        className={`w-8 h-8 rounded-full ${color} opacity-40 animate-ping absolute inset-0`}
        style={{ animationDuration: '1.2s', animationDelay: '0.2s' }}
      />
    </div>
  );
};

// Enhanced key component with 3D effects
const EnhancedKey: React.FC<{
  keyData: KeyData;
  isPressed: boolean;
  isHighlighted: boolean;
  isRecommended: boolean;
  isError: boolean;
  theme: string;
  onPress: (key: string) => void;
  showFingerGuide: boolean;
}> = ({ 
  keyData, 
  isPressed, 
  isHighlighted, 
  isRecommended, 
  isError,
  theme, 
  onPress,
  showFingerGuide
}) => {
  const [ripplePosition, setRipplePosition] = useState<{ x: number; y: number } | null>(null);
  const [showWave, setShowWave] = useState(false);

  const handleKeyPress = useCallback((e: React.MouseEvent) => {
    if (keyData.isSpacerKey) return;
    
    // Trigger haptic feedback
    triggerHapticFeedback(isError ? 'heavy' : 'light');
    
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Show wave effect
    setShowWave(true);
    setTimeout(() => setShowWave(false), 800);
    
    onPress(keyData.key);
  }, [keyData, isError, onPress]);

  if (keyData.isSpacerKey) {
    return <div className="invisible" style={{ width: keyData.width || 40 }} />;
  }

  const getKeyStyle = () => {
    let baseClasses = `
      relative overflow-hidden rounded-lg font-semibold transition-all duration-200 
      transform active:scale-95 cursor-pointer select-none flex items-center justify-center
      shadow-lg hover:shadow-xl
    `;

    // 3D depth effect
    if (isPressed) {
      baseClasses += ' translate-y-1 shadow-md';
    } else {
      baseClasses += ' hover:-translate-y-1 hover:shadow-2xl';
    }

    // Color scheme based on state
    if (isError) {
      baseClasses += theme === 'dark' 
        ? ' bg-gradient-to-b from-red-600 to-red-700 text-white border-2 border-red-500 shadow-red-500/50'
        : ' bg-gradient-to-b from-red-500 to-red-600 text-white border-2 border-red-400 shadow-red-400/50';
    } else if (isHighlighted) {
      baseClasses += theme === 'dark'
        ? ' bg-gradient-to-b from-blue-500 to-blue-600 text-white border-2 border-blue-400 shadow-blue-500/50 animate-pulse'
        : ' bg-gradient-to-b from-blue-400 to-blue-500 text-white border-2 border-blue-300 shadow-blue-400/50 animate-pulse';
    } else if (isRecommended) {
      baseClasses += theme === 'dark'
        ? ' bg-gradient-to-b from-green-600 to-green-700 text-white border-2 border-green-500 shadow-green-500/30'
        : ' bg-gradient-to-b from-green-500 to-green-600 text-white border-2 border-green-400 shadow-green-400/30';
    } else {
      baseClasses += theme === 'dark'
        ? ' bg-gradient-to-b from-slate-600 to-slate-700 text-white border-2 border-slate-500 hover:from-slate-500 hover:to-slate-600'
        : ' bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900 border-2 border-gray-300 hover:from-gray-100 hover:to-gray-200';
    }

    return baseClasses;
  };

  const getFingerColor = () => {
    const colors: Record<string, string> = {
      'V': 'bg-pink-500',    // Pinky
      'IV': 'bg-orange-500', // Ring
      'III': 'bg-yellow-500', // Middle
      'II': 'bg-green-500',   // Index
      'I': 'bg-blue-500',     // Index
      'thumb': 'bg-purple-500',
      'none': 'bg-gray-500',
      // Also map the name-based fingers
      'pinky': 'bg-pink-500',
      'ring': 'bg-orange-500',
      'middle': 'bg-yellow-500',
      'index': 'bg-blue-500'
    };
    return colors[keyData.finger] || 'bg-gray-500';
  };

  return (
    <button
      className={cn(getKeyStyle())}
      style={{ 
        width: keyData.width || 40,
        height: 40,
        minWidth: keyData.width || 40
      }}
      onClick={handleKeyPress}
      onMouseDown={() => setShowWave(true)}
      onMouseUp={() => setShowWave(false)}
    >
      {/* Finger guide indicator */}
      {showFingerGuide && isRecommended && (
        <div 
          className={`absolute top-0 left-0 w-2 h-2 rounded-full ${getFingerColor()} opacity-80`}
        />
      )}
      
      {/* Key content */}
      <span className="relative z-10 text-sm font-bold">
        {keyData.displayKey || keyData.key.toUpperCase()}
      </span>
      
      {/* Glow effect for special keys */}
      {(isHighlighted || isError) && (
        <div className="absolute inset-0 rounded-lg bg-white/20 animate-pulse" />
      )}
      
      {/* Ripple effect */}
      {ripplePosition && (
        <div
          className="absolute bg-white/40 rounded-full animate-ping"
          style={{
            left: ripplePosition.x - 10,
            top: ripplePosition.y - 10,
            width: 20,
            height: 20,
            animation: 'ping 0.6s cubic-bezier(0, 0, 0.2, 1)'
          }}
        />
      )}
      
      {/* Wave effect */}
      <KeyPressWave 
        isActive={showWave}
        position={ripplePosition || { x: 20, y: 20 }}
        color={isError ? 'bg-red-400' : isHighlighted ? 'bg-blue-400' : 'bg-green-400'}
      />
      
      {/* 3D highlight effect */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-lg" />
    </button>
  );
};

const EnhancedVirtualKeyboard: React.FC<EnhancedVirtualKeyboardProps> = ({ 
  onKeyPress, 
  highlightedKey,
  className,
  viewMode = 'portrait',
  targetText = '',
  currentPosition = 0,
  errors = []
}) => {
  const { handPreference, themeMode, keyboardLayout, customLayouts } = useTypingStore();
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [showFingerGuide, setShowFingerGuide] = useState(true);
  const [displayMode, setDisplayMode] = useState<'standard' | 'compact'>('standard');
  const [activeChordKeys, setActiveChordKeys] = useState<Set<string>>(new Set());
  const [chordPreview, setChordPreview] = useState<ChordMapping | null>(null);

  // Get the next character to type for dynamic highlighting
  const nextChar = targetText[currentPosition] || '';
  const shouldShowUppercase = nextChar === nextChar.toUpperCase() && nextChar !== nextChar.toLowerCase();

  // Handle physical keyboard presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => new Set([...prev, key]));
      
      // Trigger haptic feedback for physical keys too
      triggerHapticFeedback('light');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerHapticFeedback]);

  // Convert KeyboardKey to KeyData format
  const convertToKeyData = (keyboardKeys: KeyboardKey[][], isSpecialized: boolean = false): KeyData[] => {
    const keyData: KeyData[] = [];
    
    keyboardKeys.forEach((row, rowIndex) => {
      row.forEach((key) => {
        // Map finger names to compatible format
        const fingerMap: Record<string, KeyData['finger']> = {
          'pinky': 'V',
          'ring': 'IV', 
          'middle': 'III',
          'index': 'I',
          'thumb': 'thumb'
        };
        
        const mappedFinger = fingerMap[key.finger || 'none'] || 'none';
        
        keyData.push({
          key: key.key,
          displayKey: key.displayKey,
          finger: mappedFinger,
          recommended: true, // All keys are recommended in specialized layouts
          row: rowIndex + 1,
          width: key.key === ' ' ? 200 : (key.displayKey === '⌫' ? 60 : 40),
          chordKeys: key.chordKeys,
          isModifier: key.isModifier,
          ergonomicScore: key.ergonomicScore
        });
      });
    });
    
    return keyData;
  };

  // Get the appropriate keyboard layout
  const getKeyboardLayoutData = (): KeyData[] => {
    try {
      const layoutKeys = resolveLayout(handPreference, keyboardLayout, customLayouts);
      return convertToKeyData(layoutKeys, isSpecializedLayout(keyboardLayout));
    } catch (error) {
      console.warn('Error getting keyboard layout, falling back to default:', error);
      // Fallback to QWERTY if there's an error
      const fallbackKeys = getKeyboardLayout(handPreference, 'qwerty');
      return convertToKeyData(fallbackKeys);
    }
  };

  const layout = getKeyboardLayoutData();
  const maxRow = Math.max(...layout.map(key => key.row));
  const rows = Array.from({ length: maxRow }, (_, i) => i + 1);

  // Check if a key has recent errors
  const getKeyErrors = (key: string) => {
    const recentErrors = errors.filter(
      error => error.character.toLowerCase() === key.toLowerCase() && 
      Date.now() - error.timestamp < 5000 // Last 5 seconds
    );
    return recentErrors.length;
  };

  // Handle chord key press for ARTSEY layout
  const handleChordKeyPress = useCallback((key: string) => {
    if (keyboardLayout !== 'artsey') return;
    
    setActiveChordKeys(prev => {
      const newKeys = new Set(prev);
      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }
      
      // Check if this combination forms a valid chord
      const chordKeys = Array.from(newKeys);
      const chord = findChordForKeys(chordKeys, 'artsey');
      setChordPreview(chord);
      
      return newKeys;
    });
  }, [keyboardLayout]);

  // Clear chord state after timeout or completion
  useEffect(() => {
    if (activeChordKeys.size === 0) {
      setChordPreview(null);
      return;
    }
    
    const timeout = setTimeout(() => {
      const chordKeys = Array.from(activeChordKeys);
      const chord = findChordForKeys(chordKeys, 'artsey');
      
      if (chord && onKeyPress) {
        onKeyPress(chord.output);
      }
      
      setActiveChordKeys(new Set());
      setChordPreview(null);
    }, 800); // Chord timeout
    
    return () => clearTimeout(timeout);
  }, [activeChordKeys, onKeyPress]);

  return (
    <div className={cn(
      "p-6 rounded-2xl shadow-2xl backdrop-blur-lg border-2 transition-all duration-300",
      themeMode === 'dark' 
        ? 'bg-slate-800/90 border-slate-600/50' 
        : 'bg-white/90 border-gray-200/50',
      className
    )}>
      {/* Keyboard controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFingerGuide(!showFingerGuide)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              showFingerGuide
                ? 'bg-blue-500 text-white shadow-lg'
                : themeMode === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Finger Guide
          </button>
          <button
            onClick={() => setDisplayMode(displayMode === 'standard' ? 'compact' : 'standard')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              themeMode === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {displayMode === 'standard' ? 'Compact' : 'Standard'}
          </button>
        </div>
        
        <div className={`text-sm font-medium ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {handPreference === 'left' ? 'Left' : 'Right'} Hand - {keyboardLayout.toUpperCase()} Layout
          {isSpecializedLayout(keyboardLayout) && (
            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
              Specialized
            </span>
          )}
        </div>
      </div>

      {/* Chord Preview for ARTSEY */}
      {keyboardLayout === 'artsey' && (activeChordKeys.size > 0 || chordPreview) && (
        <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Active Chord: {Array.from(activeChordKeys).join(' + ') || 'None'}
              </div>
              {chordPreview && (
                <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                  Will type: "{chordPreview.output}" ({chordPreview.description})
                </div>
              )}
            </div>
            <div className="text-xs text-orange-500">
              Release to type or add more keys
            </div>
          </div>
        </div>
      )}

      {/* Virtual keyboard */}
      <div className="space-y-2">
        {rows.map(rowNumber => (
          <div key={rowNumber} className="flex justify-center gap-1">
            {layout
              .filter(key => key.row === rowNumber)
              .map((keyData, index) => (
                <EnhancedKey
                  key={`${keyData.key}-${index}`}
                  keyData={keyData}
                  isPressed={pressedKeys.has(keyData.key) || (keyboardLayout === 'artsey' && activeChordKeys.has(keyData.key))}
                  isHighlighted={
                    highlightedKey === keyData.key || 
                    nextChar.toLowerCase() === keyData.key ||
                    (chordPreview && chordPreview.keys.includes(keyData.key)) || false
                  }
                  isRecommended={keyData.recommended}
                  isError={getKeyErrors(keyData.key) > 0}
                  theme={themeMode}
                  onPress={(key) => {
                    if (keyboardLayout === 'artsey' && ['a', 'r', 't', 's', 'e', 'y', 'o', 'i'].includes(key)) {
                      handleChordKeyPress(key);
                    } else {
                      onKeyPress?.(key);
                    }
                  }}
                  showFingerGuide={showFingerGuide}
                />
              ))}
          </div>
        ))}
      </div>

      {/* Keyboard legend */}
      {showFingerGuide && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600">
          <div className="text-sm font-medium mb-2">Finger Guide:</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span>Pinky</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Ring</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Middle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Index</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Thumb</span>
            </div>
          </div>
        </div>
      )}

      {/* Performance indicators */}
      <div className="mt-4 flex justify-between items-center text-xs">
        <div className={`${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Next: <span className="font-bold text-blue-500">{nextChar || 'Complete!'}</span>
          {keyboardLayout === 'artsey' && chordPreview && (
            <span className="ml-2 text-orange-500">
              (Chord: {chordPreview.keys.join('+')})
            </span>
          )}
        </div>
        <div className={`${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Recent Errors: <span className="font-bold text-red-500">{errors.length}</span>
          {keyboardLayout === 'artsey' && (
            <span className="ml-2">
              Chords: <span className="font-bold text-purple-500">{activeChordKeys.size}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedVirtualKeyboard;