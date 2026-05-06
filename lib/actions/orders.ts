"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { Order } from "@/types";

// ✅ Fetch all orders with optional filter + search
export async function getAllOrders(
  statusFilter?: string,
  searchQuery?: string,
): Promise<Order[]> {
  try {
    console.info("[OrdersAction] Fetching orders", {
      statusFilter,
      searchQuery,
    });

    // Build base query
    let query = adminDb.collection("orders").orderBy("createdAt", "desc");

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      query = query.where("status", "==", statusFilter);
    }

    const snapshot = await query.get();

    // Map + serialize
    let orders = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        updatedAt:
          data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
      } as Order;
    });

    // Client-side search (fine for <1000 orders)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.phone.includes(q),
      );
    }

    return orders;
  } catch (error) {
    console.error("[OrdersAction] Failed to fetch orders", error);
    return [];
  }
}

// ✅ Fetch single order by ID
export async function getOrder(id: string): Promise<Order | null> {
  try {
    console.info("[OrdersAction] Fetching order", { id });

    const doc = await adminDb.collection("orders").doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      updatedAt:
        data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
    } as Order;
  } catch (error) {
    console.error("[OrdersAction] Failed to fetch order", { id, error });
    return null;
  }
}

// ✅ Update order status + optional M-Pesa confirmation
export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  paymentData?: { transactionCode: string },
): Promise<{ success: boolean; message: string }> {
  try {
    console.info("[OrdersAction] Updating order", { id, status, paymentData });

    const order = await getOrder(id);
    if (!order) return { success: false, message: "Order not found" };

    const updateData: Partial<Order> = { status };

    // If payment code provided, update payment object
    if (paymentData?.transactionCode) {
      updateData.payment = {
        method: "M-Pesa",
        status: "confirmed",
        transactionCode: paymentData.transactionCode,
        paidAt: new Date().toISOString(),
      };
      // Auto-advance if was pending
      if (order.status === "pending") {
        updateData.status = "processing";
      }
    }

    await adminDb
      .collection("orders")
      .doc(id)
      .update({
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(),
      });

    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    console.error("[OrdersAction] Failed to update order", { id, error });
    return { success: false, message: "Update failed" };
  }
}

// ✅ Generate order number: BH-YYYYMMDD-XXXX
const generateOrderNumber = (): string => {
  const date = new Date();
  const yyyyMMdd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BH-${yyyyMMdd}-${random}`;
};

// ✅ Create new order (checkout flow)
export async function createOrder({
  customer,
  items,
  deliveryOption,
  deliveryFee,
  subtotal,
  total,
}: {
  customer: {
    name: string;
    phone: string;
    email?: string;
    deliveryAddress: string;
    location: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    priceAtPurchase: number;
    specifications: Record<string, string>;
  }>;
  deliveryOption: "nairobi" | "outside" | "pickup";
  deliveryFee: number;
  subtotal: number;
  total: number;
}): Promise<{
  success: boolean;
  message: string;
  orderId?: string;
  orderNumber?: string;
}> {
  try {
    console.info("[OrdersAction] Creating order", {
      phone: customer.phone,
      items: items.length,
      total,
      deliveryOption,
    });

    const orderNumber = generateOrderNumber();

    const orderData = {
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || null,
        deliveryAddress: customer.deliveryAddress.trim(),
        location: customer.location,
      },
      items,
      subtotal,
      deliveryFee,
      total,
      payment: {
        method: "M-Pesa" as const,
        status: "pending" as const,
        transactionCode: null,
        paidAt: null,
      },
      status: "pending" as const,
      notes:
        deliveryOption === "outside"
          ? "Courier delivery: contact customer for quote"
          : deliveryOption === "pickup"
            ? "Customer will pick up in-store"
            : "In-house delivery within Nairobi",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("orders").add(orderData);

    // Upsert customer record
    const customersSnap = await adminDb
      .collection("customers")
      .where("phone", "==", customer.phone)
      .limit(1)
      .get();

    if (customersSnap.empty) {
      await adminDb.collection("customers").add({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || null,
        orders: [docRef.id],
        lastOrderAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      });
    } else {
      await adminDb
        .collection("customers")
        .doc(customersSnap.docs[0].id)
        .update({
          orders: FieldValue.arrayUnion(docRef.id),
          lastOrderAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
    }

    console.info("[OrdersAction] Order created", {
      orderId: docRef.id,
      orderNumber,
    });

    return {
      success: true,
      message: "Order created successfully",
      orderId: docRef.id,
      orderNumber,
    };
  } catch (error) {
    console.error("[OrdersAction] Failed to create order", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

// ✅ Public order tracking (phone + order number verification)
export async function trackOrder(orderNumber: string, phone: string) {
  try {
    console.info("[OrdersAction] Tracking order", { orderNumber, phone });

    const cleanPhone = phone.replace(/\s/g, "");
    const normalizedPhone = cleanPhone.startsWith("254")
      ? cleanPhone
      : `254${cleanPhone.replace(/^0/, "")}`;

    const snapshot = await adminDb
      .collection("orders")
      .where("orderNumber", "==", orderNumber.trim().toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { success: false, message: "Order number not found" };
    }

    const orderDoc = snapshot.docs[0];
    const orderData = orderDoc.data();

    // Phone verification (format-tolerant)
    const storedPhone = orderData.customer.phone?.replace(/\s/g, "") || "";
    const matchesPhone =
      storedPhone === normalizedPhone ||
      storedPhone === normalizedPhone.replace("+", "") ||
      storedPhone.endsWith(normalizedPhone.slice(-9));

    if (!matchesPhone) {
      return {
        success: false,
        message: "Phone number does not match this order",
      };
    }

    return {
      success: true,
      order: {
        orderNumber: orderData.orderNumber,
        status: orderData.status,
        payment: orderData.payment,
        customer: {
          name: orderData.customer.name,
          deliveryAddress:
            orderData.customer.deliveryAddress || "Pick up in-store",
        },
        items: orderData.items.length,
        total: orderData.total,
        createdAt:
          orderData.createdAt?.toDate?.().toISOString() ||
          new Date().toISOString(),
        notes: orderData.notes || null,
      },
    };
  } catch (error) {
    console.error("[OrdersAction] Failed to track order", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
