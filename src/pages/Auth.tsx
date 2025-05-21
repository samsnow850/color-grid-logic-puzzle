
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to account page
    if (user && !loading) {
      navigate('/account');
    }
  }, [user, loading, navigate]);

  // Show basic loading state while checking auth, before Page Wrapper takes over
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading authentication...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <PageWrapper 
      loadingTitle="Authentication" 
      loadingDescription="Preparing secure login"
      loadingColor="blue"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-blue-400">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <SignInForm />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Auth;
