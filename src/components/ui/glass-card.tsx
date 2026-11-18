'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className, style }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-dark rounded-xl p-4 sm:p-6 backdrop-blur-sm transition-all duration-300',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}