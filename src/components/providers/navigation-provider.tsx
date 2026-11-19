'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

type NavigationContextType = {
  pathname: string;
  searchParams: URLSearchParams;
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
  refresh: () => void;
};

const NavigationContext = React.createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <SessionProvider>
      <NavigationContext.Provider
        value={{
          pathname,
          searchParams: new URLSearchParams(searchParams?.toString() || ''),
          push: router.push.bind(router),
          replace: router.replace.bind(router),
          back: router.back.bind(router),
          refresh: router.refresh.bind(router),
        }}
      >
        {children}
      </NavigationContext.Provider>
    </SessionProvider>
  );
}

export function useNavigation() {
  const context = React.use(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}