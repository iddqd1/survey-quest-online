import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { HttpService } from "@/services/apiService";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface StripeCheckoutResponse {
  id: number;
  survey: number;
  response: string;
  created: string;
  modified: string;
  stripe_session_id: string;
  url: string;
}

const PaymentCheckout = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is authenticated
  const { isAuthenticated, loading: authLoading } = useProtectedRoute();
  const apiService = new HttpService();

  const [stripeResponse, setStripeResponse] = React.useState(null);

  const stripeCheckoutResponse: Promise<StripeCheckoutResponse> =
    apiService.post<StripeCheckoutResponse>("/api/stripe-checkout/", {
      survey: parseInt(id!, 10),
    });

  React.useEffect(() => {
    stripeCheckoutResponse.then((result) => setStripeResponse(result));
  }, []); // <--

  if (stripeResponse === null) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            <p>Please wait while we prepare your payment.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <a href={stripeResponse.url} target="_blank" rel="noopener noreferrer">
        Click here to pay with stripe
      </a>
    </Layout>
  );
};

export default PaymentCheckout;
