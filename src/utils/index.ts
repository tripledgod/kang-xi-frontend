import { API_URL } from './constants';

// Helper function to handle image URL from Strapi
export const getImageUrl = (imageData: any): string => {
  if (!imageData) return '';

  // Handle both Strapi v4 (with data) and direct cases
  const imageAttributes = imageData.data ? imageData.data.attributes : imageData;

  if (!imageAttributes) return '';

  // Get URL from formats or directly
  let imageUrl =
    imageAttributes.formats?.medium?.url ||
    imageAttributes.formats?.small?.url ||
    imageAttributes.formats?.thumbnail?.url ||
    imageAttributes.url;

  // Add API_URL if URL starts with /uploads/
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    imageUrl = API_URL + imageUrl;
  }

  return imageUrl || '';
};

// Helper function to handle cover image
export const getCoverUrl = (coverData: any): string => {
  return getImageUrl(coverData);
};

// Helper function to handle multiple images
export const getImagesUrls = (imagesData: any[]): string[] => {
  if (!Array.isArray(imagesData)) return [];

  return imagesData.map((image) => getImageUrl(image)).filter((url) => url);
};
