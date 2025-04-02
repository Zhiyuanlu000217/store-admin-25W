export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  price: number;
  description?: string;
  imageUrl?: string;
} 