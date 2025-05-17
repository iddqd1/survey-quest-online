
import { useAuth } from '@/contexts/AuthContext';

export interface Survey {
  id: number;
  title: string;
  description: string;
  configuration: string;
  created: string;
  modified: string;
}

export const useGetSurveyById = () => {
  const { user } = useAuth();
  
  const getSurveyById = async (id: number): Promise<Survey> => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
      
      const response = await fetch(`/api/surveys/${id}/`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch survey');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching survey ${id}:`, error);
      throw error;
    }
  };
  
  return { getSurveyById };
};
