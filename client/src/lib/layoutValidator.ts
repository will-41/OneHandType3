import { 
  type InternationalLayout, 
  type SpecializedLayoutType,
  type KeyboardLayout,
  isSpecializedLayout,
  getKeyboardLayout,
  availableLayouts
} from './keyboardLayouts';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface LayoutCompatibility {
  supportsPhysicalKeyboard: boolean;
  requiresVirtualKeyboard: boolean;
  supportsHandPreference: boolean;
  requiresChordInput: boolean;
  hasErgonomicBenefits: boolean;
  learningCurveLevel: 'easy' | 'moderate' | 'challenging';
}

/**
 * Validates if a layout is compatible with the current system and user preferences
 */
export function validateLayoutCompatibility(
  layoutType: InternationalLayout | SpecializedLayoutType,
  handPreference: 'left' | 'right',
  userCapabilities?: {
    hasPhysicalKeyboard?: boolean;
    supportsChordInput?: boolean;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  }
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Check if layout exists
  const layoutExists = availableLayouts.some(layout => layout.id === layoutType);
  if (!layoutExists) {
    result.isValid = false;
    result.errors.push(`Layout "${layoutType}" is not available`);
    return result;
  }

  const layoutInfo = availableLayouts.find(layout => layout.id === layoutType);
  if (!layoutInfo) {
    result.isValid = false;
    result.errors.push(`Could not find information for layout "${layoutType}"`);
    return result;
  }

  // Validate hand preference compatibility
  if (layoutInfo.handPreference && layoutInfo.handPreference !== 'both' && layoutInfo.handPreference !== handPreference) {
    result.warnings.push(`Layout "${layoutInfo.name}" is optimized for ${layoutInfo.handPreference} hand, but you selected ${handPreference} hand`);
    result.suggestions.push(`Consider switching to ${layoutInfo.handPreference} hand preference for optimal performance`);
  }

  // Check for specialized layout requirements
  if (isSpecializedLayout(layoutType)) {
    // ARTSEY specific validations
    if (layoutType === 'artsey') {
      result.warnings.push('ARTSEY requires learning chord combinations - expect a significant learning curve');
      
      if (userCapabilities?.experienceLevel === 'beginner') {
        result.warnings.push('ARTSEY may be challenging for beginners - consider starting with Maltron or Dvorak One-Hand');
        result.suggestions.push('Practice with standard one-hand layouts first before attempting ARTSEY');
      }

      if (userCapabilities?.hasPhysicalKeyboard === false) {
        result.suggestions.push('ARTSEY works best with the virtual keyboard for visual chord feedback');
      }

      if (!userCapabilities?.supportsChordInput) {
        result.warnings.push('Your system may not support simultaneous key presses required for ARTSEY chords');
      }
    }

    // Maltron and Dvorak One-Hand validations
    if (layoutType === 'maltron' || layoutType === 'dvorak-one-hand') {
      if (userCapabilities?.experienceLevel === 'beginner') {
        result.suggestions.push(`${layoutInfo.name} is excellent for ergonomic typing but requires adaptation time`);
      }
    }

    // General specialized layout suggestions
    result.suggestions.push('Enable finger guide and virtual keyboard for easier learning');
    result.suggestions.push('Start with short practice sessions to build muscle memory');
  }

  // Validate keyboard layout can be loaded
  try {
    getKeyboardLayout(handPreference, layoutType);
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to load keyboard layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Gets compatibility information for a layout
 */
export function getLayoutCompatibility(layoutType: InternationalLayout | SpecializedLayoutType): LayoutCompatibility {
  const layoutInfo = availableLayouts.find(layout => layout.id === layoutType);
  
  return {
    supportsPhysicalKeyboard: layoutType !== 'artsey', // ARTSEY works better with virtual keyboard
    requiresVirtualKeyboard: layoutType === 'artsey',
    supportsHandPreference: true,
    requiresChordInput: layoutType === 'artsey',
    hasErgonomicBenefits: isSpecializedLayout(layoutType),
    learningCurveLevel: isSpecializedLayout(layoutType) 
      ? (layoutType === 'artsey' ? 'challenging' : 'moderate')
      : 'easy'
  };
}

/**
 * Suggests the best layout for a user based on their preferences and capabilities
 */
export function suggestOptimalLayout(
  handPreference: 'left' | 'right',
  userGoals: {
    primaryGoal: 'speed' | 'ergonomics' | 'accessibility' | 'learning';
    hasPhysicalDisability?: boolean;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    currentWpm?: number;
  }
): {
  recommended: InternationalLayout | SpecializedLayoutType;
  alternatives: (InternationalLayout | SpecializedLayoutType)[];
  reasoning: string;
} {
  // For accessibility needs
  if (userGoals.hasPhysicalDisability || userGoals.primaryGoal === 'accessibility') {
    return {
      recommended: 'artsey',
      alternatives: ['maltron', 'dvorak-one-hand'],
      reasoning: 'ARTSEY is designed for maximum accessibility with minimal hand movement. Maltron and Dvorak One-Hand are excellent alternatives for less severe limitations.'
    };
  }

  // For ergonomics
  if (userGoals.primaryGoal === 'ergonomics') {
    return {
      recommended: 'maltron',
      alternatives: ['dvorak-one-hand', 'dvorak'],
      reasoning: 'Maltron is scientifically designed to reduce strain and optimize finger usage patterns.'
    };
  }

  // For beginners learning one-hand typing
  if (userGoals.experienceLevel === 'beginner' && userGoals.primaryGoal === 'learning') {
    return {
      recommended: 'dvorak-one-hand',
      alternatives: ['qwerty', 'maltron'],
      reasoning: 'Dvorak One-Hand provides good efficiency while being easier to learn than more specialized layouts.'
    };
  }

  // For speed optimization
  if (userGoals.primaryGoal === 'speed' && userGoals.experienceLevel === 'advanced') {
    return {
      recommended: 'maltron',
      alternatives: ['dvorak-one-hand', 'colemak'],
      reasoning: 'Maltron offers the best potential for high-speed one-hand typing once mastered.'
    };
  }

  // Default recommendation
  return {
    recommended: 'qwerty',
    alternatives: ['dvorak-one-hand', 'maltron'],
    reasoning: 'QWERTY is familiar and widely supported. Consider specialized layouts for ergonomic or efficiency benefits.'
  };
}

/**
 * Validates a lesson's compatibility with a specific layout
 */
export function validateLessonLayoutCompatibility(
  lessonText: string,
  layoutType: InternationalLayout | SpecializedLayoutType
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Check for characters that might be difficult in specialized layouts
  if (isSpecializedLayout(layoutType)) {
    const numbers = (lessonText.match(/\d/g) || []).length;
    const symbols = (lessonText.match(/[!@#$%^&*()_+={}\[\]|\\:";'<>?,./]/g) || []).length;
    
    if (numbers > 0) {
      result.warnings.push(`This lesson contains ${numbers} number(s). Numbers may require special chord combinations in ${layoutType.toUpperCase()}.`);
    }
    
    if (symbols > 0) {
      result.warnings.push(`This lesson contains ${symbols} symbol(s). Symbols may be challenging in specialized layouts.`);
    }

    // ARTSEY specific checks
    if (layoutType === 'artsey') {
      const totalChars = lessonText.length;
      const estimatedChords = Math.ceil(totalChars * 0.7); // Rough estimate
      
      if (totalChars > 100) {
        result.suggestions.push('This is a long lesson for ARTSEY. Consider breaking it into shorter segments.');
      }
      
      result.suggestions.push(`Estimated chord combinations needed: ~${estimatedChords}`);
    }
  }

  return result;
}

/**
 * Provides migration guidance when switching between layouts
 */
export function getMigrationGuidance(
  fromLayout: InternationalLayout | SpecializedLayoutType,
  toLayout: InternationalLayout | SpecializedLayoutType
): {
  difficulty: 'easy' | 'moderate' | 'challenging';
  timeEstimate: string;
  tips: string[];
  practiceRecommendations: string[];
} {
  const fromSpecialized = isSpecializedLayout(fromLayout);
  const toSpecialized = isSpecializedLayout(toLayout);

  // Same layout
  if (fromLayout === toLayout) {
    return {
      difficulty: 'easy',
      timeEstimate: 'Immediate',
      tips: ['No changes needed'],
      practiceRecommendations: []
    };
  }

  // Standard to specialized
  if (!fromSpecialized && toSpecialized) {
    return {
      difficulty: toLayout === 'artsey' ? 'challenging' : 'moderate',
      timeEstimate: toLayout === 'artsey' ? '2-4 weeks' : '1-2 weeks',
      tips: [
        'Start with short 10-15 minute practice sessions',
        'Use finger guide and virtual keyboard initially',
        'Focus on accuracy over speed initially',
        'Practice common letter combinations first'
      ],
      practiceRecommendations: [
        'Begin with alphabet drills',
        'Practice common words',
        'Gradually increase text complexity',
        'Use specialized layout tutorials'
      ]
    };
  }

  // Specialized to standard
  if (fromSpecialized && !toSpecialized) {
    return {
      difficulty: 'moderate',
      timeEstimate: '3-7 days',
      tips: [
        'Your finger strength and coordination will help',
        'Focus on unlearning specialized patterns',
        'Use touch typing practice'
      ],
      practiceRecommendations: [
        'Standard typing tests',
        'Common word practice',
        'Gradual speed building'
      ]
    };
  }

  // Between specialized layouts
  return {
    difficulty: 'challenging',
    timeEstimate: '2-3 weeks',
    tips: [
      'Each specialized layout has unique patterns',
      'Take breaks to avoid confusion',
      'Practice layouts separately until confident'
    ],
    practiceRecommendations: [
      'Master one layout before switching',
      'Use layout-specific tutorials',
      'Focus on muscle memory development'
    ]
  };
}

export const MAX_LAYOUT_ROWS = 6;
export const MAX_ROW_KEYS = 10;

function describeChar(ch: string): string {
  return ch === ' ' ? 'Space' : `"${ch}"`;
}

/**
 * Validates a user-designed layout. Errors block saving; warnings do not.
 * Blank keys (`key: ''`) are allowed spacers. Space is supplied separately by
 * the practice keyboard, so it is never required.
 */
export function validateCustomLayout(layout: KeyboardLayout): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (layout.length === 0 || layout.every((row) => row.length === 0)) {
    errors.push('The layout has no keys.');
    return { errors, warnings };
  }
  if (layout.length > MAX_LAYOUT_ROWS) errors.push(`A layout can have at most ${MAX_LAYOUT_ROWS} rows.`);
  if (layout.some((row) => row.length > MAX_ROW_KEYS)) {
    errors.push(`A row can have at most ${MAX_ROW_KEYS} keys.`);
  }

  const seen = new Map<string, number>();
  let blanks = 0;
  for (const row of layout) {
    for (const k of row) {
      if (k.key === '') {
        blanks += 1;
        continue;
      }
      const norm = k.key.toLowerCase();
      seen.set(norm, (seen.get(norm) ?? 0) + 1);
    }
  }
  const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([ch]) => describeChar(ch));
  if (dupes.length > 0) {
    errors.push(`Duplicate characters: ${dupes.join(', ')}. Each character can appear on only one key.`);
  }

  const missing: string[] = [];
  for (let c = 97; c <= 122; c += 1) {
    const ch = String.fromCharCode(c);
    if (!seen.has(ch)) missing.push(ch);
  }
  if (missing.length > 0) {
    warnings.push(`Missing letters: ${missing.join(', ')} — you won't be able to type them.`);
  }
  if (blanks > 0) {
    warnings.push(`${blanks} blank ${blanks === 1 ? 'key' : 'keys'} will do nothing when pressed.`);
  }
  return { errors, warnings };
}
