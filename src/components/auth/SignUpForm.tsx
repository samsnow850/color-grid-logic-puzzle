
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "./GoogleAuthButton";
import { User, Mail, Lock } from "lucide-react";

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
        },
        redirectTo: window.location.origin + '/account'
      } as any; // Type assertion to bypass TypeScript checking

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-600">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <Input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First name"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-600">Last Name</label>
            <Input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last name"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email-signup" className="block text-sm font-medium text-gray-600">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <Input 
              id="email-signup"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password-signup" className="block text-sm font-medium text-gray-600">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <Input 
              id="password-signup"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create password"
              minLength={6}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600"
          disabled={loading}
        >
          {loading ? "Creating account..." : "SIGN UP"}
        </Button>
      </form>
      
      <div className="text-center text-sm text-gray-500">
        Or Sign up using
      </div>
      
      <div className="flex justify-center space-x-4">
        <GoogleAuthButton buttonType="signup_with" onSuccess={() => navigate("/account")} />
      </div>
      
      <div className="text-center text-sm">
        <span className="text-gray-500">Or Sign in using</span>
        <div className="mt-1">
          <Link to="/auth" className="text-blue-500 hover:underline font-medium">
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
