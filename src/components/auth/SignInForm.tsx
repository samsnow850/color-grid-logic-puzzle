
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "./GoogleAuthButton";
import Logo from "@/components/Logo";

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
    <div className="w-full">
      <div className="mb-6 flex justify-center">
        <Logo size="lg" withText={false} />
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email-signin" className="block text-sm font-medium mb-1">Email</label>
          <Input 
            id="email-signin"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="w-full"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password-signin" className="block text-sm font-medium">Password</label>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password-signin"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full"
          />
        </div>
        
        <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={loading}>
          {loading ? "Signing in..." : "LOGIN"}
        </Button>
        
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
            OR SIGN IN WITH
          </span>
        </div>
        
        <div className="flex justify-center">
          <GoogleAuthButton buttonType="signin_with" onSuccess={() => navigate("/account")} />
        </div>
        
        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/auth?tab=signup" className="text-primary hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
