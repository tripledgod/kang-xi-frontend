import { API_URL } from './constants';

// Helper function để xử lý image URL từ Strapi
export const getImageUrl = (imageData: any): string => {
  if (!imageData) return '';
  
  // Xử lý cả trường hợp Strapi v4 (có data) và trường hợp trực tiếp
  const imageAttributes = imageData.data ? imageData.data.attributes : imageData;
  
  if (!imageAttributes) return '';
  
  // Lấy URL từ formats hoặc trực tiếp
  let imageUrl = imageAttributes.formats?.medium?.url || 
                imageAttributes.formats?.small?.url || 
                imageAttributes.formats?.thumbnail?.url || 
                imageAttributes.url;
  
  // Thêm API_URL nếu URL bắt đầu bằng /uploads/
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    imageUrl = API_URL + imageUrl;
  }
  
  return imageUrl || '';
};

// Helper function để xử lý cover image
export const getCoverUrl = (coverData: any): string => {
  return getImageUrl(coverData);
};

// Helper function để xử lý multiple images
export const getImagesUrls = (imagesData: any[]): string[] => {
  if (!Array.isArray(imagesData)) return [];
  
  return imagesData.map(image => getImageUrl(image)).filter(url => url);
};
