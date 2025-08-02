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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var card_1 = require("./ui/card");
var button_1 = require("./ui/button");
var badge_1 = require("./ui/badge");
var input_1 = require("./ui/input");
var textarea_1 = require("./ui/textarea");
var select_1 = require("./ui/select");
var label_1 = require("./ui/label");
var slider_1 = require("./ui/slider");
var switch_1 = require("./ui/switch");
var separator_1 = require("./ui/separator");
var utils_1 = require("../lib/utils");
var useTypingStore_1 = require("../lib/stores/useTypingStore");
var lucide_react_1 = require("lucide-react");
var LessonBuilder = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var onSave = _a.onSave, onClose = _a.onClose, existingLesson = _a.existingLesson, className = _a.className;
    var themeMode = (0, useTypingStore_1.useTypingStore)().themeMode;
    var _j = (0, react_1.useState)({
        id: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.id) || "custom-".concat(Date.now()),
        title: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.title) || '',
        description: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.description) || '',
        category: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.category) || 'basics',
        level: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.level) || 1,
        difficulty: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.difficulty) || 1,
        content: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.content) || '',
        targetWpm: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.targetWpm) || 15,
        timeLimit: existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.timeLimit,
        handCompatibility: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.handCompatibility) || ['left', 'right'],
        focusKeys: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.focusKeys) || [],
        prerequisites: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.prerequisites) || [],
        wordCount: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.wordCount) || 0,
        estimatedTime: (existingLesson === null || existingLesson === void 0 ? void 0 : existingLesson.estimatedTime) || 2
    }), lesson = _j[0], setLesson = _j[1];
    var _k = (0, react_1.useState)(false), previewMode = _k[0], setPreviewMode = _k[1];
    var _l = (0, react_1.useState)({}), errors = _l[0], setErrors = _l[1];
    var validateLesson = function () {
        var _a, _b, _c;
        var newErrors = {};
        if (!((_a = lesson.title) === null || _a === void 0 ? void 0 : _a.trim())) {
            newErrors.title = 'Title is required';
        }
        if (!((_b = lesson.description) === null || _b === void 0 ? void 0 : _b.trim())) {
            newErrors.description = 'Description is required';
        }
        if (!((_c = lesson.content) === null || _c === void 0 ? void 0 : _c.trim())) {
            newErrors.content = 'Lesson content is required';
        }
        if (lesson.content && lesson.content.length < 5) {
            newErrors.content = 'Content must be at least 5 characters long';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSave = function () {
        if (!validateLesson())
            return;
        var finalLesson = __assign(__assign({}, lesson), { id: lesson.id, title: lesson.title, description: lesson.description, category: lesson.category, level: lesson.level, difficulty: lesson.difficulty, content: lesson.content, text: lesson.content, targetWpm: lesson.targetWpm, handCompatibility: lesson.handCompatibility, wordCount: lesson.content.split(' ').length, estimatedTime: Math.max(1, Math.ceil(lesson.content.length / 50)) });
        onSave === null || onSave === void 0 ? void 0 : onSave(finalLesson);
    };
    var handleExport = function () {
        var _a;
        if (!validateLesson())
            return;
        var dataStr = JSON.stringify(lesson, null, 2);
        var dataBlob = new Blob([dataStr], { type: 'application/json' });
        var url = URL.createObjectURL(dataBlob);
        var link = document.createElement('a');
        link.href = url;
        link.download = "lesson-".concat((_a = lesson.title) === null || _a === void 0 ? void 0 : _a.replace(/\s+/g, '-').toLowerCase(), ".json");
        link.click();
        URL.revokeObjectURL(url);
    };
    var handleImport = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            try {
                var importedLesson = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                setLesson(importedLesson);
            }
            catch (error) {
                alert('Invalid lesson file format');
            }
        };
        reader.readAsText(file);
    };
    var resetLesson = function () {
        setLesson({
            id: "custom-".concat(Date.now()),
            title: '',
            description: '',
            category: 'basics',
            level: 1,
            difficulty: 1,
            content: '',
            targetWpm: 15,
            handCompatibility: ['left', 'right'],
            focusKeys: [],
            prerequisites: [],
            wordCount: 0,
            estimatedTime: 2
        });
        setErrors({});
    };
    var updateLesson = function (field, value) {
        setLesson(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        if (errors[field]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a)));
            });
        }
    };
    var addFocusKey = function (key) {
        var _a;
        if (key && !((_a = lesson.focusKeys) === null || _a === void 0 ? void 0 : _a.includes(key))) {
            updateLesson('focusKeys', __spreadArray(__spreadArray([], (lesson.focusKeys || []), true), [key], false));
        }
    };
    var removeFocusKey = function (key) {
        var _a;
        updateLesson('focusKeys', ((_a = lesson.focusKeys) === null || _a === void 0 ? void 0 : _a.filter(function (k) { return k !== key; })) || []);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("w-full max-w-4xl mx-auto space-y-6 p-6", themeMode === 'dark' ? 'text-white' : 'text-black', className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "h-6 w-6" }), "Custom Lesson Builder"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm opacity-75 mt-1", children: "Create personalized typing lessons for students and therapy sessions" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return setPreviewMode(!previewMode); }, className: "gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }), previewMode ? 'Edit' : 'Preview'] }), onClose && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: onClose, children: "Close" }))] })] }), previewMode ? (
            /* Preview Mode */
            (0, jsx_runtime_1.jsx)(card_1.Card, { className: "p-6 ".concat(themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'), children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold", children: lesson.title || 'Untitled Lesson' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: lesson.category }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", children: ["Level ", lesson.level] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: ["Difficulty ", lesson.difficulty, "/5"] })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "opacity-75", children: lesson.description || 'No description provided' }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [lesson.targetWpm, " WPM"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [lesson.estimatedTime, " min"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [(_b = lesson.handCompatibility) === null || _b === void 0 ? void 0 : _b.join(', '), " hand"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Gauge, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [((_c = lesson.content) === null || _c === void 0 ? void 0 : _c.split(' ').length) || 0, " words"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-lg border-2 ".concat(themeMode === 'dark' ? 'bg-slate-700 border-slate-500' : 'bg-gray-50 border-gray-300'), children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold mb-2", children: "Lesson Content:" }), (0, jsx_runtime_1.jsx)("p", { className: "font-mono text-lg leading-relaxed", children: lesson.content || 'No content provided' })] }), lesson.focusKeys && lesson.focusKeys.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold mb-2", children: "Focus Keys:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: lesson.focusKeys.map(function (key) { return ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "font-mono", children: key }, key)); }) })] }))] }) })) : (
            /* Edit Mode */
            (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6 ".concat(themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'), children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Basic Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "title", children: "Lesson Title *" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "title", value: lesson.title || '', onChange: function (e) { return updateLesson('title', e.target.value); }, placeholder: "e.g., Introduction to Home Row Keys", className: errors.title ? 'border-red-500' : '' }), errors.title && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-xs mt-1", children: errors.title })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "description", children: "Description *" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "description", value: lesson.description || '', onChange: function (e) { return updateLesson('description', e.target.value); }, placeholder: "Describe what this lesson teaches and its goals...", className: (0, utils_1.cn)("min-h-20", errors.description ? 'border-red-500' : '') }), errors.description && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-xs mt-1", children: errors.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "category", children: "Category" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: lesson.category, onValueChange: function (value) { return updateLesson('category', value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "basics", children: "Basics" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "words", children: "Words" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "sentences", children: "Sentences" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "advanced", children: "Advanced" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "level", children: "Level" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "level", type: "number", min: "1", max: "10", value: lesson.level || 1, onChange: function (e) { return updateLesson('level', parseInt(e.target.value) || 1); } })] })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6 ".concat(themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'), children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Performance Settings" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { children: ["Difficulty Level: ", lesson.difficulty, "/5"] }), (0, jsx_runtime_1.jsx)(slider_1.Slider, { value: [lesson.difficulty || 1], onValueChange: function (value) { return updateLesson('difficulty', value[0]); }, max: 5, min: 1, step: 1, className: "mt-2" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { children: ["Target WPM: ", lesson.targetWpm] }), (0, jsx_runtime_1.jsx)(slider_1.Slider, { value: [lesson.targetWpm || 15], onValueChange: function (value) { return updateLesson('targetWpm', value[0]); }, max: 100, min: 5, step: 5, className: "mt-2" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "timeLimit", children: "Time Limit (optional, in seconds)" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "timeLimit", type: "number", min: "30", value: lesson.timeLimit || '', onChange: function (e) { return updateLesson('timeLimit', e.target.value ? parseInt(e.target.value) : undefined); }, placeholder: "Leave empty for no time limit" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Hand Compatibility" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 mt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "left-hand", checked: ((_d = lesson.handCompatibility) === null || _d === void 0 ? void 0 : _d.includes('left')) || false, onCheckedChange: function (checked) {
                                                                    var current = lesson.handCompatibility || [];
                                                                    if (checked) {
                                                                        updateLesson('handCompatibility', __spreadArray(__spreadArray([], current.filter(function (h) { return h !== 'left'; }), true), ['left'], false));
                                                                    }
                                                                    else {
                                                                        updateLesson('handCompatibility', current.filter(function (h) { return h !== 'left'; }));
                                                                    }
                                                                } }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "left-hand", children: "Left Hand" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "right-hand", checked: ((_e = lesson.handCompatibility) === null || _e === void 0 ? void 0 : _e.includes('right')) || false, onCheckedChange: function (checked) {
                                                                    var current = lesson.handCompatibility || [];
                                                                    if (checked) {
                                                                        updateLesson('handCompatibility', __spreadArray(__spreadArray([], current.filter(function (h) { return h !== 'right'; }), true), ['right'], false));
                                                                    }
                                                                    else {
                                                                        updateLesson('handCompatibility', current.filter(function (h) { return h !== 'right'; }));
                                                                    }
                                                                } }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "right-hand", children: "Right Hand" })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-6 lg:col-span-2 ".concat(themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'), children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Lesson Content" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "content", children: "Text Content *" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "content", value: lesson.content || '', onChange: function (e) {
                                                    updateLesson('content', e.target.value);
                                                    updateLesson('wordCount', e.target.value.split(' ').length);
                                                    updateLesson('estimatedTime', Math.max(1, Math.ceil(e.target.value.length / 50)));
                                                }, placeholder: "Type the text that students will practice typing...", className: (0, utils_1.cn)("min-h-32 font-mono", errors.content ? 'border-red-500' : '') }), errors.content && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-xs mt-1", children: errors.content }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-xs opacity-60 mt-1", children: [(0, jsx_runtime_1.jsxs)("span", { children: [((_f = lesson.content) === null || _f === void 0 ? void 0 : _f.length) || 0, " characters"] }), (0, jsx_runtime_1.jsxs)("span", { children: [((_g = lesson.content) === null || _g === void 0 ? void 0 : _g.split(' ').length) || 0, " words"] }), (0, jsx_runtime_1.jsxs)("span", { children: ["~", Math.max(1, Math.ceil((((_h = lesson.content) === null || _h === void 0 ? void 0 : _h.length) || 0) / 50)), " min estimated"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "focus-keys", children: "Focus Keys (optional)" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { id: "focus-keys", placeholder: "Enter key (e.g., 'a', 'space', 'shift')", onKeyDown: function (e) {
                                                            if (e.key === 'Enter') {
                                                                addFocusKey(e.currentTarget.value);
                                                                e.currentTarget.value = '';
                                                            }
                                                        } }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "outline", onClick: function () {
                                                            var input = document.getElementById('focus-keys');
                                                            if (input.value) {
                                                                addFocusKey(input.value);
                                                                input.value = '';
                                                            }
                                                        }, children: "Add" })] }), lesson.focusKeys && lesson.focusKeys.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 mt-2", children: lesson.focusKeys.map(function (key) { return ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "cursor-pointer font-mono", onClick: function () { return removeFocusKey(key); }, children: [key, " \u00D7"] }, key)); }) }))] })] })] })] })), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: resetLesson, className: "gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "h-4 w-4" }), "Reset"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: handleExport, className: "gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4" }), "Export"] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".json", onChange: handleImport, style: { display: 'none' }, id: "import-lesson" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: function () { var _a; return (_a = document.getElementById('import-lesson')) === null || _a === void 0 ? void 0 : _a.click(); }, className: "gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-4 w-4" }), "Import"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [onClose && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: onClose, children: "Cancel" })), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleSave, className: "gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "h-4 w-4" }), "Save Lesson"] })] })] })] }));
};
exports.default = LessonBuilder;
