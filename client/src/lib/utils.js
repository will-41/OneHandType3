"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocalStorage = exports.getLocalStorage = void 0;
exports.cn = cn;
var clsx_1 = require("clsx");
var tailwind_merge_1 = require("tailwind-merge");
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
var getLocalStorage = function (key) {
    return JSON.parse(window.localStorage.getItem(key) || "null");
};
exports.getLocalStorage = getLocalStorage;
var setLocalStorage = function (key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
};
exports.setLocalStorage = setLocalStorage;
