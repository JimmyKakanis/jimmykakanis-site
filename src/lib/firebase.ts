import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth as firebaseGetAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function isFirebaseConfigured(): boolean {
  return Object.values(firebaseConfig).every((v) => typeof v === 'string' && v.length > 0);
}

/** False when env vars were not set at build time (e.g. Vercel env missing after removing .env from git). */
export const firebaseConfigured = isFirebaseConfigured();

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

function initFirebase(): void {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, and VITE_FIREBASE_APP_ID in your environment. On Vercel: Project → Settings → Environment Variables, then redeploy.'
    );
  }
  if (app) return;
  app = initializeApp({
    apiKey: firebaseConfig.apiKey as string,
    authDomain: firebaseConfig.authDomain as string,
    projectId: firebaseConfig.projectId as string,
    storageBucket: firebaseConfig.storageBucket as string,
    messagingSenderId: firebaseConfig.messagingSenderId as string,
    appId: firebaseConfig.appId as string,
  });
  auth = firebaseGetAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export function getFirebaseApp(): FirebaseApp {
  initFirebase();
  return app!;
}

export function getAuthInstance(): Auth {
  initFirebase();
  return auth!;
}

export function getDb(): Firestore {
  initFirebase();
  return db!;
}

export function getStorageInstance(): FirebaseStorage {
  initFirebase();
  return storage!;
}
