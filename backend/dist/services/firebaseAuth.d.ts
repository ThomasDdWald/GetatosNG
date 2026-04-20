export declare function initFirebase(): boolean;
export declare function getFirebaseAuth(): import("firebase-admin/auth").Auth;
export declare function verifyIdToken(idToken: string): Promise<import("firebase-admin/auth").DecodedIdToken>;
export declare function createUser(email: string, password: string, displayName?: string): Promise<import("firebase-admin/auth").UserRecord>;
export declare function getUserByEmail(email: string): Promise<import("firebase-admin/auth").UserRecord>;
export declare function disableUser(uid: string): Promise<import("firebase-admin/auth").UserRecord>;
export declare function enableUser(uid: string): Promise<import("firebase-admin/auth").UserRecord>;
export declare function listUsers(maxResults?: number): Promise<any[]>;
//# sourceMappingURL=firebaseAuth.d.ts.map