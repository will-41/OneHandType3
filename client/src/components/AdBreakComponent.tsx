import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Clock,
  DollarSign,
  Zap,
  Coffee,
  Star
} from 'lucide-react';
import { AdBreak } from '../lib/adSystem';

interface AdBreakComponentProps {
  adBreak: AdBreak;
  onAdCompleted: (revenue: number) => void;
  onSkip?: () => void;
  className?: string;
}

const AdBreakComponent: React.FC<AdBreakComponentProps> = ({
  adBreak,
  onAdCompleted,
  onSkip,
  className
}) => {
  const { themeMode } = useTypingStore();
  const [timeRemaining, setTimeRemaining] = useState(adBreak.duration);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        const progress = ((adBreak.duration - newTime) / adBreak.duration) * 100;
        setAdProgress(progress);

        if (newTime <= 0) {
          onAdCompleted(adBreak.revenue);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, adBreak.duration, adBreak.revenue, onAdCompleted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAdTypeIcon = () => {
    switch (adBreak.type) {
      case 'video': return <Play className="w-5 h-5" />;
      case 'banner': return <Star className="w-5 h-5" />;
      case 'interstitial': return <Zap className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getPlacementMessage = () => {
    switch (adBreak.placement) {
      case 'lesson-start': return 'Let\'s warm up with a quick break before your lesson!';
      case 'mid-lesson': return 'Perfect timing for a breather! Your fingers need this rest.';
      case 'lesson-end': return 'Great lesson! Time to relax before your next challenge.';
      case 'achievement': return 'Congratulations! You\'ve earned this celebration break.';
      default: return 'Taking a moment to recharge your typing energy!';
    }
  };

  const generateMockAdContent = () => {
    const adContents = [
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

  const mockAd = generateMockAdContent();

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      themeMode === 'dark' ? 'bg-black/80' : 'bg-white/80',
      className
    )}>
      <Card className={cn(
        "w-full max-w-2xl p-8 space-y-6",
        themeMode === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200',
        "backdrop-blur-lg"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getAdTypeIcon()}
            <div>
              <h3 className="text-xl font-bold">Quick Break Time!</h3>
              <p className={`text-sm ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {getPlacementMessage()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Ad Content */}
        <div className={cn(
          "p-6 rounded-lg text-center space-y-4",
          "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
        )}>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {mockAd.brand}
          </div>
          <h4 className="text-xl font-semibold">{mockAd.title}</h4>
          <p className={`${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {mockAd.description}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
            {mockAd.cta}
          </Button>
        </div>

        {/* Progress and Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatTime(timeRemaining)} remaining
            </span>
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              ${adBreak.revenue.toFixed(2)} earned
            </span>
          </div>
          
          <Progress value={adProgress} className="h-2" />
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2"
            >
              {isPlaying ? 'Pause' : 'Resume'}
            </Button>
            
            {onSkip && timeRemaining < 15 && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-blue-600 hover:text-blue-700"
              >
                Skip →
              </Button>
            )}
          </div>
        </div>

        {/* Fun Facts During Ad */}
        <div className={cn(
          "p-4 rounded-lg",
          "bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-700 dark:text-green-400">Did you know?</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-300">
            Regular typing breaks improve accuracy by 23% and reduce finger fatigue. You're building stronger muscle memory right now!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdBreakComponent;