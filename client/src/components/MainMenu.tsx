/* eslint-disable */
/* @jsx React.createElement */
/* @jsxFrag React.Fragment */
// React import fixed for TypeScript compatibility
import * as React from 'react';
const { useState } = React;
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Play, 
  Trophy, 
  Users, 
  BarChart, 
  Settings, 
  Book, 
  Volume2, 
  Share2,
  Target,
  Zap,
  Award,
  TrendingUp,
  Activity,
  Keyboard
} from 'lucide-react';

// Import all the new components
import SwipeableLessonSelector from './SwipeableLessonSelector';
// import MultiplayerRace from './MultiplayerRace';
// import AdvancedAnalytics from './AdvancedAnalytics';
import SoundFeedbackSystem from './SoundFeedbackSystem';
import SocialSharing from './SocialSharing';
import MobileAccessibilitySettings from './MobileAccessibilitySettings';
import { type Lesson } from '../lib/lessons';

type MenuView = 'main' | 'lessons' | 'multiplayer' | 'analytics' | 'settings' | 'sound' | 'social';

interface MainMenuProps {
  onStartLesson: (lesson: Lesson) => void;
  className?: string;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartLesson, className }) => {
  const { themeMode, stats, completedLessons, handPreference } = useTypingStore();
  const [currentView, setCurrentView] = useState<MenuView>('main');

  // Mock recent session for social sharing
  const mockSessionStats = {
    wpm: 42,
    accuracy: 94,
    timeSpent: 15,
    lessonCompleted: 'Home Row Mastery'
  };

  const menuItems = [
    {
      id: 'lessons',
      title: 'Start Typing',
      description: 'Practice lessons and improve your skills',
      icon: <Play className="h-8 w-8" />,
      color: 'bg-blue-500',
      stats: `${completedLessons.length} lessons completed`,
      action: () => setCurrentView('lessons')
    },

    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Deep insights into your performance',
      icon: <BarChart className="h-8 w-8" />,
      color: 'bg-purple-500',
      stats: `${stats.bestWpm || 0} WPM best`,
      action: () => setCurrentView('analytics')
    },
    {
      id: 'social',
      title: 'Share Progress',
      description: 'Share achievements and progress',
      icon: <Share2 className="h-8 w-8" />,
      color: 'bg-pink-500',
      stats: 'Show your progress',
      badge: 'NEW',
      action: () => setCurrentView('social')
    },
    {
      id: 'sound',
      title: 'Sound Feedback',
      description: 'Dynamic audio feedback system',
      icon: <Volume2 className="h-8 w-8" />,
      color: 'bg-orange-500',
      stats: 'Enhance your typing',
      badge: 'NEW',
      action: () => setCurrentView('sound')
    },

  ];

  const quickStats = [
    {
      label: 'Best WPM',
      value: stats.bestWpm || 0,
      icon: <Zap className="h-5 w-5 text-blue-500" />
    },
    {
      label: 'Best Accuracy',
      value: `${stats.bestAccuracy || 0}%`,
      icon: <Target className="h-5 w-5 text-green-500" />
    },
    {
      label: 'Lessons Done',
      value: completedLessons.length,
      icon: <Book className="h-5 w-5 text-purple-500" />
    },
    {
      label: 'Total Time',
      value: `${Math.round((stats.totalTimeTyped || 0) / 60)}m`,
      icon: <Activity className="h-5 w-5 text-orange-500" />
    }
  ];

  const renderMainMenu = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className={`p-6 text-center ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">OneType</h1>
            <p className="text-lg opacity-75">Master one-handed typing with confidence</p>
            <Badge variant="outline" className="mt-2">
              {handPreference.charAt(0).toUpperCase() + handPreference.slice(1)} Hand Mode
            </Badge>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                {stat.icon}
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs opacity-60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card 
            key={item.id}
            className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              themeMode === 'dark' ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={item.action}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${item.color} text-white`}>
                  {item.icon}
                </div>
                {item.badge && (
                  <Badge variant="default" className="bg-green-500 text-white">
                    {item.badge}
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                <p className="text-sm opacity-75 mb-2">{item.description}</p>
                <div className="text-xs opacity-60">{item.stats}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="text-sm opacity-75">Last Session</div>
            <div className="text-lg font-semibold">42 WPM • 94% Accuracy</div>
          </div>
          <div className={`p-4 rounded-lg ${themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="text-sm opacity-75">Weekly Progress</div>
            <div className="text-lg font-semibold text-green-500">+8 WPM improvement</div>
          </div>
          <div className={`p-4 rounded-lg ${themeMode === 'dark' ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="text-sm opacity-75">Achievement</div>
            <div className="text-lg font-semibold text-yellow-500">Speed Demon unlocked!</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'lessons':
        return (
          <SwipeableLessonSelector
            onStartLesson={onStartLesson}
            onBack={() => setCurrentView('main')}
          />
        );
      case 'multiplayer':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Multiplayer Racing</h2>
              <Button variant="outline" onClick={() => setCurrentView('main')}>
                Back to Menu
              </Button>
            </div>
            <Card className="p-8 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
              <p className="text-gray-600">Multiplayer racing features will be available in the next update.</p>
            </Card>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Advanced Analytics</h2>
              <Button variant="outline" onClick={() => setCurrentView('main')}>
                Back to Menu
              </Button>
            </div>
            <Card className="p-8 text-center">
              <BarChart className="h-16 w-16 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
              <p className="text-gray-600">Advanced analytics dashboard will be available in the next update.</p>
            </Card>
          </div>
        );
      case 'sound':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Sound Feedback System</h2>
              <Button variant="outline" onClick={() => setCurrentView('main')}>
                Back to Menu
              </Button>
            </div>
            <SoundFeedbackSystem />
          </div>
        );
      case 'social':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Share Your Progress</h2>
              <Button variant="outline" onClick={() => setCurrentView('main')}>
                Back to Menu
              </Button>
            </div>
            <SocialSharing sessionStats={mockSessionStats} />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Settings</h2>
              <Button variant="outline" onClick={() => setCurrentView('main')}>
                Back to Menu
              </Button>
            </div>
            <MobileAccessibilitySettings onClose={() => setCurrentView('main')} />
          </div>
        );
      default:
        return renderMainMenu();
    }
  };

  return (
    <div className={cn(
      "min-h-screen p-4 transition-colors duration-300",
      themeMode === 'dark' 
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-white via-gray-50 to-blue-50 text-gray-900',
      className
    )}>
      <div className="max-w-6xl mx-auto">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default MainMenu;