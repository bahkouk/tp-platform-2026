'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Moon, Sun, Menu, X, Home, Book, Upload, LayoutDashboard, User, Package } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'All Modules', href: '/modules', icon: Package },
    { name: 'Documents', href: '/docs', icon: Book },
    ...(session?.user?.role === 'admin'
      ? [
          { name: 'Admin', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Upload', href: '/admin/upload', icon: Upload },
        ]
      : [{ name: 'Upload', href: '/upload', icon: Upload }]),
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan-500 to-neon-blue-500 flex items-center justify-center neon-glow-cyan">
              <Book className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-neon-cyan-400 bg-clip-text text-transparent">
              TP Platform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}

            {session ? (
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <User className="w-4 h-4" />
                Profile
              </Link>
            ) : (
              <Link href="/login" legacyBehavior>
                <NeonButton size="sm">Sign In</NeonButton>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10">
          <nav className="flex flex-col p-4 gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}

            {session ? (
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <User className="w-5 h-5" />
                Profile
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 w-full px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}