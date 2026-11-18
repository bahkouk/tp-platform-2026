// Module definitions
export interface Module {
  slug: string;
  title: string;
  description: string;
  icon: string; // icon name from lucide-react
  color: string; // CSS class for neon color
  difficulty: number; // 1-5 scale
  duration: string; // estimated duration
  count: number; // number of TPs in this module
}

// Core Document types
export interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  category: string;
  subject: string;
  semester: string;
  type: 'admin' | 'user';
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'admin' | 'user';
  createdAt: string;
}

// TP Document with module classification
export interface TPDocument extends Document {
  course: string;
  level: 'pemula' | 'menengah' | 'lanjutan';
  tags: string[];
  module: string; // module slug
  enonce: string; // Énoncé PDF URL
  compteRendu: string; // Compte Rendu/Correction PDF URL
  number: string; // TP number (e.g., "TP 1", "TP 2")
  objective: string; // Description/Objective
  duration: string; // Estimated completion time
}

// Module cards for dashboard
export const MODULES: Module[] = [
  {
    slug: 'mecanique-solide',
    title: 'Mécanique du Solide',
    description: 'Solid Mechanics - Study of forces, stresses, and materials in engineering systems',
    icon: 'cpu',
    color: 'neon-cyan',
    difficulty: 4,
    duration: '2-3 hours',
    count: 0,
  },
  {
    slug: 'circuits-electriques',
    title: 'Circuits Électriques',
    description: 'Electrical Circuits - Analysis of DC and AC circuits, components, and networks',
    icon: 'bolt',
    color: 'neon-blue',
    difficulty: 5,
    duration: '3-4 hours',
    count: 0,
  },
  {
    slug: 'chimie-organique',
    title: 'Chimie Organique',
    description: 'Organic Chemistry - Synthesis, reactions, and mechanisms of organic compounds',
    icon: 'flask-conical',
    color: 'neon-purple',
    difficulty: 5,
    duration: '4-5 hours',
    count: 0,
  },
  {
    slug: 'thermodynamique-2',
    title: 'Thermodynamique 2',
    description: 'Thermodynamics II - Advanced thermodynamic systems and applications',
    icon: 'activity',
    color: 'neon-pink',
    difficulty: 4,
    duration: '3-4 hours',
    count: 0,
  },
];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: 1, label: 'Très Facile' },
  { value: 2, label: 'Facile' },
  { value: 3, label: 'Intermédiaire' },
  { value: 4, label: 'Difficile' },
  { value: 5, label: 'Très Difficile' },
] as const;

// Time durations
export const DURATION_OPTIONS = [
  '30 min',
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  '5 hours',
  'Full day',
] as const;