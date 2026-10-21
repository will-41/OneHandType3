import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import {
  Trophy,
  Star,
  Crown,
  Award,
  Zap,
  Shield,
  Coins,
  Gem,
  Gift,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Target,
  Flame,
  Heart,
  Sword,
  BookOpen,
  Palette,
  Keyboard,
  Clock,
  Users,
  Globe,
  Mountain,
  Waves,
  Sun,
  Eye,
  ArrowUp,
  Plus
} from 'lucide-react';

// Import curriculum and theme data
import { 
  gamifiedCurriculum,
  type CurriculumLevel,
  type CurriculumLesson,
  type RewardSystem
} from '../lib/gamifiedCurriculum';

// ============================================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================================

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: 'speed' | 'accuracy' | 'consistency' | 'progression' | 'special';
  requirement: string;
  xpReward: number;
  coinReward: number;
  unlocksTheme?: string;
  unlocksLayout?: string;
  badgeIcon: string;
  isSecret?: boolean;
  storyTheme?: {
    guild: string;
    character: string;
    reference: string;
  };
}

const achievements: Achievement[] = [
  // Common Achievements
  {
    id: 'first-steps',
    title: 'First Steps in the Hearthlands',
    description: 'Complete your first typing lesson',
    icon: Flame,
    rarity: 'common',
    category: 'progression',
    requirement: 'Complete 1 lesson',
    xpReward: 100,
    coinReward: 50,
    badgeIcon: '🔥',
    storyTheme: {
      guild: 'Emberkeepers',
      character: 'Mira Lanternwick',
      reference: 'Taking first steps by the warm Hearthstone'
    }
  },
  {
    id: 'emberkeeper-loyalty',
    title: 'Emberkeeper Loyalty',
    description: 'Complete all lessons in The Hearthlands level',
    icon: Shield,
    rarity: 'rare',
    category: 'progression',
    requirement: 'Complete Level 1',
    xpReward: 500,
    coinReward: 250,
    unlocksTheme: 'Ember Glow',
    badgeIcon: '🕯️',
    storyTheme: {
      guild: 'Emberkeepers',
      character: 'Tobin Reedwhistle',
      reference: 'Steady care above all'
    }
  },
  
  // Speed Achievements
  {
    id: 'stormwarden-fury',
    title: 'Stormwarden Fury',
    description: 'Achieve 50 WPM in a single lesson',
    icon: Zap,
    rarity: 'epic',
    category: 'speed',
    requirement: '50 WPM',
    xpReward: 750,
    coinReward: 400,
    badgeIcon: '⚡',
    storyTheme: {
      guild: 'Stormwardens',
      character: 'Brann Thunderhale',
      reference: 'Swift as the storm, fierce as the thunder'
    }
  },
  {
    id: 'blazing-speed',
    title: 'Blazing Speed',
    description: 'Achieve 80 WPM average across 10 lessons',
    icon: Flame,
    rarity: 'legendary',
    category: 'speed',
    requirement: '80 WPM average',
    xpReward: 1500,
    coinReward: 800,
    unlocksLayout: 'ARTSEY Chorded',
    badgeIcon: '🌠',
    storyTheme: {
      guild: 'Emberkeepers',
      character: 'Mira Lanternwick',
      reference: 'Swift as a kindled flame'
    }
  },
  
  // Accuracy Achievements
  {
    id: 'orchard-precision',
    title: 'Orchard Precision',
    description: 'Achieve 95% accuracy in 5 consecutive lessons',
    icon: Target,
    rarity: 'rare',
    category: 'accuracy',
    requirement: '95% accuracy × 5',
    xpReward: 600,
    coinReward: 300,
    unlocksTheme: 'Orchard Gold',
    badgeIcon: '🌸',
    storyTheme: {
      guild: 'Orchard Wardens',
      character: 'Rosalind Thornfield',
      reference: 'Grace and precision in all things'
    }
  },
  {
    id: 'perfect-honor',
    title: 'Perfect Honor',
    description: 'Achieve 100% accuracy in any lesson',
    icon: Crown,
    rarity: 'epic',
    category: 'accuracy',
    requirement: '100% accuracy',
    xpReward: 1000,
    coinReward: 500,
    badgeIcon: '👑',
    storyTheme: {
      guild: 'Cloudwatchers',
      character: 'Aldric Highcrest',
      reference: 'Aim high, type true - perfection achieved'
    }
  },
  
  // Consistency Achievements
  {
    id: 'frostwatch-vigilance',
    title: 'Frostwatch Vigilance',
    description: 'Practice for 7 consecutive days',
    icon: Eye,
    rarity: 'rare',
    category: 'consistency',
    requirement: '7 day streak',
    xpReward: 800,
    coinReward: 400,
    badgeIcon: '🖤',
    storyTheme: {
      guild: 'Frostwatch Rangers',
      character: 'Halvard Coldbrook',
      reference: 'Keeping the beacon lit - constant vigilance'
    }
  },
  
  // Special Secret Achievements
  {
    id: 'crown-of-keys-master',
    title: 'Master of the Crown of Keys',
    description: 'Complete all 10 levels with perfect scores',
    icon: Crown,
    rarity: 'mythic',
    category: 'special',
    requirement: 'Complete all levels perfectly',
    xpReward: 5000,
    coinReward: 2500,
    unlocksTheme: 'Crown of Keys',
    badgeIcon: '⚔️',
    isSecret: true,
    storyTheme: {
      guild: 'The Crown of Keys',
      character: 'The Player',
      reference: 'You are the one true master of typing'
    }
  },
  {
    id: 'error-eraser',
    title: 'Error Eraser',
    description: 'Eliminate 1000 typing errors',
    icon: Sword,
    rarity: 'legendary',
    category: 'special',
    requirement: '1000 errors corrected',
    xpReward: 2000,
    coinReward: 1000,
    badgeIcon: '⚡',
    isSecret: true,
    storyTheme: {
      guild: 'Ledgerkeepers',
      character: 'Tamsin Goldsworth',
      reference: 'Every digit has its place - and errors do not'
    }
  }
];

// ============================================================================
// REWARD NOTIFICATION COMPONENT
// ============================================================================

interface RewardNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  achievement?: Achievement;
  xpGained?: number;
  coinsGained?: number;
  levelUp?: boolean;
  newLevel?: number;
  themeUnlocked?: string;
  layoutUnlocked?: string;
}

const RewardNotification: React.FC<RewardNotificationProps> = ({
  isOpen,
  onClose,
  achievement,
  xpGained = 0,
  coinsGained = 0,
  levelUp = false,
  newLevel,
  themeUnlocked,
  layoutUnlocked
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const rarityConfig = {
    common: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' },
    rare: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
    epic: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
    legendary: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
    mythic: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700' }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="relative overflow-hidden">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="animate-ping absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="animate-ping absolute top-8 right-6 w-1 h-1 bg-blue-400 rounded-full animation-delay-300"></div>
              <div className="animate-ping absolute bottom-8 left-8 w-1 h-1 bg-green-400 rounded-full animation-delay-600"></div>
              <div className="animate-ping absolute bottom-4 right-4 w-2 h-2 bg-purple-400 rounded-full animation-delay-900"></div>
            </div>
          )}

          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-yellow-600 flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8" />
              Achievement Unlocked!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Achievement Card */}
            {achievement && (
              <Card className={cn(
                "p-6 text-center border-2",
                rarityConfig[achievement.rarity].bg,
                rarityConfig[achievement.rarity].border
              )}>
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <achievement.icon className="w-8 h-8 text-yellow-600" />
                  </div>
                  
                  <div>
                    <div className="text-2xl mb-2">{achievement.badgeIcon}</div>
                    <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    
                    {achievement.storyTheme && (
                      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-3 rounded-lg">
                        <div className="text-xs text-slate-300 mb-1">
                          {achievement.storyTheme.guild}
                        </div>
                        <div className="text-sm font-medium mb-1">
                          {achievement.storyTheme.character}
                        </div>
                        <div className="text-xs text-slate-300 italic">
                          "{achievement.storyTheme.reference}"
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Badge className={cn(
                    "text-xs font-bold",
                    rarityConfig[achievement.rarity].text
                  )}>
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                </div>
              </Card>
            )}

            {/* Rewards Summary */}
            <div className="grid grid-cols-2 gap-4">
              {xpGained > 0 && (
                <Card className="p-4 text-center bg-blue-50">
                  <Star className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">+{xpGained}</div>
                  <div className="text-xs text-blue-700">Experience</div>
                </Card>
              )}
              
              {coinsGained > 0 && (
                <Card className="p-4 text-center bg-yellow-50">
                  <Coins className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <div className="text-2xl font-bold text-yellow-600">+{coinsGained}</div>
                  <div className="text-xs text-yellow-700">Coins</div>
                </Card>
              )}
            </div>

            {/* Level Up */}
            {levelUp && newLevel && (
              <Card className="p-4 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <ArrowUp className="w-8 h-8 mx-auto mb-2" />
                <div className="text-xl font-bold">Level Up!</div>
                <div className="text-lg">You are now Level {newLevel}</div>
              </Card>
            )}

            {/* Unlocks */}
            <div className="space-y-2">
              {themeUnlocked && (
                <Card className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-medium text-sm">Theme Unlocked!</div>
                      <div className="text-xs text-muted-foreground">{themeUnlocked}</div>
                    </div>
                  </div>
                </Card>
              )}
              
              {layoutUnlocked && (
                <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Layout Unlocked!</div>
                      <div className="text-xs text-muted-foreground">{layoutUnlocked}</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Action Button */}
            <Button onClick={onClose} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Awesome!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// ACHIEVEMENT GALLERY COMPONENT
// ============================================================================

interface AchievementGalleryProps {
  unlockedAchievements: string[];
  className?: string;
}

const AchievementGallery: React.FC<AchievementGalleryProps> = ({
  unlockedAchievements,
  className
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      // Filter by unlock status
      if (filter === 'unlocked' && !unlockedAchievements.includes(achievement.id)) return false;
      if (filter === 'locked' && unlockedAchievements.includes(achievement.id)) return false;
      
      // Filter by category
      if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false;
      
      // Hide secret achievements if not unlocked
      if (achievement.isSecret && !unlockedAchievements.includes(achievement.id)) return false;
      
      return true;
    });
  }, [filter, categoryFilter, unlockedAchievements]);

  const rarityConfig = {
    common: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' },
    rare: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
    epic: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
    legendary: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
    mythic: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700' }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Achievement Gallery</h2>
            <p className="text-amber-100">
              {unlockedAchievements.length} of {achievements.filter(a => !a.isSecret).length} achievements unlocked
            </p>
          </div>
        </div>
        
        <Progress 
          value={(unlockedAchievements.length / achievements.filter(a => !a.isSecret).length) * 100} 
          className="h-3 bg-amber-600" 
        />
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            {['all', 'unlocked', 'locked'].map(filterType => (
              <Button
                key={filterType}
                size="sm"
                variant={filter === filterType ? "default" : "outline"}
                onClick={() => setFilter(filterType as any)}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {['all', 'speed', 'accuracy', 'consistency', 'progression', 'special'].map(category => (
              <Button
                key={category}
                size="sm"
                variant={categoryFilter === category ? "default" : "outline"}
                onClick={() => setCategoryFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const config = rarityConfig[achievement.rarity];
          
          return (
            <Card
              key={achievement.id}
              className={cn(
                "p-4 transition-all duration-300",
                isUnlocked ? cn("border-2", config.bg, config.border) : "opacity-60 bg-gray-50",
                isUnlocked && "hover:shadow-lg hover:scale-105"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    isUnlocked ? "bg-white shadow-md" : "bg-gray-200"
                  )}>
                    {isUnlocked ? (
                      <achievement.icon className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <Crown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <Badge className={cn(
                    "text-xs",
                    isUnlocked ? config.text : "text-gray-500"
                  )}>
                    {achievement.rarity}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-lg mb-1">{achievement.badgeIcon}</div>
                  <h3 className="font-bold text-sm mb-1">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  
                  {isUnlocked && achievement.storyTheme && (
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-2 rounded text-xs">
                      <div className="text-slate-300">{achievement.storyTheme.guild}</div>
                      <div className="font-medium">{achievement.storyTheme.character}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{achievement.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-600" />
                    <span>{achievement.coinReward}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface CurriculumRewardSystemProps {
  className?: string;
}

const CurriculumRewardSystem: React.FC<CurriculumRewardSystemProps> = ({ 
  className 
}) => {
  const { stats, unlockedAchievements, completedLessons } = useTypingStore();
  
  // Notification state
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [pendingReward, setPendingReward] = useState<{
    achievement?: Achievement;
    xpGained?: number;
    coinsGained?: number;
    levelUp?: boolean;
    newLevel?: number;
    themeUnlocked?: string;
    layoutUnlocked?: string;
  } | null>(null);

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = () => {
      achievements.forEach(achievement => {
        if (unlockedAchievements.includes(achievement.id)) return;
        
        let shouldUnlock = false;
        
        // Check achievement requirements based on current stats
        switch (achievement.id) {
          case 'first-steps':
            shouldUnlock = completedLessons.length >= 1;
            break;
          case 'emberkeeper-loyalty':
            shouldUnlock = completedLessons.filter(id => id.startsWith('lesson-1-')).length >= 3;
            break;
          case 'stormwarden-fury':
            shouldUnlock = stats.bestWpm >= 50;
            break;
          case 'blazing-speed':
            shouldUnlock = stats.bestWpm >= 80;
            break;
          case 'orchard-precision':
            shouldUnlock = stats.bestAccuracy >= 95;
            break;
          case 'perfect-honor':
            shouldUnlock = stats.bestAccuracy >= 100;
            break;
          // Add more achievement checks here
        }
        
        if (shouldUnlock) {
          // Trigger reward notification
          setPendingReward({
            achievement,
            xpGained: achievement.xpReward,
            coinsGained: achievement.coinReward,
            themeUnlocked: achievement.unlocksTheme,
            layoutUnlocked: achievement.unlocksLayout
          });
          setShowRewardDialog(true);
        }
      });
    };
    
    checkAchievements();
  }, [stats, completedLessons, unlockedAchievements]);

  return (
    <div className={cn("space-y-6", className)}>
      <AchievementGallery unlockedAchievements={unlockedAchievements} />
      
      <RewardNotification
        isOpen={showRewardDialog}
        onClose={() => {
          setShowRewardDialog(false);
          setPendingReward(null);
        }}
        {...(pendingReward || {})}
      />
    </div>
  );
};

export default CurriculumRewardSystem;