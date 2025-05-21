
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PuzzleIcon, Award, Clock } from "lucide-react";

const MotionCard = ({ children, index }: { children: React.ReactNode; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="h-full"
  >
    {children}
  </motion.div>
);

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-background to-purple-50">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4 text-primary"
            >
              About Color Grid Logic
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Color Grid Logic is a puzzle game inspired by Sudoku but with a colorful twist. 
              Instead of using numbers, players fill a grid with colors according to specific rules.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button size="lg" asChild>
                <Link to="/game">Play Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/achievements">View Achievements</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Game Info Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">How the Game Works</h2>
                <p className="text-muted-foreground mb-6">
                  Each puzzle consists of a grid divided into regions. The goal is to fill the grid so that each row, 
                  column, and region contains each color exactly once.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full mt-1">
                      <span className="block w-4 h-4 rounded-full bg-blue-500"></span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Simple Rules</h3>
                      <p className="text-muted-foreground text-sm">
                        Each row, column, and region must contain each color exactly once.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full mt-1">
                      <span className="block w-4 h-4 rounded-full bg-green-500"></span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Logic-Based</h3>
                      <p className="text-muted-foreground text-sm">
                        No guessing required! Every puzzle can be solved through deductive reasoning.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-full mt-1">
                      <span className="block w-4 h-4 rounded-full bg-yellow-500"></span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Multiple Difficulties</h3>
                      <p className="text-muted-foreground text-sm">
                        Choose from Easy (4×4) or Hard (9×9) puzzles based on your skill level.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl -z-10 blur-xl opacity-70"></div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="grid grid-cols-4 grid-rows-4 gap-2 aspect-square">
                    {Array(16).fill(null).map((_, i) => (
                      <motion.div 
                        key={i} 
                        className={`rounded-md flex items-center justify-center ${
                          ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'][i % 4]
                        }`}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        viewport={{ once: true }}
                      >
                        {i < 4 && <span className="text-white font-bold">{i + 1}</span>}
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-center mt-4 text-sm text-muted-foreground">
                    Example of a 4×4 Color Grid Logic puzzle
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How to Play Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-2">How to Play</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn the basics of Color Grid Logic with our step-by-step tutorial
              </p>
            </motion.div>
            
            <Tabs defaultValue="basics" className="max-w-3xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="strategies">Strategies</TabsTrigger>
                <TabsTrigger value="controls">Controls</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basics">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
                    <ol className="space-y-4 list-decimal list-inside">
                      <li className="text-muted-foreground">
                        <span className="text-foreground font-medium">Select a difficulty level</span> - 
                        Choose Easy (4×4) for beginners or Hard (9×9) for a challenge
                      </li>
                      <li className="text-muted-foreground">
                        <span className="text-foreground font-medium">Understand the objective</span> - 
                        Fill the grid so each row, column, and region contains each color exactly once
                      </li>
                      <li className="text-muted-foreground">
                        <span className="text-foreground font-medium">Click on empty cells</span> - 
                        Select an empty cell to activate it
                      </li>
                      <li className="text-muted-foreground">
                        <span className="text-foreground font-medium">Choose a color</span> - 
                        Click on a color from the palette to fill the selected cell
                      </li>
                      <li className="text-muted-foreground">
                        <span className="text-foreground font-medium">Complete the puzzle</span> - 
                        Continue filling cells until the entire grid is complete
                      </li>
                    </ol>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <video 
                      className="w-full rounded-lg"
                      poster="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                      controls
                    >
                      <source src="#" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-center mt-3 text-sm text-muted-foreground">
                      Tutorial: Getting started with Color Grid Logic
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="strategies">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Winning Strategies</h3>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="inline-block w-6 h-6 rounded-full bg-blue-500 mr-2"></span>
                      Scanning Technique
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Look for rows, columns, or regions that already have several colors placed. 
                      By process of elimination, you can determine which colors are missing.
                    </p>
                    
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="inline-block w-6 h-6 rounded-full bg-green-500 mr-2"></span>
                      Cross-Referencing
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      If a color can only appear in one cell within a row or column, it must go there, 
                      even if you haven't eliminated all other possibilities in that region.
                    </p>
                    
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="inline-block w-6 h-6 rounded-full bg-yellow-500 mr-2"></span>
                      Elimination Method
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      If a cell can only contain one specific color (based on the colors already present in its row, 
                      column, and region), then that must be the correct color.
                    </p>
                    
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="inline-block w-6 h-6 rounded-full bg-red-500 mr-2"></span>
                      Start with the Obvious
                    </h4>
                    <p className="text-muted-foreground">
                      Begin by filling in cells that have only one possible color option. 
                      Each placement will provide more constraints, making subsequent decisions easier.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="controls">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Game Controls</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <PuzzleIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Mouse Controls</h4>
                        <p className="text-muted-foreground">
                          Click on an empty cell to select it, then click on a color from the palette to fill the cell.
                          Click the "Reset" button to clear all your inputs and start over.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Keyboard Shortcuts</h4>
                        <p className="text-muted-foreground">
                          Use number keys (1-4 for Easy, 1-9 for Hard) to quickly place colors after selecting a cell.
                          Arrow keys can be used to navigate between cells.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Timer & Pause</h4>
                        <p className="text-muted-foreground">
                          The game includes a timer to track how quickly you solve puzzles. Use the pause button to
                          take a break without affecting your time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Difficulty Levels */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Difficulty Levels</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <MotionCard index={0}>
                <Card className="h-full bg-green-50 border-green-100">
                  <CardContent className="p-6">
                    <div className="bg-green-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                      <span className="text-green-700 text-2xl font-bold">4×4</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Easy</h3>
                    <p className="text-muted-foreground mb-4">
                      A gentle introduction with a smaller grid and more pre-filled cells. Perfect for beginners
                      or a quick gaming session.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        4×4 grid with 4 colors
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        More pre-filled cells
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Completes in 5-10 minutes
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </MotionCard>
              
              <MotionCard index={1}>
                <Card className="h-full bg-orange-50 border-orange-100">
                  <CardContent className="p-6">
                    <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                      <span className="text-orange-700 text-2xl font-bold">6×6</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Medium</h3>
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs inline-block mb-4">
                      Currently Unavailable
                    </div>
                    <p className="text-muted-foreground mb-4">
                      A balanced challenge with a medium-sized grid and moderate number of pre-filled cells.
                    </p>
                    <ul className="space-y-2 text-sm opacity-50">
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        6×6 grid with 6 colors
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Moderate pre-filled cells
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Completes in 10-20 minutes
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </MotionCard>
              
              <MotionCard index={2}>
                <Card className="h-full bg-red-50 border-red-100">
                  <CardContent className="p-6">
                    <div className="bg-red-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                      <span className="text-red-700 text-2xl font-bold">9×9</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Hard</h3>
                    <p className="text-muted-foreground mb-4">
                      A true challenge with a larger grid and fewer pre-filled cells. Designed for experienced
                      puzzle solvers.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        9×9 grid with 9 colors
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Fewer pre-filled cells
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Completes in 20+ minutes
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </MotionCard>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-16 px-6 bg-gradient-to-b from-purple-50 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Ready to Test Your Skills?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-8 max-w-xl mx-auto"
            >
              Jump into a game of Color Grid Logic and challenge yourself with our colorful puzzles. Track your progress and earn achievements!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Button size="lg" className="bg-primary" asChild>
                <Link to="/game">
                  Start Playing Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
