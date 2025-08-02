import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Target, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { lessons, type Lesson } from '../lib/lessons';

interface LessonSelectorProps {
  onLessonSelect: (lesson: Lesson) => void;
  onBack?: () => void;
}

const LessonSelector: React.FC<LessonSelectorProps> = ({ onLessonSelect, onBack }) => {
  const { handPreference, themeMode, completedLessons = [], lessonProgress = {} } = useTypingStore();

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-500';
    if (difficulty <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
    return lesson.prerequisites.every(prereq => 
      completedLessons.includes(prereq)
    );
  };

  const getLessonProgress = (lessonId: string) => {
    // Safely access lessonProgress with null checks
    if (!lessonProgress || typeof lessonProgress !== 'object') {
      return null;
    }
    return lessonProgress[lessonId] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="w-full max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <Button 
                onClick={onBack}
                variant="outline"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Choose Your Lesson</h1>
              <p className="text-slate-300 text-lg">
                Select a lesson to practice your {handPreference} hand typing skills
              </p>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const isUnlocked = isLessonUnlocked(lesson);
            const progress = getLessonProgress(lesson.id);
            const isCompleted = completedLessons.includes(lesson.id);
            const text = lesson.text || lesson.content || '';
            const wordCount = lesson.wordCount || text.split(' ').filter((word: string) => word.length > 0).length;
            const estimatedTime = lesson.estimatedTime || Math.ceil(wordCount / 20);

            return (
              <Card 
                key={lesson.id} 
                className={`
                  cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${isUnlocked 
                    ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-purple-500' 
                    : 'bg-slate-900 border-slate-700 opacity-60'
                  }
                  ${isCompleted ? 'ring-2 ring-green-500' : ''}
                `}
                onClick={() => isUnlocked && onLessonSelect(lesson)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-2 flex items-center gap-2">
                        {lesson.title}
                        {isCompleted && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                      </CardTitle>
                      <CardDescription className="text-slate-300 text-sm">
                        {lesson.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${getDifficultyColor(lesson.difficulty)} text-white font-bold`}
                    >
                      Level {lesson.level}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Lesson Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{lesson.targetWpm} WPM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>~{estimatedTime} min</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Best: {progress.bestWpm} WPM</span>
                        <span>{progress.bestAccuracy}% accuracy</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress.bestAccuracy, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Lesson Preview */}
                  <div className="bg-slate-900 rounded p-3 mb-4">
                    <p className="text-slate-300 text-sm font-mono leading-relaxed">
                      {text.substring(0, 60)}...
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full ${
                      isUnlocked 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                    disabled={!isUnlocked}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isUnlocked) {
                        // Ensure lesson has content
                        const lessonWithContent = {
                          ...lesson,
                          text: lesson.text || lesson.content || 'No content available for this lesson.'
                        };
                        onLessonSelect(lessonWithContent);
                      }
                    }}
                  >
                    {!isUnlocked ? (
                      'Locked'
                    ) : isCompleted ? (
                      <>Retry Lesson <ArrowRight className="w-4 h-4 ml-2" /></>
                    ) : (
                      <>Start Lesson <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Practice Mode Card */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-green-800 to-emerald-800 border-green-600">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Free Practice Mode</CardTitle>
              <CardDescription className="text-green-100">
                Practice with custom text or repeat any lesson without restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onLessonSelect({
                  id: 'practice',
                  title: 'Practice Mode',
                  description: 'Free practice with custom text',
                  category: 'advanced',
                  level: 0,
                  difficulty: 1,
                  content: 'Type anything you want to practice...',
                  text: 'Type anything you want to practice...',
                  targetWpm: 25,
                  handCompatibility: ['left', 'right'],
                })}
                className="bg-white text-green-800 hover:bg-green-50 font-bold"
              >
                Start Practice Mode <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonSelector;