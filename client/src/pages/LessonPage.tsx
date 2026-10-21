import React from 'react';
import { type Lesson } from '../lib/lessons';
import { Button } from '../components/ui/button.tsx';
import TypingGameWithKeyboard from '../components/TypingGameWithKeyboard';

interface LessonPageProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function LessonPage({ lesson, onBack }: LessonPageProps) {
  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <p className="text-slate-400 mb-4">The requested lesson could not be loaded.</p>
          <Button onClick={onBack}>Return to Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TypingGameWithKeyboard 
        lesson={lesson}
        onBack={onBack}
      />
    </div>
  );
}