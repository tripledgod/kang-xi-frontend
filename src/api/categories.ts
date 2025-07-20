import axios from 'axios';
import { API_URL } from '../utils/constants';

export interface Category {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  order?: number;
  ageFrom?: string | null;
  ageTo?: string | null;
  locale?: string;
  image?: {
    id: number;
    documentId?: string;
    name?: string;
    alternativeText?: string | null;
    caption?: string | null;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: {
        url: string;
      };
      small?: {
        url: string;
      };
      medium?: {
        url: string;
      };
      large?: {
        url: string;
      };
    };
    url: string;
  } | null;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  ageFrom?: string | null;
  ageTo?: string | null;
  itemCode?: string | null;
  documentId?: string | null;
  locale?: string;
  images?: Array<{
    id: number;
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  }> | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export const getCategories = async (locale: string = 'en'): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/categories`, {
      params: {
        locale: locale,
        populate: '*',
        sort: 'order:asc',
      },
    });

    // Handle data structure - could be data array or direct
    let data = response.data.data || response.data || [];

    // If data is array, use directly
    if (Array.isArray(data)) {
      if (data.length > 0) {
        // Keep the structure logging for debugging but remove console.log
      }
      return data;
    }

    // If data is not array, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoryById = async (
  id: number | string,
  locale: string = 'en'
): Promise<Category | null> => {
  try {
    const response = await axios.get(`${API_URL}/api/categories/${id}`, {
      params: {
        locale: locale,
        populate: '*',
      },
    });
    return response.data.data || response.data || null;
  } catch (error) {
    console.error('Error fetching category by id:', error);
    return null;
  }
};

export const getProductsByCategory = async (
  categoryId: number | string,
  locale: string = 'en'
): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/products`, {
      params: {
        'filters[category][id][$eq]': categoryId,
        locale: locale,
        populate: '*',
        sort: 'createdAt:desc',
      },
    });

    // Handle data structure - could be data array or direct
    let data = response.data.data || response.data || [];

    // If data is array, use directly
    if (Array.isArray(data)) {
      if (data.length > 0) {
        // Keep the structure logging for debugging but remove console.log
      }
      return data;
    }

    // If data is not array, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// Helper function to convert Category from API format to flat format
export const flattenCategory = (category: Category) => {
  // Check if category has correct structure
  if (!category) {
    return {
      id: 0,
      documentId: '',
      name: 'Unknown Category',
      slug: 'unknown',
      description: null,
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      order: 0,
      ageFrom: null,
      ageTo: null,
      image: null,
    };
  }

  return {
    id: category.id,
    documentId: category.documentId || '',
    name: category.name || 'Unknown Category',
    slug: category.slug || 'unknown',
    description: category.description || null,
    createdAt: category.createdAt || '',
    updatedAt: category.updatedAt || '',
    publishedAt: category.publishedAt || '',
    order: category.order || 0,
    ageFrom: category.ageFrom || null,
    ageTo: category.ageTo || null,
    image: category.image || null,
  };
};

// Helper function to convert Product from API format to flat format
export const flattenProduct = (product: Product) => {
  // Check if product has correct structure
  if (!product) {
    return {
      id: 0,
      title: 'Unknown Product',
      slug: 'unknown',
      description: null,
      ageFrom: null,
      ageTo: null,
      itemCode: null,
      documentId: null,
      images: [],
      category: null,
    };
  }

  return {
    id: product.id,
    title: product.title || 'Unknown Product',
    slug: product.slug || 'unknown',
    description: product.description || null,
    ageFrom: product.ageFrom || null,
    ageTo: product.ageTo || null,
    itemCode: product.itemCode || null,
    documentId: product.documentId || null,
    images: product.images || [],
    category: product.category || null,
  };
};

// Ceramic interface and API to get ceramics by category
export interface Ceramic {
  id: number;
  title: string;
  desc: string;
  years: string;
  item: string;
  image: string;
  category: number | string;
}

