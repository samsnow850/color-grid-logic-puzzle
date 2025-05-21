
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "./GoogleAuthButton";
import { Facebook, Twitter, Mail, User, Lock } from "lucide-react";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          redirectTo: window.location.origin + '/account'
        } as any // Type assertion to bypass TypeScript checking
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed in successfully!");
        navigate("/account");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email-signin" className="block text-sm font-medium text-gray-600">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <Input 
              id="email-signin"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Type your username"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password-signin" className="block text-sm font-medium text-gray-600">Password</label>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <Input 
              id="password-signin"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Type your password"
              className="pl-10"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600"
          disabled={loading}
        >
          {loading ? "Signing in..." : "LOGIN"}
        </Button>
      </form>
      
      <div className="text-center text-sm text-gray-500">
        Or Sign in using
      </div>
      
      <div className="flex justify-center space-x-4">
        <GoogleAuthButton buttonType="signin_with" onSuccess={() => navigate("/account")} />
      </div>
      
      <div className="text-center text-sm">
        <span className="text-gray-500">Or Sign Up using</span>
        <div className="mt-1">
          <Link to="/auth?tab=signup" className="text-blue-500 hover:underline font-medium">
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
