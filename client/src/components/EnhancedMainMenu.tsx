/* eslint-disable */
/* @jsx React.createElement */
/* @jsxFrag React.Fragment */
// React import fixed for TypeScript compatibility
import * as React from 'react';
const { useState, useEffect } = React;
import { useTheme } from 'next-themes';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { toast } from './ui/use-toast';
import { 
  Play, 
  Trophy, 
  Users, 
  BarChart, 
  Settings, 
  Book, 
  Volume2, 
  Share2,
  Target,
  Zap,
  Award,
  TrendingUp,
  Activity,
  Keyboard,
  Star,
  Timer,
  Flame,
  Crown,
  Hand,
  Palette,
  Sun,
  Moon,
  Eye,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

// Import components and data
import { type Lesson, lessons } from '../lib/lessons';
import ComprehensiveSettingsPanel from './ComprehensiveSettingsPanel';
import SmartLearningSystem from './SmartLearningSystem';
import LessonWithAds from './LessonWithAds';
import CurriculumProgressIntegration from './CurriculumProgressIntegration';
import SwipeableLessonSelector from './SwipeableLessonSelector';

// Fallback component that should never be used - SwipeableLessonSelector exists separately
const FallbackLessonSelector: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  console.log('CRITICAL: This fallback component should not be rendering - using real SwipeableLessonSelector');
  return null;
};



const AdvancedAnalytics: React.FC<{ stats: any; onBack: () => void }> = ({ stats, onBack }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <span>←</span> Back to Menu
      </Button>
    </div>
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Performance Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{stats.bestWpm || 0}</div>
          <div className="text-sm opacity-75">Best WPM</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{stats.bestAccuracy || 0}%</div>
          <div className="text-sm opacity-75">Best Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">{Math.round((stats.totalTimeTyped || 0) / 60)}</div>
          <div className="text-sm opacity-75">Minutes Practiced</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">{stats.completedLessons || 0}</div>
          <div className="text-sm opacity-75">Lessons Completed</div>
        </div>
      </div>
    </Card>
  </div>
);

const SoundFeedbackSystem: React.FC = () => {
  const { 
    accessibilitySettings, 
    setKeyClickSoundEnabled, 
    setBackgroundMusicEnabled,
    setSoundVolume 
  } = useTypingStore();

  const handleAudioConfigure = (type: 'keypress' | 'background') => {
    toast({
      title: `${type === 'keypress' ? 'Key Press' : 'Background Music'} Settings`,
      description: `${type === 'keypress' ? 'Key press sounds' : 'Background music'} ${accessibilitySettings[type === 'keypress' ? 'keyClickSoundEnabled' : 'backgroundMusicEnabled'] ? 'disabled' : 'enabled'}!`,
      duration: 3000,
    });

    if (type === 'keypress') {
      setKeyClickSoundEnabled(!accessibilitySettings.keyClickSoundEnabled);
    } else {
      setBackgroundMusicEnabled(!accessibilitySettings.backgroundMusicEnabled);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Audio Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Key Press Sounds</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAudioConfigure('keypress')}
          >
            {accessibilitySettings.keyClickSoundEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Background Music</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAudioConfigure('background')}
          >
            {accessibilitySettings.backgroundMusicEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Volume: {accessibilitySettings.soundVolume}%</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={accessibilitySettings.soundVolume}
            onChange={(e) => setSoundVolume(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
    </Card>
  );
};

const SocialSharing: React.FC<{ sessionStats: { wpm: number; accuracy: number; timeSpent: number; lessonCompleted: string } }> = ({ sessionStats }) => {
  const { stats, completedLessons } = useTypingStore();

  const handleShare = async () => {
    const shareData = {
      title: 'OneHandType - My Typing Progress',
      text: `I've completed ${completedLessons.length} lessons and achieved ${stats.bestWpm || 0} WPM with ${stats.bestAccuracy || 0}% accuracy!`,
      url: window.location.origin,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully! 📱",
          description: "Your progress has been shared!",
          duration: 3000,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text} Check it out at: ${shareData.url}`);
        toast({
          title: "Link Copied! 📋",
          description: "Share text copied to clipboard. Paste it anywhere!",
          duration: 4000,
        });
      }
    } catch (err) {
      toast({
        title: "Share Failed",
        description: "Unable to share. Try copying the link manually.",
        variant: "destructive",
        duration: 3000,
      });
      console.error('Error sharing:', err);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Share Your Progress</h3>
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-sm font-medium">Latest Achievement</div>
          <div className="text-lg">{stats.bestWpm || 0} WPM • {stats.bestAccuracy || 0}% Accuracy</div>
          <div className="text-sm text-gray-600 mt-1">{completedLessons.length} lessons completed</div>
        </div>
        <Button className="w-full" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share on Social Media
        </Button>
      </div>
    </Card>
  );
};

const MobileAccessibilitySettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    handPreference, 
    setHandPreference,
    themeMode, 
    setThemeMode,
    accessibilitySettings,
    updateAccessibilitySettings
  } = useTypingStore();

  return (
    <div className="space-y-6">
      {/* Hand Preference - TOP PRIORITY */}
      <Card className="p-6 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Hand className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-bold text-xl">Hand Preference</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose your dominant hand for optimized typing</p>
            </div>
          </div>
          <Badge className={cn(
            "text-white font-medium px-3 py-1",
            handPreference === 'left' ? 'bg-purple-500' : 'bg-blue-500'
          )}>
            {handPreference.charAt(0).toUpperCase() + handPreference.slice(1)} Hand
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={handPreference === 'left' ? 'default' : 'outline'}
            onClick={() => setHandPreference('left')}
            className={cn(
              "flex items-center justify-center gap-2 p-4 h-auto",
              handPreference === 'left' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'hover:bg-purple-50 dark:hover:bg-purple-950'
            )}
          >
            <Hand className="w-5 h-5 scale-x-[-1]" />
            <div className="text-center">
              <div className="font-medium">Left Hand</div>
              <div className="text-xs opacity-75">Optimized for left-handed typing</div>
            </div>
          </Button>

          <Button
            variant={handPreference === 'right' ? 'default' : 'outline'}
            onClick={() => setHandPreference('right')}
            className={cn(
              "flex items-center justify-center gap-2 p-4 h-auto",
              handPreference === 'right' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'hover:bg-blue-50 dark:hover:bg-blue-950'
            )}
          >
            <Hand className="w-5 h-5" />
            <div className="text-center">
              <div className="font-medium">Right Hand</div>
              <div className="text-xs opacity-75">Optimized for right-handed typing</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme & Appearance
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={themeMode === 'light' ? 'default' : 'outline'}
            onClick={() => setThemeMode('light')}
            className="flex items-center gap-2"
          >
            <Sun className="w-4 h-4" />
            Light Mode
          </Button>
          <Button
            variant={themeMode === 'dark' ? 'default' : 'outline'}
            onClick={() => setThemeMode('dark')}
            className="flex items-center gap-2"
          >
            <Moon className="w-4 h-4" />
            Dark Mode
          </Button>
        </div>
      </Card>

      {/* Sound Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Audio Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Sound Effects</span>
            <Button 
              variant={accessibilitySettings.soundEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({soundEnabled: !accessibilitySettings.soundEnabled})}
            >
              {accessibilitySettings.soundEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Key Click Sounds</span>
            <Button 
              variant={accessibilitySettings.keyClickSoundEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({keyClickSoundEnabled: !accessibilitySettings.keyClickSoundEnabled})}
              disabled={!accessibilitySettings.soundEnabled}
            >
              {accessibilitySettings.keyClickSoundEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Background Music</span>
            <Button 
              variant={accessibilitySettings.backgroundMusicEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({backgroundMusicEnabled: !accessibilitySettings.backgroundMusicEnabled})}
              disabled={!accessibilitySettings.soundEnabled}
            >
              {accessibilitySettings.backgroundMusicEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Typing Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Keyboard className="w-5 h-5" />
          Typing Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Show Virtual Keyboard</span>
            <Button 
              variant={accessibilitySettings.showVirtualKeyboard ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({showVirtualKeyboard: !accessibilitySettings.showVirtualKeyboard})}
            >
              {accessibilitySettings.showVirtualKeyboard ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Finger Guide</span>
            <Button 
              variant={accessibilitySettings.showFingerGuide ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({showFingerGuide: !accessibilitySettings.showFingerGuide})}
              disabled={!accessibilitySettings.showVirtualKeyboard}
            >
              {accessibilitySettings.showFingerGuide ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Highlight Next Key</span>
            <Button 
              variant={accessibilitySettings.highlightNextKey ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({highlightNextKey: !accessibilitySettings.highlightNextKey})}
              disabled={!accessibilitySettings.showVirtualKeyboard}
            >
              {accessibilitySettings.highlightNextKey ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Error Highlighting</span>
            <Button 
              variant={accessibilitySettings.errorHighlighting ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({errorHighlighting: !accessibilitySettings.errorHighlighting})}
            >
              {accessibilitySettings.errorHighlighting ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Auto-Correction</span>
            <Button 
              variant={accessibilitySettings.autoCorrect ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({autoCorrect: !accessibilitySettings.autoCorrect})}
            >
              {accessibilitySettings.autoCorrect ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Accessibility Features */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Accessibility
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>High Contrast Mode</span>
            <Button 
              variant={accessibilitySettings.highContrast ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({highContrast: !accessibilitySettings.highContrast})}
            >
              {accessibilitySettings.highContrast ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Large Text</span>
            <Button 
              variant={accessibilitySettings.largeText ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({largeText: !accessibilitySettings.largeText})}
            >
              {accessibilitySettings.largeText ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Reduced Motion</span>
            <Button 
              variant={accessibilitySettings.reduceMotion ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({reduceMotion: !accessibilitySettings.reduceMotion})}
            >
              {accessibilitySettings.reduceMotion ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Screen Reader Mode</span>
            <Button 
              variant={accessibilitySettings.screenReaderMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({screenReaderMode: !accessibilitySettings.screenReaderMode})}
            >
              {accessibilitySettings.screenReaderMode ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Color Blind Support</span>
            <Button 
              variant={accessibilitySettings.colorBlindMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({colorBlindMode: !accessibilitySettings.colorBlindMode})}
            >
              {accessibilitySettings.colorBlindMode ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Focus Mode</span>
            <Button 
              variant={accessibilitySettings.focusMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({focusMode: !accessibilitySettings.focusMode})}
            >
              {accessibilitySettings.focusMode ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Performance Display */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Performance Display
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Show WPM Counter</span>
            <Button 
              variant={accessibilitySettings.showWPM ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({showWPM: !accessibilitySettings.showWPM})}
            >
              {accessibilitySettings.showWPM ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Show Accuracy</span>
            <Button 
              variant={accessibilitySettings.showAccuracy ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({showAccuracy: !accessibilitySettings.showAccuracy})}
            >
              {accessibilitySettings.showAccuracy ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Show Timer</span>
            <Button 
              variant={accessibilitySettings.showTimer ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateAccessibilitySettings({showTimer: !accessibilitySettings.showTimer})}
            >
              {accessibilitySettings.showTimer ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Close Button */}
      <div className="flex justify-center">
        <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          Save & Close Settings
        </Button>
      </div>
    </div>
  );
};

type MenuView = 'main' | 'lessons' | 'lesson-with-ads' | 'curriculum' | 'ai-coach' | 'analytics' | 'settings' | 'sound' | 'social';

interface MainMenuProps {
  onStartLesson: (lesson: Lesson) => void;
  onStartTutorial?: () => void;
  className?: string;
}

// Floating particles component
const FloatingParticles: React.FC<{ theme: string }> = ({ theme }) => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-300'} animate-pulse`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite alternate`
          }}
        />
      ))}
    </div>
  );
};

// Animated counter component
const AnimatedCounter: React.FC<{ value: number; suffix?: string; prefix?: string; duration?: number }> = ({ 
  value, 
  suffix = '', 
  prefix = '',
  duration = 1000 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{prefix}{count.toFixed(prefix ? 2 : 0)}{suffix}</span>;
};

// Enhanced menu card with advanced animations
const EnhancedMenuCard: React.FC<{
  item: any;
  index: number;
  theme: string;
  onClick: () => void;
}> = ({ item, index, theme, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`group relative p-6 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:rotate-1 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/50 hover:border-slate-500 backdrop-blur-xl' 
          : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 hover:border-gray-300 backdrop-blur-xl'
      } hover:shadow-2xl hover:shadow-${item.color.split('-')[1]}-500/20`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
      onClick={(e) => {
        console.log('=== ENHANCED MENU CARD COMPONENT CLICKED ===');
        console.log('Clicked item:', item.id, item.title);
        console.log('onClick function:', typeof onClick);
        e.preventDefault();
        e.stopPropagation();
        try {
          onClick?.();
          console.log('EnhancedMenuCard onClick executed successfully');
        } catch (error) {
          console.error('Error in EnhancedMenuCard onClick:', error);
        }
        console.log('=== END ENHANCED MENU CARD COMPONENT CLICK ===');
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating animation */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

      {/* Glowing border effect */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${item.color.split('-')[1]}-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl ${item.color} text-white transform transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''} shadow-lg`}>
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </div>
          </div>
          {item.badge && (
            <Badge 
              variant="default" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-bounce shadow-lg"
            >
              {item.badge}
            </Badge>
          )}
        </div>

        <div>
          <h3 className={`text-xl font-bold mb-1 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-600'
          }`}>
            {item.title}
          </h3>
          <p className={`text-sm mb-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-700'
          }`}>
            {item.description}
          </p>
          <div className={`text-xs transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'
          }`}>
            {item.stats}
          </div>
        </div>
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className={`absolute w-0 h-0 bg-white/20 rounded-full transition-all duration-500 ${
          isHovered ? 'w-96 h-96' : ''
        }`} style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      </div>
    </Card>
  );
};

const EnhancedMainMenu: React.FC<MainMenuProps> = ({ onStartLesson, onStartTutorial, className }) => {
  console.log('=== ENHANCED MAIN MENU INIT ===');
  console.log('EnhancedMainMenu: onStartLesson type:', typeof onStartLesson);
  console.log('EnhancedMainMenu: onStartLesson exists:', !!onStartLesson);
  console.log('EnhancedMainMenu: onStartTutorial type:', typeof onStartTutorial);
  console.log('=== END ENHANCED MAIN MENU INIT ===');
  const { themeMode, setThemeMode, stats, completedLessons, handPreference } = useTypingStore();
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState<MenuView>('main');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [timeOfDay, setTimeOfDay] = useState('');

  // Sync theme between useTheme and useTypingStore
  useEffect(() => {
    if (theme !== themeMode) {
      setTheme(themeMode);
    }
  }, [themeMode, theme, setTheme]);

  // Theme toggle function  
  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    setTheme(newTheme);
  };

  // Dynamic gradient based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) setTimeOfDay('night');
    else if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const getTimeGradient = () => {
    const gradients = {
      morning: themeMode === 'dark' 
        ? 'from-slate-800 via-slate-900 to-gray-900' 
        : 'from-orange-50 via-yellow-50 to-blue-50',
      afternoon: themeMode === 'dark'
        ? 'from-slate-800 via-blue-900 to-indigo-900'
        : 'from-blue-50 via-white to-cyan-50',
      evening: themeMode === 'dark'
        ? 'from-purple-900 via-slate-900 to-gray-900'
        : 'from-purple-50 via-pink-50 to-orange-50',
      night: themeMode === 'dark'
        ? 'from-gray-900 via-slate-900 to-black'
        : 'from-gray-100 via-slate-100 to-gray-200'
    };
    return gradients[timeOfDay as keyof typeof gradients] || gradients.morning;
  };

  // Mock session for social sharing
  const mockSessionStats = {
    wpm: stats.bestWpm || 42,
    accuracy: stats.bestAccuracy || 94,
    timeSpent: 15,
    lessonCompleted: 'Home Row Mastery'
  };

  const handleStartLesson = () => {
    console.log('EnhancedMainMenu: handleStartLesson called');
    setCurrentView('lessons');
  };

  const handleLessonSelect = (lesson: Lesson) => {
    console.log('EnhancedMainMenu: handleLessonSelect called with:', lesson);
    if (onStartLesson) {
      onStartLesson(lesson);
    }
  };

  const menuItems = [
    {
      id: 'tutorial',
      title: 'Tutorial',
      description: 'Learn the basics of one-handed typing',
      icon: <Play className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      badge: 'Start Here',
      stats: 'Interactive guide for beginners',
      action: () => onStartTutorial?.()
    },
    {
      id: 'lessons',
      title: 'Start Typing',
      description: 'Practice lessons and improve your skills',
      icon: <Book className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      stats: `${completedLessons.length} lessons completed`,
      action: handleStartLesson
    },
    {
      id: 'curriculum',
      title: 'Realm of Keys Academy',
      description: 'Complete the Ten Realms curriculum',
      icon: <Crown className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-purple-600 to-indigo-700',
      badge: 'NEW',
      stats: 'Gamified learning journey',
      action: () => setCurrentView('curriculum')
    },

    {
      id: 'ai-coach',
      title: 'AI Learning Coach',
      description: 'Personalized recommendations and insights',
      icon: <BarChart className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      badge: 'AI',
      stats: 'Smart analysis & recommendations',
      action: () => setCurrentView('ai-coach')
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Deep insights into your performance',
      icon: <BarChart className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      stats: `${stats.bestWpm || 0} WPM personal best`,
      action: () => setCurrentView('analytics')
    },
    {
      id: 'social',
      title: 'Share Progress',
      description: 'Share achievements and compete',
      icon: <Share2 className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      stats: 'Show your skills',
      badge: 'NEW',
      action: () => setCurrentView('social')
    },
    {
      id: 'sound',
      title: 'Sound Feedback',
      description: 'Dynamic audio experience',
      icon: <Volume2 className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-orange-500 to-amber-600',
      stats: 'Enhance your focus',
      badge: 'NEW',
      action: () => setCurrentView('sound')
    },

  ];

  const quickStats = [
    {
      label: 'Best WPM',
      value: stats.bestWpm || 0,
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Best Accuracy',
      value: stats.bestAccuracy || 0,
      suffix: '%',
      icon: <Target className="h-6 w-6 text-green-500" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Lessons Done',
      value: completedLessons.length,
      icon: <Book className="h-6 w-6 text-purple-500" />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      label: 'Practice Time',
      value: Math.round((stats.totalTimeTyped || 0) / 60),
      suffix: 'm',
      icon: <Timer className="h-6 w-6 text-orange-500" />,
      color: 'from-orange-500 to-amber-500'
    },
    {
      label: 'Streak Days',
      value: 0, // Default since currentStreak doesn't exist
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const renderMainMenu = () => (
    <>
      <FloatingParticles theme={themeMode} />

      <div className="space-y-8 relative z-10">
        {/* Animated Header */}
        <Card className={`p-8 text-center transform transition-all duration-700 hover:scale-105 ${
          themeMode === 'dark' 
            ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/50 backdrop-blur-xl' 
            : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 backdrop-blur-xl'
        } shadow-2xl`}>
          <div className="space-y-6">
            <div className="animate-fadeInUp">
              <h1 className={`text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse ${
                themeMode === 'dark' ? 'drop-shadow-lg' : 'drop-shadow-md'
              }`}>
                OneType
              </h1>
              <p className={`text-xl ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'} animate-slideInUp`}>
                Master one-handed typing with confidence
              </p>
              <Badge 
                variant="outline" 
                className={`mt-3 px-4 py-2 text-lg font-semibold border-2 transition-all duration-300 hover:scale-110 ${
                  themeMode === 'dark' 
                    ? 'border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <Hand className="w-4 h-4 mr-2" />
                {handPreference.charAt(0).toUpperCase() + handPreference.slice(1)} Hand Mode
              </Badge>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
              {quickStats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`group p-4 rounded-xl bg-gradient-to-br ${stat.color} transform transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col items-center text-white">
                    <div className="transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm opacity-90 font-medium">{stat.label}</div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Enhanced Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <EnhancedMenuCard
              key={item.id}
              item={item}
              index={index}
              theme={themeMode}
              onClick={() => {
                console.log('=== ENHANCED MENU CARD CLICKED ===');
                console.log('Card clicked:', item.id, item.title);
                console.log('Action type:', typeof item.action);
                try {
                  item.action();
                  console.log('Card action executed successfully');
                } catch (error) {
                  console.error('Error executing card action:', error);
                }
                console.log('=== END ENHANCED MENU CARD CLICK ===');
              }}
            />
          ))}
        </div>

        {/* Achievement Showcase */}
        <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800/90 border-slate-600/50 backdrop-blur-xl' : 'bg-white/90 border-gray-200/50 backdrop-blur-xl'} shadow-2xl`}>
          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Trophy className="h-6 w-6 text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-xl ${themeMode === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'} transform transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Last Session
                  </div>
                  <div className="text-green-500 font-bold">
                    <AnimatedCounter value={stats.bestWpm || 42} suffix=" WPM • " />
                    <AnimatedCounter value={stats.bestAccuracy || 94} suffix="%" />
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${themeMode === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'} transform transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Weekly Progress
                  </div>
                  <div className="text-blue-500 font-bold">+8 WPM improvement</div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${themeMode === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'} transform transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full animate-pulse">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Achievement
                  </div>
                  <div className="text-yellow-500 font-bold">Speed Demon unlocked!</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );

  const renderCurrentView = () => {
    console.log('EnhancedMainMenu: renderCurrentView called with currentView:', currentView);

    switch (currentView) {
      case 'lessons':
        console.log('EnhancedMainMenu: Rendering SwipeableLessonSelector');
        return (
          <SwipeableLessonSelector
            onStartLesson={(lesson: any) => {
              console.log('EnhancedMainMenu: Passing lesson to main onStartLesson:', lesson);
              onStartLesson(lesson);
            }}
            onBack={() => setCurrentView('main')}
          />
        );
      case 'curriculum':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl font-bold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Realm of Keys Academy
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('main')}
                className={`transition-all duration-300 hover:scale-105 ${
                  themeMode === 'dark' 
                    ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                Back to Menu
              </Button>
            </div>
            <CurriculumProgressIntegration onStartLesson={(lesson) => {
              console.log('EnhancedMainMenu: Realm of Keys lesson passed to main onStartLesson:', lesson);
              // Convert CurriculumLesson to Lesson format
              const convertedLesson = {
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                category: "curriculum" as const,
                level: 1,
                difficulty: lesson.difficulty,
                content: lesson.content,
                text: lesson.content,
                targetWpm: lesson.targetWpm,
                handCompatibility: ["left", "right"] as ("left" | "right")[],
                focusKeys: lesson.keyFocus,
                prerequisites: lesson.prerequisites,
                wordCount: lesson.content.split(' ').length,
                estimatedTime: lesson.estimatedTime,
              };
              onStartLesson(convertedLesson);
            }} />
          </div>
        );

      case 'analytics':
        return (
          <AdvancedAnalytics
            stats={stats}
            onBack={() => setCurrentView('main')}
          />
        );
      case 'sound':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl font-bold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Sound Feedback System
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('main')}
                className={`transition-all duration-300 hover:scale-105 ${
                  themeMode === 'dark' 
                    ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                Back to Menu
              </Button>
            </div>
            <SoundFeedbackSystem />
          </div>
        );
      case 'social':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl font-bold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Share Your Progress
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('main')}
                className={`transition-all duration-300 hover:scale-105 ${
                  themeMode === 'dark' 
                    ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                Back to Menu
              </Button>
            </div>
            <SocialSharing sessionStats={mockSessionStats} />
          </div>
        );
      case 'ai-coach':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl font-bold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AI Learning Coach
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('main')}
                className={`transition-all duration-300 hover:scale-105 ${
                  themeMode === 'dark' 
                    ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                Back to Menu
              </Button>
            </div>
            <SmartLearningSystem />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl font-bold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('main')}
                className={`transition-all duration-300 hover:scale-105 ${
                  themeMode === 'dark' 
                    ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                Back to Menu
              </Button>
            </div>
            <ComprehensiveSettingsPanel onClose={() => setCurrentView('main')} />
          </div>
        );
      default:
        return renderMainMenu();
    }
  };

  return (
    <div className={cn(
      "min-h-screen p-4 transition-all duration-700 relative overflow-hidden",
      `bg-gradient-to-br ${getTimeGradient()}`,
      themeMode === 'dark' ? 'text-white' : 'text-gray-900',
      className
    )}>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Global Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            {currentView !== 'main' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView('main')}
                className={`transition-all duration-300 hover:scale-110 ${
                  themeMode === 'dark' 
                    ? 'text-white hover:bg-slate-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="Back to main menu"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className={`text-2xl font-bold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              OneType
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`transition-all duration-300 hover:scale-110 ${
                themeMode === 'dark' 
                  ? 'text-white hover:bg-slate-700' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('settings')}
              className={`transition-all duration-300 hover:scale-110 ${
                themeMode === 'dark' 
                  ? 'text-white hover:bg-slate-700' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {renderCurrentView()}
      </div>

      {/* Global CSS for animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EnhancedMainMenu;