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
exports.specializedLayouts = exports.keyboardLayouts = exports.availableLayouts = void 0;
exports.getKeyboardLayout = getKeyboardLayout;
exports.findKeyInLayout = findKeyInLayout;
exports.getFingerForKey = getFingerForKey;
exports.getOptimalFingerPositions = getOptimalFingerPositions;
exports.isSpecializedLayout = isSpecializedLayout;
exports.getSpecializedLayoutInfo = getSpecializedLayoutInfo;
exports.getChordMappings = getChordMappings;
exports.findChordForKeys = findChordForKeys;
exports.getErgonomicAnalysis = getErgonomicAnalysis;
exports.compareLayouts = compareLayouts;
exports.availableLayouts = [
    { id: 'qwerty', name: 'QWERTY', description: 'Standard English layout', region: 'US/UK' },
    // Specialized One-Hand Layouts
    {
        id: 'maltron',
        name: 'Maltron One-Hand',
        description: 'Ergonomic one-hand layout optimized for efficiency',
        region: 'US/UK',
        specialized: true,
        handPreference: 'both'
    },
    {
        id: 'dvorak-one-hand',
        name: 'Dvorak One-Hand',
        description: 'Single-hand optimized Dvorak layout',
        region: 'US',
        specialized: true,
        handPreference: 'both'
    },
    {
        id: 'artsey',
        name: 'ARTSEY Chorded',
        description: '8-key chorded layout for maximum portability',
        region: 'US',
        specialized: true,
        handPreference: 'both'
    },
    { id: 'dvorak', name: 'Dvorak', description: 'Optimized for English typing', region: 'US' },
    { id: 'colemak', name: 'Colemak', description: 'Modern efficient layout', region: 'International' },
    { id: 'azerty', name: 'AZERTY', description: 'French standard layout', region: 'France' },
    { id: 'qwertz', name: 'QWERTZ', description: 'German standard layout', region: 'Germany' },
];
// QWERTY Left-hand optimized keyboard layout (more realistic layout)
var qwertyLeftHandLayout = [
    [
        { key: '1', finger: 'pinky', row: 0, position: 0 },
        { key: '2', finger: 'ring', row: 0, position: 1 },
        { key: '3', finger: 'middle', row: 0, position: 2 },
        { key: '4', finger: 'index', row: 0, position: 3 },
        { key: '5', finger: 'index', row: 0, position: 4 },
        { key: '6', finger: 'index', row: 0, position: 5 },
    ],
    [
        { key: 'q', finger: 'pinky', row: 1, position: 0 },
        { key: 'w', finger: 'ring', row: 1, position: 1 },
        { key: 'e', finger: 'middle', row: 1, position: 2 },
        { key: 'r', finger: 'index', row: 1, position: 3 },
        { key: 't', finger: 'index', row: 1, position: 4 },
        { key: 'y', finger: 'index', row: 1, position: 5 },
    ],
    [
        { key: 'a', finger: 'pinky', row: 2, position: 0 },
        { key: 's', finger: 'ring', row: 2, position: 1 },
        { key: 'd', finger: 'middle', row: 2, position: 2 },
        { key: 'f', finger: 'index', row: 2, position: 3 },
        { key: 'g', finger: 'index', row: 2, position: 4 },
        { key: 'h', finger: 'index', row: 2, position: 5 },
    ],
    [
        { key: 'z', finger: 'pinky', row: 3, position: 0 },
        { key: 'x', finger: 'ring', row: 3, position: 1 },
        { key: 'c', finger: 'middle', row: 3, position: 2 },
        { key: 'v', finger: 'index', row: 3, position: 3 },
        { key: 'b', finger: 'index', row: 3, position: 4 },
        { key: 'n', finger: 'index', row: 3, position: 5 },
    ],
    [
        // L-shaped space bar positioned for left hand thumb reach
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
var qwertyRightHandLayout = [
    [
        { key: '5', finger: 'index', row: 0, position: 0 },
        { key: '6', finger: 'index', row: 0, position: 1 },
        { key: '7', finger: 'index', row: 0, position: 2 },
        { key: '8', finger: 'middle', row: 0, position: 3 },
        { key: '9', finger: 'ring', row: 0, position: 4 },
        { key: '0', finger: 'pinky', row: 0, position: 5 },
    ],
    [
        { key: 't', finger: 'index', row: 1, position: 0 },
        { key: 'y', finger: 'index', row: 1, position: 1 },
        { key: 'u', finger: 'index', row: 1, position: 2 },
        { key: 'i', finger: 'middle', row: 1, position: 3 },
        { key: 'o', finger: 'ring', row: 1, position: 4 },
        { key: 'p', finger: 'pinky', row: 1, position: 5 },
    ],
    [
        { key: 'g', finger: 'index', row: 2, position: 0 },
        { key: 'h', finger: 'index', row: 2, position: 1 },
        { key: 'j', finger: 'index', row: 2, position: 2 },
        { key: 'k', finger: 'middle', row: 2, position: 3 },
        { key: 'l', finger: 'ring', row: 2, position: 4 },
        { key: ';', finger: 'pinky', row: 2, position: 5 },
    ],
    [
        { key: 'b', finger: 'index', row: 3, position: 0 },
        { key: 'n', finger: 'index', row: 3, position: 1 },
        { key: 'm', finger: 'index', row: 3, position: 2 },
        { key: ',', finger: 'middle', row: 3, position: 3 },
        { key: '.', finger: 'ring', row: 3, position: 4 },
        { key: '/', finger: 'pinky', row: 3, position: 5 },
    ],
    [
        // L-shaped space bar positioned for right hand thumb reach
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 2 },
    ],
];
// Dvorak layouts
var dvorakLeftHandLayout = [
    [
        { key: '1', finger: 'pinky', row: 0, position: 0 },
        { key: '2', finger: 'ring', row: 0, position: 1 },
        { key: '3', finger: 'middle', row: 0, position: 2 },
        { key: '4', finger: 'index', row: 0, position: 3 },
        { key: '5', finger: 'index', row: 0, position: 4 },
    ],
    [
        { key: '\'', finger: 'pinky', row: 1, position: 0 },
        { key: ',', finger: 'ring', row: 1, position: 1 },
        { key: '.', finger: 'middle', row: 1, position: 2 },
        { key: 'p', finger: 'index', row: 1, position: 3 },
        { key: 'y', finger: 'index', row: 1, position: 4 },
    ],
    [
        { key: 'a', finger: 'pinky', row: 2, position: 0 },
        { key: 'o', finger: 'ring', row: 2, position: 1 },
        { key: 'e', finger: 'middle', row: 2, position: 2 },
        { key: 'u', finger: 'index', row: 2, position: 3 },
        { key: 'i', finger: 'index', row: 2, position: 4 },
    ],
    [
        { key: ';', finger: 'pinky', row: 3, position: 0 },
        { key: 'q', finger: 'ring', row: 3, position: 1 },
        { key: 'j', finger: 'middle', row: 3, position: 2 },
        { key: 'k', finger: 'index', row: 3, position: 3 },
        { key: 'x', finger: 'index', row: 3, position: 4 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
var dvorakRightHandLayout = [
    [
        { key: '6', finger: 'thumb', row: 0, position: 0 },
        { key: '7', finger: 'index', row: 0, position: 1 },
        { key: '8', finger: 'index', row: 0, position: 2 },
        { key: '9', finger: 'middle', row: 0, position: 3 },
        { key: '0', finger: 'ring', row: 0, position: 4 },
    ],
    [
        { key: 'f', finger: 'index', row: 1, position: 0 },
        { key: 'g', finger: 'index', row: 1, position: 1 },
        { key: 'c', finger: 'middle', row: 1, position: 2 },
        { key: 'r', finger: 'ring', row: 1, position: 3 },
        { key: 'l', finger: 'pinky', row: 1, position: 4 },
    ],
    [
        { key: 'd', finger: 'index', row: 2, position: 0 },
        { key: 'h', finger: 'index', row: 2, position: 1 },
        { key: 't', finger: 'middle', row: 2, position: 2 },
        { key: 'n', finger: 'ring', row: 2, position: 3 },
        { key: 's', finger: 'pinky', row: 2, position: 4 },
    ],
    [
        { key: 'b', finger: 'index', row: 3, position: 0 },
        { key: 'm', finger: 'index', row: 3, position: 1 },
        { key: 'w', finger: 'middle', row: 3, position: 2 },
        { key: 'v', finger: 'ring', row: 3, position: 3 },
        { key: 'z', finger: 'pinky', row: 3, position: 4 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
// Colemak layouts
var colemakLeftHandLayout = [
    [
        { key: '1', finger: 'pinky', row: 0, position: 0 },
        { key: '2', finger: 'ring', row: 0, position: 1 },
        { key: '3', finger: 'middle', row: 0, position: 2 },
        { key: '4', finger: 'index', row: 0, position: 3 },
        { key: '5', finger: 'index', row: 0, position: 4 },
    ],
    [
        { key: 'q', finger: 'pinky', row: 1, position: 0 },
        { key: 'w', finger: 'ring', row: 1, position: 1 },
        { key: 'f', finger: 'middle', row: 1, position: 2 },
        { key: 'p', finger: 'index', row: 1, position: 3 },
        { key: 'g', finger: 'index', row: 1, position: 4 },
    ],
    [
        { key: 'a', finger: 'pinky', row: 2, position: 0 },
        { key: 'r', finger: 'ring', row: 2, position: 1 },
        { key: 's', finger: 'middle', row: 2, position: 2 },
        { key: 't', finger: 'index', row: 2, position: 3 },
        { key: 'd', finger: 'index', row: 2, position: 4 },
    ],
    [
        { key: 'z', finger: 'pinky', row: 3, position: 0 },
        { key: 'x', finger: 'ring', row: 3, position: 1 },
        { key: 'c', finger: 'middle', row: 3, position: 2 },
        { key: 'v', finger: 'index', row: 3, position: 3 },
        { key: 'b', finger: 'index', row: 3, position: 4 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
var colemakRightHandLayout = [
    [
        { key: '6', finger: 'thumb', row: 0, position: 0 },
        { key: '7', finger: 'index', row: 0, position: 1 },
        { key: '8', finger: 'index', row: 0, position: 2 },
        { key: '9', finger: 'middle', row: 0, position: 3 },
        { key: '0', finger: 'ring', row: 0, position: 4 },
    ],
    [
        { key: 'j', finger: 'index', row: 1, position: 0 },
        { key: 'l', finger: 'index', row: 1, position: 1 },
        { key: 'u', finger: 'middle', row: 1, position: 2 },
        { key: 'y', finger: 'ring', row: 1, position: 3 },
        { key: ';', finger: 'pinky', row: 1, position: 4 },
    ],
    [
        { key: 'h', finger: 'index', row: 2, position: 0 },
        { key: 'n', finger: 'index', row: 2, position: 1 },
        { key: 'e', finger: 'middle', row: 2, position: 2 },
        { key: 'i', finger: 'ring', row: 2, position: 3 },
        { key: 'o', finger: 'pinky', row: 2, position: 4 },
    ],
    [
        { key: 'k', finger: 'index', row: 3, position: 0 },
        { key: 'm', finger: 'index', row: 3, position: 1 },
        { key: ',', finger: 'middle', row: 3, position: 2 },
        { key: '.', finger: 'ring', row: 3, position: 3 },
        { key: '/', finger: 'pinky', row: 3, position: 4 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
// AZERTY layouts (French)
var azertyLeftHandLayout = [
    [
        { key: '1', finger: 'pinky', row: 0, position: 0 },
        { key: '2', finger: 'ring', row: 0, position: 1 },
        { key: '3', finger: 'middle', row: 0, position: 2 },
        { key: '4', finger: 'index', row: 0, position: 3 },
        { key: '5', finger: 'index', row: 0, position: 4 },
    ],
    [
        { key: 'a', finger: 'pinky', row: 1, position: 0 },
        { key: 'z', finger: 'ring', row: 1, position: 1 },
        { key: 'e', finger: 'middle', row: 1, position: 2 },
        { key: 'r', finger: 'index', row: 1, position: 3 },
        { key: 't', finger: 'index', row: 1, position: 4 },
    ],
    [
        { key: 'q', finger: 'pinky', row: 2, position: 0 },
        { key: 's', finger: 'ring', row: 2, position: 1 },
        { key: 'd', finger: 'middle', row: 2, position: 2 },
        { key: 'f', finger: 'index', row: 2, position: 3 },
        { key: 'g', finger: 'index', row: 2, position: 4 },
    ],
    [
        { key: 'w', finger: 'pinky', row: 3, position: 0 },
        { key: 'x', finger: 'ring', row: 3, position: 1 },
        { key: 'c', finger: 'middle', row: 3, position: 2 },
        { key: 'v', finger: 'index', row: 3, position: 3 },
        { key: 'b', finger: 'index', row: 3, position: 4 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
var azertyRightHandLayout = [
    [
        { key: '6', finger: 'thumb', row: 0, position: 0 },
        { key: '7', finger: 'index', row: 0, position: 1 },
        { key: '8', finger: 'index', row: 0, position: 2 },
        { key: '9', finger: 'middle', row: 0, position: 3 },
        { key: '0', finger: 'ring', row: 0, position: 4 },
    ],
    [
        { key: 'y', finger: 'index', row: 1, position: 0 },
        { key: 'u', finger: 'index', row: 1, position: 1 },
        { key: 'i', finger: 'middle', row: 1, position: 2 },
        { key: 'o', finger: 'ring', row: 1, position: 3 },
        { key: 'p', finger: 'pinky', row: 1, position: 4 },
    ],
    [
        { key: 'h', finger: 'index', row: 2, position: 0 },
        { key: 'j', finger: 'index', row: 2, position: 1 },
        { key: 'k', finger: 'middle', row: 2, position: 2 },
        { key: 'l', finger: 'ring', row: 2, position: 3 },
        { key: 'm', finger: 'pinky', row: 2, position: 4 },
    ],
    [
        { key: 'n', finger: 'index', row: 3, position: 0 },
        { key: ',', finger: 'index', row: 3, position: 1 },
        { key: ';', finger: 'middle', row: 3, position: 2 },
        { key: ':', finger: 'ring', row: 3, position: 3 },
        { key: '!', finger: 'pinky', row: 3, position: 4 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
// QWERTZ layouts (German)
var qwertzLeftHandLayout = [
    [
        { key: '1', finger: 'pinky', row: 0, position: 0 },
        { key: '2', finger: 'ring', row: 0, position: 1 },
        { key: '3', finger: 'middle', row: 0, position: 2 },
        { key: '4', finger: 'index', row: 0, position: 3 },
        { key: '5', finger: 'index', row: 0, position: 4 },
    ],
    [
        { key: 'q', finger: 'pinky', row: 1, position: 0 },
        { key: 'w', finger: 'ring', row: 1, position: 1 },
        { key: 'e', finger: 'middle', row: 1, position: 2 },
        { key: 'r', finger: 'index', row: 1, position: 3 },
        { key: 't', finger: 'index', row: 1, position: 4 },
    ],
    [
        { key: 'a', finger: 'pinky', row: 2, position: 0 },
        { key: 's', finger: 'ring', row: 2, position: 1 },
        { key: 'd', finger: 'middle', row: 2, position: 2 },
        { key: 'f', finger: 'index', row: 2, position: 3 },
        { key: 'g', finger: 'index', row: 2, position: 4 },
    ],
    [
        { key: 'y', finger: 'pinky', row: 3, position: 0 },
        { key: 'x', finger: 'ring', row: 3, position: 1 },
        { key: 'c', finger: 'middle', row: 3, position: 2 },
        { key: 'v', finger: 'index', row: 3, position: 3 },
        { key: 'b', finger: 'index', row: 3, position: 4 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
var qwertzRightHandLayout = [
    [
        { key: '6', finger: 'thumb', row: 0, position: 0 },
        { key: '7', finger: 'index', row: 0, position: 1 },
        { key: '8', finger: 'index', row: 0, position: 2 },
        { key: '9', finger: 'middle', row: 0, position: 3 },
        { key: '0', finger: 'ring', row: 0, position: 4 },
    ],
    [
        { key: 'z', finger: 'index', row: 1, position: 0 },
        { key: 'u', finger: 'index', row: 1, position: 1 },
        { key: 'i', finger: 'middle', row: 1, position: 2 },
        { key: 'o', finger: 'ring', row: 1, position: 3 },
        { key: 'p', finger: 'pinky', row: 1, position: 4 },
    ],
    [
        { key: 'h', finger: 'index', row: 2, position: 0 },
        { key: 'j', finger: 'index', row: 2, position: 1 },
        { key: 'k', finger: 'middle', row: 2, position: 2 },
        { key: 'l', finger: 'ring', row: 2, position: 3 },
        { key: 'ö', finger: 'pinky', row: 2, position: 4 },
    ],
    [
        { key: 'n', finger: 'index', row: 3, position: 0 },
        { key: 'm', finger: 'index', row: 3, position: 1 },
        { key: ',', finger: 'middle', row: 3, position: 2 },
        { key: '.', finger: 'ring', row: 3, position: 3 },
        { key: '-', finger: 'pinky', row: 3, position: 4 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 0 },
    ],
];
// ============================================================================
// SPECIALIZED LAYOUTS - TOP 3 ONE-HANDED KEYBOARD ADAPTATIONS
// ============================================================================
// MALTRON LAYOUT - Ergonomic curved keyboard optimized for frequency and finger strength
// Based on English letter frequency analysis and natural finger movement
var maltronLeftHandLayout = [
    [
        // Number row - optimized for left hand reach
        { key: '1', finger: 'pinky', row: 0, position: 0, ergonomicScore: 7 },
        { key: '2', finger: 'pinky', row: 0, position: 1, ergonomicScore: 8 },
        { key: '3', finger: 'ring', row: 0, position: 2, ergonomicScore: 9 },
        { key: '4', finger: 'middle', row: 0, position: 3, ergonomicScore: 9 },
        { key: '5', finger: 'index', row: 0, position: 4, ergonomicScore: 10 },
    ],
    [
        // Top row - high frequency letters optimized for strong fingers
        { key: 'q', finger: 'pinky', row: 1, position: 0, ergonomicScore: 6 },
        { key: 'p', finger: 'ring', row: 1, position: 1, ergonomicScore: 8 }, // High frequency
        { key: 'y', finger: 'middle', row: 1, position: 2, ergonomicScore: 9 },
        { key: 'c', finger: 'index', row: 1, position: 3, ergonomicScore: 10 },
        { key: 'b', finger: 'index', row: 1, position: 4, ergonomicScore: 9 },
    ],
    [
        // Home row - most frequent letters under strongest fingers
        { key: 'a', finger: 'pinky', row: 2, position: 0, ergonomicScore: 9 }, // 2nd most frequent
        { key: 'n', finger: 'ring', row: 2, position: 1, ergonomicScore: 10 }, // Very frequent
        { key: 'i', finger: 'middle', row: 2, position: 2, ergonomicScore: 10 }, // 3rd most frequent
        { key: 's', finger: 'index', row: 2, position: 3, ergonomicScore: 10 }, // 4th most frequent
        { key: 'f', finger: 'index', row: 2, position: 4, ergonomicScore: 10 },
    ],
    [
        // Bottom row - less frequent letters and punctuation
        { key: ';', finger: 'pinky', row: 3, position: 0, ergonomicScore: 7 },
        { key: 'm', finger: 'ring', row: 3, position: 1, ergonomicScore: 8 },
        { key: 'w', finger: 'middle', row: 3, position: 2, ergonomicScore: 8 },
        { key: 'v', finger: 'index', row: 3, position: 3, ergonomicScore: 9 },
        { key: 'z', finger: 'index', row: 3, position: 4, ergonomicScore: 8 },
    ],
    [
        // Thumb row - space and modifier keys
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 2, ergonomicScore: 10 },
    ],
];
var maltronRightHandLayout = [
    [
        // Number row - mirrored for right hand
        { key: '6', finger: 'index', row: 0, position: 0, ergonomicScore: 10 },
        { key: '7', finger: 'middle', row: 0, position: 1, ergonomicScore: 9 },
        { key: '8', finger: 'ring', row: 0, position: 2, ergonomicScore: 9 },
        { key: '9', finger: 'pinky', row: 0, position: 3, ergonomicScore: 8 },
        { key: '0', finger: 'pinky', row: 0, position: 4, ergonomicScore: 7 },
    ],
    [
        // Top row - optimized for right hand strong fingers
        { key: 'j', finger: 'index', row: 1, position: 0, ergonomicScore: 9 },
        { key: 'd', finger: 'middle', row: 1, position: 1, ergonomicScore: 10 },
        { key: 'l', finger: 'ring', row: 1, position: 2, ergonomicScore: 9 },
        { key: 'k', finger: 'pinky', row: 1, position: 3, ergonomicScore: 8 },
        { key: 'x', finger: 'pinky', row: 1, position: 4, ergonomicScore: 6 },
    ],
    [
        // Home row - most frequent letters for right hand
        { key: 'h', finger: 'index', row: 2, position: 0, ergonomicScore: 10 },
        { key: 't', finger: 'middle', row: 2, position: 1, ergonomicScore: 10 }, // Most frequent
        { key: 'e', finger: 'ring', row: 2, position: 2, ergonomicScore: 10 }, // Most frequent vowel
        { key: 'o', finger: 'pinky', row: 2, position: 3, ergonomicScore: 9 }, // Frequent vowel
        { key: 'u', finger: 'pinky', row: 2, position: 4, ergonomicScore: 8 },
    ],
    [
        // Bottom row - less frequent letters
        { key: 'g', finger: 'index', row: 3, position: 0, ergonomicScore: 9 },
        { key: 'r', finger: 'middle', row: 3, position: 1, ergonomicScore: 9 }, // Frequent
        { key: ',', finger: 'ring', row: 3, position: 2, ergonomicScore: 8 },
        { key: '.', finger: 'pinky', row: 3, position: 3, ergonomicScore: 7 },
        { key: '/', finger: 'pinky', row: 3, position: 4, ergonomicScore: 6 },
    ],
    [
        // Thumb row
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 2, ergonomicScore: 10 },
    ],
];
// DVORAK ONE-HAND LAYOUTS - Official single-hand Dvorak adaptations
// Optimized for maximum efficiency with one hand
var dvorakOneHandLeftLayout = [
    [
        // Number row
        { key: '1', finger: 'pinky', row: 0, position: 0, ergonomicScore: 7 },
        { key: '2', finger: 'ring', row: 0, position: 1, ergonomicScore: 8 },
        { key: '3', finger: 'middle', row: 0, position: 2, ergonomicScore: 9 },
        { key: '4', finger: 'index', row: 0, position: 3, ergonomicScore: 10 },
        { key: '5', finger: 'index', row: 0, position: 4, ergonomicScore: 9 },
    ],
    [
        // Top row - vowels and frequent consonants for left hand
        { key: '\'', finger: 'pinky', row: 1, position: 0, ergonomicScore: 6 },
        { key: ',', finger: 'ring', row: 1, position: 1, ergonomicScore: 8 },
        { key: '.', finger: 'middle', row: 1, position: 2, ergonomicScore: 9 },
        { key: 'p', finger: 'index', row: 1, position: 3, ergonomicScore: 10 },
        { key: 'y', finger: 'index', row: 1, position: 4, ergonomicScore: 9 },
    ],
    [
        // Home row - optimized for left hand Dvorak
        { key: 'a', finger: 'pinky', row: 2, position: 0, ergonomicScore: 9 },
        { key: 'o', finger: 'ring', row: 2, position: 1, ergonomicScore: 10 },
        { key: 'e', finger: 'middle', row: 2, position: 2, ergonomicScore: 10 },
        { key: 'u', finger: 'index', row: 2, position: 3, ergonomicScore: 10 },
        { key: 'i', finger: 'index', row: 2, position: 4, ergonomicScore: 10 },
    ],
    [
        // Bottom row
        { key: ';', finger: 'pinky', row: 3, position: 0, ergonomicScore: 7 },
        { key: 'q', finger: 'ring', row: 3, position: 1, ergonomicScore: 8 },
        { key: 'j', finger: 'middle', row: 3, position: 2, ergonomicScore: 8 },
        { key: 'k', finger: 'index', row: 3, position: 3, ergonomicScore: 9 },
        { key: 'x', finger: 'index', row: 3, position: 4, ergonomicScore: 8 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 2, ergonomicScore: 10 },
    ],
];
var dvorakOneHandRightLayout = [
    [
        // Number row
        { key: '6', finger: 'index', row: 0, position: 0, ergonomicScore: 9 },
        { key: '7', finger: 'index', row: 0, position: 1, ergonomicScore: 10 },
        { key: '8', finger: 'middle', row: 0, position: 2, ergonomicScore: 9 },
        { key: '9', finger: 'ring', row: 0, position: 3, ergonomicScore: 8 },
        { key: '0', finger: 'pinky', row: 0, position: 4, ergonomicScore: 7 },
    ],
    [
        // Top row - right hand Dvorak optimization
        { key: 'f', finger: 'index', row: 1, position: 0, ergonomicScore: 10 },
        { key: 'g', finger: 'index', row: 1, position: 1, ergonomicScore: 9 },
        { key: 'c', finger: 'middle', row: 1, position: 2, ergonomicScore: 9 },
        { key: 'r', finger: 'ring', row: 1, position: 3, ergonomicScore: 8 },
        { key: 'l', finger: 'pinky', row: 1, position: 4, ergonomicScore: 7 },
    ],
    [
        // Home row - frequent letters under strong fingers
        { key: 'd', finger: 'index', row: 2, position: 0, ergonomicScore: 10 },
        { key: 'h', finger: 'index', row: 2, position: 1, ergonomicScore: 10 },
        { key: 't', finger: 'middle', row: 2, position: 2, ergonomicScore: 10 },
        { key: 'n', finger: 'ring', row: 2, position: 3, ergonomicScore: 9 },
        { key: 's', finger: 'pinky', row: 2, position: 4, ergonomicScore: 8 },
    ],
    [
        // Bottom row
        { key: 'b', finger: 'index', row: 3, position: 0, ergonomicScore: 9 },
        { key: 'm', finger: 'index', row: 3, position: 1, ergonomicScore: 9 },
        { key: 'w', finger: 'middle', row: 3, position: 2, ergonomicScore: 8 },
        { key: 'v', finger: 'ring', row: 3, position: 3, ergonomicScore: 7 },
        { key: 'z', finger: 'pinky', row: 3, position: 4, ergonomicScore: 6 },
    ],
    [
        { key: ' ', displayKey: 'Space', finger: 'thumb', row: 4, position: 2, ergonomicScore: 10 },
    ],
];
// ARTSEY LAYOUT - 8-key chord-based system for maximum accessibility
// Each hand uses 4 core keys (A, R, T, S) + 4 modifier positions
var artseyLeftHandLayout = [
    [
        // Row 1: Core ARTSEY keys for left hand
        { key: 'a', finger: 'middle', row: 0, position: 0, ergonomicScore: 10, chordKeys: ['a'] },
        { key: 'r', finger: 'index', row: 0, position: 1, ergonomicScore: 10, chordKeys: ['r'] },
    ],
    [
        // Row 2: Remaining core keys
        { key: 't', finger: 'middle', row: 1, position: 0, ergonomicScore: 10, chordKeys: ['t'] },
        { key: 's', finger: 'index', row: 1, position: 1, ergonomicScore: 10, chordKeys: ['s'] },
    ],
    [
        // Row 3: Modifier keys for extended functionality
        { key: 'e', finger: 'ring', row: 2, position: 0, ergonomicScore: 9, chordKeys: ['e'], isModifier: true },
        { key: 'y', finger: 'pinky', row: 2, position: 1, ergonomicScore: 8, chordKeys: ['y'], isModifier: true },
    ],
    [
        // Row 4: Additional modifiers
        { key: 'o', finger: 'ring', row: 3, position: 0, ergonomicScore: 9, chordKeys: ['o'], isModifier: true },
        { key: 'i', finger: 'pinky', row: 3, position: 1, ergonomicScore: 8, chordKeys: ['i'], isModifier: true },
    ],
];
var artseyRightHandLayout = [
    [
        // Row 1: Core ARTSEY keys mirrored for right hand
        { key: 'r', finger: 'index', row: 0, position: 0, ergonomicScore: 10, chordKeys: ['r'] },
        { key: 'a', finger: 'middle', row: 0, position: 1, ergonomicScore: 10, chordKeys: ['a'] },
    ],
    [
        // Row 2: Remaining core keys
        { key: 's', finger: 'index', row: 1, position: 0, ergonomicScore: 10, chordKeys: ['s'] },
        { key: 't', finger: 'middle', row: 1, position: 1, ergonomicScore: 10, chordKeys: ['t'] },
    ],
    [
        // Row 3: Modifier keys for right hand
        { key: 'y', finger: 'pinky', row: 2, position: 0, ergonomicScore: 8, chordKeys: ['y'], isModifier: true },
        { key: 'e', finger: 'ring', row: 2, position: 1, ergonomicScore: 9, chordKeys: ['e'], isModifier: true },
    ],
    [
        // Row 4: Additional modifiers
        { key: 'i', finger: 'pinky', row: 3, position: 0, ergonomicScore: 8, chordKeys: ['i'], isModifier: true },
        { key: 'o', finger: 'ring', row: 3, position: 1, ergonomicScore: 9, chordKeys: ['o'], isModifier: true },
    ],
];
// ARTSEY Chord Mappings - Common letter combinations
var artseyChordMappings = [
    // Single keys (base letters)
    { keys: ['a'], output: 'a', description: 'Letter A', frequency: 8.12 },
    { keys: ['r'], output: 'r', description: 'Letter R', frequency: 5.99 },
    { keys: ['t'], output: 't', description: 'Letter T', frequency: 9.10 },
    { keys: ['s'], output: 's', description: 'Letter S', frequency: 6.28 },
    // Two-key combinations
    { keys: ['a', 'r'], output: 'e', description: 'Letter E', frequency: 12.70 },
    { keys: ['a', 't'], output: 'n', description: 'Letter N', frequency: 6.75 },
    { keys: ['a', 's'], output: 'i', description: 'Letter I', frequency: 6.97 },
    { keys: ['r', 't'], output: 'o', description: 'Letter O', frequency: 7.51 },
    { keys: ['r', 's'], output: 'h', description: 'Letter H', frequency: 6.09 },
    { keys: ['t', 's'], output: 'l', description: 'Letter L', frequency: 4.03 },
    // Three-key combinations
    { keys: ['a', 'r', 't'], output: 'd', description: 'Letter D', frequency: 4.25 },
    { keys: ['a', 'r', 's'], output: 'c', description: 'Letter C', frequency: 2.78 },
    { keys: ['a', 't', 's'], output: 'u', description: 'Letter U', frequency: 2.76 },
    { keys: ['r', 't', 's'], output: 'm', description: 'Letter M', frequency: 2.41 },
    // Four-key combination
    { keys: ['a', 'r', 't', 's'], output: ' ', description: 'Space', frequency: 20.0 },
    // Common punctuation
    { keys: ['e', 'a'], output: '.', description: 'Period', frequency: 5.0 },
    { keys: ['e', 'r'], output: ',', description: 'Comma', frequency: 4.0 },
    { keys: ['e', 't'], output: '?', description: 'Question Mark', frequency: 1.0 },
    { keys: ['e', 's'], output: '!', description: 'Exclamation', frequency: 1.0 },
    // Numbers (using modifier combinations)
    { keys: ['y', 'a'], output: '1', description: 'Number 1', frequency: 0.5 },
    { keys: ['y', 'r'], output: '2', description: 'Number 2', frequency: 0.5 },
    { keys: ['y', 't'], output: '3', description: 'Number 3', frequency: 0.5 },
    { keys: ['y', 's'], output: '4', description: 'Number 4', frequency: 0.5 },
    { keys: ['y', 'a', 'r'], output: '5', description: 'Number 5', frequency: 0.5 },
];
exports.keyboardLayouts = {
    qwerty: {
        leftHand: qwertyLeftHandLayout,
        rightHand: qwertyRightHandLayout,
    },
    dvorak: {
        leftHand: dvorakLeftHandLayout,
        rightHand: dvorakRightHandLayout,
    },
    colemak: {
        leftHand: colemakLeftHandLayout,
        rightHand: colemakRightHandLayout,
    },
    azerty: {
        leftHand: azertyLeftHandLayout,
        rightHand: azertyRightHandLayout,
    },
    qwertz: {
        leftHand: qwertzLeftHandLayout,
        rightHand: qwertzRightHandLayout,
    },
    maltron: {
        leftHand: maltronLeftHandLayout,
        rightHand: maltronRightHandLayout,
    },
    'dvorak-one-hand': {
        leftHand: dvorakOneHandLeftLayout,
        rightHand: dvorakOneHandRightLayout,
    },
    artsey: {
        leftHand: artseyLeftHandLayout,
        rightHand: artseyRightHandLayout,
    },
};
// Specialized layout configurations with ergonomic profiles
exports.specializedLayouts = {
    maltron: {
        layout: maltronLeftHandLayout, // Default to left hand, will be selected based on preference
        ergonomicProfile: {
            handStrain: 2, // Very low strain due to frequency optimization
            fingerBalance: 9, // Excellent balance across fingers
            reachComfort: 8, // High comfort with natural finger positions
            commonBigramScore: 9, // Optimized for English bigrams
            recommendedForConditions: [
                'RSI (Repetitive Strain Injury)',
                'Carpal tunnel syndrome',
                'Finger strength imbalance',
                'Professional typing',
                'Long typing sessions'
            ]
        },
        learningCurve: 'moderate',
        efficiency: 9
    },
    'dvorak-one-hand': {
        layout: dvorakOneHandLeftLayout,
        ergonomicProfile: {
            handStrain: 3, // Low strain with optimized vowel placement
            fingerBalance: 8, // Good balance, slightly favors stronger fingers
            reachComfort: 9, // Excellent comfort with single-hand optimization
            commonBigramScore: 8, // Very good for common English patterns
            recommendedForConditions: [
                'Single-hand typing requirements',
                'Hemiplegia',
                'Temporary hand injury',
                'Dvorak users wanting one-hand efficiency',
                'Gaming while typing'
            ]
        },
        learningCurve: 'challenging',
        efficiency: 8
    },
    artsey: {
        layout: artseyLeftHandLayout,
        chordMappings: artseyChordMappings,
        ergonomicProfile: {
            handStrain: 1, // Minimal strain - only 8 keys total
            fingerBalance: 10, // Perfect balance with 4 fingers
            reachComfort: 10, // Maximum comfort - minimal movement
            commonBigramScore: 7, // Good but requires chord combinations
            recommendedForConditions: [
                'Severe mobility limitations',
                'Spinal cord injuries',
                'Amputees',
                'Muscular dystrophy',
                'Multiple sclerosis',
                'ALS',
                'Minimal hand function',
                'Switch-based input needs'
            ]
        },
        learningCurve: 'challenging',
        efficiency: 7
    }
};
function getKeyboardLayout(handPreference, layoutType) {
    if (layoutType === void 0) { layoutType = 'qwerty'; }
    var layouts = exports.keyboardLayouts;
    return layouts[layoutType][handPreference === 'left' ? 'leftHand' : 'rightHand'];
}
function findKeyInLayout(layout, key) {
    for (var _i = 0, layout_1 = layout; _i < layout_1.length; _i++) {
        var row = layout_1[_i];
        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
            var keyData = row_1[_a];
            if (keyData.key === key || keyData.displayKey === key) {
                return keyData;
            }
        }
    }
    return null;
}
function getFingerForKey(handPreference, key, layoutType) {
    if (layoutType === void 0) { layoutType = 'qwerty'; }
    var layout = getKeyboardLayout(handPreference, layoutType);
    var keyData = findKeyInLayout(layout, key);
    return (keyData === null || keyData === void 0 ? void 0 : keyData.finger) || null;
}
function getOptimalFingerPositions(handPreference, layoutType) {
    if (layoutType === void 0) { layoutType = 'qwerty'; }
    var layout = getKeyboardLayout(handPreference, layoutType);
    var fingerMap = {
        pinky: [],
        ring: [],
        middle: [],
        index: [],
        thumb: []
    };
    layout.forEach(function (row) {
        row.forEach(function (key) {
            if (key.finger && fingerMap[key.finger]) {
                fingerMap[key.finger].push(key.key);
            }
        });
    });
    return fingerMap;
}
// ============================================================================
// SPECIALIZED LAYOUT UTILITIES
// ============================================================================
function isSpecializedLayout(layoutType) {
    return ['maltron', 'dvorak-one-hand', 'artsey'].includes(layoutType);
}
function getSpecializedLayoutInfo(layoutType) {
    return exports.specializedLayouts[layoutType];
}
function getChordMappings(layoutType) {
    return exports.specializedLayouts[layoutType].chordMappings;
}
function findChordForKeys(keys, layoutType) {
    if (layoutType === void 0) { layoutType = 'artsey'; }
    var chordMappings = getChordMappings(layoutType);
    if (!chordMappings)
        return null;
    // Sort keys to ensure consistent matching
    var sortedKeys = keys.sort();
    return chordMappings.find(function (mapping) {
        var mappingSorted = mapping.keys.sort();
        return mappingSorted.length === sortedKeys.length &&
            mappingSorted.every(function (key, index) { return key === sortedKeys[index]; });
    }) || null;
}
function getErgonomicAnalysis(handPreference, layoutType, text) {
    var layout = getKeyboardLayout(handPreference, layoutType);
    var totalScore = 0;
    var validKeys = 0;
    var fingerUsage = {
        pinky: 0, ring: 0, middle: 0, index: 0, thumb: 0
    };
    var strainPoints = [];
    // Analyze each character in the text
    for (var _i = 0, _a = text.toLowerCase(); _i < _a.length; _i++) {
        var char = _a[_i];
        var keyData = findKeyInLayout(layout, char);
        if (keyData) {
            validKeys++;
            // Add to ergonomic score
            if (keyData.ergonomicScore) {
                totalScore += keyData.ergonomicScore;
                // Flag potential strain points (low ergonomic scores)
                if (keyData.ergonomicScore < 7) {
                    strainPoints.push("Key '".concat(char, "' (score: ").concat(keyData.ergonomicScore, ")"));
                }
            }
            // Track finger usage
            if (keyData.finger) {
                fingerUsage[keyData.finger]++;
            }
        }
    }
    // Calculate reach distance (simplified - based on row positions)
    var totalReach = 0;
    var prevRow = -1;
    for (var _b = 0, _c = text.toLowerCase(); _b < _c.length; _b++) {
        var char = _c[_b];
        var keyData = findKeyInLayout(layout, char);
        if (keyData && prevRow !== -1) {
            totalReach += Math.abs(keyData.row - prevRow);
        }
        if (keyData)
            prevRow = keyData.row;
    }
    return {
        averageErgonomicScore: validKeys > 0 ? totalScore / validKeys : 0,
        fingerUsageDistribution: fingerUsage,
        reachDistance: totalReach,
        strainPoints: __spreadArray([], new Set(strainPoints), true) // Remove duplicates
    };
}
function compareLayouts(text, handPreference, layouts) {
    return layouts.map(function (layout) { return ({
        layout: layout,
        analysis: getErgonomicAnalysis(handPreference, layout, text),
        specializedInfo: isSpecializedLayout(layout) ? getSpecializedLayoutInfo(layout) : undefined
    }); });
}
