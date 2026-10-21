import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { TypingEngine, TypingResult } from '../lib/typingEngine';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { isSpecializedLayout, type ChordMapping } from '../lib/keyboardLayouts';

interface TypingAreaProps {
  targetText: string;
  onTypingUpdate?: (result: TypingResult) => void;
  onComplete?: (result: TypingResult) => void;
  className?: string;
  autoFocus?: boolean;
  onVirtualKeyPress?: (handler: (key: string) => void) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  onTypingUpdate,
  onComplete,
  className,
  autoFocus = true,
  onVirtualKeyPress
}) => {
  const { themeMode, keyboardLayout, handPreference } = useTypingStore();
  const [engine] = useState(() => new TypingEngine(targetText, keyboardLayout, handPreference));
  const [chordState, setChordState] = useState<{
    activeKeys: string[];
    suggestedChord?: ChordMapping;
    timeRemaining: number;
  }>({ activeKeys: [], timeRemaining: 0 });
  const [result, setResult] = useState<TypingResult>(() => 
    engine.processInput('')
  );
  console.log('TypingArea: Initializing with targetText:', targetText);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    engine.setTargetText(targetText);
    engine.setLayout(keyboardLayout, handPreference);
    setInputValue('');
    const initialResult = engine.processInput('');
    setResult(initialResult);
    onTypingUpdate?.(initialResult);
  }, [targetText, engine, onTypingUpdate, keyboardLayout, handPreference]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const newResult = engine.processInput(value);
    setResult(newResult);
    onTypingUpdate?.(newResult);
    
    if (engine.isComplete()) {
      onComplete?.(newResult);
    }
  };

  const handleVirtualKeyPress = (key: string) => {
    if (key === 'space') {
      const newValue = inputValue + ' ';
      handleInputChange(newValue);
    } else if (key === 'backspace') {
      const newValue = inputValue.slice(0, -1);
      handleInputChange(newValue);
    } else if (key === 'enter') {
      const newValue = inputValue + '\n';
      handleInputChange(newValue);
    } else if (key.length === 1) {
      const newValue = inputValue + key;
      handleInputChange(newValue);
    }
  };

  // Expose the virtual key handler to parent and onVirtualKeyPress
  useEffect(() => {
    const keyHandler = (key: string) => handleVirtualKeyPress(key);
    
    if (onVirtualKeyPress) {
      onVirtualKeyPress(keyHandler);
    }
    (window as any).virtualKeyHandler = keyHandler;
    
    return () => {
      delete (window as any).virtualKeyHandler;
    };
  }, [inputValue]);

  // Handle chord input for ARTSEY layout
  const handleChordKeyPress = (key: string, isPressed: boolean) => {
    if (keyboardLayout !== 'artsey') return;
    
    let newResult: TypingResult;
    if (isPressed) {
      newResult = engine.addChordKey(key);
    } else {
      newResult = engine.removeChordKey(key);
    }
    
    setResult(newResult);
    setChordState(engine.getChordState());
    onTypingUpdate?.(newResult);
    
    if (engine.isComplete()) {
      onComplete?.(newResult);
    }
  };

  // Update chord state periodically for ARTSEY
  useEffect(() => {
    if (keyboardLayout !== 'artsey') return;
    
    const interval = setInterval(() => {
      setChordState(engine.getChordState());
    }, 100);
    
    return () => clearInterval(interval);
  }, [keyboardLayout, engine]);

  // Listen for physical chord key presses
  useEffect(() => {
    if (keyboardLayout !== 'artsey') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['a', 'r', 't', 's', 'e', 'y', 'o', 'i'].includes(key)) {
        e.preventDefault();
        handleChordKeyPress(key, true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['a', 'r', 't', 's', 'e', 'y', 'o', 'i'].includes(key)) {
        e.preventDefault();
        handleChordKeyPress(key, false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyboardLayout, handleChordKeyPress]);

  const renderText = () => {
    const { currentText, targetText } = result;
    const chars = targetText.split('');
    
    return (
      <div className="text-lg leading-relaxed font-mono">
        {chars.map((char, index) => {
          let className = '';
          
          if (index < currentText.length) {
            // Already typed
            if (currentText[index] === char) {
              className = 'bg-green-200 text-green-800'; // Correct
            } else {
              className = 'bg-red-200 text-red-800'; // Error
            }
          } else if (index === currentText.length) {
            // Current cursor position
            className = 'bg-blue-200 text-blue-800 animate-pulse';
          } else {
            // Not yet typed
            className = 'text-gray-600';
          }
          
          return (
            <span
              key={index}
              className={cn('px-0.5 py-0.5 rounded', className)}
            >
              {char === ' ' ? '␣' : char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {/* ARTSEY Chord Display */}
      {keyboardLayout === 'artsey' && (chordState.activeKeys.length > 0 || chordState.suggestedChord) && (
        <div className="mb-4 p-4 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                Active Chord: {chordState.activeKeys.join(' + ') || 'None'}
              </div>
              {chordState.suggestedChord && (
                <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                  Will type: "{chordState.suggestedChord.output}" ({chordState.suggestedChord.description})
                </div>
              )}
              {result.nextExpectedChar && (
                <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                  Next character needed: "{result.nextExpectedChar}"
                </div>
              )}
            </div>
            {chordState.timeRemaining > 0 && (
              <div className="text-xs text-orange-500 px-2 py-1 bg-orange-200 dark:bg-orange-800 rounded">
                Chord timeout: {Math.ceil(chordState.timeRemaining / 1000)}s
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input area - Adapted for layout */}
      <div className="mb-4">
        {keyboardLayout === 'artsey' ? (
          // For ARTSEY, show a read-only display since input is chord-based
          <div className="w-full h-16 p-3 border rounded-lg font-mono text-lg bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              ARTSEY Mode: Use chord combinations on virtual keyboard
            </div>
            <div className="text-lg font-bold">
              {inputValue || "Press chord keys to type..."}
            </div>
          </div>
        ) : (
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full h-16 p-3 border rounded-lg font-mono text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black dark:bg-slate-800 dark:text-white dark:border-slate-600"
            placeholder={`Start typing here... (${keyboardLayout.toUpperCase()} layout)`}
            aria-label="Typing input area"
          />
        )}
      </div>
      
      {/* Stats Display - Enhanced for specialized layouts */}
      <div className={`flex justify-between items-center text-xs opacity-75 mb-2 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`}>
        <span>WPM: {result.stats.wpm}</span>
        <span>Accuracy: {result.stats.accuracy}%</span>
        <span>Progress: {Math.round(engine.getProgress())}%</span>
        <span>Errors: {result.stats.errors}</span>
        {keyboardLayout === 'artsey' && result.stats.chordCombinations && (
          <span>Chords: {result.stats.chordCombinations}</span>
        )}
        {isSpecializedLayout(keyboardLayout) && result.stats.layoutSpecificMetrics?.avgErgonomicScore && (
          <span>Ergo: {Math.round(result.stats.layoutSpecificMetrics.avgErgonomicScore)}/10</span>
        )}
      </div>
      
      {/* Completion Message - Enhanced for specialized layouts */}
      {engine.isComplete() && (
        <div className={cn(
          "text-center p-4 border rounded-lg mt-4",
          isSpecializedLayout(keyboardLayout) 
            ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950/20 dark:to-blue-950/20 dark:border-purple-700"
            : "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-700"
        )}>
          <h3 className={cn(
            "text-sm font-bold mb-2",
            isSpecializedLayout(keyboardLayout) ? "text-purple-800 dark:text-purple-200" : "text-green-800 dark:text-green-200"
          )}>
            Lesson Complete! 
            {isSpecializedLayout(keyboardLayout) && (
              <span className="ml-2 text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                {keyboardLayout.toUpperCase()}
              </span>
            )}
          </h3>
          <div className={cn(
            "text-xs space-y-1",
            isSpecializedLayout(keyboardLayout) ? "text-purple-700 dark:text-purple-300" : "text-green-700 dark:text-green-300"
          )}>
            <div>
              WPM: {result.stats.wpm} | Accuracy: {result.stats.accuracy}% | Time: {Math.round(result.stats.timeElapsed / 1000)}s
            </div>
            {keyboardLayout === 'artsey' && result.stats.chordCombinations && (
              <div>Chord Combinations Used: {result.stats.chordCombinations}</div>
            )}
            {isSpecializedLayout(keyboardLayout) && result.stats.layoutSpecificMetrics && (
              <div className="flex justify-center space-x-4 mt-2">
                {result.stats.layoutSpecificMetrics.avgErgonomicScore && (
                  <span>Ergonomic Score: {Math.round(result.stats.layoutSpecificMetrics.avgErgonomicScore)}/10</span>
                )}
                {result.stats.layoutSpecificMetrics.strainPoints && result.stats.layoutSpecificMetrics.strainPoints.length === 0 && (
                  <span className="text-green-600">✓ No Strain Points</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingArea;