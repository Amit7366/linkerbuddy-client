export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERING"
  | "COMPLETE"
  | "FAILED"
  | "REJECTED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";

export type ServiceType = "GUEST" | "INSERT";

export type OrderItem = {
  id: string;
  listingId: number;
  domain: string;
  niche: string;
  serviceType: ServiceType;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type OrderStatusEvent = {
  id: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note: string | null;
  changedById: string | null;
  createdAt: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currency: string;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  promoCodeId?: string | null;
  promoCodeLabel?: string | null;
  manualTotalCents?: number | null;
  notes: string | null;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingCompany: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  items: OrderItem[];
  statusEvents: OrderStatusEvent[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
};

export type OrdersListResponse = {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
};

export type CheckoutBilling = {
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingCompany?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string | null;
};

export type CheckoutIntentPayload = {
  items: Array<{
    listingId: number;
    serviceType: ServiceType;
    quantity: number;
  }>;
  billing: CheckoutBilling;
  saveBillingToProfile?: boolean;
};

export type CheckoutIntentResponse = {
  orderId: string;
  orderNumber: string;
  clientSecret: string;
  totalCents: number;
  currency: string;
};

export type BillingProfile = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  phone: string | null;
  company: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
};
