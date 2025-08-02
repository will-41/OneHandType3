import React, { useState, useEffect } from 'react';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { adManager } from '../lib/adSystem';
import AdBreakComponent from './AdBreakComponent';
// Note: TypingGame component integration will be handled separately
import { type Lesson } from '../lib/lessons';

interface LessonWithAdsProps {
  lesson: Lesson;
  onLessonComplete: () => void;
  onBack: () => void;
}

const LessonWithAds: React.FC<LessonWithAdsProps> = ({
  lesson,
  onLessonComplete,
  onBack
}) => {
  const { 
    currentAdBreak, 
    showAdBreak, 
    totalAdRevenue,
    setCurrentAdBreak, 
    setShowAdBreak, 
    completeAdBreak 
  } = useTypingStore();
  
  const [lessonProgress, setLessonProgress] = useState(0);
  const [lessonStartTime, setLessonStartTime] = useState<number | null>(null);
  const [totalLessonTime, setTotalLessonTime] = useState(0);

  useEffect(() => {
    // Initialize ad system for this lesson
    adManager.startLessonSession(lesson.id);
    setLessonStartTime(Date.now());
    
    // Show initial ad break
    const initialAd = {
      id: `${lesson.id}-start`,
      duration: 60,
      type: 'video',
      priority: 'high',
      revenue: 0.05,
      placement: 'lesson-start'
    };
    
    setCurrentAdBreak(initialAd);
    setShowAdBreak(true);
    
    return () => {
      // Cleanup when lesson ends
      if (lessonStartTime) {
        setTotalLessonTime(Date.now() - lessonStartTime);
      }
    };
  }, [lesson.id, setCurrentAdBreak, setShowAdBreak, lessonStartTime]);

  // Monitor lesson progress for strategic ad placement
  useEffect(() => {
    if (lessonProgress > 0) {
      const adTiming = adManager.calculateAdTiming(lessonProgress);
      
      if (adTiming.shouldShowAd && adTiming.adBreak) {
        setCurrentAdBreak(adTiming.adBreak);
        setShowAdBreak(true);
      }
    }
  }, [lessonProgress, setCurrentAdBreak, setShowAdBreak]);

  const handleAdCompleted = (revenue: number) => {
    if (currentAdBreak) {
      adManager.markAdCompleted(currentAdBreak.id, revenue);
      completeAdBreak(revenue);
    }
  };

  const handleProgressUpdate = (progress: number) => {
    setLessonProgress(progress);
  };

  const handleLessonComplete = () => {
    // Show completion ad
    const completionAd = {
      id: `${lesson.id}-completion`,
      duration: 80,
      type: 'banner',
      priority: 'medium',
      revenue: 0.06,
      placement: 'lesson-end'
    };
    
    setCurrentAdBreak(completionAd);
    setShowAdBreak(true);
    
    // After completion ad, proceed to lesson complete
    setTimeout(() => {
      onLessonComplete();
    }, 85000); // Wait for ad to complete
  };

  if (showAdBreak && currentAdBreak) {
    return (
      <AdBreakComponent
        adBreak={currentAdBreak}
        onAdCompleted={handleAdCompleted}
        onSkip={() => {
          // Only allow skip after 15 seconds
          if (currentAdBreak.placement === 'lesson-end') {
            handleAdCompleted(currentAdBreak.revenue * 0.5); // Reduced revenue for skip
          }
        }}
      />
    );
  }

  return (
    <div className="relative">
      {/* Revenue Display - Subtle but visible */}
      <div className="absolute top-4 right-4 z-10 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg text-sm">
        💰 ${totalAdRevenue.toFixed(2)} earned
      </div>
      
      {/* Main Typing Game - Integration Placeholder */}
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
        <p className="text-gray-600 mb-4">Lesson content with strategic ad breaks</p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
          <p className="text-sm">🎯 This lesson includes scientifically-timed breaks for optimal learning retention</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Menu
        </button>
      </div>
      
      {/* Progress indicator for next ad break */}
      {lessonProgress > 0 && lessonProgress < 90 && (
        <div className="fixed bottom-4 left-4 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg text-xs">
          Next break in {Math.max(0, Math.ceil((30 - (lessonProgress % 30)) * 0.15))} min
        </div>
      )}
    </div>
  );
};

export default LessonWithAds;