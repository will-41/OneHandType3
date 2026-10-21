import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Flame, Waves, Leaf, Zap, Lock } from 'lucide-react';
import { type Lesson, lessons } from '../lib/lessons';

interface RealmLessonNavigatorProps {
  onStartLesson: (lesson: Lesson) => void;
}

// Guild assignments for database lessons (Realm of Keys theming)
const LESSON_GUILD_MAPPING: Record<string, string> = {
  'basics-1': 'Emberkeepers',
  'basics-2': 'Emberkeepers',
  'basics-3': 'Emberkeepers',
  'basics-4': 'Emberkeepers',
  'basics-5': 'Emberkeepers',
  'basics-6': 'Emberkeepers',
  'words-1': 'Tidewrights',
  'words-2': 'Tidewrights',
  'words-3': 'Tidewrights',
  'sentences-1': 'Orchard Wardens',
  'sentences-2': 'Orchard Wardens'
};

const CHARACTER_MAPPING: Record<string, string> = {
  'basics-1': 'Mira Lanternwick',
  'basics-2': 'Tobin Reedwhistle',
  'basics-3': 'Wren Highcrest',
  'basics-4': 'Pip Fernsby',
  'basics-5': 'Dash Galewind',
  'basics-6': 'Aldric Highcrest',
  'words-1': 'Corin Marshwater',
  'words-2': 'Edda Millbrook',
  'words-3': 'Orla Fenwick',
  'sentences-1': 'Rosalind Thornfield',
  'sentences-2': 'Granny Willowby'
};

const GUILD_COLORS = {
  Emberkeepers: 'bg-orange-900 border-orange-600',
  Tidewrights: 'bg-sky-900 border-sky-600',
  'Orchard Wardens': 'bg-emerald-900 border-emerald-600',
  Stormwardens: 'bg-indigo-900 border-indigo-600'
};

const GUILD_ICONS = {
  Emberkeepers: Flame,
  Tidewrights: Waves,
  'Orchard Wardens': Leaf,
  Stormwardens: Zap
};

export default function RealmLessonNavigator({ onStartLesson }: RealmLessonNavigatorProps) {
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

  console.log('🏰 RealmLessonNavigator rendered');
  console.log('📞 onStartLesson prop:', typeof onStartLesson, !!onStartLesson);
  console.log('📚 Available lessons count:', currentLessons.length);
  console.log('📋 First few lessons:', currentLessons.slice(0, 3).map(l => ({ id: l.id, title: l.title })));
  console.log('🔍 All lesson IDs:', currentLessons.map(l => l.id));

  const handleLessonClick = (lesson: any) => {
    console.log('🎯 LESSON CLICK HANDLER START');
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
      content: lesson.content || lesson.text || 'Practice typing with this lesson.',
      text: lesson.content || lesson.text || 'Practice typing with this lesson.'
    };

    console.log('📤 CALLING onStartLesson with formatted lesson:', formattedLesson);

    try {
      onStartLesson(formattedLesson);
      console.log('✅ onStartLesson called successfully');
    } catch (error) {
      console.error('🚨 Error calling onStartLesson:', error);
      alert('Error starting lesson: ' + error);
    }

    console.log('🎯 LESSON CLICK HANDLER END');
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
            const guild = LESSON_GUILD_MAPPING[lesson.id] || 'Emberkeepers';
            const character = CHARACTER_MAPPING[lesson.id] || 'Unknown Hero';
            const GuildIcon = GUILD_ICONS[guild as keyof typeof GUILD_ICONS];
            const isSelected = selectedLesson === lesson.id;
            const unlocked = !lesson.prerequisites || lesson.prerequisites.length === 0 || lesson.id === 'basics-1';

            return (
              <Card 
                key={lesson.id}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  GUILD_COLORS[guild as keyof typeof GUILD_COLORS]
                } ${
                  isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
                } ${
                  !unlocked ? 'opacity-60' : ''
                }`}
                onClick={() => unlocked && handleLessonClick(lesson)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GuildIcon className="h-5 w-5 text-slate-300" aria-hidden="true" />
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