
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useGetSurveys, Survey } from "@/services/surveyService";
import SurveyCard from "@/components/surveys/SurveyCard";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SurveyList = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const { getSurveys } = useGetSurveys();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        const data = await getSurveys();
        setSurveys(data);
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available surveys. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [getSurveys, toast]);

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <SurveySkeleton />
              </div>
            ))}
          </div>
        ) : surveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
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
