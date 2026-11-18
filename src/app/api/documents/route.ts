import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebaseAdmin';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';

// Configure buffer for Node.js globals in ESM
(global as any).Buffer = Buffer;

interface DocumentData {
  id: string;
  title: string;
  description: string;
  objective?: string;
  filename: string;
  url: string;
  enonce?: string;
  compteRendu?: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  category: string;
  subject: string;
  semester: string;
  level: 'pemula' | 'menengah' | 'lanjutan';
  module?: string;
  number?: string;
  duration?: string;
  tags: string[];
  type?: string;
}

// Sample TP data
const SAMPLE_TPS: Partial<DocumentData>[] = [
  // Mécanique du Solide - 5 TPs
  ...Array(5).fill(null).map((_, i) => ({
    module: 'mecanique-solide',
    number: `TP ${i + 1}`,
    title: `Mécanique du Solide - TP ${i + 1}`,
    description: `Exercices pratiques de mécanique du solide - TP ${i + 1}. Analyse des forces, des contraintes et des déformations.`,
    objective: `Ce TP développe les compétences en mécanique du solide. Niveau ${i < 2 ? 'Facile' : i < 3 ? 'Intermédiaire' : 'Difficile'}.`,
    subject: 'Génie Mécanique',
    category: 'TP',
    semester: 'Semestre 1',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 1.5)] as 'pemula' | 'menengah' | 'lanjutan',
    duration: i < 2 ? '1-2 hours' : '2-3 hours',
    tags: ['mécanique', 'solide', 'forces', 'traction', 'flexion'],
  })),

  // Circuits Électriques - 6 TPs
  ...Array(6).fill(null).map((_, i) => ({
    module: 'circuits-electriques',
    number: `TP ${i + 1}`,
    title: `Circuits Électriques - TP ${i + 1}`,
    description: `Analyse de circuits électriques DC et AC. TP ${i + 1} couvrant les lois d'Ohm.`,
    objective: `Ce TP développe les compétences en analyse de circuits électriques.`,
    subject: 'Électronique',
    category: 'TP',
    semester: 'Semestre 1',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 2)] as 'pemula' | 'menengah' | 'lanjutan',
    duration: i < 2 ? '1-2 hours' : '2-3 hours',
    tags: ['électricité', 'circuits', 'ohm', 'kirchhoff'],
  })),

  // Chimie Organique - 7 TPs
  ...Array(7).fill(null).map((_, i) => ({
    module: 'chimie-organique',
    number: `TP ${i + 1}`,
    title: `Chimie Organique - TP ${i + 1}`,
    description: `Synthèse et mécanismes de réactions chimiques organiques.`,
    objective: `Ce TP explore les mécanismes de réactions chimiques organiques.`,
    subject: 'Chimie',
    category: 'TP',
    semester: 'Semestre 2',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 2.5)] as 'pemula' | 'menengah' | 'lanjutan',
    duration: '2-3 hours',
    tags: ['chimie', 'organique', 'réactions', 'synthèse'],
  })),

  // Thermodynamique 2 - 5 TPs
  ...Array(5).fill(null).map((_, i) => ({
    module: 'thermodynamique-2',
    number: `TP ${i + 1}`,
    title: `Thermodynamique 2 - TP ${i + 1}`,
    description: `Étude des systèmes thermodynamiques avancés et cycles.`,
    objective: `Analyse approfondie des cycles thermodynamiques.`,
    subject: 'Physique',
    category: 'TP',
    semester: 'Semestre 2',
    level: ['pemula', 'menengah', 'lanjutan'][Math.floor(i / 1.7)] as 'pemula' | 'menengah' | 'lanjutan',
    duration: '2-3 hours',
    tags: ['thermodynamique', 'cycles', 'enthalpie', 'entropie'],
  })),
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const subject = searchParams.get('subject');
    const semester = searchParams.get('semester');
    const level = searchParams.get('level');
    const moduleId = searchParams.get('module');
    const useSample = searchParams.get('sample') === 'true';

    // If sample data requested, seed and return it
    if (useSample) {
      const batch = db.batch();
      const now = new Date().toISOString();

      // Clear existing documents
      const existingDocs = await db.collection('documents').get();
      existingDocs.forEach(doc => batch.delete(doc.ref));

      // Add sample TPs
      SAMPLE_TPS.forEach((tp, index) => {
        const docId = uuidv4();
        const sampleDoc: DocumentData = {
          id: docId,
          title: tp.title || `TP ${index + 1}`,
          description: tp.description || '',
          objective: tp.objective,
          number: tp.number || `TP ${index + 1}`,
          subject: tp.subject || 'Informatique',
          category: tp.category || 'TP',
          semester: tp.semester || 'Semestre 1',
          level: tp.level || 'pemula',
          module: tp.module || '',
          duration: tp.duration,
          tags: tp.tags || [],
          uploadedAt: now,
          uploadedBy: 'admin',
          filename: `tp-${index + 1}.pdf`,
          url: `https://example.com/sample-tp-${index + 1}.pdf`,
          size: 500000,
        };
        batch.set(db.collection('documents').doc(docId), sampleDoc);
      });

      await batch.commit();

      // Return the sample data
      const allDocs = await db.collection('documents').get();
      const allData = allDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json(allData);
    }

    let query = db.collection('documents').orderBy('uploadedAt', 'desc');

    // Apply filters
    if (search) {
      query = query.where('title', '>=', search.toUpperCase()).where('title', '<=', search.toUpperCase() + '');
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    if (subject) {
      query = query.where('subject', '==', subject);
    }

    if (semester) {
      query = query.where('semester', '==', semester);
    }

    if (level) {
      query = query.where('level', '==', level);
    }

    if (moduleId) {
      query = query.where('module', '==', moduleId);
    }

    const snapshot = await query.get();
    const documents: DocumentData[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;

      // Client-side filtering for better search
      if (search && !data.title?.toLowerCase().includes(search.toLowerCase()) &&
          !data.description?.toLowerCase().includes(search.toLowerCase()) &&
          !data.subject?.toLowerCase().includes(search.toLowerCase()) &&
          !data.module?.toLowerCase().includes(search.toLowerCase()) &&
          (!data.tags || !data.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))) {
        return;
      }

      if (category && data.category !== category) return;
      if (subject && data.subject !== subject) return;
      if (semester && data.semester !== semester) return;
      if (level && data.level !== level) return;
      if (moduleId && data.module !== moduleId) return;

      documents.push({ ...data, id: doc.id });
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const subject = formData.get('subject') as string;
    const category = formData.get('category') as string;
    const semester = formData.get('semester') as string;
    const level = formData.get('level') as 'pemula' | 'menengah' | 'lanjutan';
    const tags = formData.get('tags') as string;
    const module = formData.get('module') as string;
    const number = formData.get('number') as string;
    const duration = formData.get('duration') as string;
    const objective = formData.get('objective') as string;
    const compteRenduFile = formData.get('compteRendu') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Generate unique ID and filename
    const documentId = uuidv4();
    const originalFilename = file.name;
    const filename = `${documentId}-${Date.now()}-${originalFilename}`;
    const storagePath = `uploads/${filename}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Firebase Storage
    const bucket = storage.bucket();
    const fileRef = bucket.file(storagePath);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          title,
          subject,
          category,
          semester,
          level,
          module,
          number,
          uploadedBy: 'admin',
        },
      },
    });

    // Make file publicly accessible
    await fileRef.makePublic();

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(storagePath)}?alt=media`;

    // Handle compte rendu file if provided
    let compteRenduUrl: string | undefined;
    if (compteRenduFile) {
      const crFilename = `${documentId}-cr-${Date.now()}-${compteRenduFile.name}`;
      const crStoragePath = `uploads/${crFilename}`;
      const crBuffer = Buffer.from(await compteRenduFile.arrayBuffer());
      const crFileRef = bucket.file(crStoragePath);

      await crFileRef.save(crBuffer, {
        metadata: {
          contentType: compteRenduFile.type,
        },
      });

      await crFileRef.makePublic();
      compteRenduUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(crStoragePath)}?alt=media`;
    }

    // Save document metadata to Firestore
    const docData: DocumentData = {
      id: documentId,
      title,
      description: description || '',
      objective,
      filename: originalFilename,
      url: publicUrl,
      enonce: publicUrl,
      compteRendu: compteRenduUrl,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'admin',
      category,
      subject,
      semester,
      level,
      module,
      number,
      duration,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
    };

    await db.collection('documents').doc(documentId).set(docData);

    return NextResponse.json(docData, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Get document to find storage path
    const docSnap = await db.collection('documents').doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const docData = docSnap.data() as DocumentData;
    const storagePath = `uploads/${docData.id}-${docData.filename}`;

    // Delete from Firebase Storage
    const bucket = storage.bucket();
    try {
      await bucket.file(storagePath).delete();
    } catch (err) {
      // File might not exist
      console.warn('File not found in storage:', err);
    }

    // Delete from Firestore
    await db.collection('documents').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}