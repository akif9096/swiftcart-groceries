export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  image: string;
  rating: number;
  eta: string;
  unit?: string;
  originalPrice?: number;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
  isDefault: boolean;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percent' | 'flat';
  minOrder: number;
  maxDiscount?: number;
  expiresAt: string;
  banner?: string;
}

export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  discount: number;
  deliveryFee: number;
  status: 'preparing' | 'picked' | 'on_the_way' | 'delivered';
  address: Address;
  deliveryPartner: {
    name: string;
    phone: string;
    avatar: string;
  };
  estimatedTime: number;
  placedAt: string;
}
