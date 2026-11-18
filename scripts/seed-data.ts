/**
 * Script to seed the TP Platform with sample data
 * This creates realistic TP documents for the 4 academic modules
 */

import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

// Sample TP data for all 4 modules
const sampleTPs = [
  // Mécanique du Solide TPs
  ...Array(12).fill(null).map((_, i) => ({
    module: 'mecanique-solide',
    number: `TP ${i + 1}`,
    title: `Mécanique du Solide - TP ${i + 1}`,
    description: `Exercices pratiques de mécanique du solide - TP ${i + 1}. analyse des forces, des contraintes et des déformations dans les systèmes ingénierie.`,
    objective: `Ce TP permet de comprendre les principes fondamentaux de la mécanique du solide. Niveau ${i < 4 ? 'débutant' : i < 8 ? 'intermédiaire' : 'avancé'}.`,
    subject: 'Génie Mécanique',
    category: 'TP',
    semester: 'Semestre 1',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 4)] as const,
    duration: i < 4 ? '1-2 hours' : i < 8 ? '2-3 hours' : '3-4 hours',
    tags: ['mécanique', 'solide', 'forces', 'contraintes', 'déformations'],
  })),

  // Circuits Électriques TPs
  ...Array(15).fill(null).map((_, i) => ({
    module: 'circuits-electriques',
    number: `TP ${i + 1}`,
    title: `Circuits Électriques - TP ${i + 1}`,
    description: `Analyse de circuits électriques DC et AC. TP ${i + 1} couvrant les lois d'Ohm, les réseaux et les composants.`,
    objective: `Ce TP développe les compétences en analyse de circuits électriques. Applications pratiques des lois de Kirchhoff et d'Ohm.`,
    subject: 'Électronique',
    category: 'TP',
    semester: 'Semestre 1',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 5)] as const,
    duration: i < 5 ? '1-2 hours' : i < 10 ? '2-3 hours' : '3-4 hours',
    tags: ['électricité', 'circuits', 'ohm', 'kirchhoff', 'réseaux'],
  })),

  // Chimie Organique TPs
  ...Array(14).fill(null).map((_, i) => ({
    module: 'chimie-organique',
    number: `TP ${i + 1}`,
    title: `Chimie Organique - TP ${i + 1}`,
    description: `Synthesis, mechanisms and analysis of organic compounds. Practical work on organic chemistry transformations.`,
    objective: `Ce TP explore les mécanismes de réactions chimiques organiques. Compréhension des produits et réactifs.`,
    subject: 'Chimie',
    category: 'TP',
    semester: 'Semestre 2',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 5)] as const,
    duration: i < 4 ? '1-2 hours' : i < 8 ? '2-3 hours' : '3-5 hours',
    tags: ['chimie', 'organique', 'réactions', 'synthèse', 'mécanismes'],
  })),

  // Thermodynamique 2 TPs
  ...Array(10).fill(null).map((_, i) => ({
    module: 'thermodynamique-2',
    number: `TP ${i + 1}`,
    title: `Thermodynamique 2 - TP ${i + 1}`,
    description: `Étude avancée des systèmes thermodynamiques, cycles et applications industrielles. TP ${i + 1} de thermodynamique.`,
    objective: `Analyse approfondie des cycles thermodynamiques et des systèmes en équilibre. Applications pratiques.`,
    subject: 'Physique',
    category: 'TP',
    semester: 'Semestre 2',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 3)] as const,
    duration: i < 3 ? '1-2 hours' : i < 6 ? '2-3 hours' : '3-4 hours',
    tags: ['thermodynamique', 'cycles', 'équilibre', 'entalpie', 'entropie'],
  })),
];

// Function to initialize Firebase Admin and seed data
async function seedData() {
  // Initialize Firebase Admin (if not already initialized)
  if (!admin.apps.length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
      privateKey = privateKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
    }

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket: `${projectId}.appspot.com`,
      });
    } else {
      admin.initializeApp({
        projectId: projectId || 'tp-platform',
        storageBucket: `${projectId || 'tp-platform'}.appspot.com`,
      });
    }
  }

  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  console.log('Starting data seeding...');

  const results = {
    total: 0,
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const tp of sampleTPs) {
    results.total++;

    try {
      const documentId = uuidv4();

      // Create a placeholder document metadata
      // Note: In production, you would upload actual PDFs
      const docData = {
        id: documentId,
        title: tp.title,
        description: tp.description,
        objective: tp.objective,
        number: tp.number,
        subject: tp.subject,
        category: tp.category,
        semester: tp.semester,
        level: tp.level,
        module: tp.module,
        duration: tp.duration,
        tags: tp.tags,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'admin',
        size: 500000, // Placeholder size
        filename: `${tp.number.replace(' ', '-')}.pdf`,
        url: `https://example.com/placeholder.pdf`,
        enonce: `https://example.com/${tp.module}-${tp.number}-enoanse.pdf`,
        compteRendu: `https://example.com/${tp.module}-${tp.number}-compte-rendu.pdf`,
      };

      await db.collection('documents').doc(documentId).set(docData);
      results.success++;

      console.log(`✓ Seeded: ${tp.title}`);
    } catch (error) {
      results.failed++;
      results.errors.push(`${tp.title}: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`✗ Failed: ${tp.title}`, error);
    }
  }

  // Update module counts
  const moduleCounts: Record<string, number> = {};
  for (const tp of sampleTPs) {
    moduleCounts[tp.module] = (moduleCounts[tp.module] || 0) + 1;
  }

  await db.collection('modules').doc('mecanique-solide').update({ tpCount: moduleCounts['mecanique-solide'] || 0 });
  await db.collection('modules').doc('circuits-electriques').update({ tpCount: moduleCounts['circuits-electriques'] || 0 });
  await db.collection('modules').doc('chimie-organique').update({ tpCount: moduleCounts['chimie-organique'] || 0 });
  await db.collection('modules').doc('thermodynamique-2').update({ tpCount: moduleCounts['thermodynamique-2'] || 0 });

  console.log('\n=== Seeding Results ===');
  console.log(`Total: ${results.total}`);
  console.log(`Success: ${results.success}`);
  console.log(`Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(err => console.log(`  - ${err}`));
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run seeding
seedData().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});