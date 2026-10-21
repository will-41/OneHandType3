"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressMilestones = exports.specializedAchievements = void 0;
exports.checkAchievements = checkAchievements;
exports.updateProgressMilestones = updateProgressMilestones;
exports.generateProgressInsights = generateProgressInsights;
exports.calculateOverallProgress = calculateOverallProgress;
exports.specializedAchievements = [
    // ARTSEY Achievements
    {
        id: 'artsey_first_chord',
        name: 'First Chord',
        description: 'Successfully type your first character using ARTSEY chord combinations',
        icon: '🎯',
        category: 'mastery',
        layout: 'artsey',
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats.artsey) === null || _a === void 0 ? void 0 : _a.totalChords) >= 1; },
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
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats.artsey) === null || _a === void 0 ? void 0 : _a.totalChords) >= 50; },
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
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats.artsey) === null || _a === void 0 ? void 0 : _a.totalChords) >= 500; },
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
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats.artsey) === null || _a === void 0 ? void 0 : _a.bestWpmForLayout) >= 30; },
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
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats.artsey) === null || _a === void 0 ? void 0 : _a.bestAccuracyForLayout) >= 95; },
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
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats.maltron) === null || _a === void 0 ? void 0 : _a.avgErgonomicScore) >= 9; },
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
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats.maltron) === null || _a === void 0 ? void 0 : _a.bestWpmForLayout) >= 50; },
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
        condition: function (stats, layoutStats) {
            return (layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats.maltron) &&
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
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats['dvorak-one-hand']) === null || _a === void 0 ? void 0 : _a.adaptationProgress) >= 75; },
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
        condition: function (stats, layoutStats) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats['dvorak-one-hand']) === null || _a === void 0 ? void 0 : _a.bestWpmForLayout) >= 40; },
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
        condition: function (stats, layoutStats) {
            var specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
            var triedLayouts = specializedLayouts.filter(function (layout) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats[layout]) === null || _a === void 0 ? void 0 : _a.totalCharacters) > 0; });
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
        condition: function (stats, layoutStats) {
            var specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
            var totalHours = specializedLayouts.reduce(function (sum, layout) {
                var _a;
                return sum + (((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats[layout]) === null || _a === void 0 ? void 0 : _a.hoursOfPractice) || 0);
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
        condition: function (stats, layoutStats) {
            var specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
            return specializedLayouts.some(function (layout) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats[layout]) === null || _a === void 0 ? void 0 : _a.bestAccuracyForLayout) === 100; });
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
        condition: function (stats, layoutStats) {
            var specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
            var eligibleLayouts = specializedLayouts.filter(function (layout) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats[layout]) === null || _a === void 0 ? void 0 : _a.totalCharacters) >= 100; });
            if (eligibleLayouts.length < 2)
                return false;
            return eligibleLayouts.every(function (layout) {
                return layoutStats[layout].avgErgonomicScore >= 8;
            });
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
        condition: function (stats, layoutStats) {
            var specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
            var practicedLayouts = specializedLayouts.filter(function (layout) { var _a; return ((_a = layoutStats === null || layoutStats === void 0 ? void 0 : layoutStats[layout]) === null || _a === void 0 ? void 0 : _a.totalCharacters) >= 200; });
            if (practicedLayouts.length < 2)
                return false;
            return practicedLayouts.every(function (layout) {
                return layoutStats[layout].bestWpmForLayout >= 30;
            });
        },
        rarity: 'legendary',
        points: 600
    }
];
exports.progressMilestones = [
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
function checkAchievements(generalStats, layoutSpecificStats, currentAchievements) {
    if (currentAchievements === void 0) { currentAchievements = []; }
    var newAchievements = [];
    for (var _i = 0, specializedAchievements_1 = exports.specializedAchievements; _i < specializedAchievements_1.length; _i++) {
        var achievement = specializedAchievements_1[_i];
        // Skip if already unlocked
        if (currentAchievements.includes(achievement.id))
            continue;
        // Check if condition is met
        try {
            if (achievement.condition(generalStats, layoutSpecificStats)) {
                newAchievements.push(achievement);
            }
        }
        catch (error) {
            console.warn("Error checking achievement ".concat(achievement.id, ":"), error);
        }
    }
    return newAchievements;
}
/**
 * Update progress milestones based on current stats
 */
function updateProgressMilestones(layoutSpecificStats) {
    return exports.progressMilestones.map(function (milestone) {
        var current = 0;
        if (milestone.layout && (layoutSpecificStats === null || layoutSpecificStats === void 0 ? void 0 : layoutSpecificStats[milestone.layout])) {
            var layoutStats = layoutSpecificStats[milestone.layout];
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
        return __assign(__assign({}, milestone), { current: Math.min(current, milestone.target) });
    });
}
/**
 * Generate insights and recommendations based on progress
 */
function generateProgressInsights(layoutSpecificStats) {
    var _a;
    var insights = [];
    var recommendations = [];
    var strongAreas = [];
    var improvementAreas = [];
    var specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
    for (var _i = 0, specializedLayouts_1 = specializedLayouts; _i < specializedLayouts_1.length; _i++) {
        var layout = specializedLayouts_1[_i];
        var stats = layoutSpecificStats === null || layoutSpecificStats === void 0 ? void 0 : layoutSpecificStats[layout];
        if (!stats || stats.totalCharacters < 10)
            continue;
        var layoutName = layout.replace('-', ' ').toUpperCase();
        // Speed analysis
        if (stats.bestWpmForLayout >= 40) {
            strongAreas.push("Excellent speed with ".concat(layoutName, " (").concat(stats.bestWpmForLayout, " WPM)"));
        }
        else if (stats.bestWpmForLayout < 20) {
            improvementAreas.push("Speed needs work with ".concat(layoutName));
            recommendations.push("Practice short bursts with ".concat(layoutName, " to build speed"));
        }
        // Accuracy analysis
        if (stats.bestAccuracyForLayout >= 95) {
            strongAreas.push("High accuracy with ".concat(layoutName, " (").concat(Math.round(stats.bestAccuracyForLayout), "%)"));
        }
        else if (stats.bestAccuracyForLayout < 85) {
            improvementAreas.push("Accuracy could improve with ".concat(layoutName));
            recommendations.push("Focus on precision over speed with ".concat(layoutName));
        }
        // Ergonomic analysis
        if (stats.avgErgonomicScore >= 8.5) {
            strongAreas.push("Excellent ergonomic form with ".concat(layoutName));
        }
        else if (stats.avgErgonomicScore < 7) {
            improvementAreas.push("Ergonomic form needs attention with ".concat(layoutName));
            recommendations.push("Review finger positioning for ".concat(layoutName));
        }
        // Adaptation analysis
        if (stats.adaptationProgress >= 80) {
            insights.push("You're well-adapted to ".concat(layoutName, " (").concat(Math.round(stats.adaptationProgress), "% adaptation)"));
        }
        else if (stats.adaptationProgress < 50) {
            insights.push("".concat(layoutName, " is still challenging - keep practicing!"));
        }
        // Practice time analysis
        if (stats.hoursOfPractice >= 5) {
            insights.push("Dedicated ".concat(layoutName, " practitioner (").concat(Math.round(stats.hoursOfPractice * 10) / 10, " hours)"));
        }
    }
    // Cross-layout insights
    var practicedLayouts = specializedLayouts.filter(function (layout) { var _a; return ((_a = layoutSpecificStats === null || layoutSpecificStats === void 0 ? void 0 : layoutSpecificStats[layout]) === null || _a === void 0 ? void 0 : _a.totalCharacters) >= 50; });
    if (practicedLayouts.length >= 2) {
        insights.push("You're exploring multiple specialized layouts - great for cognitive flexibility!");
    }
    // ARTSEY specific insights
    if (((_a = layoutSpecificStats === null || layoutSpecificStats === void 0 ? void 0 : layoutSpecificStats.artsey) === null || _a === void 0 ? void 0 : _a.totalChords) >= 100) {
        insights.push("ARTSEY chord mastery is developing - ".concat(layoutSpecificStats.artsey.totalChords, " chords completed"));
    }
    return {
        insights: insights,
        recommendations: recommendations,
        strongAreas: strongAreas,
        improvementAreas: improvementAreas
    };
}
/**
 * Calculate overall progress score across all specialized layouts
 */
function calculateOverallProgress(layoutSpecificStats) {
    var specializedLayouts = ['maltron', 'dvorak-one-hand', 'artsey'];
    var breakdown = {};
    var totalScore = 0;
    var layoutCount = 0;
    for (var _i = 0, specializedLayouts_2 = specializedLayouts; _i < specializedLayouts_2.length; _i++) {
        var layout = specializedLayouts_2[_i];
        var stats = layoutSpecificStats === null || layoutSpecificStats === void 0 ? void 0 : layoutSpecificStats[layout];
        if (!stats || stats.totalCharacters < 10)
            continue;
        layoutCount++;
        var factors = [];
        var layoutScore = 0;
        // Speed component (30%)
        var speedScore = Math.min(100, (stats.bestWpmForLayout / 50) * 100);
        layoutScore += speedScore * 0.3;
        factors.push("Speed: ".concat(Math.round(speedScore), "%"));
        // Accuracy component (25%)
        var accuracyScore = stats.bestAccuracyForLayout || 0;
        layoutScore += accuracyScore * 0.25;
        factors.push("Accuracy: ".concat(Math.round(accuracyScore), "%"));
        // Adaptation component (25%)
        var adaptationScore = stats.adaptationProgress || 0;
        layoutScore += adaptationScore * 0.25;
        factors.push("Adaptation: ".concat(Math.round(adaptationScore), "%"));
        // Experience component (20%)
        var experienceScore = Math.min(100, (stats.hoursOfPractice / 10) * 100);
        layoutScore += experienceScore * 0.2;
        factors.push("Experience: ".concat(Math.round(experienceScore), "%"));
        breakdown[layout] = {
            score: Math.round(layoutScore),
            factors: factors
        };
        totalScore += layoutScore;
    }
    var averageScore = layoutCount > 0 ? totalScore / layoutCount : 0;
    var level;
    if (averageScore >= 85)
        level = 'Master';
    else if (averageScore >= 70)
        level = 'Expert';
    else if (averageScore >= 55)
        level = 'Advanced';
    else if (averageScore >= 35)
        level = 'Intermediate';
    else
        level = 'Beginner';
    return {
        score: Math.round(averageScore),
        level: level,
        breakdown: breakdown
    };
}
