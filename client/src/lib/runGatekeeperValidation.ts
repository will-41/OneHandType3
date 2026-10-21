/**
 * Test script to run Gatekeeper validation on the curriculum
 */

import { validateCurriculumQuality, generateValidationReport, isDeploymentReady } from './GatekeeperValidation';

// Run the validation
console.log('🛡️  Starting Gatekeeper Validation...\n');

const result = validateCurriculumQuality();
const report = generateValidationReport();
const deploymentReady = isDeploymentReady();

console.log('='.repeat(80));
console.log(report);
console.log('='.repeat(80));

console.log('\n📊 VALIDATION SUMMARY:');
console.log(`Status: ${result.isValid ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Score: ${result.score}/100`);
console.log(`Issues: ${result.issues.length}`);
console.log(`Deployment Ready: ${deploymentReady ? '✅ YES' : '❌ NO'}`);

if (result.issues.length > 0) {
  console.log('\n🔍 CRITICAL ISSUES:');
  const criticalIssues = result.issues.filter(issue => issue.severity === 'critical');
  criticalIssues.forEach(issue => {
    console.log(`❌ ${issue.message} (${issue.location || 'unknown location'})`);
  });
  
  console.log('\n⚠️  HIGH PRIORITY ISSUES:');
  const highIssues = result.issues.filter(issue => issue.severity === 'high');
  highIssues.forEach(issue => {
    console.log(`⚠️  ${issue.message} (${issue.location || 'unknown location'})`);
  });
}

console.log('\n🎯 RECOMMENDATIONS:');
result.recommendations.forEach(rec => {
  console.log(`• ${rec}`);
});

export { result, report, deploymentReady };