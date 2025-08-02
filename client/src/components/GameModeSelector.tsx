import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTypingStore } from "../lib/stores/useTypingStore";
import { gameModes, type GameMode } from "../lib/gameModes";
import { cn } from "../lib/utils";
import { Play, Clock, Target, Trophy, Edit, Calendar } from "lucide-react";

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode) => void;
  className?: string;
}

const GameModeSelector = ({ onModeSelect, className }: GameModeSelectorProps) => {
  const { handPreference } = useTypingStore();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const getModeIcon = (modeId: GameMode) => {
    switch (modeId) {
      case 'practice':
        return <Target className="h-6 w-6" />;
      case 'challenge':
        return <Clock className="h-6 w-6" />;
      case 'lesson':
        return <Play className="h-6 w-6" />;
      case 'free-typing':
        return <Edit className="h-6 w-6" />;
      case 'daily-challenge':
        return <Calendar className="h-6 w-6" />;
      default:
        return <Play className="h-6 w-6" />;
    }
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onModeSelect(mode);
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">Choose Your Challenge</h2>
          <p className="text-muted-foreground">
            Optimized for {handPreference} hand typing
          </p>
        </div>

        {/* Game Mode Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameModes.map((mode) => (
            <Card
              key={mode.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg",
                "min-h-[180px] touch-manipulation", // Mobile optimized touch targets
                selectedMode === mode.id && "ring-2 ring-primary",
                "group hover:scale-[1.02]" // Subtle hover animation
              )}
              onClick={() => handleModeSelect(mode.id)}
              role="button"
              tabIndex={0}
              aria-label={`Start ${mode.name} - ${mode.description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleModeSelect(mode.id);
                }
              }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300" />
              
              <div className="relative p-6 h-full flex flex-col">
                {/* Icon and Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {getModeIcon(mode.id)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{mode.name}</h3>
                    <span className="text-2xl" role="img" aria-label={mode.name}>
                      {mode.icon}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {mode.description}
                </p>

                {/* Mode Details */}
                <div className="space-y-3">
                  {/* Time and Targets */}
                  {(mode.timeLimit || mode.targetWpm) && (
                    <div className="flex gap-2 flex-wrap">
                      {mode.timeLimit && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {mode.timeLimit}s
                        </Badge>
                      )}
                      {mode.targetWpm && (
                        <Badge variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {mode.targetWpm} WPM
                        </Badge>
                      )}
                      {mode.targetAccuracy && (
                        <Badge variant="outline" className="text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          {mode.targetAccuracy}%
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-1">
                    {mode.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/60" />
                        {feature}
                      </div>
                    ))}
                    {mode.features.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{mode.features.length - 2} more features
                      </div>
                    )}
                  </div>

                  {/* Mobile Optimized Badge */}
                  {mode.mobileOptimized && (
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      📱 Mobile Optimized
                    </Badge>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedMode === mode.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Play className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Action Button */}
        {selectedMode && (
          <div className="text-center">
            <Button 
              size="lg" 
              className="gap-2 px-8 py-3 text-lg font-medium"
              onClick={() => onModeSelect(selectedMode)}
            >
              <Play className="h-5 w-5" />
              Start {gameModes.find(m => m.id === selectedMode)?.name}
            </Button>
          </div>
        )}

        {/* Mobile Usage Tips */}
        <Card className="p-4 bg-muted/30">
          <div className="text-center space-y-2">
            <h4 className="font-medium text-sm">📱 Mobile Tips</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Rotate to landscape mode for the best typing experience</p>
              <p>• Use haptic feedback for better touch response</p>
              <p>• Adjust text size in accessibility settings if needed</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameModeSelector;