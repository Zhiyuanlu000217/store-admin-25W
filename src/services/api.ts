import { Product, ProductFormData } from '@/types/product';
import { Order, OrderUpdateData } from '@/types/order';

// Use environment variables with fallbacks for development
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:3060';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3080';
const MAKELINE_API_URL = process.env.NODE_ENV === 'production'
  ? 'http://makeline-service:3070'
  : (process.env.NEXT_PUBLIC_MAKELINE_API_URL || 'http://localhost:3070');

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${PRODUCT_API_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function createProduct(product: ProductFormData): Promise<Product> {
  const response = await fetch(`${PRODUCT_API_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
}

export async function deleteProduct(sku: string): Promise<void> {
  const response = await fetch(`${PRODUCT_API_URL}/api/products/${sku}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}

export async function generateDescription(keywords: string): Promise<string> {
  const response = await fetch(`${AI_SERVICE_URL}/api/generate-description`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keywords }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate description');
  }
  return response.text();
}

export async function generateImage(keywords: string): Promise<string> {
  const response = await fetch(`${AI_SERVICE_URL}/api/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keywords }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate image');
  }
  const data = await response.json();
  return data.imageUrl;
}

// Order related functions
export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${MAKELINE_API_URL}/api/orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

export async function updateOrder(id: string, data: OrderUpdateData): Promise<{ message: string }> {
  const response = await fetch(`${MAKELINE_API_URL}/api/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update order');
  }
  return response.json();
}

export async function deleteOrder(id: string): Promise<{ message: string }> {
  const response = await fetch(`${MAKELINE_API_URL}/api/orders/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order');
  }
  return response.json();
} 