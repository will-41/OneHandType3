import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTypingStore } from "../lib/stores/useTypingStore";
import { mobileFeedbackManager } from "../lib/audioEngine";
import { cn } from "../lib/utils";
import { 
  Settings, 
  Volume2, 
  VolumeOff, 
  Vibrate, 
  Eye, 
  Type,
  Contrast,
  Zap,
  Smartphone,
  X,
  Check,
  Minus,
  Plus
} from "lucide-react";

interface MobileAccessibilitySettingsProps {
  onClose: () => void;
  className?: string;
}

const MobileAccessibilitySettings = ({ onClose, className }: MobileAccessibilitySettingsProps) => {
  const { accessibilitySettings, updateAccessibilitySettings } = useTypingStore();
  const [audioSettings, setAudioSettings] = useState(mobileFeedbackManager.getAudioSettings());
  const [hapticSettings, setHapticSettings] = useState(mobileFeedbackManager.getHapticSettings());
  const [activeSection, setActiveSection] = useState<'visual' | 'audio' | 'haptic' | 'motor'>('visual');

  const handleAudioSettingChange = (key: string, value: boolean | number) => {
    const newSettings = { ...audioSettings, [key]: value };
    setAudioSettings(newSettings);
    mobileFeedbackManager.updateAudioSettings(newSettings);
  };

  const handleHapticSettingChange = (key: string, value: boolean | number | string) => {
    const newSettings = { ...hapticSettings, [key]: value };
    setHapticSettings(newSettings);
    mobileFeedbackManager.updateHapticSettings(newSettings);
  };

  const SettingCard = ({ 
    title, 
    description, 
    icon, 
    children, 
    highlight = false 
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    highlight?: boolean;
  }) => (
    <Card className={cn("p-4", highlight && "ring-2 ring-primary bg-primary/5")}>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <div className="ml-11">
          {children}
        </div>
      </div>
    </Card>
  );

  const ToggleButton = ({ 
    enabled, 
    onToggle, 
    label 
  }: { 
    enabled: boolean; 
    onToggle: () => void; 
    label: string; 
  }) => (
    <Button
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={onToggle}
      className={cn(
        "w-full justify-center gap-2 touch-manipulation",
        enabled && "bg-green-600 hover:bg-green-700"
      )}
    >
      {enabled ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </Button>
  );

  const SliderSetting = ({ 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    step = 1, 
    label,
    unit = ""
  }: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label: string;
    unit?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="outline">{value}{unit}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => onChange(Math.max(min, value - step))}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <div className="flex-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => onChange(Math.min(max, value + step))}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  const sections = [
    { id: 'visual', name: 'Visual', icon: <Eye className="h-4 w-4" /> },
    { id: 'audio', name: 'Audio', icon: <Volume2 className="h-4 w-4" /> },
    { id: 'haptic', name: 'Haptic', icon: <Vibrate className="h-4 w-4" /> },
    { id: 'motor', name: 'Motor', icon: <Zap className="h-4 w-4" /> }
  ];

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Mobile Accessibility</h2>
                <p className="text-sm text-muted-foreground">Optimize for your needs</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  "hover:bg-muted/50 border-b-2 border-transparent touch-manipulation",
                  activeSection === section.id && "border-primary text-primary bg-primary/5"
                )}
              >
                {section.icon}
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {activeSection === 'visual' && (
            <div className="space-y-4">
              <SettingCard
                title="High Contrast Mode"
                description="Increase contrast for better visibility"
                icon={<Contrast className="h-4 w-4" />}
              >
                <ToggleButton
                  enabled={accessibilitySettings.highContrast}
                  onToggle={() => updateAccessibilitySettings({ 
                    highContrast: !accessibilitySettings.highContrast 
                  })}
                  label={accessibilitySettings.highContrast ? "Enabled" : "Disabled"}
                />
              </SettingCard>

              <SettingCard
                title="Font Size"
                description="Adjust text size for better readability"
                icon={<Type className="h-4 w-4" />}
              >
                <SliderSetting
                  value={accessibilitySettings.fontSize}
                  onChange={(value) => updateAccessibilitySettings({ fontSize: value })}
                  min={12}
                  max={24}
                  step={1}
                  label="Text Size"
                  unit="px"
                />
              </SettingCard>

              <SettingCard
                title="Line Height"
                description="Adjust spacing between lines"
                icon={<Type className="h-4 w-4" />}
              >
                <SliderSetting
                  value={accessibilitySettings.lineHeight}
                  onChange={(value) => updateAccessibilitySettings({ lineHeight: value })}
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  label="Line Spacing"
                  unit="x"
                />
              </SettingCard>

              <SettingCard
                title="Reduce Motion"
                description="Minimize animations and transitions"
                icon={<Zap className="h-4 w-4" />}
              >
                <ToggleButton
                  enabled={accessibilitySettings.reduceMotion}
                  onToggle={() => updateAccessibilitySettings({ 
                    reduceMotion: !accessibilitySettings.reduceMotion 
                  })}
                  label={accessibilitySettings.reduceMotion ? "Reduced" : "Normal"}
                />
              </SettingCard>
            </div>
          )}

          {activeSection === 'audio' && (
            <div className="space-y-4">
              <SettingCard
                title="Audio Enabled"
                description="Enable all sound effects and feedback"
                icon={<Volume2 className="h-4 w-4" />}
                highlight={audioSettings.enabled}
              >
                <ToggleButton
                  enabled={audioSettings.enabled}
                  onToggle={() => handleAudioSettingChange('enabled', !audioSettings.enabled)}
                  label={audioSettings.enabled ? "Enabled" : "Disabled"}
                />
              </SettingCard>

              {audioSettings.enabled && (
                <>
                  <SettingCard
                    title="Master Volume"
                    description="Overall volume control"
                    icon={<Volume2 className="h-4 w-4" />}
                  >
                    <SliderSetting
                      value={Math.round(audioSettings.masterVolume * 100)}
                      onChange={(value) => handleAudioSettingChange('masterVolume', value / 100)}
                      min={0}
                      max={100}
                      step={5}
                      label="Volume"
                      unit="%"
                    />
                  </SettingCard>

                  <SettingCard
                    title="Typing Sounds"
                    description="Key press feedback sounds"
                    icon={<Type className="h-4 w-4" />}
                  >
                    <div className="space-y-3">
                      <ToggleButton
                        enabled={audioSettings.typingSoundEnabled}
                        onToggle={() => handleAudioSettingChange('typingSoundEnabled', !audioSettings.typingSoundEnabled)}
                        label={audioSettings.typingSoundEnabled ? "Enabled" : "Disabled"}
                      />
                      {audioSettings.typingSoundEnabled && (
                        <SliderSetting
                          value={Math.round(audioSettings.typingVolume * 100)}
                          onChange={(value) => handleAudioSettingChange('typingVolume', value / 100)}
                          min={0}
                          max={100}
                          step={5}
                          label="Typing Volume"
                          unit="%"
                        />
                      )}
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Success Sounds"
                    description="Achievement and completion sounds"
                    icon={<Check className="h-4 w-4" />}
                  >
                    <div className="space-y-3">
                      <ToggleButton
                        enabled={audioSettings.feedbackSoundEnabled}
                        onToggle={() => handleAudioSettingChange('feedbackSoundEnabled', !audioSettings.feedbackSoundEnabled)}
                        label={audioSettings.feedbackSoundEnabled ? "Enabled" : "Disabled"}
                      />
                      {audioSettings.feedbackSoundEnabled && (
                        <SliderSetting
                          value={Math.round(audioSettings.successVolume * 100)}
                          onChange={(value) => handleAudioSettingChange('successVolume', value / 100)}
                          min={0}
                          max={100}
                          step={5}
                          label="Success Volume"
                          unit="%"
                        />
                      )}
                    </div>
                  </SettingCard>
                </>
              )}
            </div>
          )}

          {activeSection === 'haptic' && (
            <div className="space-y-4">
              <SettingCard
                title="Haptic Feedback"
                description="Vibration feedback for touch events"
                icon={<Vibrate className="h-4 w-4" />}
                highlight={hapticSettings.enabled}
              >
                <ToggleButton
                  enabled={hapticSettings.enabled}
                  onToggle={() => handleHapticSettingChange('enabled', !hapticSettings.enabled)}
                  label={hapticSettings.enabled ? "Enabled" : "Disabled"}
                />
              </SettingCard>

              {hapticSettings.enabled && (
                <>
                  <SettingCard
                    title="Vibration Intensity"
                    description="Strength of haptic feedback"
                    icon={<Zap className="h-4 w-4" />}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {['light', 'medium', 'heavy'].map((intensity) => (
                        <Button
                          key={intensity}
                          variant={hapticSettings.intensity === intensity ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleHapticSettingChange('intensity', intensity)}
                          className="capitalize"
                        >
                          {intensity}
                        </Button>
                      ))}
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Typing Feedback"
                    description="Vibrate on key presses"
                    icon={<Type className="h-4 w-4" />}
                  >
                    <ToggleButton
                      enabled={hapticSettings.typingFeedback}
                      onToggle={() => handleHapticSettingChange('typingFeedback', !hapticSettings.typingFeedback)}
                      label={hapticSettings.typingFeedback ? "Enabled" : "Disabled"}
                    />
                  </SettingCard>

                  <SettingCard
                    title="Success Feedback"
                    description="Vibrate on achievements"
                    icon={<Check className="h-4 w-4" />}
                  >
                    <ToggleButton
                      enabled={hapticSettings.successFeedback}
                      onToggle={() => handleHapticSettingChange('successFeedback', !hapticSettings.successFeedback)}
                      label={hapticSettings.successFeedback ? "Enabled" : "Disabled"}
                    />
                  </SettingCard>
                </>
              )}
            </div>
          )}

          {activeSection === 'motor' && (
            <div className="space-y-4">
              <SettingCard
                title="Large Touch Targets"
                description="Increase button and key sizes"
                icon={<Smartphone className="h-4 w-4" />}
              >
                <ToggleButton
                  enabled={accessibilitySettings.largeText}
                  onToggle={() => updateAccessibilitySettings({ 
                    largeText: !accessibilitySettings.largeText 
                  })}
                  label={accessibilitySettings.largeText ? "Large" : "Normal"}
                />
              </SettingCard>

              <SettingCard
                title="Keyboard Navigation"
                description="Navigate with external keyboard"
                icon={<Type className="h-4 w-4" />}
              >
                <ToggleButton
                  enabled={accessibilitySettings.keyboardNavigation}
                  onToggle={() => updateAccessibilitySettings({ 
                    keyboardNavigation: !accessibilitySettings.keyboardNavigation 
                  })}
                  label={accessibilitySettings.keyboardNavigation ? "Enabled" : "Disabled"}
                />
              </SettingCard>

              <SettingCard
                title="Screen Reader Mode"
                description="Optimize for screen readers"
                icon={<Eye className="h-4 w-4" />}
              >
                <ToggleButton
                  enabled={accessibilitySettings.screenReaderMode}
                  onToggle={() => updateAccessibilitySettings({ 
                    screenReaderMode: !accessibilitySettings.screenReaderMode 
                  })}
                  label={accessibilitySettings.screenReaderMode ? "Enabled" : "Disabled"}
                />
              </SettingCard>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Settings are saved automatically and optimized for mobile devices
            </p>
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MobileAccessibilitySettings;