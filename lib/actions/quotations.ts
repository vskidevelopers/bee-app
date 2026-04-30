"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { Quotation } from "@/types";

export async function createQuotation(
  data: Omit<Quotation, "id" | "createdAt" | "updatedAt" | "status">,
) {
  console.info("[QuotationsAction] Creating quotation", {
    phone: data.phone,
    product: data.productInterest,
  });

  const docRef = await adminDb.collection("quotations").add({
    ...data,
    status: "new",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, id: docRef.id };
}

export async function getAllQuotations(
  statusFilter?: string,
): Promise<Quotation[]> {
  console.info("[QuotationsAction] Fetching quotations", { statusFilter });

  let query = adminDb.collection("quotations").orderBy("createdAt", "desc");
  if (statusFilter && statusFilter !== "all") {
    query = query.where("status", "==", statusFilter);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      updatedAt:
        data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
    } as Quotation;
  });
}

export async function updateQuotationStatus(
  id: string,
  status: Quotation["status"],
) {
  console.info("[QuotationsAction] Updating quotation status", { id, status });

  await adminDb.collection("quotations").doc(id).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Status updated" };
}
