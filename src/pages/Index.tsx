
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Info, Star, Award, Clock, Users, Lightbulb, Brain, 
  Sparkles, ArrowRight, Trophy, Medal, PuzzleIcon 
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useAchievements } from "@/hooks/useAchievements";

const Index = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const { unlockedCount, totalCount } = useAchievements();
  
  // Check scroll position
  useState(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

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
          className="relative z-10 w-full max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 flex justify-center"
          >
            <img 
              src="/logo.png" 
              alt="Color Grid Logic Logo" 
              className="h-28 w-auto" 
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-primary"
            variants={itemVariants}
          >
            Color Grid Logic
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground"
            variants={itemVariants}
          >
            A colorful puzzle challenge where logic meets creativity. Fill the grid with colors following Sudoku-style rules.
          </motion.p>
          
          <motion.div 
            className="grid gap-4 sm:flex sm:flex-wrap sm:justify-center max-w-lg mx-auto"
            variants={itemVariants}
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white hover:text-white rounded-xl" asChild>
              <Link to="/game">Play Game</Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowAbout(true)}
              className="border-purple-300 hover:bg-purple-100 hover:text-purple-800 rounded-xl"
            >
              About
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowChangelog(true)}
              className="border-purple-300 hover:bg-purple-100 hover:text-purple-800 rounded-xl"
            >
              Changelog
            </Button>
          </motion.div>
          
          {user && (
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col items-center"
            >
              <div className="bg-primary/10 px-4 py-2 rounded-xl inline-flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span>
                  You've unlocked <strong>{unlockedCount}</strong> out of <strong>{totalCount}</strong> achievements
                </span>
                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                  <Link to="/achievements">View</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* How to Play Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How To Play</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-8 text-primary">Simple Rules, Endless Fun</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0 mt-1">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="bg-purple-500 w-6 h-6 rounded-full"></span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Fill the Grid</h4>
                    <p className="text-muted-foreground">
                      Place colors so that each row, column, and region contains each color exactly once.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0 mt-1">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="bg-blue-500 w-6 h-6 rounded-full"></span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Use Logic</h4>
                    <p className="text-muted-foreground">
                      Analyze the grid to determine where each color must go based on the pre-filled cells.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-green-100 p-3 rounded-xl flex-shrink-0 mt-1">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="bg-green-500 w-6 h-6 rounded-full"></span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">No Guessing Needed</h4>
                    <p className="text-muted-foreground">
                      Every puzzle can be solved through pure logic and deduction, no random guessing required.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0 mt-1">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="bg-yellow-500 w-6 h-6 rounded-full"></span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Multiple Ways to Play</h4>
                    <p className="text-muted-foreground">
                      Use mouse clicks or keyboard shortcuts (numbers 1-9) to quickly place colors in cells.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg" 
                  size="lg"
                  asChild
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="aspect-square flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl rotate-6 -z-10 blur-xl opacity-70"></div>
                    <div className="grid grid-cols-4 grid-rows-4 gap-2 bg-white p-4 rounded-lg shadow-sm">
                      {Array(16).fill(null).map((_, i) => (
                        <motion.div 
                          key={i} 
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center ${
                            ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'][i % 4]
                          }`}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          viewport={{ once: true, amount: 0.5 }}
                        >
                          {i < 4 && <span className="text-white text-xl font-bold">{i + 1}</span>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-center mt-4 text-muted-foreground">
                  Example of a 4×4 Color Grid Logic puzzle
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Game Features Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Game Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Star className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Difficulty Levels</h3>
              <p className="text-muted-foreground">
                Choose from Easy (4×4) or Hard (9×9) puzzles to match your skill level and challenge yourself.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Award className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Achievements</h3>
              <p className="text-muted-foreground">
                Earn achievements as you complete puzzles and improve your skills over time. Unlock special badges to showcase your progress.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="bg-pink-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Timed Gameplay</h3>
              <p className="text-muted-foreground">
                Race against the clock to solve puzzles as quickly as possible and improve your skills with each attempt.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Leaderboards</h3>
              <p className="text-muted-foreground">
                Compete with players worldwide on our leaderboards. Show off your skills and see how you rank against others.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <PuzzleIcon className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Daily Puzzles</h3>
              <p className="text-muted-foreground">
                Enjoy a new challenging puzzle every day with our Daily Puzzle feature. Perfect for a quick daily brain workout.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Medal className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Track your improvement over time with detailed statistics and performance metrics on your account.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Benefits of Playing</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-md"
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
              <p className="text-muted-foreground mb-4">
                Color Grid Logic helps improve cognitive abilities including:
              </p>
              <ul className="space-y-2">
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
              className="p-8 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl shadow-md"
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
              <p className="text-muted-foreground mb-4">
                Beyond the cognitive benefits, Color Grid Logic provides:
              </p>
              <ul className="space-y-2">
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
                  <span>Achievement tracking to boost motivation</span>
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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Join Our Community</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-4">Connect with Players Worldwide</h3>
              <p className="text-muted-foreground mb-6">
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
              <div className="flex gap-3">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg" 
                  asChild
                >
                  <Link to="/leaderboard">View Leaderboard</Link>
                </Button>
                <Button 
                  variant="outline"
                  className="rounded-lg"
                  asChild
                >
                  <Link to="/achievements">
                    <Trophy className="mr-2 h-4 w-4" />
                    Achievements
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-100 rounded-lg"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-lg"></div>
                <div className="bg-white relative z-10 p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-center">Global Leaderboard</h3>
                  <div className="space-y-4">
                    {Array(5).fill(null).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-700">
                            {i + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500"></div>
                            <div>Player {i + 1}</div>
                          </div>
                        </div>
                        <div className="font-bold">{9500 - i * 500}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <Button size="sm" variant="link" asChild className="text-primary">
                      <Link to="/leaderboard">See Full Leaderboard</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Meet the Developer */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Meet the Developer</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="md:w-1/3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl -z-10 rotate-6"></div>
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                  alt="Samuel Snow" 
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-2/3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2">Samuel Snow</h3>
              <p className="text-lg text-primary mb-4">Web Developer & Tech Enthusiast</p>
              <p className="text-muted-foreground mb-4">
                My passion lies in the intersection of art and technology, creating visually captivating interfaces and elevating overall user digital experiences. From Kazakhstan to San Francisco, my journey has been one of constant learning and growth.
              </p>
              <p className="text-muted-foreground mb-6">
                When I'm not coding, you'll find me mountain biking, skiing, running, or enjoying a cup of boba while thinking about the future of technology.
              </p>
              <Button className="rounded-lg" asChild>
                <Link to="/developer">
                  Learn More About Me
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
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
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 rounded-xl" asChild>
              <Link to="/game">Play Now</Link>
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
    <DialogContent className="max-w-2xl rounded-xl">
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
          <li><strong>Medium:</strong> 4×4 grid with fewer pre-filled cells (currently unavailable)</li>
          <li><strong>Hard:</strong> 9×9 grid with fewer pre-filled cells</li>
        </ul>

        <div className="pt-4">
          <Button onClick={() => {
            onOpenChange(false);
            window.location.href = '/about';
          }} className="rounded-lg">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const ChangelogModal = ({ open, onOpenChange }: ModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Changelog</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg">{formatDate(new Date('2025-05-21'))} - Beta 3.0</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Completely redesigned UI with smoother animations and rounded corners</li>
            <li>Added achievements system with 6 unlockable achievements</li>
            <li>Added detailed player statistics and profile customization</li>
            <li>New game mechanics including hints and difficulty adjustments</li>
            <li>Improved leaderboards with filtering by difficulty and time period</li>
            <li>Added developer profile page</li>
            <li>Enhanced tutorial and gameplay instructions</li>
            <li>Added account management page with profile settings</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">{formatDate(new Date('2025-04-10'))} - Beta 2.9</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Temporarily removed daily challenge feature (will return in a future update)</li>
            <li>Updated homepage layout and content</li>
            <li>Simplified game features presentation</li>
            <li>Improved mobile responsiveness across all sections</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">{formatDate(new Date('2025-03-15'))} - Beta 2.8</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Enhanced homepage with new sections showcasing game benefits and features</li>
            <li>Added keyboard number shortcuts to color palette for faster gameplay</li>
            <li>Improved light mode UI across all game components</li>
            <li>Optimized game grid to better fit mobile screens</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default Index;
