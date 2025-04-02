import { Product, ProductFormData } from '@/types/product';

// Use environment variables with fallbacks for development
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:3060';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3080';

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