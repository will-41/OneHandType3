"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var card_1 = require("./ui/card");
var button_1 = require("./ui/button");
var progress_1 = require("./ui/progress");
var utils_1 = require("../lib/utils");
var useTypingStore_1 = require("../lib/stores/useTypingStore");
var lucide_react_1 = require("lucide-react");
var AdBreakComponent = function (_a) {
    var adBreak = _a.adBreak, onAdCompleted = _a.onAdCompleted, onSkip = _a.onSkip, className = _a.className;
    var themeMode = (0, useTypingStore_1.useTypingStore)().themeMode;
    var _b = (0, react_1.useState)(adBreak.duration), timeRemaining = _b[0], setTimeRemaining = _b[1];
    var _c = (0, react_1.useState)(true), isPlaying = _c[0], setIsPlaying = _c[1];
    var _d = (0, react_1.useState)(false), isMuted = _d[0], setIsMuted = _d[1];
    var _e = (0, react_1.useState)(0), adProgress = _e[0], setAdProgress = _e[1];
    (0, react_1.useEffect)(function () {
        if (!isPlaying)
            return;
        var interval = setInterval(function () {
            setTimeRemaining(function (prev) {
                var newTime = prev - 1;
                var progress = ((adBreak.duration - newTime) / adBreak.duration) * 100;
                setAdProgress(progress);
                if (newTime <= 0) {
                    onAdCompleted(adBreak.revenue);
                    return 0;
                }
                return newTime;
            });
        }, 1000);
        return function () { return clearInterval(interval); };
    }, [isPlaying, adBreak.duration, adBreak.revenue, onAdCompleted]);
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins, ":").concat(secs.toString().padStart(2, '0'));
    };
    var getAdTypeIcon = function () {
        switch (adBreak.type) {
            case 'video': return (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-5 h-5" });
            case 'banner': return (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "w-5 h-5" });
            case 'interstitial': return (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-5 h-5" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-5 h-5" });
        }
    };
    var getPlacementMessage = function () {
        switch (adBreak.placement) {
            case 'lesson-start': return 'Let\'s warm up with a quick break before your lesson!';
            case 'mid-lesson': return 'Perfect timing for a breather! Your fingers need this rest.';
            case 'lesson-end': return 'Great lesson! Time to relax before your next challenge.';
            case 'achievement': return 'Congratulations! You\'ve earned this celebration break.';
            default: return 'Taking a moment to recharge your typing energy!';
        }
    };
    var generateMockAdContent = function () {
        var adContents = [
            {
                title: "TechFlow Keyboards",
                description: "Ergonomic keyboards designed for one-handed typing. 40% off today!",
                brand: "TechFlow",
                cta: "Shop Now"
            },
            {
                title: "Focus Time App",
                description: "Boost productivity with AI-powered focus sessions. Premium features unlocked!",
                brand: "Focus Time",
                cta: "Try Free"
            },
            {
                title: "Learn Code Faster",
                description: "Master programming with one-handed typing techniques. Join 50k+ developers.",
                brand: "CodeMaster",
                cta: "Start Learning"
            },
            {
                title: "Accessibility Tools",
                description: "Professional assistive technology for enhanced computer interaction.",
                brand: "AccessPro",
                cta: "Discover More"
            }
        ];
        return adContents[Math.floor(Math.random() * adContents.length)];
    };
    var mockAd = generateMockAdContent();
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("fixed inset-0 z-50 flex items-center justify-center p-4", themeMode === 'dark' ? 'bg-black/80' : 'bg-white/80', className), children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: (0, utils_1.cn)("w-full max-w-2xl p-8 space-y-6", themeMode === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200', "backdrop-blur-lg"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [getAdTypeIcon(), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold", children: "Quick Break Time!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm ".concat(themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'), children: getPlacementMessage() })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return setIsMuted(!isMuted); }, className: "p-2", children: isMuted ? (0, jsx_runtime_1.jsx)(lucide_react_1.VolumeX, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Volume2, { className: "w-4 h-4" }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("p-6 rounded-lg text-center space-y-4", "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"), children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-blue-600 dark:text-blue-400", children: mockAd.brand }), (0, jsx_runtime_1.jsx)("h4", { className: "text-xl font-semibold", children: mockAd.title }), (0, jsx_runtime_1.jsx)("p", { className: "".concat(themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'), children: mockAd.description }), (0, jsx_runtime_1.jsx)(button_1.Button, { className: "bg-blue-600 hover:bg-blue-700 text-white px-8 py-2", children: mockAd.cta })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" }), formatTime(timeRemaining), " remaining"] }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4 text-green-500" }), "$", adBreak.revenue.toFixed(2), " earned"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: adProgress, className: "h-2" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return setIsPlaying(!isPlaying); }, className: "flex items-center gap-2", children: isPlaying ? 'Pause' : 'Resume' }), onSkip && timeRemaining < 15 && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", onClick: onSkip, className: "text-blue-600 hover:text-blue-700", children: "Skip \u2192" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("p-4 rounded-lg", "bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Coffee, { className: "w-4 h-4 text-green-600" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-green-700 dark:text-green-400", children: "Did you know?" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-green-600 dark:text-green-300", children: "Regular typing breaks improve accuracy by 23% and reduce finger fatigue. You're building stronger muscle memory right now!" })] })] }) }));
};
exports.default = AdBreakComponent;
