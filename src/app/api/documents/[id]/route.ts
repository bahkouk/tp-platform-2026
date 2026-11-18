import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebaseAdmin';
import { Buffer } from 'buffer';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const docSnap = await db.collection('documents').doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Get document to find storage path
    const docSnap = await db.collection('documents').doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const docData = docSnap.data() as any;
    const storagePath = `uploads/${id}-${docData.filename}`;

    // Delete from Firebase Storage
    const bucket = storage.bucket();
    try {
      await bucket.file(storagePath).delete();
    } catch (err) {
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await request.json();

    const docSnap = await db.collection('documents').doc(id).get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    await db.collection('documents').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await db.collection('documents').doc(id).get();
    return NextResponse.json({ id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}