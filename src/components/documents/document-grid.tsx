'use client';

import { TPDocument } from '@/types';
import { GlassCard } from '@/components/ui/glass-card';
import { FileText, Download, ExternalLink, Calendar, User, Layers } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentGridProps {
  documents: TPDocument[];
  onDownload: (document: TPDocument) => void;
  onView: (document: TPDocument) => void;
}

export function DocumentGrid({ documents, onDownload, onView }: DocumentGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <GlassCard key={doc.id} className="flex flex-col hover:scale-105 transition-transform">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-neon-blue-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-neon-blue-400" />
            </div>
            <div className="text-xs text-gray-400">
              {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{doc.title}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{doc.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            <span className="px-2 py-0.5 text-xs bg-neon-cyan-500/20 text-neon-cyan-400 rounded">
              {doc.subject}
            </span>
            <span className="px-2 py-0.5 text-xs bg-neon-blue-500/20 text-neon-blue-400 rounded">
              {doc.category}
            </span>
            {doc.semester && (
              <span className="px-2 py-0.5 text-xs bg-neon-purple-500/20 text-neon-purple-400 rounded">
                {doc.semester.split(' ')[0]}
              </span>
            )}
            {doc.level && (
              <span className="px-2 py-0.5 text-xs bg-neon-green-500/20 text-neon-green-400 rounded uppercase">
                {doc.level}
              </span>
            )}
          </div>

          {doc.tags && doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {doc.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded">
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

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              onClick={() => onView(doc)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="View PDF"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDownload(doc)}
              className="p-2 text-gray-400 hover:text-white transition-colors neon-glow-cyan"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}