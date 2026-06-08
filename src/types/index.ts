export type ProductCategory = "mens" | "womens" | "unisex";

export interface Product {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  images: string[];
  primaryCategory: ProductCategory;
  subCategory: string;
  stockCount: number;
  createdAt: number; // timestamp
  ratingsAverage: number;
}

export interface Category {
  id: string;
  name: string;
  parentCategory: ProductCategory;
}

export type DeliveryMethod = "COD" | "BankDeposit";
export type PaymentStatus = "Pending Verification" | "Paid";
export type OrderStatus = "Pending" | "Dispatched" | "Delivered";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryMethod: DeliveryMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  bankReceiptUrl: string | null;
  createdAt: number; // timestamp
}

export interface Offer {
  id: string;
  offerType: "free_delivery";
  thresholdAmount: number;
  isActive: boolean;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: number; // timestamp
}
