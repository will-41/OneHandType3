// Enhanced Audio Engine for Award-Winning Mobile Experience
export interface AudioSettings {
  masterVolume: number;
  typingVolume: number;
  successVolume: number;
  errorVolume: number;
  backgroundMusicVolume: number;
  enabled: boolean;
  typingSoundEnabled: boolean;
  feedbackSoundEnabled: boolean;
  backgroundMusicEnabled: boolean;
}

export interface HapticSettings {
  enabled: boolean;
  intensity: 'light' | 'medium' | 'heavy';
  typingFeedback: boolean;
  successFeedback: boolean;
  errorFeedback: boolean;
  navigationFeedback: boolean;
}

// Audio Context Management for Mobile
class MobileAudioEngine {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private isInitialized = false;
  private activeOscillators: OscillatorNode[] = [];
  private activeBufferSources: AudioBufferSourceNode[] = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Use Web Audio API for better mobile performance
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain nodes for different audio categories
      const categories = ['typing', 'success', 'error', 'background'];
      categories.forEach(category => {
        const gainNode = this.audioContext!.createGain();
        gainNode.connect(this.audioContext!.destination);
        this.gainNodes.set(category, gainNode);
      });

      // Load audio samples optimized for mobile
      await this.loadAudioSamples();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  private async loadAudioSamples(): Promise<void> {
    // Generate programmatic audio samples for better mobile compatibility
    const sampleConfigs = [
      { name: 'keypress', frequency: 800, duration: 0.1, type: 'typing' },
      { name: 'success', frequency: 600, duration: 0.3, type: 'success' },
      { name: 'error', frequency: 300, duration: 0.2, type: 'error' },
      { name: 'achievement', frequency: 880, duration: 0.5, type: 'success' },
      { name: 'completion', frequency: 1200, duration: 0.4, type: 'success' }
    ];

    for (const config of sampleConfigs) {
      const buffer = this.generateTone(config.frequency, config.duration);
      this.sounds.set(config.name, buffer);
    }
  }

  private generateTone(frequency: number, duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      // Create a more pleasant tone with envelope
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3); // Exponential decay
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }

    return buffer;
  }

  async playSound(soundName: string, category: 'typing' | 'success' | 'error' | 'background' = 'typing'): Promise<void> {
    if (!this.isInitialized || !this.audioContext) return;

    try {
      // Resume audio context if suspended (mobile requirement)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const buffer = this.sounds.get(soundName);
      const gainNode = this.gainNodes.get(category);
      
      if (!buffer || !gainNode) return;

      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode);
      
      // Track the buffer source for cleanup
      this.activeBufferSources.push(source);
      
      // Add onended handler to remove from tracking array when playback completes
      source.onended = () => {
        const index = this.activeBufferSources.indexOf(source);
        if (index !== -1) {
          this.activeBufferSources.splice(index, 1);
        }
      };
      
      source.start();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  setVolume(category: string, volume: number): void {
    const gainNode = this.gainNodes.get(category);
    if (gainNode) {
      gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  // Background Music with Web Audio API
  async playBackgroundMusic(): Promise<void> {
    // Generate ambient background music procedurally
    if (!this.audioContext) return;

    // First, stop any existing background music oscillators
    this.stopBackgroundMusic();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.gainNodes.get('background')!;
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
    
    // Create a gentle ambient sound
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    
    oscillator.connect(gainNode);
    
    // Track this oscillator in our collection for cleanup
    this.activeOscillators.push(oscillator);
    
    oscillator.start();
    
    // Auto-stop after reasonable time to prevent battery drain
    setTimeout(() => {
      this.removeOscillator(oscillator);
    }, 300000); // 5 minutes
  }
  
  // Method to stop all active background music oscillators
  stopBackgroundMusic(): void {
    // Stop all active oscillators used for background music
    while (this.activeOscillators.length > 0) {
      const oscillator = this.activeOscillators[0];
      this.removeOscillator(oscillator);
    }
  }

  // Method to safely remove an oscillator and clean up resources
  removeOscillator(oscillator: OscillatorNode): void {
    try {
      // Stop the oscillator if it's running
      oscillator.stop();
      // Disconnect from audio graph
      oscillator.disconnect();
    } catch (e) {
      // Oscillator may already be stopped or disconnected
      console.warn('Failed to stop oscillator:', e);
    }

    // Remove from the tracking array
    const index = this.activeOscillators.indexOf(oscillator);
    if (index !== -1) {
      this.activeOscillators.splice(index, 1);
    }
  }
}

// Haptic Feedback Engine for Mobile
class MobileHapticEngine {
  private settings: HapticSettings = {
    enabled: true,
    intensity: 'medium',
    typingFeedback: true,
    successFeedback: true,
    errorFeedback: true,
    navigationFeedback: true
  };

  private getVibrationPattern(type: 'typing' | 'success' | 'error' | 'navigation'): number[] {
    const patterns = {
      typing: [10], // Short tap
      success: [50, 50, 100], // Success pattern
      error: [100, 100, 100], // Error pattern
      navigation: [20] // Navigation tap
    };

    const intensity = this.settings.intensity;
    const multiplier = intensity === 'light' ? 0.5 : intensity === 'heavy' ? 1.5 : 1;
    
    return patterns[type].map(duration => Math.round(duration * multiplier));
  }

  async vibrate(type: 'typing' | 'success' | 'error' | 'navigation'): Promise<void> {
    if (!this.settings.enabled) return;
    if (!navigator.vibrate) return;

    const settingMap = {
      typing: this.settings.typingFeedback,
      success: this.settings.successFeedback,
      error: this.settings.errorFeedback,
      navigation: this.settings.navigationFeedback
    };

    if (!settingMap[type]) return;

    try {
      const pattern = this.getVibrationPattern(type);
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  updateSettings(newSettings: Partial<HapticSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  getSettings(): HapticSettings {
    return { ...this.settings };
  }
}

// Combined Audio-Haptic Feedback Manager
export class MobileFeedbackManager {
  private audioEngine = new MobileAudioEngine();
  private hapticEngine = new MobileHapticEngine();
  private audioSettings: AudioSettings = {
    masterVolume: 0.7,
    typingVolume: 0.8,
    successVolume: 0.9,
    errorVolume: 0.6,
    backgroundMusicVolume: 0.3,
    enabled: true,
    typingSoundEnabled: true,
    feedbackSoundEnabled: true,
    backgroundMusicEnabled: false
  };

  async initialize(): Promise<void> {
    await this.audioEngine.initialize();
    this.updateAudioSettings(this.audioSettings);
  }

  // Typing feedback
  async onKeyPress(isCorrect: boolean = true): Promise<void> {
    if (isCorrect) {
      await Promise.all([
        this.audioEngine.playSound('keypress', 'typing'),
        this.hapticEngine.vibrate('typing')
      ]);
    } else {
      await Promise.all([
        this.audioEngine.playSound('error', 'error'),
        this.hapticEngine.vibrate('error')
      ]);
    }
  }

  // Success feedback
  async onSuccess(type: 'achievement' | 'completion' | 'milestone' = 'completion'): Promise<void> {
    const soundMap = {
      achievement: 'achievement',
      completion: 'completion',
      milestone: 'success'
    };

    await Promise.all([
      this.audioEngine.playSound(soundMap[type], 'success'),
      this.hapticEngine.vibrate('success')
    ]);
  }

  // Navigation feedback
  async onNavigation(): Promise<void> {
    await this.hapticEngine.vibrate('navigation');
  }

  // Settings management
  updateAudioSettings(settings: Partial<AudioSettings>): void {
    this.audioSettings = { ...this.audioSettings, ...settings };
    
    // Apply volume settings
    this.audioEngine.setVolume('typing', this.audioSettings.typingVolume * this.audioSettings.masterVolume);
    this.audioEngine.setVolume('success', this.audioSettings.successVolume * this.audioSettings.masterVolume);
    this.audioEngine.setVolume('error', this.audioSettings.errorVolume * this.audioSettings.masterVolume);
    this.audioEngine.setVolume('background', this.audioSettings.backgroundMusicVolume * this.audioSettings.masterVolume);
  }

  updateHapticSettings(settings: Partial<HapticSettings>): void {
    this.hapticEngine.updateSettings(settings);
  }

  getAudioSettings(): AudioSettings {
    return { ...this.audioSettings };
  }

  getHapticSettings(): HapticSettings {
    return this.hapticEngine.getSettings();
  }

  // Background music control
  async startBackgroundMusic(): Promise<void> {
    if (this.audioSettings.backgroundMusicEnabled) {
      await this.audioEngine.playBackgroundMusic();
    }
  }

  // Battery optimization - stop all audio/haptic when app goes to background
  onAppBackground(): void {
    // Reduce audio processing when app is backgrounded
    this.updateAudioSettings({ backgroundMusicEnabled: false });
  }

  onAppForeground(): void {
    // Restore settings when app comes back to foreground
    this.updateAudioSettings({ backgroundMusicEnabled: true });
  }
  
  // Cleanup method to prevent memory leaks
  cleanup(): void {
    // Stop all audio
    this.updateAudioSettings({
      enabled: false,
      backgroundMusicEnabled: false,
      typingSoundEnabled: false,
      feedbackSoundEnabled: false
    });
    
    // Cleanup all audio engine resources
    if (this.audioEngine && typeof (this.audioEngine as any).stopBackgroundMusic === 'function') {
      (this.audioEngine as any).stopBackgroundMusic();
    }
  }
}

// Singleton instance for global use
export const mobileFeedbackManager = new MobileFeedbackManager();