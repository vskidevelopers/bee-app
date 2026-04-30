// types/index.ts

// Product - Home Goods Schema
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // 'duvets' | 'mosquito-nets' | etc.
  shortDescription: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: "KES";
  images: { url: string; alt: string; cloudinaryId?: string }[];
  specifications: Record<string, string>; // { size: 'Queen', material: 'Cotton' }
  stock: number;
  featured: boolean;
  createdAt: string; // ISO string (serialized)
  updatedAt: string;
}

// Order - Manual M-Pesa Flow
export interface Order {
  id: string;
  orderNumber: string; // BH-YYYYMMDD-XXXX
  customer: {
    name: string;
    phone: string;
    email?: string;
    deliveryAddress: string;
    location: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
    priceAtPurchase: number;
    specifications: Record<string, string>;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: {
    method: "M-Pesa";
    status: "pending" | "confirmed" | "failed";
    transactionCode?: string;
    paidAt?: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Customer
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  orders: string[]; // Order IDs
  createdAt: string;
  lastOrderAt?: string;
  notes?: string;
}

// WhatsApp Lead
export interface WhatsAppLead {
  id: string;
  source: "product-page" | "home-page" | "cart";
  productId?: string;
  productName?: string;
  customerPhone: string;
  preFilledMessage: string;
  clickedAt: string;
}

// Quotation Request (from public /quote page)
export interface Quotation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  productInterest?: string; // e.g., "Warm Duvets", "Smart Gadgets"
  message: string;
  source: "quote-page" | "product-page" | "whatsapp-redirect";
  status: "new" | "contacted" | "quoted" | "closed";
  createdAt: string; // ISO string
  updatedAt: string;
}

// Contact Form Submission (from public /contact page)
export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  source: "contact-page" | "footer" | "whatsapp-fallback";
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
  updatedAt: string;
}
