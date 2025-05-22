
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { scrollToTop } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  loadingTitle?: string;
  loadingDescription?: string;
  loadingColor?: string;
  errorTitle?: string;
  errorDescription?: string;
  errorColor?: string;
  animationSrc?: string;
}

const PageWrapper = ({ 
  children, 
  loadingTitle = "Loading",
  loadingDescription = "Please wait while we load the content...",
  loadingColor = "purple",
  errorTitle,
  errorDescription,
  errorColor,
  animationSrc
}: PageWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Show loading screen when route changes
    setIsLoading(true);
    
    // Scroll to top of page
    scrollToTop();
    
    // Simulate loading time (you can remove this in production if not needed)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <>
      <LoadingScreen 
        isLoading={isLoading}
        title={loadingTitle}
        description={loadingDescription}
        color={loadingColor}
        animationSrc={animationSrc}
        errorTitle={errorTitle}
        errorDescription={errorDescription}
        errorColor={errorColor}
      />
      <div className={isLoading ? "invisible" : "visible"}>
        {children}
      </div>
    </>
  );
};

export default PageWrapper;
