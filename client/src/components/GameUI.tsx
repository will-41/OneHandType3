import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { Trophy, Target, Zap, Clock, TrendingUp, Award } from 'lucide-react';

const GameUI: React.FC = () => {
  const { 
    currentWpm, 
    accuracy, 
    gameState, 
    timeElapsed, 
    currentStreak,
    personalStats 
  } = useTypingStore();

  const [animatedWpm, setAnimatedWpm] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);

  // Smooth animation for stats
  useEffect(() => {
    const wpmInterval = setInterval(() => {
      setAnimatedWpm(prev => {
        const diff = currentWpm - prev;
        return Math.abs(diff) < 0.1 ? currentWpm : prev + diff * 0.1;
      });
    }, 50);

    const accuracyInterval = setInterval(() => {
      setAnimatedAccuracy(prev => {
        const diff = accuracy - prev;
        return Math.abs(diff) < 0.1 ? accuracy : prev + diff * 0.1;
      });
    }, 50);

    return () => {
      clearInterval(wpmInterval);
      clearInterval(accuracyInterval);
    };
  }, [currentWpm, accuracy]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWpmColor = (wpm: number) => {
    if (wpm >= 60) return 'text-emerald-500';
    if (wpm >= 40) return 'text-blue-500';
    if (wpm >= 20) return 'text-amber-500';
    return 'text-muted-foreground';
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 95) return 'text-emerald-500';
    if (acc >= 85) return 'text-blue-500';
    if (acc >= 75) return 'text-amber-500';
    return 'text-destructive';
  };

  const getPerformanceLevel = () => {
    const wpm = Math.round(animatedWpm);
    const acc = Math.round(animatedAccuracy);
    
    if (wpm >= 60 && acc >= 95) return { level: 'Expert', icon: Trophy, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' };
    if (wpm >= 40 && acc >= 85) return { level: 'Advanced', icon: Award, color: 'bg-gradient-to-r from-blue-400 to-purple-500' };
    if (wpm >= 20 && acc >= 75) return { level: 'Intermediate', icon: Target, color: 'bg-gradient-to-r from-green-400 to-blue-500' };
    return { level: 'Beginner', icon: Zap, color: 'bg-gradient-to-r from-gray-400 to-gray-600' };
  };

  const performanceLevel = getPerformanceLevel();
  const PerformanceIcon = performanceLevel.icon;

  if (gameState === 'ready') {
    return (
      <Card className="w-full bg-gradient-to-br from-card via-card/50 to-muted/20 border-border/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Ready to Start</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Position your hands and begin typing when ready
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-card via-card/50 to-muted/20 border-border/50 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Performance Level Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${performanceLevel.color}`}>
              <PerformanceIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <Badge variant="secondary" className="font-medium">
                {performanceLevel.level}
              </Badge>
            </div>
          </div>
          
          {currentStreak > 0 && (
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">{currentStreak} streak</span>
            </div>
          )}
        </div>

        <Separator className="opacity-50" />

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* WPM Display */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Words/Min</span>
            </div>
            <div className="space-y-2">
              <div className={`text-3xl font-bold tabular-nums ${getWpmColor(animatedWpm)}`}>
                {Math.round(animatedWpm)}
              </div>
              <Progress 
                value={(animatedWpm / 80) * 100} 
                className="h-2"
              />
              {personalStats?.bestWpm && (
                <div className="text-xs text-muted-foreground">
                  Best: {personalStats.bestWpm} WPM
                </div>
              )}
            </div>
          </div>

          {/* Accuracy Display */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
            </div>
            <div className="space-y-2">
              <div className={`text-3xl font-bold tabular-nums ${getAccuracyColor(animatedAccuracy)}`}>
                {Math.round(animatedAccuracy)}%
              </div>
              <Progress 
                value={animatedAccuracy} 
                className="h-2"
              />
              {personalStats?.bestAccuracy && (
                <div className="text-xs text-muted-foreground">
                  Best: {Math.round(personalStats.bestAccuracy)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timer and Session Info */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="tabular-nums font-medium">
              {formatTime(timeElapsed)}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {gameState === 'playing' && (
              <span className="inline-flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Active</span>
              </span>
            )}
            {gameState === 'paused' && (
              <span className="inline-flex items-center space-x-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span>Paused</span>
              </span>
            )}
            {gameState === 'ended' && (
              <span className="inline-flex items-center space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                <span>Completed</span>
              </span>
            )}
          </div>
        </div>

        {/* Performance Insights */}
        {(animatedWpm > 0 || animatedAccuracy > 0) && (
          <>
            <Separator className="opacity-50" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">CPM</div>
                <div className="text-sm font-semibold">
                  {Math.round(animatedWpm * 5)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Errors</div>
                <div className="text-sm font-semibold text-destructive">
                  {Math.round((100 - animatedAccuracy) / 100 * (animatedWpm * 5 * (timeElapsed / 60)) || 0)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Score</div>
                <div className="text-sm font-semibold text-primary">
                  {Math.round(animatedWpm * (animatedAccuracy / 100))}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GameUI;