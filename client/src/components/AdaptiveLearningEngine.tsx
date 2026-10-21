
import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Brain, TrendingUp, Target, Clock } from 'lucide-react';

interface LearningMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  errorRate: number;
}

interface AdaptiveLearningEngineProps {
  onRecommendation?: (recommendation: string) => void;
}

const AdaptiveLearningEngine: React.FC<AdaptiveLearningEngineProps> = ({ onRecommendation }) => {
  const [metrics, setMetrics] = useState<LearningMetrics>({
    accuracy: 85,
    speed: 25,
    consistency: 70,
    errorRate: 15
  });

  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Generate recommendations based on metrics
    const newRecommendations: string[] = [];
    
    if (metrics.accuracy < 80) {
      newRecommendations.push('Focus on accuracy over speed');
    }
    if (metrics.speed < 20) {
      newRecommendations.push('Practice common letter combinations');
    }
    if (metrics.consistency < 60) {
      newRecommendations.push('Take regular breaks to maintain focus');
    }
    if (metrics.errorRate > 20) {
      newRecommendations.push('Slow down and focus on correct finger placement');
    }

    setRecommendations(newRecommendations);
  }, [metrics]);

  const getPerformanceColor = (value: number, threshold: number = 70) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          Adaptive Learning Engine
        </h2>
        <p className="text-muted-foreground">
          Personalized insights to improve your typing performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Accuracy</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.accuracy, 80)}`}>
              {metrics.accuracy}%
            </div>
            <Progress value={metrics.accuracy} className="h-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Speed</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.speed, 30)}`}>
              {metrics.speed} WPM
            </div>
            <Progress value={(metrics.speed / 60) * 100} className="h-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Consistency</span>
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.consistency)}`}>
              {metrics.consistency}%
            </div>
            <Progress value={metrics.consistency} className="h-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Rate</span>
              <Target className="w-4 h-4 text-red-500" />
            </div>
            <div className={`text-2xl font-bold ${metrics.errorRate <= 10 ? 'text-green-600' : metrics.errorRate <= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
              {metrics.errorRate}%
            </div>
            <Progress value={100 - metrics.errorRate} className="h-2" />
          </div>
        </Card>
      </div>

      {recommendations.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Personalized Recommendations
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{rec}</span>
                <Badge variant="outline" className="text-xs">
                  AI Suggested
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="text-center space-y-2">
          <h4 className="font-medium text-blue-800">Next Learning Goal</h4>
          <p className="text-sm text-blue-600">
            Increase accuracy to 90% while maintaining current speed
          </p>
          <Button size="sm" variant="outline">
            Start Focused Practice
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdaptiveLearningEngine;
