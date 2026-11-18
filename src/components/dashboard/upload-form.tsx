'use client';

import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, FileText, Book, Tag, Calendar, List, Save, X, FileArchive, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { MODULES } from '@/types';

interface FormData {
  title: string;
  description: string;
  objective: string;
  subject: string;
  category: string;
  semester: string;
  level: 'pemula' | 'menengah' | 'lanjutan';
  tags: string;
  module: string;
  number: string;
  duration: string;
}

interface UploadFormProps {
  onSuccess?: () => void;
}

const subjects = [
  'Physique',
  'Chimie',
  'Mathématiques',
  'Électronique',
  'Informatique',
  'Génie Mécanique',
];

const categories = [
  'TP',
  'Exercice',
  'Projet',
  'Révision',
];

const semesters = ['Semestre 1', 'Semestre 2', '2024/2025', '2023/2024'];

const durationOptions = [
  '30 min',
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  '5 hours',
  'Full day',
];

export function UploadForm({ onSuccess }: UploadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    objective: '',
    subject: '',
    category: '',
    semester: '',
    level: 'pemula',
    tags: '',
    module: '',
    number: '',
    duration: '2 hours',
  });

  const [ennonceFile, setEnnonceFile] = useState<File | null>(null);
  const [compteRenduFile, setCompteRenduFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'full'>('single');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEnnonceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setEnnonceFile(selectedFile);
      } else {
        toast.error('Only PDF files are allowed');
      }
    }
  };

  const handleCompteRenduChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setCompteRenduFile(selectedFile);
      } else {
        toast.error('Only PDF files are allowed');
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'enoanse' | 'compteRendu') => {
    e.preventDefault();

    if (type === 'enoanse') {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
          setEnnonceFile(selectedFile);
        } else {
          toast.error('Only PDF files are allowed');
        }
      }
    } else {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
          setCompteRenduFile(selectedFile);
        } else {
          toast.error('Only PDF files are allowed');
        }
      }
    }
  };

  const handleDropOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDropLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check required fields
    if (!ennonceFile) {
      toast.error('Please select an Énoncé PDF file');
      return;
    }

    if (!formData.title || !formData.module) {
      toast.error('Please fill in the required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append('file', ennonceFile);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('objective', formData.objective);
      uploadData.append('subject', formData.subject);
      uploadData.append('category', formData.category);
      uploadData.append('semester', formData.semester);
      uploadData.append('level', formData.level);
      uploadData.append('tags', formData.tags);
      uploadData.append('module', formData.module);
      uploadData.append('number', formData.number);
      uploadData.append('duration', formData.duration);

      // Add compte rendu file if provided
      if (compteRenduFile) {
        uploadData.append('compteRendu', compteRenduFile);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 150);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: uploadData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        toast.success('Document uploaded successfully!');
        setFormData({
          title: '',
          description: '',
          objective: '',
          subject: '',
          category: '',
          semester: '',
          level: 'pemula',
          tags: '',
          module: '',
          number: '',
          duration: '2 hours',
        });
        setEnnonceFile(null);
        setCompteRenduFile(null);

        // Reset file inputs
        const ennonceInputElt = document.getElementById('enoance-input') as HTMLInputElement;
        const compteRenduInputElt = document.getElementById('compte-rendu-input') as HTMLInputElement;
        if (ennonceInputElt) ennonceInputElt.value = '';
        if (compteRenduInputElt) compteRenduInputElt.value = '';

        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (type: 'enoanse' | 'compteRendu') => {
    if (type === 'enoanse') {
      setEnnonceFile(null);
      const fileInput = document.getElementById('enoance-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else {
      setCompteRenduFile(null);
      const fileInput = document.getElementById('compte-rendu-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <GlassCard className="p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'single'
                ? 'bg-neon-cyan-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            TP Complet (Énoncé + CR)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('full')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'full'
                ? 'bg-neon-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Fichiers Séparés
          </button>
        </div>
      </GlassCard>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Module Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Module *</label>
          <select
            name="module"
            value={formData.module}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 focus:ring-2 focus:ring-neon-cyan-500/20 outline-none transition-colors"
            required
            disabled={isUploading}
          >
            <option value="">Sélectionner un module</option>
            {MODULES.map((module) => (
              <option key={module.slug} value={module.slug}>
                {module.title}
              </option>
            ))}
          </select>
        </div>

        {/* TP Number */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Numéro du TP</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            placeholder="Ex: TP 1, TP 2, ..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 focus:ring-2 focus:ring-neon-cyan-500/20 outline-none transition-colors"
            disabled={isUploading}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Titre *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Titre du TP"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 focus:ring-2 focus:ring-neon-cyan-500/20 outline-none transition-colors"
            required
            disabled={isUploading}
          />
        </div>

        {/* Objective */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Objectif / Description</label>
          <textarea
            name="objective"
            value={formData.objective}
            onChange={handleInputChange}
            placeholder="Description de l'objectif du TP"
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 focus:ring-2 focus:ring-neon-cyan-500/20 outline-none transition-colors resize-none"
            disabled={isUploading}
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Matière *</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 focus:ring-2 focus:ring-neon-cyan-500/20 outline-none transition-colors"
            required
            disabled={isUploading}
          >
            <option value="">Sélectionner une matière</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Durée Estimée</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 focus:ring-2 focus:ring-neon-cyan-500/20 outline-none transition-colors"
            disabled={isUploading}
          >
            {durationOptions.map((duration) => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Niveau de Difficulté</label>
          <div className="flex gap-2">
            {(['pemula', 'menengah', 'lanjutan'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, level })}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.level === level
                    ? 'bg-neon-cyan-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                disabled={isUploading}
              >
                {level.charAt(0).toUpperCase() + (level === 'pemula' ? ' (Facile)' : level === 'menengah' ? ' (Intermédiaire)' : ' (Difficile)')}
              </button>
            ))}
          </div>
        </div>

        {/* Files Upload - Énoncé */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            ennonceFile
              ? 'border-neon-green-500 bg-neon-green-500/10'
              : 'border-white/20 hover:border-white/30'
          }`}
          onDrop={(e) => handleDrop(e, 'enoanse')}
          onDragOver={handleDropOver}
          onDragLeave={handleDropLeave}
        >
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-neon-cyan-400" />
            <h3 className="text-lg font-semibold">Énoncé (PDF)</h3>
            <p className="text-sm text-gray-400">
              Fichier principal du TP (énoncé)
            </p>

            <input
              type="file"
              id="enoance-input"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleEnnonceChange}
              disabled={isUploading}
            />

            <button
              type="button"
              onClick={() => document.getElementById('enoance-input')?.click()}
              disabled={isUploading}
              className="px-4 py-2 text-sm bg-neon-cyan-500/20 text-neon-cyan-400 rounded hover:bg-neon-cyan-500/30"
            >
              Choisir fichier
            </button>

            {ennonceFile && (
              <div className="mt-2 p-3 bg-white/5 rounded flex items-center justify-between w-full max-w-md">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-neon-blue-400" />
                  <div>
                    <p className="font-medium text-sm truncate max-w-48">{ennonceFile.name}</p>
                    <p className="text-xs text-gray-400">{(ennonceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile('enoanse')}
                  disabled={isUploading}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Files Upload - Compte Rendu (optional) */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            compteRenduFile
              ? 'border-neon-blue-500 bg-neon-blue-500/10'
              : 'border-white/20 hover:border-white/30'
          }`}
          onDrop={(e) => handleDrop(e, 'compteRendu')}
          onDragOver={handleDropOver}
          onDragLeave={handleDropLeave}
        >
          <div className="flex flex-col items-center gap-3">
            <FileArchive className="w-10 h-10 text-neon-blue-400" />
            <h3 className="text-lg font-semibold">Compte Rendu (PDF)</h3>
            <p className="text-sm text-gray-400">
              Fichier de correction (optionnel)
            </p>

            <input
              type="file"
              id="compte-rendu-input"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleCompteRenduChange}
              disabled={isUploading}
            />

            <button
              type="button"
              onClick={() => document.getElementById('compte-rendu-input')?.click()}
              disabled={isUploading}
              className="px-4 py-2 text-sm bg-neon-blue-500/20 text-neon-blue-400 rounded hover:bg-neon-blue-500/30"
            >
              Choisir fichier
            </button>

            {compteRenduFile && (
              <div className="mt-2 p-3 bg-white/5 rounded flex items-center justify-between w-full max-w-md">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-neon-blue-400" />
                  <div>
                    <p className="font-medium text-sm truncate max-w-48">{compteRenduFile.name}</p>
                    <p className="text-xs text-gray-400">{(compteRenduFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile('compteRendu')}
                  disabled={isUploading}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Ex: mécanique, force, traction (séparer par des virgules)"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 focus:ring-2 focus:ring-neon-cyan-500/20 outline-none transition-colors"
            disabled={isUploading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !ennonceFile || !formData.title || !formData.module}
          className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-neon-cyan-500 to-neon-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-100"
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {`Uploading... ${uploadProgress}%`}
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2 inline" />
              Télécharger le TP
            </>
          )}
        </button>
      </form>
    </div>
  );
}