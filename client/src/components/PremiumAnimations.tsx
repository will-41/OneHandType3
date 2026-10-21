import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../lib/utils';

// Floating card animation component
export const FloatingCard: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  delay?: number;
  intensity?: number;
}> = ({ children, className, delay = 0, intensity = 1 }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    let startTime: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = (currentTime - startTime + delay * 1000) / 1000;
      
      setOffset({
        x: Math.sin(elapsed * 0.5) * 2 * intensity,
        y: Math.sin(elapsed * 0.3) * 3 * intensity
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [delay, intensity]);

  return (
    <div 
      className={cn("transition-transform duration-100", className)}
      style={{ 
        transform: `translate(${offset.x}px, ${offset.y}px)` 
      }}
    >
      {children}
    </div>
  );
};

// Morphing shapes animation
export const MorphingShape: React.FC<{
  size?: number;
  color?: string;
  speed?: number;
}> = ({ size = 100, color = '#3B82F6', speed = 1 }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let animationId: number;
    let startTime: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000 * speed;
      
      if (pathRef.current) {
        const morphAmount = Math.sin(elapsed) * 20;
        const path = `M ${size/2 + morphAmount} 10 
                     Q ${size - 10} ${size/2 + morphAmount} ${size/2 - morphAmount} ${size - 10}
                     Q 10 ${size/2 - morphAmount} ${size/2 + morphAmount} 10`;
        pathRef.current.setAttribute('d', path);
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [size, speed]);

  return (
    <svg width={size} height={size} className="absolute">
      <path
        ref={pathRef}
        fill={color}
        opacity={0.1}
      />
    </svg>
  );
};

// Spring animation hook
export const useSpringAnimation = (
  isActive: boolean,
  config = { stiffness: 300, damping: 20 }
) => {
  const [transform, setTransform] = useState({ scale: 1, rotate: 0 });
  
  useEffect(() => {
    if (isActive) {
      setTransform({ scale: 1.1, rotate: 2 });
      const timer = setTimeout(() => {
        setTransform({ scale: 1, rotate: 0 });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return {
    style: {
      transform: `scale(${transform.scale}) rotate(${transform.rotate}deg)`,
      transition: `transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`
    }
  };
};

// Particle system for celebrations
export const ParticleSystem: React.FC<{
  isActive: boolean;
  color?: string;
  count?: number;
}> = ({ isActive, color = '#FFD700', count = 20 }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) return;

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1
    }));

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.2, // gravity
          life: particle.life - 0.02
        })).filter(particle => particle.life > 0)
      );
    }, 16);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, count]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.life,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

// Staggered animation for lists
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  delay?: number;
  className?: string;
}> = ({ children, delay = 100, className }) => {
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    children.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems(prev => Math.max(prev, index + 1));
      }, index * delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [children, delay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-500",
            index < visibleItems 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Glass morphism effect
export const GlassMorphism: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className, intensity = 0.1 }) => {
  return (
    <div 
      className={cn(
        "backdrop-blur-lg border border-white/20 rounded-lg",
        className
      )}
      style={{
        background: `rgba(255, 255, 255, ${intensity})`
      }}
    >
      {children}
    </div>
  );
};

// Typing wave effect
export const TypingWave: React.FC<{
  text: string;
  isActive: boolean;
  speed?: number;
}> = ({ text, isActive, speed = 100 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= text.length) {
          return 0;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isActive, text.length, speed]);

  return (
    <span>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={cn(
            "transition-all duration-300",
            index < currentIndex 
              ? "text-blue-500 scale-110" 
              : "text-gray-400 scale-100"
          )}
          style={{
            transitionDelay: `${index * 50}ms`
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

// Parallax scroll effect
export const ParallaxContainer: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        const rate = scrolled * speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`
      }}
    >
      {children}
    </div>
  );
};