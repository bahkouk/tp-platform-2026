import * as React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { NavigationProvider } from '@/components/providers/navigation-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TP Platform - 2030 Futuristic Document Hub',
  description: 'Upload, browse, and download TP (Tugas Pendek) documents in a sleek 2030 neon aesthetic',
  keywords: 'TP documents, Tugas Pendek, futuristic, neon, admin dashboard, document management',
  authors: [{ name: 'TP Platform Team' }],
  creator: 'TP Platform',
  publisher: 'TP Platform',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: 'TP Platform - 2030 Futuristic Document Hub',
    description: 'Upload, browse, and download TP (Tugas Pendek) documents in a sleek 2030 neon aesthetic',
    url: 'https://tpplatfom.vercel.app',
    siteName: 'TP Platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TP Platform - 2030 Neon Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TP Platform - 2030 Futuristic Document Hub',
    description: 'Upload, browse, and download TP (Tugas Pendek) documents in a sleek 2030 neon aesthetic',
    creator: '@tpplatfom',
    images: '/og-image.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`min-h-screen flex flex-col ${inter.variable} bg-background text-foreground font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="tp-platform-theme"
        >
          <NavigationProvider>
            <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-slate-900/50 to-background">
              {/* Neon Grid Background */}
              <div className="fixed inset-0 z-[-2] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,85,255,0.05)_1px,transparent_1px),linear-gradient(45deg,rgba(42,0,230,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>

              <div className="flex-1">
                {children}
              </div>
            </div>
          </NavigationProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}