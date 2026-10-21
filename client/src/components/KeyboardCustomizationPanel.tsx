import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Palette, 
  Crown, 
  Star, 
  Trophy, 
  Zap, 
  Lock, 
  Unlock, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Award, 
  Flame, 
  Diamond, 
  Heart,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Settings,
  CheckCircle,
  Gift
} from 'lucide-react';

// Enhanced Theme System
interface KeyboardTheme {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: 'accessibility' | 'gaming' | 'professional' | 'creative' | 'achievement';
  unlockRequirement: {
    type: 'wpm' | 'accuracy' | 'streak' | 'lessons' | 'time' | 'layout' | 'achievement';
    value: number;
    description: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    keyFill: string;
    keyBorder: string;
    textPrimary: string;
    textSecondary: string;
  };
  effects: {
    keyPress: 'ripple' | 'glow' | 'pulse' | 'particle' | 'wave' | 'spark' | 'none';
    backgroundPattern: 'solid' | 'gradient' | 'animated' | 'particle';
    specialEffects?: string[];
  };
  accessibility: {
    contrastRatio: number;
    wcagLevel: 'AA' | 'AAA';
    colorblindFriendly: boolean;
    reducedMotion: boolean;
  };
  preview: string; // CSS gradient or color for preview
}

const keyboardThemes: KeyboardTheme[] = [
  // Starter Themes (Always Available)
  {
    id: 'default_rainbow',
    name: 'Rainbow Classic',
    description: 'The original colorful finger-guide theme',
    rarity: 'common',
    category: 'accessibility',
    unlockRequirement: { type: 'wpm', value: 0, description: 'Available from start' },
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      accent: 'hsl(var(--accent))',
      background: 'hsl(var(--background))',
      keyFill: 'hsl(var(--card))',
      keyBorder: 'hsl(var(--border))',
      textPrimary: 'hsl(var(--foreground))',
      textSecondary: 'hsl(var(--muted-foreground))'
    },
    effects: { keyPress: 'ripple', backgroundPattern: 'solid' },
    accessibility: { contrastRatio: 7.1, wcagLevel: 'AAA', colorblindFriendly: true, reducedMotion: true },
    preview: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)'
  },

  // Accessibility Themes
  {
    id: 'high_contrast',
    name: 'High Contrast Pro',
    description: 'Maximum contrast for enhanced visibility',
    rarity: 'common',
    category: 'accessibility',
    unlockRequirement: { type: 'wpm', value: 15, description: 'Reach 15 WPM typing speed' },
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#ffff00',
      background: '#ffffff',
      keyFill: '#000000',
      keyBorder: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc'
    },
    effects: { keyPress: 'glow', backgroundPattern: 'solid' },
    accessibility: { contrastRatio: 21, wcagLevel: 'AAA', colorblindFriendly: true, reducedMotion: true },
    preview: 'linear-gradient(90deg, #000000, #ffffff)'
  },

  // Gaming Themes
  {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon',
    description: 'Electric blues and hot pinks with particle effects',
    rarity: 'rare',
    category: 'gaming',
    unlockRequirement: { type: 'wpm', value: 30, description: 'Achieve 30 WPM typing speed' },
    colors: {
      primary: '#00ffff',
      secondary: '#ff0080',
      accent: '#ffff00',
      background: '#0a0a0a',
      keyFill: '#1a1a2e',
      keyBorder: '#00ffff',
      textPrimary: '#ffffff',
      textSecondary: '#00ffff'
    },
    effects: { keyPress: 'particle', backgroundPattern: 'animated', specialEffects: ['neon-glow', 'particle-trail'] },
    accessibility: { contrastRatio: 4.8, wcagLevel: 'AA', colorblindFriendly: false, reducedMotion: false },
    preview: 'linear-gradient(135deg, #00ffff, #ff0080, #ffff00)'
  },

  // Professional Themes
  {
    id: 'corporate_blue',
    name: 'Corporate Professional',
    description: 'Clean and sophisticated for work environments',
    rarity: 'common',
    category: 'professional',
    unlockRequirement: { type: 'time', value: 60, description: 'Practice for 1 hour total' },
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#f8fafc',
      keyFill: '#ffffff',
      keyBorder: '#e2e8f0',
      textPrimary: '#1e293b',
      textSecondary: '#64748b'
    },
    effects: { keyPress: 'pulse', backgroundPattern: 'gradient' },
    accessibility: { contrastRatio: 5.2, wcagLevel: 'AA', colorblindFriendly: true, reducedMotion: true },
    preview: 'linear-gradient(135deg, #1e40af, #64748b, #0ea5e9)'
  },

  // Creative Themes
  {
    id: 'aurora_borealis',
    name: 'Aurora Borealis',
    description: 'Northern lights dancing across your keyboard',
    rarity: 'epic',
    category: 'creative',
    unlockRequirement: { type: 'streak', value: 7, description: 'Maintain a 7-day practice streak' },
    colors: {
      primary: '#10b981',
      secondary: '#3b82f6',
      accent: '#8b5cf6',
      background: '#0f172a',
      keyFill: '#1e293b',
      keyBorder: '#10b981',
      textPrimary: '#f0f9ff',
      textSecondary: '#10b981'
    },
    effects: { keyPress: 'wave', backgroundPattern: 'animated', specialEffects: ['aurora-wave', 'color-shift'] },
    accessibility: { contrastRatio: 4.5, wcagLevel: 'AA', colorblindFriendly: true, reducedMotion: false },
    preview: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6, #ec4899)'
  },

  // Achievement Themes
  {
    id: 'maltron_master',
    name: 'Maltron Master',
    description: 'Exclusive theme for Maltron layout mastery',
    rarity: 'legendary',
    category: 'achievement',
    unlockRequirement: { type: 'layout', value: 60, description: 'Achieve 60+ WPM on Maltron layout' },
    colors: {
      primary: '#dc2626',
      secondary: '#fbbf24',
      accent: '#f59e0b',
      background: '#1c1917',
      keyFill: '#292524',
      keyBorder: '#dc2626',
      textPrimary: '#fef3c7',
      textSecondary: '#fbbf24'
    },
    effects: { keyPress: 'spark', backgroundPattern: 'animated', specialEffects: ['legendary-aura', 'master-glow'] },
    accessibility: { contrastRatio: 4.7, wcagLevel: 'AA', colorblindFriendly: false, reducedMotion: false },
    preview: 'linear-gradient(135deg, #dc2626, #fbbf24, #f59e0b)'
  },

  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'For the fastest fingers in the digital realm',
    rarity: 'mythic',
    category: 'achievement',
    unlockRequirement: { type: 'wpm', value: 80, description: 'Reach legendary 80+ WPM speed' },
    colors: {
      primary: '#b91c1c',
      secondary: '#f97316',
      accent: '#fbbf24',
      background: '#0c0a09',
      keyFill: '#1c1917',
      keyBorder: '#b91c1c',
      textPrimary: '#fed7aa',
      textSecondary: '#f97316'
    },
    effects: { keyPress: 'particle', backgroundPattern: 'animated', specialEffects: ['speed-trail', 'mythic-particles', 'fire-effect'] },
    accessibility: { contrastRatio: 4.9, wcagLevel: 'AA', colorblindFriendly: false, reducedMotion: false },
    preview: 'linear-gradient(135deg, #b91c1c, #f97316, #fbbf24, #dc2626)'
  }
];

interface KeyboardCustomizationPanelProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  onClose?: () => void;
}

const KeyboardCustomizationPanel: React.FC<KeyboardCustomizationPanelProps> = ({
  currentTheme,
  onThemeChange,
  onClose
}) => {
  const { personalStats, currentWpm, accuracy, currentStreak } = useTypingStore();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewTimer, setPreviewTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate user progress for unlocks
  const userProgress = useMemo(() => {
    return {
      wpm: personalStats?.bestWpm || 0,
      accuracy: personalStats?.bestAccuracy || 0,
      streak: currentStreak || 0,
      lessons: Object.keys(personalStats?.lessons || {}).length,
      time: personalStats?.totalTimeTyped || 0, // in minutes
    };
  }, [personalStats, currentStreak]);

  // Filter and categorize themes
  const categorizedThemes = useMemo(() => {
    const filtered = selectedCategory === 'all' 
      ? keyboardThemes 
      : keyboardThemes.filter(theme => theme.category === selectedCategory);

    const unlocked = filtered.filter(theme => isThemeUnlocked(theme, userProgress));
    const locked = filtered.filter(theme => !isThemeUnlocked(theme, userProgress));

    return { unlocked, locked };
  }, [selectedCategory, userProgress]);

  const categories = [
    { id: 'all', name: 'All Themes', icon: Palette },
    { id: 'accessibility', name: 'Accessibility', icon: Eye },
    { id: 'gaming', name: 'Gaming', icon: Zap },
    { id: 'professional', name: 'Professional', icon: Settings },
    { id: 'creative', name: 'Creative', icon: Sparkles },
    { id: 'achievement', name: 'Achievement', icon: Trophy }
  ];

  function isThemeUnlocked(theme: KeyboardTheme, progress: typeof userProgress): boolean {
    switch (theme.unlockRequirement.type) {
      case 'wpm':
        return progress.wpm >= theme.unlockRequirement.value;
      case 'accuracy':
        return progress.accuracy >= theme.unlockRequirement.value;
      case 'streak':
        return progress.streak >= theme.unlockRequirement.value;
      case 'lessons':
        return progress.lessons >= theme.unlockRequirement.value;
      case 'time':
        return progress.time >= theme.unlockRequirement.value;
      case 'layout':
        // For layout-specific achievements, check layout-specific stats
        return progress.wpm >= theme.unlockRequirement.value;
      default:
        return false;
    }
  }

  const getRarityColor = (rarity: KeyboardTheme['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'mythic': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getRarityIcon = (rarity: KeyboardTheme['rarity']) => {
    switch (rarity) {
      case 'common': return Star;
      case 'rare': return Award;
      case 'epic': return Crown;
      case 'legendary': return Trophy;
      case 'mythic': return Diamond;
      default: return Star;
    }
  };

  const handleThemePreview = (themeId: string) => {
    if (previewTimer) clearTimeout(previewTimer);
    
    setPreviewMode(true);
    onThemeChange(themeId);
    
    const timer = setTimeout(() => {
      setPreviewMode(false);
      onThemeChange(currentTheme);
    }, 3000);
    
    setPreviewTimer(timer);
  };

  const handleThemeSelect = (themeId: string) => {
    if (previewTimer) {
      clearTimeout(previewTimer);
      setPreviewTimer(null);
    }
    setPreviewMode(false);
    setSelectedTheme(themeId);
    onThemeChange(themeId);
  };

  const renderThemeCard = (theme: KeyboardTheme, isUnlocked: boolean) => {
    const RarityIcon = getRarityIcon(theme.rarity);
    const isSelected = selectedTheme === theme.id;
    
    return (
      <Card 
        key={theme.id}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg relative overflow-hidden",
          isSelected && "ring-2 ring-primary border-primary",
          !isUnlocked && "opacity-60",
          isUnlocked ? "hover:scale-105" : "cursor-not-allowed"
        )}
        onClick={() => isUnlocked && handleThemeSelect(theme.id)}
      >
        {/* Rarity Indicator */}
        <div className={cn(
          "absolute top-2 right-2 p-1 rounded-full border",
          getRarityColor(theme.rarity)
        )}>
          <RarityIcon className="h-3 w-3" />
        </div>

        {/* Lock Overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <div className="bg-black/80 rounded-full p-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">{theme.name}</CardTitle>
              <Badge className={cn("text-xs mt-1", getRarityColor(theme.rarity))}>
                {theme.rarity}
              </Badge>
            </div>
            {isSelected && isUnlocked && (
              <CheckCircle className="h-5 w-5 text-primary" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Theme Preview */}
          <div 
            className="h-16 rounded-lg border-2 relative overflow-hidden"
            style={{ background: theme.preview }}
          >
            {theme.effects.backgroundPattern === 'animated' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            )}
            <div className="absolute bottom-1 left-1">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 h-2 rounded-sm bg-white/30 border border-white/50"
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{theme.description}</p>

          {/* Accessibility Info */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {theme.accessibility.wcagLevel}
              </Badge>
              {theme.accessibility.colorblindFriendly && (
                <Eye className="h-3 w-3 text-green-600" />
              )}
            </div>
            <div className="text-muted-foreground">
              {Math.round(theme.accessibility.contrastRatio * 10) / 10}:1
            </div>
          </div>

          {/* Unlock Requirement */}
          {!isUnlocked && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                🔒 {theme.unlockRequirement.description}
              </div>
              <Progress 
                value={getUnlockProgress(theme, userProgress)} 
                className="h-1"
              />
            </div>
          )}

          {/* Action Buttons */}
          {isUnlocked && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleThemePreview(theme.id);
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              {theme.id !== selectedTheme && (
                <Button 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThemeSelect(theme.id);
                  }}
                >
                  <Palette className="h-3 w-3 mr-1" />
                  Select
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  function getUnlockProgress(theme: KeyboardTheme, progress: typeof userProgress): number {
    const requirement = theme.unlockRequirement;
    let current = 0;
    
    switch (requirement.type) {
      case 'wpm':
        current = progress.wpm;
        break;
      case 'accuracy':
        current = progress.accuracy;
        break;
      case 'streak':
        current = progress.streak;
        break;
      case 'lessons':
        current = progress.lessons;
        break;
      case 'time':
        current = progress.time;
        break;
      case 'layout':
        current = progress.wpm;
        break;
    }
    
    return Math.min((current / requirement.value) * 100, 100);
  }

  const unlockedCount = categorizedThemes.unlocked.length;
  const totalCount = keyboardThemes.length;

  return (
    <div className="space-y-6 max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Palette className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Keyboard Themes</h2>
            <p className="text-sm text-muted-foreground">
              {unlockedCount}/{totalCount} themes unlocked
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {previewMode && (
            <Badge variant="secondary" className="animate-pulse">
              <Play className="h-3 w-3 mr-1" />
              Preview Mode
            </Badge>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{userProgress.wpm}</div>
              <div className="text-xs text-muted-foreground">Best WPM</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{Math.round(userProgress.accuracy)}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">{userProgress.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">{unlockedCount}</div>
              <div className="text-xs text-muted-foreground">Themes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0"
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Theme Collection */}
      <ScrollArea className="flex-1">
        <div className="space-y-6">
          {/* Unlocked Themes */}
          {categorizedThemes.unlocked.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Unlock className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Available Themes</h3>
                <Badge variant="secondary">{categorizedThemes.unlocked.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedThemes.unlocked.map(theme => renderThemeCard(theme, true))}
              </div>
            </div>
          )}

          {/* Locked Themes */}
          {categorizedThemes.locked.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Locked Themes</h3>
                <Badge variant="outline">{categorizedThemes.locked.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedThemes.locked.map(theme => renderThemeCard(theme, false))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Preview Controls */}
      {previewMode && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <span className="font-medium">Preview Mode Active</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (previewTimer) {
                    clearTimeout(previewTimer);
                    setPreviewTimer(null);
                  }
                  setPreviewMode(false);
                  onThemeChange(currentTheme);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  if (previewTimer) {
                    clearTimeout(previewTimer);
                    setPreviewTimer(null);
                  }
                  setPreviewMode(false);
                  setSelectedTheme(selectedTheme);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Keep Theme
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyboardCustomizationPanel;