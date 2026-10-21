export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "speed" | "accuracy" | "consistency" | "milestone" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  icon?: string;
  points?: number;
  unlockedAt?: Date;
}

export const achievements: Achievement[] = [
  // SPEED ACHIEVEMENTS
  {
    id: "speed-10",
    title: "Getting Started",
    description: "Reach 10 WPM for the first time",
    category: "speed",
    rarity: "common",
    points: 50,
  },
  {
    id: "speed-20",
    title: "Building Momentum", 
    description: "Achieve 20 WPM typing speed",
    category: "speed",
    rarity: "common",
    points: 100,
  },
  {
    id: "speed-30",
    title: "Steady Typer",
    description: "Reach 30 WPM consistently",
    category: "speed", 
    rarity: "rare",
    points: 200,
  },
  {
    id: "speed-40",
    title: "Speed Demon",
    description: "Achieve impressive 40 WPM",
    category: "speed",
    rarity: "epic",
    points: 400,
  },
  {
    id: "speed-50",
    title: "Lightning Fingers",
    description: "Reach elite 50 WPM speed",
    category: "speed",
    rarity: "legendary",
    points: 800,
  },
  {
    id: "speed-60",
    title: "Typing Virtuoso",
    description: "Master level 60 WPM achievement",
    category: "speed",
    rarity: "legendary", 
    points: 1500,
  },

  // ACCURACY ACHIEVEMENTS
  {
    id: "accuracy-80",
    title: "Careful Typer",
    description: "Maintain 80% accuracy or higher",
    category: "accuracy",
    rarity: "common",
    points: 75,
  },
  {
    id: "accuracy-90",
    title: "Precision Master",
    description: "Achieve 90% accuracy in a lesson",
    category: "accuracy",
    rarity: "rare",
    points: 150,
  },
  {
    id: "accuracy-95",
    title: "Near Perfect",
    description: "Reach 95% accuracy or higher",
    category: "accuracy",
    rarity: "epic",
    points: 300,
  },
  {
    id: "accuracy-98",
    title: "Perfectionist",
    description: "Achieve 98% accuracy in a lesson", 
    category: "accuracy",
    rarity: "epic",
    points: 500,
  },
  {
    id: "accuracy-100",
    title: "Flawless Victory",
    description: "Complete a lesson with 100% accuracy",
    category: "accuracy",
    rarity: "legendary",
    points: 1000,
  },

  // CONSISTENCY ACHIEVEMENTS
  {
    id: "daily-3",
    title: "Building Habits",
    description: "Practice for 3 consecutive days",
    category: "consistency",
    rarity: "common",
    points: 100,
  },
  {
    id: "daily-7",
    title: "Week Warrior",
    description: "Practice for 7 consecutive days",
    category: "consistency", 
    rarity: "rare",
    points: 250,
  },
  {
    id: "daily-14",
    title: "Dedicated Learner",
    description: "Practice for 14 consecutive days",
    category: "consistency",
    rarity: "epic",
    points: 500,
  },
  {
    id: "daily-30",
    title: "Monthly Master",
    description: "Practice for 30 consecutive days",
    category: "consistency",
    rarity: "legendary",
    points: 1200,
  },
  {
    id: "lessons-10",
    title: "Lesson Explorer",
    description: "Complete 10 different lessons",
    category: "consistency",
    rarity: "common",
    points: 150,
  },
  {
    id: "lessons-25",
    title: "Course Navigator",
    description: "Complete 25 different lessons",
    category: "consistency",
    rarity: "rare",
    points: 350,
  },
  {
    id: "lessons-50",
    title: "Curriculum Conqueror",
    description: "Complete 50 different lessons",
    category: "consistency",
    rarity: "epic",
    points: 750,
  },

  // MILESTONE ACHIEVEMENTS
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your very first lesson",
    category: "milestone",
    rarity: "common",
    points: 25,
  },
  {
    id: "basics-complete",
    title: "Foundation Builder",
    description: "Complete all Basic category lessons",
    category: "milestone",
    rarity: "rare",
    points: 400,
  },
  {
    id: "words-complete",
    title: "Vocabulary Master",
    description: "Complete all Words category lessons",
    category: "milestone",
    rarity: "epic",
    points: 600,
  },
  {
    id: "sentences-complete",
    title: "Sentence Specialist",
    description: "Complete all Sentences category lessons",
    category: "milestone",
    rarity: "epic",
    points: 800,
  },
  {
    id: "advanced-complete",
    title: "Advanced Scholar",
    description: "Complete all Advanced category lessons",
    category: "milestone",
    rarity: "legendary",
    points: 1000,
  },
  {
    id: "all-lessons-complete",
    title: "Curriculum Champion",
    description: "Complete every lesson in OneType",
    category: "milestone",
    rarity: "legendary",
    points: 2000,
  },
  {
    id: "hours-5",
    title: "Dedicated Student",
    description: "Practice for a total of 5 hours",
    category: "milestone",
    rarity: "common", 
    points: 200,
  },
  {
    id: "hours-25",
    title: "Committed Learner",
    description: "Practice for a total of 25 hours",
    category: "milestone",
    rarity: "rare",
    points: 500,
  },
  {
    id: "hours-50",
    title: "Training Devotee",
    description: "Practice for a total of 50 hours",
    category: "milestone",
    rarity: "epic",
    points: 1000,
  },
  {
    id: "hours-100",
    title: "Typing Enthusiast",
    description: "Practice for a total of 100 hours",
    category: "milestone",
    rarity: "legendary",
    points: 2000,
  },

  // SPECIAL ACHIEVEMENTS
  {
    id: "one-handed-warrior",
    title: "One-Handed Warrior",
    description: "Master one-handed typing techniques",
    category: "special",
    rarity: "epic",
    points: 500,
  },
  {
    id: "accessibility-advocate",
    title: "Accessibility Advocate", 
    description: "Use accessibility features for 10 lessons",
    category: "special",
    rarity: "rare",
    points: 300,
  },
  {
    id: "speed-accuracy-balance",
    title: "Balanced Typist",
    description: "Achieve 30+ WPM and 90+ accuracy in same lesson",
    category: "special",
    rarity: "epic",
    points: 600,
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Complete lessons between 10 PM and 6 AM",
    category: "special",
    rarity: "rare",
    points: 200,
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Complete lessons between 5 AM and 8 AM",
    category: "special",
    rarity: "rare",
    points: 200,
  },
  {
    id: "error-free-streak-10",
    title: "Steady Hands",
    description: "Complete 10 lessons without any errors",
    category: "special",
    rarity: "epic",
    points: 800,
  },
  {
    id: "comeback-kid",
    title: "Comeback Kid",
    description: "Improve lesson performance by 50% on retry",
    category: "special",
    rarity: "rare",
    points: 300,
  },
  {
    id: "patient-learner",
    title: "Patient Learner",
    description: "Spend over 10 minutes on a single lesson",
    category: "special",
    rarity: "common",
    points: 100,
  },
  {
    id: "quick-learner",
    title: "Quick Learner",
    description: "Complete a lesson in under 2 minutes",
    category: "special",
    rarity: "rare",
    points: 250,
  },
  {
    id: "multitasker",
    title: "Hand Switcher",
    description: "Complete lessons with both hand preferences",
    category: "special", 
    rarity: "epic",
    points: 700,
  },
];

interface TypingStats {
  totalCharactersTyped: number;
  totalErrors: number;
  totalTimeTyped: number;
  bestWpm: number;
  bestAccuracy: number;
  lessons: Record<string, {
    attempts: number;
    completedCount: number;
    bestWpm: number;
    bestAccuracy: number;
    totalTime: number;
  }>;
  commonErrors: Record<string, number>;
}

export function checkAchievements(stats: TypingStats, currentAchievements: string[]): string[] {
  const newAchievements: string[] = [];

  // Helper function to check if achievement is already unlocked
  const isUnlocked = (id: string) => currentAchievements.includes(id);

  // Speed achievements
  if (stats.bestWpm >= 10 && !isUnlocked("speed-10")) newAchievements.push("speed-10");
  if (stats.bestWpm >= 20 && !isUnlocked("speed-20")) newAchievements.push("speed-20");
  if (stats.bestWpm >= 30 && !isUnlocked("speed-30")) newAchievements.push("speed-30");
  if (stats.bestWpm >= 40 && !isUnlocked("speed-40")) newAchievements.push("speed-40");
  if (stats.bestWpm >= 50 && !isUnlocked("speed-50")) newAchievements.push("speed-50");
  if (stats.bestWpm >= 60 && !isUnlocked("speed-60")) newAchievements.push("speed-60");

  // Accuracy achievements
  if (stats.bestAccuracy >= 80 && !isUnlocked("accuracy-80")) newAchievements.push("accuracy-80");
  if (stats.bestAccuracy >= 90 && !isUnlocked("accuracy-90")) newAchievements.push("accuracy-90");
  if (stats.bestAccuracy >= 95 && !isUnlocked("accuracy-95")) newAchievements.push("accuracy-95");
  if (stats.bestAccuracy >= 98 && !isUnlocked("accuracy-98")) newAchievements.push("accuracy-98");
  if (stats.bestAccuracy >= 100 && !isUnlocked("accuracy-100")) newAchievements.push("accuracy-100");

  // Lesson completion achievements
  const completedLessons = Object.values(stats.lessons).reduce((total, lesson) => total + lesson.completedCount, 0);
  const uniqueLessonsCompleted = Object.keys(stats.lessons).filter(lessonId => stats.lessons[lessonId].completedCount > 0).length;

  if (completedLessons >= 1 && !isUnlocked("first-lesson")) newAchievements.push("first-lesson");
  if (uniqueLessonsCompleted >= 10 && !isUnlocked("lessons-10")) newAchievements.push("lessons-10");
  if (uniqueLessonsCompleted >= 25 && !isUnlocked("lessons-25")) newAchievements.push("lessons-25");
  if (uniqueLessonsCompleted >= 50 && !isUnlocked("lessons-50")) newAchievements.push("lessons-50");

  // Time-based achievements (convert minutes to hours)
  const totalHours = stats.totalTimeTyped / 60;
  if (totalHours >= 5 && !isUnlocked("hours-5")) newAchievements.push("hours-5");
  if (totalHours >= 25 && !isUnlocked("hours-25")) newAchievements.push("hours-25");
  if (totalHours >= 50 && !isUnlocked("hours-50")) newAchievements.push("hours-50");
  if (totalHours >= 100 && !isUnlocked("hours-100")) newAchievements.push("hours-100");

  // Special combination achievements
  const hasBalancedPerformance = Object.values(stats.lessons).some(lesson => 
    lesson.bestWpm >= 30 && lesson.bestAccuracy >= 90
  );
  if (hasBalancedPerformance && !isUnlocked("speed-accuracy-balance")) {
    newAchievements.push("speed-accuracy-balance");
  }

  // Category completion achievements (would need lesson data to implement properly)
  // These would check if all lessons in each category are completed

  // Special achievements for accessibility and one-handed typing
  if (stats.totalCharactersTyped >= 1000 && !isUnlocked("one-handed-warrior")) {
    newAchievements.push("one-handed-warrior");
  }

  return newAchievements;
}

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(achievement => achievement.id === id);
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return achievements.filter(achievement => achievement.category === category);
}

export function getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
  return achievements.filter(achievement => achievement.rarity === rarity);
}

export function calculateTotalPoints(unlockedAchievements: string[]): number {
  return unlockedAchievements.reduce((total, id) => {
    const achievement = getAchievementById(id);
    return total + (achievement?.points || 0);
  }, 0);
}

export function getProgressToNextAchievement(stats: TypingStats, unlockedAchievements: string[]): { achievement: Achievement; progress: number } | null {
  // Find the next speed achievement
  const speedTargets = [10, 20, 30, 40, 50, 60];
  const nextSpeedTarget = speedTargets.find(target => 
    !unlockedAchievements.includes(`speed-${target}`)
  );
  
  if (nextSpeedTarget) {
    const achievement = getAchievementById(`speed-${nextSpeedTarget}`);
    if (achievement) {
      const progress = Math.min((stats.bestWpm / nextSpeedTarget) * 100, 100);
      return { achievement, progress };
    }
  }

  // Find the next accuracy achievement
  const accuracyTargets = [80, 90, 95, 98, 100];
  const nextAccuracyTarget = accuracyTargets.find(target => 
    !unlockedAchievements.includes(`accuracy-${target}`)
  );
  
  if (nextAccuracyTarget) {
    const achievement = getAchievementById(`accuracy-${nextAccuracyTarget}`);
    if (achievement) {
      const progress = Math.min((stats.bestAccuracy / nextAccuracyTarget) * 100, 100);
      return { achievement, progress };
    }
  }

  return null;
}
