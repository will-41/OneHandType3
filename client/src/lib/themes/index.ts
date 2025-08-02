// ============================================================================
// ENHANCED THEME SYSTEM - Main Export Index
// Complete keyboard theming system with gamification and accessibility
// ============================================================================

// Type definitions
export * from './theme-system';

// Theme definitions and data
export * from './theme-definitions';
export { 
  allThemes,
  themesByCategory,
  getThemeById,
  getThemesByRarity,
  getThemesByTier,
  getUnlockedThemes,
  getCompatibleThemes
} from './theme-definitions';

// Unlock system and progression
export * from './theme-unlock-system';
export {
  unlockTiers,
  themeCollections,
  checkThemeUnlock,
  getUnlockableThemes,
  calculateTierProgress,
  updateThemeProfile,
  checkSpecialConditions,
  recommendThemes,
  updateCollectionProgress,
  getCompletedCollections,
  createDefaultThemeProfile,
  getThemePreviewData
} from './theme-unlock-system';

// CSS system and theme application
export * from './theme-css-system';
export {
  cssVariableMap,
  applyThemeToDocument,
  generateThemeCSS,
  generateCompleteThemeCSS,
  injectThemeCSS,
  removeThemeCSS,
  hexToRgb,
  rgbToHsl,
  adjustColorBrightness
} from './theme-css-system';

// Animation and interactive effects
export * from './theme-animations';
export {
  keyPressAnimations,
  typingStreakEffects,
  adaptiveThemeResponse,
  generateAnimationCSS,
  ThemeAnimationController,
  triggerKeyAnimation,
  updateTypingStats,
  triggerTypingError,
  streakEffectsCSS,
  initializeAnimationController,
  getAnimationController
} from './theme-animations';

// Accessibility validation and compliance
export * from './accessibility-validator';
export {
  getLuminance,
  getContrastRatio,
  checkContrast,
  simulateColorBlindness,
  testColorBlindFriendliness,
  validateThemeAccessibility,
  generateAccessibilityEnhancements,
  generateAccessibleVariant,
  runAccessibilityTestSuite
} from './accessibility-validator';

// ============================================================================
// THEME SYSTEM MANAGER - Main Class for Complete Theme Management
// ============================================================================

import type { 
  KeyboardTheme, 
  UserThemeProfile, 
  ThemeCustomization 
} from '../types/theme-system';
import { allThemes, getThemeById } from './theme-definitions';
import { 
  checkThemeUnlock, 
  updateThemeProfile, 
  createDefaultThemeProfile 
} from './theme-unlock-system';
import { 
  applyThemeToDocument, 
  generateCompleteThemeCSS, 
  injectThemeCSS 
} from './theme-css-system';
import { 
  initializeAnimationController, 
  ThemeAnimationController 
} from './theme-animations';
import { validateThemeAccessibility } from './accessibility-validator';

export class ThemeSystemManager {
  private userProfile: UserThemeProfile;
  private currentTheme: KeyboardTheme | null = null;
  private customization: ThemeCustomization;
  private animationController: ThemeAnimationController;
  private listeners: Array<(theme: KeyboardTheme) => void> = [];

  constructor(initialProfile?: UserThemeProfile) {
    this.userProfile = initialProfile || createDefaultThemeProfile();
    this.customization = {
      brightness: 100,
      saturation: 100,
      contrast: 100,
      animationSpeed: 1,
      particleIntensity: 100,
      forceHighContrast: false,
      disableAnimations: false,
      enlargeText: false
    };
    
    this.animationController = initializeAnimationController();
    this.loadSavedTheme();
  }

  // ============================================================================
  // THEME MANAGEMENT
  // ============================================================================

  public setTheme(themeId: string, applyImmediately: boolean = true): boolean {
    const theme = getThemeById(themeId);
    if (!theme) {
      console.warn(`Theme with ID "${themeId}" not found`);
      return false;
    }

    // Check if theme is unlocked
    if (!theme.isUnlocked && !this.isThemeUnlocked(theme)) {
      console.warn(`Theme "${theme.name}" is not unlocked`);
      return false;
    }

    this.currentTheme = theme;
    
    if (applyImmediately) {
      this.applyCurrentTheme();
    }

    // Update profile
    this.userProfile.currentTheme = themeId;
    this.saveProfile();

    // Notify listeners
    this.notifyThemeChange(theme);

    return true;
  }

  public getCurrentTheme(): KeyboardTheme | null {
    return this.currentTheme;
  }

  public applyCurrentTheme(): void {
    if (!this.currentTheme) return;

    // Generate and inject CSS
    const css = generateCompleteThemeCSS(this.currentTheme, this.customization);
    injectThemeCSS(css, 'theme-system-manager');

    // Apply to document
    applyThemeToDocument(this.currentTheme, this.customization);

    // Set animation type
    this.animationController.setAnimationType(this.currentTheme.id);
  }

  public previewTheme(themeId: string, duration: number = 3000): void {
    const theme = getThemeById(themeId);
    if (!theme) return;

    const originalTheme = this.currentTheme;
    
    // Apply preview theme
    const css = generateCompleteThemeCSS(theme, this.customization);
    injectThemeCSS(css, 'theme-preview');
    applyThemeToDocument(theme, this.customization);

    // Revert after duration
    setTimeout(() => {
      if (originalTheme) {
        this.applyCurrentTheme();
      }
      const previewStyle = document.getElementById('theme-preview');
      if (previewStyle) {
        previewStyle.remove();
      }
    }, duration);
  }

  // ============================================================================
  // CUSTOMIZATION
  // ============================================================================

  public updateCustomization(updates: Partial<ThemeCustomization>): void {
    this.customization = { ...this.customization, ...updates };
    
    if (this.currentTheme) {
      this.applyCurrentTheme();
    }
    
    this.saveCustomization();
  }

  public getCustomization(): ThemeCustomization {
    return { ...this.customization };
  }

  public resetCustomization(): void {
    this.customization = {
      brightness: 100,
      saturation: 100,
      contrast: 100,
      animationSpeed: 1,
      particleIntensity: 100,
      forceHighContrast: false,
      disableAnimations: false,
      enlargeText: false
    };
    
    if (this.currentTheme) {
      this.applyCurrentTheme();
    }
    
    this.saveCustomization();
  }

  // ============================================================================
  // UNLOCK SYSTEM
  // ============================================================================

  public updateUserStats(stats: any): void {
    const updatedProfile = updateThemeProfile(this.userProfile, stats);
    
    // Check for newly unlocked themes
    const newlyUnlocked = updatedProfile.unlockedThemes.filter(
      id => !this.userProfile.unlockedThemes.includes(id)
    );

    this.userProfile = updatedProfile;
    this.saveProfile();

    // Notify about new unlocks
    if (newlyUnlocked.length > 0) {
      this.notifyThemeUnlocks(newlyUnlocked);
    }
  }

  public isThemeUnlocked(theme: KeyboardTheme): boolean {
    return this.userProfile.unlockedThemes.includes(theme.id) || theme.isUnlocked;
  }

  public getUnlockedThemes(): KeyboardTheme[] {
    return allThemes.filter(theme => this.isThemeUnlocked(theme));
  }

  public getUserProfile(): UserThemeProfile {
    return { ...this.userProfile };
  }

  // ============================================================================
  // ACCESSIBILITY
  // ============================================================================

  public validateCurrentThemeAccessibility() {
    if (!this.currentTheme) return null;
    return validateThemeAccessibility(this.currentTheme);
  }

  public enableAccessibilityMode(): void {
    this.updateCustomization({
      forceHighContrast: true,
      disableAnimations: true,
      enlargeText: true
    });
  }

  public disableAccessibilityMode(): void {
    this.updateCustomization({
      forceHighContrast: false,
      disableAnimations: false,
      enlargeText: false
    });
  }

  // ============================================================================
  // EVENT HANDLING
  // ============================================================================

  public onThemeChange(callback: (theme: KeyboardTheme) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyThemeChange(theme: KeyboardTheme): void {
    this.listeners.forEach(callback => callback(theme));
  }

  private notifyThemeUnlocks(themeIds: string[]): void {
    // Emit custom event for theme unlocks
    const event = new CustomEvent('themes-unlocked', {
      detail: { themeIds, themes: themeIds.map(id => getThemeById(id)).filter(Boolean) }
    });
    document.dispatchEvent(event);
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  private saveProfile(): void {
    try {
      localStorage.setItem('theme-user-profile', JSON.stringify(this.userProfile));
    } catch (error) {
      console.warn('Failed to save theme profile:', error);
    }
  }

  private saveCustomization(): void {
    try {
      localStorage.setItem('theme-customization', JSON.stringify(this.customization));
    } catch (error) {
      console.warn('Failed to save theme customization:', error);
    }
  }

  private loadSavedTheme(): void {
    try {
      // Load profile
      const savedProfile = localStorage.getItem('theme-user-profile');
      if (savedProfile) {
        this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
      }

      // Load customization
      const savedCustomization = localStorage.getItem('theme-customization');
      if (savedCustomization) {
        this.customization = { ...this.customization, ...JSON.parse(savedCustomization) };
      }

      // Apply saved theme
      if (this.userProfile.currentTheme) {
        this.setTheme(this.userProfile.currentTheme);
      }
    } catch (error) {
      console.warn('Failed to load saved theme data:', error);
    }
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  public destroy(): void {
    this.animationController.destroy();
    this.listeners.length = 0;
    
    // Remove injected styles
    const style = document.getElementById('theme-system-manager');
    if (style) {
      style.remove();
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let themeSystemManager: ThemeSystemManager | null = null;

export function getThemeSystemManager(): ThemeSystemManager {
  if (!themeSystemManager) {
    themeSystemManager = new ThemeSystemManager();
  }
  return themeSystemManager;
}

export function initializeThemeSystem(initialProfile?: UserThemeProfile): ThemeSystemManager {
  if (themeSystemManager) {
    themeSystemManager.destroy();
  }
  
  themeSystemManager = new ThemeSystemManager(initialProfile);
  return themeSystemManager;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function createThemeFromTemplate(
  baseTheme: KeyboardTheme,
  overrides: Partial<KeyboardTheme>
): KeyboardTheme {
  return {
    ...baseTheme,
    ...overrides,
    id: overrides.id || `${baseTheme.id}-custom`,
    colors: { ...baseTheme.colors, ...overrides.colors },
    effects: { ...baseTheme.effects, ...overrides.effects },
    accessibility: { ...baseTheme.accessibility, ...overrides.accessibility }
  };
}

export function getThemesByKeywords(keywords: string[]): KeyboardTheme[] {
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  
  return allThemes.filter(theme => 
    lowerKeywords.some(keyword => 
      theme.name.toLowerCase().includes(keyword) ||
      theme.description.toLowerCase().includes(keyword) ||
      theme.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  );
}

export function getRandomTheme(
  category?: string,
  unlockedOnly: boolean = true
): KeyboardTheme | null {
  let themes = allThemes;
  
  if (category && category !== 'all') {
    themes = allThemes.filter(theme => theme.category === category);
  }
  
  if (unlockedOnly) {
    const manager = getThemeSystemManager();
    themes = themes.filter(theme => manager.isThemeUnlocked(theme));
  }
  
  if (themes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex];
}

// Export the theme system manager as default
export default getThemeSystemManager;