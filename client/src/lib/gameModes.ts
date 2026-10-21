// Game Modes & Challenges for Award-Winning Mobile Experience
export type GameMode = 'practice' | 'challenge' | 'lesson' | 'free-typing' | 'daily-challenge';

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  timeLimit?: number; // in seconds
  targetWpm?: number;
  targetAccuracy?: number;
  features: string[];
  mobileOptimized: boolean;
}

export const gameModes: GameModeConfig[] = [
  {
    id: 'practice',
    name: 'Practice Mode',
    description: 'Self-paced learning without time pressure',
    icon: '🎯',
    features: ['No time limit', 'Instant feedback', 'Error correction', 'Progress tracking'],
    mobileOptimized: true
  },
  {
    id: 'challenge',
    name: '60-Second Challenge',
    description: 'Timed typing test to measure your speed',
    icon: '⏱️',
    timeLimit: 60,
    targetWpm: 40,
    targetAccuracy: 95,
    features: ['60-second timer', 'WPM calculation', 'Accuracy tracking', 'Personal records'],
    mobileOptimized: true
  },
  {
    id: 'lesson',
    name: 'Lesson-Based Learning',
    description: 'Progressive skill development with structured lessons',
    icon: '📚',
    features: ['Progressive difficulty', 'Structured curriculum', 'Achievement unlocks', 'Finger guidance'],
    mobileOptimized: true
  },
  {
    id: 'free-typing',
    name: 'Free Typing',
    description: 'Practice with your own custom text',
    icon: '✍️',
    features: ['Custom text input', 'Flexible practice', 'Real-time stats', 'No restrictions'],
    mobileOptimized: true
  },
  {
    id: 'daily-challenge',
    name: 'Daily Challenge',
    description: 'Special themed exercises that change daily',
    icon: '🏆',
    timeLimit: 120,
    targetWpm: 35,
    targetAccuracy: 90,
    features: ['Daily unique content', 'Special rewards', 'Streak tracking', 'Themed challenges'],
    mobileOptimized: true
  }
];

// Challenge Types for Enhanced Mobile Experience
export interface ChallengeType {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeLimit: number;
  content: string;
  targetWpm: number;
  targetAccuracy: number;
  handCompatibility: ('left' | 'right')[];
  mobileOptimized: boolean;
}

// Daily Challenges - Mobile-Optimized Content
export const dailyChallenges: ChallengeType[] = [
  {
    id: 'monday-fundamentals',
    name: 'Monday Fundamentals',
    description: 'Start the week with basic finger exercises',
    difficulty: 2,
    timeLimit: 90,
    content: 'the quick brown fox jumps over the lazy dog the quick brown fox jumps over the lazy dog',
    targetWpm: 25,
    targetAccuracy: 92,
    handCompatibility: ['left', 'right'],
    mobileOptimized: true
  },
  {
    id: 'tech-terms-tuesday',
    name: 'Tech Terms Tuesday',
    description: 'Technology vocabulary for the modern age',
    difficulty: 3,
    timeLimit: 120,
    content: 'smartphone app download browser internet wifi bluetooth data cloud storage sync update',
    targetWpm: 30,
    targetAccuracy: 90,
    handCompatibility: ['left', 'right'],
    mobileOptimized: true
  },
  {
    id: 'word-flow-wednesday',
    name: 'Word Flow Wednesday',
    description: 'Smooth word transitions and flow',
    difficulty: 3,
    timeLimit: 100,
    content: 'words flow like water through rivers creating smooth rhythms and natural patterns',
    targetWpm: 35,
    targetAccuracy: 93,
    handCompatibility: ['left', 'right'],
    mobileOptimized: true
  },
  {
    id: 'throwback-thursday',
    name: 'Throwback Thursday',
    description: 'Classic literature and timeless phrases',
    difficulty: 4,
    timeLimit: 150,
    content: 'to be or not to be that is the question whether tis nobler in the mind to suffer',
    targetWpm: 32,
    targetAccuracy: 95,
    handCompatibility: ['left', 'right'],
    mobileOptimized: true
  },
  {
    id: 'fast-friday',
    name: 'Fast Friday',
    description: 'Speed challenge with common words',
    difficulty: 5,
    timeLimit: 60,
    content: 'fast quick speed rapid swift hasty brisk prompt instant immediate sudden urgent rush',
    targetWpm: 45,
    targetAccuracy: 88,
    handCompatibility: ['left', 'right'],
    mobileOptimized: true
  }
];

// Performance Metrics Enhancement
export interface EnhancedMetrics {
  wpm: number;
  accuracy: number;
  consistency: number; // Variance in typing speed
  errorRate: number;
  correctKeystrokes: number;
  totalKeystrokes: number;
  timeElapsed: number;
  charactersPerSecond: number;
  mostCommonErrors: Record<string, number>;
  fingerUtilization: Record<string, number>;
  improvementTrend: number; // Positive/negative improvement
}

// Mobile-Optimized Difficulty Scaling
export const difficultyScaling = {
  1: { wpmTarget: 15, accuracyTarget: 85, description: 'Beginner - Focus on accuracy' },
  2: { wpmTarget: 25, accuracyTarget: 90, description: 'Easy - Building confidence' },
  3: { wpmTarget: 35, accuracyTarget: 93, description: 'Intermediate - Steady progress' },
  4: { wpmTarget: 45, accuracyTarget: 95, description: 'Advanced - High performance' },
  5: { wpmTarget: 60, accuracyTarget: 97, description: 'Expert - Elite level' }
};

// Adaptive Difficulty System
export class AdaptiveDifficulty {
  private static calculateDifficulty(recentPerformance: EnhancedMetrics[]): number {
    if (recentPerformance.length < 3) return 1;
    
    const avgWpm = recentPerformance.reduce((sum, m) => sum + m.wpm, 0) / recentPerformance.length;
    const avgAccuracy = recentPerformance.reduce((sum, m) => sum + m.accuracy, 0) / recentPerformance.length;
    
    // Mobile-optimized difficulty scaling
    if (avgWpm >= 50 && avgAccuracy >= 95) return 5;
    if (avgWpm >= 40 && avgAccuracy >= 93) return 4;
    if (avgWpm >= 30 && avgAccuracy >= 90) return 3;
    if (avgWpm >= 20 && avgAccuracy >= 87) return 2;
    return 1;
  }
  
  static getNextChallenge(userPerformance: EnhancedMetrics[], currentMode: GameMode): ChallengeType {
    const difficulty = this.calculateDifficulty(userPerformance);
    const scaling = difficultyScaling[difficulty as keyof typeof difficultyScaling];
    
    return {
      id: `adaptive-${Date.now()}`,
      name: `Adaptive Challenge`,
      description: scaling.description,
      difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
      timeLimit: 90,
      content: this.generateAdaptiveContent(difficulty),
      targetWpm: scaling.wpmTarget,
      targetAccuracy: scaling.accuracyTarget,
      handCompatibility: ['left', 'right'],
      mobileOptimized: true
    };
  }
  
  private static generateAdaptiveContent(difficulty: number): string {
    const contentByDifficulty = {
      1: 'aaa sss ddd fff aaa sss ddd fff sad fad had mad pad bad lad',
      2: 'the cat sat on the mat the dog ran in the park the sun is bright',
      3: 'quick brown fox jumps over lazy dog while eating fresh vegetables',
      4: 'sophisticated algorithms optimize performance through intelligent caching mechanisms',
      5: 'extraordinarily complex implementations require meticulous attention to architectural patterns'
    };
    
    return contentByDifficulty[difficulty as keyof typeof contentByDifficulty] || contentByDifficulty[1];
  }
}