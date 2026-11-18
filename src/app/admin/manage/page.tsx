'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TPDocument } from '@/types';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { LayoutDashboard, Upload, FileText, Search, Edit2, Trash2, Download, Users, BarChart3, Folder } from 'lucide-react';
import Link from 'next/link';

export default function ManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<TPDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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

    fetchDocuments();
  }, [session, status, router]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        setDocuments(await response.json());
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchDocuments();
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
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
  ];

  return (
    <div className="min-h-screen pt-24">
      <AnimatedBackground />

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-neon-purple-400 to-neon-pink-400 bg-clip-text text-transparent">
                Manage Documents
              </span>
            </h1>
            <p className="text-gray-400">Browse, edit, and organize all TP documents</p>
          </div>

          <div className="flex gap-4">
            <Link href="/admin/dashboard" legacyBehavior>
              <NeonButton variant="ghost" size="sm">
                Dashboard
              </NeonButton>
            </Link>
            <Link href="/admin/upload" legacyBehavior>
              <NeonButton className="neon-glow-pink">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </NeonButton>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <GlassCard className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents by title, subject, or tags..."
                className="w-full bg-transparent outline-none text-white placeholder-gray-400 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </GlassCard>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i} className="animate-pulse">
                <div className="h-48 bg-white/5 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <GlassCard className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neon-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-neon-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No documents found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Upload your first document to get started'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="neon-glow-cyan"
              >
                Clear search
              </button>
            )}
          </GlassCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <GlassCard key={doc.id} className="p-6 hover:scale-105 transition-transform">
                <div className="h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 truncate">{doc.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{doc.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="px-2 py-1 text-xs bg-neon-blue-500/20 text-neon-blue-400 rounded">
                    {doc.subject}
                  </span>
                  <span className="px-2 py-1 text-xs bg-neon-cyan-500/20 text-neon-cyan-400 rounded">
                    {doc.semester}
                  </span>
                  {doc.tags?.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-neon-purple-500/20 text-neon-purple-400 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Link href={`/docs/${doc.id}`} legacyBehavior>
                    <NeonButton variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </NeonButton>
                  </Link>
                  <Link href={`/admin/manage/${doc.id}/edit`} legacyBehavior>
                    <NeonButton variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </NeonButton>
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}