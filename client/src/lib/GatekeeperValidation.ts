/**
 * Gatekeeper Validation System for OneHandType Curriculum Quality Assurance
 * 
 * This system ensures that all curriculum components meet high-quality standards
 * for accessibility, user experience, educational effectiveness, and Game of Thrones theming.
 */

import { gamifiedCurriculum, type CurriculumLevel, type CurriculumLesson } from './gamifiedCurriculum';

// ============================================================================
// VALIDATION CRITERIA AND INTERFACES
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: ValidationIssue[];
  recommendations: string[];
  summary: string;
}

interface ValidationIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'accessibility' | 'content' | 'progression' | 'theming' | 'ux' | 'performance';
  message: string;
  location?: string;
  suggestedFix?: string;
}

interface QualityMetrics {
  accessibility: number;
  educational: number;
  engagement: number;
  progression: number;
  theming: number;
  technical: number;
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

class CurriculumGatekeeper {
  private readonly MINIMUM_PASSING_SCORE = 85;
  private readonly CRITICAL_ISSUE_THRESHOLD = 0; // No critical issues allowed
  
  /**
   * Main validation entry point
   */
  validateCurriculum(): ValidationResult {
    console.log('🛡️  Gatekeeper: Beginning comprehensive curriculum validation...');
    
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];
    
    // Run all validation checks
    issues.push(...this.validateStructuralIntegrity());
    issues.push(...this.validateAccessibilityCompliance());
    issues.push(...this.validateEducationalProgression());
    issues.push(...this.validateGameOfThronesTheming());
    issues.push(...this.validateUserExperience());
    issues.push(...this.validateTechnicalImplementation());
    
    // Generate recommendations
    recommendations.push(...this.generateRecommendations(issues));
    
    // Calculate overall score
    const score = this.calculateQualityScore(issues);
    const criticalIssues = issues.filter(issue => issue.severity === 'critical').length;
    
    const isValid = score >= this.MINIMUM_PASSING_SCORE && criticalIssues <= this.CRITICAL_ISSUE_THRESHOLD;
    
    const summary = this.generateValidationSummary(isValid, score, issues);
    
    console.log(`🛡️  Gatekeeper: Validation complete. Score: ${score}/100, Status: ${isValid ? 'PASSED' : 'FAILED'}`);
    
    return {
      isValid,
      score,
      issues,
      recommendations,
      summary
    };
  }

  /**
   * Validate curriculum structural integrity
   */
  private validateStructuralIntegrity(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check curriculum completeness
    if (gamifiedCurriculum.length !== 10) {
      issues.push({
        severity: 'critical',
        category: 'content',
        message: `Curriculum must have exactly 10 levels, found ${gamifiedCurriculum.length}`,
        location: 'gamifiedCurriculum',
        suggestedFix: 'Add missing levels to complete the Seven Kingdoms journey'
      });
    }
    
    // Validate each level
    gamifiedCurriculum.forEach((level, index) => {
      if (!level.id || !level.title || !level.description) {
        issues.push({
          severity: 'critical',
          category: 'content',
          message: `Level ${index + 1} missing required fields`,
          location: `level-${level.id}`,
          suggestedFix: 'Ensure all levels have id, title, and description'
        });
      }
      
      if (level.lessons.length === 0) {
        issues.push({
          severity: 'high',
          category: 'content',
          message: `Level ${index + 1} has no lessons`,
          location: `level-${level.id}`,
          suggestedFix: 'Add at least 3 lessons per level for proper learning progression'
        });
      }
      
      // Validate lesson progression within level
      level.lessons.forEach((lesson, lessonIndex) => {
        if (lessonIndex > 0) {
          const prevLesson = level.lessons[lessonIndex - 1];
          if (lesson.targetWpm < prevLesson.targetWpm) {
            issues.push({
              severity: 'medium',
              category: 'progression',
              message: `Lesson ${lesson.id} has lower WPM target than previous lesson`,
              location: `${level.id}-${lesson.id}`,
              suggestedFix: 'Ensure WPM targets increase progressively within each level'
            });
          }
        }
      });
    });
    
    return issues;
  }

  /**
   * Validate accessibility compliance (WCAG 2.2 AA/AAA)
   */
  private validateAccessibilityCompliance(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    gamifiedCurriculum.forEach(level => {
      // Check accessibility focus
      if (!level.accessibilityFocus || level.accessibilityFocus.length === 0) {
        issues.push({
          severity: 'high',
          category: 'accessibility',
          message: `Level ${level.title} missing accessibility focus areas`,
          location: level.id,
          suggestedFix: 'Add specific accessibility considerations for users with disabilities'
        });
      }
      
      level.lessons.forEach(lesson => {
        // Check adaptive features
        if (!lesson.adaptiveFeatures.fatiguePrevention) {
          issues.push({
            severity: 'medium',
            category: 'accessibility',
            message: `Lesson ${lesson.title} missing fatigue prevention features`,
            location: lesson.id,
            suggestedFix: 'Enable fatigue prevention for all lessons'
          });
        }
        
        // Check content length for cognitive accessibility
        if (lesson.content.length > 200) {
          issues.push({
            severity: 'low',
            category: 'accessibility',
            message: `Lesson ${lesson.title} content may be too long for users with cognitive limitations`,
            location: lesson.id,
            suggestedFix: 'Consider breaking longer content into smaller chunks'
          });
        }
        
        // Validate practice text variety
        if (lesson.practiceText.length < 3) {
          issues.push({
            severity: 'medium',
            category: 'accessibility',
            message: `Lesson ${lesson.title} needs more practice text variety`,
            location: lesson.id,
            suggestedFix: 'Add at least 3 different practice texts for varied learning'
          });
        }
      });
    });
    
    return issues;
  }

  /**
   * Validate educational progression and learning effectiveness
   */
  private validateEducationalProgression(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check overall progression curve
    for (let i = 1; i < gamifiedCurriculum.length; i++) {
      const currentLevel = gamifiedCurriculum[i];
      const prevLevel = gamifiedCurriculum[i - 1];
      
      if (currentLevel.unlockRequirements.minimumWpm <= prevLevel.unlockRequirements.minimumWpm) {
        issues.push({
          severity: 'high',
          category: 'progression',
          message: `Level ${i + 1} doesn't progress from previous level requirements`,
          location: currentLevel.id,
          suggestedFix: 'Ensure each level requires higher WPM than the previous'
        });
      }
      
      if (currentLevel.unlockRequirements.minimumAccuracy < prevLevel.unlockRequirements.minimumAccuracy) {
        issues.push({
          severity: 'medium',
          category: 'progression',
          message: `Level ${i + 1} has lower accuracy requirement than previous level`,
          location: currentLevel.id,
          suggestedFix: 'Maintain or increase accuracy requirements across levels'
        });
      }
    }
    
    // Validate difficulty progression
    gamifiedCurriculum.forEach((level, levelIndex) => {
      level.lessons.forEach((lesson, lessonIndex) => {
        // Check if difficulty is appropriate for level position
        const expectedMinDifficulty = Math.ceil((levelIndex + 1) / 2);
        if (lesson.difficulty < expectedMinDifficulty) {
          issues.push({
            severity: 'low',
            category: 'progression',
            message: `Lesson ${lesson.title} difficulty may be too low for level ${levelIndex + 1}`,
            location: lesson.id,
            suggestedFix: `Consider increasing difficulty to at least ${expectedMinDifficulty}`
          });
        }
        
        // Check estimated time reasonableness
        if (lesson.estimatedTime < 5 || lesson.estimatedTime > 45) {
          issues.push({
            severity: 'medium',
            category: 'ux',
            message: `Lesson ${lesson.title} has unrealistic time estimate (${lesson.estimatedTime} min)`,
            location: lesson.id,
            suggestedFix: 'Set realistic time estimates between 5-45 minutes'
          });
        }
      });
    });
    
    return issues;
  }

  /**
   * Validate Game of Thrones theming consistency and quality
   */
  private validateGameOfThronesTheming(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    const expectedKingdoms = [
      'The North', 'The Riverlands', 'The Reach', 'The Westerlands',
      'The Stormlands', 'The Vale', 'Dorne', 'Iron Islands',
      'Beyond the Wall', 'King\'s Landing'
    ];
    
    gamifiedCurriculum.forEach((level, index) => {
      // Check GOT theme completeness
      if (!level.gotTheme.kingdom || !level.gotTheme.storyline || !level.gotTheme.characterArc) {
        issues.push({
          severity: 'high',
          category: 'theming',
          message: `Level ${level.title} incomplete Game of Thrones theming`,
          location: level.id,
          suggestedFix: 'Complete all GOT theme fields: kingdom, storyline, characterArc, majorQuest'
        });
      }
      
      // Validate kingdom progression matches GOT lore
      const expectedKingdom = expectedKingdoms[index];
      if (!level.gotTheme.kingdom.includes(expectedKingdom)) {
        issues.push({
          severity: 'medium',
          category: 'theming',
          message: `Level ${index + 1} kingdom doesn't match expected progression`,
          location: level.id,
          suggestedFix: `Expected kingdom containing "${expectedKingdom}"`
        });
      }
      
      level.lessons.forEach(lesson => {
        // Check lesson GOT theming
        if (!lesson.gotTheme.character || !lesson.gotTheme.house || !lesson.gotTheme.flavorText) {
          issues.push({
            severity: 'medium',
            category: 'theming',
            message: `Lesson ${lesson.title} incomplete GOT character theming`,
            location: lesson.id,
            suggestedFix: 'Add character, house, and flavor text for immersive experience'
          });
        }
        
        // Check flavor text quality
        if (lesson.gotTheme.flavorText && lesson.gotTheme.flavorText.length < 20) {
          issues.push({
            severity: 'low',
            category: 'theming',
            message: `Lesson ${lesson.title} flavor text too brief`,
            location: lesson.id,
            suggestedFix: 'Expand flavor text to be more immersive (20+ characters)'
          });
        }
      });
    });
    
    return issues;
  }

  /**
   * Validate user experience and interface design
   */
  private validateUserExperience(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    gamifiedCurriculum.forEach(level => {
      // Check reward system completeness
      if (!level.levelRewards.title || !level.levelRewards.badge) {
        issues.push({
          severity: 'medium',
          category: 'ux',
          message: `Level ${level.title} missing reward elements`,
          location: level.id,
          suggestedFix: 'Ensure all levels have title and badge rewards'
        });
      }
      
      level.lessons.forEach(lesson => {
        // Check reward balance
        if (lesson.rewards.xp < 50 || lesson.rewards.xp > 2000) {
          issues.push({
            severity: 'low',
            category: 'ux',
            message: `Lesson ${lesson.title} XP reward seems unbalanced (${lesson.rewards.xp})`,
            location: lesson.id,
            suggestedFix: 'Balance XP rewards between 50-2000 based on difficulty'
          });
        }
        
        // Check skills array
        if (lesson.skills.length === 0) {
          issues.push({
            severity: 'medium',
            category: 'ux',
            message: `Lesson ${lesson.title} missing skill learning objectives`,
            location: lesson.id,
            suggestedFix: 'Add specific skills that this lesson teaches'
          });
        }
      });
    });
    
    return issues;
  }

  /**
   * Validate technical implementation quality
   */
  private validateTechnicalImplementation(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check for TypeScript compliance
    gamifiedCurriculum.forEach(level => {
      level.lessons.forEach(lesson => {
        // Validate required fields
        if (!lesson.id.match(/^lesson-\d+-\d+$/)) {
          issues.push({
            severity: 'medium',
            category: 'content',
            message: `Lesson ${lesson.title} ID doesn't follow naming convention`,
            location: lesson.id,
            suggestedFix: 'Use format: lesson-{level}-{number} (e.g., lesson-1-1)'
          });
        }
        
        // Check prerequisites format
        lesson.prerequisites.forEach(prereq => {
          if (!prereq.match(/^lesson-\d+-\d+$/)) {
            issues.push({
              severity: 'low',
              category: 'content',
              message: `Invalid prerequisite format in ${lesson.title}`,
              location: lesson.id,
              suggestedFix: 'Use proper lesson ID format for prerequisites'
            });
          }
        });
      });
    });
    
    return issues;
  }

  /**
   * Generate recommendations based on issues found
   */
  private generateRecommendations(issues: ValidationIssue[]): string[] {
    const recommendations: string[] = [];
    
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;
    const accessibilityIssues = issues.filter(i => i.category === 'accessibility').length;
    
    if (criticalCount > 0) {
      recommendations.push('❌ CRITICAL: Address all critical issues before deployment');
    }
    
    if (highCount > 3) {
      recommendations.push('⚠️  Consider reviewing curriculum structure - many high-priority issues found');
    }
    
    if (accessibilityIssues > 5) {
      recommendations.push('♿ Accessibility review needed - ensure WCAG 2.2 AA compliance');
    }
    
    // Category-specific recommendations
    const categories = ['content', 'progression', 'theming', 'ux', 'accessibility'];
    categories.forEach(category => {
      const categoryIssues = issues.filter(i => i.category === category);
      if (categoryIssues.length > 3) {
        recommendations.push(`📋 Focus on ${category} improvements - ${categoryIssues.length} issues found`);
      }
    });
    
    if (issues.length === 0) {
      recommendations.push('✅ Excellent! Curriculum meets all quality standards');
    }
    
    return recommendations;
  }

  /**
   * Calculate overall quality score
   */
  private calculateQualityScore(issues: ValidationIssue[]): number {
    let score = 100;
    
    // Deduct points based on issue severity
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
      }
    });
    
    return Math.max(0, score);
  }

  /**
   * Generate validation summary
   */
  private generateValidationSummary(isValid: boolean, score: number, issues: ValidationIssue[]): string {
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;
    const totalIssues = issues.length;
    
    let summary = `Gatekeeper Validation ${isValid ? 'PASSED' : 'FAILED'}\n`;
    summary += `Overall Quality Score: ${score}/100\n`;
    summary += `Total Issues Found: ${totalIssues}\n`;
    summary += `├─ Critical: ${criticalCount}\n`;
    summary += `├─ High: ${highCount}\n`;
    summary += `├─ Medium: ${issues.filter(i => i.severity === 'medium').length}\n`;
    summary += `└─ Low: ${issues.filter(i => i.severity === 'low').length}\n`;
    
    if (isValid) {
      summary += '\n✅ Curriculum approved for deployment!';
    } else {
      summary += '\n❌ Curriculum requires fixes before deployment.';
    }
    
    return summary;
  }

  /**
   * Generate detailed quality metrics
   */
  calculateQualityMetrics(): QualityMetrics {
    const issues = [
      ...this.validateStructuralIntegrity(),
      ...this.validateAccessibilityCompliance(),
      ...this.validateEducationalProgression(),
      ...this.validateGameOfThronesTheming(),
      ...this.validateUserExperience(),
      ...this.validateTechnicalImplementation()
    ];
    
    // Calculate category-specific scores
    const categories = ['accessibility', 'content', 'progression', 'theming', 'ux', 'technical'];
    const scores: any = {};
    
    categories.forEach(category => {
      const categoryIssues = issues.filter(i => i.category === category);
      let categoryScore = 100;
      
      categoryIssues.forEach(issue => {
        switch (issue.severity) {
          case 'critical': categoryScore -= 30; break;
          case 'high': categoryScore -= 15; break;
          case 'medium': categoryScore -= 8; break;
          case 'low': categoryScore -= 3; break;
        }
      });
      
      scores[category] = Math.max(0, categoryScore);
    });
    
    return {
      accessibility: scores.accessibility || 100,
      educational: scores.progression || 100,
      engagement: scores.ux || 100,
      progression: scores.content || 100,
      theming: scores.theming || 100,
      technical: scores.technical || 100
    };
  }
}

// ============================================================================
// EXPORT AND UTILITY FUNCTIONS
// ============================================================================

export const gatekeeper = new CurriculumGatekeeper();

/**
 * Run comprehensive curriculum validation
 */
export function validateCurriculumQuality(): ValidationResult {
  return gatekeeper.validateCurriculum();
}

/**
 * Get quality metrics breakdown
 */
export function getCurriculumQualityMetrics(): QualityMetrics {
  return gatekeeper.calculateQualityMetrics();
}

/**
 * Quick validation check for deployment readiness
 */
export function isDeploymentReady(): boolean {
  const result = validateCurriculumQuality();
  return result.isValid;
}

/**
 * Generate validation report for stakeholders
 */
export function generateValidationReport(): string {
  const result = validateCurriculumQuality();
  const metrics = getCurriculumQualityMetrics();
  
  let report = '# OneHandType Curriculum Quality Assurance Report\n\n';
  report += `**Validation Date:** ${new Date().toISOString()}\n`;
  report += `**Overall Status:** ${result.isValid ? '✅ APPROVED' : '❌ REQUIRES FIXES'}\n`;
  report += `**Quality Score:** ${result.score}/100\n\n`;
  
  report += '## Quality Metrics\n';
  report += `- **Accessibility:** ${metrics.accessibility}/100\n`;
  report += `- **Educational Design:** ${metrics.educational}/100\n`;
  report += `- **User Engagement:** ${metrics.engagement}/100\n`;
  report += `- **Content Progression:** ${metrics.progression}/100\n`;
  report += `- **Game of Thrones Theming:** ${metrics.theming}/100\n`;
  report += `- **Technical Implementation:** ${metrics.technical}/100\n\n`;
  
  if (result.issues.length > 0) {
    report += '## Issues Found\n';
    result.issues.forEach((issue, index) => {
      report += `${index + 1}. **${issue.severity.toUpperCase()}** (${issue.category}): ${issue.message}\n`;
      if (issue.location) report += `   - Location: ${issue.location}\n`;
      if (issue.suggestedFix) report += `   - Fix: ${issue.suggestedFix}\n`;
      report += '\n';
    });
  }
  
  if (result.recommendations.length > 0) {
    report += '## Recommendations\n';
    result.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    report += '\n';
  }
  
  report += '## Summary\n';
  report += result.summary;
  
  return report;
}