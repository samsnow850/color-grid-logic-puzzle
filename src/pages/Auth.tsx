
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("signin");
  
  // Check for tab parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('signin');
    }
  }, [location]);
  
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
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="relative w-full h-12 bg-gray-100 rounded-full p-1 mb-6">
                <TabsList className="grid grid-cols-2 h-full relative z-10">
                  <TabsTrigger 
                    value="signin" 
                    className="rounded-full h-full flex items-center justify-center transition-colors duration-200 text-sm md:text-base font-medium"
                    onClick={() => setActiveTab("signin")}
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="rounded-full h-full flex items-center justify-center transition-colors duration-200 text-sm md:text-base font-medium"
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                {/* Animated highlight */}
                <motion.div 
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm"
                  initial={false}
                  animate={{ 
                    x: activeTab === "signin" ? 0 : "100%",
                    translateX: activeTab === "signin" ? 4 : -4
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
              
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
