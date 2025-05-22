
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { scrollToTop } from "@/lib/utils";

interface PageWrapperProps {
  children?: React.ReactNode;
  loadingTitle?: string;
  loadingDescription?: string;
  loadingColor?: string;
  animationSrc?: string;
  errorTitle?: string;
  errorDescription?: string;
  errorColor?: string;
}

const PageWrapper = ({ 
  children, 
  loadingTitle = "Loading...", 
  loadingDescription = "Preparing your content", 
  loadingColor = "purple",
  animationSrc,
  errorTitle,
  errorDescription,
  errorColor
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
        title={errorTitle || loadingTitle}
        description={errorDescription || loadingDescription}
        color={errorColor || loadingColor}
        animationSrc={animationSrc}
      />
      <div className={isLoading ? "invisible" : "visible"}>
        {children}
      </div>
    </>
  );
};

export default PageWrapper;
