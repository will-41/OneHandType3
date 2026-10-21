import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  availableLayouts, 
  getSpecializedLayoutInfo, 
  isSpecializedLayout,
  type SpecializedLayoutType,
  type InternationalLayout 
} from '../lib/keyboardLayouts';
import { 
  Keyboard, 
  Target, 
  Zap, 
  Trophy, 
  Hand, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Star,
  Clock,
  TrendingUp,
  Users,
  Heart,
  Brain,
  Settings
} from 'lucide-react';

interface SpecializedLayoutSelectorProps {
  currentLayout: InternationalLayout | SpecializedLayoutType;
  onLayoutChange: (layout: InternationalLayout | SpecializedLayoutType) => void;
  onClose?: () => void;
}

const SpecializedLayoutSelector: React.FC<SpecializedLayoutSelectorProps> = ({
  currentLayout,
  onLayoutChange,
  onClose
}) => {
  const { handPreference, personalStats } = useTypingStore();
  const [selectedLayout, setSelectedLayout] = useState<InternationalLayout | SpecializedLayoutType>(currentLayout);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const layoutCategories = useMemo(() => {
    const standard = availableLayouts.filter(layout => !layout.specialized);
    const specialized = availableLayouts.filter(layout => layout.specialized);
    
    return { standard, specialized };
  }, []);

  const getLayoutIcon = (layoutId: string) => {
    switch (layoutId) {
      case 'maltron': return Target;
      case 'dvorak-one-hand': return Zap;
      case 'artsey': return Hand;
      default: return Keyboard;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-50 border-green-200';
      case 'moderate': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'challenging': return 'text-orange-500 bg-orange-50 border-orange-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 8) return 'text-green-500';
    if (efficiency >= 6) return 'text-blue-500';
    if (efficiency >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  const renderLayoutCard = (layout: typeof availableLayouts[0]) => {
    const Icon = getLayoutIcon(layout.id);
    const isSelected = selectedLayout === layout.id;
    const isSpecialized = layout.specialized;
    
    let specializedInfo;
    if (isSpecialized && isSpecializedLayout(layout.id)) {
      specializedInfo = getSpecializedLayoutInfo(layout.id as SpecializedLayoutType);
    }

    return (
      <Card 
        key={layout.id}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md",
          isSelected ? "ring-2 ring-primary border-primary" : "hover:border-muted-foreground",
          isSpecialized && "bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20"
        )}
        onClick={() => setSelectedLayout(layout.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-lg",
                isSpecialized ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "bg-muted"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{layout.name}</CardTitle>
                {isSpecialized && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Specialized
                  </Badge>
                )}
              </div>
            </div>
            {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{layout.description}</p>
          
          {specializedInfo && (
            <div className="space-y-3">
              <Separator />
              
              {/* Difficulty and Efficiency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Learning Curve</div>
                  <Badge className={getDifficultyColor(specializedInfo.learningCurve)}>
                    {specializedInfo.learningCurve}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Efficiency</div>
                  <div className={cn("text-sm font-bold", getEfficiencyColor(specializedInfo.efficiency))}>
                    {specializedInfo.efficiency}/10
                  </div>
                </div>
              </div>

              {/* Ergonomic Scores */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Ergonomic Profile</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Hand Strain:</span>
                    <span className={specializedInfo.ergonomicProfile.handStrain <= 3 ? 'text-green-600' : 'text-orange-600'}>
                      {specializedInfo.ergonomicProfile.handStrain}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Finger Balance:</span>
                    <span className="text-blue-600">{specializedInfo.ergonomicProfile.fingerBalance}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reach Comfort:</span>
                    <span className="text-green-600">{specializedInfo.ergonomicProfile.reachComfort}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bigram Score:</span>
                    <span className="text-purple-600">{specializedInfo.ergonomicProfile.commonBigramScore}/10</span>
                  </div>
                </div>
              </div>

              {/* Show Details Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === layout.id ? null : layout.id);
                }}
              >
                <Info className="h-4 w-4 mr-2" />
                {showDetails === layout.id ? 'Hide Details' : 'Show Details'}
              </Button>

              {/* Detailed Information */}
              {showDetails === layout.id && (
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Recommended For:
                    </h4>
                    <ul className="text-xs space-y-1">
                      {specializedInfo.ergonomicProfile.recommendedForConditions.map((condition, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-primary rounded-full mr-2" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {layout.id === 'artsey' && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        ARTSEY uses chord combinations. Multiple keys pressed together create letters.
                        This requires memorizing chord patterns but enables typing with minimal hand movement.
                      </AlertDescription>
                    </Alert>
                  )}

                  {layout.id === 'maltron' && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Maltron is scientifically designed for efficiency. Letters are placed by frequency
                        and ergonomic research. Ideal for users who type extensively.
                      </AlertDescription>
                    </Alert>
                  )}

                  {layout.id === 'dvorak-one-hand' && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        One-hand Dvorak is optimized for English vowel patterns. Works with any standard
                        keyboard and has excellent software support.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Hand Preference Indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Hand className="h-3 w-3 mr-1" />
              <span>Hand: {handPreference === 'left' ? 'Left' : 'Right'}</span>
            </div>
            <div className="flex items-center">
              <Settings className="h-3 w-3 mr-1" />
              <span>{layout.region}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleApplyLayout = () => {
    onLayoutChange(selectedLayout);
    onClose?.();
  };

  const hasChanges = selectedLayout !== currentLayout;

  return (
    <div className="space-y-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-2">
        <div className="flex items-center space-x-3">
          <Keyboard className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Keyboard Layout Selection</h2>
        </div>
        <div className="flex space-x-2">
          {hasChanges && (
            <Button onClick={handleApplyLayout}>
              Apply Layout
            </Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Current Stats Display */}
      {personalStats && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Current Layout</div>
                <div className="font-semibold">{availableLayouts.find(l => l.id === currentLayout)?.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Best WPM</div>
                <div className="font-semibold text-primary">{personalStats.bestWpm}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Best Accuracy</div>
                <div className="font-semibold text-green-600">{Math.round(personalStats.bestAccuracy)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Hand Preference</div>
                <div className="font-semibold capitalize">{handPreference}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Layouts */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Keyboard className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Standard Layouts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layoutCategories.standard.map(renderLayoutCard)}
        </div>
      </div>

      {/* Specialized One-Hand Layouts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Specialized One-Hand Layouts</h3>
            <Badge variant="secondary">Advanced</Badge>
          </div>
        </div>
        
        <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
          <Brain className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            These layouts are specifically designed for one-hand typing and accessibility. 
            Each has unique characteristics and learning requirements.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {layoutCategories.specialized.map(renderLayoutCard)}
        </div>
      </div>

      {/* Comparison Section */}
      {selectedLayout !== currentLayout && isSpecializedLayout(selectedLayout) && (
        <Card className="border-2 border-dashed border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Layout Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Current: {availableLayouts.find(l => l.id === currentLayout)?.name}</h4>
                <div className="text-sm text-muted-foreground">
                  Your current typing performance will be preserved.
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Selected: {availableLayouts.find(l => l.id === selectedLayout)?.name}</h4>
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    const info = getSpecializedLayoutInfo(selectedLayout as SpecializedLayoutType);
                    return `Learning curve: ${info.learningCurve}, Efficiency: ${info.efficiency}/10`;
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apply Changes Section */}
      {hasChanges && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Switch to {availableLayouts.find(l => l.id === selectedLayout)?.name}?
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setSelectedLayout(currentLayout)}>
                Cancel
              </Button>
              <Button onClick={handleApplyLayout}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Layout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecializedLayoutSelector;