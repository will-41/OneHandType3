import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Lesson } from "../lessons";
// import { checkAchievements } from "../achievements";
import type { InternationalLayout, SpecializedLayoutType } from "../../lib/keyboardLayouts";
import { 
  checkAchievements as checkSpecializedAchievements,
  updateProgressMilestones,
  generateProgressInsights,
  calculateOverallProgress,
  type Achievement,
  type ProgressMilestone
} from "../specializedAchievements.ts";

export type GameState = "ready" | "playing" | "paused" | "ended" | "lesson-select";
export type HandPreference = "left" | "right";
export type ViewMode = "portrait" | "landscape";
export type ThemeMode = "light" | "dark";

export interface KeyboardColorTheme {
  name: string;
  keyOutline: string;
  keyOutlineHover: string;
  keyOutlineActive: string;
  fingerColors: {
    pinky: string;
    ring: string;
    middle: string;
    index: string;
    thumb: string;
  };
}

export const defaultColorThemes: KeyboardColorTheme[] = [
  {
    name: "System Theme",
    keyOutline: "hsl(var(--primary))",
    keyOutlineHover: "hsl(var(--primary) / 0.8)",
    keyOutlineActive: "hsl(var(--primary) / 0.6)",
    fingerColors: {
      pinky: "hsl(var(--chart-1))",
      ring: "hsl(var(--chart-2))",
      middle: "hsl(var(--chart-3))",
      index: "hsl(var(--chart-4))",
      thumb: "hsl(var(--chart-5))"
    }
  },
  {
    name: "Forest Zen",
    keyOutline: "hsl(120 61% 50%)",
    keyOutlineHover: "hsl(120 61% 40%)",
    keyOutlineActive: "hsl(120 61% 30%)",
    fingerColors: {
      pinky: "hsl(14 100% 57%)",
      ring: "hsl(25 65% 45%)",
      middle: "hsl(200 18% 46%)",
      index: "hsl(207 90% 54%)",
      thumb: "hsl(36 100% 50%)"
    }
  },
  {
    name: "Ocean Breeze",
    keyOutline: "hsl(262 83% 58%)",
    keyOutlineHover: "hsl(262 83% 48%)",
    keyOutlineActive: "hsl(262 83% 38%)",
    fingerColors: {
      pinky: "hsl(4 90% 58%)",
      ring: "hsl(340 82% 52%)",
      middle: "hsl(262 52% 47%)",
      index: "hsl(231 48% 48%)",
      thumb: "hsl(188 100% 42%)"
    }
  },
  {
    name: "Sunset Glow",
    keyOutline: "hsl(36 100% 50%)",
    keyOutlineHover: "hsl(36 100% 40%)",
    keyOutlineActive: "hsl(36 100% 30%)",
    fingerColors: {
      pinky: "hsl(262 83% 58%)",
      ring: "hsl(262 52% 47%)",
      middle: "hsl(231 48% 48%)",
      index: "hsl(174 100% 29%)",
      thumb: "hsl(14 100% 57%)"
    }
  },
  {
    name: "High Contrast",
    keyOutline: "hsl(var(--foreground))",
    keyOutlineHover: "hsl(var(--foreground) / 0.8)",
    keyOutlineActive: "hsl(var(--foreground) / 0.6)",
    fingerColors: {
      pinky: "hsl(var(--destructive))",
      ring: "hsl(var(--accent))",
      middle: "hsl(var(--primary))",
      index: "hsl(var(--success))",
      thumb: "hsl(var(--secondary))"
    }
  }
];

interface TypingStats {
  totalCharactersTyped: number;
  totalErrors: number;
  totalTimeTyped: number; // in minutes
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
  layoutSpecificStats?: {
    [layoutType: string]: {
      totalCharacters: number;
      totalChords?: number; // For ARTSEY
      avgErgonomicScore?: number;
      fingerUsageDistribution?: Record<string, number>;
      bestWpmForLayout: number;
      bestAccuracyForLayout: number;
      hoursOfPractice: number;
      adaptationProgress?: number; // 0-100, how well adapted to this layout
    };
  };
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  soundEnabled: boolean;
  fontSize: number;
  lineHeight: number;
  colorScheme: "default" | "deuteranopia" | "protanopia" | "tritanopia";
  focusIndicator: "standard" | "enhanced" | "high-contrast";
  cursorSize: "small" | "normal" | "large";
  audioFeedback: boolean;
  hapticFeedback: boolean;
  
  // Additional audio settings
  backgroundMusicEnabled: boolean;
  keyClickSoundEnabled: boolean;
  errorSoundEnabled: boolean;
  completionSoundEnabled: boolean;
  soundVolume: number;
  
  // Typing preferences
  showVirtualKeyboard: boolean;
  showFingerGuide: boolean;
  highlightNextKey: boolean;
  errorHighlighting: boolean;
  autoCorrect: boolean;
  showWPM: boolean;
  showAccuracy: boolean;
  showTimer: boolean;
  colorBlindMode: boolean;
  focusMode: boolean;
  
  // Custom theme colors
  customTheme: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    errorColor: string;
  };
}

interface TypingResult {
  newInput: string;
  hasError: boolean;
  isComplete: boolean;
  errorIndices: number[];
  currentPosition: number;
  wpm: number;
  accuracy: number;
}

interface TypingState {
  // Game state
  gameState: GameState;
  handPreference: HandPreference;
  showTutorial: boolean;
  viewMode: ViewMode;
  themeMode: ThemeMode;
  
  // Missing properties needed by components
  currentWpm: number;
  currentStreak: number;
  timeElapsed: number;
  
  // New settings actions
  setHandPreference: (hand: HandPreference) => void;
  setThemeMode: (theme: ThemeMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setBackgroundMusicEnabled: (enabled: boolean) => void;
  setKeyClickSoundEnabled: (enabled: boolean) => void;
  setErrorSoundEnabled: (enabled: boolean) => void;
  setCompletionSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setShowVirtualKeyboard: (show: boolean) => void;
  setShowFingerGuide: (show: boolean) => void;
  setHighlightNextKey: (highlight: boolean) => void;
  setErrorHighlighting: (highlight: boolean) => void;
  setAutoCorrect: (correct: boolean) => void;
  setShowWPM: (show: boolean) => void;
  setShowAccuracy: (show: boolean) => void;
  setShowTimer: (show: boolean) => void;
  setHighContrast: (contrast: boolean) => void;
  setLargeText: (large: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setScreenReaderMode: (mode: boolean) => void;
  setColorBlindMode: (mode: boolean) => void;
  setFocusMode: (focus: boolean) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setCustomTheme: (theme: any) => void;
  keyboardLayout: InternationalLayout | SpecializedLayoutType;
  selectedColorTheme: number;
  
  // Current lesson
  currentLesson: Lesson | null;
  targetText: string;
  currentInput: string;
  currentPosition: number;
  
  // Typing metrics
  errors: number[];
  wpm: number;
  accuracy: number;
  startTime: number | null;
  timeRemaining: number | null;
  
  // Visual feedback
  expectedChar: string | null;
  highlightKey: string | null;
  
  // Progress and achievements
  stats: TypingStats;
  unlockedAchievements: string[];
  personalStats: TypingStats; // Exposed for components
  specializedAchievements: Achievement[];
  progressMilestones: ProgressMilestone[];
  progressInsights: {
    insights: string[];
    recommendations: string[];
    strongAreas: string[];
    improvementAreas: string[];
  };
  overallProgress: {
    score: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
    breakdown: any;
  };
  
  // Accessibility
  accessibilitySettings: AccessibilitySettings;
  
  // Progress tracking
  completedLessons: string[];
  lessonProgress: Record<string, any>;
  currentProgress: {
    lessonId: string;
    position: number;
    wpm: number;
    accuracy: number;
  } | null;
  customLessons: Lesson[];
  
  // Ad system state
  currentAdBreak: any | null;
  totalAdRevenue: number;
  adBreaksCompleted: Set<string>;
  showAdBreak: boolean;

  // Actions
  setCurrentLesson: (lesson: Lesson) => void;
  setGameState: (state: GameState) => void;
  setShowTutorial: (show: boolean) => void;
  toggleHandPreference: () => void;
  toggleThemeMode: () => void;
  setViewMode: (mode: ViewMode) => void;
  setKeyboardLayout: (layout: InternationalLayout | SpecializedLayoutType) => void;
  setColorTheme: (themeIndex: number) => void;
  startLesson: () => void;
  pauseLesson: () => void;
  resumeLesson: () => void;
  resetLesson: () => void;
  updateTypingProgress: (result: TypingResult) => void;
  setCurrentInput: (input: string) => void;
  initializeAudio: () => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  goBackToMainMenu: () => void;
  addCustomLesson: (lesson: Lesson) => void;
  removeCustomLesson: (lessonId: string) => void;
  updateLayoutSpecificStats: (layoutType: InternationalLayout | SpecializedLayoutType, result: any) => void;
  getPersonalStats: () => TypingStats;
  updateSpecializedProgress: () => void;
  getProgressSummary: () => any;
  
  // Ad system actions
  setCurrentAdBreak: (adBreak: any) => void;
  completeAdBreak: (revenue: number) => void;
  setShowAdBreak: (show: boolean) => void;
}

const defaultStats: TypingStats = {
  totalCharactersTyped: 0,
  totalErrors: 0,
  totalTimeTyped: 0,
  bestWpm: 0,
  bestAccuracy: 0,
  lessons: {},
  commonErrors: {},
  layoutSpecificStats: {},
};

const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  soundEnabled: true,
  fontSize: 16,
  lineHeight: 1.5,
  colorScheme: "default",
  focusIndicator: "enhanced",
  cursorSize: "normal",
  audioFeedback: true,
  hapticFeedback: false,
  
  // Additional settings with defaults
  backgroundMusicEnabled: true,
  keyClickSoundEnabled: true,
  errorSoundEnabled: true,
  completionSoundEnabled: true,
  soundVolume: 70,
  showVirtualKeyboard: true,
  showFingerGuide: true,
  highlightNextKey: true,
  errorHighlighting: true,
  autoCorrect: false,
  showWPM: true,
  showAccuracy: true,
  showTimer: true,
  colorBlindMode: false,
  focusMode: false,
  customTheme: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#2563eb',
    errorColor: '#dc2626'
  }
};

export const useTypingStore = create<TypingState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: "ready",
    handPreference: "right",
    showTutorial: false,
    viewMode: "portrait",
    themeMode: "light",
    keyboardLayout: "qwerty",
    selectedColorTheme: 0,
    
    // Missing properties
    currentWpm: 0,
    currentStreak: 0,
    timeElapsed: 0,
    
    currentLesson: null,
    targetText: "",
    currentInput: "",
    currentPosition: 0,
    
    errors: [],
    wpm: 0,
    accuracy: 100,
    startTime: null,
    timeRemaining: null,
    
    expectedChar: null,
    highlightKey: null,
    
    stats: defaultStats,
    personalStats: defaultStats,
    unlockedAchievements: [],
    specializedAchievements: [],
    progressMilestones: [],
    progressInsights: {
      insights: [],
      recommendations: [],
      strongAreas: [],
      improvementAreas: []
    },
    overallProgress: {
      score: 0,
      level: 'Beginner',
      breakdown: {}
    },
    completedLessons: [],
    lessonProgress: {},
    currentProgress: null,
    customLessons: [],
    
    accessibilitySettings: defaultAccessibilitySettings,
    
    // Ad system state
    currentAdBreak: null,
    totalAdRevenue: 0,
    adBreaksCompleted: new Set(),
    showAdBreak: false,
    
    // Actions
    setCurrentLesson: (lesson: Lesson | null) => {
      console.log('useTypingStore: setCurrentLesson called with:', lesson?.id);
      if (!lesson) {
        set({
          currentLesson: null,
          targetText: "",
          currentInput: "",
          currentPosition: 0,
          errors: [],
          wpm: 0,
          accuracy: 100,
          expectedChar: null,
        });
        return;
      }
      
      set({
        currentLesson: lesson,
        targetText: lesson.text || lesson.content || "",
        currentInput: "",
        currentPosition: 0,
        errors: [],
        wpm: 0,
        accuracy: 100,
        expectedChar: (lesson.text || lesson.content || "")[0] || null,
        gameState: "ready"
      });
    },
    
    setGameState: (state) => set({ gameState: state }),
    
    setShowTutorial: (show) => set({ showTutorial: show }),
    
    toggleHandPreference: () => {
      set((state) => ({
        handPreference: state.handPreference === "left" ? "right" : "left"
      }));
    },

    setHandPreference: (hand) => set({ handPreference: hand }),
    
    toggleThemeMode: () => {
      set((state) => ({
        themeMode: state.themeMode === "light" ? "dark" : "light"
      }));
    },

    setThemeMode: (theme) => set({ themeMode: theme }),
    setSoundEnabled: (enabled) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        audioFeedback: enabled
      }
    })),
    setBackgroundMusicEnabled: (enabled) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        backgroundMusicEnabled: enabled
      }
    })),
    setKeyClickSoundEnabled: (enabled) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        keyClickSoundEnabled: enabled
      }
    })),
    setErrorSoundEnabled: (enabled) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        errorSoundEnabled: enabled
      }
    })),
    setCompletionSoundEnabled: (enabled) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        completionSoundEnabled: enabled
      }
    })),
    setSoundVolume: (volume) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        soundVolume: volume
      }
    })),
    setShowVirtualKeyboard: (show) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        showVirtualKeyboard: show
      }
    })),
    setShowFingerGuide: (show) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        showFingerGuide: show
      }
    })),
    setHighlightNextKey: (highlight) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        highlightNextKey: highlight
      }
    })),
    setErrorHighlighting: (highlight) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        errorHighlighting: highlight
      }
    })),
    setAutoCorrect: (correct) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        autoCorrect: correct
      }
    })),
    setShowWPM: (show) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        showWPM: show
      }
    })),
    setShowAccuracy: (show) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        showAccuracy: show
      }
    })),
    setShowTimer: (show) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        showTimer: show
      }
    })),
    setHighContrast: (contrast) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        highContrast: contrast
      }
    })),
    setLargeText: (large) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        largeText: large
      }
    })),
    setReducedMotion: (reduced) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        reducedMotion: reduced
      }
    })),
    setScreenReaderMode: (mode) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        screenReaderMode: mode
      }
    })),
    setColorBlindMode: (mode) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        colorBlindMode: mode
      }
    })),
    setFocusMode: (focus) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        focusMode: focus
      }
    })),
    setFontSize: (size) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        fontSize: size
      }
    })),
    setLineHeight: (height) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        lineHeight: height
      }
    })),
    setCustomTheme: (theme) => set((state) => ({
      accessibilitySettings: {
        ...state.accessibilitySettings,
        customTheme: theme
      }
    })),

    setViewMode: (mode) => set({ viewMode: mode }),
    
    setKeyboardLayout: (layout) => set({ keyboardLayout: layout }),
    
    setColorTheme: (themeIndex) => set({ selectedColorTheme: themeIndex }),
    
    startLesson: () => {
      const { currentLesson } = get();
      if (!currentLesson) return;
      
      set({
        gameState: "playing",
        startTime: Date.now(),
        timeRemaining: currentLesson.timeLimit || null,
        currentInput: "",
        currentPosition: 0,
        errors: [],
        wpm: 0,
        accuracy: 100
      });
      
      // Update lesson stats
      set((state) => ({
        stats: {
          ...state.stats,
          lessons: {
            ...state.stats.lessons,
            [currentLesson.id]: {
              ...state.stats.lessons[currentLesson.id],
              attempts: (state.stats.lessons[currentLesson.id]?.attempts || 0) + 1
            }
          }
        }
      }));
    },
    
    pauseLesson: () => set({ gameState: "paused" }),
    resumeLesson: () => set({ gameState: "playing" }),
    
    resetLesson: () => {
      const { currentLesson } = get();
      if (!currentLesson) return;
      
      set({
        gameState: "ready",
        currentInput: "",
        currentPosition: 0,
        errors: [],
        wpm: 0,
        accuracy: 100,
        startTime: null,
        timeRemaining: currentLesson.timeLimit || null,
        expectedChar: currentLesson.content[0] || null
      });
    },
    
    updateTypingProgress: (result) => {
      const { currentLesson, stats, startTime, keyboardLayout } = get();
      if (!currentLesson || !startTime) return;
      
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      const timeElapsedSeconds = (Date.now() - startTime) / 1000; // seconds for display
      
      // Calculate current streak
      let streak = get().currentStreak;
      if (result.hasError) {
        streak = 0;
      } else if (result.currentPosition > get().currentPosition) {
        streak++;
      }
      
      set({
        currentInput: result.newInput,
        currentPosition: result.currentPosition,
        errors: result.errorIndices,
        wpm: result.wpm,
        accuracy: result.accuracy,
        expectedChar: currentLesson.content[result.currentPosition] || null,
        currentWpm: result.wpm,
        timeElapsed: timeElapsedSeconds,
        currentStreak: streak
      });
      
      // Update layout-specific stats
      get().updateLayoutSpecificStats(keyboardLayout, result);
      
      // Update general stats
      const newStats = {
        ...stats,
        totalCharactersTyped: stats.totalCharactersTyped + 1,
        totalErrors: stats.totalErrors + (result.hasError ? 1 : 0),
        totalTimeTyped: stats.totalTimeTyped + (timeElapsed * 60), // convert to seconds
        bestWpm: Math.max(stats.bestWpm, result.wpm),
        bestAccuracy: Math.max(stats.bestAccuracy, result.accuracy),
        lessons: {
          ...stats.lessons,
          [currentLesson.id]: {
            ...stats.lessons[currentLesson.id],
            bestWpm: Math.max(stats.lessons[currentLesson.id]?.bestWpm || 0, result.wpm),
            bestAccuracy: Math.max(stats.lessons[currentLesson.id]?.bestAccuracy || 0, result.accuracy),
            totalTime: (stats.lessons[currentLesson.id]?.totalTime || 0) + timeElapsed,
            attempts: stats.lessons[currentLesson.id]?.attempts || 1,
            completedCount: result.isComplete 
              ? (stats.lessons[currentLesson.id]?.completedCount || 0) + 1
              : (stats.lessons[currentLesson.id]?.completedCount || 0)
          }
        }
      };
      
      set({ 
        stats: newStats,
        personalStats: newStats 
      });
      
      // Check for new specialized achievements
      const state = get();
      const newSpecializedAchievements = checkSpecializedAchievements(
        state.stats, 
        state.stats.layoutSpecificStats,
        state.specializedAchievements.map(a => a.id)
      );
      
      if (newSpecializedAchievements.length > 0) {
        set((prevState) => ({
          specializedAchievements: [...prevState.specializedAchievements, ...newSpecializedAchievements],
          unlockedAchievements: [...prevState.unlockedAchievements, ...newSpecializedAchievements.map(a => a.id)]
        }));
        
        // Update progress after achievement check
        get().updateSpecializedProgress();
      }
      
      // End lesson if complete
      if (result.isComplete) {
        set({ gameState: "ended" });
      }
    },
    
    setCurrentInput: (input) => set({ currentInput: input }),
    
    initializeAudio: () => {
      // Audio initialization handled in App.tsx
    },
    
    updateAccessibilitySettings: (newSettings) => {
      set((state) => ({
        accessibilitySettings: {
          ...state.accessibilitySettings,
          ...newSettings
        }
      }));
    },

    goBackToMainMenu: () => {
      set({
        gameState: "ready",
        currentLesson: null,
        targetText: "",
        currentInput: "",
        currentPosition: 0,
        errors: [],
        wpm: 0,
        accuracy: 100,
        startTime: null,
        timeRemaining: null,
        expectedChar: null,
        highlightKey: null,
        viewMode: "portrait"
      });
    },

    addCustomLesson: (lesson: Lesson) => {
      set((state) => ({
        customLessons: [...state.customLessons, lesson],
      }));
    },

    removeCustomLesson: (lessonId: string) => {
      set((state) => ({
        customLessons: state.customLessons.filter(lesson => lesson.id !== lessonId),
      }));
    },
    
    // Ad system actions
    setCurrentAdBreak: (adBreak: any) => set({ currentAdBreak: adBreak }),
    
    completeAdBreak: (revenue: number) => {
      set((state) => ({
        currentAdBreak: null,
        totalAdRevenue: state.totalAdRevenue + revenue,
        showAdBreak: false
      }));
    },
    
    setShowAdBreak: (show: boolean) => set({ showAdBreak: show }),

    // Layout-specific stats management
    updateLayoutSpecificStats: (layoutType, result) => {
      const state = get();
      const currentStats = state.stats.layoutSpecificStats || {};
      const layoutStats = currentStats[layoutType] || {
        totalCharacters: 0,
        totalChords: 0,
        avgErgonomicScore: 0,
        fingerUsageDistribution: {},
        bestWpmForLayout: 0,
        bestAccuracyForLayout: 0,
        hoursOfPractice: 0,
        adaptationProgress: 0
      };

      // Update character count
      const newTotalCharacters = layoutStats.totalCharacters + 1;
      
      // Update chord count for ARTSEY
      const newTotalChords = layoutType === 'artsey' && result.chordCombinations ? 
        (layoutStats.totalChords || 0) + result.chordCombinations : layoutStats.totalChords;

      // Update ergonomic metrics if available
      let newAvgErgonomicScore = layoutStats.avgErgonomicScore || 0;
      let newFingerUsageDistribution = { ...layoutStats.fingerUsageDistribution };
      
      if (result.layoutSpecificMetrics) {
        if (result.layoutSpecificMetrics.avgErgonomicScore) {
          newAvgErgonomicScore = (
            (layoutStats.avgErgonomicScore || 0) * (newTotalCharacters - 1) + 
            result.layoutSpecificMetrics.avgErgonomicScore
          ) / newTotalCharacters;
        }
        
        if (result.layoutSpecificMetrics.fingerUsageDistribution) {
          Object.entries<number>(result.layoutSpecificMetrics.fingerUsageDistribution).forEach(([finger, usage]) => {
            newFingerUsageDistribution[finger] = (newFingerUsageDistribution[finger] || 0) + usage;
          });
        }
      }

      // Calculate adaptation progress (simple metric based on accuracy and consistency)
      const adaptationProgress = Math.min(100, 
        (result.accuracy + (result.consistency || 0)) / 2
      );

      // Update practice time (rough estimate)
      const practiceTimeIncrease = state.startTime ? (Date.now() - state.startTime) / 1000 / 3600 : 0; // hours

      const updatedLayoutStats = {
        ...layoutStats,
        totalCharacters: newTotalCharacters,
        totalChords: newTotalChords,
        avgErgonomicScore: newAvgErgonomicScore,
        fingerUsageDistribution: newFingerUsageDistribution,
        bestWpmForLayout: Math.max(layoutStats.bestWpmForLayout, result.wpm || 0),
        bestAccuracyForLayout: Math.max(layoutStats.bestAccuracyForLayout, result.accuracy || 0),
        hoursOfPractice: layoutStats.hoursOfPractice + practiceTimeIncrease,
        adaptationProgress: Math.max(layoutStats.adaptationProgress || 0, adaptationProgress)
      };

      set((state) => {
        const newStats = {
          ...state.stats,
          layoutSpecificStats: {
            ...currentStats,
            [layoutType]: updatedLayoutStats
          }
        };
        return {
          stats: newStats,
          personalStats: newStats
        };
      });
    },

    getPersonalStats: () => {
      const state = get();
      return state.stats;
    },

    updateSpecializedProgress: () => {
      const state = get();
      const layoutSpecificStats = state.stats.layoutSpecificStats || {};
      
      // Update progress milestones
      const updatedMilestones = updateProgressMilestones(layoutSpecificStats);
      
      // Generate insights
      const insights = generateProgressInsights(layoutSpecificStats);
      
      // Calculate overall progress
      const overallProgress = calculateOverallProgress(layoutSpecificStats);
      
      set({
        progressMilestones: updatedMilestones,
        progressInsights: insights,
        overallProgress
      });
    },

    getProgressSummary: () => {
      const state = get();
      return {
        achievements: state.specializedAchievements,
        milestones: state.progressMilestones,
        insights: state.progressInsights,
        overallProgress: state.overallProgress,
        layoutStats: state.stats.layoutSpecificStats
      };
    }
  }))
);
