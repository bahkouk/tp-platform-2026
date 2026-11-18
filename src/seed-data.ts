/**
 * Sample TP Data Seeding Script
 * This file contains sample data for all 4 modules
 * Run this in your browser console or as a client script to seed the database
 */

import { MODULES } from '@/types';

// Sample TP documents for each module
export const SAMPLE_TPS = [
  // Mécanique du Solide - 10 TPs
  ...Array(10).fill(null).map((_, i) => ({
    module: 'mecanique-solide',
    number: `TP ${i + 1}`,
    title: `Mécanique du Solide - TP ${i + 1}`,
    description: `Exercices pratiques de mécanique du solide - TP ${i + 1}. Analyse des forces, des contraintes et des déformations dans les systèmes d'ingénierie.`,
    objective: `Ce TP permet de comprendre les principes fondamentaux de la mécanique du solide. Niveau ${i < 3 ? 'Débutant' : i < 7 ? 'Intermédiaire' : 'Avancé'}.`,
    subject: 'Génie Mécanique',
    category: 'TP',
    semester: 'Semestre 1',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 3.5)] as const,
    duration: i < 3 ? '1-2 hours' : i < 7 ? '2-3 hours' : '3-4 hours',
    tags: ['mécanique', 'solide', 'forces', 'contraintes', 'déformations', 'traction', 'compression', 'flexion'],
  })),

  // Circuits Électriques - 12 TPs
  ...Array(12).fill(null).map((_, i) => ({
    module: 'circuits-electriques',
    number: `TP ${i + 1}`,
    title: `Circuits Électriques - TP ${i + 1}`,
    description: `Analyse de circuits électriques DC et AC. TP ${i + 1} couvrant les lois d'Ohm, les réseaux et les composants.`,
    objective: `Ce TP développe les compétences en analyse de circuits électriques. Applications pratiques des lois de Kirchhoff et d'Ohm.`,
    subject: 'Électronique',
    category: 'TP',
    semester: 'Semestre 1',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 4)] as const,
    duration: i < 4 ? '1-2 hours' : i < 8 ? '2-3 hours' : '3-4 hours',
    tags: ['électricité', 'circuits', 'ohm', 'kirchhoff', 'réseaux', 'résistance', 'inductance', 'capacité'],
  })),

  // Chimie Organique - 14 TPs
  ...Array(14).fill(null).map((_, i) => ({
    module: 'chimie-organique',
    number: `TP ${i + 1}`,
    title: `Chimie Organique - TP ${i + 1}`,
    description: `Synthesis, mechanisms and analysis of organic compounds. Practical work on organic chemistry transformations.`,
    objective: `Ce TP explore les mécanismes de réactions chimiques organiques. Compréhension des produits et réactifs.`,
    subject: 'Chimie',
    category: 'TP',
    semester: 'Semestre 2',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 4.5)] as const,
    duration: i < 4 ? '1-2 hours' : i < 8 ? '2-3 hours' : '3-5 hours',
    tags: ['chimie', 'organique', 'réactions', 'synthèse', 'mécanismes', 'alcools', 'aromatiques', 'alcèdes'],
  })),

  // Thermodynamique 2 - 10 TPs
  ...Array(10).fill(null).map((_, i) => ({
    module: 'thermodynamique-2',
    number: `TP ${i + 1}`,
    title: `Thermodynamique 2 - TP ${i + 1}`,
    description: `Étude avancée des systèmes thermodynamiques, cycles et applications industrielles. TP ${i + 1} de thermodynamique.`,
    objective: `Analyse approfondie des cycles thermodynamiques et des systèmes en équilibre. Applications pratiques.`,
    subject: 'Physique',
    category: 'TP',
    semester: 'Semestre 2',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 3.3)] as const,
    duration: i < 3 ? '1-2 hours' : i < 6 ? '2-3 hours' : '3-4 hours',
    tags: ['thermodynamique', 'cycles', 'équilibre', 'entalpie', 'entropie', 'enthalpie', 'température', 'pression'],
  })),
];

// Function to seed data (client-side)
export async function seedSampleData() {
  const response = await fetch('/api/documents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      useSampleData: true,
      sampleTPS: SAMPLE_TPS,
    }),
  });

  return response.json();
}

// Export for use in components
export default SAMPLE_TPS;