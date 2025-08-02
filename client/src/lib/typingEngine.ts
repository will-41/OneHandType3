import { 
  type InternationalLayout, 
  type SpecializedLayoutType,
  type ChordMapping,
  isSpecializedLayout,
  getChordMappings,
  findChordForKeys,
  getKeyboardLayout,
  getErgonomicAnalysis
} from "./keyboardLayouts";
import { validateLayoutCompatibility, validateLessonLayoutCompatibility } from './layoutValidator';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  charactersTyped: number;
  errors: number;
  timeElapsed: number;
  consistency: number;
  chordCombinations?: number; // For chord-based layouts like ARTSEY
  layoutSpecificMetrics?: {
    avgErgonomicScore?: number;
    fingerUsageDistribution?: Record<string, number>;
    strainPoints?: string[];
  };
}

export interface TypingResult {
  currentText: string;
  targetText: string;
  cursorPosition: number;
  isCorrect: boolean;
  stats: TypingStats;
  completedWords: number;
  currentWord: string;
  nextWord: string;
  errors: Array<{
    position: number;
    expected: string;
    actual: string;
    timestamp: number;
  }>;
  activeChordKeys?: string[]; // For ARTSEY chord input
  suggestedChord?: ChordMapping; // Suggested chord for next character
  nextExpectedChar?: string; // Character to type next
  fingerHint?: string; // Which finger to use next;
}

export class TypingEngine {
  private targetText: string = '';
  private currentText: string = '';
  private startTime: number = 0;
  private errors: Array<{
    position: number;
    expected: string;
    actual: string;
    timestamp: number;
  }> = [];
  private keystrokeTimes: number[] = [];
  private isStarted: boolean = false;
  private layoutType: InternationalLayout | SpecializedLayoutType = 'qwerty';
  private handPreference: 'left' | 'right' = 'right';
  private activeChordKeys: Set<string> = new Set();
  private chordTimeout: NodeJS.Timeout | null = null;
  private chordCombinations: number = 0;
  private readonly CHORD_TIMEOUT_MS = 500; // Time window for chord completion

  constructor(
    targetText: string, 
    layoutType: InternationalLayout | SpecializedLayoutType = 'qwerty',
    handPreference: 'left' | 'right' = 'right'
  ) {
    // Validate layout compatibility
    const layoutValidation = validateLayoutCompatibility(layoutType, handPreference);
    if (!layoutValidation.isValid) {
      console.warn('Layout validation failed:', layoutValidation.errors);
      // Fallback to QWERTY if validation fails
      this.layoutType = 'qwerty';
    } else {
      this.layoutType = layoutType;
    }

    // Validate lesson compatibility
    const lessonValidation = validateLessonLayoutCompatibility(targetText, this.layoutType);
    if (lessonValidation.warnings.length > 0) {
      console.info('Lesson compatibility warnings:', lessonValidation.warnings);
    }

    this.targetText = targetText;
    this.handPreference = handPreference;
    this.reset();
  }

  reset(): void {
    this.currentText = '';
    this.startTime = 0;
    this.errors = [];
    this.keystrokeTimes = [];
    this.isStarted = false;
    this.activeChordKeys.clear();
    this.chordCombinations = 0;
    if (this.chordTimeout) {
      clearTimeout(this.chordTimeout);
      this.chordTimeout = null;
    }
  }

  setTargetText(text: string): void {
    this.targetText = text;
    this.reset();
  }

  setLayout(layoutType: InternationalLayout | SpecializedLayoutType, handPreference: 'left' | 'right'): void {
    try {
      // Validate the new layout
      const validation = validateLayoutCompatibility(layoutType, handPreference);
      
      if (!validation.isValid) {
        console.error('Cannot switch to invalid layout:', validation.errors);
        throw new Error(`Invalid layout: ${validation.errors.join(', ')}`);
      }

      if (validation.warnings.length > 0) {
        console.warn('Layout switch warnings:', validation.warnings);
      }

      // Clear chord state when switching layouts
      if (this.layoutType !== layoutType) {
        this.clearChordKeys();
      }

      this.layoutType = layoutType;
      this.handPreference = handPreference;
      
      console.info(`Switched to layout: ${layoutType} (${handPreference} hand)`);
    } catch (error) {
      console.error('Failed to switch layout:', error);
      // Keep current layout on error
    }
  }

  processInput(input: string): TypingResult {
    if (!this.isStarted && input.length > 0) {
      this.isStarted = true;
      this.startTime = Date.now();
    }

    // Handle backspace
    if (input.length < this.currentText.length) {
      this.currentText = input;
    } else if (input.length > this.currentText.length) {
      // Add new character
      const newChar = input[input.length - 1];
      this.currentText = input;
      
      // Track keystroke timing
      this.keystrokeTimes.push(Date.now());
      
      // Check for errors
      const position = input.length - 1;
      const expectedChar = this.targetText[position];
      
      if (newChar !== expectedChar && expectedChar !== undefined) {
        this.errors.push({
          position,
          expected: expectedChar,
          actual: newChar,
          timestamp: Date.now()
        });
      }
    }

    return this.getCurrentResult();
  }

  // Track if chord processing is in progress to prevent race conditions
  private isProcessingChord: boolean = false;
  
  // Chord-specific methods for ARTSEY and similar layouts
  processChordInput(keys: string[]): TypingResult {
    if (!isSpecializedLayout(this.layoutType) || this.layoutType !== 'artsey') {
      return this.getCurrentResult();
    }

    if (!this.isStarted && keys.length > 0) {
      this.isStarted = true;
      this.startTime = Date.now();
    }
    
    // Prevent race conditions by skipping if already processing a chord
    if (this.isProcessingChord) {
      return this.getCurrentResult();
    }

    // Update active chord keys
    this.activeChordKeys = new Set(keys);

    // Clear existing timeout safely
    if (this.chordTimeout) {
      clearTimeout(this.chordTimeout);
      this.chordTimeout = null;
    }

    // Set timeout to process chord
    this.chordTimeout = setTimeout(() => {
      this.isProcessingChord = true;
      try {
        this.processChordCompletion();
      } finally {
        this.isProcessingChord = false;
      }
    }, this.CHORD_TIMEOUT_MS);

    return this.getCurrentResult();
  }

  private processChordCompletion(): void {
    // Skip processing if no active chord keys
    if (this.activeChordKeys.size === 0) return;

    // Create a local copy of active chord keys for thread safety
    const chordKeysToProcess = Array.from(this.activeChordKeys);
    
    try {
      const chord = findChordForKeys(chordKeysToProcess, 'artsey');

      if (chord) {
        // Process the chord output atomically
        const newInput = this.currentText + chord.output;
        this.chordCombinations++;
        this.keystrokeTimes.push(Date.now());
        
        // Check for errors
        const position = this.currentText.length;
        const expectedChar = this.targetText[position];
        
        if (chord.output !== expectedChar && expectedChar !== undefined) {
          this.errors.push({
            position,
            expected: expectedChar,
            actual: chord.output,
            timestamp: Date.now()
          });
        }
        
        // Update the current text atomically
        this.currentText = newInput;
      } else {
        // Invalid chord combination
        console.warn('Invalid chord combination:', chordKeysToProcess);
      }
    } catch (error) {
      console.error('Error processing chord completion:', error);
    } finally {
      // Safely clear state
      this.activeChordKeys.clear();
      this.chordTimeout = null;
    }
  }

  addChordKey(key: string): TypingResult {
    this.activeChordKeys.add(key.toLowerCase());
    return this.processChordInput(Array.from(this.activeChordKeys));
  }

  removeChordKey(key: string): TypingResult {
    this.activeChordKeys.delete(key.toLowerCase());
    return this.processChordInput(Array.from(this.activeChordKeys));
  }

  clearChordKeys(): TypingResult {
    this.activeChordKeys.clear();
    if (this.chordTimeout) {
      clearTimeout(this.chordTimeout);
      this.chordTimeout = null;
    }
    return this.getCurrentResult();
  }

  private getCurrentResult(): TypingResult {
    const timeElapsed = this.isStarted ? (Date.now() - this.startTime) / 1000 : 0;
    const stats = this.calculateStats(timeElapsed);
    
    // Split into words for progress tracking
    const words = this.targetText.split(' ');
    const currentWords = this.currentText.split(' ');
    const completedWords = Math.max(0, currentWords.length - 1);
    
    const currentWord = currentWords[completedWords] || '';
    const nextWord = words[completedWords + 1] || '';
    
    // Get next expected character and suggestions
    const nextExpectedChar = this.getNextExpectedChar();
    const activeChordKeys = Array.from(this.activeChordKeys);
    
    // For ARTSEY, find suggested chord for next character
    let suggestedChord: ChordMapping | undefined;
    if (this.layoutType === 'artsey' && nextExpectedChar) {
      const chordMappings = getChordMappings('artsey');
      if (chordMappings) {
        suggestedChord = chordMappings.find(chord => chord.output === nextExpectedChar);
      }
    }
    
    return {
      currentText: this.currentText,
      targetText: this.targetText,
      cursorPosition: this.currentText.length,
      isCorrect: this.isTextCorrectSoFar(),
      stats,
      completedWords,
      currentWord,
      nextWord,
      errors: [...this.errors],
      activeChordKeys: activeChordKeys.length > 0 ? activeChordKeys : undefined,
      suggestedChord,
      nextExpectedChar,
      fingerHint: this.getFingerHint()
    };
  }

  private calculateStats(timeElapsed: number): TypingStats {
    const charactersTyped = this.currentText.length;
    
    // WPM calculation (standard: 5 characters = 1 word)
    const words = charactersTyped / 5;
    const minutes = timeElapsed / 60;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    
    // Accuracy calculation
    const correctChars = charactersTyped - this.errors.length;
    const accuracy = charactersTyped > 0 ? Math.round((correctChars / charactersTyped) * 100) : 100;
    
    // Consistency calculation (based on keystroke timing variance)
    const consistency = this.calculateConsistency();
    
    // Layout-specific metrics
    let layoutSpecificMetrics: TypingStats['layoutSpecificMetrics'] = undefined;
    if (isSpecializedLayout(this.layoutType)) {
      const ergonomicAnalysis = getErgonomicAnalysis(
        this.handPreference, 
        this.layoutType, 
        this.currentText
      );
      
      layoutSpecificMetrics = {
        avgErgonomicScore: ergonomicAnalysis.averageErgonomicScore,
        fingerUsageDistribution: ergonomicAnalysis.fingerUsageDistribution,
        strainPoints: ergonomicAnalysis.strainPoints
      };
    }
    
    return {
      wpm,
      accuracy,
      charactersTyped,
      errors: this.errors.length,
      timeElapsed,
      consistency,
      chordCombinations: this.layoutType === 'artsey' ? this.chordCombinations : undefined,
      layoutSpecificMetrics
    };
  }

  private calculateConsistency(): number {
    if (this.keystrokeTimes.length < 2) return 100;
    
    // Calculate intervals between keystrokes
    const intervals: number[] = [];
    for (let i = 1; i < this.keystrokeTimes.length; i++) {
      intervals.push(this.keystrokeTimes[i] - this.keystrokeTimes[i - 1]);
    }
    
    if (intervals.length === 0) return 100;
    
    // Calculate standard deviation of intervals
    const mean = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to consistency percentage (lower std dev = higher consistency)
    // Normalize using typical typing interval range (50-500ms)
    const normalizedStdDev = Math.min(stdDev / 200, 1);
    return Math.round((1 - normalizedStdDev) * 100);
  }

  private isTextCorrectSoFar(): boolean {
    for (let i = 0; i < this.currentText.length; i++) {
      if (this.currentText[i] !== this.targetText[i]) {
        return false;
      }
    }
    return true;
  }

  isComplete(): boolean {
    return this.currentText === this.targetText;
  }

  getProgress(): number {
    return this.targetText.length > 0 ? (this.currentText.length / this.targetText.length) * 100 : 0;
  }

  getNextExpectedChar(): string {
    return this.targetText[this.currentText.length] || '';
  }

  getCompletionData() {
    const timeElapsed = (Date.now() - this.startTime) / 1000;
    const stats = this.calculateStats(timeElapsed);
    
    return {
      completed: true,
      stats,
      totalTime: timeElapsed,
      errorDetails: this.errors,
      finalAccuracy: stats.accuracy,
      finalWPM: stats.wpm,
      consistency: stats.consistency,
      chordCombinations: this.chordCombinations,
      layoutSpecificMetrics: stats.layoutSpecificMetrics
    };
  }

  private getFingerHint(): string | undefined {
    if (!isSpecializedLayout(this.layoutType)) return undefined;
    
    const nextChar = this.getNextExpectedChar();
    if (!nextChar) return undefined;
    
    try {
      const layout = getKeyboardLayout(this.handPreference, this.layoutType);
      for (const row of layout) {
        for (const key of row) {
          if (key.key === nextChar.toLowerCase() || key.displayKey === nextChar) {
            return key.finger;
          }
        }
      }
    } catch (error) {
      console.warn('Error getting finger hint:', error);
    }
    
    return undefined;
  }

  // Get the current chord state for UI display
  getChordState(): {
    activeKeys: string[];
    suggestedChord?: ChordMapping;
    timeRemaining: number;
  } {
    const activeKeys = Array.from(this.activeChordKeys);
    let suggestedChord: ChordMapping | undefined;
    
    if (activeKeys.length > 0 && this.layoutType === 'artsey') {
      suggestedChord = findChordForKeys(activeKeys, 'artsey') || undefined;
    }
    
    const timeRemaining = this.chordTimeout ? this.CHORD_TIMEOUT_MS : 0;
    
    return {
      activeKeys,
      suggestedChord,
      timeRemaining
    };
  }

  // Force chord completion (for testing or manual triggering)
  forceChordCompletion(): TypingResult {
    if (this.chordTimeout) {
      clearTimeout(this.chordTimeout);
      this.processChordCompletion();
    }
    return this.getCurrentResult();
  }
}