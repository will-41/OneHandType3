import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Share2, 
  Trophy, 
  Zap, 
  Target, 
  Copy, 
  Download,
  Camera,
  Medal,
  Award,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  stats: {
    wpm?: number;
    accuracy?: number;
    timeSpent?: number;
    streak?: number;
  };
}

interface SocialSharingProps {
  achievement?: Achievement;
  sessionStats?: {
    wpm: number;
    accuracy: number;
    timeSpent: number;
    lessonCompleted: string;
  };
  className?: string;
}

const SocialSharing: React.FC<SocialSharingProps> = ({ 
  achievement, 
  sessionStats,
  className 
}) => {
  const { themeMode, stats, handPreference } = useTypingStore();
  const [isSharing, setIsSharing] = useState(false);
  const [shareFormat, setShareFormat] = useState<'text' | 'image' | 'card'>('card');

  // Mock achievements for demonstration
  const mockAchievements: Achievement[] = [
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Reached 50 WPM!',
      icon: <Zap className="h-6 w-6" />,
      rarity: 'epic',
      unlockedAt: new Date(),
      stats: { wpm: 52, accuracy: 94 }
    },
    {
      id: 'accuracy_master',
      title: 'Accuracy Master',
      description: 'Maintained 98% accuracy for 10 lessons',
      icon: <Target className="h-6 w-6" />,
      rarity: 'rare',
      unlockedAt: new Date(),
      stats: { accuracy: 98, streak: 10 }
    },
    {
      id: 'marathon_typist',
      title: 'Marathon Typist',
      description: 'Typed for 2 hours straight!',
      icon: <Clock className="h-6 w-6" />,
      rarity: 'legendary',
      unlockedAt: new Date(),
      stats: { timeSpent: 120 }
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 border-gray-500';
      case 'rare': return 'text-blue-500 border-blue-500';
      case 'epic': return 'text-purple-500 border-purple-500';
      case 'legendary': return 'text-yellow-500 border-yellow-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const generateShareText = (item: Achievement | typeof sessionStats) => {
    if (item && 'title' in item) {
      // Achievement sharing
      return `🏆 Just unlocked "${item.title}" in OneType! 
${item.description}
${item.stats.wpm ? `⚡ ${item.stats.wpm} WPM` : ''}
${item.stats.accuracy ? `🎯 ${item.stats.accuracy}% accuracy` : ''}
${item.stats.streak ? `🔥 ${item.stats.streak} lesson streak` : ''}

#OneType #TypingChallenge #AccessibleTech #OneHandedTyping`;
    } else if (item) {
      // Session stats sharing
      return `📊 Great typing session on OneType!
⚡ Speed: ${item.wpm} WPM
🎯 Accuracy: ${item.accuracy}%
⏱️ Time: ${Math.round(item.timeSpent)} minutes
📚 Completed: ${item.lessonCompleted}

Improving my ${handPreference}-hand typing skills! 💪

#OneType #TypingProgress #AccessibleTech #TypingSkills`;
    }
    return '';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadShareCard = (item: Achievement | typeof sessionStats) => {
    // Create a canvas element to generate the share card
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    if (themeMode === 'dark') {
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
    } else {
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1d4ed8');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // OneType branding
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OneType', 400, 80);
    
    ctx.font = '24px Arial';
    ctx.fillText('One-Handed Typing Mastery', 400, 120);

    if (item && 'title' in item) {
      // Achievement card
      ctx.font = 'bold 36px Arial';
      ctx.fillText('🏆 Achievement Unlocked!', 400, 200);
      
      ctx.font = 'bold 42px Arial';
      ctx.fillText(item.title, 400, 280);
      
      ctx.font = '28px Arial';
      ctx.fillText(item.description, 400, 330);
      
      // Stats
      let yPos = 400;
      if (item.stats.wpm) {
        ctx.fillText(`⚡ ${item.stats.wpm} WPM`, 400, yPos);
        yPos += 40;
      }
      if (item.stats.accuracy) {
        ctx.fillText(`🎯 ${item.stats.accuracy}% Accuracy`, 400, yPos);
        yPos += 40;
      }
      
      // Rarity
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`${item.rarity.toUpperCase()} ACHIEVEMENT`, 400, yPos + 20);
    } else if (item) {
      // Session stats card
      ctx.font = 'bold 36px Arial';
      ctx.fillText('📊 Typing Session Complete!', 400, 200);
      
      // Stats in a grid
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'left';
      
      ctx.fillText(`⚡ Speed: ${item.wpm} WPM`, 120, 280);
      ctx.fillText(`🎯 Accuracy: ${item.accuracy}%`, 450, 280);
      
      ctx.fillText(`⏱️ Time: ${Math.round(item.timeSpent)}m`, 120, 340);
      ctx.fillText(`📚 Lesson: ${item.lessonCompleted.slice(0, 15)}...`, 450, 340);
      
      ctx.textAlign = 'center';
      ctx.font = '24px Arial';
      ctx.fillText(`${handPreference.charAt(0).toUpperCase() + handPreference.slice(1)}-hand typing progress!`, 400, 420);
    }

    // Footer
    ctx.font = '20px Arial';
    ctx.fillText('Join the one-handed typing revolution!', 400, 520);
    ctx.fillText('#OneType #AccessibleTech', 400, 550);

    // Download the image
    const link = document.createElement('a');
    link.download = `onetype-${item && 'title' in item ? 'achievement' : 'session'}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareToSocial = (platform: string, text: string) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent('https://onetype.app'); // Replace with actual URL
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const ShareDialog = ({ item, trigger }: { item: Achievement | typeof sessionStats; trigger: React.ReactNode }) => (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={`max-w-2xl ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Progress
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="flex gap-2">
            {(['text', 'image', 'card'] as const).map((format) => (
              <Button
                key={format}
                variant={shareFormat === format ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShareFormat(format)}
                className="capitalize"
              >
                {format === 'text' && <Copy className="h-4 w-4 mr-1" />}
                {format === 'image' && <Camera className="h-4 w-4 mr-1" />}
                {format === 'card' && <Download className="h-4 w-4 mr-1" />}
                {format}
              </Button>
            ))}
          </div>

          {shareFormat === 'text' && (
            <div>
              <label className="block text-sm font-medium mb-2">Share Text:</label>
              <div className={`p-4 rounded-lg border text-sm font-mono whitespace-pre-wrap ${
                themeMode === 'dark' ? 'bg-slate-700 border-slate-500' : 'bg-gray-50 border-gray-300'
              }`}>
                {generateShareText(item)}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => copyToClipboard(generateShareText(item))}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Text
                </Button>
              </div>
            </div>
          )}

          {shareFormat === 'card' && (
            <div>
              <label className="block text-sm font-medium mb-2">Download Share Card:</label>
              <div className={`p-6 rounded-lg border text-center ${
                themeMode === 'dark' ? 'bg-slate-700 border-slate-500' : 'bg-gray-50 border-gray-300'
              }`}>
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm opacity-75 mb-4">
                  Generate a beautiful card image to share on social media
                </p>
                <Button onClick={() => downloadShareCard(item)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download Card
                </Button>
              </div>
            </div>
          )}

          {/* Social Platform Buttons */}
          <div>
            <label className="block text-sm font-medium mb-3">Share directly to:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('twitter', generateShareText(item))}
                className="justify-start"
              >
                🐦 Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('facebook', generateShareText(item))}
                className="justify-start"
              >
                📘 Facebook
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('linkedin', generateShareText(item))}
                className="justify-start"
              >
                💼 LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('reddit', generateShareText(item))}
                className="justify-start"
              >
                🤖 Reddit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Achievement Sharing */}
      {achievement && (
        <Card className={`p-6 border-2 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'} ${getRarityColor(achievement.rarity)}`}>
          <div className="text-center space-y-4">
            <div className="text-4xl">🏆</div>
            <div>
              <h3 className="text-xl font-bold">{achievement.title}</h3>
              <p className="text-sm opacity-75">{achievement.description}</p>
              <Badge variant="outline" className={`mt-2 ${getRarityColor(achievement.rarity)}`}>
                {achievement.rarity.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex justify-center gap-4 text-sm">
              {achievement.stats.wpm && (
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  {achievement.stats.wpm} WPM
                </span>
              )}
              {achievement.stats.accuracy && (
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {achievement.stats.accuracy}%
                </span>
              )}
            </div>

            <ShareDialog 
              item={achievement}
              trigger={
                <Button className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Achievement
                </Button>
              }
            />
          </div>
        </Card>
      )}

      {/* Session Stats Sharing */}
      {sessionStats && (
        <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Great session!</h4>
              <div className="flex gap-4 text-sm mt-1">
                <span>{sessionStats.wpm} WPM</span>
                <span>{sessionStats.accuracy}% accuracy</span>
                <span>{Math.round(sessionStats.timeSpent)}m</span>
              </div>
            </div>
            <ShareDialog 
              item={sessionStats}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              }
            />
          </div>
        </Card>
      )}

      {/* Recent Achievements Gallery */}
      <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-lg border-2 cursor-pointer hover:bg-opacity-50 transition-colors ${
                themeMode === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
              } ${getRarityColor(ach.rarity)}`}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl">{ach.icon}</div>
                <div>
                  <h4 className="font-medium text-sm">{ach.title}</h4>
                  <Badge variant="outline" className={`text-xs ${getRarityColor(ach.rarity)}`}>
                    {ach.rarity}
                  </Badge>
                </div>
                <ShareDialog 
                  item={ach}
                  trigger={
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Share2 className="h-3 w-3" />
                      Share
                    </Button>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SocialSharing;