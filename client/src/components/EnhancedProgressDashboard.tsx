import { useState, useMemo } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTypingStore } from "../lib/stores/useTypingStore";
import { cn } from "../lib/utils";
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Award,
  BarChart3,
  Activity,
  Zap,
  X
} from "lucide-react";

interface EnhancedProgressDashboardProps {
  onClose: () => void;
  className?: string;
}

const EnhancedProgressDashboard = ({ onClose, className }: EnhancedProgressDashboardProps) => {
  const { stats, unlockedAchievements, handPreference } = useTypingStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'analytics'>('overview');

  // Calculate progress metrics
  const progressMetrics = useMemo(() => {
    const totalLessons = Object.keys(stats.lessons).length;
    const completedLessons = Object.values(stats.lessons).reduce((sum, lesson) => sum + lesson.completedCount, 0);
    const totalTime = Math.round(stats.totalTimeTyped);
    const averageAccuracy = stats.totalCharactersTyped > 0 
      ? Math.round(((stats.totalCharactersTyped - stats.totalErrors) / stats.totalCharactersTyped) * 100)
      : 0;

    return {
      totalLessons,
      completedLessons,
      totalTime,
      averageAccuracy,
      totalCharacters: stats.totalCharactersTyped,
      wpmImprovement: stats.bestWpm > 0 ? '+' + Math.round(stats.bestWpm * 0.2) : 0
    };
  }, [stats]);

  // Achievement categories for mobile display
  const achievementCategories = [
    { id: 'speed', name: 'Speed', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'accuracy', name: 'Accuracy', icon: <Target className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    { id: 'consistency', name: 'Streak', icon: <Calendar className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'milestone', name: 'Milestone', icon: <Trophy className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' }
  ];

  const StatCard = ({ title, value, icon, trend, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    subtitle?: string;
  }) => (
    <Card className="p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="relative space-y-2">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          {trend && (
            <Badge variant="secondary" className="text-xs">
              {trend}
            </Badge>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground/80">{subtitle}</div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Your Progress
              </h2>
              <p className="text-muted-foreground mt-1">
                {handPreference} hand typing • Mobile optimized
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              aria-label="Close progress dashboard"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile-Optimized Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: <Activity className="h-4 w-4" /> },
              { id: 'achievements', label: 'Awards', icon: <Trophy className="h-4 w-4" /> },
              { id: 'analytics', label: 'Stats', icon: <TrendingUp className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  "hover:bg-muted/50 border-b-2 border-transparent",
                  activeTab === tab.id && "border-primary text-primary bg-primary/5"
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Best Speed"
                  value={`${stats.bestWpm} WPM`}
                  icon={<Zap className="h-4 w-4" />}
                  trend={progressMetrics.wpmImprovement ? `${progressMetrics.wpmImprovement} WPM` : undefined}
                />
                <StatCard
                  title="Best Accuracy"
                  value={`${stats.bestAccuracy}%`}
                  icon={<Target className="h-4 w-4" />}
                />
                <StatCard
                  title="Practice Time"
                  value={progressMetrics.totalTime}
                  subtitle="minutes"
                  icon={<Clock className="h-4 w-4" />}
                />
                <StatCard
                  title="Lessons Done"
                  value={progressMetrics.completedLessons}
                  subtitle={`of ${progressMetrics.totalLessons} available`}
                  icon={<Award className="h-4 w-4" />}
                />
              </div>

              {/* Recent Activity */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.lessons).slice(0, 3).map(([lessonId, lesson]) => (
                    <div key={lessonId} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <div className="font-medium text-sm">Lesson {lessonId}</div>
                        <div className="text-xs text-muted-foreground">
                          {lesson.attempts} attempts • Best: {lesson.bestWpm} WPM
                        </div>
                      </div>
                      <Badge variant={lesson.bestAccuracy >= 90 ? "default" : "secondary"}>
                        {lesson.bestAccuracy}% accuracy
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Achievement Categories */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {achievementCategories.map((category) => (
                  <Card key={category.id} className="p-4 text-center">
                    <div className={cn("inline-flex p-2 rounded-lg mb-2", category.color)}>
                      {category.icon}
                    </div>
                    <div className="font-medium text-sm">{category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {unlockedAchievements.filter(a => a.includes(category.id)).length} unlocked
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recent Achievements */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Recent Achievements</h3>
                <div className="space-y-2">
                  {unlockedAchievements.slice(-5).map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-primary/5">
                      <Trophy className="h-4 w-4 text-primary" />
                      <div className="text-sm capitalize">{achievement.replace(/-/g, ' ')}</div>
                    </div>
                  ))}
                  {unlockedAchievements.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Start typing to unlock achievements!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Detailed Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Typing Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Characters</span>
                      <span className="font-medium">{progressMetrics.totalCharacters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Errors</span>
                      <span className="font-medium">{stats.totalErrors.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Accuracy</span>
                      <span className="font-medium">{progressMetrics.averageAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Practice Sessions</span>
                      <span className="font-medium">{Object.values(stats.lessons).reduce((sum, l) => sum + l.attempts, 0)}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Common Errors</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.commonErrors)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([char, count]) => (
                        <div key={char} className="flex items-center justify-between">
                          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {char === ' ' ? 'Space' : char}
                          </span>
                          <Badge variant="outline">{count} errors</Badge>
                        </div>
                      ))}
                    {Object.keys(stats.commonErrors).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No error data yet. Keep practicing!
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EnhancedProgressDashboard;