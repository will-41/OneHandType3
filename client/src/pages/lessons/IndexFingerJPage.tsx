import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { ArrowLeft, Target, Clock, Zap } from 'lucide-react';

interface IndexFingerJPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function IndexFingerJPage({ onBack, onComplete }: IndexFingerJPageProps) {
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);

  const lessonText = 'j j j j j';
  const targetWpm = 5;
  const estimatedTime = 1;

  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    if (startTime && userInput.length > 0) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      const wordsTyped = userInput.length / 5;
      const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
      setWpm(currentWpm);

      let correctChars = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === lessonText[i]) {
          correctChars++;
        }
      }
      const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
      setAccuracy(currentAccuracy);

      if (userInput === lessonText) {
        setIsComplete(true);
      }
    }
  }, [userInput, startTime, lessonText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= lessonText.length) {
      setUserInput(value);
      setCurrentIndex(value.length);
    }
  };

  const renderText = () => {
    return lessonText.split('').map((char, index) => {
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
          {char === ' ' ? '·' : char}
        </span>
      );
    });
  };

  const progress = Math.round((userInput.length / lessonText.length) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Index Finger - J</h1>
              <p className="text-slate-400">Train your index finger with the J key</p>
            </div>
          </div>
          
          <div className="bg-green-900 border border-green-600 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-green-100">✓ Optimized</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-lg font-bold">{targetWpm} WPM</div>
                <div className="text-sm text-slate-400">Target</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-lg font-bold">{estimatedTime} min</div>
                <div className="text-sm text-slate-400">Estimated</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-lg font-bold">1/5</div>
                <div className="text-sm text-slate-400">Difficulty</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="text-center">
              <div className="text-lg font-bold">5 words</div>
              <div className="text-sm text-slate-400">Total</div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-slate-800 border-slate-600 mb-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{wpm}</div>
              <div className="text-sm text-slate-400">WPM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
              <div className="text-sm text-slate-400">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{userInput.length}</div>
              <div className="text-sm text-slate-400">Characters</div>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-slate-800 border-slate-600 mb-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-4">Practice Text</h3>
            <div className="text-4xl font-mono mb-4 text-center">
              "j j j j j"
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border-2 border-slate-600 leading-relaxed">
              {renderText()}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-slate-800 border-slate-600">
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing the J key here..."
            className="w-full h-32 bg-slate-900 text-white border-2 border-slate-600 rounded-lg p-4 text-xl font-mono resize-none focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          
          {isComplete && (
            <div className="mt-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">🎉 Lesson Complete!</div>
              <div className="text-slate-300 mb-4">
                Excellent! You've mastered the J key. Final Stats: {wpm} WPM • {accuracy}% Accuracy
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
                <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                  Next Lesson
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-6 text-center text-slate-400">
          <p className="mb-2">Focus on the J key with your index finger.</p>
          <p>Press the J key repeatedly to build muscle memory. Accuracy is more important than speed.</p>
        </div>
      </div>
    </div>
  );
}