/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type User } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type QueryConstraint,
  type DocumentData,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Emulator support (dev only)
if (
  process.env.NEXT_PUBLIC_USE_EMULATORS === "true" &&
  typeof window !== "undefined"
) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
}

// ============================================================================
// 🔧 SERIALIZATION: Convert Firestore types to JSON-safe formats
// ============================================================================

/**
 * Recursively converts Firestore Timestamps and other non-serializable types
 * to plain JavaScript objects/strings for safe transfer to Client Components.
 */
export const serializeFirestoreData = <T extends Record<string, any>>(
  data: T | null,
): T | null => {
  if (!data) return data;

  const serialized = { ...data } as any;

  Object.keys(serialized).forEach((key) => {
    const value = serialized[key];

    // Timestamp → ISO string
    if (value instanceof Timestamp) {
      serialized[key] = value.toDate().toISOString();
    }
    // Nested object → recurse
    else if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      value.constructor === Object
    ) {
      serialized[key] = serializeFirestoreData(value);
    }
    // Array → map each item
    else if (Array.isArray(value)) {
      serialized[key] = value.map((item) =>
        item instanceof Timestamp
          ? item.toDate().toISOString()
          : item && typeof item === "object"
            ? serializeFirestoreData(item)
            : item,
      );
    }
  });

  return serialized as T;
};

/**
 * Deserialize ISO strings back to Timestamps when sending data TO Firestore
 * (Optional: usually Firestore handles this, but useful for complex updates)
 */
export const deserializeToFirestore = <T extends Record<string, any>>(
  data: T,
): T => {
  if (!data) return data;

  const deserialized = { ...data } as any;

  Object.keys(deserialized).forEach((key) => {
    const value = deserialized[key];

    // Detect ISO string pattern and convert to Timestamp
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
    ) {
      deserialized[key] = Timestamp.fromDate(new Date(value));
    } else if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      value.constructor === Object
    ) {
      deserialized[key] = deserializeToFirestore(value);
    } else if (Array.isArray(value)) {
      deserialized[key] = value.map((item) =>
        typeof item === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(item)
          ? Timestamp.fromDate(new Date(item))
          : item && typeof item === "object"
            ? deserializeToFirestore(item)
            : item,
      );
    }
  });

  return deserialized as T;
};

// ============================================================================
// 🗄 GENERIC CRUD HELPERS (Type-Safe)
// ============================================================================

/**
 * Generic Firestore service class for type-safe CRUD operations.
 * Usage: const productService = new FirestoreService<Product>('products');
 */
export class FirestoreService<T extends Record<string, any>> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private getCollection() {
    return collection(db, this.collectionName);
  }

  private getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  /**
   * CREATE: Add new document with auto-generated ID
   * Returns the new document ID
   */
  async create(
    data: Omit<T, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const docRef = await addDoc(this.getCollection(), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  /**
   * CREATE with custom ID: Add document with specified ID
   */
  async createWithId(
    id: string,
    data: Omit<T, "id" | "createdAt" | "updatedAt">,
  ): Promise<void> {
    await addDoc(this.getCollection(), {
      id,
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * READ ONE: Get document by ID, serialized for client
   * Returns null if not found
   */
  async getById(id: string): Promise<T | null> {
    const docSnap = await getDoc(this.getDocRef(id));
    if (!docSnap.exists()) return null;

    const data = docSnap.data() as T;
    return serializeFirestoreData({ id: docSnap.id, ...data });
  }

  /**
   * READ MANY: Get all documents with optional query constraints
   * Returns serialized array for client
   */
  async getAll(queryConstraints: QueryConstraint[] = []): Promise<T[]> {
    const q = query(this.getCollection(), ...queryConstraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as T;
      return serializeFirestoreData({ id: docSnap.id, ...data }) as T;
    });
  }

  /**
   * READ with filters: Convenience method for common where clauses
   */
  async getByField(
    field: keyof T,
    value: any,
    limitCount?: number,
  ): Promise<T[]> {
    const constraints: QueryConstraint[] = [
      where(field as string, "==", value),
    ];
    if (limitCount) constraints.push(limit(limitCount));

    return this.getAll(constraints);
  }

  /**
   * UPDATE: Modify existing document by ID
   * Only updates provided fields (partial update)
   */
  async update(id: string, data: Partial<T>): Promise<void> {
    await updateDoc(this.getDocRef(id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * DELETE: Remove document by ID
   */
  async delete(id: string): Promise<void> {
    await deleteDoc(this.getDocRef(id));
  }

  /**
   * SEARCH: Full-text style search on multiple fields (client-side filter after fetch)
   * Note: For production-scale, use Algolia or Firestore composite indexes
   */
  async search(
    searchTerm: string,
    searchFields: (keyof T)[],
    limitCount = 50,
  ): Promise<T[]> {
    const all = await this.getAll([limit(limitCount)]);
    const term = searchTerm.toLowerCase();

    return all.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string")
          return value.toLowerCase().includes(term);
        return false;
      }),
    );
  }
}

// ============================================================================
// 🎯 PRE-INSTANTIATED SERVICES (Import these directly in Server Actions)
// ============================================================================

// Product service
import type { Product } from "@/types";
export const productService = new FirestoreService<Product>("products");

// Order service
import type { Order } from "@/types";
export const orderService = new FirestoreService<Order>("orders");

// Customer service
import type { Customer } from "@/types";
export const customerService = new FirestoreService<Customer>("customers");

// WhatsApp Lead service
import type { WhatsAppLead } from "@/types";
export const leadService = new FirestoreService<WhatsAppLead>("whatsapp_leads");

// ============================================================================
// 🪵 LOGGER (Consistent debugging across app)
// ============================================================================

export const logger = {
  info: (module: string, message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[BeeHouseholds:${module}] ${message}`, data ?? "");
    }
  },
  error: (module: string, message: string, error?: unknown) => {
    console.error(`[BeeHouseholds:${module}] ${message}`, error || "");
    // TODO: Integrate Sentry/LogRocket in production
  },
};
