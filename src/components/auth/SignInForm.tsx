
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "./GoogleAuthButton";

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
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed in successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        />
      </div>
      
      <div>
        <label htmlFor="password-signin" className="block text-sm font-medium mb-1">Password</label>
        <Input 
          id="password-signin"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      
      <div className="flex justify-end">
        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
          Forgot Password?
        </Link>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>
      
      <div className="flex justify-center">
        <GoogleAuthButton buttonType="signin_with" onSuccess={() => navigate("/")} />
      </div>
    </form>
  );
};

export default SignInForm;
