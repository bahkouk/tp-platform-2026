'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { SearchFilterBar } from '@/components/documents/search-filter-bar';
import { PDFViewerModal } from '@/components/documents/pdf-viewer-modal';
import { TPDocument, MODULES } from '@/types';
import { Download, Filter, Briefcase, BookOpen, Folder, Calendar, Upload, Link as LinkIcon, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTPDocuments } from '@/hooks/use-documents';

export default function DocsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<TPDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<TPDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<TPDocument | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const { documents: fetchedDocuments } = useTPDocuments();

  useEffect(() => {
    if (fetchedDocuments.length > 0) {
      setDocuments(fetchedDocuments);
      setFilteredDocuments(fetchedDocuments);
      setLoading(false);
    }
  }, [fetchedDocuments]);

  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.objective?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.module?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedModule) {
      filtered = filtered.filter(doc => doc.module === selectedModule);
    }

    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    if (selectedSubject) {
      filtered = filtered.filter(doc => doc.subject === selectedSubject);
    }

    if (selectedSemester) {
      filtered = filtered.filter(doc => doc.semester === selectedSemester);
    }

    if (selectedLevel) {
      filtered = filtered.filter(doc => doc.level === selectedLevel);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, selectedModule, selectedCategory, selectedSubject, selectedSemester, selectedLevel]);

  const handleDownload = (document: TPDocument) => {
    const url = document.url || document.enonce;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleViewPdf = (document: TPDocument) => {
    setSelectedDocument(document);
    setPdfModalOpen(true);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-neon-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <AnimatedBackground />
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 rounded-full bg-neon-cyan-500/20 flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-neon-cyan-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Accès aux Documents</h2>
          <p className="text-gray-400 mb-6">Connectez-vous pour parcourir et télécharger les documents TP.</p>
          <Link href="/login" legacyBehavior>
            <NeonButton className="neon-glow-cyan">
              Se Connecter
            </NeonButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <AnimatedBackground />

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-neon-blue-400 to-neon-cyan-400 bg-clip-text text-transparent">
                Bibliothèque TP
              </span>
            </h1>
            <p className="text-gray-400">
              Téléchargez et accédez aux documents TP pour tous les modules
            </p>
          </div>

          <Link href="/modules" legacyBehavior>
            <NeonButton className="neon-glow-cyan justify-center">
              <LinkIcon className="w-4 h-4 mr-2" />
              Voir les Modules
            </NeonButton>
          </Link>
        </div>

        {/* Search & Filters */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          module={selectedModule}
          onModuleChange={setSelectedModule}
          category={selectedCategory}
          onCategoryChange={setSelectedCategory}
          subject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          semester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          level={selectedLevel}
          onLevelChange={setSelectedLevel}
        />

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            {loading ? 'Chargement...' : `${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''} trouvé${filteredDocuments.length !== 1 ? 's' : ''}`}
          </p>

          {(selectedModule || selectedCategory || selectedSubject || selectedSemester || selectedLevel || searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedModule('');
                setSelectedCategory('');
                setSelectedSubject('');
                setSelectedSemester('');
                setSelectedLevel('');
              }}
              className="text-neon-cyan-400 hover:underline text-sm"
            >
              Tout effacer
            </button>
          )}
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
            <h3 className="text-xl font-semibold mb-2">Aucun document trouvé</h3>
            <p className="text-gray-400 mb-4">
              Essayez d'ajuster vos filtres de recherche
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedModule('');
                setSelectedCategory('');
                setSelectedSubject('');
                setSelectedSemester('');
                setSelectedLevel('');
              }}
              className="neon-glow-cyan"
            >
              Effacer les filtres
            </button>
          </GlassCard>
        ) : (
          <div className="grid gap-6">
            {filteredDocuments.map((doc) => (
              <GlassCard key={doc.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Document Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {doc.number && (
                        <span className="px-2 py-0.5 text-xs bg-neon-cyan-500/20 text-neon-cyan-400 rounded-full">
                          {doc.number}
                        </span>
                      )}
                      {doc.module && (
                        <span className="px-2 py-0.5 text-xs bg-neon-blue-500/20 text-neon-blue-400 rounded-full">
                          {MODULES.find(m => m.slug === doc.module)?.title?.split(' ')[0] || doc.module}
                        </span>
                      )}
                      {doc.level && (
                        <span className="text-xs text-gray-400 capitalize">
                          {doc.level}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">{doc.title || doc.number}</h3>

                    {doc.objective && (
                      <p className="text-gray-400 mb-2">{doc.objective}</p>
                    )}

                    {doc.description && !doc.objective && (
                      <p className="text-gray-400 mb-2 line-clamp-2">{doc.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                      </span>
                      {doc.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {doc.duration}
                        </span>
                      )}
                    </div>

                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded">
                            +{doc.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedDocument(doc);
                        setPdfModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-neon-cyan-500/30 text-neon-cyan-400 rounded-lg hover:bg-neon-cyan-500/10 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Preview PDF
                    </button>

                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-neon-cyan-500 text-white rounded-lg hover:scale-105 transition-transform neon-glow-cyan"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        document={selectedDocument}
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      />
    </div>
  );
}