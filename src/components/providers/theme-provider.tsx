'use client';

import * as React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { Attribute } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  attribute,
  defaultTheme,
  enableSystem,
  storageKey,
}: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
    >
      {children}
    </NextThemeProvider>
  );
}