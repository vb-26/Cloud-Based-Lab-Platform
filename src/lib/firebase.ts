import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';

const finalConfig = firebaseConfig;

const app = !getApps().length ? initializeApp(finalConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, finalConfig.projectId === 'PLACEHOLDER_PROJECT_ID' ? undefined : finalConfig.firestoreDatabaseId);

/**
 * Validates the Firestore connection on startup.
 */
export async function validateFirestoreConnection() {
  if (finalConfig.apiKey === "PLACEHOLDER_API_KEY") {
    console.error("Firebase not configured. Please provide your credentials in firebase-applet-config.json");
    return;
  }
  
  try {
    // Attempt a simple server read to verify connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firebase Connection: Online");
  } catch (error) {
    // In Firestore, a "permission-denied" error (Missing or insufficient permissions) 
    // is a valid response that confirms we successfully reached the Firestore server 
    // and the project configuration is correct.
    const isPermissionDenied = error instanceof Error && 
      (error.message.includes('permission-denied') || 
       error.message.includes('Missing or insufficient permissions'));

    if (isPermissionDenied) {
        console.log("Firebase Connection: Active (Access Restricted)");
    } else {
        console.error("Firebase connection failed:", error);
    }
  }
}
