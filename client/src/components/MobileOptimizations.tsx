import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { 
  Smartphone, 
  RotateCcw, 
  Vibrate, 
  Zap, 
  Eye, 
  Hand,
  Battery,
  Wifi,
  Volume2,
  Maximize,
  Settings
} from 'lucide-react';

// Haptic feedback manager
class HapticFeedbackManager {
  private patterns = {
    light: [10],
    medium: [50],
    heavy: [100],
    success: [10, 50, 10],
    error: [100, 50, 100],
    typing: [5],
    achievement: [50, 25, 50, 25, 100]
  };

  trigger(pattern: keyof typeof this.patterns, intensity: number = 1) {
    if ('vibrate' in navigator) {
      const vibrationPattern = this.patterns[pattern].map(duration => 
        Math.round(duration * intensity)
      );
      navigator.vibrate(vibrationPattern);
    }
  }

  isSupported(): boolean {
    return 'vibrate' in navigator;
  }
}

// Touch gesture handler
class TouchGestureHandler {
  private element: HTMLElement | null = null;
  private startTouch: { x: number; y: number; time: number } | null = null;
  private swipeThreshold = 50;
  private tapThreshold = 10;
  private longPressThreshold = 500;

  constructor(element: HTMLElement) {
    this.element = element;
    this.bindEvents();
  }

  private bindEvents() {
    if (!this.element) return;

    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    this.element.addEventListener('touchmove', this.preventScroll.bind(this), { passive: false });
  }

  private handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    this.startTouch = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }

  private handleTouchEnd(e: TouchEvent) {
    if (!this.startTouch) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - this.startTouch.x;
    const deltaY = touch.clientY - this.startTouch.y;
    const deltaTime = Date.now() - this.startTouch.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Long press
    if (deltaTime > this.longPressThreshold && distance < this.tapThreshold) {
      this.onLongPress?.(touch.clientX, touch.clientY);
    }
    // Swipe gestures
    else if (distance > this.swipeThreshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.onSwipeRight?.();
        } else {
          this.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.onSwipeDown?.();
        } else {
          this.onSwipeUp?.();
        }
      }
    }
    // Tap
    else if (distance < this.tapThreshold && deltaTime < 300) {
      this.onTap?.(touch.clientX, touch.clientY);
    }

    this.startTouch = null;
  }

  private preventScroll(e: TouchEvent) {
    // Prevent default scrolling during typing
    if (this.element?.classList.contains('typing-active')) {
      e.preventDefault();
    }
  }

  // Event handlers (to be assigned)
  onTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;

  destroy() {
    if (!this.element) return;
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchmove', this.preventScroll);
  }
}

// Performance monitor for mobile devices
const MobilePerformanceMonitor: React.FC<{ theme: string }> = ({ theme }) => {
  const [fps, setFps] = useState(60);
  const [battery, setBattery] = useState({ level: 1, charging: false });
  const [connection, setConnection] = useState<'4g' | '3g' | 'wifi' | 'slow'>('wifi');

  useEffect(() => {
    // FPS monitoring
    let frames = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frames * 1000) / (currentTime - lastTime)));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);

    // Battery monitoring
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: { 
        level: number; 
        charging: boolean;
        addEventListener: (event: string, callback: () => void) => void;
        removeEventListener: (event: string, callback: () => void) => void;
      }) => {
        const updateBattery = () => {
          setBattery({
            level: battery.level,
            charging: battery.charging
          });
        };
        
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
        
        return () => {
          battery.removeEventListener('levelchange', updateBattery);
          battery.removeEventListener('chargingchange', updateBattery);
        };
      });
    }

    // Connection monitoring
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      const updateConnection = () => {
        if (conn.effectiveType) {
          setConnection(conn.effectiveType);
        }
      };
      
      updateConnection();
      conn.addEventListener('change', updateConnection);
      
      return () => conn.removeEventListener('change', updateConnection);
    }
  }, []);  // This effect doesn't depend on props or state so the empty array is appropriate here

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-500';
    if (value >= threshold * 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className={`p-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
        <Smartphone className="w-4 h-4 text-blue-500" />
        Performance Monitor
      </h4>
      
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="text-center">
          <div className={cn("font-bold", getPerformanceColor(fps, 50))}>
            {fps} FPS
          </div>
          <div className="opacity-75">Frame Rate</div>
        </div>
        
        <div className="text-center">
          <div className={cn(
            "font-bold flex items-center justify-center gap-1",
            battery.level > 0.5 ? 'text-green-500' : 
            battery.level > 0.2 ? 'text-yellow-500' : 'text-red-500'
          )}>
            <Battery className="w-3 h-3" />
            {Math.round(battery.level * 100)}%
          </div>
          <div className="opacity-75">Battery</div>
        </div>
        
        <div className="text-center">
          <div className="font-bold flex items-center justify-center gap-1 text-blue-500">
            <Wifi className="w-3 h-3" />
            {connection.toUpperCase()}
          </div>
          <div className="opacity-75">Connection</div>
        </div>
      </div>
    </Card>
  );
};

// Touch-friendly controls
const TouchControls: React.FC<{
  onGestureToggle: (enabled: boolean) => void;
  onHapticToggle: (enabled: boolean) => void;
  gesturesEnabled: boolean;
  hapticsEnabled: boolean;
  theme: string;
}> = ({ onGestureToggle, onHapticToggle, gesturesEnabled, hapticsEnabled, theme }) => {
  return (
    <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Smartphone className="w-5 h-5 text-green-500" />
        Touch Controls
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Gesture Navigation</div>
            <div className="text-sm opacity-75">Swipe to navigate between lessons</div>
          </div>
          <Switch
            checked={gesturesEnabled}
            onCheckedChange={onGestureToggle}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Haptic Feedback</div>
            <div className="text-sm opacity-75">Vibration feedback for interactions</div>
          </div>
          <Switch
            checked={hapticsEnabled}
            onCheckedChange={onHapticToggle}
          />
        </div>
        
        {gesturesEnabled && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-sm font-medium mb-2">Gesture Guide:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>← Swipe Left: Previous lesson</div>
              <div>→ Swipe Right: Next lesson</div>
              <div>↑ Swipe Up: Settings</div>
              <div>↓ Swipe Down: Stats</div>
              <div>Long Press: Quick actions</div>
              <div>Double Tap: Toggle focus mode</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Thumb-zone optimization
const ThumbZoneOptimizer: React.FC<{
  handPreference: 'left' | 'right';
  onZoneChange: (zones: string[]) => void;
  theme: string;
}> = ({ handPreference, onZoneChange, theme }) => {
  const [selectedZones, setSelectedZones] = useState<string[]>(['bottom', 'side']);

  const zones = [
    { id: 'top', label: 'Top Area', description: 'Hard to reach with thumb' },
    { id: 'middle', label: 'Middle Area', description: 'Moderate reach' },
    { id: 'bottom', label: 'Bottom Area', description: 'Easy thumb access' },
    { id: 'side', label: `${handPreference} Side`, description: 'Natural thumb position' }
  ];

  const handleZoneToggle = (zoneId: string) => {
    const newZones = selectedZones.includes(zoneId)
      ? selectedZones.filter(id => id !== zoneId)
      : [...selectedZones, zoneId];
    
    setSelectedZones(newZones);
    onZoneChange(newZones);
  };

  return (
    <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Hand className="w-5 h-5 text-purple-500" />
        Thumb Zone Optimization
      </h3>
      
      <div className="mb-4">
        <div className="relative w-full h-32 bg-gradient-to-t from-green-100 via-yellow-100 to-red-100 dark:from-green-900/30 dark:via-yellow-900/30 dark:to-red-900/30 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          {/* Phone outline */}
          <div className="absolute inset-2 border-2 border-gray-400 dark:border-gray-500 rounded-lg">
            {/* Thumb reach indicators */}
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-500/30 rounded-full transform translate-x-1/2 translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-500/20 rounded-full transform translate-x-1/3 translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-500/10 rounded-full transform translate-x-1/4 translate-y-1/4" />
            
            {/* Hand indicator */}
            <div className={cn(
              "absolute bottom-2 w-6 h-6 bg-blue-500 rounded-full",
              handPreference === 'right' ? 'right-2' : 'left-2'
            )}>
              <Hand className="w-4 h-4 text-white m-1" />
            </div>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Easy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Hard</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => (
          <div key={zone.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{zone.label}</div>
              <div className="text-sm opacity-75">{zone.description}</div>
            </div>
            <Switch
              checked={selectedZones.includes(zone.id)}
              onCheckedChange={() => handleZoneToggle(zone.id)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

// Main mobile optimizations component
const MobileOptimizations: React.FC<{ className?: string }> = ({ className }) => {
  const { handPreference, themeMode } = useTypingStore();
  const [gesturesEnabled, setGesturesEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [touchSensitivity, setTouchSensitivity] = useState([75]);
  const [edgeProtection, setEdgeProtection] = useState(true);
  const [reachableZones, setReachableZones] = useState<string[]>(['bottom', 'side']);
  
  const hapticManager = useRef(new HapticFeedbackManager());
  const gestureHandler = useRef<TouchGestureHandler | null>(null);

  // Initialize touch gestures
  useEffect(() => {
    const container = document.querySelector('[data-mobile-container]') as HTMLElement;
    if (container && gesturesEnabled) {
      gestureHandler.current = new TouchGestureHandler(container);
      
      gestureHandler.current.onSwipeLeft = () => {
        console.log('Swipe left - Previous lesson');
        if (hapticsEnabled) hapticManager.current.trigger('light');
      };
      
      gestureHandler.current.onSwipeRight = () => {
        console.log('Swipe right - Next lesson');
        if (hapticsEnabled) hapticManager.current.trigger('light');
      };
      
      gestureHandler.current.onSwipeUp = () => {
        console.log('Swipe up - Settings');
        if (hapticsEnabled) hapticManager.current.trigger('medium');
      };
      
      gestureHandler.current.onSwipeDown = () => {
        console.log('Swipe down - Stats');
        if (hapticsEnabled) hapticManager.current.trigger('medium');
      };
      
      gestureHandler.current.onLongPress = () => {
        console.log('Long press - Quick actions');
        if (hapticsEnabled) hapticManager.current.trigger('heavy');
      };
    }

    return () => {
      gestureHandler.current?.destroy();
    };
  }, [gesturesEnabled, hapticsEnabled]);

  return (
    <div className={cn("space-y-6", className)} data-mobile-container>
      {/* Header */}
      <Card className={`p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Smartphone className="w-8 h-8" />
              Mobile Optimizations
            </h2>
            <p className="text-green-200">Enhanced mobile typing experience</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-90">Optimized for</div>
            <div className="font-bold">{handPreference.charAt(0).toUpperCase() + handPreference.slice(1)} Hand</div>
          </div>
        </div>
      </Card>

      {/* Performance monitor */}
      <MobilePerformanceMonitor theme={themeMode} />

      {/* Touch controls */}
      <TouchControls
        gesturesEnabled={gesturesEnabled}
        hapticsEnabled={hapticsEnabled}
        onGestureToggle={setGesturesEnabled}
        onHapticToggle={setHapticsEnabled}
        theme={themeMode}
      />

      {/* Thumb zone optimizer */}
      <ThumbZoneOptimizer
        handPreference={handPreference}
        onZoneChange={setReachableZones}
        theme={themeMode}
      />

      {/* Touch sensitivity */}
      <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Touch Sensitivity
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Touch Sensitivity</span>
              <span>{touchSensitivity[0]}%</span>
            </div>
            <Slider
              value={touchSensitivity}
              onValueChange={setTouchSensitivity}
              max={100}
              step={5}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Edge Protection</div>
              <div className="text-sm opacity-75">Prevent accidental edge touches</div>
            </div>
            <Switch
              checked={edgeProtection}
              onCheckedChange={setEdgeProtection}
            />
          </div>
        </div>
      </Card>

      {/* Mobile-specific features */}
      <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          Mobile Features
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-Rotate Lock</div>
              <div className="text-sm opacity-75">Prevent orientation changes during typing</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Wake Lock</div>
              <div className="text-sm opacity-75">Keep screen awake during lessons</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Fullscreen Mode</div>
              <div className="text-sm opacity-75">Hide status bar for distraction-free typing</div>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Battery Optimization</div>
              <div className="text-sm opacity-75">Reduce animations when battery is low</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Test area for gestures */}
      <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className="text-lg font-bold mb-4">Gesture Test Area</h3>
        <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <Smartphone className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-sm font-medium">Try gestures here</div>
            <div className="text-xs opacity-75">Swipe, tap, or long press</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export { HapticFeedbackManager, TouchGestureHandler };
export default MobileOptimizations;