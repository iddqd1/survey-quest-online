
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Survey } from "@/services/surveyService";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";

interface SurveyCardProps {
  survey: Survey;
}

export default function SurveyCard({ survey }: SurveyCardProps) {
  // Format the date to relative time (e.g., "2 days ago")
  const formattedDate = formatDistance(
    new Date(survey.modified),
    new Date(),
    { addSuffix: true }
  );

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{survey.title}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Last updated {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{survey.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link to={`/surveys/${survey.id}`}>
            Take Survey
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
