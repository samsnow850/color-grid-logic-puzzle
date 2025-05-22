
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowDown, Star, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, scrollToTop } from "@/lib/utils";

const Index = () => {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Beta Banner */}
      <div className="bg-primary py-3 px-6 sticky top-0 z-30">
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
          <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-background to-background"></div>
          <motion.div 
            className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-purple-200 opacity-60"
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
            className="absolute top-60 right-[15%] w-24 h-24 rounded-full bg-blue-200 opacity-50"
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
            className="absolute bottom-40 left-[25%] w-16 h-16 rounded-full bg-pink-200 opacity-60"
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
          className="relative z-10 w-full max-w-4xl text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-primary"
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
            className="grid gap-4 sm:grid-cols-3 max-w-md mx-auto"
            variants={itemVariants}
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6" asChild>
              <a href="/game">Play Game</a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowAbout(true)}
              className="border-purple-300 hover:bg-purple-100"
            >
              About
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowChangelog(true)}
              className="border-purple-300 hover:bg-purple-100"
            >
              Changelog
            </Button>
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
              <ArrowDown className="w-6 h-6 text-purple-600" />
              <span className="sr-only">Scroll Down</span>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Game Features Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Game Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-purple-50 p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Star className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Difficulty Levels</h3>
              <p className="text-gray-600">
                Choose from Easy (4×4), Medium (6×6), or Hard (9×9) puzzles to match your skill level.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Award className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Leaderboard System</h3>
              <p className="text-gray-600">
                Compete with other players and track your progress on our global leaderboard.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-pink-50 p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Daily Challenges</h3>
              <p className="text-gray-600">
                New puzzles every day to keep your brain sharp and your skills improving.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Game Preview Image */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Game Preview</h2>
          
          <motion.div 
            className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="aspect-ratio-4/3 bg-gray-100 rounded flex items-center justify-center">
              <div className="grid grid-cols-4 grid-rows-4 gap-2 p-4">
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
            <p className="text-center mt-4 text-sm text-gray-600">
              A preview of the Color Grid Logic puzzle game
            </p>
          </motion.div>
        </div>
      </section>
      
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
      <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
      
      <Footer />
    </div>
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
          <li>Click on a color from the palette or use number keys (1-4, 1-6, or 1-9 depending on grid size) to fill the cell</li>
          <li>Each row, column, and region must contain each color exactly once</li>
          <li>The puzzle is solved when all cells are filled correctly</li>
        </ol>
        <h3 className="font-semibold text-lg text-foreground">Difficulty Levels:</h3>
        <ul className="list-disc pl-6">
          <li><strong>Easy:</strong> 4×4 grid with more pre-filled cells</li>
          <li><strong>Medium:</strong> 6×6 grid with a moderate number of pre-filled cells</li>
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
          <h3 className="font-bold text-lg">{formatDate(new Date())} - Beta 2.5</h3>
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
        <div>
          <h3 className="font-bold text-lg">May 16, 2025 - Beta 2.2</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Added profile management features</li>
            <li>Implemented avatar upload functionality</li>
            <li>Introduced bio section for user profiles</li>
            <li>Enhanced leaderboard with profile integration</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 14, 2025 - Beta 2.1</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Added sound effects for game interactions</li>
            <li>Implemented background music toggle feature</li>
            <li>Enhanced grid number visibility options</li>
            <li>Fixed several UI/UX issues reported by beta testers</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 12, 2025 - Beta 2.0</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Launched comprehensive user settings page</li>
            <li>Added leaderboard opt-in/out feature</li>
            <li>Implemented "Coming Soon" feature previews</li>
            <li>Created Help & FAQ section with troubleshooting guides</li>
            <li>Added bug reporting system</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 10, 2025 - Beta 1.2</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Implemented user account management</li>
            <li>Added email and password change functionality</li>
            <li>Created account deletion process</li>
            <li>Enhanced security for user data</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 8, 2025 - Beta 1.1</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Released leaderboard system</li>
            <li>Added score tracking and persistence</li>
            <li>Implemented user authentication requirements</li>
            <li>Fixed several critical gameplay bugs</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">May 5, 2025 - Alpha Release</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Initial alpha release with core gameplay mechanics</li>
            <li>Implemented three difficulty levels (Easy, Medium, Hard)</li>
            <li>Added basic user interface and responsive design</li>
            <li>Released tutorial for new players</li>
            <li>Created puzzle generation algorithm</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default Index;
