
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSurveyById } from "@/services/surveyService";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import 'survey-core/survey-core.css';

const SurveyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const { isAuthenticated, loading: authLoading } = useProtectedRoute();

  const {
    data: survey,
    isLoading,
    error
  } = useQuery({
    queryKey: ['survey', id],
    queryFn: () => getSurveyById(parseInt(id!, 10), user?.token),
    enabled: !!id && !!isAuthenticated && !authLoading,
  });

  // Handle errors
  if (error) {
    console.error("Failed to fetch survey:", error);
    toast({
      title: "Error",
      description: "Failed to fetch survey details. Please try again later.",
      variant: "destructive",
    });
    navigate('/');
  }

  // Mock function to handle survey submission
  const handleSubmitSurvey = () => {
    // In a real application, this would submit the survey answers to the backend
    toast({
      title: "Survey Submitted",
      description: "Thank you for completing this survey!",
    });
    navigate('/');
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Card className="w-full max-w-3xl">
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <p>Checking authentication...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  let content;
  if (isLoading) {
    content = (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  } else if (survey) {
    const surveyInstance = new Model(JSON.parse(survey?.configuration) || {});

    content = (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{survey.title}</CardTitle>
          <CardDescription>
            Last updated on {new Date(survey.modified).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          
        </CardContent>
        <CardContent>
          <div className="mb-6">
            <p className="text-gray-700">{survey.description}</p>
          </div>
          
          {/* This would be replaced with dynamic survey questions based on the configuration */}
          <div className="space-y-6">

            <Survey model={surveyInstance} />

          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitSurvey} className="w-full">
            Submit Survey
          </Button>
        </CardFooter>
      </Card>
    );
  } else {
    content = (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Survey not found.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Return to Survey List
        </Button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {content}
      </div>
    </Layout>
  );
};

export default SurveyDetail;
