import axios from 'axios';
import { API_URL, ACCESS_TOKEN } from '../utils/constants';

export interface SubscribeResponse {
  data: {
    id: number;
    attributes: {
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  };
  meta: {};
}

export const subscribe = async (email: string): Promise<SubscribeResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }

  try {
    const response = await axios.post(`${API_URL}/api/subscribe`, {
      data: { email }
    }, { headers });
    
    return response.data;
  } catch (error: any) {
    console.error('Subscribe API Error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Status:', error.response?.status);
    throw error;
  }
}; 