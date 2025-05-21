import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { 
  BarChart3, 
  Brain, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Code2, 
  Dices, 
  ExternalLink, 
  Fingerprint, 
  Gamepad2, 
  GraduationCap, 
  History, 
  Lightbulb, 
  Pointer, 
  Sparkles, 
  Star, 
  Trophy, 
  Undo2
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { useAuth } from "@/hooks/useAuth";
import { scrollToTop } from "@/lib/utils";

// Feature component for the "How It Works" section
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-poppins font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Benefit card component with animation
const BenefitCard = ({ icon, title, items, gradientFrom, gradientTo, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className={`rounded-xl p-6 shadow-lg h-full bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white bg-opacity-30 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="font-poppins font-bold text-xl">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

// Testimonial card component
const TestimonialCard = ({ quote, name, title, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <Star className="text-yellow-400 h-5 w-5" />
          <Star className="text-yellow-400 h-5 w-5" />
          <Star className="text-yellow-400 h-5 w-5" />
          <Star className="text-yellow-400 h-5 w-5" />
          <Star className="text-yellow-400 h-5 w-5" />
        </div>
        <p className="text-gray-700 italic mb-4 flex-1">"{quote}"</p>
        <div className="flex items-center mt-auto">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden flex items-center justify-center text-gray-500">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stats component with animation
const StatItem = ({ value, label, icon, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        setCount(Math.min(Math.floor(start), end));
        
        if (start >= end) {
          clearInterval(timer);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="text-center p-6"
    >
      <div className="flex justify-center mb-3">
        <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold font-poppins mb-1">{count.toLocaleString()}+</h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

// Main Preview Component
const Preview = () => {
  const { user } = useAuth();
  
  // Create animated references
  const heroRef = React.useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  // Random stats for visualization
  const stats = [
    { value: "50000", label: "Puzzles Solved", icon: <Trophy className="w-6 h-6 text-purple-600" /> },
    { value: "15000", label: "Active Players", icon: <Gamepad2 className="w-6 h-6 text-purple-600" /> },
    { value: "1000", label: "Daily Challenges", icon: <Calendar className="w-6 h-6 text-purple-600" /> },
    { value: "25", label: "Achievements", icon: <Star className="w-6 h-6 text-purple-600" /> },
  ];
  
  // Features data
  const features = [
    { 
      icon: <Dices className="text-purple-600" />, 
      title: "Multiple Difficulty Levels", 
      description: "Choose from Easy (4×4), Medium (6×6), or Hard (9×9) puzzles to match your skill level." 
    },
    { 
      icon: <Star className="text-purple-600" />, 
      title: "Achievement System", 
      description: "Earn badges and track your progress as you complete puzzles and improve your skills." 
    },
    { 
      icon: <Lightbulb className="text-purple-600" />, 
      title: "Hint System", 
      description: "Get helpful hints when you're stuck without revealing the entire solution." 
    },
    { 
      icon: <Undo2 className="text-purple-600" />, 
      title: "Undo/Redo Actions", 
      description: "Easily undo or redo your moves to experiment with different strategies." 
    },
    { 
      icon: <GraduationCap className="text-purple-600" />, 
      title: "Tutorial Mode", 
      description: "Learn how to play with an interactive tutorial designed for new players." 
    },
    { 
      icon: <Clock className="text-purple-600" />, 
      title: "Time-Based Challenges", 
      description: "Race against the clock to solve puzzles as quickly as possible." 
    }
  ];
  
  // Benefits data
  const benefits = [
    {
      icon: <Brain className="w-6 h-6 text-purple-700" />,
      title: "Cognitive Benefits",
      items: [
        "Improves problem-solving skills",
        "Enhances logical reasoning",
        "Strengthens pattern recognition",
        "Boosts working memory",
        "Increases attention to detail"
      ],
      gradientFrom: "purple-50",
      gradientTo: "indigo-100"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pink-600" />,
      title: "Enjoyment & Relaxation",
      items: [
        "Provides a calming focus activity",
        "Reduces stress through immersion",
        "Creates satisfying completion moments",
        "Offers achievement tracking",
        "Enables progress visualization"
      ],
      gradientFrom: "pink-50",
      gradientTo: "rose-100"
    }
  ];
  
  // Testimonial data (mock data)
  const testimonials = [
    {
      quote: "Color Grid Logic is the perfect mental workout! I play it daily to keep my mind sharp while having fun.",
      name: "Sarah K.",
      title: "Regular Player",
      delay: 0
    },
    {
      quote: "The tutorial made it so easy to understand the game mechanics. Now I'm solving hard puzzles every day!",
      name: "Michael T.",
      title: "New Player",
      delay: 0.1
    },
    {
      quote: "I love the achievement system. It keeps me motivated to improve my solving skills and try harder puzzles.",
      name: "Jamie L.",
      title: "Advanced Player",
      delay: 0.2
    }
  ];
  
  return (
    <PageWrapper
      loadingTitle="Welcome to the Future"
      loadingDescription="Preparing an enhanced Color Grid Logic experience"
      loadingColor="purple"
    >
      <div className="min-h-screen font-poppins">
        {/* Navbar */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-md bg-purple-600 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-300 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-300 rounded-sm"></div>
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  <span className="font-bold text-xl">Color Grid Logic</span>
                </Link>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/game" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">
                  Play Game
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">
                  About
                </Link>
                <Link to="/leaderboard" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">
                  Leaderboard
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">
                  Contact
                </Link>
              </nav>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <Link to="/account">
                    <Button className="bg-purple-600 hover:bg-purple-700 button-hover-effect">
                      My Account
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button className="bg-purple-600 hover:bg-purple-700 button-hover-effect">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Hero Section with animated elements */}
        <section 
          ref={heroRef}
          className="relative overflow-hidden bg-gradient-primary py-20 md:py-32"
        >
          {/* Animated shapes in background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Hero content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge variant="secondary" className="mb-4 px-3 py-1 text-purple-700 bg-purple-100 hover:bg-purple-200">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-purple-600"></span> New Features Available
                    </span>
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                    Train Your Brain with <span className="text-gradient-pink">Color Grid Logic</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 mb-8">
                    A colorful puzzle challenge where logic meets creativity. Fill the grid with colors following Sudoku-style rules.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link to="/game">
                      <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white button-hover-effect px-8">
                        Play Now
                        <ChevronRight className="ml-1 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button size="lg" variant="outline" className="border-purple-300 hover:bg-purple-100 hover:text-purple-800">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="mt-8 flex items-center space-x-2 text-sm">
                    <Star className="text-yellow-400 h-5 w-5" />
                    <span className="font-medium">4.9/5 rating from over 1,000 players</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Animated game preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-2 left-2 flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="pt-6">
                    <div className="rounded-xl overflow-hidden">
                      <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
                        {Array(16).fill(null).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.5 + i * 0.03,
                              ease: "easeOut"
                            }}
                            className={`w-16 h-16 rounded-md flex items-center justify-center ${
                              ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'][i % 4]
                            }`}
                          >
                            {i < 8 ? (
                              <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 + i * 0.05 }}
                                className="text-white font-bold text-lg"
                              >
                                {(i % 4) + 1}
                              </motion.span>
                            ) : null}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="flex justify-center mt-4 gap-3"
                    >
                      <div className="w-10 h-10 rounded-md bg-blue-400 flex items-center justify-center">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-green-400 flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-yellow-400 flex items-center justify-center">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-red-400 flex items-center justify-center">
                        <span className="text-white font-bold">4</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Floating interface elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2 border border-gray-200"
                >
                  <Clock className="text-purple-600 h-4 w-4" />
                  <span className="font-medium">01:45</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="text-yellow-500 h-4 w-4" />
                    <span className="font-medium">Hints: 3</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <StatItem 
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  delay={0.1 * index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Color Grid Logic combines the strategic thinking of Sudoku with a colorful twist, making it both challenging and visually engaging.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.1 * index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How to Play Section with animated steps */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="order-2 md:order-1"
              >
                <Badge className="mb-3 px-3 py-1 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">How To Play</Badge>
                <h2 className="text-3xl font-bold mb-6">Simple Rules, <br />Endless Fun</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                      <div className="w-6 h-6 flex items-center justify-center bg-purple-600 rounded-full text-white font-bold">1</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Fill the grid with colors</h3>
                      <p className="text-gray-600">Each row, column, and region must contain each color exactly once.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                      <div className="w-6 h-6 flex items-center justify-center bg-indigo-600 rounded-full text-white font-bold">2</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Use logic to determine placements</h3>
                      <p className="text-gray-600">Analyze the pre-filled cells to determine where each color should go.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-100 p-3 rounded-full flex-shrink-0">
                      <div className="w-6 h-6 flex items-center justify-center bg-pink-600 rounded-full text-white font-bold">3</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">No guessing needed</h3>
                      <p className="text-gray-600">Every puzzle can be solved through pure logic and deduction.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                      <div className="w-6 h-6 flex items-center justify-center bg-purple-600 rounded-full text-white font-bold">4</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Use keyboard shortcuts</h3>
                      <p className="text-gray-600">Press numbers 1-9 to quickly place colors in selected cells.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link to="/game">
                    <Button className="bg-purple-600 hover:bg-purple-700 button-hover-effect">
                      Try It Now
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Animated grid example */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="order-1 md:order-2 flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-100 rounded-lg z-0"></div>
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-lg z-0"></div>
                  <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 relative z-10">
                    <div className="grid grid-cols-4 grid-rows-4 gap-3 w-full max-w-xs mx-auto">
                      {Array(16).fill(null).map((_, i) => {
                        const row = Math.floor(i / 4);
                        const col = i % 4;
                        const isPreFilled = row === 0 || col === 0 || i === 5 || i === 10;
                        const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'];
                        const colorIndex = (row + col) % 4;
                        
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.4,
                              delay: 0.3 + i * 0.05
                            }}
                            viewport={{ once: true }}
                            className={`w-14 h-14 rounded-md flex items-center justify-center ${isPreFilled ? colors[colorIndex] : 'bg-gray-100'}`}
                          >
                            {isPreFilled && <span className="text-white font-bold">{colorIndex + 1}</span>}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-3 px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200">Benefits</Badge>
              <h2 className="text-3xl font-bold mb-4">Why Play Color Grid Logic?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our game doesn't just entertain - it exercises your brain and provides numerous cognitive benefits.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  items={benefit.items}
                  gradientFrom={benefit.gradientFrom}
                  gradientTo={benefit.gradientTo}
                  delay={0.2 * index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Players Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it - hear from our community of players who love Color Grid Logic.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  name={testimonial.name}
                  title={testimonial.title}
                  delay={testimonial.delay}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Features preview slider */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">New Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're constantly improving the game with new features and enhancements.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-indigo-100 rounded-full">
                    <Lightbulb className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Hint System</h3>
                  <p className="text-gray-600 text-sm">Get helpful hints when you're stuck on a difficult puzzle.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-green-100 rounded-full">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Achievements</h3>
                  <p className="text-gray-600 text-sm">Earn badges and rewards as you complete challenges.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-blue-100 rounded-full">
                    <History className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Undo/Redo</h3>
                  <p className="text-gray-600 text-sm">Easily track and revert your moves as you play.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-purple-100 rounded-full">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Tutorial Mode</h3>
                  <p className="text-gray-600 text-sm">Learn how to play with our interactive tutorial system.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Challenge Your Mind?</h2>
              <p className="text-xl opacity-90 mb-8">
                Start solving puzzles today and join thousands of players enjoying Color Grid Logic!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/game">
                  <Button size="lg" variant="secondary" className="bg-white text-purple-700 hover:bg-gray-100 button-hover-effect px-8">
                    Play Now
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 button-hover-effect">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Preview;
