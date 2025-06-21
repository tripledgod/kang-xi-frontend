import { API_URL } from '../utils/constants'; // Đã cấu hình đúng

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

export const getImageUrl = (image: Category['image']) => {
  if (!image) return "/fallback.jpg";
  let url = image.formats?.medium?.url
    || image.formats?.small?.url
    || image.formats?.thumbnail?.url
    || image.url;
  // Nếu url là đường dẫn tương đối, nối với API_URL
  if (url && url.startsWith("/")) {
    url = API_URL + url;
  }
  
  return url;
}; 