/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { customerService, orderService } from "@/lib/firebase";
import { Customer, Order } from "@/types";

// Fetch all customers with optional search
export async function getAllCustomers(
  searchQuery?: string,
): Promise<Customer[]> {
  try {
    console.info("[CustomersAction] Fetching customers", {
      query: searchQuery,
    });

    let customers = await customerService.getAll();

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

// Fetch single customer with order history
export async function getCustomerWithOrders(
  id: string,
): Promise<{ customer: Customer | null; orders: Order[] }> {
  try {
    console.info("[CustomersAction] Fetching customer with orders", { id });

    const customer = await customerService.getById(id);
    if (!customer) return { customer: null, orders: [] };

    // Fetch orders for this customer (by phone match)
    const orders = await orderService.getAll();
    const customerOrders = orders.filter(
      (o) => o.customer.phone === customer.phone,
    );

    return {
      customer,
      orders: customerOrders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    };
  } catch (error) {
    console.error("[CustomersAction] Failed to fetch customer details", {
      id,
      error,
    });
    return { customer: null, orders: [] };
  }
}

// Update customer notes (only mutable field for customers)
export async function updateCustomerNotes(
  id: string,
  notes: string,
): Promise<{ success: boolean; message: string }> {
  try {
    console.info("[CustomersAction] Updating customer notes", {
      id,
      notesLength: notes.length,
    });

    await customerService.update(id, {
      notes,
      updatedAt: new Date().toISOString(),
    } as any);

    return { success: true, message: "Notes updated successfully" };
  } catch (error) {
    console.error("[CustomersAction] Failed to update notes", { id, error });
    return { success: false, message: "Update failed" };
  }
}

// Get customer stats for dashboard
export async function getCustomerStats(): Promise<{
  total: number;
  withOrders: number;
  recent30Days: number;
}> {
  try {
    const customers = await customerService.getAll();
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    return {
      total: customers.length,
      withOrders: customers.filter((c) => (c.orders?.length || 0) > 0).length,
      recent30Days: customers.filter((c) => {
        if (!c.lastOrderAt) return false;
        return new Date(c.lastOrderAt).getTime() > thirtyDaysAgo;
      }).length,
    };
  } catch (error) {
    console.error("[CustomersAction] Failed to fetch stats", error);
    return { total: 0, withOrders: 0, recent30Days: 0 };
  }
}
