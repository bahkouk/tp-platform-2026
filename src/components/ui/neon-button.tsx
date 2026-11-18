'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const neonButtonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-neon-cyan-500 text-white shadow neon-glow-cyan hover:scale-105',
        outline: 'border border-neon-cyan-500/30 bg-background/50 hover:bg-neon-cyan-500/10 hover:text-neon-cyan-400',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8',
        xl: 'h-14 px-10 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
  asChild?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(neonButtonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
NeonButton.displayName = 'NeonButton';

export { NeonButton, neonButtonVariants };