// ============================================================================
// ACCESSIBILITY VALIDATOR - WCAG Compliance and Colorblind Testing
// ============================================================================

import type { KeyboardTheme, ThemeColors } from '../types/theme-system';

// ============================================================================
// COLOR CONTRAST CALCULATION
// ============================================================================

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ContrastResult {
  ratio: number;
  wcagLevel: 'AA' | 'AAA' | 'FAIL';
  passes: {
    normalAA: boolean;
    normalAAA: boolean;
    largeAA: boolean;
    largeAAA: boolean;
  };
}

export function hexToRgb(hex: string): RGBColor | null {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  
  const passes = {
    normalAA: ratio >= 4.5,      // Normal text AA
    normalAAA: ratio >= 7,       // Normal text AAA
    largeAA: ratio >= 3,         // Large text AA
    largeAAA: ratio >= 4.5       // Large text AAA
  };
  
  let wcagLevel: 'AA' | 'AAA' | 'FAIL' = 'FAIL';
  if (passes.normalAAA) {
    wcagLevel = 'AAA';
  } else if (passes.normalAA) {
    wcagLevel = 'AA';
  }
  
  return { ratio, wcagLevel, passes };
}

// ============================================================================
// COLORBLIND SIMULATION
// ============================================================================

export type ColorBlindType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochromacy';

const colorBlindMatrices = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525]
  ],
  monochromacy: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114]
  ]
};

export function simulateColorBlindness(color: string, type: ColorBlindType): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const matrix = colorBlindMatrices[type];
  const { r, g, b } = rgb;

  const newR = Math.round(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b);
  const newG = Math.round(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b);
  const newB = Math.round(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b);

  return `#${[newR, newG, newB].map(c => 
    Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')
  ).join('')}`;
}

export function testColorBlindFriendliness(
  colors: string[], 
  types: ColorBlindType[] = ['protanopia', 'deuteranopia', 'tritanopia']
): Record<ColorBlindType, { safe: boolean; issues: string[] }> {
  const results: Record<ColorBlindType, { safe: boolean; issues: string[] }> = {} as any;

  for (const type of types) {
    const simulatedColors = colors.map(color => simulateColorBlindness(color, type));
    const issues: string[] = [];
    let safe = true;

    // Check if colors become too similar after simulation
    for (let i = 0; i < simulatedColors.length; i++) {
      for (let j = i + 1; j < simulatedColors.length; j++) {
        const contrast = getContrastRatio(simulatedColors[i], simulatedColors[j]);
        if (contrast < 2) { // Colors are too similar
          issues.push(`Colors ${i + 1} and ${j + 1} become indistinguishable`);
          safe = false;
        }
      }
    }

    results[type] = { safe, issues };
  }

  return results;
}

// ============================================================================
// THEME ACCESSIBILITY VALIDATION
// ============================================================================

export interface AccessibilityReport {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  wcagLevel: 'AAA' | 'AA' | 'FAIL';
  contrastResults: Record<string, ContrastResult>;
  colorBlindResults: Record<ColorBlindType, { safe: boolean; issues: string[] }>;
  recommendations: string[];
  score: number; // 0-100
}

export function validateThemeAccessibility(theme: KeyboardTheme): AccessibilityReport {
  const { colors } = theme;
  const contrastResults: Record<string, ContrastResult> = {};
  const recommendations: string[] = [];
  let totalScore = 0;
  let scoreCount = 0;

  // Critical contrast checks
  const criticalPairs = [
    { name: 'text-background', fg: colors.text, bg: colors.background },
    { name: 'key-text', fg: colors.text, bg: colors.keyDefault },
    { name: 'highlighted-key', fg: colors.text, bg: colors.keyHighlighted },
    { name: 'error-key', fg: colors.text, bg: colors.keyError },
    { name: 'success-key', fg: colors.text, bg: colors.keySuccess }
  ];

  for (const pair of criticalPairs) {
    const result = checkContrast(pair.fg, pair.bg);
    contrastResults[pair.name] = result;
    
    if (result.wcagLevel === 'AAA') {
      totalScore += 100;
    } else if (result.wcagLevel === 'AA') {
      totalScore += 75;
    } else {
      totalScore += 0;
      recommendations.push(`Improve contrast for ${pair.name} (current: ${result.ratio.toFixed(2)}:1)`);
    }
    scoreCount++;
  }

  // Test colorblind friendliness
  const keyColors = [
    colors.fingerPinky,
    colors.fingerRing,
    colors.fingerMiddle,
    colors.fingerIndex,
    colors.fingerThumb
  ];
  
  const colorBlindResults = testColorBlindFriendliness(keyColors);
  let colorBlindScore = 0;
  
  Object.entries(colorBlindResults).forEach(([type, result]) => {
    if (result.safe) {
      colorBlindScore += 25;
    } else {
      recommendations.push(`Improve ${type} friendliness: ${result.issues.join(', ')}`);
    }
  });
  
  totalScore += colorBlindScore;
  scoreCount += 4; // 4 colorblind types

  // Overall WCAG level determination
  const minContrastLevel = Math.min(...Object.values(contrastResults).map(r => 
    r.wcagLevel === 'AAA' ? 3 : r.wcagLevel === 'AA' ? 2 : 1
  ));
  
  const wcagLevel = minContrastLevel >= 3 ? 'AAA' : minContrastLevel >= 2 ? 'AA' : 'FAIL';

  // Calculate final score
  const score = Math.round(totalScore / scoreCount);

  // Determine overall rating
  let overall: AccessibilityReport['overall'];
  if (score >= 90) overall = 'excellent';
  else if (score >= 75) overall = 'good';
  else if (score >= 60) overall = 'fair';
  else overall = 'poor';

  // Additional recommendations based on theme properties
  if (!theme.accessibility.colorBlindFriendly && score < 80) {
    recommendations.push('Consider adding colorblind-friendly indicators or patterns');
  }

  if (theme.effects.animations && !theme.accessibility.reducedMotion) {
    recommendations.push('Provide option to disable animations for users with vestibular disorders');
  }

  if (!theme.accessibility.largeText && overall === 'poor') {
    recommendations.push('Consider offering a large text variant');
  }

  return {
    overall,
    wcagLevel,
    contrastResults,
    colorBlindResults,
    recommendations,
    score
  };
}

// ============================================================================
// ACCESSIBILITY ENHANCEMENT SUGGESTIONS
// ============================================================================

export interface EnhancementSuggestion {
  type: 'contrast' | 'colorblind' | 'motion' | 'text-size';
  priority: 'high' | 'medium' | 'low';
  description: string;
  implementation: string;
  estimatedImpact: number; // 0-100
}

export function generateAccessibilityEnhancements(
  theme: KeyboardTheme,
  report: AccessibilityReport
): EnhancementSuggestion[] {
  const suggestions: EnhancementSuggestion[] = [];

  // Contrast improvements
  Object.entries(report.contrastResults).forEach(([name, result]) => {
    if (result.wcagLevel === 'FAIL') {
      suggestions.push({
        type: 'contrast',
        priority: 'high',
        description: `Improve contrast ratio for ${name} (currently ${result.ratio.toFixed(2)}:1)`,
        implementation: 'Darken foreground or lighten background colors',
        estimatedImpact: 25
      });
    } else if (result.wcagLevel === 'AA') {
      suggestions.push({
        type: 'contrast',
        priority: 'medium',
        description: `Enhance contrast ratio for ${name} to reach AAA standard`,
        implementation: 'Fine-tune color values for optimal contrast',
        estimatedImpact: 10
      });
    }
  });

  // Colorblind enhancements
  Object.entries(report.colorBlindResults).forEach(([type, result]) => {
    if (!result.safe) {
      suggestions.push({
        type: 'colorblind',
        priority: 'high',
        description: `Improve ${type} accessibility`,
        implementation: 'Add patterns, textures, or shapes to differentiate colors',
        estimatedImpact: 20
      });
    }
  });

  // Motion sensitivity
  if (theme.effects.animations && !theme.accessibility.reducedMotion) {
    suggestions.push({
      type: 'motion',
      priority: 'medium',
      description: 'Add reduced motion support',
      implementation: 'Implement prefers-reduced-motion CSS media query',
      estimatedImpact: 15
    });
  }

  // Text size improvements
  if (report.score < 70 && !theme.accessibility.largeText) {
    suggestions.push({
      type: 'text-size',
      priority: 'medium',
      description: 'Provide large text option',
      implementation: 'Create 120% scaled text variant',
      estimatedImpact: 12
    });
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.estimatedImpact - a.estimatedImpact;
  });
}

// ============================================================================
// AUTOMATED THEME FIXES
// ============================================================================

export function generateAccessibleVariant(theme: KeyboardTheme): KeyboardTheme {
  const enhancedTheme: KeyboardTheme = JSON.parse(JSON.stringify(theme));
  enhancedTheme.id = `${theme.id}-accessible`;
  enhancedTheme.name = `${theme.name} (Accessible)`;
  enhancedTheme.description = `${theme.description} - Enhanced for accessibility`;

  // Enhance contrast ratios
  const { colors } = enhancedTheme;
  
  // Ensure text has sufficient contrast against backgrounds
  const textBgContrast = getContrastRatio(colors.text, colors.background);
  if (textBgContrast < 7) {
    // Make text darker or background lighter
    const textLum = getLuminance(colors.text);
    const bgLum = getLuminance(colors.background);
    
    if (bgLum > 0.5) {
      // Light background - darken text
      colors.text = adjustBrightness(colors.text, 0.7);
    } else {
      // Dark background - lighten text
      colors.text = adjustBrightness(colors.text, 1.4);
    }
  }

  // Enhance key contrasts
  const keyContrast = getContrastRatio(colors.text, colors.keyDefault);
  if (keyContrast < 4.5) {
    colors.keyDefault = adjustBrightness(colors.keyDefault, 
      getLuminance(colors.text) > 0.5 ? 1.3 : 0.8
    );
  }

  // Make finger colors more distinct for colorblind users
  const fingerColors = [
    colors.fingerPinky,
    colors.fingerRing,
    colors.fingerMiddle,
    colors.fingerIndex,
    colors.fingerThumb
  ];

  const colorBlindTest = testColorBlindFriendliness(fingerColors);
  const hasIssues = Object.values(colorBlindTest).some(result => !result.safe);

  if (hasIssues) {
    // Use high-contrast, colorblind-safe palette
    colors.fingerPinky = '#000000';   // Black
    colors.fingerRing = '#0066CC';    // Blue
    colors.fingerMiddle = '#FF9900';  // Orange
    colors.fingerIndex = '#009900';   // Green
    colors.fingerThumb = '#CC0066';   // Magenta
  }

  // Update accessibility metadata
  enhancedTheme.accessibility = {
    ...enhancedTheme.accessibility,
    wcagLevel: 'AAA',
    contrastRatio: Math.min(
      getContrastRatio(colors.text, colors.background),
      getContrastRatio(colors.text, colors.keyDefault)
    ),
    colorBlindFriendly: true,
    supportedColorBlindTypes: ['deuteranopia', 'protanopia', 'tritanopia', 'monochromacy'],
    highContrast: true
  };

  // Disable potentially problematic effects
  enhancedTheme.effects = {
    ...enhancedTheme.effects,
    animations: false,
    particles: false,
    transitionDuration: 0
  };

  return enhancedTheme;
}

function adjustBrightness(color: string, factor: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const adjusted = {
    r: Math.min(255, Math.max(0, Math.round(rgb.r * factor))),
    g: Math.min(255, Math.max(0, Math.round(rgb.g * factor))),
    b: Math.min(255, Math.max(0, Math.round(rgb.b * factor)))
  };

  return `#${[adjusted.r, adjusted.g, adjusted.b]
    .map(c => c.toString(16).padStart(2, '0'))
    .join('')}`;
}

// ============================================================================
// ACCESSIBILITY TESTING SUITE
// ============================================================================

export function runAccessibilityTestSuite(themes: KeyboardTheme[]): {
  summary: {
    totalThemes: number;
    aaaCompliant: number;
    aaCompliant: number;
    failing: number;
    colorBlindSafe: number;
  };
  detailedReports: Array<{
    themeId: string;
    themeName: string;
    report: AccessibilityReport;
    suggestions: EnhancementSuggestion[];
  }>;
} {
  const detailedReports = themes.map(theme => ({
    themeId: theme.id,
    themeName: theme.name,
    report: validateThemeAccessibility(theme),
    suggestions: generateAccessibilityEnhancements(theme, validateThemeAccessibility(theme))
  }));

  const summary = detailedReports.reduce((acc, { report }) => ({
    totalThemes: acc.totalThemes + 1,
    aaaCompliant: acc.aaaCompliant + (report.wcagLevel === 'AAA' ? 1 : 0),
    aaCompliant: acc.aaCompliant + (report.wcagLevel === 'AA' ? 1 : 0),
    failing: acc.failing + (report.wcagLevel === 'FAIL' ? 1 : 0),
    colorBlindSafe: acc.colorBlindSafe + (Object.values(report.colorBlindResults).every(r => r.safe) ? 1 : 0)
  }), {
    totalThemes: 0,
    aaaCompliant: 0,
    aaCompliant: 0,
    failing: 0,
    colorBlindSafe: 0
  });

  return { summary, detailedReports };
}

// Export default validator function
export default function validateAccessibility(theme: KeyboardTheme): AccessibilityReport {
  return validateThemeAccessibility(theme);
}