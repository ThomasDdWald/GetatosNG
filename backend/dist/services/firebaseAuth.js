import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
let firebaseApp = null;
let auth = null;
export function initFirebase() {
    try {
        // Check if Firebase is already initialized
        if (getApps().length > 0) {
            console.log('✅ Firebase bereits initialisiert');
            firebaseApp = getApps()[0];
            auth = getAuth(getApps()[0]);
            return true;
        }
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        if (!projectId || !clientEmail || !privateKey) {
            // Fallback: Try to load from file
            const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json');
            if (fs.existsSync(serviceAccountPath)) {
                const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
                initializeApp({ credential: cert(serviceAccount) });
                auth = getAuth();
                console.log('✅ Firebase Admin SDK initialisiert (from file)');
                return true;
            }
            console.error('❌ Firebase config nicht gefunden');
            return false;
        }
        // Load from environment variables
        initializeApp({
            credential: cert({
                project_id: projectId,
                client_email: clientEmail,
                private_key: privateKey
            })
        });
        auth = getAuth();
        console.log('✅ Firebase Admin SDK initialisiert');
        return true;
    }
    catch (error) {
        console.error('❌ Firebase Initialisierung fehlgeschlagen:', error);
        return false;
    }
}
export function getFirebaseAuth() {
    if (!auth) {
        initFirebase();
    }
    return auth;
}
export async function verifyIdToken(idToken) {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        throw new Error('Firebase Auth nicht initialisiert');
    }
    try {
        const decodedToken = await authInstance.verifyIdToken(idToken);
        return decodedToken;
    }
    catch (error) {
        throw error;
    }
}
export async function createUser(email, password, displayName) {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        throw new Error('Firebase Auth nicht initialisiert');
    }
    try {
        const userRecord = await authInstance.createUser({
            email,
            password,
            displayName: displayName || email.split('@')[0],
            emailVerified: true,
            disabled: false
        });
        return userRecord;
    }
    catch (error) {
        if (error.code === 'auth/email-already-exists') {
            return await authInstance.getUserByEmail(email);
        }
        throw error;
    }
}
export async function getUserByEmail(email) {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        throw new Error('Firebase Auth nicht initialisiert');
    }
    try {
        return await authInstance.getUserByEmail(email);
    }
    catch (error) {
        return null;
    }
}
export async function disableUser(uid) {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        throw new Error('Firebase Auth nicht initialisiert');
    }
    return await authInstance.updateUser(uid, { disabled: true });
}
export async function enableUser(uid) {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        throw new Error('Firebase Auth nicht initialisiert');
    }
    return await authInstance.updateUser(uid, { disabled: false });
}
export async function listUsers(maxResults = 100) {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        throw new Error('Firebase Auth nicht initialisiert');
    }
    const users = [];
    let nextPageToken;
    do {
        const result = await authInstance.listUsers(maxResults, nextPageToken);
        users.push(...result.users);
        nextPageToken = result.pageToken;
    } while (nextPageToken);
    return users;
}
//# sourceMappingURL=firebaseAuth.js.map