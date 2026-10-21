import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button.tsx';
import { Card } from './ui/card.tsx';
import { Progress } from './ui/progress.tsx';
import { ArrowLeft, Target, Clock, Zap } from 'lucide-react';
import { type Lesson } from '../lib/lessons';

interface TypingGameWithKeyboardProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete?: () => void;
}

// QWERTY keyboard layout for landscape mode
const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '] // spacebar
];

export default function TypingGameWithKeyboard({ lesson, onBack, onComplete }: TypingGameWithKeyboardProps) {
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get lesson text from content or text field
  const currentText = lesson.content || lesson.text || lesson.title || "Practice typing";
  const targetWpm = lesson.targetWpm || 10;

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    // Calculate WPM and accuracy
    if (startTime && userInput.length > 0) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      const wordsTyped = userInput.length / 5;
      const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
      setWpm(currentWpm);

      let correctChars = 0;
      let errorCount = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === currentText[i]) {
          correctChars++;
        } else {
          errorCount++;
        }
      }
      const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
      setAccuracy(currentAccuracy);
      setErrors(errorCount);
    }

    // Check if lesson is complete
    if (userInput === currentText) {
      if (onComplete) {
        setTimeout(() => onComplete(), 1000); // Small delay to show completion
      }
    }
  }, [userInput, startTime, currentText, onComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= currentText.length) {
      setUserInput(value);
      setCurrentIndex(value.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setPressedKey(e.key.toLowerCase());
    setTimeout(() => setPressedKey(null), 150);
  };

  const resetGame = () => {
    setUserInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderTextDisplay = () => {
    return currentText.split('').map((char, index) => {
      let className = 'inline-block text-2xl font-mono px-1 py-1 mx-0.5 rounded transition-all duration-200 ';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += 'bg-green-500 text-white shadow-md';
        } else {
          className += 'bg-red-500 text-white shadow-md';
        }
      } else if (index === currentIndex) {
        className += 'bg-blue-500 text-white animate-pulse shadow-lg';
      } else {
        className += 'bg-slate-700 text-slate-300';
      }
      
      return (
        <span key={index} className={className}>
          {char === ' ' ? '␣' : char}
        </span>
      );
    });
  };

  const getKeyStyle = (key: string) => {
    const baseStyle = 'relative px-3 py-2 m-0.5 rounded-lg font-medium text-sm transition-all duration-150 transform border-2 shadow-lg ';
    
    // Rainbow gradient colors (welcoming and fun)
    const colorClasses = {
      '`': 'bg-gradient-to-b from-red-400 to-red-500 border-red-600 text-white',
      '1': 'bg-gradient-to-b from-red-400 to-red-500 border-red-600 text-white',
      '2': 'bg-gradient-to-b from-orange-400 to-orange-500 border-orange-600 text-white',
      '3': 'bg-gradient-to-b from-yellow-400 to-yellow-500 border-yellow-600 text-white',
      '4': 'bg-gradient-to-b from-green-400 to-green-500 border-green-600 text-white',
      '5': 'bg-gradient-to-b from-blue-400 to-blue-500 border-blue-600 text-white',
      '6': 'bg-gradient-to-b from-indigo-400 to-indigo-500 border-indigo-600 text-white',
      '7': 'bg-gradient-to-b from-purple-400 to-purple-500 border-purple-600 text-white',
      '8': 'bg-gradient-to-b from-pink-400 to-pink-500 border-pink-600 text-white',
      '9': 'bg-gradient-to-b from-rose-400 to-rose-500 border-rose-600 text-white',
      '0': 'bg-gradient-to-b from-red-400 to-red-500 border-red-600 text-white',
      'q': 'bg-gradient-to-b from-red-300 to-red-400 border-red-500 text-white',
      'w': 'bg-gradient-to-b from-orange-300 to-orange-400 border-orange-500 text-white',
      'e': 'bg-gradient-to-b from-yellow-300 to-yellow-400 border-yellow-500 text-white',
      'r': 'bg-gradient-to-b from-green-300 to-green-400 border-green-500 text-white',
      't': 'bg-gradient-to-b from-blue-300 to-blue-400 border-blue-500 text-white',
      'y': 'bg-gradient-to-b from-indigo-300 to-indigo-400 border-indigo-500 text-white',
      'u': 'bg-gradient-to-b from-purple-300 to-purple-400 border-purple-500 text-white',
      'i': 'bg-gradient-to-b from-pink-300 to-pink-400 border-pink-500 text-white',
      'o': 'bg-gradient-to-b from-rose-300 to-rose-400 border-rose-500 text-white',
      'p': 'bg-gradient-to-b from-red-300 to-red-400 border-red-500 text-white',
      'a': 'bg-gradient-to-b from-red-200 to-red-300 border-red-400 text-gray-800',
      's': 'bg-gradient-to-b from-orange-200 to-orange-300 border-orange-400 text-gray-800',
      'd': 'bg-gradient-to-b from-yellow-200 to-yellow-300 border-yellow-400 text-gray-800',
      'f': 'bg-gradient-to-b from-green-200 to-green-300 border-green-400 text-gray-800',
      'g': 'bg-gradient-to-b from-blue-200 to-blue-300 border-blue-400 text-gray-800',
      'h': 'bg-gradient-to-b from-indigo-200 to-indigo-300 border-indigo-400 text-gray-800',
      'j': 'bg-gradient-to-b from-purple-200 to-purple-300 border-purple-400 text-gray-800',
      'k': 'bg-gradient-to-b from-pink-200 to-pink-300 border-pink-400 text-gray-800',
      'l': 'bg-gradient-to-b from-rose-200 to-rose-300 border-rose-400 text-gray-800',
      'z': 'bg-gradient-to-b from-red-100 to-red-200 border-red-300 text-gray-700',
      'x': 'bg-gradient-to-b from-orange-100 to-orange-200 border-orange-300 text-gray-700',
      'c': 'bg-gradient-to-b from-yellow-100 to-yellow-200 border-yellow-300 text-gray-700',
      'v': 'bg-gradient-to-b from-green-100 to-green-200 border-green-300 text-gray-700',
      'b': 'bg-gradient-to-b from-blue-100 to-blue-200 border-blue-300 text-gray-700',
      'n': 'bg-gradient-to-b from-indigo-100 to-indigo-200 border-indigo-300 text-gray-700',
      'm': 'bg-gradient-to-b from-purple-100 to-purple-200 border-purple-300 text-gray-700',
      ' ': 'bg-gradient-to-b from-gray-200 to-gray-300 border-gray-400 text-gray-800 px-20'
    };

    const colorClass = colorClasses[key as keyof typeof colorClasses] || 'bg-gradient-to-b from-gray-300 to-gray-400 border-gray-500 text-gray-800';
    
    // Add pressed effect
    const pressedEffect = pressedKey === key ? 'scale-95 shadow-inner' : 'hover:scale-105 shadow-lg';
    
    // Highlight next key to press
    const nextChar = currentText[currentIndex]?.toLowerCase();
    const highlightEffect = nextChar === key ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : '';
    
    return `${baseStyle} ${colorClass} ${pressedEffect} ${highlightEffect}`;
  };

  const renderKeyboard = () => {
    return (
      <div className="bg-slate-800 p-6 rounded-2xl border-2 border-slate-600 shadow-2xl">
        <div className="space-y-2">
          {KEYBOARD_LAYOUT.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center items-center gap-1">
              {row.map((key) => (
                <button
                  key={key}
                  className={getKeyStyle(key)}
                  disabled
                >
                  {key === ' ' ? 'SPACE' : key.toUpperCase()}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const progress = Math.round((userInput.length / currentText.length) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <div className="flex gap-2">
            <Button onClick={resetGame} variant="outline" size="sm">
              Reset
            </Button>
          </div>
        </div>

        {/* Text Display */}
        <Card className="p-6 bg-slate-800 border-slate-600 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-4">Text to Type</h2>
            <div className="bg-slate-900 p-6 rounded-lg border-2 border-slate-600 leading-relaxed min-h-[100px] flex flex-wrap items-center justify-center">
              {renderTextDisplay()}
            </div>
          </div>
        </Card>

        {/* Input Area */}
        <Card className="p-6 bg-slate-800 border-slate-600 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-4">Your Input</h3>
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Start typing here..."
              className="w-full h-24 p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg resize-none"
              autoFocus
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{targetWpm}</div>
              <div className="text-sm text-slate-400">Target WPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{wpm}</div>
              <div className="text-sm text-slate-400">Current WPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
              <div className="text-sm text-slate-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{progress}%</div>
              <div className="text-sm text-slate-400">Progress</div>
            </div>
          </div>

          <Progress value={progress} className="mt-4" />
        </Card>

        {/* Landscape Keyboard */}
        <div className="mb-6">
          {renderKeyboard()}
        </div>

        {/* Completion Message */}
        {userInput === currentText && (
          <Card className="p-6 bg-green-900 border-green-600 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">🎉 Lesson Complete!</div>
            <div className="text-slate-300 mb-4">
              Final Stats: {wpm} WPM • {accuracy}% Accuracy • {errors} Errors
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="outline">
                Try Again
              </Button>
              <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-slate-400">
          <p>Focus on accuracy over speed. The highlighted key shows what to type next.</p>
        </div>
      </div>
    </div>
  );
}