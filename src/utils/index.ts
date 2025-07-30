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

/**
 * Validate phone number format
 * @param phone - Phone number with country code (e.g., +6512345678)
 * @returns true if valid, false otherwise
 */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || !phone.trim()) {
    return false;
  }
  
  // Phone number should start with + and have 1-15 digits after country code
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Format phone number for display
 * @param phone - Raw phone number
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  return cleaned;
};

/**
 * Test API call to check if endpoint is working
 * @param endpoint - API endpoint to test
 * @param data - Data to send
 * @returns Promise with response
 */
export const testApiCall = async (endpoint: string, data: any) => {
  try {
    console.log(`Testing API call to: ${endpoint}`);
    console.log('Test data:', JSON.stringify(data, null, 2));
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    console.log('Test response status:', response.status);
    console.log('Test response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Test response body:', responseText);
    
    return {
      success: response.ok,
      status: response.status,
      data: responseText,
    };
  } catch (error) {
    console.error('Test API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
