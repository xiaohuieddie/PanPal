import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    // In production, this will use the default service account
    // In development, you can use a service account key file
    // credential: admin.credential.cert(serviceAccountKey),
  });
}

// Initialize Firestore
export const db = getFirestore();

// Initialize Auth
export const auth = getAuth();

// Export admin for other uses
export { admin }; 