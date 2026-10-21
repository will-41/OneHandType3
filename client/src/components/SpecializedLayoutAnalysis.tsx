import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  getSpecializedLayoutInfo, 
  compareLayouts, 
  getErgonomicAnalysis,
  isSpecializedLayout,
  findChordForKeys,
  getChordMappings,
  type SpecializedLayoutType,
  type InternationalLayout 
} from '../lib/keyboardLayouts';
import { useTypingStore } from '../lib/stores/useTypingStore';

interface SpecializedLayoutAnalysisProps {
  sampleText?: string;
}

export const SpecializedLayoutAnalysis: React.FC<SpecializedLayoutAnalysisProps> = ({
  sampleText = "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice."
}) => {
  const { handPreference } = useTypingStore();
  const [selectedLayout, setSelectedLayout] = useState<SpecializedLayoutType>('maltron');
  const [activeTab, setActiveTab] = useState('overview');

  const specializedLayouts: SpecializedLayoutType[] = ['maltron', 'dvorak-one-hand', 'artsey'];
  const comparisonLayouts: (InternationalLayout | SpecializedLayoutType)[] = ['qwerty' as InternationalLayout, 'dvorak' as InternationalLayout, ...specializedLayouts];

  // Get comprehensive analysis for all layouts
  const layoutComparison = useMemo(() => {
    return compareLayouts(sampleText, handPreference, comparisonLayouts);
  }, [sampleText, handPreference]);

  // Get detailed info for selected specialized layout
  const selectedLayoutInfo = useMemo(() => {
    return getSpecializedLayoutInfo(selectedLayout);
  }, [selectedLayout]);

  // Get chord mappings for ARTSEY
  const artseyChords = useMemo(() => {
    return getChordMappings('artsey') || [];
  }, []);

  const renderErgonomicProfile = (layoutType: SpecializedLayoutType) => {
    const info = getSpecializedLayoutInfo(layoutType);
    const profile = info.ergonomicProfile;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Hand Strain</span>
              <span className="text-sm text-muted-foreground">{profile.handStrain}/10</span>
            </div>
            <Progress value={(10 - profile.handStrain) * 10} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Finger Balance</span>
              <span className="text-sm text-muted-foreground">{profile.fingerBalance}/10</span>
            </div>
            <Progress value={profile.fingerBalance * 10} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Reach Comfort</span>
              <span className="text-sm text-muted-foreground">{profile.reachComfort}/10</span>
            </div>
            <Progress value={profile.reachComfort * 10} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Bigram Score</span>
              <span className="text-sm text-muted-foreground">{profile.commonBigramScore}/10</span>
            </div>
            <Progress value={profile.commonBigramScore * 10} className="h-2" />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Recommended For:</h4>
          <div className="flex flex-wrap gap-1">
            {profile.recommendedForConditions.map((condition, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {condition}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">{info.efficiency}/10</div>
            <div className="text-xs text-muted-foreground">Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold capitalize">{info.learningCurve}</div>
            <div className="text-xs text-muted-foreground">Learning Curve</div>
          </div>
        </div>
      </div>
    );
  };

  const renderLayoutComparison = () => {
    const sortedLayouts = layoutComparison.sort((a, b) => 
      b.analysis.averageErgonomicScore - a.analysis.averageErgonomicScore
    );

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Layout Performance Comparison</h3>
        <p className="text-sm text-muted-foreground">
          Analysis based on: "{sampleText.substring(0, 50)}..."
        </p>
        
        <div className="space-y-3">
          {sortedLayouts.map((item, index) => (
            <Card key={item.layout} className={index === 0 ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium capitalize">{item.layout.replace('-', ' ')}</h4>
                    {isSpecializedLayout(item.layout) && (
                      <Badge variant="outline" className="mt-1">Specialized</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {item.analysis.averageErgonomicScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Reach Distance</div>
                    <div className="text-muted-foreground">{item.analysis.reachDistance}</div>
                  </div>
                  <div>
                    <div className="font-medium">Strain Points</div>
                    <div className="text-muted-foreground">{item.analysis.strainPoints.length}</div>
                  </div>
                  <div>
                    <div className="font-medium">Index Usage</div>
                    <div className="text-muted-foreground">
                      {((item.analysis.fingerUsageDistribution.index / sampleText.length) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                {item.analysis.strainPoints.length > 0 && (
                  <Alert className="mt-3">
                    <AlertDescription className="text-xs">
                      Potential strain: {item.analysis.strainPoints.slice(0, 3).join(', ')}
                      {item.analysis.strainPoints.length > 3 && ` (+${item.analysis.strainPoints.length - 3} more)`}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderChordReference = () => {
    const groupedChords = artseyChords.reduce((groups, chord) => {
      const keyCount = chord.keys.length;
      if (!groups[keyCount]) groups[keyCount] = [];
      groups[keyCount].push(chord);
      return groups;
    }, {} as Record<number, typeof artseyChords>);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">ARTSEY Chord Reference</h3>
          <p className="text-sm text-muted-foreground mb-4">
            ARTSEY uses chord combinations to type. Press multiple keys simultaneously to create letters.
          </p>
        </div>

        {Object.entries(groupedChords).map(([keyCount, chords]) => (
          <div key={keyCount}>
            <h4 className="font-medium mb-3">
              {keyCount === '1' ? 'Single Keys' : `${keyCount}-Key Combinations`}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {chords
                .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
                .map((chord, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-mono font-semibold">
                        {chord.keys.join(' + ')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chord.description}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {chord.output}
                    </div>
                  </div>
                  {chord.frequency && (
                    <div className="mt-2">
                      <Progress value={chord.frequency * 5} className="h-1" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {chord.frequency.toFixed(1)}% frequency
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Alert>
          <AlertTitle>Practice Tip</AlertTitle>
          <AlertDescription>
            Start with single keys (A, R, T, S), then learn two-key combinations for vowels (E, I, O), 
            and gradually build up to more complex chords. Most common words can be typed with 2-key combinations.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Specialized One-Hand Keyboard Layouts</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of the top 3 adaptive keyboard layouts for one-handed typing
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="chords">ARTSEY Chords</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {specializedLayouts.map((layout) => {
              const info = getSpecializedLayoutInfo(layout);
              return (
                <Card key={layout} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedLayout(layout)}>
                  <CardHeader>
                    <CardTitle className="capitalize">{layout.replace('-', ' ')}</CardTitle>
                    <CardDescription>
                      {layout === 'maltron' && "Ergonomic curved layout optimized for frequency"}
                      {layout === 'dvorak-one-hand' && "Single-hand optimized Dvorak adaptation"}
                      {layout === 'artsey' && "8-key chord-based accessibility system"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <Badge variant={info.efficiency >= 8 ? "default" : "secondary"}>
                          {info.efficiency}/10
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Learning:</span>
                        <Badge variant={
                          info.learningCurve === 'easy' ? 'default' : 
                          info.learningCurve === 'moderate' ? 'secondary' : 'outline'
                        }>
                          {info.learningCurve}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Hand Strain:</span>
                        <Badge variant={info.ergonomicProfile.handStrain <= 3 ? "default" : "secondary"}>
                          {info.ergonomicProfile.handStrain}/10
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {renderLayoutComparison()}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {specializedLayouts.map((layout) => (
              <Button
                key={layout}
                variant={selectedLayout === layout ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLayout(layout)}
                className="capitalize"
              >
                {layout.replace('-', ' ')}
              </Button>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{selectedLayout.replace('-', ' ')} Analysis</CardTitle>
              <CardDescription>
                Detailed ergonomic profile and usage recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderErgonomicProfile(selectedLayout)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chords" className="space-y-6">
          {renderChordReference()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpecializedLayoutAnalysis;