import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Zap,
  Eye,
  Keyboard
} from 'lucide-react';

interface WeakArea {
  key: string;
  character: string;
  errorRate: number;
  practiceNeeded: number;
  improvement: string;
}

interface PersonalizedRecommendation {
  id: string;
  type: 'lesson' | 'exercise' | 'technique';
  title: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

interface LearningInsight {
  category: string;
  insight: string;
  actionable: string;
  impact: 'high' | 'medium' | 'low';
}

// AI-powered weakness detection
interface TypingData {
  bestWpm: number;
  bestAccuracy: number;
  keyErrors: Record<string, number>;
  sessionCount: number;
}

const analyzeWeakAreas = (typingData: TypingData): WeakArea[] => {
  // Mock analysis - in real app would use actual typing data
  return [
    {
      key: 'p',
      character: 'P',
      errorRate: 0.15,
      practiceNeeded: 8,
      improvement: 'Focus on pinky finger positioning'
    },
    {
      key: 'q',
      character: 'Q',
      errorRate: 0.12,
      practiceNeeded: 6,
      improvement: 'Practice Q-U combinations'
    },
    {
      key: ';',
      character: ';',
      errorRate: 0.18,
      practiceNeeded: 10,
      improvement: 'Work on reach accuracy for punctuation'
    }
  ];
};

// Generate personalized recommendations
const generateRecommendations = (weakAreas: WeakArea[], userStats: TypingData): PersonalizedRecommendation[] => {
  const recommendations: PersonalizedRecommendation[] = [];

  // Add weakness-specific recommendations
  weakAreas.forEach((area, index) => {
    recommendations.push({
      id: `weak_${area.key}`,
      type: 'exercise',
      title: `${area.character} Key Practice`,
      description: `Targeted practice for improving ${area.character} key accuracy`,
      difficulty: Math.ceil(area.errorRate * 10),
      estimatedTime: area.practiceNeeded,
      priority: area.errorRate > 0.15 ? 'high' : 'medium',
      reason: area.improvement
    });
  });

  // Add general recommendations based on stats
  if (userStats.bestWpm < 40) {
    recommendations.push({
      id: 'speed_building',
      type: 'lesson',
      title: 'Speed Building Fundamentals',
      description: 'Focus on consistent rhythm and muscle memory',
      difficulty: 3,
      estimatedTime: 15,
      priority: 'high',
      reason: 'Current speed is below target range'
    });
  }

  if (userStats.bestAccuracy < 95) {
    recommendations.push({
      id: 'accuracy_focus',
      type: 'lesson',
      title: 'Precision Training',
      description: 'Slow, accurate typing to build muscle memory',
      difficulty: 2,
      estimatedTime: 20,
      priority: 'high',
      reason: 'Accuracy needs improvement for speed gains'
    });
  }

  return recommendations.slice(0, 6); // Limit to top 6
};

// Learning insights generator
const generateInsights = (userData: TypingData): LearningInsight[] => {
  return [
    {
      category: 'Speed Pattern',
      insight: 'Your typing speed increases 15% in afternoon sessions',
      actionable: 'Schedule important typing tasks between 2-4 PM',
      impact: 'medium'
    },
    {
      category: 'Accuracy Trend',
      insight: 'Errors increase after 20 minutes of continuous typing',
      actionable: 'Take 2-minute breaks every 15 minutes',
      impact: 'high'
    },
    {
      category: 'Finger Usage',
      insight: 'Right pinky is underutilized, causing reach errors',
      actionable: 'Practice punctuation and Enter key exercises',
      impact: 'high'
    },
    {
      category: 'Learning Velocity',
      insight: 'Your improvement rate is 3 WPM per week',
      actionable: 'Consistent daily practice will reach 60 WPM in 4 weeks',
      impact: 'medium'
    }
  ];
};

// Adaptive difficulty component
const AdaptiveDifficultyIndicator: React.FC<{ 
  currentLevel: number; 
  recommendedLevel: number; 
  theme: string;
}> = ({ currentLevel, recommendedLevel, theme }) => {
  const difference = recommendedLevel - currentLevel;
  
  return (
    <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-500" />
        Adaptive Difficulty
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Current Level</span>
          <Badge variant="outline">{currentLevel}</Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Recommended Level</span>
          <Badge className={cn(
            difference > 0 ? 'bg-green-500' : 
            difference < 0 ? 'bg-orange-500' : 'bg-blue-500'
          )}>
            {recommendedLevel}
          </Badge>
        </div>
        
        <div className={cn(
          "text-sm p-2 rounded-lg",
          difference > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
          difference < 0 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
        )}>
          {difference > 0 && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Ready for more challenge
            </div>
          )}
          {difference < 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Focus on fundamentals
            </div>
          )}
          {difference === 0 && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Perfect difficulty match
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Weak areas visualization
const WeakAreasHeatmap: React.FC<{ 
  weakAreas: WeakArea[]; 
  theme: string;
}> = ({ weakAreas, theme }) => {
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];

  const getKeyColor = (key: string) => {
    const weakArea = weakAreas.find(area => area.key === key);
    if (!weakArea) return theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200';
    
    const intensity = weakArea.errorRate;
    if (intensity > 0.15) return 'bg-red-500';
    if (intensity > 0.10) return 'bg-orange-500';
    if (intensity > 0.05) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Keyboard className="w-5 h-5 text-blue-500" />
        Error Heatmap
      </h3>
      
      <div className="space-y-2 mb-4">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => (
              <div
                key={key}
                className={cn(
                  "w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white",
                  getKeyColor(key)
                )}
                title={`Key: ${key.toUpperCase()}`}
              >
                {key.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Practice</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Focus</span>
        </div>
      </div>
    </Card>
  );
};

// Main smart learning component
const SmartLearningSystem: React.FC<{ className?: string }> = ({ className }) => {
  const { themeMode, stats } = useTypingStore();
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'recommendations' | 'analysis' | 'insights'>('overview');

  // Initialize learning data
  useEffect(() => {
    const mockTypingData: TypingData = {
      bestWpm: stats.bestWpm || 0,
      bestAccuracy: stats.bestAccuracy || 0,
      keyErrors: {},
      sessionCount: 0
    };
    
    const areas = analyzeWeakAreas(mockTypingData);
    const recs = generateRecommendations(areas, mockTypingData);
    const learningInsights = generateInsights(mockTypingData);
    
    setWeakAreas(areas);
    setRecommendations(recs);
    setInsights(learningInsights);
  }, [stats]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-500" />
            AI Learning Assistant
          </h2>
          <p className={`text-sm ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Personalized recommendations based on your typing patterns
          </p>
        </div>
        
        <div className={`text-sm ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Last analysis: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
          { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="w-4 h-4" /> },
          { id: 'analysis', label: 'Weakness Analysis', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'insights', label: 'Learning Insights', icon: <TrendingUp className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
              selectedTab === tab.id
                ? "bg-purple-500 text-white shadow-lg"
                : themeMode === 'dark'
                  ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdaptiveDifficultyIndicator 
            currentLevel={3} 
            recommendedLevel={4} 
            theme={themeMode}
          />
          <WeakAreasHeatmap weakAreas={weakAreas} theme={themeMode} />
          
          {/* Quick Stats */}
          <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-3">Learning Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Speed Improvement</span>
                  <span>+8 WPM this week</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Accuracy Goal</span>
                  <span>94/98%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Consistency</span>
                  <span>Excellent</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <ArrowRight className="w-5 w-5 text-green-500" />
              Next Steps
            </h3>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={rec.id} className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10">
                  <div className={cn("w-2 h-2 rounded-full", getPriorityColor(rec.priority))} />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{rec.title}</div>
                    <div className="text-xs opacity-75">{rec.estimatedTime} min</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {selectedTab === 'recommendations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <Card key={rec.id} className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {rec.type === 'lesson' && <BookOpen className="w-5 h-5 text-blue-500" />}
                  {rec.type === 'exercise' && <Target className="w-5 h-5 text-green-500" />}
                  {rec.type === 'technique' && <Zap className="w-5 h-5 text-purple-500" />}
                  <h4 className="font-bold">{rec.title}</h4>
                </div>
                <Badge className={cn("text-white", getPriorityColor(rec.priority))}>
                  {rec.priority}
                </Badge>
              </div>
              
              <p className="text-sm mb-3 opacity-75">{rec.description}</p>
              
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-4">
                  <span>⭐ Level {rec.difficulty}</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />{rec.estimatedTime}min</span>
                </div>
              </div>
              
              <div className="text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mb-3">
                <strong>Why:</strong> {rec.reason}
              </div>
              
              <Button className="w-full" size="sm">
                Start Practice
              </Button>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'analysis' && (
        <div className="space-y-6">
          <WeakAreasHeatmap weakAreas={weakAreas} theme={themeMode} />
          
          <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">Detailed Weakness Analysis</h3>
            <div className="space-y-4">
              {weakAreas.map((area) => (
                <div key={area.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-red-500">{area.character}</div>
                      <div>
                        <div className="font-semibold">Error Rate: {(area.errorRate * 100).toFixed(1)}%</div>
                        <div className="text-sm opacity-75">{area.improvement}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{area.practiceNeeded} min needed</Badge>
                  </div>
                  <Progress value={(1 - area.errorRate) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {selectedTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <Card key={index} className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  {insight.category}
                </h4>
                <Badge className={cn("text-xs", getImpactColor(insight.impact))}>
                  {insight.impact} impact
                </Badge>
              </div>
              
              <p className="text-sm mb-3">{insight.insight}</p>
              
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                <div className="font-semibold text-sm text-green-700 dark:text-green-300 mb-1">
                  Action:
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {insight.actionable}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartLearningSystem;