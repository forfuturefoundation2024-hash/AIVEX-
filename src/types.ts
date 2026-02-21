export interface User {
  id: number;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
}

export interface Product {
  id: number;
  seller_id: number;
  seller_name: string;
  name: string;
  description: string;
  price: number;
  category: string;
  version: string;
  screenshots?: string;
  file_url?: string;
  contact_number?: string;
  views: number;
  clicks: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Seller {
  id: number;
  name: string;
  email: string;
  created_at: string;
  product_count: number;
}

export interface Order {
  id: number;
  buyer_id: number;
  product_id: number;
  product_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  sender_name?: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
