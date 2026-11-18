'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { MODULES, Module, TPDocument } from '@/types';
import { GetIcon } from '@/components/modules/icon-utils';
import { Download, ExternalLink, Calendar, User as UserIcon, BookOpen, Clock, Target, ArrowLeft } from 'lucide-react';
import { PDFViewerModal } from '@/components/documents/pdf-viewer-modal';
import { useTPDocuments } from '@/hooks/use-documents';
import { format } from 'date-fns';

export default function ModuleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const router = useRouter();

  const [module, setModule] = useState<Module | null>(null);
  const [documents, setDocuments] = useState<TPDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<TPDocument | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const { documents: allDocuments } = useTPDocuments();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  useEffect(() => {
    const foundModule = MODULES.find(m => m.slug === slug);
    setModule(foundModule || null);

    if (allDocuments.length > 0) {
      const moduleDocs = allDocuments.filter(doc => doc.module === slug);
      setDocuments(moduleDocs);
    }

    setLoading(false);
  }, [slug, allDocuments, session, router]);

  const handleViewPdf = (doc: TPDocument) => {
    setSelectedDocument(doc);
    setPdfModalOpen(true);
  };

  const handleDownload = (doc: TPDocument) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    }
  };

  const handleDownloadEnonce = (doc: TPDocument) => {
    if (doc.enonce) {
      window.open(doc.enonce, '_blank');
    }
  };

  const handleDownloadCompteRendu = (doc: TPDocument) => {
    if (doc.compteRendu) {
      window.open(doc.compteRendu, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-neon-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!module) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <AnimatedBackground />
        <GlassCard className="text-center py-12 max-w-md">
          <h3 className="text-xl font-semibold mb-4">Module non trouvé</h3>
          <p className="text-gray-400 mb-6">Le module demandé n'existe pas.</p>
          <button
            onClick={() => router.back()}
            className="neon-glow-cyan px-4 py-2 rounded-lg font-medium"
          >
            Retour
          </button>
        </GlassCard>
      </div>
    );
  }

  const IconComponent = GetIcon(module.icon);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <AnimatedBackground />

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-white to-neon-cyan-400 bg-clip-text text-transparent">
              {module.title}
            </span>
          </h1>
        </div>

        {/* Module Header Card */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan-500 to-neon-blue-500 flex items-center justify-center neon-glow-cyan">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{module.title}</h2>
                <p className="text-gray-400 mt-1">{module.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">{format(new Date(), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stats Bar */}
        <GlassCard className="p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-2xl font-bold text-neon-cyan-400">{documents.length}</span>
              <span className="text-xs text-gray-400 ml-2">TPs disponibles</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>Difficulté: {module.difficulty}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{module.duration} Estimation</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <GlassCard className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neon-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-neon-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun TP disponible</h3>
            <p className="text-gray-400 mb-4">
              Aucun TP n'est encore disponible dans ce module.
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-6">
            {documents.map((doc) => (
              <GlassCard key={doc.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Document Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs bg-neon-cyan-500/20 text-neon-cyan-400 rounded-full">
                        {doc.number}
                      </span>
                      <span className="text-xs text-gray-400">
                        {doc.level?.charAt(0).toUpperCase() + (doc.level?.slice(1) || '')}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">{doc.title || doc.number}</h3>

                    <p className="text-gray-400 mb-3">{doc.objective || doc.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {doc.uploadedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(doc.uploadedAt), 'dd MMM yyyy')}
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
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const docData = doc.enonce || doc.url;
                        if (docData) {
                          setSelectedDocument(doc);
                          setPdfModalOpen(true);
                        }
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