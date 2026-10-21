import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import LessonPage from './pages/LessonPage';
import TutorialPage from './pages/TutorialPage';
import { useDataLoader } from './hooks/useDataLoader';
import { Lesson } from './lib/lessons';
import { gamifiedCurriculum } from './lib/gamifiedCurriculum';
import ErrorBoundary from './components/ErrorBoundary';
import LessonRenderer from './components/LessonRenderer';

// Create a Query Client instance for React Query
const queryClient = new QueryClient();

// Define app page types
type AppPage = 'home' | 'lesson' | 'tutorial';

export default function App() {
  // State management
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
  // Load data using custom hook
  const { lessons, loading, error } = useDataLoader();

  // Log app status on mount and when lessons/errors change
  useEffect(() => {
    console.log('🚀 OneType App mounted');
    console.log('📚 Lessons loaded:', lessons?.length || 0);
    if (error) {
      console.error('❌ Data loading error:', error);
    }
  }, [lessons, error]);

  // Navigation functions
  const navigateToLesson = (lessonId: string) => {
    console.log('🎯 Navigating to lesson:', lessonId);
    setSelectedLessonId(lessonId);
    setCurrentPage('lesson');
  };

  const navigateToHome = () => {
    console.log('🏠 Navigating to home');
    setCurrentPage('home');
    setSelectedLessonId(null);
  };

  const navigateToTutorial = () => {
    console.log('📖 Navigating to tutorial');
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

  // Error state
  if (error) {
    return (
      <ErrorBoundary componentName="ErrorScreen">
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-3xl font-bold mb-4 text-red-400">Connection Error</div>
            <div className="text-slate-400 mb-6">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Main app render with ErrorBoundary wrapping
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary 
        componentName="MainApp" 
        onError={(error, info) => {
          console.error('App Error:', error);
          console.error('Component Stack:', info.componentStack);
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
    </QueryClientProvider>
  );
}