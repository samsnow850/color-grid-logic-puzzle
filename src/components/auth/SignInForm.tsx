
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "./GoogleAuthButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
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

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: magicLinkEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin + '/account'
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        setMagicLinkSent(true);
        toast.success("Magic link sent! Check your email.");
      }
    } catch (error) {
      console.error("Error sending magic link:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="password" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
      </TabsList>
      
      <TabsContent value="password">
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
            <GoogleAuthButton buttonType="signin_with" onSuccess={() => navigate("/account")} />
          </div>
        </form>
      </TabsContent>
      
      <TabsContent value="magic-link">
        {magicLinkSent ? (
          <div className="text-center space-y-4">
            <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Check Your Email</h3>
            <p className="text-muted-foreground">
              We've sent a magic link to <span className="font-medium">{magicLinkEmail}</span>.
              Click the link in the email to sign in.
            </p>
            <div className="pt-4">
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => setMagicLinkSent(false)}
              >
                Need to change your email?
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
            <div>
              <label htmlFor="magic-link-email" className="block text-sm font-medium mb-1">Email</label>
              <Input 
                id="magic-link-email"
                type="email" 
                value={magicLinkEmail} 
                onChange={(e) => setMagicLinkEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Magic Link"}
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              We'll email you a magic link for a password-free sign in.
            </p>
            
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
            
            <div className="flex justify-center">
              <GoogleAuthButton buttonType="signin_with" onSuccess={() => navigate("/account")} />
            </div>
          </form>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SignInForm;
