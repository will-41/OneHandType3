import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Palette, 
  Eye, 
  Sparkles,
  Accessibility,
  Settings,
  Download,
  Share2,
  Trophy,
  Crown,
  Zap,
  Star,
  Lock,
  CheckCircle,
  TrendingUp,
  Filter,
  Search,
  Shuffle,
  Heart,
  Award,
  Target,
  Gamepad2,
  Briefcase,
  Brush,
  Shield,
  ChevronRight,
  Info,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';

// Import theme system
import type { 
  KeyboardTheme, 
  ThemeCategory, 
  ThemeRarity, 
  UnlockTier,
  ThemeCustomization,
  UserThemeProfile
} from '../lib/types/theme-system';
import { 
  allThemes, 
  themesByCategory, 
  getThemeById,
  getThemesByRarity,
  getCompatibleThemes
} from '../lib/themes/theme-definitions';
import { 
  checkThemeUnlock,
  getUnlockableThemes,
  calculateTierProgress,
  createDefaultThemeProfile,
  unlockTiers,
  checkSpecialConditions
} from '../lib/themes/theme-unlock-system';
import { 
  applyThemeToDocument,
  generateCompleteThemeCSS,
  injectThemeCSS
} from '../lib/themes/theme-css-system';

// ============================================================================
// THEME CATEGORY ICONS AND COLORS
// ============================================================================

const categoryConfig = {
  accessibility: {
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    textColor: 'text-blue-700 dark:text-blue-300',
    name: 'Accessibility'
  },
  gaming: {
    icon: Gamepad2,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    textColor: 'text-purple-700 dark:text-purple-300',
    name: 'Gaming'
  },
  professional: {
    icon: Briefcase,
    color: 'from-gray-500 to-slate-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
    textColor: 'text-gray-700 dark:text-gray-300',
    name: 'Professional'
  },
  creative: {
    icon: Brush,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    textColor: 'text-orange-700 dark:text-orange-300',
    name: 'Creative'
  },
  achievement: {
    icon: Trophy,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    name: 'Achievement'
  }
};

const rarityConfig = {
  common: { color: 'text-gray-600', bg: 'bg-gray-100', icon: Star },
  uncommon: { color: 'text-green-600', bg: 'bg-green-100', icon: Star },
  rare: { color: 'text-blue-600', bg: 'bg-blue-100', icon: Star },
  epic: { color: 'text-purple-600', bg: 'bg-purple-100', icon: Crown },
  legendary: { color: 'text-orange-600', bg: 'bg-orange-100', icon: Crown },
  mythic: { color: 'text-pink-600', bg: 'bg-pink-100', icon: Crown }
};

// ============================================================================
// THEME PREVIEW COMPONENT
// ============================================================================

interface ThemePreviewProps {
  theme: KeyboardTheme;
  isSelected: boolean;
  isUnlocked: boolean;
  onSelect: () => void;
  onPreview?: () => void;
  showAnimations?: boolean;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ 
  theme, 
  isSelected, 
  isUnlocked, 
  onSelect, 
  onPreview,
  showAnimations = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const categoryInfo = categoryConfig[theme.category];
  const rarityInfo = rarityConfig[theme.rarity];
  const IconComponent = categoryInfo.icon;
  const RarityIcon = rarityInfo.icon;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:scale-105 hover:shadow-xl",
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md',
        !isUnlocked && 'opacity-75',
        showAnimations && theme.effects.animations && 'animate-pulse'
      )}
      onClick={isUnlocked ? onSelect : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Theme Preview Header */}
      <div className="relative h-24 overflow-hidden">
        {/* Color Palette Preview */}
        <div className="absolute inset-0 flex">
          {theme.colorPalette.map((color, index) => (
            <div
              key={index}
              className="flex-1 transition-all duration-300"
              style={{ 
                backgroundColor: color,
                transform: `translateY(${isHovered ? '-2px' : '0px'})`
              }}
            />
          ))}
        </div>
        
        {/* Overlay with category and rarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-3">
          <div className="flex items-center gap-2">
            <IconComponent className={cn("w-4 h-4", categoryInfo.textColor)} />
            <Badge variant="secondary" className="text-xs">
              {categoryInfo.name}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <RarityIcon className={cn("w-3 h-3", rarityInfo.color)} />
            <span className={cn("text-xs font-medium", rarityInfo.color)}>
              {theme.rarity}
            </span>
          </div>
        </div>

        {/* Lock overlay for locked themes */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white/80" />
          </div>
        )}
      </div>

      {/* Theme Information */}
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-sm truncate">{theme.name}</h4>
            {isSelected && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {theme.description}
          </p>
        </div>

        {/* Theme Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {theme.accessibility.wcagLevel && (
              <Badge variant="outline" className="text-xs">
                WCAG {theme.accessibility.wcagLevel}
              </Badge>
            )}
            {theme.accessibility.colorBlindFriendly && (
              <Eye className="w-3 h-3 text-green-500" />
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="w-3 h-3" />
            <span>{theme.popularity}</span>
          </div>
        </div>

        {/* Unlock Requirements (if locked) */}
        {!isUnlocked && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3" />
                <span>Requirements:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {theme.unlockRequirements.averageWPM && (
                  <li>{theme.unlockRequirements.averageWPM} WPM average</li>
                )}
                {theme.unlockRequirements.averageAccuracy && (
                  <li>{theme.unlockRequirements.averageAccuracy}% accuracy</li>
                )}
                {theme.unlockRequirements.lessonsCompleted && (
                  <li>{theme.unlockRequirements.lessonsCompleted} lessons completed</li>
                )}
                {theme.unlockRequirements.practiceHours && (
                  <li>{theme.unlockRequirements.practiceHours} hours practice</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isUnlocked && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant={isSelected ? "default" : "secondary"}
              className="flex-1 text-xs"
              onClick={onSelect}
            >
              {isSelected ? 'Active' : 'Select'}
            </Button>
            {onPreview && (
              <Button size="sm" variant="outline" onClick={onPreview}>
                <Eye className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* New Theme Indicator */}
      {theme.isNew && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-red-500 text-white text-xs animate-pulse">
            NEW
          </Badge>
        </div>
      )}

      {/* Limited Time Indicator */}
      {theme.isLimitedTime && (
        <div className="absolute top-2 left-2">
          <Badge className="bg-amber-500 text-white text-xs">
            LIMITED
          </Badge>
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// TIER PROGRESS COMPONENT
// ============================================================================

interface TierProgressProps {
  currentTier: UnlockTier;
  progress: number;
  nextTier: UnlockTier | null;
}

const TierProgress: React.FC<TierProgressProps> = ({ currentTier, progress, nextTier }) => {
  const currentTierInfo = unlockTiers[currentTier];
  const nextTierInfo = nextTier ? unlockTiers[nextTier] : null;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              {currentTierInfo.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentTierInfo.description}
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Tier {['starter', 'intermediate', 'advanced', 'expert', 'master'].indexOf(currentTier) + 1}
          </Badge>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to {nextTierInfo?.name}</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-xs text-muted-foreground">
              <p>Next tier unlocks: {nextTierInfo?.rewards.specialFeatures.join(', ')}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {currentTierInfo.rewards.themesUnlocked}
            </div>
            <div className="text-xs text-muted-foreground">Themes Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {currentTierInfo.rewards.specialFeatures.length}
            </div>
            <div className="text-xs text-muted-foreground">Special Features</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// THEME CUSTOMIZATION PANEL
// ============================================================================

interface ThemeCustomizationPanelProps {
  theme: KeyboardTheme;
  customization: ThemeCustomization;
  onCustomizationChange: (customization: ThemeCustomization) => void;
}

const ThemeCustomizationPanel: React.FC<ThemeCustomizationPanelProps> = ({
  theme,
  customization,
  onCustomizationChange
}) => {
  const updateCustomization = (updates: Partial<ThemeCustomization>) => {
    onCustomizationChange({ ...customization, ...updates });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h3 className="text-lg font-bold">Customize Theme</h3>
      </div>

      {/* Brightness, Saturation, Contrast */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Brightness: {customization.brightness}%
          </label>
          <Slider
            value={[customization.brightness]}
            onValueChange={([value]) => updateCustomization({ brightness: value })}
            min={50}
            max={150}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Saturation: {customization.saturation}%
          </label>
          <Slider
            value={[customization.saturation]}
            onValueChange={([value]) => updateCustomization({ saturation: value })}
            min={0}
            max={200}
            step={10}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Contrast: {customization.contrast}%
          </label>
          <Slider
            value={[customization.contrast]}
            onValueChange={([value]) => updateCustomization({ contrast: value })}
            min={50}
            max={200}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Animation Speed */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Animation Speed: {customization.animationSpeed}x
        </label>
        <Slider
          value={[customization.animationSpeed]}
          onValueChange={([value]) => updateCustomization({ animationSpeed: value })}
          min={0.5}
          max={3}
          step={0.1}
          className="w-full"
        />
      </div>

      {/* Particle Intensity */}
      {theme.effects.particles && (
        <div>
          <label className="text-sm font-medium mb-2 block">
            Particle Intensity: {customization.particleIntensity}%
          </label>
          <Slider
            value={[customization.particleIntensity]}
            onValueChange={([value]) => updateCustomization({ particleIntensity: value })}
            min={0}
            max={200}
            step={10}
            className="w-full"
          />
        </div>
      )}

      {/* Accessibility Overrides */}
      <div className="space-y-3 pt-4 border-t">
        <h4 className="font-medium flex items-center gap-2">
          <Accessibility className="w-4 h-4" />
          Accessibility Overrides
        </h4>
        
        <div className="flex items-center justify-between">
          <label className="text-sm">Force High Contrast</label>
          <Switch
            checked={customization.forceHighContrast}
            onCheckedChange={(checked) => updateCustomization({ forceHighContrast: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">Disable Animations</label>
          <Switch
            checked={customization.disableAnimations}
            onCheckedChange={(checked) => updateCustomization({ disableAnimations: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">Enlarge Text</label>
          <Switch
            checked={customization.enlargeText}
            onCheckedChange={(checked) => updateCustomization({ enlargeText: checked })}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => updateCustomization({
            brightness: 100,
            saturation: 100,
            contrast: 100,
            animationSpeed: 1,
            particleIntensity: 100,
            forceHighContrast: false,
            disableAnimations: false,
            enlargeText: false
          })}
        >
          Reset
        </Button>
        <Button size="sm" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface EnhancedPremiumThemeSystemProps {
  className?: string;
}

const EnhancedPremiumThemeSystem: React.FC<EnhancedPremiumThemeSystemProps> = ({ 
  className 
}) => {
  const { 
    themeMode, 
    keyboardLayout, 
    stats,
    selectedColorTheme,
    setColorTheme 
  } = useTypingStore();

  // Theme system state
  const [userProfile, setUserProfile] = useState<UserThemeProfile>(createDefaultThemeProfile());
  const [selectedThemeId, setSelectedThemeId] = useState<string>('high-contrast-classic');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Default customization
  const [customization, setCustomization] = useState<ThemeCustomization>({
    brightness: 100,
    saturation: 100,
    contrast: 100,
    animationSpeed: 1,
    particleIntensity: 100,
    forceHighContrast: false,
    disableAnimations: false,
    enlargeText: false
  });

  // Mock user stats (would come from actual typing store)
  const userStats = useMemo(() => ({
    totalCharactersTyped: stats.totalCharactersTyped || 15000,
    averageWPM: stats.bestWpm || 42,
    averageAccuracy: stats.bestAccuracy || 88,
    practiceHours: Math.floor(stats.totalTimeTyped / 60) || 25,
    lessonsCompleted: Object.keys(stats.lessons).length || 18,
    consecutiveDays: 12, // Would track this separately
    perfectLessons: 8, // Would track this separately
    layoutMastery: { 'maltron': 75, 'dvorak': 45, 'artsey': 30 },
    specialConditions: checkSpecialConditions({
      totalCharactersTyped: stats.totalCharactersTyped || 15000,
      averageWPM: stats.bestWpm || 42,
      averageAccuracy: stats.bestAccuracy || 88,
      practiceHours: Math.floor(stats.totalTimeTyped / 60) || 25,
      lessonsCompleted: Object.keys(stats.lessons).length || 18,
      consecutiveDays: 12,
      perfectLessons: 8,
      layoutMastery: { 'maltron': 75, 'dvorak': 45, 'artsey': 30 },
      specialConditions: [],
      achievements: []
    }),
    achievements: []
  }), [stats]);

  // Get unlockable themes
  const unlockableThemes = useMemo(() => 
    getUnlockableThemes(userStats), [userStats]
  );

  // Filter themes based on category, search, and unlock status
  const filteredThemes = useMemo(() => {
    let themes = selectedCategory === 'all' ? allThemes : themesByCategory[selectedCategory] || [];
    
    // Filter by search query
    if (searchQuery) {
      themes = themes.filter(theme => 
        theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by keyboard layout compatibility
    themes = getCompatibleThemes(keyboardLayout).filter(theme => 
      themes.some(t => t.id === theme.id)
    );

    return themes.sort((a, b) => {
      // Prioritize unlocked themes
      if (a.isUnlocked !== b.isUnlocked) {
        return a.isUnlocked ? -1 : 1;
      }
      // Then by popularity
      return b.popularity - a.popularity;
    });
  }, [selectedCategory, searchQuery, keyboardLayout]);

  // Calculate tier progress
  const tierProgress = useMemo(() => 
    calculateTierProgress(userProfile.currentTier, userStats), 
    [userProfile.currentTier, userStats]
  );

  // Apply theme when selected
  useEffect(() => {
    const theme = getThemeById(selectedThemeId);
    if (theme) {
      const css = generateCompleteThemeCSS(theme, customization);
      injectThemeCSS(css, 'enhanced-theme-system');
      
      if (!previewMode) {
        applyThemeToDocument(theme, customization);
      }
    }
  }, [selectedThemeId, customization, previewMode]);

  const handleThemeSelect = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme && (theme.isUnlocked || checkThemeUnlock(theme, userStats))) {
      setSelectedThemeId(themeId);
      // Update typing store if needed
      const themeIndex = allThemes.findIndex(t => t.id === themeId);
      if (themeIndex !== -1) {
        setColorTheme(themeIndex);
      }
    }
  };

  const selectedTheme = getThemeById(selectedThemeId);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Palette className="w-8 h-8" />
              Enhanced Theme System
            </h2>
            <p className="text-indigo-200 mt-1">
              Unlock and customize beautiful keyboard themes as you improve your typing
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">{userProfile.unlockedThemes.length}</div>
            <div className="text-indigo-200 text-sm">Themes Unlocked</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold">{userStats.averageWPM}</div>
            <div className="text-indigo-200 text-xs">Avg WPM</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{userStats.averageAccuracy}%</div>
            <div className="text-indigo-200 text-xs">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{userStats.practiceHours}h</div>
            <div className="text-indigo-200 text-xs">Practice</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{unlockableThemes.length}</div>
            <div className="text-indigo-200 text-xs">Available</div>
          </div>
        </div>
      </Card>

      {/* Tier Progress */}
      <TierProgress 
        currentTier={userProfile.currentTier}
        progress={tierProgress.progress}
        nextTier={tierProgress.nextTier}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Browser */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                <TabsList className="grid grid-cols-6 w-full sm:w-auto">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="accessibility" className="text-xs">
                    <Shield className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger value="gaming" className="text-xs">
                    <Gamepad2 className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger value="professional" className="text-xs">
                    <Briefcase className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger value="creative" className="text-xs">
                    <Brush className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger value="achievement" className="text-xs">
                    <Trophy className="w-3 h-3" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredThemes.map((theme) => (
              <ThemePreview
                key={theme.id}
                theme={theme}
                isSelected={theme.id === selectedThemeId}
                isUnlocked={theme.isUnlocked || checkThemeUnlock(theme, userStats)}
                onSelect={() => handleThemeSelect(theme.id)}
                onPreview={() => {
                  setPreviewMode(true);
                  setSelectedThemeId(theme.id);
                  setTimeout(() => setPreviewMode(false), 3000);
                }}
              />
            ))}
          </div>

          {filteredThemes.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No themes found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your search or category filter.</p>
              </div>
            </Card>
          )}
        </div>

        {/* Theme Details and Customization */}
        <div className="space-y-4">
          {selectedTheme && (
            <>
              {/* Selected Theme Info */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{selectedTheme.name}</h3>
                      <Badge className={cn("text-xs", rarityConfig[selectedTheme.rarity].bg, rarityConfig[selectedTheme.rarity].color)}>
                        {selectedTheme.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedTheme.description}
                    </p>
                  </div>

                  {/* Theme Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTheme.effects.animations && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Animations
                        </Badge>
                      )}
                      {selectedTheme.effects.particles && (
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Particles
                        </Badge>
                      )}
                      {selectedTheme.effects.glassEffect && (
                        <Badge variant="outline" className="text-xs">
                          Glass Effect
                        </Badge>
                      )}
                      {selectedTheme.accessibility.colorBlindFriendly && (
                        <Badge variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          CB Friendly
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowCustomization(!showCustomization)}
                      className="flex-1"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Theme Customization */}
              {showCustomization && (
                <ThemeCustomizationPanel
                  theme={selectedTheme}
                  customization={customization}
                  onCustomizationChange={setCustomization}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPremiumThemeSystem;