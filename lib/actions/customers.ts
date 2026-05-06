"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { Customer, Order } from "@/types";

// ✅ Helper: Safely serialize Firestore Timestamp to ISO string
const toIsoString = (value: any): string | undefined => {
  if (!value) return undefined;
  // Handle Firestore Timestamp
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  // Handle already-ISO string
  if (typeof value === "string") {
    return value;
  }
  // Handle Date object
  if (value instanceof Date) {
    return value.toISOString();
  }
  // Fallback
  return undefined;
};

// ✅ Fetch all customers with optional search
export async function getAllCustomers(
  searchQuery?: string,
): Promise<Customer[]> {
  try {
    console.info("[CustomersAction] Fetching customers", {
      query: searchQuery,
    });

    const snapshot = await adminDb
      .collection("customers")
      .orderBy("createdAt", "desc")
      .get();

    let customers = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: toIsoString(data.createdAt) || new Date().toISOString(),
        updatedAt: toIsoString(data.updatedAt) || new Date().toISOString(),
        lastOrderAt: toIsoString(data.lastOrderAt), // ✅ Fixed: use helper
      } as Customer;
    });

    // Client-side search filter (fine for <1000 customers)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email?.toLowerCase().includes(q),
      );
    }

    // Sort by last order date (newest first)
    return customers.sort((a, b) => {
      const aDate = a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0;
      const bDate = b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0;
      return bDate - aDate;
    });
  } catch (error) {
    console.error("[CustomersAction] Failed to fetch customers", error);
    return [];
  }
}

// ✅ Fetch single customer with order history
export async function getCustomerWithOrders(
  id: string,
): Promise<{ customer: Customer | null; orders: Order[] }> {
  try {
    console.info("[CustomersAction] Fetching customer with orders", { id });

    // Fetch customer
    const customerDoc = await adminDb.collection("customers").doc(id).get();
    if (!customerDoc.exists) return { customer: null, orders: [] };

    const customerData = customerDoc.data();
    const customer: Customer = {
      id: customerDoc.id,
      ...customerData,
      createdAt:
        toIsoString(customerData.createdAt) || new Date().toISOString(),
      updatedAt:
        toIsoString(customerData.updatedAt) || new Date().toISOString(),
      lastOrderAt: toIsoString(customerData.lastOrderAt),
    };

    // Fetch orders for this customer (by phone match)
    const ordersSnap = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const customerOrders = ordersSnap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toIsoString(data.createdAt) || new Date().toISOString(),
          updatedAt: toIsoString(data.updatedAt) || new Date().toISOString(),
        } as Order;
      })
      .filter((o) => o.customer.phone === customer.phone);

    return {
      customer,
      orders: customerOrders,
    };
  } catch (error) {
    console.error("[CustomersAction] Failed to fetch customer details", {
      id,
      error,
    });
    return { customer: null, orders: [] };
  }
}

// ✅ Update customer notes (only mutable field)
export async function updateCustomerNotes(
  id: string,
  notes: string,
): Promise<{ success: boolean; message: string }> {
  try {
    console.info("[CustomersAction] Updating customer notes", {
      id,
      notesLength: notes.length,
    });

    await adminDb.collection("customers").doc(id).update({
      notes: notes.trim(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Notes updated successfully" };
  } catch (error) {
    console.error("[CustomersAction] Failed to update notes", { id, error });
    return { success: false, message: "Update failed" };
  }
}

// ✅ Get customer stats for dashboard
export async function getCustomerStats(): Promise<{
  total: number;
  withOrders: number;
  recent30Days: number;
}> {
  try {
    const snapshot = await adminDb.collection("customers").get();
    const customers = snapshot.docs.map((doc) => doc.data());

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    return {
      total: customers.length,
      withOrders: customers.filter((c) => (c.orders?.length || 0) > 0).length,
      recent30Days: customers.filter((c) => {
        if (!c.lastOrderAt) return false;
        // ✅ Safe timestamp handling for stats
        const lastOrderTime = toIsoString(c.lastOrderAt)
          ? new Date(toIsoString(c.lastOrderAt)!).getTime()
          : 0;
        return lastOrderTime > thirtyDaysAgo;
      }).length,
    };
  } catch (error) {
    console.error("[CustomersAction] Failed to fetch stats", error);
    return { total: 0, withOrders: 0, recent30Days: 0 };
  }
}
