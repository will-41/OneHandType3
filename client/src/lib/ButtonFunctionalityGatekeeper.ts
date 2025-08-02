/**
 * Gatekeeper Agent: UI/UX Functionality Validation
 * Zero tolerance for non-functional buttons and broken navigation
 */

export interface ButtonAuditResult {
  component: string;
  location: string;
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'broken' | 'partial' | 'working';
  suggestedFix: string;
}

export interface NavigationValidation {
  isValid: boolean;
  totalButtons: number;
  functionalButtons: number;
  brokenButtons: number;
  score: number;
  criticalIssues: ButtonAuditResult[];
  allIssues: ButtonAuditResult[];
}

export class UIFunctionalityGatekeeper {
  private readonly MINIMUM_FUNCTIONALITY_SCORE = 95; // 95% of buttons must work
  private readonly CRITICAL_ELEMENTS = [
    'Start Game',
    'Settings',
    'Back/Cancel',
    'Save',
    'Lesson Navigation'
  ];

  /**
   * Validates all button functionality in the application
   */
  validateButtonFunctionality(auditResults: ButtonAuditResult[]): NavigationValidation {
    const totalButtons = auditResults.length;
    const brokenButtons = auditResults.filter(r => r.status === 'broken').length;
    const functionalButtons = totalButtons - brokenButtons;
    const score = (functionalButtons / totalButtons) * 100;
    
    const criticalIssues = auditResults.filter(r => 
      r.severity === 'critical' && r.status === 'broken'
    );

    const isValid = score >= this.MINIMUM_FUNCTIONALITY_SCORE && 
                   criticalIssues.length === 0;

    return {
      isValid,
      totalButtons,
      functionalButtons,
      brokenButtons,
      score: Math.round(score),
      criticalIssues,
      allIssues: auditResults
    };
  }

  /**
   * Identifies button functionality issues
   */
  identifyIssues(): ButtonAuditResult[] {
    return [
      {
        component: 'EnhancedMainMenu',
        location: 'MultiplayerRace section',
        element: 'Coming Soon Button',
        issue: 'Button is permanently disabled with no functionality',
        severity: 'high',
        status: 'broken',
        suggestedFix: 'Add tooltip explaining when feature will be available or implement basic functionality'
      },
      {
        component: 'EnhancedMainMenu',
        location: 'Sound Feedback System',
        element: 'Configure Buttons',
        issue: 'Missing onClick handlers for audio configuration',
        severity: 'high',
        status: 'broken',
        suggestedFix: 'Implement audio configuration modal or settings panel'
      },
      {
        component: 'EnhancedMainMenu',
        location: 'Social Sharing',
        element: 'Share Button',
        issue: 'No onClick handler for social sharing',
        severity: 'medium',
        status: 'broken',
        suggestedFix: 'Implement Web Share API or social media integration'
      },
      {
        component: 'GameOfThronesLessonNavigator',
        location: 'Level Cards',
        element: 'Locked Level Cards',
        issue: 'No feedback when clicking locked content',
        severity: 'medium',
        status: 'partial',
        suggestedFix: 'Add tooltip or modal explaining unlock requirements'
      },
      {
        component: 'EnhancedPremiumThemeSystem',
        location: 'Theme Cards',
        element: 'Locked Theme Cards',
        issue: 'No feedback when clicking locked themes',
        severity: 'medium',
        status: 'partial',
        suggestedFix: 'Show unlock requirements in a tooltip or modal'
      },
      {
        component: 'Global',
        location: 'CSS Variables',
        element: 'Color definitions',
        issue: 'HSL wrapper around CSS variables may cause rendering issues',
        severity: 'low',
        status: 'partial',
        suggestedFix: 'Ensure CSS variables contain complete HSL values or remove wrapper'
      }
    ];
  }

  /**
   * Generates implementation fixes for broken buttons
   */
  generateFixes(): Record<string, string> {
    return {
      'multiplayer-coming-soon': `
        // Add to EnhancedMainMenu.tsx
        const handleComingSoon = (feature: string) => {
          toast({
            title: "Coming Soon!",
            description: \`\${feature} will be available in the next update.\`,
            duration: 3000,
          });
        };
        
        // Replace disabled button with:
        <Button onClick={() => handleComingSoon('Multiplayer Racing')}>
          Coming Soon
        </Button>
      `,
      
      'audio-configure': `
        // Add audio configuration handler
        const [showAudioConfig, setShowAudioConfig] = useState(false);
        
        const handleAudioConfigure = (type: 'background' | 'effects' | 'voice') => {
          setShowAudioConfig(true);
          setAudioConfigType(type);
        };
        
        // Update button:
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleAudioConfigure('background')}
        >
          Configure
        </Button>
      `,
      
      'social-sharing': `
        // Implement Web Share API
        const handleShare = async () => {
          const shareData = {
            title: 'OneHandType - My Progress',
            text: \`I've completed \${completedLessons.length} lessons!\`,
            url: window.location.origin,
          };
          
          try {
            if (navigator.share) {
              await navigator.share(shareData);
            } else {
              // Fallback to copy link
              await navigator.clipboard.writeText(shareData.url);
              toast({
                title: "Link Copied!",
                description: "Share link copied to clipboard.",
              });
            }
          } catch (err) {
            console.error('Error sharing:', err);
          }
        };
        
        // Update button:
        <Button className="w-full" onClick={handleShare}>
          Share on Social Media
        </Button>
      `,
      
      'locked-content-feedback': `
        // Add tooltip for locked content
        import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card 
                className={cn(/* existing classes */, !isUnlocked && "cursor-not-allowed")}
                onClick={isUnlocked ? onSelect : () => {}}
              >
                {/* Card content */}
              </Card>
            </TooltipTrigger>
            {!isUnlocked && (
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">Locked</p>
                  <p>Complete requirements to unlock:</p>
                  <ul className="list-disc list-inside mt-1">
                    {/* Show requirements */}
                  </ul>
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      `,
      
      'css-variables-fix': `
        // Update CSS variable definitions in index.css
        /* Remove HSL wrapper from usage */
        /* Change from: bg-[hsl(var(--difficulty-1))] */
        /* To: bg-difficulty-1 */
        
        /* Add to tailwind.config.js */
        theme: {
          extend: {
            colors: {
              'difficulty-1': 'hsl(var(--difficulty-1))',
              'difficulty-2': 'hsl(var(--difficulty-2))',
              // etc...
            }
          }
        }
      `
    };
  }
}

// Export singleton instance
export const uiGatekeeper = new UIFunctionalityGatekeeper();

/**
 * Run complete UI functionality audit
 */
export function auditUIFunctionality(): NavigationValidation {
  const issues = uiGatekeeper.identifyIssues();
  return uiGatekeeper.validateButtonFunctionality(issues);
}

/**
 * Get implementation fixes
 */
export function getImplementationFixes(): Record<string, string> {
  return uiGatekeeper.generateFixes();
}