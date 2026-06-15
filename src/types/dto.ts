// Mirrors of backend enums and DTOs (see Tomato-Low-Level-Design.md Section 5/6/8)

export type Role = 'USER' | 'RESTAURANT' | 'DELIVERY_PARTNER' | 'ADMIN';

export type OrderStatus =
  | 'CREATED'
  | 'PAYMENT_FAILED'
  | 'PLACED'
  | 'RESTAURANT_CONFIRMED'
  | 'RESTAURANT_REJECTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type DeliveryStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'PICKED_UP' | 'DELIVERED';

export type NotificationType =
  | 'ORDER_PLACED'
  | 'ORDER_CONFIRMED'
  | 'ORDER_REJECTED'
  | 'ORDER_UPDATED'
  | 'ORDER_PICKED_UP'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED';

export type RestaurantStatus = 'OPEN' | 'CLOSED';

// --- Auth ---

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: number;
}

// --- User ---

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  address: string | null;
}

// --- Restaurant ---

export interface CreateRestaurantRequest {
  name: string;
  cuisine?: string;
  address?: string;
  phone?: string;
}

export interface UpdateRestaurantRequest {
  name: string;
  cuisine?: string;
  address?: string;
  phone?: string;
  status: RestaurantStatus;
}

export interface RestaurantResponse {
  id: number;
  ownerId: number;
  name: string;
  cuisine: string | null;
  address: string | null;
  phone: string | null;
  averageRating: number | null;
  ratingCount: number | null;
  status: RestaurantStatus;
}

// --- Menu ---

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export interface UpdateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
  active: boolean;
}

export interface MenuItemResponse {
  id: number;
  restaurantId: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  active: boolean;
}

// --- Orders ---

export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: number;
  restaurantId: number;
  deliveryAddress?: string;
  specialInstructions?: string;
  items: OrderItemRequest[];
}

export interface CreateOrderResponse {
  orderId: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}

export interface OrderItemResponse {
  menuItemId: number;
  name: string;
  quantity: number;
  itemPrice: number;
  totalPrice: number;
}

export interface OrderResponse {
  id: number;
  customerId: number;
  restaurantId: number;
  restaurantName: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string | null;
  specialInstructions: string | null;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}

// --- Payments ---

export interface PaymentRequest {
  orderId: number;
  amount: number;
  paymentMethod?: string;
}

export interface PaymentResponse {
  status: PaymentStatus;
  transactionId: string;
}

// --- Ratings ---

export interface RatingRequest {
  orderId: number;
  score: number;
  comment?: string;
}

export interface RatingResponse {
  id: number;
  orderId: number;
  restaurantId: number;
  userId: number;
  score: number;
  comment: string | null;
  createdAt: string;
}

// --- Notifications ---

export interface NotificationResponse {
  id: number;
  orderId: number;
  type: NotificationType;
  message: string;
  createdAt: string;
  read: boolean;
}

// --- Delivery ---

export interface AvailableOrderResponse {
  orderId: number;
  restaurantName: string;
  restaurantAddress: string | null;
  deliveryAddress: string | null;
  totalAmount: number;
}

// --- Errors ---

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  details: string[] | null;
}
