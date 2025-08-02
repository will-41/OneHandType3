import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Smartphone, 
  Hand, 
  Keyboard, 
  Eye, 
  Moon, 
  Sun, 
  Type, 
  Zap, 
  Target, 
  Timer, 
  Accessibility,
  Palette,
  RotateCcw,
  X
} from 'lucide-react';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { cn } from '../lib/utils';
import SpecializedLayoutSelector from './SpecializedLayoutSelector';
import { availableLayouts } from '../lib/keyboardLayouts';

interface ComprehensiveSettingsPanelProps {
  onClose?: () => void;
}

const ComprehensiveSettingsPanel: React.FC<ComprehensiveSettingsPanelProps> = ({ onClose }) => {
  const {
    handPreference,
    themeMode,
    keyboardLayout,
    accessibilitySettings,
    setHandPreference,
    setThemeMode,
    setKeyboardLayout,
    setSoundEnabled,
    setBackgroundMusicEnabled,
    setKeyClickSoundEnabled,
    setErrorSoundEnabled,
    setCompletionSoundEnabled,
    setSoundVolume,
    setShowVirtualKeyboard,
    setShowFingerGuide,
    setHighlightNextKey,
    setErrorHighlighting,
    setAutoCorrect,
    setShowWPM,
    setShowAccuracy,
    setShowTimer,
    setHighContrast,
    setLargeText,
    setReducedMotion,
    setScreenReaderMode,
    setColorBlindMode,
    setFocusMode,
    setFontSize,
    setLineHeight,
    setCustomTheme
  } = useTypingStore();

  const [activeTab, setActiveTab] = useState('typing');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);

  // Real-time preview styles based on settings
  const previewStyles = {
    fontSize: `${accessibilitySettings.fontSize}px`,
    lineHeight: accessibilitySettings.lineHeight,
    fontWeight: accessibilitySettings.largeText ? '600' : '400',
    filter: accessibilitySettings.highContrast ? 'contrast(150%)' : 'none',
    backgroundColor: accessibilitySettings.customTheme.backgroundColor,
    color: accessibilitySettings.customTheme.textColor,
    borderColor: accessibilitySettings.customTheme.accentColor
  };

  const FingerGuideDemo: React.FC = () => {
    if (!accessibilitySettings.showFingerGuide) return null;
    
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Finger Guide Active</h4>
        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className="p-2 bg-pink-200 dark:bg-pink-800 rounded text-center">Pinky</div>
          <div className="p-2 bg-yellow-200 dark:bg-yellow-800 rounded text-center">Ring</div>
          <div className="p-2 bg-green-200 dark:bg-green-800 rounded text-center">Middle</div>
          <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded text-center">Index</div>
          <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded text-center">Thumb</div>
        </div>
        <p className="text-xs mt-2 text-blue-600 dark:text-blue-300">
          Color-coded fingers guide you to the correct keys for {handPreference}-hand typing
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="typing" className="flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            Typing
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Accessibility className="w-4 h-4" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Typing Settings */}
        <TabsContent value="typing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hand className="w-5 h-5" />
                Hand Preference
              </CardTitle>
              <CardDescription>
                Choose your dominant hand for optimized keyboard layouts and finger guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant={handPreference === 'left' ? 'default' : 'outline'}
                  onClick={() => setHandPreference('left')}
                  className="flex-1 p-6 h-auto flex-col gap-2"
                >
                  <Hand className="w-6 h-6" />
                  <span className="font-semibold">Left Hand</span>
                  <span className="text-xs opacity-75">Optimized for left-handed typing</span>
                </Button>
                <Button
                  variant={handPreference === 'right' ? 'default' : 'outline'}
                  onClick={() => setHandPreference('right')}
                  className="flex-1 p-6 h-auto flex-col gap-2"
                >
                  <Hand className="w-6 h-6 scale-x-[-1]" />
                  <span className="font-semibold">Right Hand</span>
                  <span className="text-xs opacity-75">Optimized for right-handed typing</span>
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <Badge className="mb-2">Current: {handPreference.charAt(0).toUpperCase() + handPreference.slice(1)} Hand</Badge>
                <p className="text-sm text-muted-foreground">
                  Your keyboard layout and finger guide will be optimized for your {handPreference} hand.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Keyboard Layout
              </CardTitle>
              <CardDescription>
                Choose your preferred keyboard layout for optimal typing efficiency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge>Current: {availableLayouts.find(l => l.id === keyboardLayout)?.name || keyboardLayout.toUpperCase()}</Badge>
                  {['maltron', 'dvorak-one-hand', 'artsey'].includes(keyboardLayout) && (
                    <Badge variant="secondary">Specialized Layout</Badge>
                  )}
                </div>
                <Button
                  onClick={() => setShowLayoutSelector(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Browse All Layouts
                </Button>
              </div>
              
              {/* Quick Layout Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant={keyboardLayout === 'qwerty' ? 'default' : 'outline'}
                  onClick={() => setKeyboardLayout('qwerty')}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <span className="font-semibold">QWERTY</span>
                  <span className="text-xs opacity-75">Standard</span>
                </Button>
                <Button
                  variant={keyboardLayout === 'maltron' ? 'default' : 'outline'}
                  onClick={() => setKeyboardLayout('maltron')}
                  className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800"
                >
                  <Badge variant="secondary" className="text-xs mb-1">Specialized</Badge>
                  <span className="font-semibold">Maltron</span>
                  <span className="text-xs opacity-75">Ergonomic</span>
                </Button>
                <Button
                  variant={keyboardLayout === 'dvorak-one-hand' ? 'default' : 'outline'}
                  onClick={() => setKeyboardLayout('dvorak-one-hand')}
                  className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2 border-green-200 dark:border-green-800"
                >
                  <Badge variant="secondary" className="text-xs mb-1">Specialized</Badge>
                  <span className="font-semibold">Dvorak 1H</span>
                  <span className="text-xs opacity-75">One-Hand</span>
                </Button>
                <Button
                  variant={keyboardLayout === 'artsey' ? 'default' : 'outline'}
                  onClick={() => setKeyboardLayout('artsey')}
                  className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-2 border-orange-200 dark:border-orange-800"
                >
                  <Badge variant="secondary" className="text-xs mb-1">Specialized</Badge>
                  <span className="font-semibold">ARTSEY</span>
                  <span className="text-xs opacity-75">Chord</span>
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {keyboardLayout === 'qwerty' && "Standard QWERTY layout - familiar and widely used"}
                  {keyboardLayout === 'dvorak' && "Dvorak layout - optimized for English typing efficiency"}
                  {keyboardLayout === 'colemak' && "Colemak layout - modern alternative with better ergonomics"}
                  {keyboardLayout === 'maltron' && "Maltron layout - ergonomic frequency-based design for reduced strain"}
                  {keyboardLayout === 'dvorak-one-hand' && "Single-hand Dvorak - optimized for one-handed typing efficiency"}
                  {keyboardLayout === 'artsey' && "ARTSEY - 8-key chord system for maximum accessibility"}
                </p>
                
                {keyboardLayout === 'artsey' && (
                  <div className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      <strong>ARTSEY Note:</strong> This layout uses chord combinations. Press multiple keys simultaneously to type letters. Start with A-R-T-S keys.
                    </p>
                  </div>
                )}
                
                {['maltron', 'dvorak-one-hand'].includes(keyboardLayout) && (
                  <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Specialized Layout:</strong> This layout is optimized for single-hand typing with improved ergonomics and reduced strain.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Specialized Layout Selector Modal */}
          {showLayoutSelector && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-background rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                <SpecializedLayoutSelector
                  currentLayout={keyboardLayout}
                  onLayoutChange={(layout) => {
                    setKeyboardLayout(layout);
                    setShowLayoutSelector(false);
                  }}
                  onClose={() => setShowLayoutSelector(false)}
                />
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Virtual Keyboard & Guidance</CardTitle>
              <CardDescription>Configure visual aids for typing assistance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="virtual-keyboard">Show Virtual Keyboard</Label>
                  <p className="text-sm text-muted-foreground">Display on-screen keyboard</p>
                </div>
                <Switch
                  id="virtual-keyboard"
                  checked={accessibilitySettings.showVirtualKeyboard}
                  onCheckedChange={setShowVirtualKeyboard}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="finger-guide">Show Finger Guide</Label>
                  <p className="text-sm text-muted-foreground">Color-coded finger positioning guide</p>
                </div>
                <Switch
                  id="finger-guide"
                  checked={accessibilitySettings.showFingerGuide}
                  onCheckedChange={setShowFingerGuide}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="highlight-key">Highlight Next Key</Label>
                  <p className="text-sm text-muted-foreground">Highlight the next key to press</p>
                </div>
                <Switch
                  id="highlight-key"
                  checked={accessibilitySettings.highlightNextKey}
                  onCheckedChange={setHighlightNextKey}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="error-highlight">Error Highlighting</Label>
                  <p className="text-sm text-muted-foreground">Highlight typing errors in real-time</p>
                </div>
                <Switch
                  id="error-highlight"
                  checked={accessibilitySettings.errorHighlighting}
                  onCheckedChange={setErrorHighlighting}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-correct">Auto-Correct</Label>
                  <p className="text-sm text-muted-foreground">Automatically fix common mistakes</p>
                </div>
                <Switch
                  id="auto-correct"
                  checked={accessibilitySettings.autoCorrect}
                  onCheckedChange={setAutoCorrect}
                />
              </div>

              <FingerGuideDemo />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics Display</CardTitle>
              <CardDescription>Choose which performance metrics to show</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-wpm" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Show WPM (Words Per Minute)
                  </Label>
                </div>
                <Switch
                  id="show-wpm"
                  checked={accessibilitySettings.showWPM}
                  onCheckedChange={setShowWPM}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-accuracy" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Show Accuracy Percentage
                  </Label>
                </div>
                <Switch
                  id="show-accuracy"
                  checked={accessibilitySettings.showAccuracy}
                  onCheckedChange={setShowAccuracy}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-timer" className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Show Timer
                  </Label>
                </div>
                <Switch
                  id="show-timer"
                  checked={accessibilitySettings.showTimer}
                  onCheckedChange={setShowTimer}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Display</CardTitle>
              <CardDescription>Customize how text appears during typing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="font-size">Font Size: {accessibilitySettings.fontSize}px</Label>
                <Slider
                  id="font-size"
                  min={12}
                  max={32}
                  step={1}
                  value={[accessibilitySettings.fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small (12px)</span>
                  <span>Large (32px)</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="line-height">Line Height: {accessibilitySettings.lineHeight}</Label>
                <Slider
                  id="line-height"
                  min={1.0}
                  max={2.5}
                  step={0.1}
                  value={[accessibilitySettings.lineHeight]}
                  onValueChange={(value) => setLineHeight(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Compact (1.0)</span>
                  <span>Spacious (2.5)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="large-text">Large Text Mode</Label>
                  <p className="text-sm text-muted-foreground">Use bold, larger text throughout the app</p>
                </div>
                <Switch
                  id="large-text"
                  checked={accessibilitySettings.largeText}
                  onCheckedChange={setLargeText}
                />
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <Label>Live Preview</Label>
                <div 
                  className="p-4 border rounded-lg transition-all duration-300"
                  style={previewStyles}
                >
                  <p>The quick brown fox jumps over the lazy dog.</p>
                  <p>This is how your text will appear with current settings.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio Settings */}
        <TabsContent value="audio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sound Effects</CardTitle>
              <CardDescription>Configure audio feedback and volume levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="audio-feedback">Master Audio</Label>
                  <p className="text-sm text-muted-foreground">Enable all sound effects</p>
                </div>
                <Switch
                  id="audio-feedback"
                  checked={accessibilitySettings.audioFeedback}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              {accessibilitySettings.audioFeedback && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="volume">Master Volume: {accessibilitySettings.soundVolume}%</Label>
                    <Slider
                      id="volume"
                      min={0}
                      max={100}
                      step={5}
                      value={[accessibilitySettings.soundVolume]}
                      onValueChange={(value) => setSoundVolume(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Silent</span>
                      <span>Max</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="bg-music">Background Music</Label>
                      <p className="text-sm text-muted-foreground">Ambient music during typing</p>
                    </div>
                    <Switch
                      id="bg-music"
                      checked={accessibilitySettings.backgroundMusicEnabled}
                      onCheckedChange={setBackgroundMusicEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="key-sounds">Key Click Sounds</Label>
                      <p className="text-sm text-muted-foreground">Sound for each keystroke</p>
                    </div>
                    <Switch
                      id="key-sounds"
                      checked={accessibilitySettings.keyClickSoundEnabled}
                      onCheckedChange={setKeyClickSoundEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="error-sounds">Error Sounds</Label>
                      <p className="text-sm text-muted-foreground">Audio feedback for mistakes</p>
                    </div>
                    <Switch
                      id="error-sounds"
                      checked={accessibilitySettings.errorSoundEnabled}
                      onCheckedChange={setErrorSoundEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="completion-sounds">Completion Sounds</Label>
                      <p className="text-sm text-muted-foreground">Celebration sounds for achievements</p>
                    </div>
                    <Switch
                      id="completion-sounds"
                      checked={accessibilitySettings.completionSoundEnabled}
                      onCheckedChange={setCompletionSoundEnabled}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Settings */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Accessibility</CardTitle>
              <CardDescription>Settings for users with visual impairments or preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Enhance text visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={accessibilitySettings.highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and effects</p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={accessibilitySettings.reduceMotion}
                  onCheckedChange={setReducedMotion}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="screen-reader">Screen Reader Mode</Label>
                  <p className="text-sm text-muted-foreground">Optimize for screen readers</p>
                </div>
                <Switch
                  id="screen-reader"
                  checked={accessibilitySettings.screenReaderMode}
                  onCheckedChange={setScreenReaderMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="color-blind">Color Blind Support</Label>
                  <p className="text-sm text-muted-foreground">Alternative color schemes</p>
                </div>
                <Switch
                  id="color-blind"
                  checked={accessibilitySettings.colorBlindMode}
                  onCheckedChange={setColorBlindMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="focus-mode">Focus Mode</Label>
                  <p className="text-sm text-muted-foreground">Minimize distractions</p>
                </div>
                <Switch
                  id="focus-mode"
                  checked={accessibilitySettings.focusMode}
                  onCheckedChange={setFocusMode}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose your preferred color scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant={themeMode === 'light' ? 'default' : 'outline'}
                  onClick={() => setThemeMode('light')}
                  className="flex-1 p-6 h-auto flex-col gap-2"
                >
                  <Sun className="w-6 h-6" />
                  <span className="font-semibold">Light</span>
                </Button>
                <Button
                  variant={themeMode === 'dark' ? 'default' : 'outline'}
                  onClick={() => setThemeMode('dark')}
                  className="flex-1 p-6 h-auto flex-col gap-2"
                >
                  <Moon className="w-6 h-6" />
                  <span className="font-semibold">Dark</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Colors</CardTitle>
              <CardDescription>Personalize your interface colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <input
                    id="bg-color"
                    type="color"
                    value={accessibilitySettings.customTheme.backgroundColor}
                    onChange={(e) => setCustomTheme({
                      ...accessibilitySettings.customTheme,
                      backgroundColor: e.target.value
                    })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <input
                    id="text-color"
                    type="color"
                    value={accessibilitySettings.customTheme.textColor}
                    onChange={(e) => setCustomTheme({
                      ...accessibilitySettings.customTheme,
                      textColor: e.target.value
                    })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <input
                    id="accent-color"
                    type="color"
                    value={accessibilitySettings.customTheme.accentColor}
                    onChange={(e) => setCustomTheme({
                      ...accessibilitySettings.customTheme,
                      accentColor: e.target.value
                    })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="error-color">Error Color</Label>
                  <input
                    id="error-color"
                    type="color"
                    value={accessibilitySettings.customTheme.errorColor}
                    onChange={(e) => setCustomTheme({
                      ...accessibilitySettings.customTheme,
                      errorColor: e.target.value
                    })}
                    className="w-full h-10 rounded border"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setCustomTheme({
                  backgroundColor: '#ffffff',
                  textColor: '#000000',
                  accentColor: '#2563eb',
                  errorColor: '#dc2626'
                })}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Your active settings at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Hand:</strong> {handPreference.charAt(0).toUpperCase() + handPreference.slice(1)}
            </div>
            <div>
              <strong>Theme:</strong> {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
            </div>
            <div>
              <strong>Font Size:</strong> {accessibilitySettings.fontSize}px
            </div>
            <div>
              <strong>Volume:</strong> {accessibilitySettings.soundVolume}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveSettingsPanel;