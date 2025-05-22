
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export interface LoadingScreenProps {
  isLoading: boolean;
  title?: string;
  description?: string;
  color?: string;
  animationSrc?: string;
  errorTitle?: string;
  errorDescription?: string;
  errorColor?: string;
}

export const LoadingScreen = ({ 
  isLoading,
  title = "Loading...",
  description = "Preparing your color puzzle",
  color = "purple",
  animationSrc,
  errorTitle,
  errorDescription,
  errorColor
}: LoadingScreenProps) => {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState(isLoading ? "flex" : "none");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isLoading) {
      setOpacity(0);
      timeout = setTimeout(() => {
        setDisplay("none");
      }, 500); // Match this with the transition duration
    } else {
      setDisplay("flex");
      setOpacity(1);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  // Check if we should show error screen
  useEffect(() => {
    setIsError(!!errorTitle);
  }, [errorTitle]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      style={{
        opacity: opacity,
        transition: "opacity 0.5s ease-in-out",
        display: display
      }}
    >
      {!isError ? (
        <>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mb-4"
          >
            <div className={`w-full h-full rounded-full border-4 border-t-${color}-600 border-r-${color}-300 border-b-${color}-600 border-l-${color}-300`}></div>
          </motion.div>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-primary">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="text-center space-y-2">
            <h2 className={`text-2xl font-bold text-${errorColor || 'red'}-600`}>{errorTitle}</h2>
            <p className="text-sm text-muted-foreground">{errorDescription}</p>
          </div>
        </>
      )}
      
      <div className="mt-8 w-64">
        <div className="space-y-2">
          <Skeleton className={`h-3 w-full bg-${color}-200`} />
          <Skeleton className={`h-3 w-5/6 bg-${color}-200`} />
          <Skeleton className={`h-3 w-4/6 bg-${color}-200`} />
        </div>
      </div>
    </div>
  );
};
