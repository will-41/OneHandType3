import { 
  type InternationalLayout, 
  type SpecializedLayoutType,
  isSpecializedLayout 
} from './keyboardLayouts';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'ergonomics' | 'mastery' | 'dedication' | 'special';
  layout?: InternationalLayout | SpecializedLayoutType;
  condition: (stats: any, layoutStats: any) => boolean;
  reward?: {
    title?: string;
    badge?: string;
    unlocks?: string[];
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface ProgressMilestone {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: 'characters' | 'chords' | 'hours' | 'lessons' | 'wpm' | 'accuracy';
  layout?: InternationalLayout | SpecializedLayoutType;
}

export const specializedAchievements: Achievement[] = [
  // ARTSEY Achievements
  {
    id: 'artsey_first_chord',
    name: 'First Chord',
    description: 'Successfully type your first character using ARTSEY chord combinations',
    icon: '🎯',
    category: 'mastery',
    layout: 'artsey',
    condition: (stats, layoutStats) => layoutStats?.artsey?.totalChords >= 1,
    rarity: 'common',
    points: 10
  },
  {
    id: 'artsey_chord_master_50',
    name: 'Chord Apprentice',
    description: 'Complete 50 chord combinations in ARTSEY',
    icon: '🎵',
    category: 'mastery',
    layout: 'artsey',
    condition: (stats, layoutStats) => layoutStats?.artsey?.totalChords >= 50,
    rarity: 'uncommon',
    points: 25
  },
  {
    id: 'artsey_chord_master_500',
    name: 'Chord Master',
    description: 'Complete 500 chord combinations in ARTSEY',
    icon: '🎼',
    category: 'mastery',
    layout: 'artsey',
    condition: (stats, layoutStats) => layoutStats?.artsey?.totalChords >= 500,
    rarity: 'rare',
    points: 100
  },
  {
    id: 'artsey_speed_demon',
    name: 'ARTSEY Speed Demon',
    description: 'Achieve 30 WPM with ARTSEY layout',
    icon: '⚡',
    category: 'speed',
    layout: 'artsey',
    condition: (stats, layoutStats) => layoutStats?.artsey?.bestWpmForLayout >= 30,
    rarity: 'epic',
    points: 200
  },
  {
    id: 'artsey_accuracy_champion',
    name: 'Chord Precision Master',
    description: 'Achieve 95% accuracy with ARTSEY layout',
    icon: '🎯',
    category: 'accuracy',
    layout: 'artsey',
    condition: (stats, layoutStats) => layoutStats?.artsey?.bestAccuracyForLayout >= 95,
    rarity: 'rare',
    points: 150
  },

  // Maltron Achievements
  {
    id: 'maltron_ergonomic_master',
    name: 'Ergonomic Excellence',
    description: 'Maintain an average ergonomic score of 9+ with Maltron',
    icon: '🌟',
    category: 'ergonomics',
    layout: 'maltron',
    condition: (stats, layoutStats) => layoutStats?.maltron?.avgErgonomicScore >= 9,
    rarity: 'rare',
    points: 120
  },
  {
    id: 'maltron_speed_50',
    name: 'Maltron Velocity',
    description: 'Achieve 50 WPM with Maltron layout',
    icon: '🚀',
    category: 'speed',
    layout: 'maltron',
    condition: (stats, layoutStats) => layoutStats?.maltron?.bestWpmForLayout >= 50,
    rarity: 'uncommon',
    points: 80
  },
  {
    id: 'maltron_strain_free',
    name: 'Strain-Free Typing',
    description: 'Complete a session with zero strain points using Maltron',
    icon: '💚',
    category: 'ergonomics',
    layout: 'maltron',
    condition: (stats, layoutStats) => {
      return layoutStats?.maltron && 
             layoutStats.maltron.totalCharacters > 100 &&
             (!layoutStats.maltron.strainPoints || layoutStats.maltron.strainPoints.length === 0);
    },
    rarity: 'uncommon',
    points: 60
  },

  // Dvorak One-Hand Achievements
  {
    id: 'dvorak_one_hand_adaptation',
    name: 'Dvorak Adaptation',
    description: 'Reach 75% adaptation progress with Dvorak One-Hand',
    icon: '🧬',
    category: 'mastery',
    layout: 'dvorak-one-hand',
    condition: (stats, layoutStats) => layoutStats?.['dvorak-one-hand']?.adaptationProgress >= 75,
    rarity: 'uncommon',
    points: 70
  },
  {
    id: 'dvorak_one_hand_speed_40',
    name: 'One-Hand Velocity',
    description: 'Achieve 40 WPM with Dvorak One-Hand',
    icon: '💨',
    category: 'speed',
    layout: 'dvorak-one-hand',
    condition: (stats, layoutStats) => layoutStats?.['dvorak-one-hand']?.bestWpmForLayout >= 40,
    rarity: 'uncommon',
    points: 90
  },

  // Cross-Layout Achievements
  {
    id: 'layout_explorer',
    name: 'Layout Explorer',
    description: 'Try at least 3 different specialized layouts',
    icon: '🗺️',
    category: 'special',
    condition: (stats, layoutStats) => {
      const specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
      const triedLayouts = specializedLayouts.filter(layout => layoutStats?.[layout]?.totalCharacters > 0);
      return triedLayouts.length >= 3;
    },
    rarity: 'rare',
    points: 150
  },
  {
    id: 'dedication_marathon',
    name: 'Specialized Layout Marathon',
    description: 'Practice specialized layouts for over 10 hours total',
    icon: '🏃‍♂️',
    category: 'dedication',
    condition: (stats, layoutStats) => {
      const specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
      const totalHours = specializedLayouts.reduce((sum, layout) => {
        return sum + (layoutStats?.[layout]?.hoursOfPractice || 0);
      }, 0);
      return totalHours >= 10;
    },
    rarity: 'epic',
    points: 250
  },
  {
    id: 'perfect_lesson_specialized',
    name: 'Specialized Perfection',
    description: 'Complete a lesson with 100% accuracy using any specialized layout',
    icon: '💎',
    category: 'accuracy',
    condition: (stats, layoutStats) => {
      const specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
      return specializedLayouts.some(layout => 
        layoutStats?.[layout]?.bestAccuracyForLayout === 100
      );
    },
    rarity: 'rare',
    points: 180
  },

  // Advanced Mastery Achievements
  {
    id: 'ergonomic_champion',
    name: 'Ergonomic Champion',
    description: 'Maintain excellent ergonomic scores across all specialized layouts',
    icon: '👑',
    category: 'ergonomics',
    condition: (stats, layoutStats) => {
      const specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
      const eligibleLayouts = specializedLayouts.filter(layout => 
        layoutStats?.[layout]?.totalCharacters >= 100
      );
      
      if (eligibleLayouts.length < 2) return false;
      
      return eligibleLayouts.every(layout => 
        layoutStats[layout].avgErgonomicScore >= 8
      );
    },
    rarity: 'legendary',
    points: 500
  },
  {
    id: 'speed_across_all',
    name: 'Universal Speed Master',
    description: 'Achieve 30+ WPM across all specialized layouts you\'ve practiced',
    icon: '🌟',
    category: 'speed',
    condition: (stats, layoutStats) => {
      const specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
      const practicedLayouts = specializedLayouts.filter(layout => 
        layoutStats?.[layout]?.totalCharacters >= 200
      );
      
      if (practicedLayouts.length < 2) return false;
      
      return practicedLayouts.every(layout => 
        layoutStats[layout].bestWpmForLayout >= 30
      );
    },
    rarity: 'legendary',
    points: 600
  }
];

export const progressMilestones: ProgressMilestone[] = [
  // ARTSEY Milestones
  {
    id: 'artsey_chords_100',
    name: 'Chord Combinations',
    description: 'Master ARTSEY chord combinations',
    target: 100,
    current: 0,
    unit: 'chords',
    layout: 'artsey'
  },
  {
    id: 'artsey_accuracy_90',
    name: 'ARTSEY Accuracy Goal',
    description: 'Reach 90% accuracy with ARTSEY',
    target: 90,
    current: 0,
    unit: 'accuracy',
    layout: 'artsey'
  },

  // Maltron Milestones
  {
    id: 'maltron_characters_1000',
    name: 'Maltron Mastery',
    description: 'Type 1000 characters with Maltron',
    target: 1000,
    current: 0,
    unit: 'characters',
    layout: 'maltron'
  },
  {
    id: 'maltron_wpm_45',
    name: 'Maltron Speed Goal',
    description: 'Reach 45 WPM with Maltron',
    target: 45,
    current: 0,
    unit: 'wpm',
    layout: 'maltron'
  },

  // Dvorak One-Hand Milestones
  {
    id: 'dvorak_oh_hours_5',
    name: 'Dvorak One-Hand Practice',
    description: 'Practice for 5 hours total',
    target: 5,
    current: 0,
    unit: 'hours',
    layout: 'dvorak-one-hand'
  }
];

/**
 * Check which achievements have been unlocked based on current stats
 */
export function checkAchievements(
  generalStats: any,
  layoutSpecificStats: any,
  currentAchievements: string[] = []
): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const achievement of specializedAchievements) {
    // Skip if already unlocked
    if (currentAchievements.includes(achievement.id)) continue;

    // Check if condition is met
    try {
      if (achievement.condition(generalStats, layoutSpecificStats)) {
        newAchievements.push(achievement);
      }
    } catch (error) {
      console.warn(`Error checking achievement ${achievement.id}:`, error);
    }
  }

  return newAchievements;
}

/**
 * Update progress milestones based on current stats
 */
export function updateProgressMilestones(
  layoutSpecificStats: any
): ProgressMilestone[] {
  return progressMilestones.map(milestone => {
    let current = 0;

    if (milestone.layout && layoutSpecificStats?.[milestone.layout]) {
      const layoutStats = layoutSpecificStats[milestone.layout];
      
      switch (milestone.unit) {
        case 'characters':
          current = layoutStats.totalCharacters || 0;
          break;
        case 'chords':
          current = layoutStats.totalChords || 0;
          break;
        case 'hours':
          current = Math.floor(layoutStats.hoursOfPractice || 0);
          break;
        case 'wpm':
          current = layoutStats.bestWpmForLayout || 0;
          break;
        case 'accuracy':
          current = Math.floor(layoutStats.bestAccuracyForLayout || 0);
          break;
        default:
          current = 0;
      }
    }

    return {
      ...milestone,
      current: Math.min(current, milestone.target)
    };
  });
}

/**
 * Generate insights and recommendations based on progress
 */
export function generateProgressInsights(
  layoutSpecificStats: any
): {
  insights: string[];
  recommendations: string[];
  strongAreas: string[];
  improvementAreas: string[];
} {
  const insights: string[] = [];
  const recommendations: string[] = [];
  const strongAreas: string[] = [];
  const improvementAreas: string[] = [];

  const specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
  
  for (const layout of specializedLayouts) {
    const stats = layoutSpecificStats?.[layout];
    if (!stats || stats.totalCharacters < 10) continue;

    const layoutName = layout.replace('-', ' ').toUpperCase();

    // Speed analysis
    if (stats.bestWpmForLayout >= 40) {
      strongAreas.push(`Excellent speed with ${layoutName} (${stats.bestWpmForLayout} WPM)`);
    } else if (stats.bestWpmForLayout < 20) {
      improvementAreas.push(`Speed needs work with ${layoutName}`);
      recommendations.push(`Practice short bursts with ${layoutName} to build speed`);
    }

    // Accuracy analysis
    if (stats.bestAccuracyForLayout >= 95) {
      strongAreas.push(`High accuracy with ${layoutName} (${Math.round(stats.bestAccuracyForLayout)}%)`);
    } else if (stats.bestAccuracyForLayout < 85) {
      improvementAreas.push(`Accuracy could improve with ${layoutName}`);
      recommendations.push(`Focus on precision over speed with ${layoutName}`);
    }

    // Ergonomic analysis
    if (stats.avgErgonomicScore >= 8.5) {
      strongAreas.push(`Excellent ergonomic form with ${layoutName}`);
    } else if (stats.avgErgonomicScore < 7) {
      improvementAreas.push(`Ergonomic form needs attention with ${layoutName}`);
      recommendations.push(`Review finger positioning for ${layoutName}`);
    }

    // Adaptation analysis
    if (stats.adaptationProgress >= 80) {
      insights.push(`You're well-adapted to ${layoutName} (${Math.round(stats.adaptationProgress)}% adaptation)`);
    } else if (stats.adaptationProgress < 50) {
      insights.push(`${layoutName} is still challenging - keep practicing!`);
    }

    // Practice time analysis
    if (stats.hoursOfPractice >= 5) {
      insights.push(`Dedicated ${layoutName} practitioner (${Math.round(stats.hoursOfPractice * 10) / 10} hours)`);
    }
  }

  // Cross-layout insights
  const practicedLayouts = specializedLayouts.filter(layout => 
    layoutSpecificStats?.[layout]?.totalCharacters >= 50
  );

  if (practicedLayouts.length >= 2) {
    insights.push(`You're exploring multiple specialized layouts - great for cognitive flexibility!`);
  }

  // ARTSEY specific insights
  if (layoutSpecificStats?.artsey?.totalChords >= 100) {
    insights.push(`ARTSEY chord mastery is developing - ${layoutSpecificStats.artsey.totalChords} chords completed`);
  }

  return {
    insights,
    recommendations,
    strongAreas,
    improvementAreas
  };
}

/**
 * Calculate overall progress score across all specialized layouts
 */
export function calculateOverallProgress(layoutSpecificStats: any): {
  score: number; // 0-100
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  breakdown: {
    [layout: string]: {
      score: number;
      factors: string[];
    };
  };
} {
  const specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
  const breakdown: any = {};
  let totalScore = 0;
  let layoutCount = 0;

  for (const layout of specializedLayouts) {
    const stats = layoutSpecificStats?.[layout];
    if (!stats || stats.totalCharacters < 10) continue;

    layoutCount++;
    const factors: string[] = [];
    let layoutScore = 0;

    // Speed component (30%)
    const speedScore = Math.min(100, (stats.bestWpmForLayout / 50) * 100);
    layoutScore += speedScore * 0.3;
    factors.push(`Speed: ${Math.round(speedScore)}%`);

    // Accuracy component (25%)
    const accuracyScore = stats.bestAccuracyForLayout || 0;
    layoutScore += accuracyScore * 0.25;
    factors.push(`Accuracy: ${Math.round(accuracyScore)}%`);

    // Adaptation component (25%)
    const adaptationScore = stats.adaptationProgress || 0;
    layoutScore += adaptationScore * 0.25;
    factors.push(`Adaptation: ${Math.round(adaptationScore)}%`);

    // Experience component (20%)
    const experienceScore = Math.min(100, (stats.hoursOfPractice / 10) * 100);
    layoutScore += experienceScore * 0.2;
    factors.push(`Experience: ${Math.round(experienceScore)}%`);

    breakdown[layout] = {
      score: Math.round(layoutScore),
      factors
    };

    totalScore += layoutScore;
  }

  const averageScore = layoutCount > 0 ? totalScore / layoutCount : 0;

  let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  if (averageScore >= 85) level = 'Master';
  else if (averageScore >= 70) level = 'Expert';
  else if (averageScore >= 55) level = 'Advanced';
  else if (averageScore >= 35) level = 'Intermediate';
  else level = 'Beginner';

  return {
    score: Math.round(averageScore),
    level,
    breakdown
  };
}