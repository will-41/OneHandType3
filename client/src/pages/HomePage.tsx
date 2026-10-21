import React, { useEffect } from 'react';
import { Button } from "../components/ui/button.tsx";
import { Card } from '../components/ui/card.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { Play, BookOpen, Target, Clock, Zap, Crown, RefreshCw } from 'lucide-react';
import { gamifiedCurriculum } from '../lib/gamifiedCurriculum';
import type { Lesson } from '../lib/lessons';

interface HomePageProps {
  onNavigateToLesson: (lessonId: string) => void;
  onNavigateToTutorial: () => void;
  lessons: Lesson[];
}

export default function HomePage({ onNavigateToLesson, onNavigateToTutorial, lessons }: HomePageProps) {
  const handleStartLesson = (lessonId: string) => {

    if (!lessonId) {
      return;
    }

    // Find the lesson to ensure it exists
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) {
      alert('Lesson not found. Please refresh the page and try again.');
      return;
    }
    onNavigateToLesson(lessonId);
  };

  const basicLessons = lessons.filter(lesson => lesson.category === 'basics').slice(0, 6);
  const wordLessons = lessons.filter(lesson => lesson.category === 'words').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            OneType
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Master one-handed typing with personalized lessons
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onNavigateToTutorial}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start Tutorial
            </Button>
            <Button 
              onClick={() => basicLessons.length > 0 && handleStartLesson(basicLessons[0].id)}
              size="lg" 
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              disabled={basicLessons.length === 0}
            >
              <Play className="h-5 w-5 mr-2" />
              Quick Start
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {lessons.length === 0 && (
          <div className="mb-8">
            <Card className="p-6 bg-yellow-900/20 border-yellow-600">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-yellow-300">Loading Lessons</h3>
                  <p className="text-yellow-200 text-sm">
                    Connecting to server to load lesson content...
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  Refresh
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Lesson Categories */}
        <div className="space-y-12">
          {/* Basics Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-green-400" />
              <h2 className="text-2xl font-bold">Basics</h2>
              <Badge variant="secondary">Start here</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {basicLessons.length > 0 ? (
                basicLessons.map((lesson) => (
                  <Card key={lesson.id} className="p-6 bg-slate-800 border-slate-600 hover:border-green-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                        <p className="text-slate-400 text-sm">{lesson.description}</p>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {lesson.difficulty}/5
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {lesson.targetWpm} WPM
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lesson.estimatedMinutes} min
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleStartLesson(lesson.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Lesson
                    </Button>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card className="p-8 bg-slate-800 border-slate-600 text-center">
                    <div className="text-slate-400 mb-4">
                      No basic lessons loaded yet
                    </div>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Lessons
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </section>

          {/* Words Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Words</h2>
              <Badge variant="secondary">Build vocabulary</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wordLessons.length > 0 ? (
                wordLessons.map((lesson) => (
                  <Card key={lesson.id} className="p-6 bg-slate-800 border-slate-600 hover:border-yellow-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                        <p className="text-slate-400 text-sm">{lesson.description}</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        {lesson.difficulty}/5
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {lesson.targetWpm} WPM
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lesson.estimatedMinutes} min
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleStartLesson(lesson.id)}
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Lesson
                    </Button>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card className="p-8 bg-slate-800 border-slate-600 text-center">
                    <div className="text-slate-400 mb-4">
                      Word lessons will appear here once loaded
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </section>

          {/* Realm of Keys Academy */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold">Realm of Keys Academy</h2>
            </div>

            <div>
              <Card className="p-8 bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Journey Through the Realms</h3>
                  <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                    Master typing on an original fantasy journey. 
                    Build your skills as you travel through ten realms, from the warm Hearthlands to the Crown of Keys.
                  </p>
                  <Button 
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      // Use imported gamifiedCurriculum to get the first lesson
                      if (gamifiedCurriculum && gamifiedCurriculum.length > 0 && 
                          gamifiedCurriculum[0].lessons && gamifiedCurriculum[0].lessons.length > 0) {
                        const firstLesson = gamifiedCurriculum[0].lessons[0];
                        onNavigateToLesson(firstLesson.id);
                      } else {
                        alert('Realm of Keys curriculum could not be loaded. Please try again later.');
                      }
                    }}
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Begin Your Journey
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}