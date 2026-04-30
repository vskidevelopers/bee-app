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
