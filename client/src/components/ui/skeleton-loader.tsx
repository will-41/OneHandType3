import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', lines = 1, ...props }, ref) => {
    const baseStyles = "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] skeleton";
    
    if (variant === 'text' && lines > 1) {
      return (
        <div className="space-y-2" ref={ref} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseStyles,
                "h-4 rounded",
                i === lines - 1 ? "w-3/4" : "w-full",
                className
              )}
            />
          ))}
        </div>
      );
    }

    const variantStyles = {
      default: "h-4 w-full rounded",
      card: "h-32 w-full rounded-lg",
      text: "h-4 w-full rounded",
      avatar: "h-10 w-10 rounded-full",
      button: "h-10 w-24 rounded-md"
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Component-specific skeleton loaders
export const MenuSkeleton: React.FC = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="h-8 w-48" />
      <Skeleton variant="button" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton variant="card" />
          <Skeleton variant="text" className="h-6 w-3/4" />
          <Skeleton variant="text" lines={2} />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="h-8 w-64" />
      <Skeleton variant="avatar" />
    </div>
    
    {/* Performance Level Card */}
    <div className="space-y-4 p-6 rounded-lg border bg-card">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="h-6 w-32" />
        <Skeleton variant="button" className="h-6 w-20" />
      </div>
      <Skeleton variant="default" className="h-3 w-full" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton variant="text" className="h-8 w-12 mx-auto" />
            <Skeleton variant="text" className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-4 w-20" />
              <Skeleton variant="text" className="h-8 w-16" />
            </div>
            <Skeleton variant="avatar" className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
    
    {/* Chart Area */}
    <div className="space-y-4 p-6 rounded-lg border bg-card">
      <Skeleton variant="text" className="h-6 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" className="h-4 w-24" />
              <div className="flex space-x-4">
                <Skeleton variant="text" className="h-4 w-16" />
                <Skeleton variant="text" className="h-4 w-12" />
                <Skeleton variant="button" className="h-4 w-20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Skeleton variant="default" className="h-2" />
              <Skeleton variant="default" className="h-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const GameUISkeleton: React.FC = () => (
  <div className="w-full p-6 space-y-6 rounded-lg border bg-card">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton variant="avatar" className="h-8 w-8" />
        <Skeleton variant="button" className="h-6 w-20" />
      </div>
      <Skeleton variant="text" className="h-4 w-16" />
    </div>
    
    <div className="h-px bg-border" />
    
    <div className="grid grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Skeleton variant="avatar" className="h-4 w-4" />
            <Skeleton variant="text" className="h-4 w-20" />
          </div>
          <Skeleton variant="text" className="h-8 w-16" />
          <Skeleton variant="default" className="h-2" />
          <Skeleton variant="text" className="h-3 w-24" />
        </div>
      ))}
    </div>
    
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center space-x-2">
        <Skeleton variant="avatar" className="h-4 w-4" />
        <Skeleton variant="text" className="h-4 w-12" />
      </div>
      <Skeleton variant="text" className="h-3 w-16" />
    </div>
  </div>
);

export const TypingAreaSkeleton: React.FC = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-4 p-6 rounded-lg border bg-card">
      <Skeleton variant="text" className="h-6 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="text" lines={1} className="h-8" />
        ))}
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GameUISkeleton />
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <Skeleton variant="text" className="h-6 w-24" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} variant="button" className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;