import { API_URL } from '../utils/constants'; // Đã cấu hình đúng

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

// Helper function để lấy URL ảnh từ Strapi
export const getImageUrl = (image: any): string => {
  if (!image) return '';

  // Nếu image có formats, ưu tiên medium format
  if (image.formats?.medium?.url) {
    return image.formats.medium.url.startsWith('http')
      ? image.formats.medium.url
      : API_URL + image.formats.medium.url;
  }

  // Fallback to small format
  if (image.formats?.small?.url) {
    return image.formats.small.url.startsWith('http')
      ? image.formats.small.url
      : API_URL + image.formats.small.url;
  }

  // Fallback to thumbnail format
  if (image.formats?.thumbnail?.url) {
    return image.formats.thumbnail.url.startsWith('http')
      ? image.formats.thumbnail.url
      : API_URL + image.formats.thumbnail.url;
  }

  // Fallback to original URL
  if (image.url) {
    return image.url.startsWith('http') ? image.url : API_URL + image.url;
  }

  return '';
};
