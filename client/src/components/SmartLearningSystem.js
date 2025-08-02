"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var card_1 = require("./ui/card");
var button_1 = require("./ui/button");
var badge_1 = require("./ui/badge");
var progress_1 = require("./ui/progress");
var utils_1 = require("../lib/utils");
var useTypingStore_1 = require("../lib/stores/useTypingStore");
var lucide_react_1 = require("lucide-react");
var analyzeWeakAreas = function (typingData) {
    // Mock analysis - in real app would use actual typing data
    return [
        {
            key: 'p',
            character: 'P',
            errorRate: 0.15,
            practiceNeeded: 8,
            improvement: 'Focus on pinky finger positioning'
        },
        {
            key: 'q',
            character: 'Q',
            errorRate: 0.12,
            practiceNeeded: 6,
            improvement: 'Practice Q-U combinations'
        },
        {
            key: ';',
            character: ';',
            errorRate: 0.18,
            practiceNeeded: 10,
            improvement: 'Work on reach accuracy for punctuation'
        }
    ];
};
// Generate personalized recommendations
var generateRecommendations = function (weakAreas, userStats) {
    var recommendations = [];
    // Add weakness-specific recommendations
    weakAreas.forEach(function (area, index) {
        recommendations.push({
            id: "weak_".concat(area.key),
            type: 'exercise',
            title: "".concat(area.character, " Key Practice"),
            description: "Targeted practice for improving ".concat(area.character, " key accuracy"),
            difficulty: Math.ceil(area.errorRate * 10),
            estimatedTime: area.practiceNeeded,
            priority: area.errorRate > 0.15 ? 'high' : 'medium',
            reason: area.improvement
        });
    });
    // Add general recommendations based on stats
    if (userStats.bestWpm < 40) {
        recommendations.push({
            id: 'speed_building',
            type: 'lesson',
            title: 'Speed Building Fundamentals',
            description: 'Focus on consistent rhythm and muscle memory',
            difficulty: 3,
            estimatedTime: 15,
            priority: 'high',
            reason: 'Current speed is below target range'
        });
    }
    if (userStats.bestAccuracy < 95) {
        recommendations.push({
            id: 'accuracy_focus',
            type: 'lesson',
            title: 'Precision Training',
            description: 'Slow, accurate typing to build muscle memory',
            difficulty: 2,
            estimatedTime: 20,
            priority: 'high',
            reason: 'Accuracy needs improvement for speed gains'
        });
    }
    return recommendations.slice(0, 6); // Limit to top 6
};
// Learning insights generator
var generateInsights = function (userData) {
    return [
        {
            category: 'Speed Pattern',
            insight: 'Your typing speed increases 15% in afternoon sessions',
            actionable: 'Schedule important typing tasks between 2-4 PM',
            impact: 'medium'
        },
        {
            category: 'Accuracy Trend',
            insight: 'Errors increase after 20 minutes of continuous typing',
            actionable: 'Take 2-minute breaks every 15 minutes',
            impact: 'high'
        },
        {
            category: 'Finger Usage',
            insight: 'Right pinky is underutilized, causing reach errors',
            actionable: 'Practice punctuation and Enter key exercises',
            impact: 'high'
        },
        {
            category: 'Learning Velocity',
            insight: 'Your improvement rate is 3 WPM per week',
            actionable: 'Consistent daily practice will reach 60 WPM in 4 weeks',
            impact: 'medium'
        }
    ];
};
// Adaptive difficulty component
var AdaptiveDifficultyIndicator = function (_a) {
    var currentLevel = _a.currentLevel, recommendedLevel = _a.recommendedLevel, theme = _a.theme;
    var difference = recommendedLevel - currentLevel;
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-4 ".concat(theme === 'dark' ? 'bg-slate-800' : 'bg-white'), children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "w-5 h-5 text-purple-500" }), "Adaptive Difficulty"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Current Level" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: currentLevel })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Recommended Level" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: (0, utils_1.cn)(difference > 0 ? 'bg-green-500' :
                                    difference < 0 ? 'bg-orange-500' : 'bg-blue-500'), children: recommendedLevel })] }), (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("text-sm p-2 rounded-lg", difference > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            difference < 0 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'), children: [difference > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-4 h-4" }), "Ready for more challenge"] })), difference < 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }), "Focus on fundamentals"] })), difference === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" }), "Perfect difficulty match"] }))] })] })] }));
};
// Weak areas visualization
var WeakAreasHeatmap = function (_a) {
    var weakAreas = _a.weakAreas, theme = _a.theme;
    var keyboardRows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ];
    var getKeyColor = function (key) {
        var weakArea = weakAreas.find(function (area) { return area.key === key; });
        if (!weakArea)
            return theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200';
        var intensity = weakArea.errorRate;
        if (intensity > 0.15)
            return 'bg-red-500';
        if (intensity > 0.10)
            return 'bg-orange-500';
        if (intensity > 0.05)
            return 'bg-yellow-500';
        return 'bg-green-500';
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-4 ".concat(theme === 'dark' ? 'bg-slate-800' : 'bg-white'), children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Keyboard, { className: "w-5 h-5 text-blue-500" }), "Error Heatmap"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 mb-4", children: keyboardRows.map(function (row, rowIndex) { return ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-1 justify-center", children: row.map(function (key) { return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white", getKeyColor(key)), title: "Key: ".concat(key.toUpperCase()), children: key.toUpperCase() }, key)); }) }, rowIndex)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-green-500 rounded" }), (0, jsx_runtime_1.jsx)("span", { children: "Good" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-yellow-500 rounded" }), (0, jsx_runtime_1.jsx)("span", { children: "Practice" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-red-500 rounded" }), (0, jsx_runtime_1.jsx)("span", { children: "Focus" })] })] })] }));
};
// Main smart learning component
var SmartLearningSystem = function (_a) {
    var className = _a.className;
    var _b = (0, useTypingStore_1.useTypingStore)(), themeMode = _b.themeMode, stats = _b.stats;
    var _c = (0, react_1.useState)([]), weakAreas = _c[0], setWeakAreas = _c[1];
    var _d = (0, react_1.useState)([]), recommendations = _d[0], setRecommendations = _d[1];
    var _e = (0, react_1.useState)([]), insights = _e[0], setInsights = _e[1];
    var _f = (0, react_1.useState)('overview'), selectedTab = _f[0], setSelectedTab = _f[1];
    // Initialize learning data
    (0, react_1.useEffect)(function () {
        var mockTypingData = {
            bestWpm: stats.bestWpm || 0,
            bestAccuracy: stats.bestAccuracy || 0,
            keyErrors: {},
            sessionCount: 0
        };
        var areas = analyzeWeakAreas(mockTypingData);
        var recs = generateRecommendations(areas, mockTypingData);
        var learningInsights = generateInsights(mockTypingData);
        setWeakAreas(areas);
        setRecommendations(recs);
        setInsights(learningInsights);
    }, [stats]);
    var getPriorityColor = function (priority) {
        switch (priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };
    var getImpactColor = function (impact) {
        switch (impact) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("space-y-6", className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "w-8 h-8 text-purple-500" }), "AI Learning Assistant"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm ".concat(themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'), children: "Personalized recommendations based on your typing patterns" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm ".concat(themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'), children: ["Last analysis: ", new Date().toLocaleDateString()] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: [
                    { id: 'overview', label: 'Overview', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }) },
                    { id: 'recommendations', label: 'Recommendations', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Lightbulb, { className: "w-4 h-4" }) },
                    { id: 'analysis', label: 'Weakness Analysis', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-4 h-4" }) },
                    { id: 'insights', label: 'Learning Insights', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-4 h-4" }) }
                ].map(function (tab) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setSelectedTab(tab.id); }, className: (0, utils_1.cn)("flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200", selectedTab === tab.id
                        ? "bg-purple-500 text-white shadow-lg"
                        : themeMode === 'dark'
                            ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"), children: [tab.icon, tab.label] }, tab.id)); }) }), selectedTab === 'overview' && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(AdaptiveDifficultyIndicator, { currentLevel: 3, recommendedLevel: 4, theme: themeMode }), (0, jsx_runtime_1.jsx)(WeakAreasHeatmap, { weakAreas: weakAreas, theme: themeMode }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-4 ".concat(themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'), children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold mb-3", children: "Learning Progress" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm mb-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "Speed Improvement" }), (0, jsx_runtime_1.jsx)("span", { children: "+8 WPM this week" })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: 75, className: "h-2" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm mb-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "Accuracy Goal" }), (0, jsx_runtime_1.jsx)("span", { children: "94/98%" })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: 96, className: "h-2" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm mb-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "Consistency" }), (0, jsx_runtime_1.jsx)("span", { children: "Excellent" })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: 88, className: "h-2" })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-4 ".concat(themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'), children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-5 w-5 text-green-500" }), "Next Steps"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: recommendations.slice(0, 3).map(function (rec, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10", children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("w-2 h-2 rounded-full", getPriorityColor(rec.priority)) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-sm", children: rec.title }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs opacity-75", children: [rec.estimatedTime, " min"] })] })] }, rec.id)); }) })] })] })), selectedTab === 'recommendations' && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: recommendations.map(function (rec) { return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-4 ".concat(themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [rec.type === 'lesson' && (0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-5 h-5 text-blue-500" }), rec.type === 'exercise' && (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "w-5 h-5 text-green-500" }), rec.type === 'technique' && (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-5 h-5 text-purple-500" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-bold", children: rec.title })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: (0, utils_1.cn)("text-white", getPriorityColor(rec.priority)), children: rec.priority })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mb-3 opacity-75", children: rec.description }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between text-xs mb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["\u2B50 Level ", rec.difficulty] }), (0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3 inline mr-1" }), rec.estimatedTime, "min"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mb-3", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Why:" }), " ", rec.reason] }), (0, jsx_runtime_1.jsx)(button_1.Button, { className: "w-full", size: "sm", children: "Start Practice" })] }, rec.id)); }) })), selectedTab === 'analysis' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(WeakAreasHeatmap, { weakAreas: weakAreas, theme: themeMode }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-4 ".concat(themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'), children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold mb-4", children: "Detailed Weakness Analysis" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: weakAreas.map(function (area) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-500", children: area.character }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-semibold", children: ["Error Rate: ", (area.errorRate * 100).toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm opacity-75", children: area.improvement })] })] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: [area.practiceNeeded, " min needed"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: (1 - area.errorRate) * 100, className: "h-2" })] }, area.key)); }) })] })] })), selectedTab === 'insights' && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: insights.map(function (insight, index) { return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-4 ".concat(themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-bold flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-4 h-4 text-blue-500" }), insight.category] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: (0, utils_1.cn)("text-xs", getImpactColor(insight.impact)), children: [insight.impact, " impact"] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mb-3", children: insight.insight }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-green-50 dark:bg-green-900/30 p-3 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-sm text-green-700 dark:text-green-300 mb-1", children: "Action:" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-green-600 dark:text-green-400", children: insight.actionable })] })] }, index)); }) }))] }));
};
exports.default = SmartLearningSystem;
