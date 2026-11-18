'use client';

import { useState, useEffect } from 'react';
import { TPDocument } from '@/types';

export function useTPDocuments() {
  const [documents, setDocuments] = useState<TPDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchDocuments();
  };

  return {
    documents,
    loading,
    error,
    refetch,
  };
}

export function useTPDocumentsByModule(moduleSlug: string) {
  const { documents, loading, error, refetch } = useTPDocuments();

  const moduleDocuments = documents.filter(doc => doc.module === moduleSlug);

  return {
    documents: moduleDocuments,
    loading,
    error,
    refetch,
  };
}