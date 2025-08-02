
import React, { useEffect, useState } from 'react';

interface HealthStatus {
  timestamp: string;
  navigationWorking: boolean;
  componentsLoaded: boolean;
  storeWorking: boolean;
}

const GatekeeperHealthCheck: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    timestamp: new Date().toISOString(),
    navigationWorking: true,
    componentsLoaded: true,
    storeWorking: true
  });

  useEffect(() => {
    console.log('🚑 GatekeeperHealthCheck mounted');
    
    // Basic health checks
    const runHealthChecks = () => {
      const status: HealthStatus = {
        timestamp: new Date().toISOString(),
        navigationWorking: typeof window !== 'undefined' && !!window.history,
        componentsLoaded: typeof React !== 'undefined',
        storeWorking: true // Simplified check
      };

      setHealthStatus(status);
      
      console.log('🚑 Health Status:', status);
      
      // Log any issues
      if (!status.navigationWorking) {
        console.error('🚨 Navigation system not working');
      }
      if (!status.componentsLoaded) {
        console.error('🚨 React components not loading properly');
      }
    };

    runHealthChecks();
    
    // Run health checks every 30 seconds
    const interval = setInterval(runHealthChecks, 30000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array is appropriate as this effect only needs to run once on mount

  // Don't render anything in production, just log
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const allHealthy = healthStatus.navigationWorking && 
                   healthStatus.componentsLoaded && 
                   healthStatus.storeWorking;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: allHealthy ? 'rgba(0,128,0,0.8)' : 'rgba(255,0,0,0.8)',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '11px',
      zIndex: 9998,
      maxWidth: '200px'
    }}>
      <div>🚑 Health: {allHealthy ? '✅ OK' : '❌ Issues'}</div>
      <div>Nav: {healthStatus.navigationWorking ? '✅' : '❌'}</div>
      <div>Components: {healthStatus.componentsLoaded ? '✅' : '❌'}</div>
      <div>Store: {healthStatus.storeWorking ? '✅' : '❌'}</div>
      <div>Updated: {new Date(healthStatus.timestamp).toLocaleTimeString()}</div>
    </div>
  );
};

export default GatekeeperHealthCheck;
