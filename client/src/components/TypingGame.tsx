import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, Target, Clock, Zap } from 'lucide-react';
import { type Lesson } from '../lib/lessons';

interface TypingGameProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function TypingGame({ lesson, onBack }: TypingGameProps) {
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);

  // Get the lesson text from content or text field
  const currentText = lesson.content || lesson.text || lesson.title || "Practice typing";
  const targetWpm = lesson.targetWpm || 10;

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
  }, [userInput, startTime, currentText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= currentText.length) {
      setUserInput(value);
      setCurrentIndex(value.length);
    }
  };

  const resetGame = () => {
    setUserInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'text-2xl font-mono p-1 mx-1 rounded ';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += 'bg-green-500 text-white';
        } else {
          className += 'bg-red-500 text-white';
        }
      } else if (index === currentIndex) {
        className += 'bg-blue-500 text-white animate-pulse';
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

  const progress = Math.round((userInput.length / currentText.length) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
        </div>

        {/* Progress */}
        <Card className="p-6 bg-slate-800 border-slate-600 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Progress</h2>
            <span className="text-sm text-slate-400">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="mb-4" />
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card className="p-4 bg-slate-800 border-slate-600 text-center">
            <Target className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{targetWpm}</div>
            <div className="text-sm text-slate-400">Target WPM</div>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-600 text-center">
            <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{wpm}</div>
            <div className="text-sm text-slate-400">Current WPM</div>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-600 text-center">
            <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
            <div className="text-sm text-slate-400">Accuracy</div>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-600 text-center">
            <div className="text-2xl font-bold text-red-400">{errors}</div>
            <div className="text-sm text-slate-400">Errors</div>
          </Card>
        </div>

        {/* Text Display */}
        <Card className="p-8 bg-slate-800 border-slate-600 mb-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-4">Practice Text</h3>
            <div className="bg-slate-900 p-6 rounded-lg border-2 border-slate-600 leading-relaxed">
              {renderText()}
            </div>
          </div>

          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="w-full h-32 p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg"
            autoFocus
          />

          {userInput === currentText && (
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">🎉 Lesson Complete!</div>
              <div className="text-slate-300 mb-4">
                Final Stats: {wpm} WPM • {accuracy}% Accuracy • {errors} Errors
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} variant="outline">
                  Try Again
                </Button>
                <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
                  Next Lesson
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Use your index finger to type the characters. Focus on accuracy over speed.</p>
        </div>
      </div>
    </div>
  );
}