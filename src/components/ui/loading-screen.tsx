
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Progress } from "@/components/ui/progress";

interface LoadingScreenProps {
  isLoading: boolean;
  title?: string;
  description?: string;
  color?: string;
  animationSrc?: string;
}

export const LoadingScreen = ({ 
  isLoading, 
  title = "Loading...", 
  description = "Preparing your content",
  color = "purple",
  animationSrc
}: LoadingScreenProps) => {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState(isLoading ? "flex" : "none");
  const [progress, setProgress] = useState(0);
  
  // Define color classes based on the color prop
  const borderColorClasses = {
    purple: "border-t-purple-600 border-r-purple-300 border-b-purple-600 border-l-purple-300",
    blue: "border-t-blue-600 border-r-blue-300 border-b-blue-600 border-l-blue-300",
    green: "border-t-green-600 border-r-green-300 border-b-green-600 border-l-green-300",
    pink: "border-t-pink-600 border-r-pink-300 border-b-pink-600 border-l-pink-300",
    orange: "border-t-orange-600 border-r-orange-300 border-b-orange-600 border-l-orange-300",
    indigo: "border-t-indigo-600 border-r-indigo-300 border-b-indigo-600 border-l-indigo-300",
  };

  const skeletonColorClasses = {
    purple: "bg-purple-200",
    blue: "bg-blue-200",
    green: "bg-green-200",
    pink: "bg-pink-200",
    orange: "bg-orange-200",
    indigo: "bg-indigo-200",
  };

  const progressColorClasses = {
    purple: "bg-purple-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
    pink: "bg-pink-600",
    orange: "bg-orange-600",
    indigo: "bg-indigo-600",
  };

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
      
      // Reset progress
      setProgress(0);
      
      // Animate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          // Gradually increase progress, slow down towards the end
          const increment = 100 - prev > 40 ? 3 : 1;
          const newProgress = Math.min(prev + increment, 95);
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  // Complete the progress when hiding
  useEffect(() => {
    if (opacity === 0) {
      setProgress(100);
    }
  }, [opacity]);

  const borderColorClass = borderColorClasses[color as keyof typeof borderColorClasses] || borderColorClasses.purple;
  const skeletonColorClass = skeletonColorClasses[color as keyof typeof skeletonColorClasses] || skeletonColorClasses.purple;
  const progressColorClass = progressColorClasses[color as keyof typeof progressColorClasses] || "bg-purple-600";

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      style={{
        opacity: opacity,
        transition: "opacity 0.5s ease-in-out",
        display: display
      }}
    >
      {animationSrc ? (
        <div className="w-32 h-32 mb-4">
          <DotLottieReact
            src={animationSrc}
            autoplay
            loop
          />
        </div>
      ) : (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mb-4"
        >
          <div className={`w-full h-full rounded-full border-4 ${borderColorClass}`}></div>
        </motion.div>
      )}
      
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="mt-8 w-64 space-y-4">
        {/* Progress bar */}
        <Progress value={progress} className="h-2">
          <div 
            className={`h-full ${progressColorClass}`} 
            style={{ width: `${progress}%`, transition: "width 0.3s ease-in-out" }} 
          />
        </Progress>
        
        <div className="space-y-2">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: ["100%", "60%", "70%", "40%", "80%", "60%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Skeleton className={`h-3 w-full ${skeletonColorClass}`} />
          </motion.div>
          <motion.div
            initial={{ width: "80%" }}
            animate={{ width: ["80%", "40%", "60%", "30%", "50%"] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Skeleton className={`h-3 w-5/6 ${skeletonColorClass}`} />
          </motion.div>
          <motion.div
            initial={{ width: "60%" }}
            animate={{ width: ["60%", "30%", "40%", "20%", "50%"] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
          >
            <Skeleton className={`h-3 w-4/6 ${skeletonColorClass}`} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
