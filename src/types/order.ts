export interface OrderItem {
  name: string;
  sku: string;
  quantity: string;
}

export interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  timestamp: string;
  status: string;
  processedAt: string;
  notes?: string;
}

export interface OrderUpdateData {
  status: string;
  notes?: string;
} 