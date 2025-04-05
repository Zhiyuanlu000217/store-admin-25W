import { Order, OrderUpdateData } from '@/types/order';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://makeline-service:3070/api/orders'
  : 'http://localhost:3070/api/orders';

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  updateOrder: async (orderId: string, data: OrderUpdateData): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  },

  deleteOrder: async (orderId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${orderId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete order');
  },
}; 