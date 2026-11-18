'use client';

import { TPDocument } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Download, FileArchive, ExternalLink, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface PDFViewerModalProps {
  document: TPDocument | null;
  open: boolean;
  onClose: () => void;
}

export function PDFViewerModal({ document, open, onClose }: PDFViewerModalProps) {
  if (!document) return null;

  // Use the URL as the PDF source (enoanse or fallback to main url)
  const pdfUrl = document.url || document.enonce;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 bg-black/95 border border-white/10">
        {/* Header with document info */}
        <div className="absolute inset-y-0 left-0 z-50 w-80 bg-gradient-to-r from-background to-background/95 border-r border-white/10 p-6 overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mt-8">
            {/* Module Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs font-medium bg-neon-cyan-500/20 text-neon-cyan-400">
              <ExternalLink className="w-3 h-3" />
              {document.module?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>

            <h2 className="text-2xl font-bold text-white mb-3 line-clamp-2">
              {document.title || document.number}
            </h2>

            {document.objective && (
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                {document.objective}
              </p>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-14a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-14a2 2 0 0 0-2-2zm-2 9h-4v4h-4v-4h-4v-4h4v-4h4v4h4v4z" />
                </svg>
                <span>{format(new Date(document.uploadedAt), 'dd MMM yyyy')}</span>
              </div>

              {document.duration && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>{document.duration}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {document.url && (
                <button
                  onClick={() => window.open(document.url, '_blank')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan-500 text-white font-medium hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}

              {document.enonce && document.enonce !== document.url && (
                <button
                  onClick={() => window.open(document.enonce, '_blank')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neon-blue-500/30 text-neon-blue-400 font-medium hover:bg-neon-blue-500/10 transition-colors"
                >
                  <FileArchive className="w-4 h-4" />
                  Download Énoncé
                </button>
              )}

              {document.compteRendu && (
                <button
                  onClick={() => window.open(document.compteRendu, '_blank')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neon-purple-500/30 text-neon-purple-400 font-medium hover:bg-neon-purple-500/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Download Compte Rendu
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="h-full ml-80">
          <div className="h-full bg-gradient-to-b from-background/95 to-background">
            {pdfUrl ? (
              <embed
                src={pdfUrl}
                type="application/pdf"
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">PDF preview not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}