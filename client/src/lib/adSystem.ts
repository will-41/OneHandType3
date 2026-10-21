export interface AdBreak {
  id: string;
  duration: number; // in seconds
  type: 'video' | 'banner' | 'interstitial';
  priority: 'high' | 'medium' | 'low';
  revenue: number; // estimated revenue per view
  placement: 'lesson-start' | 'mid-lesson' | 'lesson-end' | 'achievement';
}

export interface AdConfiguration {
  totalAdTime: number; // 300 seconds (5 minutes)
  lessonDuration: number; // 900 seconds (15 minutes)
  breakIntervals: number[]; // positions in lesson where ads play
  revenueTarget: number; // target revenue per lesson
}

export class AdManager {
  private adConfig: AdConfiguration;
  private currentLesson: string | null = null;
  private adBreaksCompleted: Set<string> = new Set();
  private totalRevenue: number = 0;

  constructor() {
    this.adConfig = {
      totalAdTime: 300, // 5 minutes
      lessonDuration: 900, // 15 minutes
      breakIntervals: [180, 450, 720], // 3min, 7.5min, 12min into lesson
      revenueTarget: 0.25 // $0.25 per lesson
    };
  }

  // Strategic ad placement throughout lesson
  getAdBreaksForLesson(lessonId: string): AdBreak[] {
    return [
      {
        id: `${lessonId}-start`,
        duration: 60, // 1 minute warm-up ad
        type: 'video',
        priority: 'high',
        revenue: 0.05,
        placement: 'lesson-start'
      },
      {
        id: `${lessonId}-mid1`,
        duration: 90, // 1.5 minute mid-lesson break
        type: 'interstitial',
        priority: 'high',
        revenue: 0.08,
        placement: 'mid-lesson'
      },
      {
        id: `${lessonId}-mid2`,
        duration: 90, // 1.5 minute second break
        type: 'video',
        priority: 'medium',
        revenue: 0.07,
        placement: 'mid-lesson'
      },
      {
        id: `${lessonId}-end`,
        duration: 80, // 1.33 minute ending ad
        type: 'banner',
        priority: 'medium',
        revenue: 0.05,
        placement: 'lesson-end'
      }
    ];
  }

  // Calculate optimal ad timing to maximize revenue while maintaining user experience
  calculateAdTiming(lessonProgress: number): { shouldShowAd: boolean; adBreak?: AdBreak } {
    const progressSeconds = (lessonProgress / 100) * this.adConfig.lessonDuration;
    
    // Check if we've hit an ad break interval
    for (const interval of this.adConfig.breakIntervals) {
      const adBreakId = `${this.currentLesson}-${interval}`;
      
      if (progressSeconds >= interval && !this.adBreaksCompleted.has(adBreakId)) {
        const adBreak = this.getAdBreakForInterval(interval);
        return { shouldShowAd: true, adBreak };
      }
    }
    
    return { shouldShowAd: false };
  }

  private getAdBreakForInterval(interval: number): AdBreak {
    if (interval <= 180) {
      return {
        id: `ad-${interval}`,
        duration: 60,
        type: 'video',
        priority: 'high',
        revenue: 0.06,
        placement: 'lesson-start'
      };
    } else if (interval <= 450) {
      return {
        id: `ad-${interval}`,
        duration: 90,
        type: 'interstitial',
        priority: 'high',
        revenue: 0.08,
        placement: 'mid-lesson'
      };
    } else {
      return {
        id: `ad-${interval}`,
        duration: 90,
        type: 'video',
        priority: 'medium',
        revenue: 0.07,
        placement: 'mid-lesson'
      };
    }
  }

  // Track ad completion and revenue
  markAdCompleted(adBreakId: string, revenue: number) {
    this.adBreaksCompleted.add(adBreakId);
    this.totalRevenue += revenue;
    
    // Store revenue data for analytics
    const revenueData = JSON.parse(localStorage.getItem('adRevenue') || '{"total": 0, "sessions": []}');
    revenueData.total += revenue;
    revenueData.sessions.push({
      adBreakId,
      revenue,
      timestamp: Date.now()
    });
    localStorage.setItem('adRevenue', JSON.stringify(revenueData));
  }

  // Start new lesson session
  startLessonSession(lessonId: string) {
    this.currentLesson = lessonId;
    this.adBreaksCompleted.clear();
  }

  // Get revenue analytics
  getRevenueAnalytics() {
    const stored = JSON.parse(localStorage.getItem('adRevenue') || '{"total": 0, "sessions": []}');
    return {
      totalRevenue: stored.total,
      sessionsToday: stored.sessions.filter(
        (session: any) => Date.now() - session.timestamp < 24 * 60 * 60 * 1000
      ).length,
      averageRevenuePerLesson: stored.total / Math.max(stored.sessions.length, 1)
    };
  }

  // Check if user qualifies for premium (ad-free) upgrade
  shouldShowPremiumOffer(): boolean {
    const analytics = this.getRevenueAnalytics();
    // Show premium offer after user has generated $5+ in ad revenue
    return analytics.totalRevenue >= 5.0;
  }
}

export const adManager = new AdManager();