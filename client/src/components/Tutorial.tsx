import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Progress } from "../components/ui/progress.tsx";
import VirtualKeyboard from "./VirtualKeyboard.tsx";
import { useTypingStore } from "../lib/stores/useTypingStore.tsx";
import { getKeyboardLayout, availableLayouts } from "../lib/keyboardLayouts.ts";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Hand,
  Target,
  Keyboard,
  Play,
  CheckCircle
} from "lucide-react";

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial = ({ onComplete }: TutorialProps) => {
  const { handPreference, toggleHandPreference, keyboardLayout, setKeyboardLayout } = useTypingStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const tutorialSteps = [
    {
      id: 0,
      title: "Welcome to OneType!",
      icon: <Hand className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          {/* Welcome Hero Image */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-40 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20"></div>
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">⌨️</div>
                  <div className="text-lg font-bold">OneType</div>
                  <div className="text-sm opacity-90">One Hand, Unlimited Potential</div>
                </div>
              </div>
              <div className="absolute top-2 right-2 text-white/30">
                <Hand className="h-6 w-6" />
              </div>
              <div className="absolute bottom-2 left-2 text-white/30">
                <Target className="h-5 w-5" />
              </div>
            </div>
          </div>

          <p className="text-lg text-center">
            Welcome to OneType, the revolutionary typing application designed specifically for one-handed users!
          </p>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What makes OneType special?</h4>
            <ul className="space-y-2 text-sm">
              <li>✓ Optimized keyboard layouts for left and right hands</li>
              <li>✓ Gamified learning with achievements and progress tracking</li>
              <li>✓ Comprehensive accessibility features</li>
              <li>✓ Duolingo-inspired progression system</li>
              <li>✓ Real-time feedback and performance analytics</li>
            </ul>
          </div>
          
          <p className="text-center">
            This tutorial will guide you through the key features and help you get started 
            on your one-handed typing journey!
          </p>
        </div>
      )
    },
    {
      id: 1,
      title: "Choose Your Hand Preference",
      icon: <RotateCcw className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p>
            First, let's select which hand you'll be using for typing. OneType offers 
            optimized keyboard layouts for both left and right hands.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button
              variant={handPreference === 'left' ? 'default' : 'outline'}
              size="lg"
              onClick={() => handPreference !== 'left' && toggleHandPreference()}
              className="gap-2"
            >
              <Hand className="h-5 w-5" />
              Left Hand
            </Button>
            <Button
              variant={handPreference === 'right' ? 'default' : 'outline'}
              size="lg"
              onClick={() => handPreference !== 'right' && toggleHandPreference()}
              className="gap-2"
            >
              <Hand className="h-5 w-5 scale-x-[-1]" />
              Right Hand
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Current Selection: {handPreference} Hand</h4>
            <p className="text-sm text-muted-foreground">
              The keyboard layout will be optimized for comfortable {handPreference}-hand typing. 
              You can change this setting anytime from the main interface.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Select Keyboard Layout",
      icon: <Keyboard className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p>
            Choose from 5 internationally popular keyboard layouts that you're familiar with.
            Each layout is optimized for one-handed typing on your {handPreference} hand.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableLayouts.map((layout) => (
              <Button
                key={layout.id}
                variant={keyboardLayout === layout.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setKeyboardLayout(layout.id)}
                className="flex flex-col items-start p-4 h-auto gap-2"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Keyboard className="h-4 w-4" />
                  {layout.name}
                </div>
                <div className="text-xs text-left">
                  <div className="text-muted-foreground">{layout.description}</div>
                  <div className="text-muted-foreground">Region: {layout.region}</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">
              Current Selection: {availableLayouts.find(l => l.id === keyboardLayout)?.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {availableLayouts.find(l => l.id === keyboardLayout)?.description} - 
              This layout will be used for all typing exercises and can be changed in settings.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Meet Your Virtual Keyboard",
      icon: <Keyboard className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p>
            This is your virtual keyboard, specially designed for {handPreference}-hand typing. 
            Notice how the keys are arranged for optimal reach and comfort.
          </p>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <VirtualKeyboard 
              viewMode="landscape"
              onKeyPress={() => {}}
              aria-label="Tutorial virtual keyboard demonstration"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Key Features
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Color-coded for expected characters</li>
                <li>• Finger position hints</li>
                <li>• Keyboard navigation support</li>
                <li>• Touch and click support</li>
              </ul>
            </div>
            
            <div className="bg-success/10 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">Navigation</h4>
              <ul className="text-sm space-y-1">
                <li>• Arrow keys to navigate</li>
                <li>• Enter/Space to select</li>
                <li>• Tab to move between areas</li>
                <li>• Escape to exit dialogs</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Understanding the Interface",
      icon: <Target className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p>
            Let's explore the main interface elements you'll be working with during your typing practice.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lesson Selection Panel</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Choose from categorized lessons:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Basics - Letter combinations</li>
                  <li>• Words - Common vocabulary</li>
                  <li>• Sentences - Full sentence practice</li>
                  <li>• Advanced - Complex text</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-success/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Typing Area</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Real-time feedback includes:</p>
                <ul className="mt-2 space-y-1">
                  <li>• WPM (Words Per Minute)</li>
                  <li>• Accuracy percentage</li>
                  <li>• Error highlighting</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progress Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Track your improvement:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Achievement badges</li>
                  <li>• Performance analytics</li>
                  <li>• Level progression</li>
                  <li>• Personal bests</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Accessibility</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Inclusive features:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Screen reader support</li>
                  <li>• High contrast modes</li>
                  <li>• Keyboard navigation</li>
                  <li>• Font size adjustment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Gamification & Achievements",
      icon: <CheckCircle className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p>
            OneType uses gamification to make learning fun and engaging! Here's how 
            the achievement system works:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Achievement Categories</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Speed - Typing velocity milestones
                </Badge>
                <Badge variant="outline" className="w-full justify-start gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Accuracy - Precision achievements
                </Badge>
                <Badge variant="outline" className="w-full justify-start gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Consistency - Regular practice
                </Badge>
                <Badge variant="outline" className="w-full justify-start gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Milestones - Major accomplishments
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Progression System</h4>
              <ul className="space-y-2 text-sm">
                <li>• Unlock new lessons by completing previous ones</li>
                <li>• Earn experience points for practice time</li>
                <li>• Collect badges for specific achievements</li>
                <li>• Track personal bests and improvements</li>
                <li>• Level up based on overall progress</li>
              </ul>
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pro Tip!</h4>
            <p className="text-sm">
              Focus on accuracy first, then speed. Consistent practice with 
              good form will lead to better long-term results than rushing 
              through lessons with errors.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Ready to Start!",
      icon: <Play className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Congratulations! You're now ready to begin your one-handed typing journey with OneType.
          </p>
          
          <div className="bg-success/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What's Next?</h4>
            <ol className="space-y-2 text-sm">
              <li>1. Start with basic letter combination lessons</li>
              <li>2. Practice regularly to build muscle memory</li>
              <li>3. Gradually increase difficulty as you improve</li>
              <li>4. Use the virtual keyboard for guidance</li>
              <li>5. Track your progress and celebrate achievements!</li>
            </ol>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Remember:</h4>
            <ul className="space-y-1 text-sm">
              <li>• You can access accessibility settings anytime</li>
              <li>• Switch hand preference from the main menu</li>
              <li>• View your progress dashboard for motivation</li>
              <li>• Take breaks to avoid fatigue</li>
              <li>• Have fun and be patient with yourself!</li>
            </ul>
          </div>

          <div className="text-center">
            <Button onClick={onComplete} size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              Start Typing!
            </Button>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const goToNext = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    onComplete();
  };

  useEffect(() => {
    // Mark first step as viewed
    setCompletedSteps(new Set([0]));
  }, []); // Empty dependency array is appropriate since this should only run once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">OneType Tutorial</h1>
          <p className="text-muted-foreground">
            Learn how to use OneType for effective one-handed typing
          </p>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="min-h-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {currentStepData.icon}
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStepData.content}
          </CardContent>
        </Card>

        {/* Navigation - Fixed layout to ensure Next button is visible */}
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
            {/* Hide Previous button on first page */}
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={goToPrevious}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div className="w-24"></div>
            )}
            
            <Button
              variant="ghost"
              onClick={skipTutorial}
              className="text-muted-foreground"
            >
              Skip Tutorial
            </Button>
          </div>

          {/* Next button - always on the right side */}
          <div className="flex gap-2 ml-auto">
            {currentStep < tutorialSteps.length - 1 ? (
              <Button 
                onClick={goToNext} 
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={onComplete} size="lg" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Play className="h-5 w-5" />
                Start Typing!
              </Button>
            )}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-primary'
                  : completedSteps.has(index)
                  ? 'bg-success'
                  : 'bg-muted'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
