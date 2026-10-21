import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { Hand } from 'lucide-react';

interface EnhancedTypingAreaProps {
  targetText: string;
  currentText: string;
  currentPosition: number;
  errors: Array<{ position: number; character: string; timestamp: number }>;
  onTextChange: (text: string) => void;
  className?: string;
  showFocusMode?: boolean;
}

// Word component with advanced highlighting
const EnhancedWord: React.FC<{
  word: string;
  wordIndex: number;
  currentPosition: number;
  typedText: string;
  errors: Array<{ position: number; character: string; timestamp: number }>;
  theme: string;
  isFocusMode: boolean;
  isCurrentWord: boolean;
}> = ({ word, wordIndex, currentPosition, typedText, errors, theme, isFocusMode, isCurrentWord }) => {
  const wordStartPosition = typedText.slice(0, wordIndex).length + wordIndex; // Including spaces
  
  return (
    <span 
      className={cn(
        "relative inline-block transition-all duration-300",
        isCurrentWord && "bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-2 py-1 rounded-lg shadow-lg transform scale-105",
        isFocusMode && !isCurrentWord && "opacity-40"
      )}
    >
      {word.split('').map((char, charIndex) => {
        const absolutePosition = wordStartPosition + charIndex;
        const isTyped = absolutePosition < currentPosition;
        const isCurrent = absolutePosition === currentPosition;
        const hasError = errors.some(error => error.position === absolutePosition);
        const typedChar = typedText[absolutePosition];
        
        return (
          <span
            key={charIndex}
            className={cn(
              "relative transition-all duration-200",
              // Current character highlighting
              isCurrent && "bg-gradient-to-r from-blue-400 to-blue-500 text-white px-1 rounded animate-pulse shadow-lg",
              // Correct character
              isTyped && !hasError && typedChar === char && "text-green-600 bg-green-100 dark:bg-green-900/30 rounded px-0.5",
              // Incorrect character
              isTyped && (hasError || typedChar !== char) && "text-red-600 bg-red-100 dark:bg-red-900/30 rounded px-0.5 animate-shake",
              // Future characters
              !isTyped && !isCurrent && (theme === 'dark' ? 'text-gray-400' : 'text-gray-600'),
              // Character transformations
              "transform transition-transform duration-150 hover:scale-110"
            )}
          >
            {char}
            
            {/* Error indicator */}
            {hasError && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
            
            {/* Typing trail effect */}
            {isTyped && !hasError && (
              <div className="absolute inset-0 bg-green-400/20 rounded animate-pulse" 
                   style={{ animationDuration: '0.5s', animationDelay: `${charIndex * 50}ms` }} />
            )}
          </span>
        );
      })}
    </span>
  );
};

// WPM Speedometer component
const WPMSpeedometer: React.FC<{ 
  currentWPM: number; 
  targetWPM: number; 
  theme: string;
}> = ({ currentWPM, targetWPM, theme }) => {
  const percentage = Math.min((currentWPM / targetWPM) * 100, 100);
  const needleRotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees
  
  return (
    <div className="relative w-24 h-12 mx-auto">
      {/* Speedometer arc */}
      <svg className="w-full h-full" viewBox="0 0 100 50">
        <path
          d="M 10 45 A 40 40 0 0 1 90 45"
          fill="none"
          stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
          strokeWidth="4"
        />
        <path
          d="M 10 45 A 40 40 0 0 1 90 45"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="4"
          strokeDasharray={`${percentage * 1.26} 126`}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Needle */}
      <div 
        className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-red-500 origin-bottom transition-transform duration-500"
        style={{ transform: `translate(-50%, -100%) rotate(${needleRotation}deg)` }}
      />
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-800 dark:bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* WPM display */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs font-bold ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {Math.round(currentWPM)} WPM
      </div>
    </div>
  );
};

// Accuracy meter component
const AccuracyMeter: React.FC<{ 
  accuracy: number; 
  theme: string;
}> = ({ accuracy, theme }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(accuracy / 100) * circumference} ${circumference}`;
  
  return (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
          strokeWidth="4"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={accuracy >= 95 ? '#10b981' : accuracy >= 85 ? '#f59e0b' : '#ef4444'}
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          className="transition-all duration-500"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {Math.round(accuracy)}%
      </div>
    </div>
  );
};

// Streak counter with fire effect
const StreakCounter: React.FC<{ 
  streak: number; 
  theme: string;
}> = ({ streak, theme }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (streak > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [streak]);
  
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${
      streak > 10 
        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
        : theme === 'dark' 
          ? 'bg-slate-700 text-gray-300' 
          : 'bg-gray-100 text-gray-700'
    } ${isAnimating ? 'animate-bounce' : ''}`}>
      <div className={`text-lg ${streak > 10 ? 'animate-pulse' : ''}`}>
        {streak > 10 ? '🔥' : '⚡'}
      </div>
      <span className="text-sm font-bold">{streak} streak</span>
    </div>
  );
};

const EnhancedTypingArea: React.FC<EnhancedTypingAreaProps> = ({
  targetText,
  currentText,
  currentPosition,
  errors,
  onTextChange,
  className,
  showFocusMode = false
}) => {
  const { themeMode } = useTypingStore();
  const [focusMode, setFocusMode] = useState(showFocusMode);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Calculate real-time stats
  useEffect(() => {
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // in minutes
    const wordsTyped = currentText.trim().split(' ').length;
    const currentWPM = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(currentWPM);

    const totalChars = currentPosition;
    const errorCount = errors.length;
    const currentAccuracy = totalChars > 0 ? Math.round(((totalChars - errorCount) / totalChars) * 100) : 100;
    setAccuracy(currentAccuracy);

    // Calculate streak (consecutive correct characters)
    let currentStreak = 0;
    for (let i = currentPosition - 1; i >= 0; i--) {
      if (errors.some(error => error.position === i)) break;
      if (currentText[i] === targetText[i]) currentStreak++;
      else break;
    }
    setStreak(currentStreak);
  }, [currentText, currentPosition, errors, targetText]);

  // Handle text input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const words = targetText.split(' ');
  const currentWordIndex = currentText.split(' ').length - 1;

  return (
    <div className={cn(
      "relative p-6 rounded-2xl shadow-2xl backdrop-blur-lg border-2 transition-all duration-300",
      themeMode === 'dark' 
        ? 'bg-slate-800/90 border-slate-600/50' 
        : 'bg-white/90 border-gray-200/50',
      className
    )}>
      {/* Controls header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <WPMSpeedometer currentWPM={wpm} targetWPM={60} theme={themeMode} />
          <AccuracyMeter accuracy={accuracy} theme={themeMode} />
          <StreakCounter streak={streak} theme={themeMode} />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={cn(
              "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200",
              focusMode
                ? "bg-purple-500 text-white shadow-lg"
                : themeMode === 'dark'
                  ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            Focus Mode
          </button>
        </div>
      </div>

      {/* Text display area */}
      <div className={cn(
        "relative min-h-32 p-4 rounded-lg text-lg leading-relaxed font-mono",
        themeMode === 'dark' 
          ? 'bg-slate-900/50 border border-slate-600' 
          : 'bg-gray-50/50 border border-gray-200',
        "focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300"
      )}>
        {/* Target text with enhanced highlighting */}
        <div className="relative z-10 pointer-events-none select-none">
          {words.map((word, wordIndex) => (
            <React.Fragment key={wordIndex}>
              <EnhancedWord
                word={word}
                wordIndex={wordIndex}
                currentPosition={currentPosition}
                typedText={currentText}
                errors={errors}
                theme={themeMode}
                isFocusMode={focusMode}
                isCurrentWord={wordIndex === currentWordIndex}
              />
              {wordIndex < words.length - 1 && (
                <span className={cn(
                  "mx-1",
                  currentPosition > word.length + wordIndex && "bg-green-100 dark:bg-green-900/30 rounded"
                )}>
                  {' '}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Invisible input overlay */}
        <textarea
          ref={inputRef}
          value={currentText}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none cursor-text"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Progress indicator */}
        <div className="absolute bottom-2 right-2">
          <div className={cn(
            "text-xs px-2 py-1 rounded-full",
            themeMode === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          )}>
            {currentPosition}/{targetText.length}
          </div>
        </div>
      </div>

      {/* Real-time feedback */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Speed:</span>
            <span className="font-bold text-blue-500">{wpm} WPM</span>
          </div>
          <div className={`flex items-center gap-2 ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Accuracy:</span>
            <span className={`font-bold ${accuracy >= 95 ? 'text-green-500' : accuracy >= 85 ? 'text-yellow-500' : 'text-red-500'}`}>
              {accuracy}%
            </span>
          </div>
        </div>
        
        <div className={`${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Progress: {Math.round((currentPosition / targetText.length) * 100)}%
        </div>
      </div>

      {/* Speed burst effect */}
      {wpm > 80 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 rounded-2xl animate-pulse" />
          <div className="absolute top-4 right-4 text-2xl animate-bounce">🚀</div>
        </div>
      )}

      {/* Achievement popup */}
      {streak > 0 && streak % 25 === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce">
            <div className="text-center">
              <div className="text-2xl mb-1">🎉</div>
              <div className="font-bold">Amazing streak!</div>
              <div className="text-sm">{streak} perfect characters</div>
            </div>
          </div>
        </div>
      )}

      {/* Global styles for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default EnhancedTypingArea;