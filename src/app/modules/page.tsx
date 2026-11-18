'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { ModuleCard } from '@/components/modules/module-card';
import { MODULES, Module } from '@/types';
import { Search, User, LogOut, Package, TrendingUp, Cpu, Bolt, FlaskConical, Activity } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useTPDocuments } from '@/hooks/use-documents';

export default function ModulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const { documents } = useTPDocuments();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchDocuments();
  }, [documents]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        // Update module counts based on actual documents
        const updatedModules = MODULES.map(module => ({
          ...module,
          count: data.filter((doc: any) => doc.module === module.slug).length,
        }));
        setModules(updatedModules);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Use default modules if fetch fails
      setModules(MODULES.map(m => ({ ...m })));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/docs?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-neon-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;
  const totalTPs = modules.reduce((sum, m) => sum + m.count, 0);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <AnimatedBackground />

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header with User Info */}
        <GlassCard className="p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan-500 to-neon-blue-500 flex items-center center overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Bienvenue, {user.name?.split(' ')[0] || 'Utilisateur'}
                </h1>
                <p className="text-gray-400 text-sm">
                  {totalTPs} TP{totalTPs !== 1 ? 's' : ''} disponible{totalTPs !== 1 ? 's' : ''} dans vos modules
                </p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher un TP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 outline-none text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-neon-cyan-500 to-neon-blue-500 rounded-lg hover:scale-105 transition-transform"
              >
                Rechercher
              </button>
            </form>

            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <a
                  href="/admin/dashboard"
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Admin
                </a>
              )}
              <button
                onClick={handleSignOut}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-cyan-400">{totalTPs}</div>
            <div className="text-xs text-gray-400">Total TPs</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-blue-400">{modules.length}</div>
            <div className="text-xs text-gray-400">Modules</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-purple-400">4</div>
            <div className="text-xs text-gray-400">Disciplines</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-pink-400">2025</div>
            <div className="text-xs text-gray-400">Année Académique</div>
          </GlassCard>
        </div>

        {/* Modules Grid */}
        <h2 className="text-3xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white to-neon-cyan-400 bg-clip-text text-transparent">
            Mes Modules
          </span>
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard key={module.slug} module={module} />
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Accès Rapide</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/modules/mecanique-solide"
              className="group glass-dark rounded-xl p-4 hover:scale-105 transition-transform border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-cyan-500/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-neon-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Mécanique du Solide</h4>
                  <p className="text-xs text-gray-400">{modules.find(m => m.slug === 'mecanique-solide')?.count || 0} TPs disponibles</p>
                </div>
              </div>
            </a>

            <a
              href="/modules/circuits-electriques"
              className="group glass-dark rounded-xl p-4 hover:scale-105 transition-transform border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-blue-500/20 flex items-center justify-center">
                  <Bolt className="w-5 h-5 text-neon-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Circuits Électriques</h4>
                  <p className="text-xs text-gray-400">{modules.find(m => m.slug === 'circuits-electriques')?.count || 0} TPs disponibles</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}