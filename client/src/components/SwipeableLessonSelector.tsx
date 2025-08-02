import React, { useState, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, Play, Clock, Target, Star, Zap, Plus, Book, Trophy } from 'lucide-react';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { lessons, type Lesson } from '../lib/lessons';
import LessonBuilder from './LessonBuilder';

interface SwipeableLessonSelectorProps {
  onStartLesson: (lesson: Lesson) => void;
  onBack?: () => void;
}

// Create Practice lesson object
const practiceLesson: Lesson = {
  id: 'practice-mode',
  title: 'Practice Mode',
  description: 'Free typing practice with random texts',
  content: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for practicing your typing skills.',
  difficulty: 1,
  category: 'basics',
  level: 0,
  targetWpm: 20,
  handCompatibility: ['left', 'right'],
  estimatedTime: 5,
  wordCount: 25
};

const SwipeableLessonSelector: React.FC<SwipeableLessonSelectorProps> = ({ onStartLesson, onBack }) => {
  const { handPreference, themeMode, completedLessons = [], lessonProgress = {}, addCustomLesson } = useTypingStore();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLessonBuilder, setShowLessonBuilder] = useState(false);

  // Combine practice lesson with regular lessons and custom lessons
  const { customLessons = [] } = useTypingStore();
  const allLessons = [practiceLesson, ...lessons, ...customLessons];

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty === 0) return 'bg-purple-500'; // Practice mode
    if (difficulty <= 2) return 'bg-green-500';
    if (difficulty <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty === 0) return 'Practice';
    if (difficulty <= 2) return 'Beginner';
    if (difficulty <= 3) return 'Intermediate';
    return 'Advanced';
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    if (lesson.id === 'practice-mode') return true; // Practice is always unlocked
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
    return lesson.prerequisites.every(prereq => 
      completedLessons.includes(prereq)
    );
  };

  const getLessonProgress = (lessonId: string) => {
    if (!lessonProgress || typeof lessonProgress !== 'object') {
      return null;
    }
    return lessonProgress[lessonId] || null;
  };

  const scrollToLesson = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = 320; // Width of each card + gap
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const nextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      scrollToLesson(currentIndex + 1);
    }
  };

  const prevLesson = () => {
    if (currentIndex > 0) {
      scrollToLesson(currentIndex - 1);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleContinue = () => {
    if (selectedLesson) {
      onStartLesson(selectedLesson);
    }
  };

  const handleSaveCustomLesson = (lesson: Lesson) => {
    addCustomLesson(lesson);
    setShowLessonBuilder(false);
  };

  if (showLessonBuilder) {
    return (
      <LessonBuilder
        onSave={handleSaveCustomLesson}
        onClose={() => setShowLessonBuilder(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 p-4 ${
      themeMode === 'dark' 
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-white via-gray-50 to-blue-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="outline"
              className={themeMode === 'dark' 
                ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600 border-2' 
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 border-2'
              }
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold mb-2">Choose Your Lesson</h1>
            <p className={`text-lg ${themeMode === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
              Swipe to explore lessons for your {handPreference} hand
            </p>
          </div>
          <Button
            onClick={() => setShowLessonBuilder(true)}
            variant="outline"
            className={`gap-2 ${themeMode === 'dark' 
              ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600 border-2' 
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 border-2'
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Lesson
          </Button>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevLesson}
            disabled={currentIndex === 0}
            className={themeMode === 'dark' 
              ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600 border-2 disabled:bg-slate-800 disabled:text-slate-500' 
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 border-2'
            }
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            {allLessons.map((lesson, index) => {
              const isActive = index === currentIndex;
              const isCompleted = completedLessons.includes(lesson.id);
              
              return (
                <button
                  key={index}
                  onClick={() => scrollToLesson(index)}
                  className={`relative w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110' 
                      : isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-md'
                        : themeMode === 'dark' 
                          ? 'bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600' 
                          : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400'
                  } ${isActive ? 'animate-pulse' : 'hover:scale-105'}`}
                  title={lesson.title}
                >
                  {isCompleted ? (
                    <Star className="w-6 h-6 text-white fill-current" />
                  ) : lesson.id === 'practice-mode' ? (
                    <Zap className="w-6 h-6 text-white" />
                  ) : lesson.category === 'basics' ? (
                    <Target className="w-6 h-6 text-white" />
                  ) : lesson.category === 'words' ? (
                    <div className="w-6 h-6 bg-white rounded text-blue-600 flex items-center justify-center font-bold text-xs">W</div>
                  ) : lesson.category === 'sentences' ? (
                    <div className="w-6 h-6 bg-white rounded text-purple-600 flex items-center justify-center font-bold text-xs">S</div>
                  ) : (
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  )}
                  
                  {/* Active indicator ring */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping"></div>
                  )}
                  
                  {/* Progress indicator for partially completed lessons */}
                  {!isCompleted && getLessonProgress(lesson.id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                  )}
                </button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextLesson}
            disabled={currentIndex === allLessons.length - 1}
            className={themeMode === 'dark' 
              ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600 border-2 disabled:bg-slate-800 disabled:text-slate-500' 
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 border-2'
            }
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Swipeable Lesson Cards */}
        <div className="relative overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allLessons.map((lesson, index) => {
              const isUnlocked = isLessonUnlocked(lesson);
              const progress = getLessonProgress(lesson.id);
              const isCompleted = completedLessons.includes(lesson.id);
              const isSelected = selectedLesson?.id === lesson.id;
              const text = lesson.text || lesson.content || '';
              const wordCount = lesson.wordCount || text.split(' ').length;
              const estimatedTime = lesson.estimatedTime || Math.ceil(wordCount / 20);

              return (
                <Card 
                  key={lesson.id}
                  className={`min-w-[300px] max-w-[300px] snap-center cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'ring-4 ring-blue-500 scale-105' 
                      : isUnlocked 
                        ? 'hover:scale-102 shadow-lg' 
                        : 'opacity-50'
                  } ${
                    themeMode === 'dark' 
                      ? 'bg-slate-800 border-slate-600' 
                      : 'bg-white border-gray-200'
                  }`}
                  onClick={() => isUnlocked && handleLessonClick(lesson)}
                >
                  <CardContent className="p-6">
                    {/* Special icon for Practice Mode */}
                    {lesson.id === 'practice-mode' && (
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {/* Title and Difficulty */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold mb-2 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {lesson.title}
                          </h3>
                          <p className={`text-sm ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                            {lesson.description}
                          </p>
                        </div>
                        <Badge className={`${getDifficultyColor(lesson.difficulty)} text-white ml-2`}>
                          {getDifficultyLabel(lesson.difficulty)}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className={`p-2 rounded ${themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <Clock className={`w-4 h-4 mx-auto mb-1 ${themeMode === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                          <p className={`text-xs font-medium ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{estimatedTime}m</p>
                        </div>
                        <div className={`p-2 rounded ${themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <Target className={`w-4 h-4 mx-auto mb-1 ${themeMode === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                          <p className={`text-xs font-medium ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lesson.targetWpm} WPM</p>
                        </div>
                        <div className={`p-2 rounded ${themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <Star className={`w-4 h-4 mx-auto mb-1 ${themeMode === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                          <p className={`text-xs font-medium ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{wordCount} words</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {progress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(progress.bestAccuracy || 0)}% accuracy</span>
                          </div>
                          <Progress value={progress.bestAccuracy || 0} className="h-2" />
                        </div>
                      )}

                      {/* Completion Status */}
                      {isCompleted && (
                        <div className="flex items-center justify-center gap-2 text-green-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">Completed!</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        {selectedLesson && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleContinue}
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Continue with {selectedLesson.title}
            </Button>
          </div>
        )}

        {/* Helper Text */}
        <div className="text-center mt-6">
          <p className={`text-sm ${themeMode === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
            Select a lesson above to see the Continue button
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwipeableLessonSelector;