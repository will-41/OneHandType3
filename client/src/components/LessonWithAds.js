"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useTypingStore_1 = require("../lib/stores/useTypingStore");
var adSystem_1 = require("../lib/adSystem");
var AdBreakComponent_1 = require("./AdBreakComponent");
var LessonWithAds = function (_a) {
    var lesson = _a.lesson, onLessonComplete = _a.onLessonComplete, onBack = _a.onBack;
    var _b = (0, useTypingStore_1.useTypingStore)(), currentAdBreak = _b.currentAdBreak, showAdBreak = _b.showAdBreak, totalAdRevenue = _b.totalAdRevenue, setCurrentAdBreak = _b.setCurrentAdBreak, setShowAdBreak = _b.setShowAdBreak, completeAdBreak = _b.completeAdBreak;
    var _c = (0, react_1.useState)(0), lessonProgress = _c[0], setLessonProgress = _c[1];
    var _d = (0, react_1.useState)(null), lessonStartTime = _d[0], setLessonStartTime = _d[1];
    var _e = (0, react_1.useState)(0), totalLessonTime = _e[0], setTotalLessonTime = _e[1];
    (0, react_1.useEffect)(function () {
        // Initialize ad system for this lesson
        adSystem_1.adManager.startLessonSession(lesson.id);
        setLessonStartTime(Date.now());
        // Show initial ad break
        var initialAd = {
            id: "".concat(lesson.id, "-start"),
            duration: 60,
            type: 'video',
            priority: 'high',
            revenue: 0.05,
            placement: 'lesson-start'
        };
        setCurrentAdBreak(initialAd);
        setShowAdBreak(true);
        return function () {
            // Cleanup when lesson ends
            if (lessonStartTime) {
                setTotalLessonTime(Date.now() - lessonStartTime);
            }
        };
    }, [lesson.id, setCurrentAdBreak, setShowAdBreak, lessonStartTime]);
    // Monitor lesson progress for strategic ad placement
    (0, react_1.useEffect)(function () {
        if (lessonProgress > 0) {
            var adTiming = adSystem_1.adManager.calculateAdTiming(lessonProgress);
            if (adTiming.shouldShowAd && adTiming.adBreak) {
                setCurrentAdBreak(adTiming.adBreak);
                setShowAdBreak(true);
            }
        }
    }, [lessonProgress, setCurrentAdBreak, setShowAdBreak]);
    var handleAdCompleted = function (revenue) {
        if (currentAdBreak) {
            adSystem_1.adManager.markAdCompleted(currentAdBreak.id, revenue);
            completeAdBreak(revenue);
        }
    };
    var handleProgressUpdate = function (progress) {
        setLessonProgress(progress);
    };
    var handleLessonComplete = function () {
        // Show completion ad
        var completionAd = {
            id: "".concat(lesson.id, "-completion"),
            duration: 80,
            type: 'banner',
            priority: 'medium',
            revenue: 0.06,
            placement: 'lesson-end'
        };
        setCurrentAdBreak(completionAd);
        setShowAdBreak(true);
        // After completion ad, proceed to lesson complete
        setTimeout(function () {
            onLessonComplete();
        }, 85000); // Wait for ad to complete
    };
    if (showAdBreak && currentAdBreak) {
        return ((0, jsx_runtime_1.jsx)(AdBreakComponent_1.default, { adBreak: currentAdBreak, onAdCompleted: handleAdCompleted, onSkip: function () {
                // Only allow skip after 15 seconds
                if (currentAdBreak.placement === 'lesson-end') {
                    handleAdCompleted(currentAdBreak.revenue * 0.5); // Reduced revenue for skip
                }
            } }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute top-4 right-4 z-10 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg text-sm", children: ["\uD83D\uDCB0 $", totalAdRevenue.toFixed(2), " earned"] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4", children: lesson.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: "Lesson content with strategic ad breaks" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "\uD83C\uDFAF This lesson includes scientifically-timed breaks for optimal learning retention" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onBack, className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700", children: "Back to Menu" })] }), lessonProgress > 0 && lessonProgress < 90 && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-4 left-4 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg text-xs", children: ["Next break in ", Math.max(0, Math.ceil((30 - (lessonProgress % 30)) * 0.15)), " min"] }))] }));
};
exports.default = LessonWithAds;
