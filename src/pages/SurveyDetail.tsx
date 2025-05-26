
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
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
        ) : survey ? (
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{survey.title}</CardTitle>
              <CardDescription>
                Last updated on {new Date(survey.modified).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-gray-700">{survey.description}</p>
              </div>
              
              {/* This would be replaced with dynamic survey questions based on the configuration */}
              <div className="space-y-6">
                <p className="text-sm text-gray-500 italic">
                  This is a placeholder for survey questions that would be generated based on the survey configuration.
                </p>
                
                <div className="space-y-4">
                  {/* Example question types */}
                  <div className="space-y-2">
                    <label className="block font-medium">How would you rate your experience?</label>
                    <div className="flex space-x-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          className="w-10 h-10 p-0 rounded-full"
                        >
                          {value}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block font-medium">Any additional comments?</label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                      placeholder="Your answer here..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitSurvey} className="w-full">
                Submit Survey
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Survey not found.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return to Survey List
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SurveyDetail;
