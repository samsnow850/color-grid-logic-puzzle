
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import HCaptcha from "@/components/auth/HCaptcha";

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };
  
  const handleCaptchaExpire = () => {
    setCaptchaToken("");
    toast.warning("Captcha expired. Please verify again.");
  };

  const handleCaptchaError = () => {
    toast.error("Captcha error. Please try again.");
  };

  useEffect(() => {
    // Check if user is authenticated via the recovery flow
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (!data.session) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        navigate("/forgot-password");
      }
    };
    
    checkSession();
  }, [navigate]);

  const onSubmit = async (values: PasswordFormValues) => {
    if (!session) {
      toast.error("Authentication required to reset password.");
      return;
    }
    
    if (!captchaToken) {
      toast.error("Please complete the captcha verification.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
        data: { captchaToken }
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      toast.success("Password updated successfully!");
      
      // Clear the form
      form.reset();
      
      // Redirect after a short delay
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gradient-to-b from-background to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>Enter a new password for your account</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg">Password Updated!</h3>
                <p className="text-muted-foreground">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <div className="pt-4">
                  <Button onClick={() => navigate("/auth")} className="w-full">
                    Go to Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <HCaptcha 
                    onVerify={handleCaptchaVerify}
                    onExpire={handleCaptchaExpire}
                    onError={handleCaptchaError}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !captchaToken}
                  >
                    {loading ? "Updating..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
