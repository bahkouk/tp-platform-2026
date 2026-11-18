'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { User, Shield, Calendar, Folder } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    documents: 0,
    role: 'user',
    joinDate: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserStats();
    }
  }, [session]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const docs = await response.json();
        setUserStats(prev => ({ ...prev, documents: docs.length }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-neon-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24">
      <AnimatedBackground />

      <div className="container mx-auto px-4 max-w-4xl py-8">
        <h1 className="text-4xl font-bold mb-8">
          <span className="bg-gradient-to-r from-neon-blue-400 to-neon-cyan-400 bg-clip-text text-transparent">
            Your Profile
          </span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan-500 to-neon-blue-500 flex items-center justify-center mx-auto mb-4 neon-glow-cyan">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">{session.user?.name || 'User'}</h2>
              <p className="text-gray-400 mb-4">{session.user?.email}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-purple-500/20 text-neon-purple-400 text-sm rounded-full">
                <Shield className="w-4 h-4" />
                {session.user?.role === 'admin' ? 'Administrator' : 'Student'}
              </div>
            </div>
          </GlassCard>

          {/* Stats */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5 text-neon-cyan-400" />
                  <span>Documents Downloaded</span>
                </div>
                <span className="font-semibold text-neon-cyan-400">{userStats.documents}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-neon-blue-400" />
                  <span>Account Type</span>
                </div>
                <span className="font-semibold">{session.user?.role === 'admin' ? 'Admin' : 'User'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-neon-green-400" />
                  <span>Member Since</span>
                </div>
                <span className="font-semibold text-gray-300">{userStats.joinDate || 'N/A'}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}