'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UploadForm } from '@/components/dashboard/upload-form';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push('/docs');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-neon-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <AnimatedBackground />

      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-neon-cyan-500/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-neon-cyan-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-neon-cyan-400 to-neon-blue-400 bg-clip-text text-transparent">
                Upload TP Document
              </span>
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your TP (Tugas Pendek) documents with full metadata and category management
          </p>
        </div>

        {/* Upload Form */}
        <UploadForm />

        {/* Help Section */}
        <div className="mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-neon-blue-500/10 border border-neon-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neon-blue-400 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                File Requirements
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Maximum file size: 10MB</li>
                <li>• Supported formats: PDF, DOC, DOCX</li>
                <li>• Clear, readable content</li>
                <li>• Proper filename and description</li>
              </ul>
            </div>

            <div className="bg-neon-green-500/10 border border-neon-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neon-green-400 mb-3 flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Best Practices
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Use descriptive titles</li>
                <li>• Add relevant tags for search</li>
                <li>• Include course information</li>
                <li>• Add accurate semester level</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}