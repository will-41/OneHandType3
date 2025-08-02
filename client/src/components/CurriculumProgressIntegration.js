"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var card_1 = require("./ui/card");
var button_1 = require("./ui/button");
var badge_1 = require("./ui/badge");
var progress_1 = require("./ui/progress");
var tabs_1 = require("./ui/tabs");
var dialog_1 = require("./ui/dialog");
var utils_1 = require("../lib/utils");
var useTypingStore_1 = require("../lib/stores/useTypingStore");
var lessons_1 = require("../lib/lessons");
var lucide_react_1 = require("lucide-react");
var GameOfThronesLessonNavigator = function (_a) {
    var onStartLesson = _a.onStartLesson, className = _a.className;
    var _b = (0, useTypingStore_1.useTypingStore)(), stats = _b.stats, completedLessons = _b.completedLessons;
    // Group real lessons by category for Game of Thrones theming
    var lessonsByCategory = lessons_1.lessons.reduce(function (acc, lesson) {
        if (!acc[lesson.category]) {
            acc[lesson.category] = [];
        }
        acc[lesson.category].push(lesson);
        return acc;
    }, {});
    // Game of Thrones themed kingdoms mapping to real lesson categories
    var kingdoms = [
        {
            id: 'winterfell',
            name: 'The North - Winterfell',
            description: 'Master the basics with House Stark',
            house: 'Stark',
            lessons: lessonsByCategory.basics || [],
            color: 'from-blue-600 to-slate-700'
        },
        {
            id: 'kings-landing',
            name: 'Kings Landing',
            description: 'Learn common words with the Crown',
            house: 'Baratheon/Lannister',
            lessons: lessonsByCategory.words || [],
            color: 'from-yellow-600 to-red-600'
        },
        {
            id: 'dragonstone',
            name: 'Dragonstone',
            description: 'Practice sentences with House Targaryen',
            house: 'Targaryen',
            lessons: lessonsByCategory.sentences || [],
            color: 'from-red-600 to-black'
        },
        {
            id: 'high-garden',
            name: 'The Reach - Highgarden',
            description: 'Master advanced techniques with House Tyrell',
            house: 'Tyrell',
            lessons: lessonsByCategory.advanced || [],
            color: 'from-green-600 to-yellow-500'
        }
    ];
    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-2xl font-bold mb-2 flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "w-8 w-8 text-yellow-500" }), "Game of Thrones Typing Academy"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Master the art of one-handed typing through the Seven Kingdoms" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: kingdoms.map(function (kingdom, index) { return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "overflow-hidden border-2 hover:shadow-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-2 bg-gradient-to-r ".concat(kingdom.color) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-bold", children: kingdom.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-muted-foreground", children: ["House ", kingdom.house] })] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "font-bold", children: [kingdom.lessons.length, " Lessons"] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: kingdom.description }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground mb-2", children: "Available Lessons:" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-2 max-h-48 overflow-y-auto", children: [kingdom.lessons.slice(0, 6).map(function (lesson) {
                                                        var isCompleted = completedLessons.includes(lesson.id);
                                                        return ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: isCompleted ? "default" : "outline", size: "sm", className: "w-full justify-between text-left h-auto py-2", onClick: function () {
                                                                console.log('Game of Thrones lesson selected:', lesson);
                                                                onStartLesson === null || onStartLesson === void 0 ? void 0 : onStartLesson(lesson);
                                                            }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [isCompleted ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-3 h-3" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-xs", children: lesson.title }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-muted-foreground", children: ["Level ", lesson.level, " \u2022 ", lesson.targetWpm, " WPM"] })] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-3 h-3" })] }, lesson.id));
                                                    }), kingdom.lessons.length > 6 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-center text-muted-foreground py-2", children: ["+", kingdom.lessons.length - 6, " more lessons..."] }))] })] })] })] }, kingdom.id)); }) })] }) }));
};
var AdaptiveLearningEngine = function (_a) {
    var className = _a.className;
    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "w-5 h-5 text-purple-600" }), "AI Learning Coach"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Personalized recommendations based on your performance will appear here." })] }) }));
};
var CurriculumRewardSystem = function (_a) {
    var className = _a.className;
    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trophy, { className: "w-5 h-5 text-yellow-500" }), "Reward System"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Complete lessons to earn rewards and unlock achievements!" })] }) }));
};
var EnhancedPremiumThemeSystem = function (_a) {
    var className = _a.className;
    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "w-5 h-5 text-blue-600" }), "Premium Themes"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Unlock beautiful themes as you progress through the kingdoms!" })] }) }));
};
// Define unlockable items based on Game of Thrones progression
var unlockableItems = [
    // Themes from Level Rewards
    {
        id: 'winters-edge',
        name: "Winter's Edge",
        type: 'theme',
        cost: 500,
        requiresLevel: 1,
        description: 'The cold, stark beauty of the North',
        rarity: 'common',
        gotTheme: {
            house: 'House Stark',
            character: 'Eddard Stark',
            reference: 'Honor and duty in the frozen North'
        }
    },
    {
        id: 'riverrun-blue',
        name: 'Riverrun Blue',
        type: 'theme',
        cost: 750,
        requiresLevel: 2,
        description: 'Flowing rivers and endless streams',
        rarity: 'common',
        gotTheme: {
            house: 'House Tully',
            character: 'Catelyn Stark',
            reference: 'Family, Duty, Honor'
        }
    },
    {
        id: 'highgarden-gold',
        name: 'Highgarden Gold',
        type: 'theme',
        cost: 1000,
        requiresLevel: 3,
        requiresAccuracy: 94,
        description: 'Golden roses and bountiful harvests',
        rarity: 'rare',
        gotTheme: {
            house: 'House Tyrell',
            character: 'Margaery Tyrell',
            reference: 'Growing Strong with grace and beauty'
        }
    },
    {
        id: 'lannister-crimson',
        name: 'Lannister Crimson',
        type: 'theme',
        cost: 1500,
        requiresLevel: 4,
        requiresWPM: 30,
        description: 'The wealth and power of Casterly Rock',
        rarity: 'rare',
        gotTheme: {
            house: 'House Lannister',
            character: 'Tyrion Lannister',
            reference: 'A Lannister always pays his debts'
        }
    },
    {
        id: 'stormy-skies',
        name: 'Stormy Skies',
        type: 'theme',
        cost: 2000,
        requiresLevel: 5,
        requiresWPM: 35,
        description: 'The fury and power of Storm\'s End',
        rarity: 'epic',
        gotTheme: {
            house: 'House Baratheon',
            character: 'Robert Baratheon',
            reference: 'Ours is the Fury'
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
        gotTheme: {
            house: 'House Arryn',
            character: 'Jon Arryn',
            reference: 'As High as Honor'
        }
    },
    {
        id: 'desert-sunset',
        name: 'Desert Sunset',
        type: 'theme',
        cost: 3000,
        requiresLevel: 7,
        requiresWPM: 45,
        description: 'The patient endurance of Dorne',
        rarity: 'epic',
        gotTheme: {
            house: 'House Martell',
            character: 'Doran Martell',
            reference: 'Unbowed, Unbent, Unbroken'
        }
    },
    {
        id: 'iron-islands-storm',
        name: 'Iron Islands Storm',
        type: 'theme',
        cost: 4000,
        requiresLevel: 8,
        requiresWPM: 50,
        description: 'The harsh steel of the Iron Islands',
        rarity: 'legendary',
        gotTheme: {
            house: 'House Greyjoy',
            character: 'Theon Greyjoy',
            reference: 'What is Dead May Never Die'
        }
    },
    {
        id: 'black-ice',
        name: 'Black Ice',
        type: 'theme',
        cost: 5000,
        requiresLevel: 9,
        requiresWPM: 60,
        requiresAccuracy: 99,
        description: 'The eternal watch of the Night\'s Watch',
        rarity: 'legendary',
        gotTheme: {
            house: 'Night\'s Watch',
            character: 'Jon Snow',
            reference: 'Night gathers, and now my watch begins'
        }
    },
    {
        id: 'royal-throne',
        name: 'Royal Throne',
        type: 'theme',
        cost: 10000,
        requiresLevel: 10,
        requiresWPM: 80,
        requiresAccuracy: 99.5,
        description: 'The ultimate seat of typing power',
        rarity: 'legendary',
        gotTheme: {
            house: 'Iron Throne',
            character: 'The Player',
            reference: 'You are the rightful ruler of all keyboards'
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
        id: 'dragon-fire-effects',
        name: 'Dragon Fire Effects',
        type: 'feature',
        cost: 2500,
        requiresLevel: 8,
        requiresAchievement: 'dragon-speed',
        description: 'Fiery visual effects for high-speed typing',
        rarity: 'epic'
    },
    {
        id: 'wolf-pack-mode',
        name: 'Wolf Pack Mode',
        type: 'feature',
        cost: 1500,
        requiresLevel: 6,
        requiresAchievement: 'stark-loyalty',
        description: 'Multiplayer collaborative typing mode',
        rarity: 'rare'
    }
];
var calculateUserPoints = function (stats, completedLessons) {
    // Base XP calculation from lessons and performance
    var lessonXP = completedLessons.length * 150; // Average XP per lesson
    var performanceXP = (stats.bestWpm || 0) * 10 + (stats.bestAccuracy || 0) * 5;
    var totalXP = lessonXP + performanceXP;
    // Level calculation (every 1000 XP = 1 level)
    var currentLevel = Math.floor(totalXP / 1000) + 1;
    var levelProgress = ((totalXP % 1000) / 1000) * 100;
    var nextLevelXP = (currentLevel * 1000) - totalXP;
    // Coin calculation (roughly 1 coin per 2 XP, plus bonuses)
    var baseCoins = Math.floor(totalXP / 2);
    var bonusCoins = completedLessons.length * 25; // Bonus coins for completion
    var coinsEarned = baseCoins + bonusCoins;
    return {
        totalXP: totalXP,
        currentLevel: currentLevel,
        coinsEarned: coinsEarned,
        coinsSpent: 0, // Would track from purchases
        availableCoins: coinsEarned, // Minus spent coins
        levelProgress: levelProgress,
        nextLevelXP: nextLevelXP,
        achievements: [], // Would come from achievement system
        unlockedThemes: [],
        unlockedLayouts: [],
        specialUnlocks: []
    };
};
var UnlockStore = function (_a) {
    var userPoints = _a.userPoints, onPurchase = _a.onPurchase, className = _a.className;
    var _b = (0, react_1.useState)('all'), filter = _b[0], setFilter = _b[1];
    var _c = (0, react_1.useState)('cost'), sortBy = _c[0], setSortBy = _c[1];
    var filteredItems = (0, react_1.useMemo)(function () {
        var items = unlockableItems;
        // Filter by type
        if (filter !== 'all') {
            var typeMap_1 = { themes: 'theme', layouts: 'layout', features: 'feature' };
            items = items.filter(function (item) { return item.type === typeMap_1[filter]; });
        }
        // Sort items
        items = __spreadArray([], items, true).sort(function (a, b) {
            switch (sortBy) {
                case 'cost':
                    return a.cost - b.cost;
                case 'level':
                    return (a.requiresLevel || 0) - (b.requiresLevel || 0);
                case 'rarity':
                    var rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
                    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
                default:
                    return 0;
            }
        });
        return items;
    }, [filter, sortBy]);
    var canAfford = function (item) { return userPoints.availableCoins >= item.cost; };
    var meetsRequirements = function (item, stats) {
        if (item.requiresLevel && userPoints.currentLevel < item.requiresLevel)
            return false;
        if (item.requiresWPM && (stats.bestWpm || 0) < item.requiresWPM)
            return false;
        if (item.requiresAccuracy && (stats.bestAccuracy || 0) < item.requiresAccuracy)
            return false;
        if (item.requiresAchievement && !userPoints.achievements.includes(item.requiresAchievement))
            return false;
        return true;
    };
    var rarityColors = {
        common: 'border-gray-300 bg-gray-50',
        rare: 'border-blue-300 bg-blue-50',
        epic: 'border-purple-300 bg-purple-50',
        legendary: 'border-orange-300 bg-orange-50'
    };
    var typeIcons = {
        theme: lucide_react_1.Palette,
        layout: lucide_react_1.Keyboard,
        feature: lucide_react_1.Sparkles
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("space-y-4", className), children: [(0, jsx_runtime_1.jsx)(card_1.Card, { className: "p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Gift, { className: "w-6 h-6" }), "Typing Mastery Store"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-yellow-100", children: "Unlock themes, layouts, and features with your earned coins" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: userPoints.availableCoins }), (0, jsx_runtime_1.jsxs)("div", { className: "text-yellow-100 text-sm flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Coins, { className: "w-4 h-4" }), "Available Coins"] })] })] }) }), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-4 items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: ['all', 'themes', 'layouts', 'features'].map(function (filterType) { return ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: filter === filterType ? "default" : "outline", onClick: function () { return setFilter(filterType); }, children: filterType.charAt(0).toUpperCase() + filterType.slice(1) }, filterType)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-muted-foreground", children: "Sort by:" }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: function (e) { return setSortBy(e.target.value); }, className: "text-sm border rounded px-2 py-1", children: [(0, jsx_runtime_1.jsx)("option", { value: "cost", children: "Cost" }), (0, jsx_runtime_1.jsx)("option", { value: "level", children: "Level Required" }), (0, jsx_runtime_1.jsx)("option", { value: "rarity", children: "Rarity" })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredItems.map(function (item) {
                    var IconComponent = typeIcons[item.type];
                    var affordable = canAfford(item);
                    var meetsReqs = meetsRequirements(item, { bestWpm: 0, bestAccuracy: 0 }); // Would use real stats
                    var canPurchase = affordable && meetsReqs;
                    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: (0, utils_1.cn)("p-4 transition-all duration-300", rarityColors[item.rarity], canPurchase ? "hover:shadow-lg cursor-pointer" : "opacity-75"), children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(IconComponent, { className: "w-5 h-5 text-blue-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-sm", children: item.name }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs mt-1", children: item.rarity })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-yellow-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Coins, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold", children: item.cost })] }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: item.description }), item.gotTheme && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-slate-800 to-slate-700 text-white p-3 rounded", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-slate-300 mb-1", children: item.gotTheme.house }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-1", children: item.gotTheme.character }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-slate-300 italic", children: ["\"", item.gotTheme.reference, "\""] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-xs", children: [item.requiresLevel && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trophy, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Level ", item.requiresLevel, " required"] }), userPoints.currentLevel >= item.requiresLevel ?
                                                    (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3 text-green-500" }) :
                                                    (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3 h-3 text-red-500" })] })), item.requiresWPM && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [item.requiresWPM, " WPM required"] })] })), item.requiresAccuracy && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [item.requiresAccuracy, "% accuracy required"] })] }))] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", className: "w-full", disabled: !canPurchase, onClick: function () { return canPurchase && onPurchase(item); }, children: !affordable ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3 h-3 mr-1" }), "Insufficient Coins"] })) : !meetsReqs ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-3 h-3 mr-1" }), "Requirements Not Met"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Gift, { className: "w-3 h-3 mr-1" }), "Purchase"] })) })] }) }, item.id));
                }) })] }));
};
var ProgressDashboard = function (_a) {
    var userPoints = _a.userPoints, curriculumProgress = _a.curriculumProgress, className = _a.className;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("space-y-6", className), children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "w-6 h-6 text-yellow-400" }), "Level ", userPoints.currentLevel] }), (0, jsx_runtime_1.jsx)("p", { className: "text-blue-100", children: "Continue your journey through the Seven Kingdoms" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold", children: userPoints.totalXP }), (0, jsx_runtime_1.jsx)("div", { className: "text-blue-200 text-sm", children: "Total XP" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Progress to Level ", userPoints.currentLevel + 1] }), (0, jsx_runtime_1.jsxs)("span", { children: [Math.round(userPoints.levelProgress), "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: userPoints.levelProgress, className: "h-3 bg-blue-700" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-blue-200", children: [userPoints.nextLevelXP, " XP until next level"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-5 h-5 text-purple-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold", children: "Kingdom Conquest Progress" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: curriculumProgress.lessonsCompleted }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "Lessons Completed" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: curriculumProgress.currentLevel }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "Current Kingdom" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-purple-600", children: [Math.round((curriculumProgress.lessonsCompleted / curriculumProgress.totalLessons) * 100), "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "Overall Progress" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-orange-600", children: userPoints.unlockedThemes.length + userPoints.unlockedLayouts.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "Items Unlocked" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: curriculumProgress.nextMilestone }), (0, jsx_runtime_1.jsx)("span", { children: curriculumProgress.estimatedCompletion })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: (curriculumProgress.lessonsCompleted / curriculumProgress.totalLessons) * 100, className: "h-3" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Coins, { className: "w-5 h-5" }), "Coin Treasury"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-yellow-100 text-sm", children: "Earned through skill and dedication" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold", children: userPoints.availableCoins }), (0, jsx_runtime_1.jsx)("div", { className: "text-yellow-200 text-sm", children: "Available" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-yellow-400", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold", children: userPoints.coinsEarned }), (0, jsx_runtime_1.jsx)("div", { className: "text-yellow-200 text-xs", children: "Total Earned" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold", children: userPoints.coinsSpent }), (0, jsx_runtime_1.jsx)("div", { className: "text-yellow-200 text-xs", children: "Total Spent" })] })] })] })] }));
};
var CurriculumProgressIntegration = function (_a) {
    var className = _a.className, onStartLesson = _a.onStartLesson;
    var _b = (0, useTypingStore_1.useTypingStore)(), stats = _b.stats, completedLessons = _b.completedLessons, setKeyboardLayout = _b.setKeyboardLayout, setColorTheme = _b.setColorTheme;
    // Calculate user progress and points
    var curriculumProgress = (0, react_1.useMemo)(function () { return ({
        lessonsCompleted: completedLessons.length,
        totalLessons: lessons_1.lessons.length,
        currentLevel: Math.floor(completedLessons.length / 5) + 1,
        progressPercentage: (completedLessons.length / lessons_1.lessons.length) * 100,
        nextMilestone: "Kingdom ".concat(Math.floor(completedLessons.length / 5) + 2),
        estimatedCompletion: "".concat(Math.max(0, lessons_1.lessons.length - completedLessons.length), " lessons remaining")
    }); }, [completedLessons]);
    var userPoints = (0, react_1.useMemo)(function () { return ({
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
    }); }, [stats, completedLessons]);
    // State
    var _c = (0, react_1.useState)({ isOpen: false, item: null }), purchaseDialog = _c[0], setPurchaseDialog = _c[1];
    // Handle purchases
    var handlePurchase = function (item) {
        setPurchaseDialog({ isOpen: true, item: item });
    };
    var confirmPurchase = function () {
        var item = purchaseDialog.item;
        if (!item)
            return;
        // Apply the unlock based on item type
        switch (item.type) {
            case 'theme':
                // Find theme index and apply it
                console.log("Unlocking theme: ".concat(item.name));
                // This would integrate with the theme system
                break;
            case 'layout':
                // Apply keyboard layout
                console.log("Unlocking layout: ".concat(item.name));
                if (item.id === 'dvorak-one-hand') {
                    setKeyboardLayout('dvorak');
                }
                else if (item.id === 'maltron-layout') {
                    setKeyboardLayout('maltron');
                }
                else if (item.id === 'artsey-chorded') {
                    setKeyboardLayout('artsey');
                }
                break;
            case 'feature':
                console.log("Unlocking feature: ".concat(item.name));
                break;
        }
        setPurchaseDialog({ isOpen: false, item: null });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("space-y-8", className), children: [(0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "curriculum", className: "w-full", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-5", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "curriculum", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-4 h-4 mr-1" }), "Lessons"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "progress", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-4 h-4 mr-1" }), "Progress"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "store", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Gift, { className: "w-4 h-4 mr-1" }), "Store"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "adaptive", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "w-4 h-4 mr-1" }), "AI Coach"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "themes", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "w-4 h-4 mr-1" }), "Themes"] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "curriculum", className: "space-y-6", children: (0, jsx_runtime_1.jsx)(GameOfThronesLessonNavigator, { onStartLesson: onStartLesson }) }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "progress", className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(ProgressDashboard, { userPoints: userPoints, curriculumProgress: curriculumProgress }), (0, jsx_runtime_1.jsx)(CurriculumRewardSystem, {})] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "store", className: "space-y-6", children: (0, jsx_runtime_1.jsx)(UnlockStore, { userPoints: userPoints, onPurchase: handlePurchase }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "adaptive", className: "space-y-6", children: (0, jsx_runtime_1.jsx)(AdaptiveLearningEngine, {}) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "themes", className: "space-y-6", children: (0, jsx_runtime_1.jsx)(EnhancedPremiumThemeSystem, {}) })] }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: purchaseDialog.isOpen, onOpenChange: function (open) {
                    return setPurchaseDialog({ isOpen: open, item: purchaseDialog.item });
                }, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "sm:max-w-md", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Gift, { className: "w-5 h-5 text-yellow-600" }), "Confirm Purchase"] }) }), purchaseDialog.item && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(card_1.Card, { className: "p-4 bg-gradient-to-r from-yellow-50 to-orange-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-lg", children: purchaseDialog.item.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: purchaseDialog.item.description }), purchaseDialog.item.gotTheme && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-slate-800 to-slate-700 text-white p-3 rounded", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-slate-300", children: purchaseDialog.item.gotTheme.house }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium", children: purchaseDialog.item.gotTheme.character }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-slate-300 italic", children: ["\"", purchaseDialog.item.gotTheme.reference, "\""] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-1 text-yellow-600 text-xl font-bold", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Coins, { className: "w-5 h-5" }), purchaseDialog.item.cost] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return setPurchaseDialog({ isOpen: false, item: null }); }, className: "flex-1", children: "Cancel" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: confirmPurchase, className: "flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 mr-2" }), "Purchase"] })] })] }))] }) })] }));
};
exports.default = CurriculumProgressIntegration;
