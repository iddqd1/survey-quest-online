
import Layout from "@/components/layout/Layout";
import { Survey } from "@/services/surveyService";
import SurveyCard from "@/components/surveys/SurveyCard";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const SurveyList = () => {
  const { toast } = useToast();
  
  const { data: surveys = [], isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveys/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if user is logged in
            ...(localStorage.getItem('token') ? {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            } : {})
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch surveys');
        }
        
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available surveys. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  // Skeleton placeholder while loading
  const SurveySkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Available Surveys</h1>
          <p className="text-gray-600 mt-2">Explore and participate in our collection of surveys</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <SurveySkeleton />
              </div>
            ))}
          </div>
        ) : surveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey: Survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No surveys available at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SurveyList;
