'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Upload, FileText, Users, Settings, BarChart3, Folder } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Document, TPDocument } from '@/types';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<TPDocument[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    uploads: 0,
    users: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push('/docs');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [docsRes, statsRes] = await Promise.all([
        fetch('/api/documents'),
        fetch('/api/admin/stats'),
      ]);

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.slice(0, 6));
      }

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-neon-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Upload, label: 'Upload Documents', href: '/admin/upload' },
    { icon: Folder, label: 'Manage Documents', href: '/admin/manage' },
    { icon: Users, label: 'User Management', href: '/admin/users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen pt-24">
      <AnimatedBackground />

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-neon-pink-400 to-neon-cyan-400 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-400">Manage TP documents and user accounts</p>
          </div>

          <Link href="/upload" legacyBehavior>
            <NeonButton className="neon-glow-pink">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </NeonButton>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Documents', value: stats.total, icon: FileText, color: 'neon-blue' },
            { label: 'This Month', value: stats.uploads, icon: Upload, color: 'neon-cyan' },
            { label: 'Users', value: stats.users, icon: Users, color: 'neon-purple' },
            { label: 'Pending', value: stats.pending, icon: BarChart3, color: 'neon-pink' },
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-6 text-center">
              <div className={`w-12 h-12 rounded-full bg-${stat.color}-500/20 flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
              <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href} legacyBehavior>
              <GlassCard className="p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                <link.icon className={`w-6 h-6 mx-auto mb-2 text-${link.label === 'Dashboard' ? 'neon-pink' : link.label === 'Upload Documents' ? 'neon-cyan' : link.label === 'Manage Documents' ? 'neon-blue' : link.label === 'User Management' ? 'neon-purple' : 'neon-green'}-500`} />
                <span className="text-sm font-medium text-gray-200">{link.label}</span>
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* Recent Documents */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{doc.title}</p>
                  <p className="text-sm text-gray-400">{doc.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500 mt-2">
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/docs/${doc.id}`} legacyBehavior>
                    <NeonButton variant="default" size="sm">
                      View
                    </NeonButton>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No recent uploads</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}