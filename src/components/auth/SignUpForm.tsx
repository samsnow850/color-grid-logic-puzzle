
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "./GoogleAuthButton";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the options object with metadata for first and last name
      const options = {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Please check your email for verification.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="first-name" className="block text-sm font-medium mb-1">First Name</label>
          <Input
            id="first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="block text-sm font-medium mb-1">Last Name</label>
          <Input
            id="last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Doe"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email-signup" className="block text-sm font-medium mb-1">Email</label>
        <Input 
          id="email-signup"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="password-signup" className="block text-sm font-medium mb-1">Password</label>
        <Input 
          id="password-signup"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
        />
        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
      
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>
      
      <div className="flex justify-center">
        <GoogleAuthButton buttonType="signup_with" onSuccess={() => navigate("/")} />
      </div>
    </form>
  );
};

export default SignUpForm;
