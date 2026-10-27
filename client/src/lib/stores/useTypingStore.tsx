import { create } from "zustand";
import type { CustomKeyboardLayout, LayoutId } from '../customLayouts';
import { subscribeWithSelector, persist, createJSONStorage } from "zustand/middleware";
import type { Lesson } from "../lessons";
import { findCurriculumLesson } from "../gamifiedCurriculum";
import { CHECKPOINT_XP, STRENGTHEN_ID, STRENGTHEN_XP, isCheckpointId, type KeyStats } from "../generatedLessons";
import { addPractice, computeRhythm, localDateKey, type DailyGoal, type PracticeLog } from "../rhythm";
import { evaluateAchievements, type RecentResult } from "../achievements";
import type { InternationalLayout, SpecializedLayoutType } from "../../lib/keyboardLayouts";
import { 
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

export interface KeyStat {
  hits: number;
  misses: number;
}

export interface LessonResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeMs: number;
  /** Per expected character hits/misses for this run (drives weak-key practice). */
  keyStats?: Record<string, KeyStat>;
}

export interface LessonProgressEntry {
  bestWpm: number;
  bestAccuracy: number;
  bestTimeMs: number;
  fewestErrors: number;
  completions: number;
  lastWpm: number;
  lastAccuracy: number;
  lastErrors: number;
  lastTimeMs: number;
  lastCompletedAt: number;
}

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
  
  // Gamification
  xp: number;
  level: number;
  customLayouts: CustomKeyboardLayout[];
  
  // Missing properties needed by components
  currentWpm: number;
  currentStreak: number;
  timeElapsed: number;
  
  // New settings actions
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
  keyboardLayout: LayoutId;
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
  /** Unlock time (ms since epoch) per achievement id. */
  achievementDates: Record<string, number>;
  /** Last 20 finished runs, newest last (drives accuracy/pace achievements). */
  recentResults: RecentResult[];
  /** True once the intro tour was finished or skipped. */
  onboardingComplete: boolean;
  /** Lifetime per-key hits/misses (recent-weighted: halved past 500 samples). */
  keyStats: KeyStats;
  /** Practice minutes per local date ('YYYY-MM-DD'), most recent 400 days. */
  practiceLog: PracticeLog;
  /** Daily goal in minutes; 0 = off. */
  dailyGoalMinutes: DailyGoal;
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
  lessonProgress: Record<string, LessonProgressEntry>;
  currentProgress: {
    lessonId: string;
    position: number;
    wpm: number;
    accuracy: number;
  } | null;
  customLessons: Lesson[];
  
  // Actions
  completeLesson: (lessonId: string, result: LessonResult) => void;
  setOnboardingComplete: (done: boolean) => void;
  setDailyGoalMinutes: (minutes: DailyGoal) => void;
  setHandPreference: (hand: HandPreference) => void;
  setCustomLayouts: (layouts: CustomKeyboardLayout[]) => void;
  saveCustomLayout: (layout: CustomKeyboardLayout) => void;
  deleteCustomLayout: (id: CustomKeyboardLayout['id']) => void;
  setCurrentLesson: (lesson: Lesson) => void;
  setGameState: (state: GameState) => void;
  setShowTutorial: (show: boolean) => void;
  toggleHandPreference: () => void;
  toggleThemeMode: () => void;
  setViewMode: (mode: ViewMode) => void;
  setKeyboardLayout: (layout: LayoutId) => void;
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
  updateLayoutSpecificStats: (layoutType: LayoutId, result: any) => void;
  getPersonalStats: () => TypingStats;
  updateSpecializedProgress: () => void;
  getProgressSummary: () => any;
}

const STORE_NAME = "onehandtype-store";
const STORE_VERSION = 2;

/** Level curve: level N needs 100 * (N-1)^2 total XP. */
export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

const KEY_SAMPLE_CAP = 500;

/** Merge a run's per-key tallies; halve both counts past the cap so recent practice weighs more. */
function mergeKeyStats(base: KeyStats, run: Record<string, KeyStat> | undefined): KeyStats {
  if (!run) return base;
  const next: KeyStats = { ...base };
  for (const [key, s] of Object.entries(run)) {
    const prev = next[key] ?? { hits: 0, misses: 0 };
    let hits = prev.hits + Math.max(0, s.hits);
    let misses = prev.misses + Math.max(0, s.misses);
    if (hits + misses > KEY_SAMPLE_CAP) {
      hits = Math.floor(hits / 2);
      misses = Math.floor(misses / 2);
    }
    next[key] = { hits, misses };
  }
  return next;
}

/** v1 -> v2: realm achievements became unit achievements; new fields get defaults. */
export function migrateStore(persistedState: unknown, version: number): Partial<TypingState> {
  const s = (persistedState ?? {}) as Partial<TypingState>;
  if (version < 2) {
    const mapId = (id: string) => id.replace(/^realm-(\d+)$/, 'unit-$1');
    const unlocked = Array.isArray(s.unlockedAchievements) ? s.unlockedAchievements.map(mapId) : [];
    const dates = Object.fromEntries(Object.entries(s.achievementDates ?? {}).map(([k, v]) => [mapId(k), v]));
    return {
      ...s,
      unlockedAchievements: [...new Set(unlocked)],
      achievementDates: dates,
      keyStats: s.keyStats ?? {},
      practiceLog: s.practiceLog ?? {},
      dailyGoalMinutes: s.dailyGoalMinutes ?? 10,
    };
  }
  return s;
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
  hapticFeedback: true,
  
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
  subscribeWithSelector(
  persist((set, get) => ({
    // Initial state
    gameState: "ready",
    handPreference: "right",
    showTutorial: false,
    viewMode: "portrait",
    themeMode: "dark",
    keyboardLayout: "qwerty",
    selectedColorTheme: 0,
    
    xp: 0,
    level: 1,
    customLayouts: [],
    
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
    achievementDates: {},
    recentResults: [],
    onboardingComplete: false,
    keyStats: {},
    practiceLog: {},
    dailyGoalMinutes: 10,
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
    
    // Actions
    setCurrentLesson: (lesson: Lesson | null) => {
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
        soundEnabled: enabled,
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
        reduceMotion: reduced
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
    
    setCustomLayouts: (layouts) => set({ customLayouts: layouts }),
    saveCustomLayout: (layout) => set((state) => {
      const exists = state.customLayouts.some((l) => l.id === layout.id);
      return {
        customLayouts: exists
          ? state.customLayouts.map((l) => (l.id === layout.id ? layout : l))
          : [...state.customLayouts, layout],
      };
    }),
    deleteCustomLayout: (id) => set((state) => ({
      customLayouts: state.customLayouts.filter((l) => l.id !== id),
      // If the active layout is deleted, fall back to QWERTY.
      keyboardLayout: state.keyboardLayout === id ? 'qwerty' : state.keyboardLayout,
    })),

    completeLesson: (lessonId, result) => {
      const state = get();
      const wpm = Math.max(0, Math.round(result.wpm));
      const accuracy = Math.min(100, Math.max(0, Math.round(result.accuracy)));
      const errors = Math.max(0, Math.round(result.errors));
      const timeMs = Math.max(0, Math.round(result.timeMs));
      const timeMin = timeMs / 60000;
      const alreadyCompleted = state.completedLessons.includes(lessonId);

      // Per-lesson best
      const prev = state.lessonProgress[lessonId];
      const entry: LessonProgressEntry = {
        bestWpm: Math.max(prev?.bestWpm ?? 0, wpm),
        bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
        bestTimeMs: prev && prev.bestTimeMs > 0 ? Math.min(prev.bestTimeMs, timeMs || prev.bestTimeMs) : timeMs,
        fewestErrors: prev ? Math.min(prev.fewestErrors, errors) : errors,
        completions: (prev?.completions ?? 0) + 1,
        lastWpm: wpm,
        lastAccuracy: accuracy,
        lastErrors: errors,
        lastTimeMs: timeMs,
        lastCompletedAt: Date.now()
      };

      // Aggregate stats (totalTimeTyped is in minutes)
      const prevLesson = state.stats.lessons[lessonId];
      const charsTyped = Math.max(1, Math.round(wpm * 5 * timeMin));
      const newStats: TypingStats = {
        ...state.stats,
        totalCharactersTyped: state.stats.totalCharactersTyped + charsTyped,
        totalErrors: state.stats.totalErrors + errors,
        totalTimeTyped: state.stats.totalTimeTyped + timeMin,
        bestWpm: Math.max(state.stats.bestWpm, wpm),
        bestAccuracy: Math.max(state.stats.bestAccuracy, accuracy),
        lessons: {
          ...state.stats.lessons,
          [lessonId]: {
            attempts: (prevLesson?.attempts ?? 0) + 1,
            completedCount: (prevLesson?.completedCount ?? 0) + 1,
            bestWpm: Math.max(prevLesson?.bestWpm ?? 0, wpm),
            bestAccuracy: Math.max(prevLesson?.bestAccuracy ?? 0, accuracy),
            totalTime: (prevLesson?.totalTime ?? 0) + timeMin
          }
        }
      };

      // XP: curriculum reward when defined, otherwise a formula
      const baseXp = findCurriculumLesson(lessonId)?.lesson.rewards.xp
        ?? (isCheckpointId(lessonId) ? CHECKPOINT_XP : lessonId === STRENGTHEN_ID ? STRENGTHEN_XP : undefined)
        ?? 10 + Math.round((state.currentLesson?.id === lessonId ? state.currentLesson.difficulty : 1) * 5);
      const performanceBonus = Math.floor(wpm / 2) + (accuracy >= 100 ? 10 : accuracy >= 95 ? 5 : 0);
      const earnedXp = (alreadyCompleted ? Math.floor(baseXp / 4) : baseXp) + performanceBonus;
      const newXp = state.xp + earnedXp;

      set({
        completedLessons: alreadyCompleted ? state.completedLessons : [...state.completedLessons, lessonId],
        lessonProgress: { ...state.lessonProgress, [lessonId]: entry },
        stats: newStats,
        personalStats: newStats,
        xp: newXp,
        level: levelFromXp(newXp),
        keyStats: mergeKeyStats(state.keyStats, result.keyStats),
        practiceLog: addPractice(state.practiceLog, localDateKey(), timeMin),
        wpm,
        accuracy,
        currentWpm: wpm
      });

      // Achievements (paced: see lib/achievements.ts)
      const afterStats = get();
      const recentResults: RecentResult[] = [...afterStats.recentResults, { lessonId, wpm, accuracy }].slice(-20);
      const newIds = evaluateAchievements(
        {
          completedLessons: afterStats.completedLessons,
          totalMinutes: afterStats.stats.totalTimeTyped,
          lessonCompletions: Object.fromEntries(
            Object.entries(afterStats.lessonProgress).map(([id, e]) => [id, e.completions])
          ),
          recent: recentResults,
          keyboardLayout: afterStats.keyboardLayout,
          customLayoutIds: afterStats.customLayouts.map((l) => l.id),
          lessonProgress: afterStats.lessonProgress,
          rhythm: computeRhythm(afterStats.practiceLog, afterStats.dailyGoalMinutes),
        },
        afterStats.unlockedAchievements
      );
      const now = Date.now();
      set((prevState) => ({
        recentResults,
        unlockedAchievements: [...prevState.unlockedAchievements, ...newIds],
        achievementDates: {
          ...prevState.achievementDates,
          ...Object.fromEntries(newIds.map((id) => [id, now]))
        }
      }));
      get().updateSpecializedProgress();
    },

    setOnboardingComplete: (done) => set({ onboardingComplete: done }),
    setDailyGoalMinutes: (minutes) => set({ dailyGoalMinutes: minutes }),

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
  }),
  {
    name: STORE_NAME,
    version: STORE_VERSION,
    storage: createJSONStorage(() => localStorage),
    // Persist only durable user data; transient game/session state is excluded.
    partialize: (state) => ({
      handPreference: state.handPreference,
      themeMode: state.themeMode,
      keyboardLayout: state.keyboardLayout,
      selectedColorTheme: state.selectedColorTheme,
      accessibilitySettings: state.accessibilitySettings,
      stats: state.stats,
      completedLessons: state.completedLessons,
      lessonProgress: state.lessonProgress,
      xp: state.xp,
      level: state.level,
      unlockedAchievements: state.unlockedAchievements,
      achievementDates: state.achievementDates,
      recentResults: state.recentResults,
      onboardingComplete: state.onboardingComplete,
      customLessons: state.customLessons,
      customLayouts: state.customLayouts,
      keyStats: state.keyStats,
      practiceLog: state.practiceLog,
      dailyGoalMinutes: state.dailyGoalMinutes
    }),
    migrate: (persistedState, version) => migrateStore(persistedState, version),
    // Rebuild derived/non-serializable state (achievement objects hold functions)
    merge: (persistedState, currentState) => {
      const persisted = (persistedState ?? {}) as Partial<TypingState>;
      const stats: TypingStats = { ...defaultStats, ...(persisted.stats ?? {}) };
      const layoutStats = stats.layoutSpecificStats || {};
      return {
        ...currentState,
        ...persisted,
        stats,
        personalStats: stats,
        accessibilitySettings: {
          ...defaultAccessibilitySettings,
          ...(persisted.accessibilitySettings ?? {})
        },
        keyStats: { ...(persisted.keyStats ?? {}) },
        practiceLog: { ...(persisted.practiceLog ?? {}) },
        dailyGoalMinutes: persisted.dailyGoalMinutes ?? 10,
        specializedAchievements: [],
        progressMilestones: updateProgressMilestones(layoutStats),
        progressInsights: generateProgressInsights(layoutStats),
        overallProgress: calculateOverallProgress(layoutStats)
      };
    }
  }
  ))
);
