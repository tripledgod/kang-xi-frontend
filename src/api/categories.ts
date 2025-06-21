import axios from 'axios';
import { API_URL } from '../utils/constants';

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  order: number;
  ageFrom: string | null;
  ageTo: string | null;
  image: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
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

export const getCategories = async (locale: string = 'en'): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/api/categories`, {
    params: {
      'locale': locale,
      'populate': '*'
    }
  });
  return response.data.data || [];
};

export const getCategoryById = async (id: number | string, locale: string = 'en'): Promise<Category | null> => {
  const response = await axios.get(`${API_URL}/api/categories/${id}`, {
    params: {
      'locale': locale,
      'populate': '*'
    }
  });
  return response.data.data || null;
};

// Ceramic interface và API lấy ceramics theo category
export interface Ceramic {
  id: number;
  title: string;
  desc: string;
  years: string;
  item: string;
  image: string;
  category: number | string;
}

// export const getCeramicsByCategory = async (categoryId: number | string): Promise<Ceramic[]> => {
//   const response = await axios.get(`${API_URL}/api/ceramics`, {
//     params: {
//       'filters[category][id][$eq]': categoryId
//     }
//   });
//   return response.data.data || [];
// };

// export const getAllCeramics = async (): Promise<Ceramic[]> => {
//   const response = await axios.get(`${API_URL}/api/ceramics`);
//   return response.data.data || [];
// }; 