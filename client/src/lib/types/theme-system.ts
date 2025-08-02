// ============================================================================
// ENHANCED THEMING SYSTEM - Type Definitions
// ============================================================================

export type ThemeCategory = 'accessibility' | 'gaming' | 'professional' | 'creative' | 'achievement';
export type ThemeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type UnlockTier = 'starter' | 'intermediate' | 'advanced' | 'expert' | 'master';
export type LayoutSpecific = 'maltron' | 'dvorak' | 'artsey' | 'universal';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  accent: string;
  
  // Background colors
  background: string;
  surface: string;
  surfaceHover: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // State colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Keyboard specific colors
  keyDefault: string;
  keyHover: string;
  keyPressed: string;
  keyHighlighted: string;
  keyError: string;
  keySuccess: string;
  
  // Finger guide colors
  fingerPinky: string;
  fingerRing: string;
  fingerMiddle: string;
  fingerIndex: string;
  fingerThumb: string;
  
  // Interactive elements
  border: string;
  borderFocus: string;
  shadow: string;
  overlay: string;
}

export interface ThemeEffects {
  // Visual effects
  glassEffect: boolean;
  gradients: boolean;
  shadows: boolean;
  animations: boolean;
  particles: boolean;
  rippleEffect: boolean;
  
  // Animation properties
  transitionDuration: number;
  easingFunction: string;
  pulseIntensity: number;
  glowIntensity: number;
  
  // Particle effects
  particleCount: number;
  particleColors: string[];
  particleSpeed: number;
}

export interface ThemeAccessibility {
  wcagLevel: 'AA' | 'AAA';
  contrastRatio: number;
  colorBlindFriendly: boolean;
  supportedColorBlindTypes: ('deuteranopia' | 'protanopia' | 'tritanopia' | 'monochromacy')[];
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  voiceOverOptimized: boolean;
}

export interface ThemeUnlockRequirements {
  // Progress requirements
  totalCharactersTyped?: number;
  averageWPM?: number;
  averageAccuracy?: number;
  lessonsCompleted?: number;
  practiceHours?: number;
  
  // Layout specific requirements
  layoutMastery?: {
    layout: LayoutSpecific;
    proficiencyLevel: number; // 1-100
  };
  
  // Achievement requirements
  requiredAchievements?: string[];
  
  // Streak requirements
  consecutiveDays?: number;
  perfectLessons?: number;
  
  // Special conditions
  specialCondition?: 'weekend_warrior' | 'night_owl' | 'speed_demon' | 'perfectionist';
}

export interface KeyboardTheme {
  // Basic info
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  rarity: ThemeRarity;
  unlockTier: UnlockTier;
  
  // Visual design
  colors: ThemeColors;
  effects: ThemeEffects;
  accessibility: ThemeAccessibility;
  
  // Unlock system
  unlockRequirements: ThemeUnlockRequirements;
  isUnlocked: boolean;
  isNew: boolean;
  dateUnlocked?: Date;
  
  // Layout compatibility
  compatibleLayouts: LayoutSpecific[];
  optimizedFor?: LayoutSpecific;
  
  // Metadata
  author?: string;
  version: string;
  tags: string[];
  popularity: number; // 1-100
  
  // Preview assets
  previewImage?: string;
  thumbnail: string;
  colorPalette: string[]; // For quick preview
  
  // Seasonal/Limited
  isLimitedTime?: boolean;
  availableUntil?: Date;
  isSeasonal?: boolean;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface ThemeCustomization {
  // User overrides
  customColors?: Partial<ThemeColors>;
  customEffects?: Partial<ThemeEffects>;
  
  // Personal settings
  brightness: number; // 0-100
  saturation: number; // 0-100
  contrast: number; // 0-100
  
  // Animation preferences
  animationSpeed: number; // 0.5-2.0
  particleIntensity: number; // 0-100
  
  // Accessibility overrides
  forceHighContrast: boolean;
  disableAnimations: boolean;
  enlargeText: boolean;
}

export interface ThemeStats {
  timesUsed: number;
  totalTimeUsed: number; // in minutes
  avgWPMWithTheme: number;
  avgAccuracyWithTheme: number;
  favoriteKeyboardLayout: LayoutSpecific;
  lastUsed: Date;
}

export interface UserThemeProfile {
  unlockedThemes: string[];
  favoriteThemes: string[];
  currentTheme: string;
  customizations: Record<string, ThemeCustomization>;
  stats: Record<string, ThemeStats>;
  
  // Progression
  currentTier: UnlockTier;
  nextTierProgress: number; // 0-100
  
  // Achievements
  themeAchievements: string[];
  collectionCompleteness: number; // 0-100
}

export interface ThemeCollection {
  id: string;
  name: string;
  description: string;
  themes: string[]; // theme IDs
  unlockRequirement: ThemeUnlockRequirements;
  rewards: {
    themes?: string[];
    achievements?: string[];
    customizationOptions?: string[];
  };
  isCompleted: boolean;
  progress: number; // 0-100
}

// Animation and effect types
export interface KeyPressAnimation {
  type: 'ripple' | 'pulse' | 'glow' | 'particle' | 'wave' | 'spark';
  duration: number;
  intensity: number;
  colors: string[];
  particleCount?: number;
}

export interface TypingStreakEffect {
  minStreak: number;
  effectType: 'color_shift' | 'intensity_boost' | 'particle_trail' | 'glow_increase';
  maxIntensity: number;
  colors: string[];
}

export interface AdaptiveThemeResponse {
  accuracyBoost: {
    threshold: number; // accuracy percentage
    effect: 'success_glow' | 'green_tint' | 'sparkle';
    intensity: number;
  };
  errorResponse: {
    effect: 'red_flash' | 'shake' | 'fade' | 'warning_glow';
    duration: number;
    recovery: 'gradual_fade' | 'snap_back';
  };
  speedResponse: {
    wpmThresholds: Array<{
      wpm: number;
      effect: 'speed_lines' | 'color_shift' | 'particle_increase';
      intensity: number;
    }>;
  };
}

// Export utility type for theme creation
export type CreateThemeInput = Omit<KeyboardTheme, 'id' | 'isUnlocked' | 'isNew' | 'dateUnlocked' | 'popularity'>;