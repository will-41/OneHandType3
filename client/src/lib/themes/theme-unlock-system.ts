// ============================================================================
// THEME UNLOCK SYSTEM - Progression and Requirements Management
// ============================================================================

import type { 
  KeyboardTheme, 
  ThemeUnlockRequirements, 
  UserThemeProfile, 
  UnlockTier,
  ThemeCollection 
} from '../types/theme-system';
import { allThemes, getThemeById } from './theme-definitions';

// ============================================================================
// UNLOCK TIER DEFINITIONS
// ============================================================================

export const unlockTiers: Record<UnlockTier, {
  name: string;
  description: string;
  requirements: ThemeUnlockRequirements;
  rewards: {
    themesUnlocked: number;
    specialFeatures: string[];
  };
}> = {
  starter: {
    name: 'Novice Typist',
    description: 'Begin your typing journey with basic themes',
    requirements: {},
    rewards: {
      themesUnlocked: 5,
      specialFeatures: ['Basic color customization', 'Simple animations']
    }
  },
  intermediate: {
    name: 'Skilled Typist',
    description: 'Unlock more themes with consistent practice',
    requirements: {
      totalCharactersTyped: 10000,
      averageWPM: 25,
      practiceHours: 5,
      lessonsCompleted: 10
    },
    rewards: {
      themesUnlocked: 8,
      specialFeatures: ['Advanced animations', 'Gradient effects', 'Sound themes']
    }
  },
  advanced: {
    name: 'Expert Typist',
    description: 'Advanced themes for dedicated practitioners',
    requirements: {
      totalCharactersTyped: 50000,
      averageWPM: 40,
      averageAccuracy: 85,
      practiceHours: 20,
      lessonsCompleted: 25,
      consecutiveDays: 7
    },
    rewards: {
      themesUnlocked: 12,
      specialFeatures: ['Particle effects', 'Dynamic themes', 'Custom theme builder']
    }
  },
  expert: {
    name: 'Typing Master',
    description: 'Elite themes for exceptional typists',
    requirements: {
      totalCharactersTyped: 150000,
      averageWPM: 60,
      averageAccuracy: 92,
      practiceHours: 50,
      lessonsCompleted: 50,
      consecutiveDays: 14,
      perfectLessons: 10
    },
    rewards: {
      themesUnlocked: 18,
      specialFeatures: ['RGB themes', 'Layout-specific themes', 'Achievement themes']
    }
  },
  master: {
    name: 'Legendary Typist',
    description: 'Ultimate themes for the most dedicated masters',
    requirements: {
      totalCharactersTyped: 500000,
      averageWPM: 80,
      averageAccuracy: 97,
      practiceHours: 150,
      lessonsCompleted: 100,
      consecutiveDays: 30,
      perfectLessons: 50
    },
    rewards: {
      themesUnlocked: 25,
      specialFeatures: ['Mythic themes', 'Custom effects', 'Exclusive layouts', 'Theme sharing']
    }
  }
};

// ============================================================================
// THEME COLLECTIONS
// ============================================================================

export const themeCollections: ThemeCollection[] = [
  {
    id: 'accessibility-champion',
    name: 'Accessibility Champion',
    description: 'Master all accessibility-focused themes',
    themes: ['high-contrast-classic', 'deuteranopia-friendly', 'large-text-comfort'],
    unlockRequirement: {
      totalCharactersTyped: 25000,
      averageAccuracy: 85
    },
    rewards: {
      themes: ['accessibility-master-badge'],
      achievements: ['accessibility-advocate'],
      customizationOptions: ['voice-navigation', 'screen-reader-optimization']
    },
    isCompleted: false,
    progress: 0
  },
  {
    id: 'gaming-elite',
    name: 'Gaming Elite',
    description: 'Unlock the ultimate gaming theme collection',
    themes: ['cyberpunk-neon', 'retro-synthwave', 'gaming-rgb-rainbow', 'matrix-green'],
    unlockRequirement: {
      averageWPM: 55,
      practiceHours: 30,
      specialCondition: 'speed_demon'
    },
    rewards: {
      themes: ['gaming-god-tier'],
      achievements: ['rgb-master', 'speed-demon'],
      customizationOptions: ['custom-rgb-patterns', 'gaming-macros']
    },
    isCompleted: false,
    progress: 0
  },
  {
    id: 'layout-specialist',
    name: 'Layout Specialist',
    description: 'Master specialized keyboard layouts',
    themes: ['maltron-master'],
    unlockRequirement: {
      layoutMastery: {
        layout: 'maltron',
        proficiencyLevel: 80
      },
      averageWPM: 45,
      practiceHours: 40
    },
    rewards: {
      themes: ['dvorak-ace', 'artsey-virtuoso'],
      achievements: ['layout-master'],
      customizationOptions: ['layout-specific-animations']
    },
    isCompleted: false,
    progress: 0
  },
  {
    id: 'seasonal-collector',
    name: 'Seasonal Collector',
    description: 'Collect limited-time seasonal themes',
    themes: ['cherry-blossom'],
    unlockRequirement: {
      consecutiveDays: 30,
      practiceHours: 25
    },
    rewards: {
      themes: ['autumn-leaves', 'winter-frost', 'summer-vibes'],
      achievements: ['seasonal-master'],
      customizationOptions: ['seasonal-effects']
    },
    isCompleted: false,
    progress: 0
  }
];

// ============================================================================
// UNLOCK CHECKING FUNCTIONS
// ============================================================================

export interface UserStats {
  totalCharactersTyped: number;
  averageWPM: number;
  averageAccuracy: number;
  practiceHours: number;
  lessonsCompleted: number;
  consecutiveDays: number;
  perfectLessons: number;
  layoutMastery: Record<string, number>;
  specialConditions: string[];
  achievements: string[];
}

export function checkThemeUnlock(
  theme: KeyboardTheme, 
  userStats: UserStats
): boolean {
  const req = theme.unlockRequirements;
  
  // Check basic requirements
  if (req.totalCharactersTyped && userStats.totalCharactersTyped < req.totalCharactersTyped) {
    return false;
  }
  
  if (req.averageWPM && userStats.averageWPM < req.averageWPM) {
    return false;
  }
  
  if (req.averageAccuracy && userStats.averageAccuracy < req.averageAccuracy) {
    return false;
  }
  
  if (req.practiceHours && userStats.practiceHours < req.practiceHours) {
    return false;
  }
  
  if (req.lessonsCompleted && userStats.lessonsCompleted < req.lessonsCompleted) {
    return false;
  }
  
  if (req.consecutiveDays && userStats.consecutiveDays < req.consecutiveDays) {
    return false;
  }
  
  if (req.perfectLessons && userStats.perfectLessons < req.perfectLessons) {
    return false;
  }
  
  // Check layout mastery
  if (req.layoutMastery) {
    const masteryLevel = userStats.layoutMastery[req.layoutMastery.layout] || 0;
    if (masteryLevel < req.layoutMastery.proficiencyLevel) {
      return false;
    }
  }
  
  // Check required achievements
  if (req.requiredAchievements) {
    for (const achievement of req.requiredAchievements) {
      if (!userStats.achievements.includes(achievement)) {
        return false;
      }
    }
  }
  
  // Check special conditions
  if (req.specialCondition && !userStats.specialConditions.includes(req.specialCondition)) {
    return false;
  }
  
  return true;
}

export function getUnlockableThemes(userStats: UserStats): KeyboardTheme[] {
  return allThemes.filter(theme => 
    !theme.isUnlocked && checkThemeUnlock(theme, userStats)
  );
}

export function calculateTierProgress(
  currentTier: UnlockTier, 
  userStats: UserStats
): { progress: number; nextTier: UnlockTier | null } {
  const tierOrder: UnlockTier[] = ['starter', 'intermediate', 'advanced', 'expert', 'master'];
  const currentIndex = tierOrder.indexOf(currentTier);
  const nextTier = currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
  
  if (!nextTier) {
    return { progress: 100, nextTier: null };
  }
  
  const nextTierReq = unlockTiers[nextTier].requirements;
  let totalRequirements = 0;
  let metRequirements = 0;
  
  // Calculate progress based on requirements
  const requirements = [
    { key: 'totalCharactersTyped', current: userStats.totalCharactersTyped, required: nextTierReq.totalCharactersTyped },
    { key: 'averageWPM', current: userStats.averageWPM, required: nextTierReq.averageWPM },
    { key: 'averageAccuracy', current: userStats.averageAccuracy, required: nextTierReq.averageAccuracy },
    { key: 'practiceHours', current: userStats.practiceHours, required: nextTierReq.practiceHours },
    { key: 'lessonsCompleted', current: userStats.lessonsCompleted, required: nextTierReq.lessonsCompleted },
    { key: 'consecutiveDays', current: userStats.consecutiveDays, required: nextTierReq.consecutiveDays },
    { key: 'perfectLessons', current: userStats.perfectLessons, required: nextTierReq.perfectLessons }
  ];
  
  for (const req of requirements) {
    if (req.required) {
      totalRequirements++;
      if (req.current >= req.required) {
        metRequirements++;
      }
    }
  }
  
  const progress = totalRequirements > 0 ? (metRequirements / totalRequirements) * 100 : 100;
  return { progress: Math.min(progress, 100), nextTier };
}

export function updateThemeProfile(
  profile: UserThemeProfile, 
  userStats: UserStats
): UserThemeProfile {
  // Check for newly unlocked themes
  const newlyUnlocked = getUnlockableThemes(userStats);
  const newUnlockIds = newlyUnlocked.map(theme => theme.id);
  
  // Calculate tier progress
  const { progress, nextTier } = calculateTierProgress(profile.currentTier, userStats);
  
  // Update tier if requirements are met
  let currentTier = profile.currentTier;
  if (nextTier && progress >= 100) {
    currentTier = nextTier;
  }
  
  return {
    ...profile,
    unlockedThemes: [...new Set([...profile.unlockedThemes, ...newUnlockIds])],
    currentTier,
    nextTierProgress: nextTier ? progress : 100
  };
}

// ============================================================================
// SPECIAL CONDITIONS CHECKING
// ============================================================================

export function checkSpecialConditions(userStats: UserStats): string[] {
  const conditions: string[] = [];
  
  // Speed Demon: Average WPM over 70
  if (userStats.averageWPM >= 70) {
    conditions.push('speed_demon');
  }
  
  // Perfectionist: Average accuracy over 98%
  if (userStats.averageAccuracy >= 98) {
    conditions.push('perfectionist');
  }
  
  // Weekend Warrior: High practice on weekends (would need additional tracking)
  // Night Owl: High practice during night hours (would need additional tracking)
  
  return conditions;
}

// ============================================================================
// THEME RECOMMENDATION ENGINE
// ============================================================================

export function recommendThemes(
  userStats: UserStats,
  currentTheme: string,
  recentlyUsed: string[]
): KeyboardTheme[] {
  const unlockedThemes = allThemes.filter(theme => 
    theme.isUnlocked || checkThemeUnlock(theme, userStats)
  );
  
  // Filter out current and recently used themes
  const availableThemes = unlockedThemes.filter(theme => 
    theme.id !== currentTheme && !recentlyUsed.includes(theme.id)
  );
  
  // Sort by popularity and user preferences
  return availableThemes
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);
}

// ============================================================================
// THEME COLLECTIONS MANAGEMENT
// ============================================================================

export function updateCollectionProgress(
  collections: ThemeCollection[],
  unlockedThemes: string[]
): ThemeCollection[] {
  return collections.map(collection => {
    const unlockedInCollection = collection.themes.filter(themeId => 
      unlockedThemes.includes(themeId)
    ).length;
    
    const progress = (unlockedInCollection / collection.themes.length) * 100;
    const isCompleted = progress >= 100;
    
    return {
      ...collection,
      progress,
      isCompleted
    };
  });
}

export function getCompletedCollections(collections: ThemeCollection[]): ThemeCollection[] {
  return collections.filter(collection => collection.isCompleted);
}

// ============================================================================
// EXPORT DEFAULT PROFILE
// ============================================================================

export const createDefaultThemeProfile = (): UserThemeProfile => ({
  unlockedThemes: ['high-contrast-classic', 'large-text-comfort', 'corporate-blue'],
  favoriteThemes: [],
  currentTheme: 'high-contrast-classic',
  customizations: {},
  stats: {},
  currentTier: 'starter',
  nextTierProgress: 0,
  themeAchievements: [],
  collectionCompleteness: 0
});

// Helper function to get theme preview data
export function getThemePreviewData(themeId: string) {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    category: theme.category,
    rarity: theme.rarity,
    colorPalette: theme.colorPalette,
    thumbnail: theme.thumbnail,
    isUnlocked: theme.isUnlocked,
    accessibility: theme.accessibility
  };
}