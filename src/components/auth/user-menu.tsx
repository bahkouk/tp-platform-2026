'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {session.user?.image ? (
            <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-neon-cyan-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-200">
          {session.user?.name || session.user?.email}
        </span>
      </button>

      {open && (
        <GlassCard className="absolute right-0 mt-2 w-48 z-50">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-xs text-gray-500">
              {session.user?.email}
            </div>
            <div className="h-px bg-white/10 my-1" />

            {session.user?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/5 rounded-lg"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/5 rounded-lg"
              onClick={() => setOpen(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            <button
              onClick={() => {
                signOut({ callbackUrl: '/' });
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-white/5 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}