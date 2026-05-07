import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Customer } from "@/types";

/**
 * CN Helper: Merge Tailwind classes with conditional logic
 * Shadcn UI standard pattern
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format KES currency with Kenyan locale
 */
export const formatKES = (amount: number): string => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generate BeeHouseholds Order Number: BH-YYYYMMDD-XXXX
 */
export const generateOrderNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BH-${dateStr}-${random}`;
};

/**
 * Build WhatsApp pre-filled message for quote requests
 */
export const buildWhatsAppQuoteMessage = (product?: {
  name: string;
  category: string;
}): string => {
  const base = "Hi BeeHouseholds, I'm interested in";

  if (product) {
    return encodeURIComponent(
      `${base} *${product.name}* (${product.category}). Please share pricing & delivery details to Nairobi.`,
    );
  }

  return encodeURIComponent(
    `${base} your products. Please share your catalog and delivery information.`,
  );
};

/**
 * Conditional logger - respects environment
 * Use for Firebase interactions, auth events, cart actions
 */
export const logger = {
  info: (module: string, message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[BeeHouseholds:${module}] ${message}`, data ? data : "");
    }
  },
  error: (module: string, message: string, error?: unknown) => {
    console.error(`[BeeHouseholds:${module}] ${message}`, error || "");
    // TODO: Integrate with error tracking service (Sentry, etc.) in production
  },
};

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

export function assertCustomer(data: any): Customer {
  if (!data?.name || !data?.phone) {
    throw new Error("Invalid customer data");
  }
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email || undefined,
    orders: Array.isArray(data.orders) ? data.orders : [],
    createdAt: toIsoString(data.createdAt) || new Date().toISOString(),
    updatedAt: toIsoString(data.updatedAt),
    lastOrderAt: toIsoString(data.lastOrderAt),
    notes: data.notes || undefined,
  };
}
