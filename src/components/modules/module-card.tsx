'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Module } from '@/types';
import { GetIcon } from './icon-utils';

// Color mapping for Tailwind classes - using consistent naming
type ColorKey = 'cyan' | 'blue' | 'purple' | 'pink';

const getColorClasses = (color: string): Record<string, string> => {
  const colorMap: Record<string, ColorKey> = {
    'neon-cyan': 'cyan',
    'neon-blue': 'blue',
    'neon-purple': 'purple',
    'neon-pink': 'pink',
  };

  const key = colorMap[color] || 'cyan';
  return {
    bg: `bg-neon-${key}-500`,
    bgLight: `bg-neon-${key}-500/20`,
    text: `text-neon-${key}-400`,
    glow: `neon-glow-${key}`,
    border: `border-neon-${key}-500`,
    count: `bg-neon-${key}-500/20 text-neon-${key}-400`,
    gradientFrom: `from-neon-${key}-400`,
    gradientTo: 'to-neon-cyan-400',
  };
};

interface ModuleCardProps {
  module: Module;
  onClick?: () => void;
}

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const IconComponent = GetIcon(module.icon);
  const colors = getColorClasses(module.color);

  return (
    <Link
      href={`/modules/${module.slug}`}
      onClick={onClick}
      className="group relative"
    >
      <div className={cn(
        "glass-dark rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105",
        "border border-white/10 hover:border-white/20",
        "bg-gradient-to-br from-white/5 to-white/2.5",
        "overflow-hidden"
      )}>
        {/* Neon glow effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          colors.glow
        )} />

        {/* Glowing border accent */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          colors.border
        )} />

        <div className="relative z-10">
          {/* Icon Container */}
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4",
            colors.bgLight
          )}>
            <IconComponent className={colors.text} />
          </div>

          {/* Title */}
          <h3 className={cn(
            "text-xl font-bold mb-2",
            "bg-gradient-to-r",
            colors.gradientFrom,
            colors.gradientTo,
            "bg-clip-text text-transparent"
          )}>
            {module.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {module.description}
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                colors.count
              )}>
                {module.count} TPs
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-xs">{module.difficulty}/5</span>
              <span>•</span>
              <span className="text-xs">{module.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}