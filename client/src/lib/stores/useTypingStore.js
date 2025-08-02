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
exports.useTypingStore = exports.defaultColorThemes = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
var specializedAchievements_1 = require("../specializedAchievements");
exports.defaultColorThemes = [
    {
        name: "System Theme",
        keyOutline: "hsl(var(--primary))",
        keyOutlineHover: "hsl(var(--primary) / 0.8)",
        keyOutlineActive: "hsl(var(--primary) / 0.6)",
        fingerColors: {
            pinky: "hsl(var(--chart-1))",
            ring: "hsl(var(--chart-2))",
            middle: "hsl(var(--chart-3))",
            index: "hsl(var(--chart-4))",
            thumb: "hsl(var(--chart-5))"
        }
    },
    {
        name: "Forest Zen",
        keyOutline: "hsl(120 61% 50%)",
        keyOutlineHover: "hsl(120 61% 40%)",
        keyOutlineActive: "hsl(120 61% 30%)",
        fingerColors: {
            pinky: "hsl(14 100% 57%)",
            ring: "hsl(25 65% 45%)",
            middle: "hsl(200 18% 46%)",
            index: "hsl(207 90% 54%)",
            thumb: "hsl(36 100% 50%)"
        }
    },
    {
        name: "Ocean Breeze",
        keyOutline: "hsl(262 83% 58%)",
        keyOutlineHover: "hsl(262 83% 48%)",
        keyOutlineActive: "hsl(262 83% 38%)",
        fingerColors: {
            pinky: "hsl(4 90% 58%)",
            ring: "hsl(340 82% 52%)",
            middle: "hsl(262 52% 47%)",
            index: "hsl(231 48% 48%)",
            thumb: "hsl(188 100% 42%)"
        }
    },
    {
        name: "Sunset Glow",
        keyOutline: "hsl(36 100% 50%)",
        keyOutlineHover: "hsl(36 100% 40%)",
        keyOutlineActive: "hsl(36 100% 30%)",
        fingerColors: {
            pinky: "hsl(262 83% 58%)",
            ring: "hsl(262 52% 47%)",
            middle: "hsl(231 48% 48%)",
            index: "hsl(174 100% 29%)",
            thumb: "hsl(14 100% 57%)"
        }
    },
    {
        name: "High Contrast",
        keyOutline: "hsl(var(--foreground))",
        keyOutlineHover: "hsl(var(--foreground) / 0.8)",
        keyOutlineActive: "hsl(var(--foreground) / 0.6)",
        fingerColors: {
            pinky: "hsl(var(--destructive))",
            ring: "hsl(var(--accent))",
            middle: "hsl(var(--primary))",
            index: "hsl(var(--success))",
            thumb: "hsl(var(--secondary))"
        }
    }
];
var defaultStats = {
    totalCharactersTyped: 0,
    totalErrors: 0,
    totalTimeTyped: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    lessons: {},
    commonErrors: {},
    layoutSpecificStats: {},
};
var defaultAccessibilitySettings = {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    soundEnabled: true,
    fontSize: 16,
    lineHeight: 1.5,
    colorScheme: "default",
    focusIndicator: "enhanced",
    cursorSize: "normal",
    audioFeedback: true,
    hapticFeedback: false,
    // Additional settings with defaults
    backgroundMusicEnabled: true,
    keyClickSoundEnabled: true,
    errorSoundEnabled: true,
    completionSoundEnabled: true,
    soundVolume: 70,
    showVirtualKeyboard: true,
    showFingerGuide: true,
    highlightNextKey: true,
    errorHighlighting: true,
    autoCorrect: false,
    showWPM: true,
    showAccuracy: true,
    showTimer: true,
    colorBlindMode: false,
    focusMode: false,
    customTheme: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        accentColor: '#2563eb',
        errorColor: '#dc2626'
    }
};
exports.useTypingStore = (0, zustand_1.create)()((0, middleware_1.subscribeWithSelector)(function (set, get) { return ({
    // Initial state
    gameState: "ready",
    handPreference: "right",
    showTutorial: false,
    viewMode: "portrait",
    themeMode: "light",
    keyboardLayout: "qwerty",
    selectedColorTheme: 0,
    // Missing properties
    currentWpm: 0,
    currentStreak: 0,
    timeElapsed: 0,
    currentLesson: null,
    targetText: "",
    currentInput: "",
    currentPosition: 0,
    errors: [],
    wpm: 0,
    accuracy: 100,
    startTime: null,
    timeRemaining: null,
    expectedChar: null,
    highlightKey: null,
    stats: defaultStats,
    personalStats: defaultStats,
    unlockedAchievements: [],
    specializedAchievements: [],
    progressMilestones: [],
    progressInsights: {
        insights: [],
        recommendations: [],
        strongAreas: [],
        improvementAreas: []
    },
    overallProgress: {
        score: 0,
        level: 'Beginner',
        breakdown: {}
    },
    completedLessons: [],
    lessonProgress: {},
    currentProgress: null,
    customLessons: [],
    accessibilitySettings: defaultAccessibilitySettings,
    // Ad system state
    currentAdBreak: null,
    totalAdRevenue: 0,
    adBreaksCompleted: new Set(),
    showAdBreak: false,
    // Actions
    setCurrentLesson: function (lesson) {
        console.log('useTypingStore: setCurrentLesson called with:', lesson === null || lesson === void 0 ? void 0 : lesson.id);
        if (!lesson) {
            set({
                currentLesson: null,
                targetText: "",
                currentInput: "",
                currentPosition: 0,
                errors: [],
                wpm: 0,
                accuracy: 100,
                expectedChar: null,
            });
            return;
        }
        set({
            currentLesson: lesson,
            targetText: lesson.text || lesson.content || "",
            currentInput: "",
            currentPosition: 0,
            errors: [],
            wpm: 0,
            accuracy: 100,
            expectedChar: (lesson.text || lesson.content || "")[0] || null,
            gameState: "ready"
        });
    },
    setGameState: function (state) { return set({ gameState: state }); },
    setShowTutorial: function (show) { return set({ showTutorial: show }); },
    toggleHandPreference: function () {
        set(function (state) { return ({
            handPreference: state.handPreference === "left" ? "right" : "left"
        }); });
    },
    setHandPreference: function (hand) { return set({ handPreference: hand }); },
    toggleThemeMode: function () {
        set(function (state) { return ({
            themeMode: state.themeMode === "light" ? "dark" : "light"
        }); });
    },
    setThemeMode: function (theme) { return set({ themeMode: theme }); },
    setSoundEnabled: function (enabled) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { audioFeedback: enabled })
    }); }); },
    setBackgroundMusicEnabled: function (enabled) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { backgroundMusicEnabled: enabled })
    }); }); },
    setKeyClickSoundEnabled: function (enabled) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { keyClickSoundEnabled: enabled })
    }); }); },
    setErrorSoundEnabled: function (enabled) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { errorSoundEnabled: enabled })
    }); }); },
    setCompletionSoundEnabled: function (enabled) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { completionSoundEnabled: enabled })
    }); }); },
    setSoundVolume: function (volume) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { soundVolume: volume })
    }); }); },
    setShowVirtualKeyboard: function (show) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { showVirtualKeyboard: show })
    }); }); },
    setShowFingerGuide: function (show) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { showFingerGuide: show })
    }); }); },
    setHighlightNextKey: function (highlight) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { highlightNextKey: highlight })
    }); }); },
    setErrorHighlighting: function (highlight) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { errorHighlighting: highlight })
    }); }); },
    setAutoCorrect: function (correct) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { autoCorrect: correct })
    }); }); },
    setShowWPM: function (show) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { showWPM: show })
    }); }); },
    setShowAccuracy: function (show) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { showAccuracy: show })
    }); }); },
    setShowTimer: function (show) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { showTimer: show })
    }); }); },
    setHighContrast: function (contrast) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { highContrast: contrast })
    }); }); },
    setLargeText: function (large) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { largeText: large })
    }); }); },
    setReducedMotion: function (reduced) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { reducedMotion: reduced })
    }); }); },
    setScreenReaderMode: function (mode) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { screenReaderMode: mode })
    }); }); },
    setColorBlindMode: function (mode) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { colorBlindMode: mode })
    }); }); },
    setFocusMode: function (focus) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { focusMode: focus })
    }); }); },
    setFontSize: function (size) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { fontSize: size })
    }); }); },
    setLineHeight: function (height) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { lineHeight: height })
    }); }); },
    setCustomTheme: function (theme) { return set(function (state) { return ({
        accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), { customTheme: theme })
    }); }); },
    setViewMode: function (mode) { return set({ viewMode: mode }); },
    setKeyboardLayout: function (layout) { return set({ keyboardLayout: layout }); },
    setColorTheme: function (themeIndex) { return set({ selectedColorTheme: themeIndex }); },
    startLesson: function () {
        var currentLesson = get().currentLesson;
        if (!currentLesson)
            return;
        set({
            gameState: "playing",
            startTime: Date.now(),
            timeRemaining: currentLesson.timeLimit || null,
            currentInput: "",
            currentPosition: 0,
            errors: [],
            wpm: 0,
            accuracy: 100
        });
        // Update lesson stats
        set(function (state) {
            var _a;
            var _b;
            return ({
                stats: __assign(__assign({}, state.stats), { lessons: __assign(__assign({}, state.stats.lessons), (_a = {}, _a[currentLesson.id] = __assign(__assign({}, state.stats.lessons[currentLesson.id]), { attempts: (((_b = state.stats.lessons[currentLesson.id]) === null || _b === void 0 ? void 0 : _b.attempts) || 0) + 1 }), _a)) })
            });
        });
    },
    pauseLesson: function () { return set({ gameState: "paused" }); },
    resumeLesson: function () { return set({ gameState: "playing" }); },
    resetLesson: function () {
        var currentLesson = get().currentLesson;
        if (!currentLesson)
            return;
        set({
            gameState: "ready",
            currentInput: "",
            currentPosition: 0,
            errors: [],
            wpm: 0,
            accuracy: 100,
            startTime: null,
            timeRemaining: currentLesson.timeLimit || null,
            expectedChar: currentLesson.content[0] || null
        });
    },
    updateTypingProgress: function (result) {
        var _a;
        var _b, _c, _d, _e, _f, _g;
        var _h = get(), currentLesson = _h.currentLesson, stats = _h.stats, startTime = _h.startTime, keyboardLayout = _h.keyboardLayout;
        if (!currentLesson || !startTime)
            return;
        var timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
        var timeElapsedSeconds = (Date.now() - startTime) / 1000; // seconds for display
        // Calculate current streak
        var streak = get().currentStreak;
        if (result.hasError) {
            streak = 0;
        }
        else if (result.currentPosition > get().currentPosition) {
            streak++;
        }
        set({
            currentInput: result.newInput,
            currentPosition: result.currentPosition,
            errors: result.errorIndices,
            wpm: result.wpm,
            accuracy: result.accuracy,
            expectedChar: currentLesson.content[result.currentPosition] || null,
            currentWpm: result.wpm,
            timeElapsed: timeElapsedSeconds,
            currentStreak: streak
        });
        // Update layout-specific stats
        get().updateLayoutSpecificStats(keyboardLayout, result);
        // Update general stats
        var newStats = __assign(__assign({}, stats), { totalCharactersTyped: stats.totalCharactersTyped + 1, totalErrors: stats.totalErrors + (result.hasError ? 1 : 0), totalTimeTyped: stats.totalTimeTyped + (timeElapsed * 60), bestWpm: Math.max(stats.bestWpm, result.wpm), bestAccuracy: Math.max(stats.bestAccuracy, result.accuracy), lessons: __assign(__assign({}, stats.lessons), (_a = {}, _a[currentLesson.id] = __assign(__assign({}, stats.lessons[currentLesson.id]), { bestWpm: Math.max(((_b = stats.lessons[currentLesson.id]) === null || _b === void 0 ? void 0 : _b.bestWpm) || 0, result.wpm), bestAccuracy: Math.max(((_c = stats.lessons[currentLesson.id]) === null || _c === void 0 ? void 0 : _c.bestAccuracy) || 0, result.accuracy), totalTime: (((_d = stats.lessons[currentLesson.id]) === null || _d === void 0 ? void 0 : _d.totalTime) || 0) + timeElapsed, attempts: ((_e = stats.lessons[currentLesson.id]) === null || _e === void 0 ? void 0 : _e.attempts) || 1, completedCount: result.isComplete
                    ? (((_f = stats.lessons[currentLesson.id]) === null || _f === void 0 ? void 0 : _f.completedCount) || 0) + 1
                    : (((_g = stats.lessons[currentLesson.id]) === null || _g === void 0 ? void 0 : _g.completedCount) || 0) }), _a)) });
        set({
            stats: newStats,
            personalStats: newStats
        });
        // Check for new specialized achievements
        var state = get();
        var newSpecializedAchievements = (0, specializedAchievements_1.checkAchievements)(state.stats, state.stats.layoutSpecificStats, state.specializedAchievements.map(function (a) { return a.id; }));
        if (newSpecializedAchievements.length > 0) {
            set(function (prevState) { return ({
                specializedAchievements: __spreadArray(__spreadArray([], prevState.specializedAchievements, true), newSpecializedAchievements, true),
                unlockedAchievements: __spreadArray(__spreadArray([], prevState.unlockedAchievements, true), newSpecializedAchievements.map(function (a) { return a.id; }), true)
            }); });
            // Update progress after achievement check
            get().updateSpecializedProgress();
        }
        // End lesson if complete
        if (result.isComplete) {
            set({ gameState: "ended" });
        }
    },
    setCurrentInput: function (input) { return set({ currentInput: input }); },
    initializeAudio: function () {
        // Audio initialization handled in App.tsx
    },
    updateAccessibilitySettings: function (newSettings) {
        set(function (state) { return ({
            accessibilitySettings: __assign(__assign({}, state.accessibilitySettings), newSettings)
        }); });
    },
    goBackToMainMenu: function () {
        set({
            gameState: "ready",
            currentLesson: null,
            targetText: "",
            currentInput: "",
            currentPosition: 0,
            errors: [],
            wpm: 0,
            accuracy: 100,
            startTime: null,
            timeRemaining: null,
            expectedChar: null,
            highlightKey: null,
            viewMode: "portrait"
        });
    },
    addCustomLesson: function (lesson) {
        set(function (state) { return ({
            customLessons: __spreadArray(__spreadArray([], state.customLessons, true), [lesson], false),
        }); });
    },
    removeCustomLesson: function (lessonId) {
        set(function (state) { return ({
            customLessons: state.customLessons.filter(function (lesson) { return lesson.id !== lessonId; }),
        }); });
    },
    // Ad system actions
    setCurrentAdBreak: function (adBreak) { return set({ currentAdBreak: adBreak }); },
    completeAdBreak: function (revenue) {
        set(function (state) { return ({
            currentAdBreak: null,
            totalAdRevenue: state.totalAdRevenue + revenue,
            showAdBreak: false
        }); });
    },
    setShowAdBreak: function (show) { return set({ showAdBreak: show }); },
    // Layout-specific stats management
    updateLayoutSpecificStats: function (layoutType, result) {
        var state = get();
        var currentStats = state.stats.layoutSpecificStats || {};
        var layoutStats = currentStats[layoutType] || {
            totalCharacters: 0,
            totalChords: 0,
            avgErgonomicScore: 0,
            fingerUsageDistribution: {},
            bestWpmForLayout: 0,
            bestAccuracyForLayout: 0,
            hoursOfPractice: 0,
            adaptationProgress: 0
        };
        // Update character count
        var newTotalCharacters = layoutStats.totalCharacters + 1;
        // Update chord count for ARTSEY
        var newTotalChords = layoutType === 'artsey' && result.chordCombinations ?
            (layoutStats.totalChords || 0) + result.chordCombinations : layoutStats.totalChords;
        // Update ergonomic metrics if available
        var newAvgErgonomicScore = layoutStats.avgErgonomicScore || 0;
        var newFingerUsageDistribution = __assign({}, layoutStats.fingerUsageDistribution);
        if (result.layoutSpecificMetrics) {
            if (result.layoutSpecificMetrics.avgErgonomicScore) {
                newAvgErgonomicScore = ((layoutStats.avgErgonomicScore || 0) * (newTotalCharacters - 1) +
                    result.layoutSpecificMetrics.avgErgonomicScore) / newTotalCharacters;
            }
            if (result.layoutSpecificMetrics.fingerUsageDistribution) {
                Object.entries(result.layoutSpecificMetrics.fingerUsageDistribution).forEach(function (_a) {
                    var finger = _a[0], usage = _a[1];
                    newFingerUsageDistribution[finger] = (newFingerUsageDistribution[finger] || 0) + usage;
                });
            }
        }
        // Calculate adaptation progress (simple metric based on accuracy and consistency)
        var adaptationProgress = Math.min(100, (result.accuracy + (result.consistency || 0)) / 2);
        // Update practice time (rough estimate)
        var practiceTimeIncrease = state.startTime ? (Date.now() - state.startTime) / 1000 / 3600 : 0; // hours
        var updatedLayoutStats = __assign(__assign({}, layoutStats), { totalCharacters: newTotalCharacters, totalChords: newTotalChords, avgErgonomicScore: newAvgErgonomicScore, fingerUsageDistribution: newFingerUsageDistribution, bestWpmForLayout: Math.max(layoutStats.bestWpmForLayout, result.wpm || 0), bestAccuracyForLayout: Math.max(layoutStats.bestAccuracyForLayout, result.accuracy || 0), hoursOfPractice: layoutStats.hoursOfPractice + practiceTimeIncrease, adaptationProgress: Math.max(layoutStats.adaptationProgress || 0, adaptationProgress) });
        set(function (state) {
            var _a;
            var newStats = __assign(__assign({}, state.stats), { layoutSpecificStats: __assign(__assign({}, currentStats), (_a = {}, _a[layoutType] = updatedLayoutStats, _a)) });
            return {
                stats: newStats,
                personalStats: newStats
            };
        });
    },
    getPersonalStats: function () {
        var state = get();
        return state.stats;
    },
    updateSpecializedProgress: function () {
        var state = get();
        var layoutSpecificStats = state.stats.layoutSpecificStats || {};
        // Update progress milestones
        var updatedMilestones = (0, specializedAchievements_1.updateProgressMilestones)(layoutSpecificStats);
        // Generate insights
        var insights = (0, specializedAchievements_1.generateProgressInsights)(layoutSpecificStats);
        // Calculate overall progress
        var overallProgress = (0, specializedAchievements_1.calculateOverallProgress)(layoutSpecificStats);
        set({
            progressMilestones: updatedMilestones,
            progressInsights: insights,
            overallProgress: overallProgress
        });
    },
    getProgressSummary: function () {
        var state = get();
        return {
            achievements: state.specializedAchievements,
            milestones: state.progressMilestones,
            insights: state.progressInsights,
            overallProgress: state.overallProgress,
            layoutStats: state.stats.layoutSpecificStats
        };
    }
}); }));
