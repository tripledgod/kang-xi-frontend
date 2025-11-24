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
  categorySlug: string,
  locale: string = 'en'
): Promise<Product[]> => {
  try {
    // Find the category by slug in the requested locale to obtain the correct ID
    const categories = await getCategories(locale);
    const normalizedCategories = categories.map((cat) => flattenCategory(cat as Category));
    const category = normalizedCategories.find((cat) => cat.slug === categorySlug);

    if (!category) {
      console.warn(`Category with slug "${categorySlug}" not found in locale "${locale}"`);
      return [];
    }

    const response = await axios.get(`${API_URL}/api/products`, {
      params: {
        'filters[category][id][$eq]': category.id,
        locale: locale,
        'populate[category]': '*',
        sort: 'createdAt:desc',
      },
    });

    // Handle data structure - could be data array or direct
    let data = response.data.data || response.data || [];

    // If data is array, return directly. No additional filtering needed
    if (Array.isArray(data)) {
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
export const flattenCategory = (category: Category | any) => {
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

  const source = category.attributes || category;
  const rawImage =
    source.image?.data?.attributes ||
    source.image?.data ||
    source.image ||
    category.image?.data?.attributes ||
    category.image ||
    null;

  return {
    id: category.id || source.id || 0,
    documentId: source.documentId || source.document_id || '',
    name: source.name || 'Unknown Category',
    slug: source.slug || 'unknown',
    description: source.description || null,
    createdAt: source.createdAt || '',
    updatedAt: source.updatedAt || '',
    publishedAt: source.publishedAt || '',
    order: typeof source.order === 'number' ? source.order : 0,
    ageFrom: source.ageFrom || null,
    ageTo: source.ageTo || null,
    image: rawImage,
  };
};

// Helper function to convert Product from API format to flat format
export const flattenProduct = (product: Product | any) => {
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

  const source = product.attributes || product;

  // Handle category relation from different Strapi response shapes
  const rawCategory =
    product.category ||
    product.category?.data ||
    source.category ||
    source.category?.data;

  const normalizedCategory = rawCategory
    ? {
        id: rawCategory.id || rawCategory?.attributes?.id || null,
        name: rawCategory.name || rawCategory?.attributes?.name || null,
        slug: rawCategory.slug || rawCategory?.attributes?.slug || null,
      }
    : null;

  return {
    id: product.id || source.id || 0,
    title: source.title || 'Unknown Product',
    slug: source.slug || 'unknown',
    description: source.description || null,
    ageFrom: source.ageFrom || null,
    ageTo: source.ageTo || null,
    itemCode: source.itemCode || null,
    documentId: source.documentId || null,
    images: source.images || [],
    category: normalizedCategory,
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
