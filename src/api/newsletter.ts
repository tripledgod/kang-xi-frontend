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
  
  console.log('ACCESS_TOKEN available:', !!ACCESS_TOKEN);
  console.log('ACCESS_TOKEN length:', ACCESS_TOKEN?.length || 0);
  
  if (ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }

  try {
    console.log('Calling API:', `${API_URL}/api/subscribe`);
    console.log('Payload:', { data: { email } });
    console.log('Headers:', headers);
    
    const response = await axios.post(`${API_URL}/api/subscribe`, {
      data: { email }
    }, { headers });
    
    console.log('Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Subscribe API Error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Status:', error.response?.status);
    throw error;
  }
}; 