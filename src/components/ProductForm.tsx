'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductFormData } from '@/types/product';
import { createProduct, generateDescription, generateImage } from '@/services/api';

interface ProductFormProps {
  onSuccess: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    price: 0,
  });
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createProduct(formData);
      onSuccess();
      setFormData({ name: '', sku: '', price: 0 });
      setKeywords('');
    } catch (error) {
      setError('Failed to create product');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!keywords) {
      setError('Please enter keywords first');
      return;
    }

    setLoading(true);
    try {
      const description = await generateDescription(keywords);
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      setError('Failed to generate description');
      console.error('Error generating description:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!keywords) {
      setError('Please enter keywords first');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await generateImage(keywords);
      setFormData(prev => ({ ...prev, imageUrl }));
    } catch (error) {
      setError('Failed to generate image');
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
          SKU
        </label>
        <input
          type="text"
          id="sku"
          value={formData.sku}
          onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
          Keywords for AI Generation
        </label>
        <input
          type="text"
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., modern minimalist coffee maker"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <div className="mt-2 flex space-x-2">
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={loading}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Description
          </button>
          <button
            type="button"
            onClick={handleGenerateImage}
            disabled={loading}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Image
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <div className="mt-1">
          {formData.imageUrl ? (
            <div className="relative w-full h-64">
              <Image
                src={formData.imageUrl}
                alt="Generated product"
                fill
                className="object-contain rounded-lg border border-gray-200"
              />
              <input
                type="hidden"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No image generated yet</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
} 