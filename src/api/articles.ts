import axios from 'axios';
import { API_URL } from '../utils/constants';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337';

export interface ArticleImage {
  id: number;
  url: string;
  formats: {
    thumbnail: { url: string };
    small: { url: string };
    medium: { url: string };
    large: { url: string };
  };
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  order: number;
  cover: ArticleImage;
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Get list of articles with pagination
export const getArticles = async (
  page: number = 1,
  pageSize: number = 5,
  locale: string = 'en'
): Promise<ArticlesResponse> => {
  const response = await axios.get(`${API_URL}/api/articles`, {
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      populate: '*',
      sort: 'order:asc',
      locale: locale,
    },
  });
  return response.data;
};

// Get article detail by slug
export const getArticleBySlug = async (
  slug: string,
  locale: string = 'en'
): Promise<{ data: Article }> => {
  const response = await axios.get(`${API_URL}/api/articles`, {
    params: {
      'filters[slug][$eq]': slug,
      populate: '*',
      locale: locale,
    },
  });
  return response.data;
};

// Get related articles
export const getRelatedArticles = async (
  currentId: number,
  limit: number = 3,
  locale: string = 'en'
): Promise<ArticlesResponse> => {
  const response = await axios.get(`${API_URL}/api/articles`, {
    params: {
      'filters[id][$ne]': currentId,
      'pagination[limit]': limit,
      populate: '*',
      sort: 'order:asc',
      locale: locale,
    },
  });
  return response.data;
};
