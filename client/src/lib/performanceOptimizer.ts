// Performance Optimization for Mobile Award-Winning Experience
export interface PerformanceMetrics {
  inputLatency: number;
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  batteryOptimized: boolean;
}

// Mobile Performance Monitor
class MobilePerformanceMonitor {
  private metrics: PerformanceMetrics = {
    inputLatency: 0,
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 60,
    batteryOptimized: false
  };

  private frameCount = 0;
  private lastFrameTime = performance.now();
  private inputTimestamps: number[] = [];

  // Monitor input latency (< 16ms target)
  measureInputLatency(): (callback: () => void) => void {
    return (callback: () => void) => {
      const startTime = performance.now();
      
      // Use requestAnimationFrame for optimal timing
      requestAnimationFrame(() => {
        callback();
        const endTime = performance.now();
        const latency = endTime - startTime;
        
        this.metrics.inputLatency = latency;
        this.inputTimestamps.push(latency);
        
        // Keep only recent measurements
        if (this.inputTimestamps.length > 100) {
          this.inputTimestamps.shift();
        }
        
        // Warn if latency exceeds mobile targets
        if (latency > 16) {
          console.warn(`Input latency ${latency.toFixed(2)}ms exceeds mobile target of 16ms`);
        }
      });
    };
  }

  // Monitor frame rate for smooth 60fps
  startFrameRateMonitoring(): void {
    const measureFrame = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;
      
      if (deltaTime > 0) {
        this.metrics.frameRate = 1000 / deltaTime;
        this.frameCount++;
      }
      
      this.lastFrameTime = currentTime;
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  }

  // Memory usage monitoring
  measureMemoryUsage(): void {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      this.metrics.memoryUsage = memInfo.usedJSHeapSize / (1024 * 1024); // MB
      
      // Warn if memory usage is high for mobile
      if (this.metrics.memoryUsage > 50) {
        console.warn(`Memory usage ${this.metrics.memoryUsage.toFixed(2)}MB exceeds mobile target of 50MB`);
      }
    }
  }

  // Battery optimization detection
  enableBatteryOptimization(): void {
    this.metrics.batteryOptimized = true;
    
    // Reduce animation complexity
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
    
    // Throttle non-essential updates
    this.throttleUpdates();
  }

  private throttleUpdates(): void {
    // Implement update throttling for battery conservation
    let lastUpdate = 0;
    const throttleDelay = 100; // ms
    
    window.addEventListener('scroll', (e) => {
      const now = performance.now();
      if (now - lastUpdate < throttleDelay) {
        e.preventDefault();
        return;
      }
      lastUpdate = now;
    }, { passive: false });
  }

  getMetrics(): PerformanceMetrics {
    this.measureMemoryUsage();
    return { ...this.metrics };
  }

  getAverageInputLatency(): number {
    if (this.inputTimestamps.length === 0) return 0;
    return this.inputTimestamps.reduce((sum, latency) => sum + latency, 0) / this.inputTimestamps.length;
  }
}

// Mobile-Specific Optimizations
class MobileOptimizer {
  private static instance: MobileOptimizer;
  private performanceMonitor = new MobilePerformanceMonitor();
  private optimizationsApplied = false;
  private gcIntervalId: number | null = null;

  static getInstance(): MobileOptimizer {
    if (!MobileOptimizer.instance) {
      MobileOptimizer.instance = new MobileOptimizer();
    }
    return MobileOptimizer.instance;
  }

  async applyMobileOptimizations(): Promise<void> {
    if (this.optimizationsApplied) return;

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) return;

    // Apply optimizations
    await Promise.all([
      this.optimizeRenderingPerformance(),
      this.optimizeMemoryUsage(),
      this.optimizeBatteryUsage(),
      this.optimizeInputResponsiveness()
    ]);

    // Start monitoring
    this.performanceMonitor.startFrameRateMonitoring();
    
    this.optimizationsApplied = true;
    console.log('Mobile optimizations applied successfully');
  }

  private async optimizeRenderingPerformance(): Promise<void> {
    // Enable hardware acceleration
    document.body.style.transform = 'translateZ(0)';
    
    // Optimize CSS for mobile
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      
      /* Mobile-optimized transitions */
      .mobile-optimized {
        will-change: transform;
        transform: translateZ(0);
      }
      
      /* Reduce motion for battery */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private async optimizeMemoryUsage(): Promise<void> {
    // Implement lazy loading for non-critical components
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
          }
        });
      });

      // Observe images and heavy components
      document.querySelectorAll('[data-lazy]').forEach(el => {
        observer.observe(el);
      });
    }

    // Clean up unused resources periodically - store interval ID for cleanup
    this.gcIntervalId = window.setInterval(() => {
      if (document.hidden) {
        // Garbage collection hint when app is backgrounded
        if ('gc' in window && typeof (window as any).gc === 'function') {
          (window as any).gc();
        }
      }
    }, 30000);
  }

  private async optimizeBatteryUsage(): Promise<void> {
    // Battery API optimization (where available)
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        
        if (battery.level < 0.2) {
          this.performanceMonitor.enableBatteryOptimization();
          console.log('Battery optimization enabled');
        }

        battery.addEventListener('levelchange', () => {
          if (battery.level < 0.2) {
            this.performanceMonitor.enableBatteryOptimization();
          }
        });
      } catch (error) {
        console.warn('Battery API not available');
      }
    }

    // Page visibility optimization - use the class method to allow for cleanup
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private async optimizeInputResponsiveness(): Promise<void> {
    // Use passive event listeners where possible
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'scroll'];
    
    passiveEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {}, { passive: true });
    });

    // Optimize touch handling
    document.body.style.touchAction = 'manipulation';
    
    // Fast click handling
    let touchStartTime = 0;
    document.addEventListener('touchstart', () => {
      touchStartTime = performance.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchDuration = performance.now() - touchStartTime;
      
      // Fast tap detection (< 150ms)
      if (touchDuration < 150) {
        // Immediate response for fast taps
        const target = e.target as HTMLElement;
        if (target && target.click) {
          e.preventDefault();
          target.click();
        }
      }
    });
  }

  private pauseNonEssentialProcesses(): void {
    // Pause animations
    document.querySelectorAll('[data-animation]').forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'paused';
    });

    // Reduce update frequency
    this.performanceMonitor.enableBatteryOptimization();
  }

  private resumeProcesses(): void {
    // Resume animations
    document.querySelectorAll('[data-animation]').forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'running';
    });
  }

  // Public API
  getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMonitor.getMetrics();
  }

  measureInputLatency(): (callback: () => void) => void {
    return this.performanceMonitor.measureInputLatency();
  }

  isOptimized(): boolean {
    return this.optimizationsApplied;
  }

  // Cleanup method to prevent memory leaks
  cleanup(): void {
    // Clear the garbage collection interval
    if (this.gcIntervalId !== null) {
      window.clearInterval(this.gcIntervalId);
      this.gcIntervalId = null;
    }
    
    // Clean up any other resources here
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  // Handler for visibility change events
  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.pauseNonEssentialProcesses();
    } else {
      this.resumeProcesses();
    }
  };
}

// Service Worker for Caching (PWA)
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }
};

// Export singleton
export const mobileOptimizer = MobileOptimizer.getInstance();

// Auto-initialize on module load
mobileOptimizer.applyMobileOptimizations();