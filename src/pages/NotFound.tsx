
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Update document title
    document.title = "Page Not Found | Color Grid Logic";
  }, [location.pathname]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-purple-50 p-6">
        <motion.div 
          className="text-center max-w-lg"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-4 gap-2 w-48 h-48 mx-auto mb-6 relative">
              {Array(16).fill(null).map((_, i) => (
                <div 
                  key={i}
                  className={`rounded ${
                    String(i).includes('4') ? 'bg-gray-200' : 
                    ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'][i % 4]
                  } ${i === 4 ? 'animate-ping absolute' : ''}`}
                  style={{
                    opacity: String(i).includes('4') ? 0.5 : 1
                  }}
                />
              ))}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center text-8xl font-bold text-white opacity-75"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 5, scale: 1 }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
              >
                ?
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-8xl font-bold mb-4 text-purple-600"
            variants={itemVariants}
          >
            404
          </motion.h1>
          
          <motion.p 
            className="text-xl mb-6 text-muted-foreground"
            variants={itemVariants}
          >
            Oops! This page seems to be missing from the grid.
          </motion.p>
          
          <motion.p 
            className="mb-8 text-muted-foreground"
            variants={itemVariants}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Button className="bg-purple-600 hover:bg-purple-700 mr-4" asChild>
              <a href="/">Return to Home</a>
            </Button>
            
            <Button variant="outline" className="border-purple-300 hover:bg-purple-100" asChild>
              <a href="/game">Play a Game</a>
            </Button>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
