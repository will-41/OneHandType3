import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Eye, 
  Droplets,
  Sparkles,
  Contrast,
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
  Shield
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
  unlockTiers
} from '../lib/themes/theme-unlock-system';
import { 
  applyThemeToDocument,
  generateCompleteThemeCSS,
  injectThemeCSS
} from '../lib/themes/theme-css-system';

interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  cssVariables: Record<string, string>;
  accessibility: {
    wcagLevel: 'AA' | 'AAA';
    contrastRatio: number;
    colorBlindFriendly: boolean;
  };
}

interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
  };
  effects: {
    glassEffect: boolean;
    gradients: boolean;
    shadows: boolean;
    animations: boolean;
  };
}

// Predefined premium themes
const premiumThemes: ThemeConfig[] = [
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Calming blues and teals for focus',
    preview: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
      background: '#f0f9ff',
      text: '#0c4a6e'
    },
    cssVariables: {
      '--primary': '8 145 178',
      '--secondary': '14 116 144',
      '--accent': '6 182 212',
      '--background': '240 249 255',
      '--foreground': '12 74 110'
    },
    accessibility: {
      wcagLevel: 'AA',
      contrastRatio: 4.8,
      colorBlindFriendly: true
    }
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm oranges and purples for energy',
    preview: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f59e0b',
      background: '#fff7ed',
      text: '#9a3412'
    },
    cssVariables: {
      '--primary': '234 88 12',
      '--secondary': '220 38 38',
      '--accent': '245 158 11',
      '--background': '255 247 237',
      '--foreground': '154 52 18'
    },
    accessibility: {
      wcagLevel: 'AA',
      contrastRatio: 5.2,
      colorBlindFriendly: true
    }
  },
  {
    id: 'forest-zen',
    name: 'Forest Zen',
    description: 'Natural greens for mindful typing',
    preview: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: '#f0fdf4',
      text: '#064e3b'
    },
    cssVariables: {
      '--primary': '5 150 105',
      '--secondary': '4 120 87',
      '--accent': '16 185 129',
      '--background': '240 253 244',
      '--foreground': '6 78 59'
    },
    accessibility: {
      wcagLevel: 'AAA',
      contrastRatio: 7.1,
      colorBlindFriendly: true
    }
  },
  {
    id: 'midnight-code',
    name: 'Midnight Code',
    description: 'Dark theme optimized for coding',
    preview: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#8b5cf6',
      background: '#0f0f23',
      text: '#e2e8f0'
    },
    cssVariables: {
      '--primary': '99 102 241',
      '--secondary': '79 70 229',
      '--accent': '139 92 246',
      '--background': '15 15 35',
      '--foreground': '226 232 240'
    },
    accessibility: {
      wcagLevel: 'AA',
      contrastRatio: 4.5,
      colorBlindFriendly: false
    }
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum accessibility and readability',
    preview: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#0066cc',
      background: '#ffffff',
      text: '#000000'
    },
    cssVariables: {
      '--primary': '0 0 0',
      '--secondary': '51 51 51',
      '--accent': '0 102 204',
      '--background': '255 255 255',
      '--foreground': '0 0 0'
    },
    accessibility: {
      wcagLevel: 'AAA',
      contrastRatio: 21,
      colorBlindFriendly: true
    }
  }
];

// Color picker component
const ColorPicker: React.FC<{
  label: string;
  color: string;
  onChange: (color: string) => void;
}> = ({ label, color, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

// Theme preview component
const ThemePreview: React.FC<{
  theme: ThemeConfig;
  isActive: boolean;
  onSelect: () => void;
}> = ({ theme, isActive, onSelect }) => {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2",
        isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      )}
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Color palette preview */}
        <div className="flex gap-1 h-6">
          <div 
            className="flex-1 rounded-l" 
            style={{ backgroundColor: theme.preview.primary }}
          />
          <div 
            className="flex-1" 
            style={{ backgroundColor: theme.preview.secondary }}
          />
          <div 
            className="flex-1" 
            style={{ backgroundColor: theme.preview.accent }}
          />
          <div 
            className="flex-1 rounded-r" 
            style={{ backgroundColor: theme.preview.background }}
          />
        </div>
        
        {/* Theme info */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold">{theme.name}</h4>
            {isActive && (
              <Badge className="bg-blue-500">Active</Badge>
            )}
          </div>
          <p className="text-sm opacity-75 mb-2">{theme.description}</p>
          
          {/* Accessibility badges */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              WCAG {theme.accessibility.wcagLevel}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {theme.accessibility.contrastRatio}:1
            </Badge>
            {theme.accessibility.colorBlindFriendly && (
              <Badge variant="outline" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                CB Friendly
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Custom theme builder
const CustomThemeBuilder: React.FC<{
  customTheme: CustomTheme;
  onThemeChange: (theme: CustomTheme) => void;
  theme: string;
}> = ({ customTheme, onThemeChange, theme }) => {
  const handleColorChange = (key: keyof CustomTheme['colors'], color: string) => {
    onThemeChange({
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [key]: color
      }
    });
  };

  const handleAccessibilityChange = (key: keyof CustomTheme['accessibility'], value: boolean) => {
    onThemeChange({
      ...customTheme,
      accessibility: {
        ...customTheme.accessibility,
        [key]: value
      }
    });
  };

  const handleEffectChange = (key: keyof CustomTheme['effects'], value: boolean) => {
    onThemeChange({
      ...customTheme,
      effects: {
        ...customTheme.effects,
        [key]: value
      }
    });
  };

  return (
    <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Palette className="w-6 h-6 text-purple-500" />
        Custom Theme Builder
      </h3>
      
      <div className="space-y-6">
        {/* Color palette */}
        <div>
          <h4 className="font-semibold mb-4">Color Palette</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Primary Color"
              color={customTheme.colors.primary}
              onChange={(color) => handleColorChange('primary', color)}
            />
            <ColorPicker
              label="Secondary Color"
              color={customTheme.colors.secondary}
              onChange={(color) => handleColorChange('secondary', color)}
            />
            <ColorPicker
              label="Accent Color"
              color={customTheme.colors.accent}
              onChange={(color) => handleColorChange('accent', color)}
            />
            <ColorPicker
              label="Background Color"
              color={customTheme.colors.background}
              onChange={(color) => handleColorChange('background', color)}
            />
            <ColorPicker
              label="Surface Color"
              color={customTheme.colors.surface}
              onChange={(color) => handleColorChange('surface', color)}
            />
            <ColorPicker
              label="Text Color"
              color={customTheme.colors.text}
              onChange={(color) => handleColorChange('text', color)}
            />
          </div>
        </div>

        {/* Accessibility options */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-blue-500" />
            Accessibility
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">High Contrast</div>
                <div className="text-sm opacity-75">Enhanced contrast for better visibility</div>
              </div>
              <Switch
                checked={customTheme.accessibility.highContrast}
                onCheckedChange={(value) => handleAccessibilityChange('highContrast', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Reduced Motion</div>
                <div className="text-sm opacity-75">Minimize animations and transitions</div>
              </div>
              <Switch
                checked={customTheme.accessibility.reducedMotion}
                onCheckedChange={(value) => handleAccessibilityChange('reducedMotion', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Large Text</div>
                <div className="text-sm opacity-75">Increase base font size</div>
              </div>
              <Switch
                checked={customTheme.accessibility.largeText}
                onCheckedChange={(value) => handleAccessibilityChange('largeText', value)}
              />
            </div>
          </div>
        </div>

        {/* Visual effects */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Visual Effects
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Glass Effect</div>
                <div className="text-sm opacity-75">Frosted glass backdrop blur</div>
              </div>
              <Switch
                checked={customTheme.effects.glassEffect}
                onCheckedChange={(value) => handleEffectChange('glassEffect', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Gradients</div>
                <div className="text-sm opacity-75">Gradient backgrounds and elements</div>
              </div>
              <Switch
                checked={customTheme.effects.gradients}
                onCheckedChange={(value) => handleEffectChange('gradients', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Shadows</div>
                <div className="text-sm opacity-75">Drop shadows and depth effects</div>
              </div>
              <Switch
                checked={customTheme.effects.shadows}
                onCheckedChange={(value) => handleEffectChange('shadows', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Animations</div>
                <div className="text-sm opacity-75">Smooth transitions and micro-animations</div>
              </div>
              <Switch
                checked={customTheme.effects.animations}
                onCheckedChange={(value) => handleEffectChange('animations', value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Export Theme
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share Theme
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Main premium theme system component
const PremiumThemeSystem: React.FC<{ className?: string }> = ({ className }) => {
  const { themeMode } = useTypingStore();
  const [activeTheme, setActiveTheme] = useState('ocean-breeze');
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    id: 'custom',
    name: 'My Custom Theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b'
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false
    },
    effects: {
      glassEffect: true,
      gradients: true,
      shadows: true,
      animations: true
    }
  });

  // Apply theme to document
  useEffect(() => {
    const selectedTheme = premiumThemes.find(t => t.id === activeTheme);
    if (selectedTheme) {
      Object.entries(selectedTheme.cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [activeTheme]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className={`p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Palette className="w-8 h-8" />
              Premium Theme System
            </h2>
            <p className="text-indigo-200">Customize your typing experience with premium themes</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCustomBuilder(!showCustomBuilder)}
              className="bg-white/20 hover:bg-white/30"
            >
              <Settings className="w-4 h-4 mr-2" />
              Custom Builder
            </Button>
          </div>
        </div>
      </Card>

      {/* Theme selection */}
      <div>
        <h3 className="text-xl font-bold mb-4">Premium Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumThemes.map((theme) => (
            <ThemePreview
              key={theme.id}
              theme={theme}
              isActive={activeTheme === theme.id}
              onSelect={() => setActiveTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* Custom theme builder */}
      {showCustomBuilder && (
        <CustomThemeBuilder
          customTheme={customTheme}
          onThemeChange={setCustomTheme}
          theme={themeMode}
        />
      )}

      {/* Theme features */}
      <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className="text-xl font-bold mb-4">Theme Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Accessibility className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Accessibility First</h4>
            <p className="text-sm opacity-75">WCAG AA/AAA compliant with high contrast ratios</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Color Blind Friendly</h4>
            <p className="text-sm opacity-75">Designed for all types of color vision</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Premium Effects</h4>
            <p className="text-sm opacity-75">Glass morphism, gradients, and smooth animations</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Full Customization</h4>
            <p className="text-sm opacity-75">Create and share your own unique themes</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PremiumThemeSystem;