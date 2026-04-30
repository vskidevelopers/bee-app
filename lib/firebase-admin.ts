import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(
          Buffer.from(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
            "base64",
          ).toString("utf-8"),
        )
      : undefined;

    if (!serviceAccount) {
      throw new Error(
        "Missing FIREBASE_SERVICE_ACCOUNT_KEY in environment variables",
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
