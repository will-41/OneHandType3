// ============================================================================
// CSS THEME SYSTEM - Dynamic Theme Application and Custom Properties
// ============================================================================

import type { KeyboardTheme, ThemeCustomization } from '../types/theme-system';

// ============================================================================
// CSS CUSTOM PROPERTIES MAPPING
// ============================================================================

export const cssVariableMap = {
  // Primary colors
  '--theme-primary': 'colors.primary',
  '--theme-primary-hover': 'colors.primaryHover',
  '--theme-primary-active': 'colors.primaryActive',
  '--theme-secondary': 'colors.secondary',
  '--theme-accent': 'colors.accent',
  
  // Background colors
  '--theme-background': 'colors.background',
  '--theme-surface': 'colors.surface',
  '--theme-surface-hover': 'colors.surfaceHover',
  
  // Text colors
  '--theme-text': 'colors.text',
  '--theme-text-secondary': 'colors.textSecondary',
  '--theme-text-muted': 'colors.textMuted',
  
  // State colors
  '--theme-success': 'colors.success',
  '--theme-warning': 'colors.warning',
  '--theme-error': 'colors.error',
  '--theme-info': 'colors.info',
  
  // Keyboard specific
  '--theme-key-default': 'colors.keyDefault',
  '--theme-key-hover': 'colors.keyHover',
  '--theme-key-pressed': 'colors.keyPressed',
  '--theme-key-highlighted': 'colors.keyHighlighted',
  '--theme-key-error': 'colors.keyError',
  '--theme-key-success': 'colors.keySuccess',
  
  // Finger guide colors
  '--theme-finger-pinky': 'colors.fingerPinky',
  '--theme-finger-ring': 'colors.fingerRing',
  '--theme-finger-middle': 'colors.fingerMiddle',
  '--theme-finger-index': 'colors.fingerIndex',
  '--theme-finger-thumb': 'colors.fingerThumb',
  
  // Interactive elements
  '--theme-border': 'colors.border',
  '--theme-border-focus': 'colors.borderFocus',
  '--theme-shadow': 'colors.shadow',
  '--theme-overlay': 'colors.overlay',
  
  // Effect properties
  '--theme-transition-duration': 'effects.transitionDuration',
  '--theme-easing-function': 'effects.easingFunction',
  '--theme-pulse-intensity': 'effects.pulseIntensity',
  '--theme-glow-intensity': 'effects.glowIntensity',
  '--theme-particle-count': 'effects.particleCount',
  '--theme-particle-speed': 'effects.particleSpeed'
} as const;

// ============================================================================
// THEME APPLICATION FUNCTIONS
// ============================================================================

export function applyThemeToDocument(
  theme: KeyboardTheme, 
  customization?: ThemeCustomization
): void {
  const root = document.documentElement;
  
  // Apply base theme colors
  Object.entries(cssVariableMap).forEach(([cssVar, themePath]) => {
    const value = getNestedValue(theme, themePath);
    if (value !== undefined) {
      root.style.setProperty(cssVar, String(value));
    }
  });
  
  // Apply customizations if provided
  if (customization) {
    applyCustomizations(root, theme, customization);
  }
  
  // Apply effect classes
  applyEffectClasses(theme);
  
  // Apply accessibility overrides
  applyAccessibilityOverrides(theme, customization);
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function applyCustomizations(
  root: HTMLElement, 
  theme: KeyboardTheme, 
  customization: ThemeCustomization
): void {
  // Apply brightness adjustment
  if (customization.brightness !== 100) {
    const brightnessFilter = `brightness(${customization.brightness}%)`;
    root.style.setProperty('--theme-brightness-filter', brightnessFilter);
  }
  
  // Apply saturation adjustment
  if (customization.saturation !== 100) {
    const saturationFilter = `saturate(${customization.saturation}%)`;
    root.style.setProperty('--theme-saturation-filter', saturationFilter);
  }
  
  // Apply contrast adjustment
  if (customization.contrast !== 100) {
    const contrastFilter = `contrast(${customization.contrast}%)`;
    root.style.setProperty('--theme-contrast-filter', contrastFilter);
  }
  
  // Apply custom colors
  if (customization.customColors) {
    Object.entries(customization.customColors).forEach(([colorKey, colorValue]) => {
      const cssVar = `--theme-${colorKey.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, colorValue);
    });
  }
  
  // Apply animation speed multiplier
  if (customization.animationSpeed !== 1) {
    const duration = theme.effects.transitionDuration * (1 / customization.animationSpeed);
    root.style.setProperty('--theme-transition-duration', `${duration}ms`);
  }
  
  // Apply particle intensity
  if (customization.particleIntensity !== undefined) {
    const particleCount = Math.round(theme.effects.particleCount * (customization.particleIntensity / 100));
    root.style.setProperty('--theme-particle-count', String(particleCount));
  }
}

function applyEffectClasses(theme: KeyboardTheme): void {
  const body = document.body;
  
  // Remove existing effect classes
  body.classList.remove(
    'theme-glass-effect',
    'theme-gradients',
    'theme-shadows',
    'theme-animations',
    'theme-particles',
    'theme-ripple-effect'
  );
  
  // Apply new effect classes
  if (theme.effects.glassEffect) {
    body.classList.add('theme-glass-effect');
  }
  
  if (theme.effects.gradients) {
    body.classList.add('theme-gradients');
  }
  
  if (theme.effects.shadows) {
    body.classList.add('theme-shadows');
  }
  
  if (theme.effects.animations) {
    body.classList.add('theme-animations');
  }
  
  if (theme.effects.particles) {
    body.classList.add('theme-particles');
  }
  
  if (theme.effects.rippleEffect) {
    body.classList.add('theme-ripple-effect');
  }
}

function applyAccessibilityOverrides(
  theme: KeyboardTheme, 
  customization?: ThemeCustomization
): void {
  const root = document.documentElement;
  
  // Force high contrast if needed
  if (customization?.forceHighContrast || theme.accessibility.highContrast) {
    root.style.setProperty('--theme-contrast-multiplier', '1.5');
  }
  
  // Disable animations if needed
  if (customization?.disableAnimations || theme.accessibility.reducedMotion) {
    root.style.setProperty('--theme-transition-duration', '0ms');
    root.style.setProperty('--theme-animation-duration', '0ms');
  }
  
  // Enlarge text if needed
  if (customization?.enlargeText || theme.accessibility.largeText) {
    root.style.setProperty('--theme-font-size-multiplier', '1.2');
  }
}

// ============================================================================
// CSS GENERATION FUNCTIONS
// ============================================================================

export function generateThemeCSS(theme: KeyboardTheme): string {
  const cssRules: string[] = [];
  
  // Generate root variables
  const rootVariables = Object.entries(cssVariableMap)
    .map(([cssVar, themePath]) => {
      const value = getNestedValue(theme, themePath);
      return value !== undefined ? `  ${cssVar}: ${value};` : null;
    })
    .filter(Boolean)
    .join('\n');
  
  cssRules.push(`:root {\n${rootVariables}\n}`);
  
  // Generate effect-specific styles
  cssRules.push(generateEffectStyles(theme));
  
  // Generate keyboard-specific styles
  cssRules.push(generateKeyboardStyles(theme));
  
  // Generate animation keyframes
  cssRules.push(generateAnimationKeyframes(theme));
  
  return cssRules.join('\n\n');
}

function generateEffectStyles(theme: KeyboardTheme): string {
  const styles: string[] = [];
  
  if (theme.effects.glassEffect) {
    styles.push(`
.theme-glass-effect .keyboard-surface {
  backdrop-filter: blur(10px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
}`);
  }
  
  if (theme.effects.gradients) {
    styles.push(`
.theme-gradients .keyboard-key {
  background: linear-gradient(
    145deg,
    var(--theme-key-default),
    var(--theme-key-hover)
  );
}

.theme-gradients .keyboard-key:hover {
  background: linear-gradient(
    145deg,
    var(--theme-key-hover),
    var(--theme-key-pressed)
  );
}`);
  }
  
  if (theme.effects.shadows) {
    styles.push(`
.theme-shadows .keyboard-key {
  box-shadow: 
    0 2px 4px var(--theme-shadow),
    0 1px 2px rgba(0, 0, 0, 0.1);
}

.theme-shadows .keyboard-key:hover {
  box-shadow: 
    0 4px 8px var(--theme-shadow),
    0 2px 4px rgba(0, 0, 0, 0.15);
}`);
  }
  
  return styles.join('\n');
}

function generateKeyboardStyles(theme: KeyboardTheme): string {
  return `
/* Keyboard Container */
.themed-keyboard {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
  color: var(--theme-text);
  transition: all var(--theme-transition-duration)ms var(--theme-easing-function);
}

/* Individual Keys */
.themed-key {
  background: var(--theme-key-default);
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
  transition: all var(--theme-transition-duration)ms var(--theme-easing-function);
}

.themed-key:hover {
  background: var(--theme-key-hover);
  border-color: var(--theme-border-focus);
  transform: translateY(-1px);
}

.themed-key:active,
.themed-key.pressed {
  background: var(--theme-key-pressed);
  transform: translateY(1px);
}

.themed-key.highlighted {
  background: var(--theme-key-highlighted);
  border-color: var(--theme-border-focus);
  animation: theme-pulse var(--theme-transition-duration)ms infinite alternate;
}

.themed-key.error {
  background: var(--theme-key-error);
  animation: theme-shake 300ms ease-in-out;
}

.themed-key.success {
  background: var(--theme-key-success);
  animation: theme-success-glow 500ms ease-out;
}

/* Finger Guide Colors */
.finger-pinky { color: var(--theme-finger-pinky); }
.finger-ring { color: var(--theme-finger-ring); }
.finger-middle { color: var(--theme-finger-middle); }
.finger-index { color: var(--theme-finger-index); }
.finger-thumb { color: var(--theme-finger-thumb); }

/* Typing Area */
.themed-typing-area {
  background: var(--theme-background);
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
}

.themed-typing-area:focus {
  outline: 2px solid var(--theme-border-focus);
  outline-offset: 2px;
}

/* Progress Indicators */
.themed-progress {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
}

.themed-progress-fill {
  background: linear-gradient(90deg, var(--theme-primary), var(--theme-accent));
}`;
}

function generateAnimationKeyframes(theme: KeyboardTheme): string {
  return `
/* Theme Animation Keyframes */
@keyframes theme-pulse {
  0% { opacity: 1; }
  100% { opacity: 0.7; }
}

@keyframes theme-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes theme-success-glow {
  0% { box-shadow: 0 0 0 rgba(0, 255, 0, 0); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); }
  100% { box-shadow: 0 0 0 rgba(0, 255, 0, 0); }
}

@keyframes theme-ripple {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(4);
  }
}

@keyframes theme-particle-float {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0);
  }
}

/* RGB Rainbow Animation for Gaming Themes */
@keyframes theme-rgb-cycle {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

.theme-rgb-rainbow .themed-key {
  animation: theme-rgb-cycle 3s linear infinite;
}

/* Cyberpunk Glow Effect */
@keyframes theme-cyberpunk-glow {
  0%, 100% { 
    box-shadow: 0 0 5px var(--theme-primary),
                0 0 10px var(--theme-primary),
                0 0 15px var(--theme-primary);
  }
  50% { 
    box-shadow: 0 0 10px var(--theme-primary),
                0 0 20px var(--theme-primary),
                0 0 30px var(--theme-primary);
  }
}

/* Matrix Digital Rain Effect */
@keyframes theme-matrix-rain {
  0% { opacity: 0; transform: translateY(-100%); }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(100%); }
}

/* Aurora Borealis Wave Effect */
@keyframes theme-aurora-wave {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.theme-aurora .keyboard-surface {
  background: linear-gradient(
    45deg,
    var(--theme-primary),
    var(--theme-secondary),
    var(--theme-accent),
    var(--theme-primary)
  );
  background-size: 400% 400%;
  animation: theme-aurora-wave 8s ease-in-out infinite;
}`;
}

// ============================================================================
// PARTICLE SYSTEM CSS
// ============================================================================

export function generateParticleCSS(theme: KeyboardTheme): string {
  if (!theme.effects.particles) return '';
  
  const { particleCount, particleColors, particleSpeed } = theme.effects;
  
  return `
.theme-particles::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  background-image: ${generateParticleBackground(particleColors, particleCount)};
  animation: theme-particle-move ${30 / particleSpeed}s linear infinite;
}

@keyframes theme-particle-move {
  0% { transform: translateY(100vh) rotate(0deg); }
  100% { transform: translateY(-10vh) rotate(360deg); }
}

${generateParticleElements(particleCount, particleColors, particleSpeed)}`;
}

function generateParticleBackground(colors: string[], count: number): string {
  const gradients = colors.map((color, index) => {
    const position = (index / colors.length) * 100;
    return `radial-gradient(circle at ${position}% ${position}%, ${color} 1px, transparent 1px)`;
  });
  
  return gradients.join(', ');
}

function generateParticleElements(count: number, colors: string[], speed: number): string {
  const elements: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const delay = (i / count) * 2;
    const duration = 3 + Math.random() * 2;
    const size = 2 + Math.random() * 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    elements.push(`
.theme-particle-${i} {
  position: absolute;
  width: ${size}px;
  height: ${size}px;
  background: ${color};
  border-radius: 50%;
  animation: theme-particle-float ${duration}s ease-in-out ${delay}s infinite;
  opacity: 0.6;
}`);
  }
  
  return elements.join('\n');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function injectThemeCSS(css: string, id: string = 'dynamic-theme'): void {
  // Remove existing dynamic theme
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  
  // Create and inject new theme
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

export function removeThemeCSS(id: string = 'dynamic-theme'): void {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

export function generateCompleteThemeCSS(
  theme: KeyboardTheme, 
  customization?: ThemeCustomization
): string {
  const baseCSS = generateThemeCSS(theme);
  const particleCSS = generateParticleCSS(theme);
  
  return [baseCSS, particleCSS].filter(Boolean).join('\n\n');
}

// Color utility functions
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
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

export function adjustColorBrightness(color: string, factor: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const adjusted = {
    r: Math.min(255, Math.max(0, rgb.r * factor)),
    g: Math.min(255, Math.max(0, rgb.g * factor)),
    b: Math.min(255, Math.max(0, rgb.b * factor))
  };
  
  return `rgb(${Math.round(adjusted.r)}, ${Math.round(adjusted.g)}, ${Math.round(adjusted.b)})`;
}