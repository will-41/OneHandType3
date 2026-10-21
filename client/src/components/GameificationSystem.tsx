import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Zap, 
  Crown, 
  Award, 
  Medal,
  Gift,
  Calendar,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface XPLevel {
  level: number;
  currentXP: number;
  requiredXP: number;
  title: string;
}

// XP calculation and level system
const calculateLevel = (totalXP: number): XPLevel => {
  let level = 1;
  let requiredXP = 100;
  let currentLevelXP = 0;
  
  while (totalXP >= requiredXP) {
    totalXP -= requiredXP;
    currentLevelXP = totalXP;
    level++;
    requiredXP = Math.floor(requiredXP * 1.2); // 20% increase per level
  }
  
  const titles = [
    "Novice Typist", "Apprentice", "Skilled Typist", "Expert", "Master",
    "Grand Master", "Typing Virtuoso", "Keyboard Legend", "Typing God"
  ];
  
  const titleIndex = Math.min(Math.floor((level - 1) / 5), titles.length - 1);
  
  return {
    level,
    currentXP: currentLevelXP,
    requiredXP,
    title: titles[titleIndex]
  };
};

// Achievement definitions
const achievementDefinitions: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'Getting Started',
    description: 'Complete your first lesson',
    icon: <Star className="w-6 h-6" />,
    rarity: 'bronze',
    points: 50,
    progress: 0,
    maxProgress: 1,
    unlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Reach 60 WPM in a single lesson',
    icon: <Zap className="w-6 h-6" />,
    rarity: 'gold',
    points: 200,
    progress: 0,
    maxProgress: 60,
    unlocked: false
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a lesson with 100% accuracy',
    icon: <Target className="w-6 h-6" />,
    rarity: 'silver',
    points: 150,
    progress: 0,
    maxProgress: 100,
    unlocked: false
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Practice for 7 days in a row',
    icon: <Flame className="w-6 h-6" />,
    rarity: 'gold',
    points: 300,
    progress: 0,
    maxProgress: 7,
    unlocked: false
  },
  {
    id: 'marathon_typist',
    title: 'Marathon Typist',
    description: 'Type for 60 minutes in a single session',
    icon: <Clock className="w-6 h-6" />,
    rarity: 'platinum',
    points: 500,
    progress: 0,
    maxProgress: 60,
    unlocked: false
  },
  {
    id: 'lightning_fingers',
    title: 'Lightning Fingers',
    description: 'Reach 100 WPM',
    icon: <Crown className="w-6 h-6" />,
    rarity: 'diamond',
    points: 1000,
    progress: 0,
    maxProgress: 100,
    unlocked: false
  }
];

// Daily challenges
const dailyChallenges = [
  {
    id: 'daily_speed',
    title: 'Speed Challenge',
    description: 'Reach 50 WPM in any lesson',
    reward: 100,
    icon: <Zap className="w-5 h-5" />,
    completed: false
  },
  {
    id: 'daily_accuracy',
    title: 'Accuracy Challenge',
    description: 'Complete a lesson with 95% accuracy',
    reward: 80,
    icon: <Target className="w-5 h-5" />,
    completed: false
  },
  {
    id: 'daily_streak',
    title: 'Streak Challenge',
    description: 'Maintain a 50+ character streak',
    reward: 60,
    icon: <Flame className="w-5 h-5" />,
    completed: false
  }
];

// Leaderboard component
const Leaderboard: React.FC<{ theme: string }> = ({ theme }) => {
  const mockLeaderboard = [
    { rank: 1, name: 'TypeMaster', wpm: 95, accuracy: 98, avatar: '👑' },
    { rank: 2, name: 'SpeedTyper', wpm: 89, accuracy: 96, avatar: '🥇' },
    { rank: 3, name: 'KeyboardNinja', wpm: 84, accuracy: 97, avatar: '🥈' },
    { rank: 4, name: 'You', wpm: 67, accuracy: 94, avatar: '🎯' },
    { rank: 5, name: 'FastFingers', wpm: 62, accuracy: 93, avatar: '⚡' }
  ];

  return (
    <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Weekly Leaderboard
      </h3>
      <div className="space-y-2">
        {mockLeaderboard.map((player) => (
          <div 
            key={player.rank}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg transition-all duration-200",
              player.name === 'You' 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                : theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50',
              "hover:scale-105 cursor-pointer"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{player.avatar}</div>
              <div>
                <div className={`font-semibold ${player.name === 'You' ? 'text-blue-500' : ''}`}>
                  #{player.rank} {player.name}
                </div>
                <div className="text-sm text-gray-500">
                  {player.wpm} WPM • {player.accuracy}% accuracy
                </div>
              </div>
            </div>
            {player.rank <= 3 && (
              <Badge className={
                player.rank === 1 ? 'bg-yellow-500' :
                player.rank === 2 ? 'bg-gray-400' :
                'bg-orange-500'
              }>
                {player.rank === 1 ? '👑' : player.rank === 2 ? '🥈' : '🥉'}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// Achievement showcase
const AchievementShowcase: React.FC<{ 
  achievements: Achievement[]; 
  theme: string;
  onAchievementClick: (achievement: Achievement) => void;
}> = ({ achievements, theme, onAchievementClick }) => {
  const getRarityColor = (rarity: string) => {
    const colors = {
      bronze: 'from-orange-600 to-orange-700',
      silver: 'from-gray-400 to-gray-500',
      gold: 'from-yellow-500 to-yellow-600',
      platinum: 'from-purple-500 to-purple-600',
      diamond: 'from-cyan-400 to-blue-500'
    };
    return colors[rarity as keyof typeof colors] || colors.bronze;
  };

  const getRarityGlow = (rarity: string) => {
    const glows = {
      bronze: 'shadow-orange-500/50',
      silver: 'shadow-gray-400/50',
      gold: 'shadow-yellow-500/50',
      platinum: 'shadow-purple-500/50',
      diamond: 'shadow-cyan-400/50'
    };
    return glows[rarity as keyof typeof glows] || glows.bronze;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <Card
          key={achievement.id}
          className={cn(
            "p-4 cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden",
            achievement.unlocked 
              ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white shadow-lg ${getRarityGlow(achievement.rarity)}`
              : theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-200',
            !achievement.unlocked && 'opacity-60 grayscale'
          )}
          onClick={() => onAchievementClick(achievement)}
        >
          {/* Shine effect for unlocked achievements */}
          {achievement.unlocked && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
          )}
          
          <div className="relative z-10 text-center space-y-2">
            <div className={cn(
              "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2",
              achievement.unlocked 
                ? 'bg-white/20 backdrop-blur-sm' 
                : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            )}>
              {achievement.icon}
            </div>
            
            <h4 className="font-bold text-sm">{achievement.title}</h4>
            <p className="text-xs opacity-90">{achievement.description}</p>
            
            {!achievement.unlocked && achievement.progress > 0 && (
              <div className="mt-2">
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-2"
                />
                <div className="text-xs mt-1">
                  {achievement.progress}/{achievement.maxProgress}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-1 text-xs">
              <Star className="w-3 h-3" />
              <span>{achievement.points} XP</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Main gamification component
const GameificationSystem: React.FC<{ className?: string }> = ({ className }) => {
  const { themeMode, stats } = useTypingStore();
  const [achievements, setAchievements] = useState<Achievement[]>(achievementDefinitions);
  const [totalXP, setTotalXP] = useState(500); // Mock XP
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'challenges'>('overview');
  const [showAchievementModal, setShowAchievementModal] = useState<Achievement | null>(null);

  const level = calculateLevel(totalXP);
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  // Mock achievement unlocking
  useEffect(() => {
    const timer = setTimeout(() => {
      setAchievements(prev => 
        prev.map(achievement => 
          achievement.id === 'first_lesson' 
            ? { ...achievement, unlocked: true, unlockedAt: new Date() }
            : achievement
        )
      );
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAchievementClick = (achievement: Achievement) => {
    setShowAchievementModal(achievement);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* XP and Level Display */}
      <Card className={`p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {level.level}</h2>
            <p className="text-purple-200">{level.title}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">⚡</div>
            <div className="text-sm opacity-90">{totalXP} Total XP</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {level.level + 1}</span>
            <span>{level.currentXP}/{level.requiredXP} XP</span>
          </div>
          <Progress 
            value={(level.currentXP / level.requiredXP) * 100} 
            className="h-3 bg-purple-800"
          />
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
          { id: 'leaderboard', label: 'Leaderboard', icon: <Users className="w-4 h-4" /> },
          { id: 'challenges', label: 'Daily Challenges', icon: <Calendar className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
              selectedTab === tab.id
                ? "bg-blue-500 text-white shadow-lg"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Overview */}
          <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Best WPM</span>
                <span className="font-bold text-blue-500">{stats.bestWpm || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Best Accuracy</span>
                <span className="font-bold text-green-500">{stats.bestAccuracy || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Practice Time</span>
                <span className="font-bold text-purple-500">{Math.round((stats.totalTimeTyped || 0) / 60)}m</span>
              </div>
              <div className="flex justify-between">
                <span>Achievements</span>
                <span className="font-bold text-yellow-500">{unlockedAchievements.length}/{achievements.length}</span>
              </div>
            </div>
          </Card>

          {/* Recent Achievements */}
          <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">Recent Achievements</h3>
            <div className="space-y-2">
              {unlockedAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                  <div className="text-yellow-500">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{achievement.title}</div>
                    <div className="text-xs opacity-75">{achievement.points} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>5 day streak</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <span>3 perfect lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>2.5 hours practiced</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>450 XP earned</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedTab === 'achievements' && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Achievements</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Unlocked: {unlockedAchievements.length}/{achievements.length}</span>
              <span>Total XP: {unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}</span>
            </div>
          </div>
          <AchievementShowcase 
            achievements={achievements} 
            theme={themeMode}
            onAchievementClick={handleAchievementClick}
          />
        </div>
      )}

      {selectedTab === 'leaderboard' && (
        <Leaderboard theme={themeMode} />
      )}

      {selectedTab === 'challenges' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Daily Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyChallenges.map((challenge) => (
              <Card key={challenge.id} className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-blue-500">{challenge.icon}</div>
                  <h4 className="font-bold">{challenge.title}</h4>
                </div>
                <p className="text-sm mb-4 opacity-75">{challenge.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Gift className="w-4 h-4 text-yellow-500" />
                    <span>{challenge.reward} XP</span>
                  </div>
                  <Badge variant={challenge.completed ? "default" : "outline"}>
                    {challenge.completed ? "Completed" : "Active"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`max-w-md w-full p-6 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="text-center space-y-4">
              <div className={cn(
                "mx-auto w-20 h-20 rounded-full flex items-center justify-center text-3xl",
                showAchievementModal.unlocked 
                  ? `bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg animate-pulse`
                  : themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              )}>
                {showAchievementModal.icon}
              </div>
              
              <div>
                <h3 className="text-xl font-bold">{showAchievementModal.title}</h3>
                <p className="text-sm opacity-75 mt-1">{showAchievementModal.description}</p>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">{showAchievementModal.points} XP</span>
              </div>
              
              {showAchievementModal.unlocked && showAchievementModal.unlockedAt && (
                <p className="text-xs opacity-60">
                  Unlocked {showAchievementModal.unlockedAt.toLocaleDateString()}
                </p>
              )}
              
              <button
                onClick={() => setShowAchievementModal(null)}
                className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameificationSystem;