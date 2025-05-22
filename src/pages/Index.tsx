
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowDown, Clock, Award, Star, Check, Gamepad } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, scrollToTop } from "@/lib/utils";

const Index = () => {
  const { user } = useAuth();
  const [showAbout, setShowAbout] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Beta Banner */}
        <div className="bg-primary py-3 px-6 sticky top-16 z-30">
          <Alert className="max-w-4xl mx-auto bg-transparent border-none shadow-none">
            <Info className="h-5 w-5 text-primary-foreground" />
            <AlertDescription className="text-primary-foreground font-medium">
              This game is currently in beta. We appreciate your patience as we continue to improve the experience. Thank you for your support!
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-background to-background dark:from-purple-900/20 dark:via-background dark:to-background"></div>
            <motion.div 
              className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-purple-200 opacity-60 dark:bg-purple-800 dark:opacity-20"
              animate={{
                y: [0, 30, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute top-60 right-[15%] w-24 h-24 rounded-full bg-blue-200 opacity-50 dark:bg-blue-800 dark:opacity-20"
              animate={{
                y: [0, -40, 0],
                x: [0, -20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute bottom-40 left-[25%] w-16 h-16 rounded-full bg-pink-200 opacity-60 dark:bg-pink-800 dark:opacity-20"
              animate={{
                y: [0, 20, 0],
                x: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>

          <motion.div 
            className="relative z-10 w-full max-w-5xl text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Color Grid Logic
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-muted-foreground"
              variants={itemVariants}
            >
              A colorful puzzle challenge where logic meets creativity. Fill the grid with colors following Sudoku-style rules.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              variants={itemVariants}
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-6 px-8 rounded-xl hover:shadow-lg transition-all" asChild>
                <Link to="/game" className="flex items-center gap-2">
                  <Gamepad className="h-5 w-5" />
                  <span>Play Now</span>
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setShowAbout(true)}
                  className="border-purple-300 hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-900/30"
                >
                  How to Play
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setShowChangelog(true)}
                  className="border-purple-300 hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-900/30"
                >
                  What's New
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="mt-16 absolute bottom-10 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              variants={itemVariants}
            >
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth"
                  });
                }}
              >
                <ArrowDown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <span className="sr-only">Scroll Down</span>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Game Features Section */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-background to-purple-50/20 dark:to-purple-900/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm rounded-full bg-primary/5 text-primary border-primary/20">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience Color Grid Logic</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Challenge your brain with our unique color-based logic puzzles that are both fun and stimulating.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-purple-100 dark:border-purple-900/20"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(126, 64, 246, 0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Star className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multiple Difficulty Levels</h3>
                <p className="text-muted-foreground">
                  Choose from Easy (4×4) or Hard (9×9) puzzles to match your skill level.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Beginner-friendly 4×4 grids</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Advanced 9×9 challenges</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-blue-100 dark:border-blue-900/20"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(66, 153, 225, 0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Leaderboard System</h3>
                <p className="text-muted-foreground">
                  Compete with other players and track your progress on our global leaderboard.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Earn points based on time and difficulty</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>See how you rank globally</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-pink-100 dark:border-pink-900/20"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(237, 100, 166, 0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Daily Challenges</h3>
                <p className="text-muted-foreground">
                  New puzzles every day to keep your brain sharp and your skills improving.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Fresh puzzles daily</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Special achievements for daily players</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Game Preview Section */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-purple-50/20 to-background dark:from-purple-900/5 dark:to-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm rounded-full bg-primary/5 text-primary border-primary/20">
                Preview
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">See the Game in Action</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get a glimpse of the colorful and engaging puzzle experience that awaits you.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <motion.div 
                className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/20 flex-1"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="aspect-ratio-4/3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center p-6">
                  <div className="grid grid-cols-4 grid-rows-4 gap-2">
                    {Array(16).fill(null).map((_, i) => (
                      <motion.div 
                        key={i} 
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-md ${
                          ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400', 
                          'bg-purple-400', 'bg-pink-400', 'bg-orange-400', 'bg-indigo-400'][i % 8]
                        }`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      ></motion.div>
                    ))}
                  </div>
                </div>
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  A preview of the Color Grid Logic puzzle game - Easy 4x4 mode
                </p>
              </motion.div>
              
              <div className="flex-1 max-w-lg">
                <h3 className="text-2xl font-bold mb-4">How to Play</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <span className="text-primary font-medium">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Select an empty cell in the grid</p>
                      <p className="text-muted-foreground text-sm">Click on any empty space to begin filling the grid</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <span className="text-primary font-medium">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Choose a color from the palette</p>
                      <p className="text-muted-foreground text-sm">Click on a color or use number keys to place a color</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <span className="text-primary font-medium">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Follow the Sudoku-style rules</p>
                      <p className="text-muted-foreground text-sm">Each row, column, and region must contain each color exactly once</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600">
                    <Link to="/game">
                      <Gamepad className="mr-2 h-5 w-5" />
                      Start Playing Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Challenge Your Mind?</h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of players around the world who are exercising their brains and having fun with Color Grid Logic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50" asChild>
                <Link to="/game">Start Playing</Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <Link to="/auth">Create an Account</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
        
        <AboutModal open={showAbout} onOpenChange={setShowAbout} />
        <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutModal = ({ open, onOpenChange }: ModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">About Color Grid Logic</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-muted-foreground">
        <p>
          Color Grid Logic is a puzzle game inspired by Sudoku, but with colors instead of numbers. 
          Fill the grid so that each row, column, and region contains each color exactly once.
        </p>
        <h3 className="font-semibold text-lg text-foreground">How to Play:</h3>
        <ol className="list-decimal pl-6">
          <li>Click on an empty cell to select it</li>
          <li>Click on a color from the palette or use number keys (1-4 for Easy, 1-9 for Hard) to fill the cell</li>
          <li>Each row, column, and region must contain each color exactly once</li>
          <li>The puzzle is solved when all cells are filled correctly</li>
        </ol>
        <h3 className="font-semibold text-lg text-foreground">Difficulty Levels:</h3>
        <ul className="list-disc pl-6">
          <li><strong>Easy:</strong> 4×4 grid with more pre-filled cells</li>
          <li><strong>Hard:</strong> 9×9 grid with fewer pre-filled cells</li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
);

const ChangelogModal = ({ open, onOpenChange }: ModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Changelog</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg">{formatDate(new Date())} - Beta 3.0</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Completely redesigned UI with improved visuals</li>
            <li>Merged account and settings pages into a single, more intuitive interface</li>
            <li>Enhanced leaderboard with filtering by difficulty and time period</li>
            <li>Improved navigation with a modern responsive navbar</li>
            <li>Updated color theme for better accessibility and aesthetics</li>
            <li>Redesigned footer with improved navigation links</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 22, 2025 - Beta 2.5</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Added animated hero section to homepage</li>
            <li>Implemented loading screens for all pages</li>
            <li>Fixed Medium (6×6) grid color display issues</li>
            <li>Added developer information to footer</li>
            <li>Enhanced scroll-to-top functionality for better navigation</li>
            <li>Improved sitemap with clickable navigation buttons</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 21, 2025 - Beta 2.4</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Improved sitemap with clickable navigation buttons</li>
            <li>Fixed Medium (6×6) grid color display issues</li>
            <li>Added scroll-to-top functionality for better navigation</li>
            <li>Enhanced mobile experience with hamburger menu</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 20, 2025 - Security Update</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Fixed security issue with OTP expiry time in authentication</li>
            <li>Enhanced user account security measures</li>
            <li>Improved authentication flow experience</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 18, 2025 - Beta 2.3</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Added high contrast mode for improved accessibility</li>
            <li>Optimized game load times across all devices</li>
            <li>Fixed several UI glitches on mobile devices</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default Index;
