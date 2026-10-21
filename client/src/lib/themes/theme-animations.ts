// ============================================================================
// THEME ANIMATIONS AND INTERACTIVE EFFECTS
// Key Press Animations, Typing Streak Effects, and Responsive Elements
// ============================================================================

import type { KeyPressAnimation, TypingStreakEffect, AdaptiveThemeResponse } from '../types/theme-system';

// ============================================================================
// KEY PRESS ANIMATION DEFINITIONS
// ============================================================================

export const keyPressAnimations: Record<string, KeyPressAnimation> = {
  ripple: {
    type: 'ripple',
    duration: 600,
    intensity: 5,
    colors: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.1)'],
    particleCount: 0
  },
  
  pulse: {
    type: 'pulse',
    duration: 300,
    intensity: 3,
    colors: ['rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.2)'],
    particleCount: 0
  },
  
  glow: {
    type: 'glow',
    duration: 500,
    intensity: 7,
    colors: ['rgba(139, 92, 246, 0.6)', 'rgba(139, 92, 246, 0.3)'],
    particleCount: 0
  },
  
  particle: {
    type: 'particle',
    duration: 800,
    intensity: 6,
    colors: ['#00ffff', '#ff00ff', '#ffff00'],
    particleCount: 8
  },
  
  wave: {
    type: 'wave',
    duration: 700,
    intensity: 4,
    colors: ['rgba(236, 72, 153, 0.4)', 'rgba(236, 72, 153, 0.1)'],
    particleCount: 0
  },
  
  spark: {
    type: 'spark',
    duration: 400,
    intensity: 8,
    colors: ['#fbbf24', '#f59e0b', '#d97706'],
    particleCount: 12
  },
  
  cyberpunk: {
    type: 'glow',
    duration: 400,
    intensity: 10,
    colors: ['#00ffff', '#ff00ff'],
    particleCount: 5
  },
  
  matrix: {
    type: 'wave',
    duration: 300,
    intensity: 2,
    colors: ['#00ff41', '#66ff99'],
    particleCount: 3
  },
  
  rainbow: {
    type: 'particle',
    duration: 600,
    intensity: 9,
    colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'],
    particleCount: 15
  }
};

// ============================================================================
// TYPING STREAK EFFECTS
// ============================================================================

export const typingStreakEffects: TypingStreakEffect[] = [
  {
    minStreak: 5,
    effectType: 'color_shift',
    maxIntensity: 3,
    colors: ['#22c55e', '#16a34a']
  },
  {
    minStreak: 10,
    effectType: 'intensity_boost',
    maxIntensity: 5,
    colors: ['#3b82f6', '#1d4ed8']
  },
  {
    minStreak: 20,
    effectType: 'particle_trail',
    maxIntensity: 7,
    colors: ['#8b5cf6', '#7c3aed', '#6d28d9']
  },
  {
    minStreak: 50,
    effectType: 'glow_increase',
    maxIntensity: 10,
    colors: ['#f59e0b', '#d97706', '#b45309']
  }
];

// ============================================================================
// ADAPTIVE THEME RESPONSES
// ============================================================================

export const adaptiveThemeResponse: AdaptiveThemeResponse = {
  accuracyBoost: {
    threshold: 95,
    effect: 'success_glow',
    intensity: 6
  },
  errorResponse: {
    effect: 'red_flash',
    duration: 300,
    recovery: 'gradual_fade'
  },
  speedResponse: {
    wpmThresholds: [
      {
        wpm: 30,
        effect: 'color_shift',
        intensity: 2
      },
      {
        wpm: 50,
        effect: 'speed_lines',
        intensity: 4
      },
      {
        wpm: 70,
        effect: 'particle_increase',
        intensity: 7
      },
      {
        wpm: 90,
        effect: 'speed_lines',
        intensity: 10
      }
    ]
  }
};

// ============================================================================
// ANIMATION CSS GENERATION
// ============================================================================

export function generateAnimationCSS(animation: KeyPressAnimation): string {
  const animationName = `theme-${animation.type}-${Date.now()}`;
  
  switch (animation.type) {
    case 'ripple':
      return `
@keyframes ${animationName} {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.key-animation-${animation.type} {
  position: relative;
  overflow: hidden;
}

.key-animation-${animation.type}::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, ${animation.colors[0]}, ${animation.colors[1] || animation.colors[0]});
  transform: translate(-50%, -50%) scale(0);
  animation: ${animationName} ${animation.duration}ms ease-out;
  pointer-events: none;
}`;

    case 'pulse':
      return `
@keyframes ${animationName} {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${animation.colors[0]};
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px ${animation.colors[1] || animation.colors[0]};
  }
}

.key-animation-${animation.type} {
  animation: ${animationName} ${animation.duration}ms ease-in-out;
}`;

    case 'glow':
      return `
@keyframes ${animationName} {
  0% {
    box-shadow: 0 0 5px ${animation.colors[0]};
  }
  50% {
    box-shadow: 0 0 20px ${animation.colors[0]}, 0 0 30px ${animation.colors[1] || animation.colors[0]};
  }
  100% {
    box-shadow: 0 0 5px ${animation.colors[0]};
  }
}

.key-animation-${animation.type} {
  animation: ${animationName} ${animation.duration}ms ease-in-out;
}`;

    case 'wave':
      return `
@keyframes ${animationName} {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.key-animation-${animation.type} {
  background: linear-gradient(45deg, ${animation.colors.join(', ')});
  background-size: 400% 400%;
  animation: ${animationName} ${animation.duration}ms ease-in-out;
}`;

    case 'particle':
      return generateParticleAnimationCSS(animationName, animation);

    case 'spark':
      return generateSparkAnimationCSS(animationName, animation);

    default:
      return '';
  }
}

function generateParticleAnimationCSS(animationName: string, animation: KeyPressAnimation): string {
  const particleCount = animation.particleCount || 8; // Default to 8 particles if not specified
  const particleKeyframes = Array.from({ length: particleCount }, (_, i) => {
    const angle = (360 / particleCount) * i;
    const distance = 30 + Math.random() * 20;
    const x = Math.cos(angle * Math.PI / 180) * distance;
    const y = Math.sin(angle * Math.PI / 180) * distance;
    const color = animation.colors?.[i % (animation.colors?.length || 1)] || '#ffffff';
    
    return `
.key-animation-particle-${i}::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: ${color};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${animationName}-${i} ${animation.duration}ms ease-out forwards;
  pointer-events: none;
}

@keyframes ${animationName}-${i} {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    opacity: 1;
    transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + ${x * 1.5}px), calc(-50% + ${y * 1.5}px)) scale(0);
  }
}`;
  }).join('\n');

  return `
.key-animation-particle {
  position: relative;
}

${particleKeyframes}`;
}

function generateSparkAnimationCSS(animationName: string, animation: KeyPressAnimation): string {
  return `
@keyframes ${animationName} {
  0% {
    opacity: 1;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(360deg);
  }
}

.key-animation-spark {
  position: relative;
}

.key-animation-spark::after {
  content: '✨';
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 12px;
  transform: translate(-50%, -50%) scale(0);
  animation: ${animationName} ${animation.duration}ms ease-out;
  pointer-events: none;
}`;
}

// ============================================================================
// ANIMATION CONTROLLER CLASS
// ============================================================================

export class ThemeAnimationController {
  private activeAnimations: Map<string, Animation> = new Map();
  private typingStreak: number = 0;
  private lastKeypressTime: number = 0;
  private currentWPM: number = 0;
  private currentAccuracy: number = 100;
  
  constructor() {
    this.bindEventListeners();
  }
  
  private bindEventListeners(): void {
    // Listen for custom typing events
    document.addEventListener('keypress-animation', this.handleKeypress);
    document.addEventListener('typing-stats-update', this.handleStatsUpdate);
    document.addEventListener('typing-error', this.handleTypingError);
  }
  
  private handleKeypress = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const { key, element, animationType } = customEvent.detail;
    const animation = keyPressAnimations[animationType || 'ripple'];
    
    if (animation && element) {
      this.playKeyAnimation(element, animation);
      this.updateTypingStreak();
      this.checkSpeedThresholds();
    }
  }
  
  private handleStatsUpdate = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { wpm, accuracy } = customEvent.detail;
    this.currentWPM = wpm;
    this.currentAccuracy = accuracy;
    
    this.applyAdaptiveEffects();
  }
  
  private handleTypingError = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { element } = customEvent.detail;
    this.resetTypingStreak();
    this.playErrorAnimation(element);
  }
  
  private playKeyAnimation(element: HTMLElement, animation: KeyPressAnimation): void {
    // Remove existing animation classes
    element.classList.remove(...Array.from(element.classList).filter(c => c.startsWith('key-animation-')));
    
    // Add animation class
    element.classList.add(`key-animation-${animation.type}`);
    
    // Remove animation class after duration
    setTimeout(() => {
      element.classList.remove(`key-animation-${animation.type}`);
    }, animation.duration);
    
    // Generate and inject CSS if not already present
    const styleId = `animation-${animation.type}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = generateAnimationCSS(animation);
      document.head.appendChild(style);
    }
  }
  
  private updateTypingStreak(): void {
    const now = Date.now();
    const timeSinceLastKey = now - this.lastKeypressTime;
    
    if (timeSinceLastKey < 2000) { // Within 2 seconds
      this.typingStreak++;
    } else {
      this.typingStreak = 1;
    }
    
    this.lastKeypressTime = now;
    this.applyStreakEffects();
  }
  
  private resetTypingStreak(): void {
    this.typingStreak = 0;
  }
  
  private applyStreakEffects(): void {
    const applicableEffects = typingStreakEffects.filter(
      effect => this.typingStreak >= effect.minStreak
    );
    
    const strongestEffect = applicableEffects[applicableEffects.length - 1];
    if (strongestEffect) {
      this.applyStreakVisuals(strongestEffect);
    }
  }
  
  private applyStreakVisuals(effect: TypingStreakEffect): void {
    const keyboard = document.querySelector('.themed-keyboard');
    if (!keyboard) return;
    
    keyboard.classList.remove('streak-1', 'streak-2', 'streak-3', 'streak-4');
    
    const streakLevel = Math.min(4, Math.floor(this.typingStreak / 10) + 1);
    keyboard.classList.add(`streak-${streakLevel}`);
    
    // Apply color shift based on streak
    const intensity = Math.min(effect.maxIntensity, this.typingStreak / 10);
    const color = effect.colors[Math.min(effect.colors.length - 1, Math.floor(intensity))];
    
    document.documentElement.style.setProperty('--streak-color', color);
    document.documentElement.style.setProperty('--streak-intensity', intensity.toString());
  }
  
  private checkSpeedThresholds(): void {
    const thresholds = adaptiveThemeResponse.speedResponse.wpmThresholds;
    const currentThreshold = thresholds
      .filter(t => this.currentWPM >= t.wpm)
      .pop();
    
    if (currentThreshold) {
      this.applySpeedEffect(currentThreshold);
    }
  }
  
  private applySpeedEffect(threshold: typeof adaptiveThemeResponse.speedResponse.wpmThresholds[0]): void {
    const keyboard = document.querySelector('.themed-keyboard');
    if (!keyboard) return;
    
    keyboard.classList.remove('speed-1', 'speed-2', 'speed-3', 'speed-4');
    
    const speedLevel = Math.min(4, Math.floor(threshold.intensity / 3) + 1);
    keyboard.classList.add(`speed-${speedLevel}`);
  }
  
  private applyAdaptiveEffects(): void {
    // Apply accuracy boost effect
    if (this.currentAccuracy >= adaptiveThemeResponse.accuracyBoost.threshold) {
      this.applyAccuracyBoost();
    }
  }
  
  private applyAccuracyBoost(): void {
    const keyboard = document.querySelector('.themed-keyboard');
    if (!keyboard) return;
    
    keyboard.classList.add('accuracy-boost');
    setTimeout(() => {
      keyboard.classList.remove('accuracy-boost');
    }, 2000);
  }
  
  private playErrorAnimation(element: HTMLElement): void {
    element.classList.add('key-error-animation');
    setTimeout(() => {
      element.classList.remove('key-error-animation');
    }, 300);
  }
  
  public setAnimationType(themeId: string): void {
    // Map theme IDs to animation types
    const themeAnimationMap: Record<string, string> = {
      'cyberpunk-neon': 'cyberpunk',
      'matrix-green': 'matrix',
      'gaming-rgb-rainbow': 'rainbow',
      'speed-demon': 'spark',
      'aurora-borealis': 'wave',
      'cherry-blossom': 'particle'
    };
    
    const animationType = themeAnimationMap[themeId] || 'ripple';
    document.documentElement.style.setProperty('--current-animation-type', animationType);
  }
  
  public destroy(): void {
    // Cleanup event listeners and animations
    document.removeEventListener('keypress-animation', this.handleKeypress);
    document.removeEventListener('typing-stats-update', this.handleStatsUpdate);
    document.removeEventListener('typing-error', this.handleTypingError);
    
    this.activeAnimations.clear();
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function triggerKeyAnimation(
  element: HTMLElement, 
  animationType: string = 'ripple',
  customColors?: string[]
): void {
  const event = new CustomEvent('keypress-animation', {
    detail: {
      element,
      animationType,
      customColors
    }
  });
  document.dispatchEvent(event);
}

export function updateTypingStats(wpm: number, accuracy: number): void {
  const event = new CustomEvent('typing-stats-update', {
    detail: { wpm, accuracy }
  });
  document.dispatchEvent(event);
}

export function triggerTypingError(element: HTMLElement): void {
  const event = new CustomEvent('typing-error', {
    detail: { element }
  });
  document.dispatchEvent(event);
}

// ============================================================================
// STREAK AND SPEED EFFECTS CSS
// ============================================================================

export const streakEffectsCSS = `
/* Typing Streak Effects */
.streak-1 {
  --streak-glow: 0 0 5px var(--streak-color, #22c55e);
}

.streak-2 {
  --streak-glow: 0 0 10px var(--streak-color, #3b82f6);
  animation: streak-pulse 2s ease-in-out infinite;
}

.streak-3 {
  --streak-glow: 0 0 15px var(--streak-color, #8b5cf6), 0 0 30px var(--streak-color, #8b5cf6);
  animation: streak-intense 1.5s ease-in-out infinite;
}

.streak-4 {
  --streak-glow: 0 0 20px var(--streak-color, #f59e0b), 0 0 40px var(--streak-color, #f59e0b), 0 0 60px var(--streak-color, #f59e0b);
  animation: streak-legendary 1s ease-in-out infinite;
}

@keyframes streak-pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

@keyframes streak-intense {
  0%, 100% { 
    filter: brightness(1) saturate(1);
    transform: scale(1);
  }
  50% { 
    filter: brightness(1.3) saturate(1.2);
    transform: scale(1.02);
  }
}

@keyframes streak-legendary {
  0%, 100% { 
    filter: brightness(1) saturate(1) hue-rotate(0deg);
    box-shadow: var(--streak-glow);
  }
  25% { 
    filter: brightness(1.4) saturate(1.3) hue-rotate(90deg);
    box-shadow: var(--streak-glow);
  }
  50% { 
    filter: brightness(1.5) saturate(1.4) hue-rotate(180deg);
    box-shadow: var(--streak-glow);
  }
  75% { 
    filter: brightness(1.4) saturate(1.3) hue-rotate(270deg);
    box-shadow: var(--streak-glow);
  }
}

/* Speed Effects */
.speed-1 .themed-key { transition: all 0.2s ease; }
.speed-2 .themed-key { transition: all 0.15s ease; }
.speed-3 .themed-key { transition: all 0.1s ease; }
.speed-4 .themed-key { transition: all 0.05s ease; }

.speed-3 {
  position: relative;
}

.speed-3::before {
  content: '';
  position: absolute;
  top: 0;
  left: -10px;
  right: -10px;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  animation: speed-lines 0.5s linear infinite;
  pointer-events: none;
}

.speed-4::before {
  animation: speed-lines 0.3s linear infinite;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2), transparent);
}

@keyframes speed-lines {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Accuracy Boost Effect */
.accuracy-boost {
  animation: accuracy-celebration 2s ease-out;
}

@keyframes accuracy-celebration {
  0% { filter: brightness(1); }
  20% { filter: brightness(1.5) saturate(1.3); }
  40% { filter: brightness(1.3) saturate(1.2); }
  60% { filter: brightness(1.4) saturate(1.3); }
  80% { filter: brightness(1.2) saturate(1.1); }
  100% { filter: brightness(1); }
}

/* Error Animation */
.key-error-animation {
  animation: error-shake 0.3s ease-in-out;
  background: var(--theme-error) !important;
}

@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}`;

// Initialize animation controller (singleton)
let animationController: ThemeAnimationController | null = null;

export function initializeAnimationController(): ThemeAnimationController {
  if (!animationController) {
    animationController = new ThemeAnimationController();
    
    // Inject streak effects CSS
    const style = document.createElement('style');
    style.id = 'streak-effects-css';
    style.textContent = streakEffectsCSS;
    document.head.appendChild(style);
  }
  return animationController;
}

export function getAnimationController(): ThemeAnimationController | null {
  return animationController;
}