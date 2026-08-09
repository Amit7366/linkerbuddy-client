export interface PublicReview {
  id: string;
  rating: number;
  description: string;
  createdAt: string;
  authorName: string;
  orderNumber: string;
}

export interface UserReview {
  id: string;
  orderId: string;
  orderNumber: string;
  rating: number;
  description: string;
  showOnHome: boolean;
  createdAt: string;
}

export interface PendingReviewOrder {
  id: string;
  orderNumber: string;
  totalCents: number;
  currency: string;
  createdAt: string;
}

export interface MyReviewsResponse {
  reviews: UserReview[];
  pendingOrders: PendingReviewOrder[];
  reviewCount: number;
}

export interface PublicReviewsResponse {
  reviews: PublicReview[];
}

export interface AdminReview {
  id: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  description: string;
  showOnHome: boolean;
  createdAt: string;
}

export interface AdminReviewsResponse {
  reviews: AdminReview[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateReviewPayload {
  orderId: string;
  rating: number;
  description: string;
}
