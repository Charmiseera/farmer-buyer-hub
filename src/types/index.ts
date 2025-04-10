
export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  phone: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Product {
  id: string;
  cropName: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
  availableUntil: string;
  farmerId: string;
  farmerName?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Delivered' | 'Canceled';

export interface Order {
  id: string;
  productId: string;
  product?: Product;
  buyerId: string;
  buyerName?: string;
  farmerId: string;
  farmerName?: string;
  quantityOrdered: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
