"use server";

import { adminDb } from "@/lib/firebase-admin";
import { Order } from "@/types";

export async function getDashboardStats() {
  console.info("[DashboardAction] Fetching live stats");

  // Parallel fetches for performance
  const [ordersSnap, productsSnap, customersSnap, quotesSnap, contactsSnap] =
    await Promise.all([
      adminDb.collection("orders").orderBy("createdAt", "desc").get(),
      adminDb.collection("products").get(),
      adminDb.collection("customers").get(),
      adminDb.collection("quotations").where("status", "==", "new").get(),
      adminDb.collection("contacts").where("status", "==", "new").get(),
    ]);

  // Process orders
  let totalOrders = 0;
  let pendingOrders = 0;
  let confirmedRevenue = 0;
  const recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: Order["status"];
    createdAt: string;
  }> = [];

  ordersSnap.forEach((doc) => {
    const data = doc.data() as Order;
    totalOrders++;
    if (data.status === "pending") pendingOrders++;
    if (data.payment?.status === "confirmed")
      confirmedRevenue += data.total || 0;

    if (recentOrders.length < 5) {
      recentOrders.push({
        id: doc.id,
        orderNumber: data.orderNumber,
        customer: data.customer.name,
        total: data.total || 0,
        status: data.status,
        createdAt: data.createdAt,
      });
    }
  });

  return {
    stats: {
      totalOrders,
      pendingOrders,
      confirmedRevenue,
      totalProducts: productsSnap.size,
      totalCustomers: customersSnap.size,
      newQuotations: quotesSnap.size,
      newInquiries: contactsSnap.size,
    },
    recentOrders,
  };
}
