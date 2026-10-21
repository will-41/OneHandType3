import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, RotateCcw, Play, Pause } from 'lucide-react';
import { type Lesson } from '../lib/lessons';
import { useTypingStore } from '../lib/stores/useTypingStore';

interface TypingGameProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function TypingGame({ lesson, onBack }: TypingGameProps) {
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);

  // const { updateStats } = useTypingStore();

  useEffect(() => {
    console.log('🎮 TYPING GAME MOUNTED');
    console.log('📋 Lesson details:', JSON.stringify(lesson, null, 2));
    console.log('🔍 Lesson validation:');
    console.log('  - lesson.id:', lesson.id);
    console.log('  - lesson.title:', lesson.title);
    console.log('  - lesson.text:', lesson.text);
    console.log('  - lesson.content:', lesson.content);

    // Set the text to practice
    const textToPractice = lesson.text || lesson.content || 'Practice typing text';
    setCurrentText(textToPractice);
    console.log('📝 Text set for typing practice:', textToPractice);
    console.log('✅ TypingGame ready for input');

    return () => {
      console.log('🎮 TypingGame unmounted');
    };
  }, [lesson]);

  const calculateStats = useCallback(() => {
    if (!startTime || userInput.length === 0) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = userInput.length / 5; // standard word length
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) {
        correctChars++;
      }
    }

    const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  }, [userInput, currentText, startTime]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Start timing on first character
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    // Prevent typing beyond the text length
    if (value.length <= currentText.length) {
      setUserInput(value);
      setCurrentIndex(value.length);

      // Count errors
      let errorCount = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== currentText[i]) {
          errorCount++;
        }
      }
      setErrors(errorCount);

      // Check if completed
      if (value === currentText) {
        setIsActive(false);
        console.log('🎉 Lesson completed!');

        // Update global stats - simplified for now
        console.log('📊 Stats would be updated here');
      }
    }
  };

  const resetGame = () => {
    setUserInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'text-lg font-mono ';

      if (index < userInput.length) {
        // Already typed
        if (userInput[index] === char) {
          className += 'bg-green-600 text-white'; // Correct
        } else {
          className += 'bg-red-600 text-white'; // Incorrect
        }
      } else if (index === currentIndex) {
        // Current character
        className += 'bg-blue-500 text-white animate-pulse';
      } else {
        // Not yet typed
        className += 'text-slate-400';
      }

      return (
        <span key={index} className={className}>
          {char === ' ' ? '·' : char}
        </span>
      );
    });
  };

  if (!currentText) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading lesson...</h1>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <p className="text-slate-400">One-handed typing practice</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={togglePause} variant="outline" size="sm">
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={resetGame} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{wpm}</div>
              <div className="text-sm text-slate-400">WPM</div>
            </div>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
              <div className="text-sm text-slate-400">Accuracy</div>
            </div>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{errors}</div>
              <div className="text-sm text-slate-400">Errors</div>
            </div>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{Math.round((currentIndex / currentText.length) * 100)}%</div>
              <div className="text-sm text-slate-400">Progress</div>
            </div>
          </Card>
        </div>

        {/* Text Display */}
        <Card className="p-8 bg-slate-800 border-slate-600 mb-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-4">Type the following text:</h3>
            <div className="bg-slate-900 p-6 rounded-lg border-2 border-slate-600 leading-relaxed">
              {renderText()}
            </div>
          </div>
        </Card>

        {/* Input Area */}
        <Card className="p-6 bg-slate-800 border-slate-600">
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="w-full h-32 bg-slate-900 text-white border-2 border-slate-600 rounded-lg p-4 text-lg font-mono resize-none focus:border-blue-500 focus:outline-none"
            disabled={!isActive && userInput.length === 0}
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
