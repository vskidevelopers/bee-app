"use server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { logger } from "@/lib/firebase";
import { Product } from "@/types";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const parseSpecs = (specs: { key: string; value: string }[]) => {
  return specs.reduce(
    (acc, curr) => {
      if (curr.key.trim()) acc[curr.key.trim()] = curr.value.trim();
      return acc;
    },
    {} as Record<string, string>,
  );
};

export async function createProduct(
  formData: FormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    logger.info("Products", "Creating new product");

    const images = JSON.parse((formData.get("images") as string) || "[]");
    const specs = JSON.parse(
      (formData.get("specifications") as string) || "[]",
    );

    const productData = {
      name: formData.get("name") as string,
      slug: generateSlug(formData.get("name") as string),
      category: formData.get("category") as string,
      shortDescription: formData.get("shortDescription") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      discountPrice: formData.get("discountPrice")
        ? Number(formData.get("discountPrice"))
        : null,
      currency: "KES",
      images,
      specifications: parseSpecs(specs),
      featured: formData.get("featured") === "true",
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("products").add(productData);

    logger.info("Products", "Product created successfully", { id: docRef.id });
    return {
      success: true,
      message: "Product created successfully",
      id: docRef.id,
    };
  } catch (error) {
    logger.error("Products", "Failed to create product", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  try {
    logger.info("Products", "Updating product", { id });

    const images = JSON.parse((formData.get("images") as string) || "[]");
    const specs = JSON.parse(
      (formData.get("specifications") as string) || "[]",
    );

    const updateData = {
      name: formData.get("name") as string,
      slug: generateSlug(formData.get("name") as string),
      category: formData.get("category") as string,
      shortDescription: formData.get("shortDescription") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      discountPrice: formData.get("discountPrice")
        ? Number(formData.get("discountPrice"))
        : null,
      currency: "KES",
      images,
      specifications: parseSpecs(specs),
      featured: formData.get("featured") === "true",
      updatedAt: FieldValue.serverTimestamp(),
    };

    await adminDb.collection("products").doc(id).update(updateData);

    logger.info("Products", "Product updated successfully", { id });
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    logger.error("Products", "Failed to update product", { id, error });
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    logger.info("Products", "Deleting product", { id });
    await adminDb.collection("products").doc(id).delete();
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    logger.error("Products", "Failed to delete product", { id, error });
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const doc = await adminDb.collection("products").doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    // Serialize Timestamps to ISO strings for Client Components
    return {
      id: doc.id,
      ...data,
      createdAt:
        data?.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      updatedAt:
        data?.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
      discountPrice: data?.discountPrice || undefined,
    } as Product;
  } catch (error) {
    logger.error("Products", "Failed to fetch product", { id, error });
    return null;
  }
}

export async function getAllProducts(query?: string): Promise<Product[]> {
  try {
    let snapshot;
    if (query) {
      // Simple search: fetch all and filter (fine for <1000 products)
      snapshot = await adminDb
        .collection("products")
        .orderBy("createdAt", "desc")
        .get();
    } else {
      snapshot = await adminDb
        .collection("products")
        .orderBy("createdAt", "desc")
        .get();
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt:
          data?.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        updatedAt:
          data?.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
        discountPrice: data?.discountPrice || undefined,
      } as Product;
    });
  } catch (error) {
    logger.error("Products", "Failed to fetch products", error);
    return [];
  }
}

export async function getPublicProducts({
  category,
  minPrice,
  maxPrice,
  search,
  page = 1,
  limit = 12,
}: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
  try {
    console.info("[ProductsAction] Fetching public products", {
      category,
      priceRange: { minPrice, maxPrice },
      search,
      page,
    });

    // ✅ Start with base query — NO stock filter
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      adminDb.collection("products");

    // Category filter
    if (category && category !== "all") {
      query = query.where("category", "==", category);
    }

    // Price filters
    if (minPrice !== undefined) {
      query = query.where("price", ">=", minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.where("price", "<=", maxPrice);
    }

    // Sort by newest first
    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();

    // Map to Product type with serialization
    let products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        updatedAt:
          data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
        discountPrice: data.discountPrice || undefined,
      } as Product;
    });

    // Client-side search (simple, fine for <1000 products)
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    // Pagination
    const total = products.length;
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + limit);

    return {
      products: paginated,
      total,
      hasMore: start + limit < total,
    };
  } catch (error) {
    console.error("[ProductsAction] Failed to fetch public products", error);
    return { products: [], total: 0, hasMore: false };
  }
}

export async function getPublicProduct(slug: string): Promise<Product | null> {
  try {
    console.info("[ProductsAction] Fetching public product", { slug });

    // Query by slug only — no stock filter
    const snapshot = await adminDb
      .collection("products")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      updatedAt:
        data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
      discountPrice: data.discountPrice || undefined,
    } as Product;
  } catch (error) {
    console.error("[ProductsAction] Failed to fetch public product", {
      slug,
      error,
    });
    return null;
  }
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const snapshot = await adminDb
      .collection("products")
      .select("category")
      .get();

    const categories = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const cat = doc.data().category;
      if (cat) categories.add(cat);
    });

    return Array.from(categories).sort();
  } catch (error) {
    console.error("[ProductsAction] Failed to fetch categories", error);
    return [];
  }
}
