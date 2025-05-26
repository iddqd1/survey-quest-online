
import { useAuth } from '@/contexts/AuthContext';


export interface SurveyResponse {
  id: number;
  survey: number;
  response: string;
  created: string;
  modified: string;
}


export const submitResponse = async (
  surveyId: number,
  responseData: string,
  token?: string
): Promise<void> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveys-response/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        survey: surveyId,
        response: JSON.stringify(responseData),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit survey response');
    }
  } catch (error) {
    console.error(`Error submitting survey response for survey ${surveyId}:`, error);
    throw error;
  }
};
  