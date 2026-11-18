import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    // Get document stats
    const docsSnapshot = await db.collection('documents').get();
    const totalDocuments = docsSnapshot.size;

    // Get user stats
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Get uploads this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const uploadsThisMonth = docsSnapshot.docs.filter(doc => {
      const uploadedAt = doc.data().uploadedAt;
      return uploadedAt && new Date(uploadedAt) >= startOfMonth;
    }).length;

    return NextResponse.json({
      total: totalDocuments,
      uploads: uploadsThisMonth,
      users: totalUsers,
      pending: 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      total: 0,
      uploads: 0,
      users: 0,
      pending: 0,
    });
  }
}