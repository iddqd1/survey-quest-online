
export interface SurveyResponse {
  survey: number;
  data: string;
}

export const submitSurveyResponse = async (surveyId: number, responseData: string, token?: string): Promise<void> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveys-response/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      survey: surveyId,
      data: responseData,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit survey response');
  }
};
