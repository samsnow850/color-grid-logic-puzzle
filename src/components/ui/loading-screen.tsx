
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState(isLoading ? "flex" : "none");

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

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      style={{
        opacity: opacity,
        transition: "opacity 0.5s ease-in-out",
        display: display
      }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mb-4"
      >
        <div className="w-full h-full rounded-full border-4 border-t-purple-600 border-r-purple-300 border-b-purple-600 border-l-purple-300"></div>
      </motion.div>
      
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-primary">Loading...</h2>
        <p className="text-sm text-muted-foreground">Preparing your color puzzle</p>
      </div>
      
      <div className="mt-8 w-64">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full bg-purple-200" />
          <Skeleton className="h-3 w-5/6 bg-purple-200" />
          <Skeleton className="h-3 w-4/6 bg-purple-200" />
        </div>
      </div>
    </div>
  );
};
