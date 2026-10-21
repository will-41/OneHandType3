import { type Lesson } from './lessons';

export interface PerformanceMetrics {
  wpm: number;
  accuracy: number;
  consistency: number; // variance in typing speed
  errorRate: number;
  timeToFirstError: number; // seconds
  commonErrors: string[]; // frequently missed characters/words
  learningVelocity: number; // improvement rate over time
}

export interface AdaptiveSettings {
  targetWpm: number;
  targetAccuracy: number;
  difficultyLevel: number; // 1-10 scale
  lessonLength: number; // number of words/characters
  repetitionFactor: number; // how much to repeat difficult content
  practiceMode: 'progressive' | 'mastery' | 'challenge';
}

export interface LearningProfile {
  strongKeys: string[];
  weakKeys: string[];
  preferredHandPosition: 'left' | 'right';
  learningStyle: 'visual' | 'kinesthetic' | 'methodical';
  sessionHistory: PerformanceMetrics[];
  currentLevel: number;
  plateauDetection: boolean;
  lastImprovement: Date;
}

export class AdaptiveDifficultyEngine {
  private learningProfile: LearningProfile;
  private performanceHistory: PerformanceMetrics[] = [];
  private currentSettings: AdaptiveSettings;

  constructor(initialProfile?: Partial<LearningProfile>) {
    this.learningProfile = {
      strongKeys: [],
      weakKeys: [],
      preferredHandPosition: 'right',
      learningStyle: 'methodical',
      sessionHistory: [],
      currentLevel: 1,
      plateauDetection: false,
      lastImprovement: new Date(),
      ...initialProfile
    };

    this.currentSettings = {
      targetWpm: 25,
      targetAccuracy: 85,
      difficultyLevel: 1,
      lessonLength: 50,
      repetitionFactor: 1,
      practiceMode: 'progressive'
    };
  }

  /**
   * Analyze current performance and update difficulty settings
   */
  public analyzeAndAdapt(metrics: PerformanceMetrics): AdaptiveSettings {
    this.performanceHistory.push(metrics);
    this.learningProfile.sessionHistory.push(metrics);

    // Keep only last 20 sessions for analysis
    if (this.performanceHistory.length > 20) {
      this.performanceHistory.shift();
    }

    // Update learning profile
    this.updateLearningProfile(metrics);

    // Detect learning patterns
    const patterns = this.detectLearningPatterns();

    // Adjust difficulty based on performance
    this.adjustDifficulty(metrics, patterns);

    // Detect and handle plateaus
    this.handlePlateauDetection();

    return { ...this.currentSettings };
  }

  /**
   * Generate personalized lesson content based on current profile
   */
  public generateAdaptiveLesson(baseLesson: Lesson): Lesson {
    const adaptedContent = this.adaptLessonContent(baseLesson.content);
    const adaptedTargetWpm = this.calculateAdaptiveWpm(baseLesson.targetWpm);

    return {
      ...baseLesson,
      content: adaptedContent,
      text: adaptedContent,
      targetWpm: adaptedTargetWpm,
      difficulty: this.currentSettings.difficultyLevel,
      title: `${baseLesson.title} (Adaptive)`,
      description: `${baseLesson.description} - Personalized for your skill level`
    };
  }

  /**
   * Get difficulty recommendations for lesson selection
   */
  public getRecommendedLessons(availableLessons: Lesson[]): Lesson[] {
    const currentSkillLevel = this.calculateSkillLevel();
    
    return availableLessons
      .filter(lesson => {
        // Filter lessons based on current skill level and weak areas
        const levelMatch = Math.abs(lesson.level - currentSkillLevel) <= 2;
        const focusesWeakAreas = lesson.focusKeys?.some(key => 
          this.learningProfile.weakKeys.includes(key)
        ) || false;
        
        return levelMatch || focusesWeakAreas;
      })
      .sort((a, b) => {
        // Prioritize lessons that address weak areas
        const aScore = this.calculateLessonRelevanceScore(a);
        const bScore = this.calculateLessonRelevanceScore(b);
        return bScore - aScore;
      })
      .slice(0, 6); // Return top 6 recommendations
  }

  /**
   * Provide real-time difficulty adjustment suggestions
   */
  public getRealTimeAdjustments(currentMetrics: Partial<PerformanceMetrics>): {
    speedUp: boolean;
    slowDown: boolean;
    increaseAccuracy: boolean;
    suggestBreak: boolean;
    encouragement: string;
  } {
    const recentAvg = this.getRecentPerformanceAverage();
    
    return {
      speedUp: (currentMetrics.accuracy || 0) > 95 && (currentMetrics.wpm || 0) < recentAvg.wpm * 1.2,
      slowDown: (currentMetrics.accuracy || 0) < 80,
      increaseAccuracy: (currentMetrics.accuracy || 0) < this.currentSettings.targetAccuracy,
      suggestBreak: this.detectFatigue(currentMetrics),
      encouragement: this.generateEncouragement(currentMetrics)
    };
  }

  private updateLearningProfile(metrics: PerformanceMetrics): void {
    // Update strong and weak keys based on error patterns
    metrics.commonErrors.forEach(error => {
      if (!this.learningProfile.weakKeys.includes(error)) {
        this.learningProfile.weakKeys.push(error);
      }
    });

    // Remove keys from weak list if consistently typed correctly
    this.learningProfile.weakKeys = this.learningProfile.weakKeys.filter(key => {
      const recentErrors = this.performanceHistory
        .slice(-5)
        .flatMap(h => h.commonErrors);
      return recentErrors.includes(key);
    });

    // Update learning velocity
    if (this.performanceHistory.length > 1) {
      const previousMetrics = this.performanceHistory[this.performanceHistory.length - 2];
      const improvement = metrics.wpm - previousMetrics.wpm;
      
      if (improvement > 2) {
        this.learningProfile.lastImprovement = new Date();
        this.learningProfile.plateauDetection = false;
      }
    }
  }

  private detectLearningPatterns(): {
    isImproving: boolean;
    improvementRate: number;
    consistencyTrend: 'improving' | 'stable' | 'declining';
    errorPatterns: string[];
  } {
    if (this.performanceHistory.length < 3) {
      return {
        isImproving: true,
        improvementRate: 0,
        consistencyTrend: 'stable',
        errorPatterns: []
      };
    }

    const recent = this.performanceHistory.slice(-5);
    const wpmTrend = recent[recent.length - 1].wpm - recent[0].wpm;
    const accuracyTrend = recent[recent.length - 1].accuracy - recent[0].accuracy;

    // Analyze consistency
    const wpmVariance = this.calculateVariance(recent.map(m => m.wpm));
    const previousVariance = this.calculateVariance(
      this.performanceHistory.slice(-10, -5).map(m => m.wpm)
    );

    let consistencyTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (wpmVariance < previousVariance * 0.8) consistencyTrend = 'improving';
    else if (wpmVariance > previousVariance * 1.2) consistencyTrend = 'declining';

    // Find common error patterns
    const allErrors = recent.flatMap(m => m.commonErrors);
    const errorCounts = allErrors.reduce((acc, error) => {
      acc[error] = (acc[error] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorPatterns = Object.entries(errorCounts)
      .filter(([_, count]) => count >= 2)
      .map(([error, _]) => error);

    return {
      isImproving: wpmTrend > 0 && accuracyTrend >= -2,
      improvementRate: wpmTrend / recent.length,
      consistencyTrend,
      errorPatterns
    };
  }

  private adjustDifficulty(metrics: PerformanceMetrics, patterns: any): void {
    // Adjust target WPM
    if (patterns.isImproving && metrics.accuracy > 90) {
      this.currentSettings.targetWpm = Math.min(
        this.currentSettings.targetWpm + 3,
        80
      );
    } else if (metrics.accuracy < 80) {
      this.currentSettings.targetWpm = Math.max(
        this.currentSettings.targetWpm - 2,
        15
      );
    }

    // Adjust difficulty level
    if (metrics.wpm > this.currentSettings.targetWpm && metrics.accuracy > 95) {
      this.currentSettings.difficultyLevel = Math.min(this.currentSettings.difficultyLevel + 1, 10);
    } else if (metrics.accuracy < 75) {
      this.currentSettings.difficultyLevel = Math.max(this.currentSettings.difficultyLevel - 1, 1);
    }

    // Adjust lesson length based on performance
    if (patterns.consistencyTrend === 'improving') {
      this.currentSettings.lessonLength = Math.min(this.currentSettings.lessonLength + 10, 200);
    } else if (patterns.consistencyTrend === 'declining') {
      this.currentSettings.lessonLength = Math.max(this.currentSettings.lessonLength - 5, 30);
    }

    // Adjust practice mode
    if (patterns.isImproving) {
      this.currentSettings.practiceMode = 'progressive';
    } else if (patterns.errorPatterns.length > 3) {
      this.currentSettings.practiceMode = 'mastery';
      this.currentSettings.repetitionFactor = 2;
    } else {
      this.currentSettings.practiceMode = 'challenge';
    }
  }

  private handlePlateauDetection(): void {
    const daysSinceImprovement = (new Date().getTime() - this.learningProfile.lastImprovement.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceImprovement > 3) {
      this.learningProfile.plateauDetection = true;
      
      // Implement plateau-breaking strategies
      this.currentSettings.practiceMode = 'challenge';
      this.currentSettings.difficultyLevel = Math.max(this.currentSettings.difficultyLevel - 1, 1);
      this.currentSettings.lessonLength = Math.max(this.currentSettings.lessonLength - 10, 30);
    }
  }

  private adaptLessonContent(originalContent: string): string {
    let adaptedContent = originalContent;

    // Focus on weak keys
    if (this.learningProfile.weakKeys.length > 0) {
      const weakKeyWords = this.generateWeakKeyPractice();
      adaptedContent = `${weakKeyWords} ${adaptedContent}`;
    }

    // Adjust repetition based on difficulty
    if (this.currentSettings.repetitionFactor > 1) {
      const words = adaptedContent.split(' ');
      const repeatedWords = words.flatMap(word => 
        Array(this.currentSettings.repetitionFactor).fill(word)
      );
      adaptedContent = repeatedWords.join(' ');
    }

    // Limit content length based on settings
    const words = adaptedContent.split(' ');
    if (words.length > this.currentSettings.lessonLength) {
      adaptedContent = words.slice(0, this.currentSettings.lessonLength).join(' ');
    }

    return adaptedContent;
  }

  private generateWeakKeyPractice(): string {
    const practices = this.learningProfile.weakKeys.map(key => {
      // Generate practice words focusing on this key
      const commonWords = this.getWordsContaining(key);
      return commonWords.slice(0, 3).join(' ');
    });

    return practices.join(' ');
  }

  private getWordsContaining(character: string): string[] {
    const wordSets: Record<string, string[]> = {
      'a': ['cat', 'hat', 'mat', 'bat', 'sat', 'fat'],
      'e': ['the', 'see', 'bee', 'fee', 'tree', 'free'],
      's': ['sun', 'sit', 'set', 'six', 'see', 'say'],
      'd': ['dog', 'dig', 'day', 'did', 'dad', 'red'],
      'f': ['fox', 'fit', 'fin', 'fun', 'far', 'for'],
      'j': ['job', 'joy', 'jam', 'jet', 'jog', 'just'],
      'k': ['key', 'kid', 'kit', 'keep', 'kind', 'know'],
      'l': ['let', 'lot', 'log', 'low', 'lay', 'led']
    };

    return wordSets[character.toLowerCase()] || [character.repeat(3)];
  }

  private calculateAdaptiveWpm(baseWpm: number): number {
    const currentSkill = this.getRecentPerformanceAverage().wpm;
    const adjustment = (this.currentSettings.targetWpm - currentSkill) * 0.3;
    return Math.max(Math.round(baseWpm + adjustment), 15);
  }

  private calculateSkillLevel(): number {
    const avgWpm = this.getRecentPerformanceAverage().wpm;
    
    if (avgWpm < 20) return 1;
    if (avgWpm < 30) return 2;
    if (avgWpm < 40) return 3;
    if (avgWpm < 50) return 4;
    return 5;
  }

  private calculateLessonRelevanceScore(lesson: Lesson): number {
    let score = 0;

    // Boost score for lessons focusing on weak keys
    if (lesson.focusKeys) {
      const weakKeyMatches = lesson.focusKeys.filter(key => 
        this.learningProfile.weakKeys.includes(key)
      ).length;
      score += weakKeyMatches * 10;
    }

    // Boost score for appropriate difficulty level
    const levelDiff = Math.abs(lesson.level - this.calculateSkillLevel());
    score += Math.max(5 - levelDiff, 0);

    // Boost score for hand preference compatibility
    if (lesson.handCompatibility.includes(this.learningProfile.preferredHandPosition)) {
      score += 5;
    }

    return score;
  }

  private getRecentPerformanceAverage(): PerformanceMetrics {
    if (this.performanceHistory.length === 0) {
      return {
        wpm: 25,
        accuracy: 85,
        consistency: 0.8,
        errorRate: 0.15,
        timeToFirstError: 30,
        commonErrors: [],
        learningVelocity: 0
      };
    }

    const recent = this.performanceHistory.slice(-5);
    
    return {
      wpm: recent.reduce((sum, m) => sum + m.wpm, 0) / recent.length,
      accuracy: recent.reduce((sum, m) => sum + m.accuracy, 0) / recent.length,
      consistency: recent.reduce((sum, m) => sum + m.consistency, 0) / recent.length,
      errorRate: recent.reduce((sum, m) => sum + m.errorRate, 0) / recent.length,
      timeToFirstError: recent.reduce((sum, m) => sum + m.timeToFirstError, 0) / recent.length,
      commonErrors: [...new Set(recent.flatMap(m => m.commonErrors))],
      learningVelocity: recent.reduce((sum, m) => sum + m.learningVelocity, 0) / recent.length
    };
  }

  private detectFatigue(currentMetrics: Partial<PerformanceMetrics>): boolean {
    const recent = this.performanceHistory.slice(-3);
    if (recent.length < 3) return false;

    const avgAccuracy = recent.reduce((sum, m) => sum + m.accuracy, 0) / recent.length;
    const avgWpm = recent.reduce((sum, m) => sum + m.wpm, 0) / recent.length;

    return (currentMetrics.accuracy || 0) < avgAccuracy - 10 ||
           (currentMetrics.wpm || 0) < avgWpm - 5;
  }

  private generateEncouragement(currentMetrics: Partial<PerformanceMetrics>): string {
    const messages = [
      "Great progress! Keep up the steady improvement.",
      "You're building excellent muscle memory!",
      "Consistency is key - you're doing wonderfully!",
      "Every keystroke makes you stronger!",
      "Focus and flow - you've got this!",
      "Precision over speed - excellent technique!",
      "Your dedication is showing in your progress!"
    ];

    if ((currentMetrics.accuracy || 0) > 95) {
      return "Outstanding accuracy! You're a typing master!";
    }

    if ((currentMetrics.wpm || 0) > this.currentSettings.targetWpm) {
      return "Fantastic speed! You're exceeding expectations!";
    }

    return messages[Math.floor(Math.random() * messages.length)];
  }

  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  // Public getters for external components
  public getCurrentSettings(): AdaptiveSettings {
    return { ...this.currentSettings };
  }

  public getLearningProfile(): LearningProfile {
    return { ...this.learningProfile };
  }

  public getPerformanceHistory(): PerformanceMetrics[] {
    return [...this.performanceHistory];
  }
}

// Export singleton instance
export const adaptiveDifficultyEngine = new AdaptiveDifficultyEngine();