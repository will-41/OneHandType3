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
var lucide_react_1 = require("lucide-react");
var useTypingStore_1 = require("../lib/stores/useTypingStore");
var lessons_1 = require("../lib/lessons");
var LessonBuilder_1 = require("./LessonBuilder");
// Create Practice lesson object
var practiceLesson = {
    id: 'practice-mode',
    title: 'Practice Mode',
    description: 'Free typing practice with random texts',
    content: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for practicing your typing skills.',
    difficulty: 1,
    category: 'basics',
    level: 0,
    targetWpm: 20,
    handCompatibility: ['left', 'right'],
    estimatedTime: 5,
    wordCount: 25
};
var SwipeableLessonSelector = function (_a) {
    var onStartLesson = _a.onStartLesson, onBack = _a.onBack;
    var _b = (0, useTypingStore_1.useTypingStore)(), handPreference = _b.handPreference, themeMode = _b.themeMode, _c = _b.completedLessons, completedLessons = _c === void 0 ? [] : _c, _d = _b.lessonProgress, lessonProgress = _d === void 0 ? {} : _d, addCustomLesson = _b.addCustomLesson;
    var _e = (0, react_1.useState)(null), selectedLesson = _e[0], setSelectedLesson = _e[1];
    var _f = (0, react_1.useState)(0), currentIndex = _f[0], setCurrentIndex = _f[1];
    var scrollRef = (0, react_1.useRef)(null);
    var _g = (0, react_1.useState)(false), showLessonBuilder = _g[0], setShowLessonBuilder = _g[1];
    // Combine practice lesson with regular lessons and custom lessons
    var _h = (0, useTypingStore_1.useTypingStore)().customLessons, customLessons = _h === void 0 ? [] : _h;
    var allLessons = __spreadArray(__spreadArray([practiceLesson], lessons_1.lessons, true), customLessons, true);
    var getDifficultyColor = function (difficulty) {
        if (difficulty === 0)
            return 'bg-purple-500'; // Practice mode
        if (difficulty <= 2)
            return 'bg-green-500';
        if (difficulty <= 3)
            return 'bg-yellow-500';
        return 'bg-red-500';
    };
    var getDifficultyLabel = function (difficulty) {
        if (difficulty === 0)
            return 'Practice';
        if (difficulty <= 2)
            return 'Beginner';
        if (difficulty <= 3)
            return 'Intermediate';
        return 'Advanced';
    };
    var isLessonUnlocked = function (lesson) {
        if (lesson.id === 'practice-mode')
            return true; // Practice is always unlocked
        if (!lesson.prerequisites || lesson.prerequisites.length === 0)
            return true;
        return lesson.prerequisites.every(function (prereq) {
            return completedLessons.includes(prereq);
        });
    };
    var getLessonProgress = function (lessonId) {
        if (!lessonProgress || typeof lessonProgress !== 'object') {
            return null;
        }
        return lessonProgress[lessonId] || null;
    };
    var scrollToLesson = function (index) {
        if (scrollRef.current) {
            var cardWidth = 320; // Width of each card + gap
            scrollRef.current.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        }
        setCurrentIndex(index);
    };
    var nextLesson = function () {
        if (currentIndex < allLessons.length - 1) {
            scrollToLesson(currentIndex + 1);
        }
    };
    var prevLesson = function () {
        if (currentIndex > 0) {
            scrollToLesson(currentIndex - 1);
        }
    };
    var handleLessonClick = function (lesson) {
        setSelectedLesson(lesson);
    };
    var handleContinue = function () {
        if (selectedLesson) {
            onStartLesson(selectedLesson);
        }
    };
    var handleSaveCustomLesson = function (lesson) {
        addCustomLesson(lesson);
        setShowLessonBuilder(false);
    };
    if (showLessonBuilder) {
        return ((0, jsx_runtime_1.jsx)(LessonBuilder_1.default, { onSave: handleSaveCustomLesson, onClose: function () { return setShowLessonBuilder(false); } }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen transition-colors duration-300 p-4 ".concat(themeMode === 'dark'
            ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white'
            : 'bg-gradient-to-br from-white via-gray-50 to-blue-50 text-gray-900'), children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-8", children: [onBack && ((0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: onBack, variant: "outline", className: themeMode === 'dark'
                                ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600 border-2'
                                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 border-2', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back"] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold mb-2", children: "Choose Your Lesson" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-lg ".concat(themeMode === 'dark' ? 'text-slate-300' : 'text-gray-600'), children: ["Swipe to explore lessons for your ", handPreference, " hand"] })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: function () { return setShowLessonBuilder(true); }, variant: "outline", className: "gap-2 ".concat(themeMode === 'dark'
                                ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600 border-2'
                                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 border-2'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Create Lesson"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-4 mb-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: prevLesson, disabled: currentIndex === 0, className: themeMode === 'dark'
                                ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600 border-2 disabled:bg-slate-800 disabled:text-slate-500'
                                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 border-2', children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: allLessons.map(function (lesson, index) {
                                var isActive = index === currentIndex;
                                var isCompleted = completedLessons.includes(lesson.id);
                                return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return scrollToLesson(index); }, className: "relative w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center ".concat(isActive
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110'
                                        : isCompleted
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-md'
                                            : themeMode === 'dark'
                                                ? 'bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600'
                                                : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400', " ").concat(isActive ? 'animate-pulse' : 'hover:scale-105'), title: lesson.title, children: [isCompleted ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "w-6 h-6 text-white fill-current" })) : lesson.id === 'practice-mode' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-6 h-6 text-white" })) : lesson.category === 'basics' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "w-6 h-6 text-white" })) : lesson.category === 'words' ? ((0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-white rounded text-blue-600 flex items-center justify-center font-bold text-xs", children: "W" })) : lesson.category === 'sentences' ? ((0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-white rounded text-purple-600 flex items-center justify-center font-bold text-xs", children: "S" })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-white font-bold text-sm", children: index + 1 })), isActive && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping" })), !isCompleted && getLessonProgress(lesson.id) && ((0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-white" }))] }, index));
                            }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: nextLesson, disabled: currentIndex === allLessons.length - 1, className: themeMode === 'dark'
                                ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600 border-2 disabled:bg-slate-800 disabled:text-slate-500'
                                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 border-2', children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { ref: scrollRef, className: "flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4", style: { scrollbarWidth: 'none', msOverflowStyle: 'none' }, children: allLessons.map(function (lesson, index) {
                            var isUnlocked = isLessonUnlocked(lesson);
                            var progress = getLessonProgress(lesson.id);
                            var isCompleted = completedLessons.includes(lesson.id);
                            var isSelected = (selectedLesson === null || selectedLesson === void 0 ? void 0 : selectedLesson.id) === lesson.id;
                            var text = lesson.text || lesson.content || '';
                            var wordCount = lesson.wordCount || text.split(' ').length;
                            var estimatedTime = lesson.estimatedTime || Math.ceil(wordCount / 20);
                            return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: "min-w-[300px] max-w-[300px] snap-center cursor-pointer transition-all duration-300 ".concat(isSelected
                                    ? 'ring-4 ring-blue-500 scale-105'
                                    : isUnlocked
                                        ? 'hover:scale-102 shadow-lg'
                                        : 'opacity-50', " ").concat(themeMode === 'dark'
                                    ? 'bg-slate-800 border-slate-600'
                                    : 'bg-white border-gray-200'), onClick: function () { return isUnlocked && handleLessonClick(lesson); }, children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-6", children: [lesson.id === 'practice-mode' && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-8 h-8 text-white" }) }) })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold mb-2 ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: lesson.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm ".concat(themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600', " mb-3"), children: lesson.description })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "".concat(getDifficultyColor(lesson.difficulty), " text-white ml-2"), children: getDifficultyLabel(lesson.difficulty) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-3 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-2 rounded ".concat(themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-100'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 mx-auto mb-1 ".concat(themeMode === 'dark' ? 'text-blue-400' : 'text-blue-600') }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-medium ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: [estimatedTime, "m"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-2 rounded ".concat(themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-100'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "w-4 h-4 mx-auto mb-1 ".concat(themeMode === 'dark' ? 'text-green-400' : 'text-green-600') }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-medium ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: [lesson.targetWpm, " WPM"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-2 rounded ".concat(themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-100'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "w-4 h-4 mx-auto mb-1 ".concat(themeMode === 'dark' ? 'text-yellow-400' : 'text-yellow-600') }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-medium ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: [wordCount, " words"] })] })] }), progress && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Progress" }), (0, jsx_runtime_1.jsxs)("span", { children: [Math.round(progress.bestAccuracy || 0), "% accuracy"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: progress.bestAccuracy || 0, className: "h-2" })] })), isCompleted && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-2 text-green-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "w-4 h-4 fill-current" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Completed!" })] }))] })] }) }, lesson.id));
                        }) }) }), selectedLesson && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mt-8", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleContinue, size: "lg", className: "px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-5 h-5 mr-2" }), "Continue with ", selectedLesson.title] }) })), (0, jsx_runtime_1.jsx)("div", { className: "text-center mt-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm ".concat(themeMode === 'dark' ? 'text-slate-400' : 'text-gray-500'), children: "Select a lesson above to see the Continue button" }) })] }) }));
};
exports.default = SwipeableLessonSelector;
