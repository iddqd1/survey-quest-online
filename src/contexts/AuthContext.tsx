
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface User {
  name: string;
  email: string;
  token: string;
}

interface TwoFAState {
  user_id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  twoFAState: TwoFAState | null;
  login: (email: string, password: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [twoFAState, setTwoFAState] = useState<TwoFAState | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string, passwordConfirm: string) => {
    try {
      setLoading(true);
      
      if (password !== passwordConfirm) {
        throw new Error("Passwords don't match");
      }

      const response = await fetch('/api/users-create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirm: passwordConfirm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth-token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Check if 2FA is required
      if (data.is_2fa_required) {
        setTwoFAState({
          user_id: data.user_id,
          email: email,
        });
        
        toast({
          title: "2FA Required",
          description: data.message || "Please enter the OTP code",
        });
        
        navigate('/verify-otp');
        return;
      }
      
      // Regular login success
      const loggedInUser = {
        name: email.split('@')[0], // Temporary name from email
        email,
        token: data.token || data.api_token,
      };

      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('Authorization', loggedInUser.token);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!twoFAState) {
      throw new Error('No 2FA state available');
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/2fa/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: twoFAState.user_id,
          otp_code: otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'OTP verification failed');
      }

      const data = await response.json();
      
      // Login successful after OTP verification
      const loggedInUser = {
        name: twoFAState.email.split('@')[0],
        email: twoFAState.email,
        token: data.api_token,
      };

      setUser(loggedInUser);
      setTwoFAState(null);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('Authorization', loggedInUser.token);
      
      toast({
        title: "Login successful",
        description: data.message || "Welcome back!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "OTP verification failed",
        description: error instanceof Error ? error.message : "Invalid OTP code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        twoFAState,
        login,
        verifyOTP,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
