import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';

// Load service account key
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

// Initialize Firestore
export const db = getFirestore();

// Initialize Auth
export const auth = getAuth();

// Export admin for other uses
export { admin }; 