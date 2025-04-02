'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { getProducts } from '@/services/api';
import ProductList from '@/components/ProductList';
import ProductForm from '@/components/ProductForm';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Store Admin Dashboard
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Manage your products with ease
          </p>
        </div>

        <div className="mt-12">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Add New Product</h2>
              <div className="mt-5">
                <ProductForm onSuccess={fetchProducts} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Products</h2>
              {loading ? (
                <div className="mt-4 text-center text-gray-500">Loading...</div>
              ) : error ? (
                <div className="mt-4 text-center text-red-500">{error}</div>
              ) : products.length === 0 ? (
                <div className="mt-4 text-center text-gray-500">No products found</div>
              ) : (
                <div className="mt-4">
                  <ProductList products={products} onDelete={fetchProducts} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
