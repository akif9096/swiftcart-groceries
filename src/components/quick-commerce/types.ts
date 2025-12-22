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
}

export interface CartItem extends Product {
  qty: number;
}
