import admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

// إصلاح شكل المفتاح أوتوماتيكياً باش يتقرا بلا أخطاء PEM
if (privateKey) {
  privateKey = privateKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
}

const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (projectId ? `${projectId}.appspot.com` : 'tp-platform.appspot.com');

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
    } catch (e) {
      console.error('Firebase Admin Initialization Error:', e);
      admin.initializeApp({
        projectId: projectId || 'tp-platform',
        storageBucket,
      });
    }
  } else {
    admin.initializeApp({
      projectId: projectId || 'tp-platform',
      storageBucket,
    });
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();
export const bucket = admin.storage().bucket(storageBucket);

export default admin;