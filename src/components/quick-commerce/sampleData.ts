import { Offer, Address, Review } from './types';

export const SAMPLE_OFFERS: Offer[] = [
  {
    id: '1',
    code: 'FIRST50',
    title: '50% OFF on First Order!',
    description: 'Use code FIRST50 & get 50% off',
    discount: 50,
    discountType: 'percent',
    minOrder: 199,
    maxDiscount: 100,
    expiresAt: '2024-12-31',
  },
  {
    id: '2',
    code: 'QUICK20',
    title: 'Flat ₹20 OFF',
    description: 'No minimum order required',
    discount: 20,
    discountType: 'flat',
    minOrder: 0,
    expiresAt: '2024-12-31',
  },
  {
    id: '3',
    code: 'FREEDEL',
    title: 'FREE Delivery',
    description: 'On orders above ₹149',
    discount: 25,
    discountType: 'flat',
    minOrder: 149,
    expiresAt: '2024-12-31',
  },
];

export const SAMPLE_ADDRESSES: Address[] = [
  {
    id: '1',
    type: 'home',
    label: 'Home',
    address: '123, Green Valley Apartments, Sector 62, Noida, UP 201309',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    label: 'Office',
    address: 'WeWork Galaxy, 43 Residency Road, Ashok Nagar, Bangalore 560025',
    isDefault: false,
  },
];

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    productId: 1,
    userId: 'user1',
    userName: 'Priya S.',
    rating: 5,
    comment: 'Very fresh tomatoes! Delivered within 10 mins.',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    productId: 1,
    userId: 'user2',
    userName: 'Rahul M.',
    rating: 4,
    comment: 'Good quality, slightly smaller than expected.',
    createdAt: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    productId: 2,
    userId: 'user3',
    userName: 'Anita K.',
    rating: 5,
    comment: 'Fresh and creamy! My go-to for daily milk.',
    createdAt: '2024-01-13T08:20:00Z',
  },
  {
    id: '4',
    productId: 3,
    userId: 'user4',
    userName: 'Vikram P.',
    rating: 4,
    comment: 'Crispy and tasty chips!',
    createdAt: '2024-01-12T19:00:00Z',
  },
];

export const DELIVERY_PARTNERS = [
  { name: 'Ravi Kumar', phone: '+91 98765 43210', avatar: '👨‍💼' },
  { name: 'Suresh B.', phone: '+91 98765 43211', avatar: '🧔' },
  { name: 'Amit Singh', phone: '+91 98765 43212', avatar: '👨' },
];
