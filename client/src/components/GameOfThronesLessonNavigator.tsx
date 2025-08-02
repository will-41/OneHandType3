import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Crown, Sword, Shield, Star, Lock } from 'lucide-react';
import { type Lesson, lessons } from '../lib/lessons';

interface GameOfThronesLessonNavigatorProps {
  onStartLesson: (lesson: Lesson) => void;
}

// House assignments for database lessons (Game of Thrones theming)
const LESSON_HOUSE_MAPPING: Record<string, string> = {
  'basics-1': 'Stark',
  'basics-2': 'Stark', 
  'basics-3': 'Stark',
  'basics-4': 'Stark',
  'basics-5': 'Stark',
  'basics-6': 'Stark',
  'words-1': 'Lannister',
  'words-2': 'Lannister',
  'words-3': 'Lannister',
  'sentences-1': 'Targaryen',
  'sentences-2': 'Targaryen'
};

const CHARACTER_MAPPING: Record<string, string> = {
  'basics-1': 'Jon Snow',
  'basics-2': 'Arya Stark',
  'basics-3': 'Sansa Stark',
  'basics-4': 'Bran Stark',
  'basics-5': 'Rickon Stark',
  'basics-6': 'Ned Stark',
  'words-1': 'Tyrion Lannister',
  'words-2': 'Jaime Lannister', 
  'words-3': 'Cersei Lannister',
  'sentences-1': 'Daenerys Targaryen',
  'sentences-2': 'Jon Snow'
};

const HOUSE_COLORS = {
  Stark: 'bg-slate-800 border-slate-600',
  Lannister: 'bg-yellow-800 border-yellow-600',
  Targaryen: 'bg-red-800 border-red-600',
  Baratheon: 'bg-blue-800 border-blue-600'
};

const HOUSE_ICONS = {
  Stark: Shield,
  Lannister: Crown,
  Targaryen: Sword,
  Baratheon: Star
};

export default function GameOfThronesLessonNavigator({ onStartLesson }: GameOfThronesLessonNavigatorProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [currentLessons, setCurrentLessons] = useState(lessons);

  // Listen for lessons loaded event and update local state
  useEffect(() => {
    const handleLessonsLoaded = (event: CustomEvent) => {
      console.log('🔄 Lessons loaded event received');
      setCurrentLessons([...lessons]); // Force re-render with fresh lessons
    };

    window.addEventListener('lessonsLoaded', handleLessonsLoaded as EventListener);

    return () => {
      window.removeEventListener('lessonsLoaded', handleLessonsLoaded as EventListener);
    };
  }, []);  // This effect only needs to run once on mount

  console.log('🏰 GameOfThronesLessonNavigator rendered');
  console.log('📞 onStartLesson prop:', typeof onStartLesson, !!onStartLesson);
  console.log('📚 Available lessons count:', currentLessons.length);
  console.log('📋 First few lessons:', currentLessons.slice(0, 3).map(l => ({ id: l.id, title: l.title })));
  console.log('🔍 All lesson IDs:', currentLessons.map(l => l.id));

  const handleLessonClick = (lesson: any) => {
    console.log('🎯 GoT LESSON CLICK HANDLER START');
    console.log('📋 Clicked lesson data:', lesson);
    console.log('🔧 onStartLesson function available:', typeof onStartLesson, !!onStartLesson);

    if (!onStartLesson) {
      console.error('❌ onStartLesson function not available');
      alert('Navigation error. Please refresh the page.');
      return;
    }

    console.log('✅ Setting selected lesson:', lesson.id);
    setSelectedLesson(lesson.id);

    // Ensure lesson has proper content
    const formattedLesson: Lesson = {
      ...lesson,
      content: lesson.content || lesson.text || 'Practice typing with this Game of Thrones lesson.',
      text: lesson.content || lesson.text || 'Practice typing with this Game of Thrones lesson.'
    };

    console.log('📤 CALLING onStartLesson with formatted lesson:', formattedLesson);

    try {
      onStartLesson(formattedLesson);
      console.log('✅ onStartLesson called successfully');
    } catch (error) {
      console.error('🚨 Error calling onStartLesson:', error);
      alert('Error starting lesson: ' + error);
    }

    console.log('🎯 GoT LESSON CLICK HANDLER END');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Training</h2>
        <p className="text-slate-300">Begin your journey in the realm of one-handed typing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentLessons.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-slate-400">Loading lessons from database...</p>
          </div>
        ) : (
          currentLessons.slice(0, 6).map((lesson) => {
            const house = LESSON_HOUSE_MAPPING[lesson.id] || 'Stark';
            const character = CHARACTER_MAPPING[lesson.id] || 'Unknown Hero';
            const HouseIcon = HOUSE_ICONS[house as keyof typeof HOUSE_ICONS];
            const isSelected = selectedLesson === lesson.id;
            const unlocked = !lesson.prerequisites || lesson.prerequisites.length === 0 || lesson.id === 'basics-1';

            return (
              <Card 
                key={lesson.id}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  HOUSE_COLORS[house as keyof typeof HOUSE_COLORS]
                } ${
                  isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
                } ${
                  !unlocked ? 'opacity-60' : ''
                }`}
                onClick={() => unlocked && handleLessonClick(lesson)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HouseIcon className="h-5 w-5 text-slate-300" />
                    <Badge variant="secondary" className="text-xs">
                      Level {lesson.level}
                    </Badge>
                  </div>
                  {!unlocked && <Lock className="h-4 w-4 text-slate-400" />}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white">{lesson.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{lesson.description}</p>
                <p className="text-xs text-slate-400 mb-4">Character: {character}</p>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-400">
                    Target: {lesson.targetWpm} WPM
                  </div>
                  <Button 
                    size="sm"
                    disabled={!unlocked}
                    className={`${
                      unlocked 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      console.log('🔘 BUTTON CLICKED:', lesson.id);
                      e.preventDefault();
                      e.stopPropagation();
                      handleLessonClick(lesson);
                    }}
                  >
                    {unlocked ? 'Start Training' : 'Locked'}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-black bg-opacity-30 rounded-lg text-xs text-slate-400">
        <p>Debug: {lessons.length} lessons loaded from database</p>
        <p>Selected: {selectedLesson || 'none'}</p>
        <p>Navigator ready: ✅</p>
      </div>
    </div>
  );
}