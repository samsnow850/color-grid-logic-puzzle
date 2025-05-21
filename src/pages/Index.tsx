import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Star, Award, Clock, Users, Lightbulb, Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, scrollToTop } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Index = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  
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
            className="grid gap-4 sm:flex sm:flex-wrap sm:justify-center max-w-lg mx-auto"
            variants={itemVariants}
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white hover:text-white" asChild>
              <Link to="/game">Play Game</Link>
            </Button>
            
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white" asChild>
              <Link to="/daily-puzzle">Daily Challenge</Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowAbout(true)}
              className="border-purple-300 hover:bg-purple-100 hover:text-purple-800"
            >
              About
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowChangelog(true)}
              className="border-purple-300 hover:bg-purple-100 hover:text-purple-800"
            >
              Changelog
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
              <h3 className="text-xl font-bold mb-2">Daily Challenges</h3>
              <p className="text-gray-600">
                Complete a new puzzle every day to track your progress and challenge yourself.
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
              <h3 className="text-xl font-bold mb-2">Timed Gameplay</h3>
              <p className="text-gray-600">
                Race against the clock to solve puzzles as quickly as possible and improve your skills.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* New Section: How to Play */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">How To Play</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Simple Rules, Endless Fun</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                    <span className="block w-5 h-5 rounded-full bg-purple-500"></span>
                  </span>
                  <p className="text-gray-700">
                    <strong>Fill the grid</strong> with colors so that each row, column, and region contains each color exactly once.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <span className="block w-5 h-5 rounded-full bg-blue-500"></span>
                  </span>
                  <p className="text-gray-700">
                    <strong>Use logic</strong> to determine where each color should go based on pre-filled cells.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <span className="block w-5 h-5 rounded-full bg-green-500"></span>
                  </span>
                  <p className="text-gray-700">
                    <strong>No guessing needed!</strong> Every puzzle can be solved through pure logic and deduction.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
                    <span className="block w-5 h-5 rounded-full bg-yellow-500"></span>
                  </span>
                  <p className="text-gray-700">
                    <strong>Use keyboard shortcuts</strong> (numbers 1-9) to quickly place colors in cells.
                  </p>
                </li>
              </ul>
              <Button 
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white" 
                size="lg"
                asChild
              >
                <Link to="/game">Start Playing Now</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="order-1 md:order-2 bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="aspect-square flex items-center justify-center">
                <div className="grid grid-cols-4 grid-rows-4 gap-2">
                  {Array(16).fill(null).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-md flex items-center justify-center ${
                        ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'][i % 4]
                      }`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    >
                      {i < 4 && <span className="text-white font-bold">{i + 1}</span>}
                    </motion.div>
                  ))}
                </div>
              </div>
              <p className="text-center mt-4 text-sm text-gray-600">
                Example of a 4×4 Color Grid Logic puzzle
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* New Section: Benefits */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Benefits of Playing</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Brain className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold">Brain Training</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Color Grid Logic helps improve cognitive abilities including:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  <span>Problem-solving skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  <span>Pattern recognition</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  <span>Logical reasoning</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  <span>Working memory</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  <span>Visual processing</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="p-8 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Sparkles className="w-7 h-7 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold">Entertainment & Relaxation</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Beyond the cognitive benefits, Color Grid Logic provides:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  <span>A calming focus activity</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  <span>Stress reduction through immersion</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  <span>Satisfaction of completing puzzles</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  <span>Daily challenges to look forward to</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  <span>Track progress and improve over time</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Join Our Community</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-4">Connect with Players Worldwide</h3>
              <p className="text-gray-600 mb-6">
                Join thousands of players in our growing community. Share strategies, compete on the leaderboard, and help shape the future of Color Grid Logic.
              </p>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="text-blue-600" size={20} />
                </div>
                <span className="font-semibold">Active Community</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Lightbulb className="text-purple-600" size={20} />
                </div>
                <span className="font-semibold">Strategy Sharing</span>
              </div>
              <Button 
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white" 
                size="lg"
                asChild
              >
                <Link to="/leaderboard">View Leaderboard</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-100 rounded-lg"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-lg"></div>
                <div className="bg-white relative z-10 p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="grid grid-cols-3 gap-3">
                    {Array(9).fill(null).map((_, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md flex items-center justify-center"
                      >
                        <div className={`w-8 h-8 rounded-full ${
                          ['bg-purple-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 
                           'bg-red-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400', 'bg-teal-400'][i]
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Game Preview Image - Keep this existing section */}
      <section className="py-16 px-6 md:px-12 bg-white">
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
                  >
                    {i < 8 && (
                      <span className="text-white font-bold text-lg">{i + 1}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">
              A preview of the Color Grid Logic puzzle game
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Challenge Your Mind?</h2>
          <p className="text-lg md:text-xl mb-8 text-gray-700">
            Start solving puzzles today and join thousands of players enjoying Color Grid Logic!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8" asChild>
              <Link to="/game">Play Now</Link>
            </Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8" asChild>
              <Link to="/daily-puzzle">Try Daily Challenge</Link>
            </Button>
          </div>
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
          <li><strong>Daily Challenge:</strong> 10×10 grid for an extra challenge</li>
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
          <h3 className="font-bold text-lg">{formatDate(new Date())} - Beta 2.8</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Enhanced homepage with new sections showcasing game benefits and features</li>
            <li>Added keyboard number shortcuts to color palette for faster gameplay</li>
            <li>Upgraded daily challenge to 10×10 grid size for more challenge</li>
            <li>Improved light mode UI across all game components</li>
            <li>Optimized game grid to better fit mobile screens</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">{formatDate(new Date(Date.now() - 86400000))} - Beta 2.7</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Combined Settings and Account pages into a single page</li>
            <li>Added improved theme selector with button choices</li>
            <li>Enhanced Daily Challenge page with permanent reset timer display</li>
            <li>Fixed button hover states for better visibility</li>
            <li>Updated footer with developer information</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">{formatDate(new Date(Date.now() - 172800000))} - Beta 2.6</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Added daily puzzle challenge feature</li>
            <li>Fixed Medium (6×6) grid color display issues</li>
            <li>Improved button hover states for better visibility</li>
            <li>Enhanced sitemap with clickable navigation buttons</li>
            <li>Added developer information to footer</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">{formatDate(new Date(Date.now() - 259200000))} - Beta 2.5</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Added animated hero section to homepage</li>
            <li>Implemented loading screens for all pages</li>
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
