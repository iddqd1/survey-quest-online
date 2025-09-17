import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VerifyOTP = () => {
  const { verifyOTP, loading, twoFAState } = useAuth();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if no 2FA state is available
    if (!twoFAState) {
      navigate('/login');
    }
  }, [twoFAState, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length === 6) {
      try {
        await verifyOTP(otp);
      } catch (error) {
        console.error("OTP verification error:", error);
      }
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  if (!twoFAState) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="flex justify-center items-center my-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Enter OTP</CardTitle>
            <CardDescription className="text-center">
              We've sent a 6-digit code to your email. Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Didn't receive the code?{" "}
              <button 
                type="button"
                className="text-primary hover:underline"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyOTP;