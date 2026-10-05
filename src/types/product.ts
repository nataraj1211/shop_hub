export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type GrocerySize = '250g' | '500g' | '1kg' | '2kg' | '5kg';
export type ElectronicsSize = 'Standard' | 'Compact' | 'Large';
export type HomeSize = 'Small' | 'Medium' | 'Large' | 'Extra Large';

export type ProductSize = ClothingSize | GrocerySize | ElectronicsSize | HomeSize;

export interface Product {
  id: string;
  name: string;
  category: 'groceries' | 'electronics' | 'fashion' | 'home';
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  inStock: boolean;
  stock: number;
  discount?: number;
  sizes?: ProductSize[];
  selectedSize?: ProductSize;
  flipkartUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: ProductSize;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod?: 'upi' | 'card' | 'cod';
  isNew?: boolean;
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
