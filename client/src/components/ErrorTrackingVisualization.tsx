import React, { useMemo, useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { AlertTriangle, TrendingDown, TrendingUp, Target, Zap } from 'lucide-react';

interface ErrorData {
  character: string;
  position: number;
  timestamp: number;
  expectedChar: string;
  actualChar: string;
  context: string; // surrounding text
}

interface ErrorTrackingVisualizationProps {
  currentText: string;
  currentInput: string;
  errors: ErrorData[];
  className?: string;
}

const ErrorTrackingVisualization: React.FC<ErrorTrackingVisualizationProps> = ({
  currentText,
  currentInput,
  errors = [],
  className
}) => {
  const { themeMode } = useTypingStore();
  const [animatingErrors, setAnimatingErrors] = useState<Set<number>>(new Set());

  // Real-time error analysis
  const errorAnalysis = useMemo(() => {
    const errorsByChar: Record<string, number> = {};
    const errorsByPosition: Record<number, number> = {};
    const recentErrors = errors.filter(e => Date.now() - e.timestamp < 30000); // Last 30 seconds
    
    errors.forEach(error => {
      errorsByChar[error.expectedChar] = (errorsByChar[error.expectedChar] || 0) + 1;
      errorsByPosition[error.position] = (errorsByPosition[error.position] || 0) + 1;
    });

    const totalErrors = errors.length;
    const errorRate = currentInput.length > 0 ? (totalErrors / currentInput.length) * 100 : 0;
    const accuracy = Math.max(0, 100 - errorRate);

    return {
      errorsByChar,
      errorsByPosition,
      totalErrors,
      recentErrors: recentErrors.length,
      errorRate,
      accuracy,
      mostProblematicChar: Object.entries(errorsByChar).sort(([,a], [,b]) => b - a)[0]?.[0] || null
    };
  }, [errors, currentInput.length]);

  // Animate new errors
  useEffect(() => {
    if (errors.length > 0) {
      const latestError = errors[errors.length - 1];
      if (Date.now() - latestError.timestamp < 100) { // Very recent error
        setAnimatingErrors(prev => new Set([...Array.from(prev), latestError.position]));
        setTimeout(() => {
          setAnimatingErrors(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.delete(latestError.position);
            return newSet;
          });
        }, 1000);
      }
    }
  }, [errors]);

  // Color-coded text rendering
  const renderColorCodedText = () => {
    const characters = currentText.split('');
    
    return characters.map((char, index) => {
      const hasError = errorAnalysis.errorsByPosition[index] > 0;
      const isTyped = index < currentInput.length;
      const isCorrect = isTyped && currentInput[index] === char;
      const isCurrent = index === currentInput.length;
      const isAnimating = animatingErrors.has(index);
      
      let colorClass = '';
      let backgroundClass = '';
      
      if (isCurrent) {
        backgroundClass = 'bg-blue-200 dark:bg-blue-800';
      } else if (hasError && isTyped) {
        colorClass = 'text-red-600 dark:text-red-400';
        backgroundClass = 'bg-red-100 dark:bg-red-900/30';
      } else if (isCorrect) {
        colorClass = 'text-green-600 dark:text-green-400';
        backgroundClass = 'bg-green-100 dark:bg-green-900/30';
      } else if (isTyped) {
        colorClass = 'text-gray-500 dark:text-gray-400';
      } else {
        colorClass = 'text-gray-400 dark:text-gray-500';
      }

      return (
        <span
          key={index}
          className={cn(
            'transition-all duration-200 px-0.5 rounded',
            colorClass,
            backgroundClass,
            isAnimating && 'animate-pulse bg-red-300 dark:bg-red-700',
            isCurrent && 'ring-2 ring-blue-400'
          )}
          style={{
            fontFamily: 'monospace',
            fontSize: '1.1em',
            lineHeight: '1.8'
          }}
        >
          {char === ' ' ? '␣' : char}
        </span>
      );
    });
  };

  // Error heatmap for keyboard visualization
  const getKeyErrorLevel = (key: string) => {
    const errorCount = errorAnalysis.errorsByChar[key] || 0;
    if (errorCount === 0) return 'none';
    if (errorCount <= 2) return 'low';
    if (errorCount <= 5) return 'medium';
    return 'high';
  };

  const keyboardLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Real-time Error Statistics */}
      <Card className={`p-4 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Error Tracking
          </h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-green-500" />
              <span>{Math.round(errorAnalysis.accuracy)}% Accuracy</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>{errorAnalysis.totalErrors} Total Errors</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>{errorAnalysis.recentErrors} Recent</span>
            </div>
          </div>
        </div>

        {/* Error Rate Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Error Rate</span>
            <span>{Math.round(errorAnalysis.errorRate)}%</span>
          </div>
          <Progress 
            value={errorAnalysis.errorRate} 
            className="h-3"
            // Custom styling for error rate (reverse - lower is better)
          />
          <div className="text-xs text-gray-500">
            {errorAnalysis.errorRate < 5 ? '🟢 Excellent' :
             errorAnalysis.errorRate < 10 ? '🟡 Good' :
             errorAnalysis.errorRate < 20 ? '🟠 Needs Improvement' : '🔴 Focus Needed'}
          </div>
        </div>
      </Card>

      {/* Color-coded Text Display */}
      <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
        <h4 className="text-md font-semibold mb-4">Live Text Analysis</h4>
        <div className={`p-4 rounded-lg border ${
          themeMode === 'dark' ? 'bg-slate-700 border-slate-500' : 'bg-gray-50 border-gray-300'
        }`}>
          <div className="font-mono text-lg leading-relaxed">
            {renderColorCodedText()}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-xs">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-green-400 rounded"></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 border border-red-400 rounded"></div>
              <span>Error</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 border border-blue-400 rounded"></div>
              <span>Current Position</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 border border-gray-400 rounded"></div>
              <span>Not Typed</span>
            </div>
          </div>
          <div className="text-gray-500">
            Position: {currentInput.length}/{currentText.length}
          </div>
        </div>
      </Card>

      {/* Keyboard Error Heatmap */}
      <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
        <h4 className="text-md font-semibold mb-4">Keyboard Error Heatmap</h4>
        <div className="space-y-2">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 justify-center">
              {row.map(key => {
                const errorLevel = getKeyErrorLevel(key);
                const errorCount = errorAnalysis.errorsByChar[key] || 0;
                
                return (
                  <div
                    key={key}
                    className={cn(
                      "w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-mono transition-all duration-300 relative group",
                      errorLevel === 'none' && 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
                      errorLevel === 'low' && 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400',
                      errorLevel === 'medium' && 'bg-orange-100 dark:bg-orange-900/30 border-orange-500',
                      errorLevel === 'high' && 'bg-red-100 dark:bg-red-900/30 border-red-500 animate-pulse'
                    )}
                  >
                    {key.toUpperCase()}
                    {errorCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {errorCount}
                      </div>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {errorCount} error{errorCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Spacebar */}
          <div className="flex justify-center mt-2">
            <div
              className={cn(
                "w-48 h-10 rounded border-2 flex items-center justify-center text-xs font-mono transition-all duration-300",
                getKeyErrorLevel(' ') === 'none' && 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
                getKeyErrorLevel(' ') === 'low' && 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400',
                getKeyErrorLevel(' ') === 'medium' && 'bg-orange-100 dark:bg-orange-900/30 border-orange-500',
                getKeyErrorLevel(' ') === 'high' && 'bg-red-100 dark:bg-red-900/30 border-red-500 animate-pulse'
              )}
            >
              SPACE
              {(errorAnalysis.errorsByChar[' '] || 0) > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {errorAnalysis.errorsByChar[' ']}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 text-xs">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 rounded"></div>
              <span>No errors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded"></div>
              <span>1-2 errors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-500 rounded"></div>
              <span>3-5 errors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded"></div>
              <span>6+ errors</span>
            </div>
          </div>
          {errorAnalysis.mostProblematicChar && (
            <div className="text-orange-600 dark:text-orange-400">
              Most errors: "{errorAnalysis.mostProblematicChar}" 
              ({errorAnalysis.errorsByChar[errorAnalysis.mostProblematicChar]} times)
            </div>
          )}
        </div>
      </Card>

      {/* Error Pattern Analysis */}
      {errors.length > 0 && (
        <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
          <h4 className="text-md font-semibold mb-4">Error Patterns</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-3 text-sm">Most Common Errors</h5>
              <div className="space-y-2">
                {Object.entries(errorAnalysis.errorsByChar)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([char, count]) => (
                    <div key={char} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                          {char === ' ' ? '␣' : char}
                        </span>
                        <span className="text-sm">{count} errors</span>
                      </div>
                      <div className="w-20">
                        <Progress value={(count / Math.max(...Object.values(errorAnalysis.errorsByChar))) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-3 text-sm">Recent Error Trend</h5>
              <div className="flex items-center gap-2 text-sm">
                {errorAnalysis.recentErrors < 3 ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">Improving accuracy</span>
                  </>
                ) : errorAnalysis.recentErrors > 5 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">Focus needed</span>
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-400">Steady performance</span>
                  </>
                )}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>Tip: Take a brief pause when you see multiple errors. Slow, accurate typing builds better muscle memory than fast, error-prone typing.</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ErrorTrackingVisualization;