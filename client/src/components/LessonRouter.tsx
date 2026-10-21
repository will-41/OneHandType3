import React from 'react';
import { type Lesson } from '../lib/lessons';
import IndexFingerFPage from '../pages/lessons/IndexFingerFPage';
import IndexFingerJPage from '../pages/lessons/IndexFingerJPage';
import IndexFingerComboPage from '../pages/lessons/IndexFingerComboPage';
import MiddleFingerDPage from '../pages/lessons/MiddleFingerDPage';
import MiddleFingerKPage from '../pages/lessons/MiddleFingerKPage';
import TwoKeyComboPage from '../pages/lessons/TwoKeyComboPage';
import TypingGame from './TypingGame'; // Fallback for other lessons

interface LessonRouterProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete?: () => void;
}

export default function LessonRouter({ lesson, onBack, onComplete }: LessonRouterProps) {
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      onBack(); // Default: go back to menu
    }
  };

  // Route to specific lesson pages based on lesson ID
  switch (lesson.id) {
    case 'basics-1':
      return <IndexFingerFPage onBack={onBack} onComplete={handleComplete} />;
    
    case 'basics-2':
      return <IndexFingerJPage onBack={onBack} onComplete={handleComplete} />;
    
    case 'basics-3':
      return <IndexFingerComboPage onBack={onBack} onComplete={handleComplete} />;
    
    case 'basics-4':
      return <MiddleFingerDPage onBack={onBack} onComplete={handleComplete} />;
    
    case 'basics-5':
      return <MiddleFingerKPage onBack={onBack} onComplete={handleComplete} />;
    
    case 'basics-6':
      return <TwoKeyComboPage onBack={onBack} onComplete={handleComplete} />;
    
    // For all other lessons (words, sentences, etc.), use the generic TypingGame
    default:
      return <TypingGame lesson={lesson} onBack={onBack} />;
  }
}