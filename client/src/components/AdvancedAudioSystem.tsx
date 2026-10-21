import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { useAudio } from '../lib/stores/useAudio';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Headphones, 
  Zap, 
  Heart, 
  Waves,
  Settings,
  Play,
  Pause,
  SkipForward,
  Shuffle
} from 'lucide-react';

interface SoundProfile {
  id: string;
  name: string;
  description: string;
  keySound: string;
  backgroundMusic: string;
  effects: {
    reverb: number;
    echo: number;
    bass: number;
    treble: number;
  };
}

interface AudioVisualizerProps {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  theme: string;
}

// Real-time audio visualizer
const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioContext, analyser, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, theme]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className="w-full h-24 rounded-lg"
    />
  );
};

// 3D spatial audio component
const SpatialAudioControls: React.FC<{
  spatialEnabled: boolean;
  onSpatialToggle: (enabled: boolean) => void;
  position: { x: number; y: number; z: number };
  onPositionChange: (position: { x: number; y: number; z: number }) => void;
  theme: string;
}> = ({ spatialEnabled, onSpatialToggle, position, onPositionChange, theme }) => {
  return (
    <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Headphones className="w-5 h-5 text-purple-500" />
          3D Spatial Audio
        </h3>
        <Switch
          checked={spatialEnabled}
          onCheckedChange={onSpatialToggle}
        />
      </div>

      {spatialEnabled && (
        <div className="space-y-4">
          <div className="relative w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 rounded-lg overflow-hidden">
            {/* 3D space visualization */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-gray-400 dark:border-gray-500" />
              ))}
            </div>
            
            {/* Sound source indicator */}
            <div
              className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
              style={{
                left: `${(position.x + 1) * 50}%`,
                top: `${(position.y + 1) * 50}%`
              }}
            />
            
            {/* Listener position (center) */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">X Position</label>
              <Slider
                value={[position.x]}
                onValueChange={([x]) => onPositionChange({ ...position, x })}
                min={-1}
                max={1}
                step={0.1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Y Position</label>
              <Slider
                value={[position.y]}
                onValueChange={([y]) => onPositionChange({ ...position, y })}
                min={-1}
                max={1}
                step={0.1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Z Distance</label>
              <Slider
                value={[position.z]}
                onValueChange={([z]) => onPositionChange({ ...position, z })}
                min={-2}
                max={2}
                step={0.1}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// Sound profile selector
const SoundProfileSelector: React.FC<{
  profiles: SoundProfile[];
  activeProfile: string;
  onProfileChange: (profileId: string) => void;
  theme: string;
}> = ({ profiles, activeProfile, onProfileChange, theme }) => {
  return (
    <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-blue-500" />
        Sound Profiles
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onProfileChange(profile.id)}
            className={cn(
              "p-3 rounded-lg text-left transition-all duration-200 border-2",
              activeProfile === profile.id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg"
                : theme === 'dark'
                  ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-gray-300"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
            )}
          >
            <div className="font-semibold mb-1">{profile.name}</div>
            <div className="text-xs opacity-75">{profile.description}</div>
            
            {activeProfile === profile.id && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs">Active</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
};

// Advanced equalizer
const AdvancedEqualizer: React.FC<{
  bands: number[];
  onBandChange: (index: number, value: number) => void;
  theme: string;
}> = ({ bands, onBandChange, theme }) => {
  const frequencies = ['60Hz', '170Hz', '310Hz', '600Hz', '1kHz', '3kHz', '6kHz', '12kHz', '14kHz', '16kHz'];

  return (
    <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Waves className="w-5 h-5 text-green-500" />
        10-Band Equalizer
      </h3>
      
      <div className="flex items-end justify-between gap-2">
        {bands.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="text-xs font-medium">{Math.round(value)}dB</div>
            <Slider
              value={[value]}
              onValueChange={([newValue]) => onBandChange(index, newValue)}
              min={-12}
              max={12}
              step={0.5}
              orientation="vertical"
              className="h-32"
            />
            <div className="text-xs opacity-75">{frequencies[index]}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => bands.forEach((_, i) => onBandChange(i, 0))}
        >
          Reset
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => {
            // Bass boost preset
            const bassBoost = [-2, 0, 2, 4, 2, 0, -1, -2, -3, -3];
            bassBoost.forEach((value, i) => onBandChange(i, value));
          }}
        >
          Bass Boost
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => {
            // Vocal clarity preset
            const vocal = [-1, -1, 0, 1, 3, 3, 2, 1, 0, -1];
            vocal.forEach((value, i) => onBandChange(i, value));
          }}
        >
          Vocal
        </Button>
      </div>
    </Card>
  );
};

// Main advanced audio system
const AdvancedAudioSystem: React.FC<{ className?: string }> = ({ className }) => {
  const { backgroundMusic, isMuted, toggleMute } = useAudio();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [spatialEnabled, setSpatialEnabled] = useState(false);
  const [spatialPosition, setSpatialPosition] = useState({ x: 0, y: 0, z: 0 });
  const [activeProfile, setActiveProfile] = useState('focused');
  const [eqBands, setEqBands] = useState(Array(10).fill(0));
  const [volume, setVolume] = useState([70]);
  const [theme] = useState('dark'); // Get from theme context

  const soundProfiles: SoundProfile[] = [
    {
      id: 'focused',
      name: 'Focused Typing',
      description: 'Minimal distractions, clean sounds',
      keySound: 'soft-click',
      backgroundMusic: 'ambient-focus',
      effects: { reverb: 0.1, echo: 0, bass: 0, treble: 0.2 }
    },
    {
      id: 'energetic',
      name: 'Energetic Flow',
      description: 'Upbeat sounds for motivation',
      keySound: 'mechanical-click',
      backgroundMusic: 'upbeat-ambient',
      effects: { reverb: 0.3, echo: 0.1, bass: 0.2, treble: 0.1 }
    },
    {
      id: 'relaxing',
      name: 'Zen Mode',
      description: 'Calming nature sounds',
      keySound: 'water-drop',
      backgroundMusic: 'nature-ambient',
      effects: { reverb: 0.5, echo: 0.2, bass: -0.1, treble: -0.1 }
    },
    {
      id: 'gaming',
      name: 'Gaming Vibes',
      description: 'High-energy gaming sounds',
      keySound: 'synth-beep',
      backgroundMusic: 'electronic-beats',
      effects: { reverb: 0.2, echo: 0.3, bass: 0.4, treble: 0.3 }
    }
  ];

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 256;
        
        setAudioContext(ctx);
        setAnalyser(analyserNode);
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };

    initAudio();
  }, []);

  const handleEQBandChange = (index: number, value: number) => {
    const newBands = [...eqBands];
    newBands[index] = value;
    setEqBands(newBands);
    
    // Apply EQ to audio context if available
    if (audioContext) {
      // Implementation would involve creating biquad filters for each band
      console.log(`EQ Band ${index} set to ${value}dB`);
    }
  };

  const handleSpatialPositionChange = (position: { x: number; y: number; z: number }) => {
    setSpatialPosition(position);
    
    // Apply spatial audio positioning
    if (audioContext && spatialEnabled) {
      console.log('Spatial position updated:', position);
      // Implementation would use Web Audio API's PannerNode
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with main controls */}
      <Card className={`p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Volume2 className="w-8 h-8" />
              Advanced Audio System
            </h2>
            <p className="text-purple-200">Professional-grade audio for optimal typing experience</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleMute}
              className="bg-white/20 hover:bg-white/30"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {/* Master volume */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Master Volume</span>
            <span>{volume[0]}%</span>
          </div>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="bg-white/20"
          />
        </div>
      </Card>

      {/* Audio visualizer */}
      <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Waves className="w-5 h-5 text-cyan-500" />
          Real-time Audio Visualizer
        </h3>
        <AudioVisualizer 
          audioContext={audioContext}
          analyser={analyser}
          theme={theme}
        />
      </Card>

      {/* Sound profiles */}
      <SoundProfileSelector
        profiles={soundProfiles}
        activeProfile={activeProfile}
        onProfileChange={setActiveProfile}
        theme={theme}
      />

      {/* Advanced equalizer */}
      <AdvancedEqualizer
        bands={eqBands}
        onBandChange={handleEQBandChange}
        theme={theme}
      />

      {/* 3D Spatial audio */}
      <SpatialAudioControls
        spatialEnabled={spatialEnabled}
        onSpatialToggle={setSpatialEnabled}
        position={spatialPosition}
        onPositionChange={handleSpatialPositionChange}
        theme={theme}
      />

      {/* Audio effects */}
      <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Audio Effects
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Reverb</label>
            <Slider
              value={[soundProfiles.find(p => p.id === activeProfile)?.effects.reverb || 0]}
              onValueChange={([value]) => console.log('Reverb:', value)}
              min={0}
              max={1}
              step={0.1}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Echo</label>
            <Slider
              value={[soundProfiles.find(p => p.id === activeProfile)?.effects.echo || 0]}
              onValueChange={([value]) => console.log('Echo:', value)}
              min={0}
              max={1}
              step={0.1}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Bass</label>
            <Slider
              value={[soundProfiles.find(p => p.id === activeProfile)?.effects.bass || 0]}
              onValueChange={([value]) => console.log('Bass:', value)}
              min={-1}
              max={1}
              step={0.1}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Treble</label>
            <Slider
              value={[soundProfiles.find(p => p.id === activeProfile)?.effects.treble || 0]}
              onValueChange={([value]) => console.log('Treble:', value)}
              min={-1}
              max={1}
              step={0.1}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Audio settings and preferences */}
      <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          Audio Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Key Press Sounds</div>
              <div className="text-sm opacity-75">Audio feedback for each keystroke</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Error Sound Alerts</div>
              <div className="text-sm opacity-75">Audio cues for typing mistakes</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Achievement Sounds</div>
              <div className="text-sm opacity-75">Celebration audio for milestones</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Background Music</div>
              <div className="text-sm opacity-75">Ambient music during typing sessions</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedAudioSystem;