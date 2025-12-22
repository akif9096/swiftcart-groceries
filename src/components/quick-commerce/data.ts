import { Category, Product } from './types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Fresh', icon: '🥬' },
  { id: 2, name: 'Dairy', icon: '🥛' },
  { id: 3, name: 'Snacks', icon: '🍿' },
  { id: 4, name: 'Drinks', icon: '🥤' },
  { id: 5, name: 'Fruits', icon: '🍎' },
  { id: 6, name: 'Bakery', icon: '🥐' },
];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Fresh Tomatoes', price: 40, categoryId: 1, image: '🍅', rating: 4.5, eta: '10 min', unit: '500g' },
  { id: 2, name: 'Organic Milk', price: 60, categoryId: 2, image: '🥛', rating: 4.8, eta: '8 min', unit: '1L' },
  { id: 3, name: 'Classic Chips', price: 25, categoryId: 3, image: '🍟', rating: 4.7, eta: '12 min', unit: '150g' },
  { id: 4, name: 'Cola Drink', price: 45, categoryId: 4, image: '🥤', rating: 4.4, eta: '9 min', unit: '750ml' },
  { id: 5, name: 'Fresh Spinach', price: 35, categoryId: 1, image: '🥬', rating: 4.3, eta: '10 min', unit: '250g' },
  { id: 6, name: 'Greek Yogurt', price: 80, categoryId: 2, image: '🫙', rating: 4.6, eta: '8 min', unit: '400g' },
  { id: 7, name: 'Mixed Nuts', price: 150, categoryId: 3, image: '🥜', rating: 4.9, eta: '11 min', unit: '200g' },
  { id: 8, name: 'Orange Juice', price: 55, categoryId: 4, image: '🧃', rating: 4.5, eta: '9 min', unit: '1L' },
  { id: 9, name: 'Red Apples', price: 120, categoryId: 5, image: '🍎', rating: 4.7, eta: '10 min', unit: '1kg' },
  { id: 10, name: 'Bananas', price: 50, categoryId: 5, image: '🍌', rating: 4.8, eta: '10 min', unit: '6 pcs' },
  { id: 11, name: 'Croissant', price: 45, categoryId: 6, image: '🥐', rating: 4.6, eta: '12 min', unit: '2 pcs' },
  { id: 12, name: 'Fresh Bread', price: 35, categoryId: 6, image: '🍞', rating: 4.4, eta: '12 min', unit: '400g' },
];
