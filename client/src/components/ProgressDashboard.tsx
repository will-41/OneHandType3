import React, { useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  X, 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Trophy, 
  BarChart3,
  Calendar,
  Award,
  Flame,
  Activity,
  Users
} from 'lucide-react';

interface ProgressDashboardProps {
  onClose: () => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onClose }) => {
  const { personalStats, currentStreak } = useTypingStore();

  const chartData = useMemo(() => {
    if (!personalStats?.lessons) return [];
    
    return Object.entries(personalStats.lessons)
      .slice(0, 7)
      .map(([lessonId, stats]) => ({
        lesson: lessonId.replace('lesson-', ''),
        wpm: stats.bestWpm,
        accuracy: stats.bestAccuracy,
        attempts: stats.attempts,
        completed: stats.completedCount
      }));
  }, [personalStats]);

  const totalStats = useMemo(() => {
    if (!personalStats) return null;
    
    const totalLessons = Object.keys(personalStats.lessons).length;
    const totalAttempts = Object.values(personalStats.lessons)
      .reduce((sum, lesson) => sum + lesson.attempts, 0);
    const completedLessons = Object.values(personalStats.lessons)
      .reduce((sum, lesson) => sum + lesson.completedCount, 0);
    const avgWpm = Object.values(personalStats.lessons)
      .reduce((sum, lesson) => sum + lesson.bestWpm, 0) / totalLessons || 0;
    const avgAccuracy = Object.values(personalStats.lessons)
      .reduce((sum, lesson) => sum + lesson.bestAccuracy, 0) / totalLessons || 0;

    return {
      totalLessons,
      totalAttempts,
      completedLessons,
      avgWpm: Math.round(avgWpm),
      avgAccuracy: Math.round(avgAccuracy),
      completionRate: Math.round((completedLessons / totalAttempts) * 100) || 0
    };
  }, [personalStats]);

  const performanceLevel = useMemo(() => {
    if (!personalStats) return { level: 'Beginner', progress: 0, color: 'text-muted-foreground' };
    
    const wpm = personalStats.bestWpm;
    const accuracy = personalStats.bestAccuracy;
    
    if (wpm >= 60 && accuracy >= 95) {
      return { level: 'Expert', progress: 100, color: 'text-yellow-500' };
    } else if (wpm >= 40 && accuracy >= 85) {
      return { level: 'Advanced', progress: 75, color: 'text-blue-500' };
    } else if (wpm >= 20 && accuracy >= 75) {
      return { level: 'Intermediate', progress: 50, color: 'text-green-500' };
    }
    return { level: 'Beginner', progress: 25, color: 'text-gray-500' };
  }, [personalStats]);

  const commonErrorsList = useMemo(() => {
    if (!personalStats?.commonErrors) return [];
    
    return Object.entries(personalStats.commonErrors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([char, count]) => ({ char, count }));
  }, [personalStats]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!personalStats || !totalStats) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Progress Dashboard</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No typing data available yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start typing to see your progress!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-2">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Progress Dashboard</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-muted">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Performance Level Card */}
      <Card className="bg-gradient-to-br from-card via-card/50 to-muted/20 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className={`h-5 w-5 ${performanceLevel.color}`} />
              <span>Performance Level</span>
            </CardTitle>
            <Badge variant="secondary" className={`${performanceLevel.color} font-medium`}>
              {performanceLevel.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={performanceLevel.progress} className="h-3" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{personalStats.bestWpm}</div>
              <div className="text-xs text-muted-foreground">Best WPM</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{Math.round(personalStats.bestAccuracy)}%</div>
              <div className="text-xs text-muted-foreground">Best Accuracy</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold">{formatTime(personalStats.totalTimeTyped)}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Characters</p>
                <p className="text-2xl font-bold">{personalStats.totalCharactersTyped.toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lessons</p>
                <p className="text-2xl font-bold">{totalStats.totalLessons}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">{totalStats.completionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Lesson Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="space-y-4">
              {chartData.map((lesson, index) => (
                <div key={lesson.lesson} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Lesson {lesson.lesson}</span>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <span>{lesson.wpm} WPM</span>
                      <span>{Math.round(lesson.accuracy)}%</span>
                      <Badge variant="outline" className="text-xs">
                        {lesson.attempts} attempts
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>WPM</span>
                        <span>{lesson.wpm}/80</span>
                      </div>
                      <Progress value={(lesson.wpm / 80) * 100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Accuracy</span>
                        <span>{Math.round(lesson.accuracy)}%</span>
                      </div>
                      <Progress value={lesson.accuracy} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No lesson data available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Common Errors Analysis */}
      {commonErrorsList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Areas for Improvement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commonErrorsList.map((error, index) => (
                <div key={error.char} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center font-mono text-sm font-bold">
                      {error.char === ' ' ? '⎵' : error.char}
                    </div>
                    <span className="text-sm">
                      {error.char === ' ' ? 'Space' : `"${error.char}"`} key
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{error.count} errors</span>
                    <div className="w-16">
                      <Progress 
                        value={(error.count / Math.max(...commonErrorsList.map(e => e.count))) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Activity (Placeholder for future implementation) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Activity Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Average WPM</div>
              <div className="text-2xl font-bold">{totalStats.avgWpm}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-1" />
                Based on {totalStats.totalAttempts} sessions
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Average Accuracy</div>
              <div className="text-2xl font-bold">{totalStats.avgAccuracy}%</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Target className="h-4 w-4 mr-1" />
                Across all lessons
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Session Completion Rate</span>
              <span className="font-medium">{totalStats.completionRate}%</span>
            </div>
            <Progress value={totalStats.completionRate} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Errors</span>
              <span className="font-medium text-destructive">{personalStats.totalErrors}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Error Rate</span>
              <span className="font-medium">
                {personalStats.totalCharactersTyped > 0 
                  ? ((personalStats.totalErrors / personalStats.totalCharactersTyped) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;