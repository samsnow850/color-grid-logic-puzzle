
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-purple-50 p-6">
        <div className="text-center">
          <h1 className="text-8xl font-bold mb-4 text-purple-600">404</h1>
          <p className="text-xl mb-8 text-muted-foreground">Oops! This page doesn't exist.</p>
          <Button className="bg-purple-600 hover:bg-purple-700" asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
