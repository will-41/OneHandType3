import React from 'react';
import { Lesson as LessonType } from '../lib/lessons';
import LessonPage from '../pages/LessonPage';
import { CurriculumLevel } from '../lib/gamifiedCurriculum';

interface LessonRendererProps {
  selectedLessonId: string;
  lessons: any[] | undefined | null; // Using any[] to avoid type conflicts
  gamifiedCurriculum: CurriculumLevel[] | undefined;
  onBack: () => void;
}

/**
 * LessonRenderer component - Handles finding and properly formatting lessons for display
 * This component abstracts the lesson finding logic to avoid TypeScript issues in App.tsx
 */
const LessonRenderer: React.FC<LessonRendererProps> = ({ 
  selectedLessonId, 
  lessons, 
  gamifiedCurriculum,
  onBack 
}) => {
  // Create a properly typed lesson object
  const createStandardizedLesson = (source: any, levelNum: number = 1): LessonType => {
    return {
      id: source?.id || `default-lesson-${Date.now()}`,
      title: source?.title || 'Typing Lesson',
      description: source?.description || 'Practice your typing skills',
      content: source?.content || source?.practiceText?.join('\\n') || 'Default lesson content',
      text: source?.content || source?.practiceText?.join('\\n') || 'Default lesson content',
      category: (source?.category || 'curriculum') as "basics" | "words" | "sentences" | "advanced" | "curriculum",
      level: levelNum,
      difficulty: source?.difficulty || 3,
      targetWpm: source?.targetWpm || 30,
      timeLimit: source?.timeLimit || 60,
      handCompatibility: ['left', 'right'] as ("left" | "right")[],
      focusKeys: source?.keyFocus || [],
      prerequisites: source?.prerequisites || [],
      wordCount: source?.content?.split(/\\s+/)?.length || 30,
      estimatedMinutes: source?.estimatedTime || 5,
      estimatedTime: source?.estimatedTime || 5
    };
  };

  // Find the appropriate lesson
  const findLesson = (): LessonType => {
    // First check standard lessons
    const standardLesson = lessons?.find(l => l.id === selectedLessonId);
    if (standardLesson) {
      console.log('📚 Found standard lesson:', selectedLessonId);
      return standardLesson;
    }

    // Then check Game of Thrones curriculum
    if (gamifiedCurriculum && gamifiedCurriculum.length > 0) {
      for (const level of gamifiedCurriculum) {
        if (level && level.lessons) {
          const curriculumLesson = level.lessons.find((l: any) => l && l.id === selectedLessonId);
          if (curriculumLesson) {
            console.log('👑 Found Game of Thrones lesson:', selectedLessonId);
            
            // Extract level number from level ID (e.g., "level-3-reach" -> 3)
            let levelNumber = 1;
            try {
              const idParts = level.id.split('-');
              if (idParts.length >= 2 && !isNaN(parseInt(idParts[1], 10))) {
                levelNumber = parseInt(idParts[1], 10);
              }
            } catch (e) {
              console.error('Error parsing level number:', e);
            }
            
            // Convert curriculum lesson to standard lesson
            return createStandardizedLesson(curriculumLesson, levelNumber);
          }
        }
      }
    }
    
    console.error('⚠️ Lesson not found:', selectedLessonId);
    // Fallback to a default lesson
    return createStandardizedLesson({
      id: 'default-lesson',
      title: 'Default Lesson',
      description: 'This is a fallback lesson',
      category: 'basics',
      difficulty: 1,
      content: 'Please select a valid lesson.',
      targetWpm: 20,
    }, 1);
  };

  // Get the current lesson with proper typing
  const currentLesson = findLesson();

  // Render the LessonPage with the current lesson
  return <LessonPage lesson={currentLesson} onBack={onBack} />;
};

export default LessonRenderer;
