import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LessonPage from './pages/LessonPage';
import TutorialPage from './pages/TutorialPage';
import { useDataLoader } from './hooks/useDataLoader';
import { Lesson } from './lib/lessons';
import { gamifiedCurriculum } from './lib/gamifiedCurriculum';
import ErrorBoundary from './components/ErrorBoundary';
import LessonRenderer from './components/LessonRenderer';

// Define app page types
type AppPage = 'home' | 'lesson' | 'tutorial';

export default function App() {
  // State management
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
  // Load data using custom hook
  const { lessons, loading, error } = useDataLoader();

  // Navigation functions
  const navigateToLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentPage('lesson');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedLessonId(null);
  };

  const navigateToTutorial = () => {
    setCurrentPage('tutorial');
  };

  // Loading state
  if (loading) {
    return (
      <ErrorBoundary componentName="LoadingScreen">
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4">OneType</div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-slate-400">Loading lessons...</div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Main app render with ErrorBoundary wrapping
  return (
      <ErrorBoundary 
        componentName="MainApp" 
        onError={(error, info) => {
        }}
      >
        <div className="min-h-screen bg-slate-900">
          {currentPage === 'home' && (
            <ErrorBoundary componentName="HomePage">
              <HomePage 
                onNavigateToLesson={navigateToLesson}
                onNavigateToTutorial={navigateToTutorial}
                lessons={lessons || []}
              />
            </ErrorBoundary>
          )}
          
          {currentPage === 'lesson' && selectedLessonId && (
            <ErrorBoundary componentName="LessonPage">
              <LessonRenderer 
                selectedLessonId={selectedLessonId} 
                lessons={lessons} 
                gamifiedCurriculum={gamifiedCurriculum} 
                onBack={navigateToHome} 
              />
            </ErrorBoundary>
          )}
          
          {currentPage === 'tutorial' && (
            <ErrorBoundary componentName="TutorialPage">
              <TutorialPage onComplete={navigateToHome} />
            </ErrorBoundary>
          )}
        </div>
      </ErrorBoundary>
  );
}