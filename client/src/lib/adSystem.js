"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adManager = exports.AdManager = void 0;
var AdManager = /** @class */ (function () {
    function AdManager() {
        this.currentLesson = null;
        this.adBreaksCompleted = new Set();
        this.totalRevenue = 0;
        this.adConfig = {
            totalAdTime: 300, // 5 minutes
            lessonDuration: 900, // 15 minutes
            breakIntervals: [180, 450, 720], // 3min, 7.5min, 12min into lesson
            revenueTarget: 0.25 // $0.25 per lesson
        };
    }
    // Strategic ad placement throughout lesson
    AdManager.prototype.getAdBreaksForLesson = function (lessonId) {
        return [
            {
                id: "".concat(lessonId, "-start"),
                duration: 60, // 1 minute warm-up ad
                type: 'video',
                priority: 'high',
                revenue: 0.05,
                placement: 'lesson-start'
            },
            {
                id: "".concat(lessonId, "-mid1"),
                duration: 90, // 1.5 minute mid-lesson break
                type: 'interstitial',
                priority: 'high',
                revenue: 0.08,
                placement: 'mid-lesson'
            },
            {
                id: "".concat(lessonId, "-mid2"),
                duration: 90, // 1.5 minute second break
                type: 'video',
                priority: 'medium',
                revenue: 0.07,
                placement: 'mid-lesson'
            },
            {
                id: "".concat(lessonId, "-end"),
                duration: 80, // 1.33 minute ending ad
                type: 'banner',
                priority: 'medium',
                revenue: 0.05,
                placement: 'lesson-end'
            }
        ];
    };
    // Calculate optimal ad timing to maximize revenue while maintaining user experience
    AdManager.prototype.calculateAdTiming = function (lessonProgress) {
        var progressSeconds = (lessonProgress / 100) * this.adConfig.lessonDuration;
        // Check if we've hit an ad break interval
        for (var _i = 0, _a = this.adConfig.breakIntervals; _i < _a.length; _i++) {
            var interval = _a[_i];
            var adBreakId = "".concat(this.currentLesson, "-").concat(interval);
            if (progressSeconds >= interval && !this.adBreaksCompleted.has(adBreakId)) {
                var adBreak = this.getAdBreakForInterval(interval);
                return { shouldShowAd: true, adBreak: adBreak };
            }
        }
        return { shouldShowAd: false };
    };
    AdManager.prototype.getAdBreakForInterval = function (interval) {
        if (interval <= 180) {
            return {
                id: "ad-".concat(interval),
                duration: 60,
                type: 'video',
                priority: 'high',
                revenue: 0.06,
                placement: 'lesson-start'
            };
        }
        else if (interval <= 450) {
            return {
                id: "ad-".concat(interval),
                duration: 90,
                type: 'interstitial',
                priority: 'high',
                revenue: 0.08,
                placement: 'mid-lesson'
            };
        }
        else {
            return {
                id: "ad-".concat(interval),
                duration: 90,
                type: 'video',
                priority: 'medium',
                revenue: 0.07,
                placement: 'mid-lesson'
            };
        }
    };
    // Track ad completion and revenue
    AdManager.prototype.markAdCompleted = function (adBreakId, revenue) {
        this.adBreaksCompleted.add(adBreakId);
        this.totalRevenue += revenue;
        // Store revenue data for analytics
        var revenueData = JSON.parse(localStorage.getItem('adRevenue') || '{"total": 0, "sessions": []}');
        revenueData.total += revenue;
        revenueData.sessions.push({
            adBreakId: adBreakId,
            revenue: revenue,
            timestamp: Date.now()
        });
        localStorage.setItem('adRevenue', JSON.stringify(revenueData));
    };
    // Start new lesson session
    AdManager.prototype.startLessonSession = function (lessonId) {
        this.currentLesson = lessonId;
        this.adBreaksCompleted.clear();
    };
    // Get revenue analytics
    AdManager.prototype.getRevenueAnalytics = function () {
        var stored = JSON.parse(localStorage.getItem('adRevenue') || '{"total": 0, "sessions": []}');
        return {
            totalRevenue: stored.total,
            sessionsToday: stored.sessions.filter(function (session) { return Date.now() - session.timestamp < 24 * 60 * 60 * 1000; }).length,
            averageRevenuePerLesson: stored.total / Math.max(stored.sessions.length, 1)
        };
    };
    // Check if user qualifies for premium (ad-free) upgrade
    AdManager.prototype.shouldShowPremiumOffer = function () {
        var analytics = this.getRevenueAnalytics();
        // Show premium offer after user has generated $5+ in ad revenue
        return analytics.totalRevenue >= 5.0;
    };
    return AdManager;
}());
exports.AdManager = AdManager;
exports.adManager = new AdManager();
