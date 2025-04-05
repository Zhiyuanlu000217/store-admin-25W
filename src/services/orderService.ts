import { Order, OrderUpdateData } from '@/types/order';

const MAKELINE_API_URL = process.env.NEXT_PUBLIC_MAKELINE_API_URL || 'http://makeline-service:3070';

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${MAKELINE_API_URL}/api/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  updateOrder: async (orderId: string, data: OrderUpdateData): Promise<Order> => {
    const response = await fetch(`${MAKELINE_API_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  },

  deleteOrder: async (orderId: string): Promise<void> => {
    const response = await fetch(`${MAKELINE_API_URL}/api/orders/${orderId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete order');
  },
}; 