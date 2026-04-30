"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { ContactInquiry } from "@/types";

export async function createContactInquiry(
  data: Omit<ContactInquiry, "id" | "createdAt" | "updatedAt" | "status">,
) {
  console.info("[ContactsAction] Creating inquiry", {
    phone: data.phone,
    subject: data.subject,
  });

  const docRef = await adminDb.collection("contacts").add({
    ...data,
    status: "new",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, id: docRef.id };
}

export async function getAllContactInquiries(
  statusFilter?: string,
): Promise<ContactInquiry[]> {
  console.info("[ContactsAction] Fetching inquiries", { statusFilter });

  let query = adminDb.collection("contacts").orderBy("createdAt", "desc");
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
    } as ContactInquiry;
  });
}

export async function updateInquiryStatus(
  id: string,
  status: ContactInquiry["status"],
) {
  console.info("[ContactsAction] Updating inquiry status", { id, status });

  await adminDb.collection("contacts").doc(id).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Status updated" };
}
