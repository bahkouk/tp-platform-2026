'use client';

import { Search, X, Filter, ExternalLink } from 'lucide-react';
import { MODULES } from '@/types';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  subject: string;
  onSubjectChange: (value: string) => void;
  semester: string;
  onSemesterChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  module?: string;
  onModuleChange?: (value: string) => void;
}

const categories = ['Énoncé', 'Compte Rendu', 'TP', 'Exercice', 'Projet', 'Révision'];
const subjects = ['Physique', 'Chimie', 'Mathématiques', 'Électronique', 'Informatique', 'Génie Mécanique'];
const semesters = ['Semestre 1', 'Semestre 2', '2024/2025', '2023/2024'];
const levels = ['pemula', 'menengah', 'lanjutan'];

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  subject,
  onSubjectChange,
  semester,
  onSemesterChange,
  level,
  onLevelChange,
  module = '',
  onModuleChange,
}: SearchFilterBarProps) {
  const hasActiveFilters = category || subject || semester || level || searchTerm || module;

  return (
    <div className="mb-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher un TP..."
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-cyan-500 focus:ring-2 focus:ring-neon-cyan-500/20 outline-none transition-colors"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {/* Module Filter */}
        {onModuleChange && (
          <select
            value={module}
            onChange={(e) => onModuleChange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none"
          >
            <option value="">Tous les Modules</option>
            {MODULES.map((mod) => (
              <option key={mod.slug} value={mod.slug}>
                {mod.title}
              </option>
            ))}
          </select>
        )}

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none"
        >
          <option value="">Toutes les Catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Subject Filter */}
        <select
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none"
        >
          <option value="">Toutes les Matières</option>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>

        {/* Semester Filter */}
        <select
          value={semester}
          onChange={(e) => onSemesterChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none"
        >
          <option value="">Tous les Semestres</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>

        {/* Level Filter */}
        <select
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none"
        >
          <option value="">Tous les Niveaux</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl === 'pemula' ? 'Facile' : lvl === 'menengah' ? 'Intermédiaire' : 'Difficile'}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {module && onModuleChange && (
            <span className="px-3 py-1 bg-neon-cyan-500/20 text-neon-cyan-400 text-xs rounded-full">
              {MODULES.find(m => m.slug === module)?.title || module}
              <button
                onClick={() => onModuleChange('')}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {category && (
            <span className="px-3 py-1 bg-neon-cyan-500/20 text-neon-cyan-400 text-xs rounded-full">
              {category}
              <button
                onClick={() => onCategoryChange('')}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {subject && (
            <span className="px-3 py-1 bg-neon-blue-500/20 text-neon-blue-400 text-xs rounded-full">
              {subject}
              <button
                onClick={() => onSubjectChange('')}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {semester && (
            <span className="px-3 py-1 bg-neon-purple-500/20 text-neon-purple-400 text-xs rounded-full">
              {semester}
              <button
                onClick={() => onSemesterChange('')}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {level && (
            <span className="px-3 py-1 bg-neon-green-500/20 text-neon-green-400 text-xs rounded-full">
              {level === 'pemula' ? 'Facile' : level === 'menengah' ? 'Intermédiaire' : 'Difficile'}
              <button
                onClick={() => onLevelChange('')}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}