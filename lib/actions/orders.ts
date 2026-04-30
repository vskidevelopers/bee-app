"use server";

import { orderService, logger } from "@/lib/firebase";
import { Order } from "@/types";
import { query, orderBy, where } from "firebase/firestore";

export async function getAllOrders(
  statusFilter?: string,
  searchQuery?: string,
): Promise<Order[]> {
  try {
    let orders: Order[];

    if (statusFilter && statusFilter !== "all") {
      orders = await orderService.getAll([
        where("status", "==", statusFilter),
        orderBy("createdAt", "desc"),
      ]);
    } else {
      orders = await orderService.getAll([orderBy("createdAt", "desc")]);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.phone.includes(q),
      );
    }
    return orders;
  } catch (error) {
    logger.error("Orders", "Failed to fetch orders", error);
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    return await orderService.getById(id);
  } catch (error) {
    logger.error("Orders", "Failed to fetch order", { id, error });
    return null;
  }
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  paymentData?: { transactionCode: string },
): Promise<{ success: boolean; message: string }> {
  try {
    const order = await orderService.getById(id);
    if (!order) return { success: false, message: "Order not found" };

    const updateData: Partial<Order> = { status };

    if (paymentData?.transactionCode) {
      updateData.payment = {
        method: "M-Pesa",
        status: "confirmed",
        transactionCode: paymentData.transactionCode,
        paidAt: new Date().toISOString(),
      };

      if (order.status === "pending") {
        updateData.status = "processing";
      }
    }

    await orderService.update(id, updateData);
    logger.info("Orders", "Order updated", { id, status });
    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    logger.error("Orders", "Failed to update order", { id, error });
    return { success: false, message: "Update failed" };
  }
}
