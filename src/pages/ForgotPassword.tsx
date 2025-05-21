
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSubmitted(true);
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (error) {
      console.error("Error sending reset password email:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-blue-400">
        <Card className="w-full max-w-md bg-white rounded-xl shadow-lg">
          <CardContent className="p-8">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl">Check Your Email</h3>
                <p className="text-gray-500">
                  We've sent a password reset link to <span className="font-medium">{email}</span>.
                  The link will expire in 24 hours.
                </p>
                <div className="pt-4">
                  <Link to="/auth">
                    <Button variant="outline" className="w-full">
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
                <p className="text-center text-gray-500 mb-6">
                  Enter your email to receive a password reset link
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Your email"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600" 
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Link to="/auth" className="inline-flex items-center text-sm text-blue-500 hover:underline">
                      <ArrowLeft className="mr-1 h-3 w-3" /> Back to Sign In
                    </Link>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
