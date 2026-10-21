import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { lessons } from '../lib/lessons';
import {
  Crown,
  CheckCircle,
  Play,
  ArrowRight,
  Brain,
  Trophy,
  Palette,
  Keyboard,
  Sparkles,
  Gift,
  Coins,
  Lock,
  Zap,
  Target,
  Shield,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Clock,
  BarChart3,
  MapPin
} from 'lucide-react';

// Realm lesson navigator using authentic lesson data
interface RealmLessonNavigatorProps {
  onStartLesson?: (lesson: any) => void;
  className?: string;
}

const RealmLessonNavigator: React.FC<RealmLessonNavigatorProps> = ({ onStartLesson, className }) => {
  const { stats, completedLessons } = useTypingStore();
  
  // Group real lessons by category for themed regions
  const lessonsByCategory = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, typeof lessons>);

  // Themed regions mapping to real lesson categories
  const regions = [
    {
      id: 'hearthlands',
      name: 'The Hearthlands',
      description: 'Master the basics with the Emberkeepers',
      guild: 'Emberkeepers',
      lessons: lessonsByCategory.basics || [],
      color: 'from-orange-600 to-amber-700'
    },
    {
      id: 'silverflow',
      name: 'The Silverflow Delta',
      description: 'Learn common words with the Tidewrights',
      guild: 'Tidewrights', 
      lessons: lessonsByCategory.words || [],
      color: 'from-sky-600 to-blue-700'
    },
    {
      id: 'bloomvale',
      name: 'Bloomvale Orchards',
      description: 'Practice sentences with the Orchard Wardens',
      guild: 'Orchard Wardens',
      lessons: lessonsByCategory.sentences || [],
      color: 'from-emerald-600 to-lime-500'
    },
    {
      id: 'gildmoor',
      name: 'Gildmoor',
      description: 'Master advanced techniques with the Ledgerkeepers',
      guild: 'Ledgerkeepers',
      lessons: lessonsByCategory.advanced || [],
      color: 'from-yellow-500 to-amber-600'
    }
  ];
  
  return (
    <Card className={className}>
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <Crown className="w-8 w-8 text-yellow-500" />
            Realm of Keys Academy
          </h3>
          <p className="text-muted-foreground">Master the art of one-handed typing through the Ten Realms</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regions.map((region, index) => (
            <Card key={region.id} className={`overflow-hidden border-2 hover:shadow-xl transition-all duration-300`}>
              <div className={`h-2 bg-gradient-to-r ${region.color}`} />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold">{region.name}</h4>
                    <p className="text-sm text-muted-foreground">{region.guild}</p>
                  </div>
                  <Badge variant="outline" className="font-bold">
                    {region.lessons.length} Lessons
                  </Badge>
                </div>
                
                <p className="text-sm">{region.description}</p>
                
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground mb-2">Available Lessons:</div>
                  <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {region.lessons.slice(0, 6).map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      return (
                        <Button
                          key={lesson.id}
                          variant={isCompleted ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-between text-left h-auto py-2"
                          onClick={() => {
                            console.log('Realm lesson selected:', lesson);
                            onStartLesson?.(lesson);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                            <div>
                              <div className="font-medium text-xs">{lesson.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Level {lesson.level} • {lesson.targetWpm} WPM
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      );
                    })}
                    {region.lessons.length > 6 && (
                      <div className="text-xs text-center text-muted-foreground py-2">
                        +{region.lessons.length - 6} more lessons...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};

const AdaptiveLearningEngine: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={className}>
    <div className="p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-600" />
        AI Learning Coach
      </h3>
      <p className="text-sm text-muted-foreground">Personalized recommendations based on your performance will appear here.</p>
    </div>
  </Card>
);

const CurriculumRewardSystem: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={className}>
    <div className="p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Reward System
      </h3>
      <p className="text-sm text-muted-foreground">Complete lessons to earn rewards and unlock achievements!</p>
    </div>
  </Card>
);

const EnhancedPremiumThemeSystem: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={className}>
    <div className="p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-blue-600" />
        Premium Themes
      </h3>
      <p className="text-sm text-muted-foreground">Unlock beautiful themes as you progress through the realms!</p>
    </div>
  </Card>
);

// ============================================================================
// POINT SYSTEM AND UNLOCK MECHANICS
// ============================================================================

interface UserPointSystem {
  totalXP: number;
  currentLevel: number;
  coinsEarned: number;
  coinsSpent: number;
  availableCoins: number;
  levelProgress: number; // 0-100
  nextLevelXP: number;
  achievements: string[];
  unlockedThemes: string[];
  unlockedLayouts: string[];
  specialUnlocks: string[];
}

interface UnlockableItem {
  id: string;
  name: string;
  type: 'theme' | 'layout' | 'feature';
  cost: number;
  requiresLevel?: number;
  requiresAchievement?: string;
  requiresAccuracy?: number;
  requiresWPM?: number;
  description: string;
  preview?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  storyTheme?: {
    guild: string;
    character: string;
    reference: string;
  };
}

// Define unlockable items based on Realm of Keys progression
const unlockableItems: UnlockableItem[] = [
  // Themes from Level Rewards
  {
    id: 'ember-glow',
    name: 'Ember Glow',
    type: 'theme',
    cost: 500,
    requiresLevel: 1,
    description: 'The warm, steady glow of the Hearthlands',
    rarity: 'common',
    storyTheme: {
      guild: 'Emberkeepers',
      character: 'Mira Lanternwick',
      reference: 'Warmth and duty in the Hearthlands'
    }
  },
  {
    id: 'silverflow-blue',
    name: 'Silverflow Blue',
    type: 'theme',
    cost: 750,
    requiresLevel: 2,
    description: 'Flowing rivers and endless streams',
    rarity: 'common',
    storyTheme: {
      guild: 'Tidewrights',
      character: 'Corin Marshwater',
      reference: 'Steady as the river, patient as the tide'
    }
  },
  {
    id: 'orchard-gold',
    name: 'Orchard Gold',
    type: 'theme',
    cost: 1000,
    requiresLevel: 3,
    requiresAccuracy: 94,
    description: 'Golden blossoms and bountiful harvests',
    rarity: 'rare',
    storyTheme: {
      guild: 'Orchard Wardens',
      character: 'Rosalind Thornfield',
      reference: 'Growing strong with grace and beauty'
    }
  },
  {
    id: 'gildmoor-crimson',
    name: 'Gildmoor Crimson',
    type: 'theme',
    cost: 1500,
    requiresLevel: 4,
    requiresWPM: 30,
    description: 'The wealth and power of the Gildmoor exchanges',
    rarity: 'rare',
    storyTheme: {
      guild: 'Ledgerkeepers',
      character: 'Tamsin Goldsworth',
      reference: 'Every ledger balances in the end'
    }
  },
  {
    id: 'stormy-skies',
    name: 'Stormy Skies',
    type: 'theme',
    cost: 2000,
    requiresLevel: 5,
    requiresWPM: 35,
    description: 'The fury and power of the Stormcrest Coast',
    rarity: 'epic',
    storyTheme: {
      guild: 'Stormwardens',
      character: 'Brann Thunderhale',
      reference: 'Ride the thunder, do not fear it'
    }
  },
  {
    id: 'sky-blue-honor',
    name: 'Sky Blue Honor',
    type: 'theme',
    cost: 2500,
    requiresLevel: 6,
    requiresAccuracy: 97,
    description: 'As high as honor, pure as mountain air',
    rarity: 'epic',
    storyTheme: {
      guild: 'Cloudwatchers',
      character: 'Aldric Highcrest',
      reference: 'Aim high, type true'
    }
  },
  {
    id: 'desert-sunset',
    name: 'Desert Sunset',
    type: 'theme',
    cost: 3000,
    requiresLevel: 7,
    requiresWPM: 45,
    description: 'The patient endurance of the Sunscar',
    rarity: 'epic',
    storyTheme: {
      guild: 'Sandwalkers',
      character: 'Rhea Dustwalker',
      reference: 'The desert rewards those who keep walking'
    }
  },
  {
    id: 'tidebreak-storm',
    name: 'Tidebreak Storm',
    type: 'theme',
    cost: 4000,
    requiresLevel: 8,
    requiresWPM: 50,
    description: 'The harsh salt winds of the Tidebreak Isles',
    rarity: 'legendary',
    storyTheme: {
      guild: 'Saltwind Sailors',
      character: 'Finn Brinewick',
      reference: 'Steady hands steer true'
    }
  },
  {
    id: 'frostgate-night',
    name: 'Frostgate Night',
    type: 'theme',
    cost: 5000,
    requiresLevel: 9,
    requiresWPM: 60,
    requiresAccuracy: 99,
    description: 'The eternal vigil of the Frostwatch',
    rarity: 'legendary',
    storyTheme: {
      guild: 'Frostwatch Rangers',
      character: 'Halvard Coldbrook',
      reference: 'Snow gathers on the pass, and my vigil begins'
    }
  },
  {
    id: 'crown-of-keys',
    name: 'Crown of Keys',
    type: 'theme',
    cost: 10000,
    requiresLevel: 10,
    requiresWPM: 80,
    requiresAccuracy: 99.5,
    description: 'The ultimate seat of typing power',
    rarity: 'legendary',
    storyTheme: {
      guild: 'The Crown of Keys',
      character: 'The Player',
      reference: 'You are the rightful master of all keyboards'
    }
  },

  // Keyboard Layouts
  {
    id: 'dvorak-one-hand',
    name: 'Dvorak One-Hand',
    type: 'layout',
    cost: 1200,
    requiresLevel: 3,
    description: 'Ergonomic layout optimized for single-hand typing',
    rarity: 'rare'
  },
  {
    id: 'maltron-layout',
    name: 'Maltron Layout',
    type: 'layout',
    cost: 2000,
    requiresLevel: 5,
    requiresWPM: 35,
    description: 'Professional ergonomic layout for comfort',
    rarity: 'epic'
  },
  {
    id: 'artsey-chorded',
    name: 'ARTSEY Chorded',
    type: 'layout',
    cost: 3500,
    requiresLevel: 7,
    requiresWPM: 45,
    description: 'Advanced chord-based typing system',
    rarity: 'legendary'
  },

  // Special Features
  {
    id: 'ember-trail-effects',
    name: 'Ember Trail Effects',
    type: 'feature',
    cost: 2500,
    requiresLevel: 8,
    requiresAchievement: 'blazing-speed',
    description: 'Fiery visual effects for high-speed typing',
    rarity: 'epic'
  },
  {
    id: 'guild-party-mode',
    name: 'Guild Party Mode',
    type: 'feature',
    cost: 1500,
    requiresLevel: 6,
    requiresAchievement: 'emberkeeper-loyalty',
    description: 'Multiplayer collaborative typing mode',
    rarity: 'rare'
  }
];

// Calculate user points from stats
interface TypingStats {
  bestWpm?: number;
  bestAccuracy?: number;
  totalTime?: number;
  sessionsCompleted?: number;
}

const calculateUserPoints = (stats: TypingStats, completedLessons: string[]): UserPointSystem => {
  // Base XP calculation from lessons and performance
  const lessonXP = completedLessons.length * 150; // Average XP per lesson
  const performanceXP = (stats.bestWpm || 0) * 10 + (stats.bestAccuracy || 0) * 5;
  const totalXP = lessonXP + performanceXP;
  
  // Level calculation (every 1000 XP = 1 level)
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const levelProgress = ((totalXP % 1000) / 1000) * 100;
  const nextLevelXP = (currentLevel * 1000) - totalXP;
  
  // Coin calculation (roughly 1 coin per 2 XP, plus bonuses)
  const baseCoins = Math.floor(totalXP / 2);
  const bonusCoins = completedLessons.length * 25; // Bonus coins for completion
  const coinsEarned = baseCoins + bonusCoins;
  
  return {
    totalXP,
    currentLevel,
    coinsEarned,
    coinsSpent: 0, // Would track from purchases
    availableCoins: coinsEarned, // Minus spent coins
    levelProgress,
    nextLevelXP,
    achievements: [], // Would come from achievement system
    unlockedThemes: [],
    unlockedLayouts: [],
    specialUnlocks: []
  };
};

// ============================================================================
// UNLOCK STORE COMPONENT
// ============================================================================

interface UnlockStoreProps {
  userPoints: UserPointSystem;
  onPurchase: (item: UnlockableItem) => void;
  className?: string;
}

const UnlockStore: React.FC<UnlockStoreProps> = ({
  userPoints,
  onPurchase,
  className
}) => {
  const [filter, setFilter] = useState<'all' | 'themes' | 'layouts' | 'features'>('all');
  const [sortBy, setSortBy] = useState<'cost' | 'level' | 'rarity'>('cost');

  const filteredItems = useMemo(() => {
    let items = unlockableItems;
    
    // Filter by type
    if (filter !== 'all') {
      const typeMap = { themes: 'theme', layouts: 'layout', features: 'feature' };
      items = items.filter(item => item.type === typeMap[filter]);
    }
    
    // Sort items
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return a.cost - b.cost;
        case 'level':
          return (a.requiresLevel || 0) - (b.requiresLevel || 0);
        case 'rarity':
          const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        default:
          return 0;
      }
    });
    
    return items;
  }, [filter, sortBy]);

  const canAfford = (item: UnlockableItem) => userPoints.availableCoins >= item.cost;
  const meetsRequirements = (item: UnlockableItem, stats: TypingStats) => {
    if (item.requiresLevel && userPoints.currentLevel < item.requiresLevel) return false;
    if (item.requiresWPM && (stats.bestWpm || 0) < item.requiresWPM) return false;
    if (item.requiresAccuracy && (stats.bestAccuracy || 0) < item.requiresAccuracy) return false;
    if (item.requiresAchievement && !userPoints.achievements.includes(item.requiresAchievement)) return false;
    return true;
  };

  const rarityColors = {
    common: 'border-gray-300 bg-gray-50',
    rare: 'border-blue-300 bg-blue-50',
    epic: 'border-purple-300 bg-purple-50',
    legendary: 'border-orange-300 bg-orange-50'
  };

  const typeIcons = {
    theme: Palette,
    layout: Keyboard,
    feature: Sparkles
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Store Header */}
      <Card className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Typing Mastery Store
            </h2>
            <p className="text-yellow-100">
              Unlock themes, layouts, and features with your earned coins
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">{userPoints.availableCoins}</div>
            <div className="text-yellow-100 text-sm flex items-center gap-1">
              <Coins className="w-4 h-4" />
              Available Coins
            </div>
          </div>
        </div>
      </Card>

      {/* Filters and Sorting */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            {['all', 'themes', 'layouts', 'features'].map(filterType => (
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
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="cost">Cost</option>
              <option value="level">Level Required</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Store Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const IconComponent = typeIcons[item.type];
          const affordable = canAfford(item);
          const meetsReqs = meetsRequirements(item, { bestWpm: 0, bestAccuracy: 0 }); // Would use real stats
          const canPurchase = affordable && meetsReqs;
          
          return (
            <Card
              key={item.id}
              className={cn(
                "p-4 transition-all duration-300",
                rarityColors[item.rarity],
                canPurchase ? "hover:shadow-lg cursor-pointer" : "opacity-75"
              )}
            >
              <div className="space-y-4">
                {/* Item Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-sm">{item.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {item.rarity}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Coins className="w-4 h-4" />
                      <span className="font-bold">{item.cost}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>

                {/* Story theme (if applicable) */}
                {item.storyTheme && (
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-3 rounded">
                    <div className="text-xs text-slate-300 mb-1">
                      {item.storyTheme.guild}
                    </div>
                    <div className="text-sm font-medium mb-1">
                      {item.storyTheme.character}
                    </div>
                    <div className="text-xs text-slate-300 italic">
                      "{item.storyTheme.reference}"
                    </div>
                  </div>
                )}

                {/* Requirements */}
                <div className="space-y-1 text-xs">
                  {item.requiresLevel && (
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>Level {item.requiresLevel} required</span>
                      {userPoints.currentLevel >= item.requiresLevel ? 
                        <CheckCircle className="w-3 h-3 text-green-500" /> :
                        <Lock className="w-3 h-3 text-red-500" />
                      }
                    </div>
                  )}
                  {item.requiresWPM && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>{item.requiresWPM} WPM required</span>
                    </div>
                  )}
                  {item.requiresAccuracy && (
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>{item.requiresAccuracy}% accuracy required</span>
                    </div>
                  )}
                </div>

                {/* Purchase Button */}
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!canPurchase}
                  onClick={() => canPurchase && onPurchase(item)}
                >
                  {!affordable ? (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Insufficient Coins
                    </>
                  ) : !meetsReqs ? (
                    <>
                      <Shield className="w-3 h-3 mr-1" />
                      Requirements Not Met
                    </>
                  ) : (
                    <>
                      <Gift className="w-3 h-3 mr-1" />
                      Purchase
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// PROGRESS DASHBOARD COMPONENT
// ============================================================================

interface ProgressDashboardProps {
  userPoints: UserPointSystem;
  curriculumProgress: {
    lessonsCompleted: number;
    totalLessons: number;
    currentLevel: number;
    progressPercentage: number;
    nextMilestone?: string;
    estimatedCompletion?: string;
  };
  className?: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userPoints,
  curriculumProgress,
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Level Progress */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              Level {userPoints.currentLevel}
            </h2>
            <p className="text-blue-100">
              Continue your journey through the Ten Realms
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold">{userPoints.totalXP}</div>
            <div className="text-blue-200 text-sm">Total XP</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {userPoints.currentLevel + 1}</span>
            <span>{Math.round(userPoints.levelProgress)}%</span>
          </div>
          <Progress value={userPoints.levelProgress} className="h-3 bg-blue-700" />
          <div className="text-xs text-blue-200">
            {userPoints.nextLevelXP} XP until next level
          </div>
        </div>
      </Card>

      {/* Curriculum Progress */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold">Realm Conquest Progress</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {curriculumProgress.lessonsCompleted}
            </div>
            <div className="text-xs text-muted-foreground">Lessons Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {curriculumProgress.currentLevel}
            </div>
            <div className="text-xs text-muted-foreground">Current Realm</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((curriculumProgress.lessonsCompleted / curriculumProgress.totalLessons) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {userPoints.unlockedThemes.length + userPoints.unlockedLayouts.length}
            </div>
            <div className="text-xs text-muted-foreground">Items Unlocked</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{curriculumProgress.nextMilestone}</span>
            <span>{curriculumProgress.estimatedCompletion}</span>
          </div>
          <Progress 
            value={(curriculumProgress.lessonsCompleted / curriculumProgress.totalLessons) * 100} 
            className="h-3" 
          />
        </div>
      </Card>

      {/* Coin Balance */}
      <Card className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Coin Treasury
            </h3>
            <p className="text-yellow-100 text-sm">
              Earned through skill and dedication
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{userPoints.availableCoins}</div>
            <div className="text-yellow-200 text-sm">Available</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-yellow-400">
          <div className="text-center">
            <div className="text-lg font-bold">{userPoints.coinsEarned}</div>
            <div className="text-yellow-200 text-xs">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{userPoints.coinsSpent}</div>
            <div className="text-yellow-200 text-xs">Total Spent</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ============================================================================
// MAIN INTEGRATION COMPONENT
// ============================================================================

interface CurriculumProgressIntegrationProps {
  className?: string;
  onStartLesson?: (lesson: any) => void;
}

const CurriculumProgressIntegration: React.FC<CurriculumProgressIntegrationProps> = ({ 
  className,
  onStartLesson 
}) => {
  const { stats, completedLessons, setKeyboardLayout, setColorTheme } = useTypingStore();
  
  // Calculate user progress and points
  const curriculumProgress = useMemo(() => ({
    lessonsCompleted: completedLessons.length,
    totalLessons: lessons.length,
    currentLevel: Math.floor(completedLessons.length / 5) + 1,
    progressPercentage: (completedLessons.length / lessons.length) * 100,
    nextMilestone: `Realm ${Math.floor(completedLessons.length / 5) + 2}`,
    estimatedCompletion: `${Math.max(0, lessons.length - completedLessons.length)} lessons remaining`
  }), [completedLessons]);
  
  const userPoints = useMemo(() => ({
    totalXP: completedLessons.length * 100 + (stats.bestWpm || 0) * 10,
    currentLevel: Math.floor((completedLessons.length * 100) / 500) + 1,
    levelProgress: ((completedLessons.length * 100) % 500) / 5,
    nextLevelXP: 500 - ((completedLessons.length * 100) % 500),
    coinsEarned: completedLessons.length * 50,
    coinsSpent: 0,
    availableCoins: completedLessons.length * 50,
    unlockedThemes: [],
    unlockedLayouts: [],
    achievements: [],
    specialUnlocks: []
  }), [stats, completedLessons]);

  // State
  const [purchaseDialog, setPurchaseDialog] = useState<{
    isOpen: boolean;
    item: UnlockableItem | null;
  }>({ isOpen: false, item: null });

  // Handle purchases
  const handlePurchase = (item: UnlockableItem) => {
    setPurchaseDialog({ isOpen: true, item });
  };

  const confirmPurchase = () => {
    const { item } = purchaseDialog;
    if (!item) return;

    // Apply the unlock based on item type
    switch (item.type) {
      case 'theme':
        // Find theme index and apply it
        console.log(`Unlocking theme: ${item.name}`);
        // This would integrate with the theme system
        break;
      case 'layout':
        // Apply keyboard layout
        console.log(`Unlocking layout: ${item.name}`);
        if (item.id === 'dvorak-one-hand') {
          setKeyboardLayout('dvorak');
        } else if (item.id === 'maltron-layout') {
          setKeyboardLayout('maltron');
        } else if (item.id === 'artsey-chorded') {
          setKeyboardLayout('artsey');
        }
        break;
      case 'feature': 
        console.log(`Unlocking feature: ${item.name}`);
        break;
    }

    setPurchaseDialog({ isOpen: false, item: null });
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Main Navigation Tabs */}
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="curriculum" className="text-xs">
            <BookOpen className="w-4 h-4 mr-1" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">
            <TrendingUp className="w-4 h-4 mr-1" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="store" className="text-xs">
            <Gift className="w-4 h-4 mr-1" />
            Store
          </TabsTrigger>
          <TabsTrigger value="adaptive" className="text-xs">
            <Brain className="w-4 h-4 mr-1" />
            AI Coach
          </TabsTrigger>
          <TabsTrigger value="themes" className="text-xs">
            <Palette className="w-4 h-4 mr-1" />
            Themes
          </TabsTrigger>
        </TabsList>

        {/* Curriculum/Lessons Tab */}
        <TabsContent value="curriculum" className="space-y-6">
          <RealmLessonNavigator onStartLesson={onStartLesson} />
        </TabsContent>

        {/* Progress Dashboard Tab */}
        <TabsContent value="progress" className="space-y-6">
          <ProgressDashboard 
            userPoints={userPoints}
            curriculumProgress={curriculumProgress}
          />
          <CurriculumRewardSystem />
        </TabsContent>

        {/* Store Tab */}
        <TabsContent value="store" className="space-y-6">
          <UnlockStore 
            userPoints={userPoints}
            onPurchase={handlePurchase}
          />
        </TabsContent>

        {/* Adaptive Learning Tab */}
        <TabsContent value="adaptive" className="space-y-6">
          <AdaptiveLearningEngine />
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          <EnhancedPremiumThemeSystem />
        </TabsContent>
      </Tabs>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={purchaseDialog.isOpen} onOpenChange={(open) => 
        setPurchaseDialog({ isOpen: open, item: purchaseDialog.item })
      }>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-yellow-600" />
              Confirm Purchase
            </DialogTitle>
          </DialogHeader>
          
          {purchaseDialog.item && (
            <div className="space-y-4">
              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg">{purchaseDialog.item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {purchaseDialog.item.description}
                  </p>
                  
                  {purchaseDialog.item.storyTheme && (
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-3 rounded">
                      <div className="text-xs text-slate-300">
                        {purchaseDialog.item.storyTheme.guild}
                      </div>
                      <div className="text-sm font-medium">
                        {purchaseDialog.item.storyTheme.character}
                      </div>
                      <div className="text-xs text-slate-300 italic">
                        "{purchaseDialog.item.storyTheme.reference}"
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-1 text-yellow-600 text-xl font-bold">
                    <Coins className="w-5 h-5" />
                    {purchaseDialog.item.cost}
                  </div>
                </div>
              </Card>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setPurchaseDialog({ isOpen: false, item: null })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={confirmPurchase} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurriculumProgressIntegration;