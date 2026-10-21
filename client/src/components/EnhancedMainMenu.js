"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
var react_1 = require("react");
var next_themes_1 = require("next-themes");
var card_1 = require("./ui/card");
var button_1 = require("./ui/button");
var badge_1 = require("./ui/badge");
var utils_1 = require("../lib/utils");
var useTypingStore_1 = require("../lib/stores/useTypingStore");
var use_toast_1 = require("./ui/use-toast");
var lucide_react_1 = require("lucide-react");
var ComprehensiveSettingsPanel_1 = require("./ComprehensiveSettingsPanel");
var SmartLearningSystem_1 = require("./SmartLearningSystem");
var CurriculumProgressIntegration_1 = require("./CurriculumProgressIntegration");
var SwipeableLessonSelector_1 = require("./SwipeableLessonSelector");
// Fallback component that should never be used - SwipeableLessonSelector exists separately
var FallbackLessonSelector = function (_a) {
    var onBack = _a.onBack;
    console.log('CRITICAL: This fallback component should not be rendering - using real SwipeableLessonSelector');
    return null;
};
var AdvancedAnalytics = function (_a) {
    var stats = _a.stats, onBack = _a.onBack;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: onBack, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2190" }), " Back to Menu"] }) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold mb-4", children: "Performance Analytics" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-500", children: stats.bestWpm || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm opacity-75", children: "Best WPM" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-green-500", children: [stats.bestAccuracy || 0, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm opacity-75", children: "Best Accuracy" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-500", children: Math.round((stats.totalTimeTyped || 0) / 60) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm opacity-75", children: "Minutes Practiced" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-orange-500", children: stats.completedLessons || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm opacity-75", children: "Lessons Completed" })] })] })] })] }));
};
var SoundFeedbackSystem = function () {
    var _a = (0, useTypingStore_1.useTypingStore)(), accessibilitySettings = _a.accessibilitySettings, setKeyClickSoundEnabled = _a.setKeyClickSoundEnabled, setBackgroundMusicEnabled = _a.setBackgroundMusicEnabled, setSoundVolume = _a.setSoundVolume;
    var handleAudioConfigure = function (type) {
        (0, use_toast_1.toast)({
            title: "".concat(type === 'keypress' ? 'Key Press' : 'Background Music', " Settings"),
            description: "".concat(type === 'keypress' ? 'Key press sounds' : 'Background music', " ").concat(accessibilitySettings[type === 'keypress' ? 'keyClickSoundEnabled' : 'backgroundMusicEnabled'] ? 'disabled' : 'enabled', "!"),
            duration: 3000,
        });
        if (type === 'keypress') {
            setKeyClickSoundEnabled(!accessibilitySettings.keyClickSoundEnabled);
        }
        else {
            setBackgroundMusicEnabled(!accessibilitySettings.backgroundMusicEnabled);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold mb-4", children: "Audio Settings" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Key Press Sounds" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return handleAudioConfigure('keypress'); }, children: accessibilitySettings.keyClickSoundEnabled ? 'Enabled' : 'Disabled' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Background Music" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return handleAudioConfigure('background'); }, children: accessibilitySettings.backgroundMusicEnabled ? 'Enabled' : 'Disabled' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Volume: ", accessibilitySettings.soundVolume, "%"] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "100", value: accessibilitySettings.soundVolume, onChange: function (e) { return setSoundVolume(Number(e.target.value)); }, className: "w-24" })] })] })] }));
};
var SocialSharing = function (_a) {
    var sessionStats = _a.sessionStats;
    var _b = (0, useTypingStore_1.useTypingStore)(), stats = _b.stats, completedLessons = _b.completedLessons;
    var handleShare = function () { return __awaiter(void 0, void 0, void 0, function () {
        var shareData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shareData = {
                        title: 'OneHandType - My Typing Progress',
                        text: "I've completed ".concat(completedLessons.length, " lessons and achieved ").concat(stats.bestWpm || 0, " WPM with ").concat(stats.bestAccuracy || 0, "% accuracy!"),
                        url: window.location.origin,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!(navigator.share && navigator.canShare && navigator.canShare(shareData))) return [3 /*break*/, 3];
                    return [4 /*yield*/, navigator.share(shareData)];
                case 2:
                    _a.sent();
                    (0, use_toast_1.toast)({
                        title: "Shared Successfully! 📱",
                        description: "Your progress has been shared!",
                        duration: 3000,
                    });
                    return [3 /*break*/, 5];
                case 3: 
                // Fallback to clipboard
                return [4 /*yield*/, navigator.clipboard.writeText("".concat(shareData.text, " Check it out at: ").concat(shareData.url))];
                case 4:
                    // Fallback to clipboard
                    _a.sent();
                    (0, use_toast_1.toast)({
                        title: "Link Copied! 📋",
                        description: "Share text copied to clipboard. Paste it anywhere!",
                        duration: 4000,
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    (0, use_toast_1.toast)({
                        title: "Share Failed",
                        description: "Unable to share. Try copying the link manually.",
                        variant: "destructive",
                        duration: 3000,
                    });
                    console.error('Error sharing:', err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold mb-4", children: "Share Your Progress" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium", children: "Latest Achievement" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-lg", children: [stats.bestWpm || 0, " WPM \u2022 ", stats.bestAccuracy || 0, "% Accuracy"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 mt-1", children: [completedLessons.length, " lessons completed"] })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { className: "w-full", onClick: handleShare, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Share2, { className: "w-4 h-4 mr-2" }), "Share on Social Media"] })] })] }));
};
var MobileAccessibilitySettings = function (_a) {
    var onClose = _a.onClose;
    var _b = (0, useTypingStore_1.useTypingStore)(), handPreference = _b.handPreference, setHandPreference = _b.setHandPreference, themeMode = _b.themeMode, setThemeMode = _b.setThemeMode, accessibilitySettings = _b.accessibilitySettings, updateAccessibilitySettings = _b.updateAccessibilitySettings;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Hand, { className: "w-6 h-6 text-blue-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-xl", children: "Hand Preference" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Choose your dominant hand for optimized typing" })] })] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: (0, utils_1.cn)("text-white font-medium px-3 py-1", handPreference === 'left' ? 'bg-purple-500' : 'bg-blue-500'), children: [handPreference.charAt(0).toUpperCase() + handPreference.slice(1), " Hand"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: handPreference === 'left' ? 'default' : 'outline', onClick: function () { return setHandPreference('left'); }, className: (0, utils_1.cn)("flex items-center justify-center gap-2 p-4 h-auto", handPreference === 'left'
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'hover:bg-purple-50 dark:hover:bg-purple-950'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Hand, { className: "w-5 h-5 scale-x-[-1]" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "Left Hand" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs opacity-75", children: "Optimized for left-handed typing" })] })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: handPreference === 'right' ? 'default' : 'outline', onClick: function () { return setHandPreference('right'); }, className: (0, utils_1.cn)("flex items-center justify-center gap-2 p-4 h-auto", handPreference === 'right'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'hover:bg-blue-50 dark:hover:bg-blue-950'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Hand, { className: "w-5 h-5" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "Right Hand" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs opacity-75", children: "Optimized for right-handed typing" })] })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "w-5 h-5" }), "Theme & Appearance"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: themeMode === 'light' ? 'default' : 'outline', onClick: function () { return setThemeMode('light'); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { className: "w-4 h-4" }), "Light Mode"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: themeMode === 'dark' ? 'default' : 'outline', onClick: function () { return setThemeMode('dark'); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { className: "w-4 h-4" }), "Dark Mode"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Volume2, { className: "w-5 h-5" }), "Audio Settings"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Sound Effects" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.soundEnabled ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ soundEnabled: !accessibilitySettings.soundEnabled }); }, children: accessibilitySettings.soundEnabled ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Key Click Sounds" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.keyClickSoundEnabled ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ keyClickSoundEnabled: !accessibilitySettings.keyClickSoundEnabled }); }, disabled: !accessibilitySettings.soundEnabled, children: accessibilitySettings.keyClickSoundEnabled ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Background Music" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.backgroundMusicEnabled ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ backgroundMusicEnabled: !accessibilitySettings.backgroundMusicEnabled }); }, disabled: !accessibilitySettings.soundEnabled, children: accessibilitySettings.backgroundMusicEnabled ? 'ON' : 'OFF' })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Keyboard, { className: "w-5 h-5" }), "Typing Preferences"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Show Virtual Keyboard" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.showVirtualKeyboard ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ showVirtualKeyboard: !accessibilitySettings.showVirtualKeyboard }); }, children: accessibilitySettings.showVirtualKeyboard ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Finger Guide" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.showFingerGuide ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ showFingerGuide: !accessibilitySettings.showFingerGuide }); }, disabled: !accessibilitySettings.showVirtualKeyboard, children: accessibilitySettings.showFingerGuide ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Highlight Next Key" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.highlightNextKey ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ highlightNextKey: !accessibilitySettings.highlightNextKey }); }, disabled: !accessibilitySettings.showVirtualKeyboard, children: accessibilitySettings.highlightNextKey ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Error Highlighting" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.errorHighlighting ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ errorHighlighting: !accessibilitySettings.errorHighlighting }); }, children: accessibilitySettings.errorHighlighting ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Auto-Correction" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.autoCorrect ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ autoCorrect: !accessibilitySettings.autoCorrect }); }, children: accessibilitySettings.autoCorrect ? 'ON' : 'OFF' })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-5 h-5" }), "Accessibility"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "High Contrast Mode" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.highContrast ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ highContrast: !accessibilitySettings.highContrast }); }, children: accessibilitySettings.highContrast ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Large Text" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.largeText ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ largeText: !accessibilitySettings.largeText }); }, children: accessibilitySettings.largeText ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Reduced Motion" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.reduceMotion ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ reduceMotion: !accessibilitySettings.reduceMotion }); }, children: accessibilitySettings.reduceMotion ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Screen Reader Mode" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.screenReaderMode ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ screenReaderMode: !accessibilitySettings.screenReaderMode }); }, children: accessibilitySettings.screenReaderMode ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Color Blind Support" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.colorBlindMode ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ colorBlindMode: !accessibilitySettings.colorBlindMode }); }, children: accessibilitySettings.colorBlindMode ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Focus Mode" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.focusMode ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ focusMode: !accessibilitySettings.focusMode }); }, children: accessibilitySettings.focusMode ? 'ON' : 'OFF' })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart, { className: "w-5 h-5" }), "Performance Display"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Show WPM Counter" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.showWPM ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ showWPM: !accessibilitySettings.showWPM }); }, children: accessibilitySettings.showWPM ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Show Accuracy" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.showAccuracy ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ showAccuracy: !accessibilitySettings.showAccuracy }); }, children: accessibilitySettings.showAccuracy ? 'ON' : 'OFF' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Show Timer" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: accessibilitySettings.showTimer ? 'default' : 'outline', size: "sm", onClick: function () { return updateAccessibilitySettings({ showTimer: !accessibilitySettings.showTimer }); }, children: accessibilitySettings.showTimer ? 'ON' : 'OFF' })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: onClose, className: "bg-blue-600 hover:bg-blue-700 text-white px-8", children: "Save & Close Settings" }) })] }));
};
// Floating particles component
var FloatingParticles = function (_a) {
    var theme = _a.theme;
    var _b = (0, react_1.useState)([]), particles = _b[0], setParticles = _b[1];
    (0, react_1.useEffect)(function () {
        var newParticles = Array.from({ length: 20 }, function (_, i) { return ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.3 + 0.1
        }); });
        setParticles(newParticles);
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 pointer-events-none overflow-hidden", children: particles.map(function (particle) { return ((0, jsx_runtime_1.jsx)("div", { className: "absolute rounded-full ".concat(theme === 'dark' ? 'bg-blue-400' : 'bg-blue-300', " animate-pulse"), style: {
                left: "".concat(particle.x, "%"),
                top: "".concat(particle.y, "%"),
                width: "".concat(particle.size, "px"),
                height: "".concat(particle.size, "px"),
                opacity: particle.opacity,
                animation: "float ".concat(5 + Math.random() * 10, "s ease-in-out infinite alternate")
            } }, particle.id)); }) }));
};
// Animated counter component
var AnimatedCounter = function (_a) {
    var value = _a.value, _b = _a.suffix, suffix = _b === void 0 ? '' : _b, _c = _a.prefix, prefix = _c === void 0 ? '' : _c, _d = _a.duration, duration = _d === void 0 ? 1000 : _d;
    var _e = (0, react_1.useState)(0), count = _e[0], setCount = _e[1];
    (0, react_1.useEffect)(function () {
        var startTime;
        var animationFrame;
        var animate = function (currentTime) {
            if (!startTime)
                startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);
            var easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * value));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return function () { return cancelAnimationFrame(animationFrame); };
    }, [value, duration]);
    return (0, jsx_runtime_1.jsxs)("span", { children: [prefix, count.toFixed(prefix ? 2 : 0), suffix] });
};
// Enhanced menu card with advanced animations
var EnhancedMenuCard = function (_a) {
    var item = _a.item, index = _a.index, theme = _a.theme, onClick = _a.onClick;
    var _b = (0, react_1.useState)(false), isHovered = _b[0], setIsHovered = _b[1];
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "group relative p-6 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:rotate-1 ".concat(theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/50 hover:border-slate-500 backdrop-blur-xl'
            : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 hover:border-gray-300 backdrop-blur-xl', " hover:shadow-2xl hover:shadow-").concat(item.color.split('-')[1], "-500/20"), style: {
            animationDelay: "".concat(index * 100, "ms"),
            animation: 'slideInUp 0.6s ease-out forwards'
        }, onClick: function (e) {
            console.log('=== ENHANCED MENU CARD COMPONENT CLICKED ===');
            console.log('Clicked item:', item.id, item.title);
            console.log('onClick function:', typeof onClick);
            e.preventDefault();
            e.stopPropagation();
            try {
                onClick === null || onClick === void 0 ? void 0 : onClick();
                console.log('EnhancedMenuCard onClick executed successfully');
            }
            catch (error) {
                console.error('Error in EnhancedMenuCard onClick:', error);
            }
            console.log('=== END ENHANCED MENU CARD COMPONENT CLICK ===');
        }, onMouseEnter: function () { return setIsHovered(true); }, onMouseLeave: function () { return setIsHovered(false); }, children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-lg bg-gradient-to-r from-".concat(item.color.split('-')[1], "-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm") }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-xl ".concat(item.color, " text-white transform transition-transform duration-300 ").concat(isHovered ? 'rotate-12 scale-110' : '', " shadow-lg"), children: (0, jsx_runtime_1.jsx)("div", { className: "transform transition-transform duration-300 group-hover:scale-110", children: item.icon }) }), item.badge && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "default", className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-bounce shadow-lg", children: item.badge }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold mb-1 transition-colors duration-300 ".concat(theme === 'dark' ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-600'), children: item.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mb-2 transition-colors duration-300 ".concat(theme === 'dark' ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-700'), children: item.description }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs transition-colors duration-300 ".concat(theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'), children: item.stats })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute w-0 h-0 bg-white/20 rounded-full transition-all duration-500 ".concat(isHovered ? 'w-96 h-96' : ''), style: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' } }) })] }));
};
var EnhancedMainMenu = function (_a) {
    var onStartLesson = _a.onStartLesson, onStartTutorial = _a.onStartTutorial, className = _a.className;
    console.log('=== ENHANCED MAIN MENU INIT ===');
    console.log('EnhancedMainMenu: onStartLesson type:', typeof onStartLesson);
    console.log('EnhancedMainMenu: onStartLesson exists:', !!onStartLesson);
    console.log('EnhancedMainMenu: onStartTutorial type:', typeof onStartTutorial);
    console.log('=== END ENHANCED MAIN MENU INIT ===');
    var _b = (0, useTypingStore_1.useTypingStore)(), themeMode = _b.themeMode, setThemeMode = _b.setThemeMode, stats = _b.stats, completedLessons = _b.completedLessons, handPreference = _b.handPreference;
    var _c = (0, next_themes_1.useTheme)(), theme = _c.theme, setTheme = _c.setTheme;
    var _d = (0, react_1.useState)('main'), currentView = _d[0], setCurrentView = _d[1];
    var _e = (0, react_1.useState)(null), selectedLesson = _e[0], setSelectedLesson = _e[1];
    var _f = (0, react_1.useState)(''), timeOfDay = _f[0], setTimeOfDay = _f[1];
    // Sync theme between useTheme and useTypingStore
    (0, react_1.useEffect)(function () {
        if (theme !== themeMode) {
            setTheme(themeMode);
        }
    }, [themeMode, theme, setTheme]);
    // Theme toggle function  
    var toggleTheme = function () {
        var newTheme = themeMode === 'dark' ? 'light' : 'dark';
        setThemeMode(newTheme);
        setTheme(newTheme);
    };
    // Dynamic gradient based on time of day
    (0, react_1.useEffect)(function () {
        var hour = new Date().getHours();
        if (hour < 6)
            setTimeOfDay('night');
        else if (hour < 12)
            setTimeOfDay('morning');
        else if (hour < 18)
            setTimeOfDay('afternoon');
        else
            setTimeOfDay('evening');
    }, []);
    var getTimeGradient = function () {
        var gradients = {
            morning: themeMode === 'dark'
                ? 'from-slate-800 via-slate-900 to-gray-900'
                : 'from-orange-50 via-yellow-50 to-blue-50',
            afternoon: themeMode === 'dark'
                ? 'from-slate-800 via-blue-900 to-indigo-900'
                : 'from-blue-50 via-white to-cyan-50',
            evening: themeMode === 'dark'
                ? 'from-purple-900 via-slate-900 to-gray-900'
                : 'from-purple-50 via-pink-50 to-orange-50',
            night: themeMode === 'dark'
                ? 'from-gray-900 via-slate-900 to-black'
                : 'from-gray-100 via-slate-100 to-gray-200'
        };
        return gradients[timeOfDay] || gradients.morning;
    };
    // Mock session for social sharing
    var mockSessionStats = {
        wpm: stats.bestWpm || 42,
        accuracy: stats.bestAccuracy || 94,
        timeSpent: 15,
        lessonCompleted: 'Home Row Mastery'
    };
    var handleStartLesson = function () {
        console.log('EnhancedMainMenu: handleStartLesson called');
        setCurrentView('lessons');
    };
    var handleLessonSelect = function (lesson) {
        console.log('EnhancedMainMenu: handleLessonSelect called with:', lesson);
        if (onStartLesson) {
            onStartLesson(lesson);
        }
    };
    var menuItems = [
        {
            id: 'tutorial',
            title: 'Tutorial',
            description: 'Learn the basics of one-handed typing',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-8 w-8" }),
            color: 'bg-gradient-to-br from-green-500 to-emerald-600',
            badge: 'Start Here',
            stats: 'Interactive guide for beginners',
            action: function () { return onStartTutorial === null || onStartTutorial === void 0 ? void 0 : onStartTutorial(); }
        },
        {
            id: 'lessons',
            title: 'Start Typing',
            description: 'Practice lessons and improve your skills',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { className: "h-8 w-8" }),
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            stats: "".concat(completedLessons.length, " lessons completed"),
            action: handleStartLesson
        },
        {
            id: 'curriculum',
            title: 'Realm of Keys Academy',
            description: 'Complete the Ten Realms curriculum',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "h-8 w-8" }),
            color: 'bg-gradient-to-br from-purple-600 to-indigo-700',
            badge: 'NEW',
            stats: 'Gamified learning journey',
            action: function () { return setCurrentView('curriculum'); }
        },
        {
            id: 'ai-coach',
            title: 'AI Learning Coach',
            description: 'Personalized recommendations and insights',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart, { className: "h-8 w-8" }),
            color: 'bg-gradient-to-br from-purple-500 to-violet-600',
            badge: 'AI',
            stats: 'Smart analysis & recommendations',
            action: function () { return setCurrentView('ai-coach'); }
        },
        {
            id: 'analytics',
            title: 'Advanced Analytics',
            description: 'Deep insights into your performance',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart, { className: "h-8 w-8" }),
            color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
            stats: "".concat(stats.bestWpm || 0, " WPM personal best"),
            action: function () { return setCurrentView('analytics'); }
        },
        {
            id: 'social',
            title: 'Share Progress',
            description: 'Share achievements and compete',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Share2, { className: "h-8 w-8" }),
            color: 'bg-gradient-to-br from-pink-500 to-rose-600',
            stats: 'Show your skills',
            badge: 'NEW',
            action: function () { return setCurrentView('social'); }
        },
        {
            id: 'sound',
            title: 'Sound Feedback',
            description: 'Dynamic audio experience',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Volume2, { className: "h-8 w-8" }),
            color: 'bg-gradient-to-br from-orange-500 to-amber-600',
            stats: 'Enhance your focus',
            badge: 'NEW',
            action: function () { return setCurrentView('sound'); }
        },
    ];
    var quickStats = [
        {
            label: 'Best WPM',
            value: stats.bestWpm || 0,
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-6 w-6 text-blue-500" }),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            label: 'Best Accuracy',
            value: stats.bestAccuracy || 0,
            suffix: '%',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-6 w-6 text-green-500" }),
            color: 'from-green-500 to-emerald-500'
        },
        {
            label: 'Lessons Done',
            value: completedLessons.length,
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { className: "h-6 w-6 text-purple-500" }),
            color: 'from-purple-500 to-violet-500'
        },
        {
            label: 'Practice Time',
            value: Math.round((stats.totalTimeTyped || 0) / 60),
            suffix: 'm',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Timer, { className: "h-6 w-6 text-orange-500" }),
            color: 'from-orange-500 to-amber-500'
        },
        {
            label: 'Streak Days',
            value: 0, // Default since currentStreak doesn't exist
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Flame, { className: "h-6 w-6 text-orange-500" }),
            color: 'from-orange-500 to-red-500'
        }
    ];
    var renderMainMenu = function () { return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(FloatingParticles, { theme: themeMode }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8 relative z-10", children: [(0, jsx_runtime_1.jsx)(card_1.Card, { className: "p-8 text-center transform transition-all duration-700 hover:scale-105 ".concat(themeMode === 'dark'
                            ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/50 backdrop-blur-xl'
                            : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 backdrop-blur-xl', " shadow-2xl"), children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "animate-fadeInUp", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse ".concat(themeMode === 'dark' ? 'drop-shadow-lg' : 'drop-shadow-md'), children: "OneType" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl ".concat(themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600', " animate-slideInUp"), children: "Master one-handed typing with confidence" }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "mt-3 px-4 py-2 text-lg font-semibold border-2 transition-all duration-300 hover:scale-110 ".concat(themeMode === 'dark'
                                                ? 'border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white'
                                                : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Hand, { className: "w-4 h-4 mr-2" }), handPreference.charAt(0).toUpperCase() + handPreference.slice(1), " Hand Mode"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-600", children: quickStats.map(function (stat, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "group p-4 rounded-xl bg-gradient-to-br ".concat(stat.color, " transform transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer"), style: { animationDelay: "".concat(index * 150, "ms") }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center text-white", children: [(0, jsx_runtime_1.jsx)("div", { className: "transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125 mb-2", children: stat.icon }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: (0, jsx_runtime_1.jsx)(AnimatedCounter, { value: stat.value, suffix: stat.suffix }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm opacity-90 font-medium", children: stat.label })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" })] }, index)); }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: menuItems.map(function (item, index) { return ((0, jsx_runtime_1.jsx)(EnhancedMenuCard, { item: item, index: index, theme: themeMode, onClick: function () {
                                console.log('=== ENHANCED MENU CARD CLICKED ===');
                                console.log('Card clicked:', item.id, item.title);
                                console.log('Action type:', typeof item.action);
                                try {
                                    item.action();
                                    console.log('Card action executed successfully');
                                }
                                catch (error) {
                                    console.error('Error executing card action:', error);
                                }
                                console.log('=== END ENHANCED MENU CARD CLICK ===');
                            } }, item.id)); }) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6 ".concat(themeMode === 'dark' ? 'bg-slate-800/90 border-slate-600/50 backdrop-blur-xl' : 'bg-white/90 border-gray-200/50 backdrop-blur-xl', " shadow-2xl"), children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-2xl font-bold mb-6 flex items-center gap-3 ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trophy, { className: "h-6 w-6 text-yellow-500" }), "Recent Achievements"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-xl ".concat(themeMode === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50', " transform transition-all duration-300 hover:scale-105"), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-5 w-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "Last Session" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-green-500 font-bold", children: [(0, jsx_runtime_1.jsx)(AnimatedCounter, { value: stats.bestWpm || 42, suffix: " WPM \u2022 " }), (0, jsx_runtime_1.jsx)(AnimatedCounter, { value: stats.bestAccuracy || 94, suffix: "%" })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-xl ".concat(themeMode === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50', " transform transition-all duration-300 hover:scale-105"), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-5 w-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "Weekly Progress" }), (0, jsx_runtime_1.jsx)("div", { className: "text-blue-500 font-bold", children: "+8 WPM improvement" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-xl ".concat(themeMode === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50', " transform transition-all duration-300 hover:scale-105"), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full animate-pulse", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "h-5 w-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "Achievement" }), (0, jsx_runtime_1.jsx)("div", { className: "text-yellow-500 font-bold", children: "Speed Demon unlocked!" })] })] }) })] })] })] })] })); };
    var renderCurrentView = function () {
        console.log('EnhancedMainMenu: renderCurrentView called with currentView:', currentView);
        switch (currentView) {
            case 'lessons':
                console.log('EnhancedMainMenu: Rendering SwipeableLessonSelector');
                return ((0, jsx_runtime_1.jsx)(SwipeableLessonSelector_1.default, { onStartLesson: function (lesson) {
                        console.log('EnhancedMainMenu: Passing lesson to main onStartLesson:', lesson);
                        onStartLesson(lesson);
                    }, onBack: function () { return setCurrentView('main'); } }));
            case 'curriculum':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "Realm of Keys Academy" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return setCurrentView('main'); }, className: "transition-all duration-300 hover:scale-105 ".concat(themeMode === 'dark'
                                        ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600'
                                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'), children: "Back to Menu" })] }), (0, jsx_runtime_1.jsx)(CurriculumProgressIntegration_1.default, { onStartLesson: function (lesson) {
                                console.log('EnhancedMainMenu: Realm of Keys lesson passed to main onStartLesson:', lesson);
                                // Convert CurriculumLesson to Lesson format
                                var convertedLesson = {
                                    id: lesson.id,
                                    title: lesson.title,
                                    description: lesson.description,
                                    category: "curriculum",
                                    level: 1,
                                    difficulty: lesson.difficulty,
                                    content: lesson.content,
                                    text: lesson.content,
                                    targetWpm: lesson.targetWpm,
                                    handCompatibility: ["left", "right"],
                                    focusKeys: lesson.keyFocus,
                                    prerequisites: lesson.prerequisites,
                                    wordCount: lesson.content.split(' ').length,
                                    estimatedTime: lesson.estimatedTime,
                                };
                                onStartLesson(convertedLesson);
                            } })] }));
            case 'analytics':
                return ((0, jsx_runtime_1.jsx)(AdvancedAnalytics, { stats: stats, onBack: function () { return setCurrentView('main'); } }));
            case 'sound':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "Sound Feedback System" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return setCurrentView('main'); }, className: "transition-all duration-300 hover:scale-105 ".concat(themeMode === 'dark'
                                        ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600'
                                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'), children: "Back to Menu" })] }), (0, jsx_runtime_1.jsx)(SoundFeedbackSystem, {})] }));
            case 'social':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "Share Your Progress" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return setCurrentView('main'); }, className: "transition-all duration-300 hover:scale-105 ".concat(themeMode === 'dark'
                                        ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600'
                                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'), children: "Back to Menu" })] }), (0, jsx_runtime_1.jsx)(SocialSharing, { sessionStats: mockSessionStats })] }));
            case 'ai-coach':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "AI Learning Coach" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return setCurrentView('main'); }, className: "transition-all duration-300 hover:scale-105 ".concat(themeMode === 'dark'
                                        ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600'
                                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'), children: "Back to Menu" })] }), (0, jsx_runtime_1.jsx)(SmartLearningSystem_1.default, {})] }));
            case 'settings':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "Settings" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return setCurrentView('main'); }, className: "transition-all duration-300 hover:scale-105 ".concat(themeMode === 'dark'
                                        ? 'bg-slate-700 border-slate-500 text-white hover:bg-slate-600'
                                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'), children: "Back to Menu" })] }), (0, jsx_runtime_1.jsx)(ComprehensiveSettingsPanel_1.default, { onClose: function () { return setCurrentView('main'); } })] }));
            default:
                return renderMainMenu();
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("min-h-screen p-4 transition-all duration-700 relative overflow-hidden", "bg-gradient-to-br ".concat(getTimeGradient()), themeMode === 'dark' ? 'text-white' : 'text-gray-900', className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6 px-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [currentView !== 'main' && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return setCurrentView('main'); }, className: "transition-all duration-300 hover:scale-110 ".concat(themeMode === 'dark'
                                            ? 'text-white hover:bg-slate-700'
                                            : 'text-gray-900 hover:bg-gray-100'), "aria-label": "Back to main menu", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }) })), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold ".concat(themeMode === 'dark' ? 'text-white' : 'text-gray-900'), children: "OneType" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", onClick: toggleTheme, className: "transition-all duration-300 hover:scale-110 ".concat(themeMode === 'dark'
                                            ? 'text-white hover:bg-slate-700'
                                            : 'text-gray-900 hover:bg-gray-100'), "aria-label": themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', children: themeMode === 'dark' ? (0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { className: "h-5 w-5" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return setCurrentView('settings'); }, className: "transition-all duration-300 hover:scale-110 ".concat(themeMode === 'dark'
                                            ? 'text-white hover:bg-slate-700'
                                            : 'text-gray-900 hover:bg-gray-100'), "aria-label": "Open settings", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-5 w-5" }) })] })] }), renderCurrentView()] }), (0, jsx_runtime_1.jsx)("style", { children: "\n        @keyframes slideInUp {\n          from {\n            opacity: 0;\n            transform: translateY(30px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n\n        @keyframes fadeInUp {\n          from {\n            opacity: 0;\n            transform: translateY(20px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n\n        @keyframes float {\n          0%, 100% {\n            transform: translateY(0px);\n          }\n          50% {\n            transform: translateY(-20px);\n          }\n        }\n\n        .animate-slideInUp {\n          animation: slideInUp 0.6s ease-out;\n        }\n\n        .animate-fadeInUp {\n          animation: fadeInUp 0.8s ease-out;\n        }\n      " })] }));
};
exports.default = EnhancedMainMenu;
