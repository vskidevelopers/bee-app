"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { ContactInquiry } from "@/types";

export async function createContactInquiry(
  data: Omit<ContactInquiry, "id" | "createdAt" | "updatedAt" | "status">,
): Promise<{ success: boolean; id: string }> {
  console.info("[ContactsAction] Creating inquiry", {
    phone: data.phone,
    subject: data.subject,
    source: data.source || "contact-page",
  });

  // Format phone to E.164
  const phone = data.phone.startsWith("254")
    ? data.phone
    : `254${data.phone.replace(/^0/, "")}`;

  const inquiryData = {
    name: data.name.trim(),
    phone,
    email: data.email?.trim() || null,
    subject: data.subject.trim(),
    message: data.message.trim(),
    source: data.source || "contact-page",
    status: "new" as const,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const docRef = await adminDb.collection("contacts").add(inquiryData);

  console.info("[ContactsAction] Inquiry created", {
    id: docRef.id,
    phone,
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
