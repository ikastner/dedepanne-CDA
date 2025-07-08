import { apiClient } from '../api';

export interface Order {
  id: number;
  user_id: number;
  reference_code: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_date?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  price: number;
  created_at: string;
}

export class OrdersService {
  // Récupérer toutes les commandes
  static async getOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/products/orders');
  }

  // Récupérer une commande par ID
  static async getOrder(id: number): Promise<Order> {
    return apiClient.get<Order>(`/products/orders/${id}`);
  }

  // Créer une nouvelle commande
  static async createOrder(data: any): Promise<Order> {
    return apiClient.post<Order>('/products/orders', data);
  }

  // Mettre à jour le statut d'une commande
  static async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    return apiClient.put<Order>(`/products/orders/${id}`, { status });
  }
} 