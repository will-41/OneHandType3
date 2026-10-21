import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { Volume2, VolumeX, Music, Zap, Target, AlertTriangle, Settings } from 'lucide-react';

interface SoundFeedbackSystemProps {
  onKeyPress?: (isCorrect: boolean, key: string) => void;
  accuracy?: number;
  wpm?: number;
  isEnabled?: boolean;
}

// Sound frequencies and patterns for different events
const SOUND_PATTERNS = {
  correct: {
    frequency: 800,
    duration: 50,
    type: 'square' as OscillatorType,
    volume: 0.1
  },
  error: {
    frequency: 200,
    duration: 150,
    type: 'sawtooth' as OscillatorType,
    volume: 0.15
  },
  combo: {
    frequencies: [800, 1000, 1200],
    duration: 100,
    type: 'sine' as OscillatorType,
    volume: 0.12
  },
  milestone: {
    frequencies: [440, 554, 659, 880],
    duration: 200,
    type: 'sine' as OscillatorType,
    volume: 0.2
  },
  warning: {
    frequency: 300,
    duration: 300,
    type: 'triangle' as OscillatorType,
    volume: 0.1
  }
};

const SoundFeedbackSystem: React.FC<SoundFeedbackSystemProps> = ({
  onKeyPress,
  accuracy = 100,
  wpm = 0,
  isEnabled = true
}) => {
  const { themeMode } = useTypingStore();
  const audioContext = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [feedbackStyle, setFeedbackStyle] = useState<'minimal' | 'standard' | 'rich'>('standard');
  const [showSettings, setShowSettings] = useState(false);
  
  // Tracking for combo detection
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastKeyTime, setLastKeyTime] = useState(0);
  const [rhythm, setRhythm] = useState<number[]>([]);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContext.current = new AudioContext();
    }
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [isEnabled, soundEnabled]);

  const playSound = (pattern: keyof typeof SOUND_PATTERNS, customParams?: Partial<typeof SOUND_PATTERNS.correct>) => {
    if (!soundEnabled || !isEnabled || !audioContext.current) return;

    const ctx = audioContext.current;
    const basePattern = SOUND_PATTERNS[pattern];
    const params = { ...basePattern, ...customParams };

    if (pattern === 'combo' || pattern === 'milestone') {
      // Play chord/sequence
      const frequencies = (params as any).frequencies as number[];
      frequencies?.forEach((freq: number, index: number) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          oscillator.type = params.type;
          
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(params.volume * volume, ctx.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + params.duration / 1000);
          
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + params.duration / 1000);
        }, index * 50);
      });
    } else {
      // Play single tone
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(params.frequency || 440, ctx.currentTime);
      oscillator.type = params.type;
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(params.volume * volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + params.duration / 1000);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + params.duration / 1000);
    }
  };

  const handleKeyPress = (isCorrect: boolean, key: string) => {
    const now = Date.now();
    const timeSinceLastKey = now - lastKeyTime;
    
    if (feedbackStyle === 'minimal') {
      // Only play sounds for errors in minimal mode
      if (!isCorrect) {
        playSound('error');
      }
    } else if (feedbackStyle === 'standard') {
      // Standard feedback
      if (isCorrect) {
        playSound('correct');
        setCorrectStreak(prev => prev + 1);
        
        // Combo detection
        if (correctStreak > 0 && correctStreak % 10 === 0) {
          playSound('combo');
        }
      } else {
        playSound('error');
        setCorrectStreak(0);
      }
    } else if (feedbackStyle === 'rich') {
      // Rich feedback with dynamic pitch and rhythm
      if (isCorrect) {
        // Vary pitch based on typing speed and accuracy
        const speedMultiplier = Math.min(wpm / 60, 2); // Cap at 2x
        const accuracyMultiplier = accuracy / 100;
        const pitchVariation = 200 + (speedMultiplier * 300) + (accuracyMultiplier * 100);
        
        playSound('correct', { 
          frequency: pitchVariation,
          volume: 0.08 + (accuracyMultiplier * 0.05)
        });
        
        setCorrectStreak(prev => prev + 1);
        
        // Enhanced combo detection
        if (correctStreak > 0) {
          if (correctStreak % 25 === 0) {
            playSound('milestone');
          } else if (correctStreak % 10 === 0) {
            playSound('combo');
          }
        }
        
        // Rhythm tracking
        if (lastKeyTime > 0 && timeSinceLastKey < 1000) {
          setRhythm(prev => [...prev.slice(-4), timeSinceLastKey]);
        }
      } else {
        playSound('error');
        setCorrectStreak(0);
        setRhythm([]);
      }
    }
    
    setLastKeyTime(now);
    onKeyPress?.(isCorrect, key);
  };

  const playTestSound = () => {
    playSound('correct');
    setTimeout(() => playSound('error'), 200);
    setTimeout(() => playSound('combo'), 400);
  };

  // Trigger sound feedback externally
  useEffect(() => {
    if (accuracy < 85 && accuracy > 0) {
      playSound('warning');
    }
  }, [Math.floor(accuracy / 5), playSound, accuracy]); // Include all dependencies

  return (
    <div className="space-y-4">
      {/* Sound Settings Panel */}
      <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Sound Feedback</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="sound-enabled">Enable Sound Feedback</Label>
          <Switch
            id="sound-enabled"
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
          />
        </div>

        {showSettings && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div>
              <Label>Volume: {Math.round(volume * 100)}%</Label>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={1}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Feedback Style</Label>
              <div className="flex gap-2 mt-2">
                {(['minimal', 'standard', 'rich'] as const).map((style) => (
                  <Button
                    key={style}
                    variant={feedbackStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedbackStyle(style)}
                    className="capitalize"
                  >
                    {style}
                  </Button>
                ))}
              </div>
              <div className="text-xs opacity-60 mt-1">
                {feedbackStyle === 'minimal' && 'Only error sounds'}
                {feedbackStyle === 'standard' && 'Standard correct/error feedback'}
                {feedbackStyle === 'rich' && 'Dynamic pitch, combos, and rhythm detection'}
              </div>
            </div>

            <Button onClick={playTestSound} variant="outline" size="sm" className="w-full">
              Test Sound
            </Button>
          </div>
        )}
      </Card>

      {/* Live Feedback Status */}
      {soundEnabled && (
        <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm">Streak: {correctStreak}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Accuracy: {Math.round(accuracy)}%</span>
              </div>
              
              {accuracy < 90 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-500">Low Accuracy Warning</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {feedbackStyle.charAt(0).toUpperCase() + feedbackStyle.slice(1)} Mode
              </Badge>
              {rhythm.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Rhythm: {Math.round(rhythm.reduce((a, b) => a + b, 0) / rhythm.length)}ms
                </Badge>
              )}
            </div>
          </div>

          {/* Combo Milestone Indicators */}
          {correctStreak > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium">Next Milestone:</span>
                <span className="text-xs">
                  {correctStreak < 10 ? `${10 - (correctStreak % 10)} keys to combo` :
                   correctStreak < 25 ? `${25 - (correctStreak % 25)} keys to milestone` :
                   `${50 - (correctStreak % 50)} keys to mega milestone`}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(correctStreak % (correctStreak < 10 ? 10 : correctStreak < 25 ? 25 : 50)) / (correctStreak < 10 ? 10 : correctStreak < 25 ? 25 : 50) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

// Export a hook for easy integration
export const useSoundFeedback = () => {
  const soundSystemRef = useRef<{ handleKeyPress: (isCorrect: boolean, key: string) => void } | null>(null);
  
  const triggerSound = (isCorrect: boolean, key: string = '') => {
    soundSystemRef.current?.handleKeyPress(isCorrect, key);
  };
  
  return { triggerSound, soundSystemRef };
};

export default SoundFeedbackSystem;