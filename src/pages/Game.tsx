
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  Award, 
  PauseCircle,
  Info,
  HelpCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import ColorGrid from "@/components/game/ColorGrid";
import ColorPalette from "@/components/game/ColorPalette";
import GameTimer from "@/components/game/GameTimer";
import HintSystem from "@/components/game/HintSystem";
import PauseOverlay from "@/components/game/PauseOverlay";
import AchievementsDialog from "@/components/game/AchievementsDialog";
import TutorialMode from "@/components/game/TutorialMode";

import { 
  generateGrid, 
  solvePuzzle, 
  checkWinCondition as checkWin
} from "@/lib/gameLogic";
import { useAuth } from "@/hooks/useAuth";
import PageWrapper from "@/components/PageWrapper";
import { cn } from "@/lib/utils";

import { DifficultyLevel } from "@/lib/gameLogic";

const Game = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const difficultyParam = searchParams.get('difficulty') || 'easy';

  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Game state
  const [grid, setGrid] = useState<string[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<string[][]>([]);
  const [solution, setSolution] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [showMediumWarning, setShowMediumWarning] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Game settings
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(difficultyParam as DifficultyLevel);
  const [newGridSize, setNewGridSize] = useState(4);
  const [colorCount, setColorCount] = useState(4);
  const [hintCount, setHintCount] = useState(2);
  const [availableHints, setAvailableHints] = useState(2);
  
  // Timer state
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Colors array
  const colors = [
    "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
    "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", "bg-teal-400"
  ].slice(0, colorCount);
  
  // Game initialization
  useEffect(() => {
    startNewGame();
    // If the user hasn't played before, show the tutorial
    const hasTutorialBeenShown = localStorage.getItem('tutorialShown');
    if (!hasTutorialBeenShown) {
      setShowTutorial(true);
      localStorage.setItem('tutorialShown', 'true');
    }
  }, [difficulty]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isGameWon) return;
      
      if (selectedCell) {
        // Number keys 1-9 to select colors
        const num = parseInt(e.key);
        if (num >= 1 && num <= colors.length) {
          handleColorChange(colors[num - 1]);
        }
        
        // Arrow keys to navigate the grid
        const [row, col] = selectedCell;
        if (e.key === 'ArrowUp' && row > 0) {
          setSelectedCell([row - 1, col]);
        } else if (e.key === 'ArrowDown' && row < newGridSize - 1) {
          setSelectedCell([row + 1, col]);
        } else if (e.key === 'ArrowLeft' && col > 0) {
          setSelectedCell([row, col - 1]);
        } else if (e.key === 'ArrowRight' && col < newGridSize - 1) {
          setSelectedCell([row, col + 1]);
        }
        
        // Delete or Backspace to clear a cell
        if (e.key === 'Delete' || e.key === 'Backspace') {
          // Check if this is not a pre-filled cell
          if (originalGrid[row][col] === "") {
            const newGrid = [...grid];
            newGrid[row][col] = "";
            setGrid(newGrid);
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, grid, colors, isPaused, isGameWon, originalGrid, newGridSize]);
  
  // Start a new game with the selected difficulty
  const startNewGame = useCallback(() => {
    setGrid([]);
    setOriginalGrid([]);
    setSolution([]);
    setSelectedCell(null);
    setSelectedColor(null);
    setTime(0);
    setIsRunning(false);
    setAnimationKey(prevKey => prevKey + 1);

    // Initialize these values before using them
    let newGridSize = 4;
    let colorCount = 4;
    let hintsForDifficulty = 2;

    if (difficulty === "medium") {
      // Show medium difficulty warning
      setShowMediumWarning(true);
      // Medium difficulty settings would go here
    } else if (difficulty === "hard") {
      newGridSize = 9;
      colorCount = 9;
      hintsForDifficulty = 3;
    }

    setNewGridSize(newGridSize);
    setColorCount(colorCount);
    setHintCount(hintsForDifficulty);
    setAvailableHints(hintsForDifficulty);

    setTimeout(() => {
      const newGrid = generateGrid(newGridSize, difficulty as DifficultyLevel);
      
      setGrid(newGrid);
      setOriginalGrid(JSON.parse(JSON.stringify(newGrid)));
      
      // Generate solution
      const solvedGrid = solvePuzzle(newGrid);
      setSolution(solvedGrid);
      
      setIsRunning(true);
      setIsGameWon(false);
    }, 100);
  }, [difficulty]);
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (isPaused || isGameWon) return;
    
    // Check if this is a pre-filled cell
    if (originalGrid[row]?.[col] !== "") return;
    
    setSelectedCell([row, col]);
  };
  
  // Handle color selection
  const handleColorSelect = (color: string) => {
    if (isPaused || isGameWon) return;
    setSelectedColor(color);
    
    if (selectedCell) {
      handleColorChange(color);
    }
  };
  
  // Change the color of the selected cell
  const handleColorChange = (color: string) => {
    if (!selectedCell || isPaused || isGameWon) return;
    
    const [row, col] = selectedCell;
    
    // Check if this is a pre-filled cell
    if (originalGrid[row]?.[col] !== "") return;
    
    const newGrid = [...grid];
    newGrid[row][col] = color;
    setGrid(newGrid);
    
    // Check for win
    if (checkWin(newGrid)) {
      handleWin();
    }
  };
  
  // Handle game win
  const handleWin = () => {
    setIsGameWon(true);
    setIsRunning(false);
    
    // Calculate score based on time and difficulty
    let baseScore = 1000;
    if (difficulty === 'medium') baseScore = 2000;
    if (difficulty === 'hard') baseScore = 3000;
    
    const timeBonus = Math.max(0, baseScore - (time * 2));
    const hintPenalty = (hintCount - availableHints) * 200;
    const finalScore = Math.max(0, baseScore + timeBonus - hintPenalty);
    
    // Show win message with score
    toast.success(
      <div className="flex flex-col gap-1">
        <p className="font-bold">Puzzle Completed! 🎉</p>
        <p>Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
        <p className="text-xl font-bold">Score: {finalScore}</p>
      </div>
    );
    
    // Save score if user is logged in
    if (user) {
      // To implement: save score to database
      console.log('Saving score:', { userId: user.id, difficulty, time, score: finalScore });
    }
  };
  
  // Use a hint
  const handleUseHint = () => {
    if (availableHints <= 0 || !selectedCell) {
      toast.error("No hints available or no cell selected");
      return;
    }
    
    const [row, col] = selectedCell;
    
    // Check if this cell is already filled
    if (grid[row][col] !== "") {
      toast.info("This cell already has a color");
      return;
    }
    
    // Get the correct color from the solution
    const correctColor = solution[row][col];
    
    // Update the grid
    const newGrid = [...grid];
    newGrid[row][col] = correctColor;
    setGrid(newGrid);
    
    // Deduct a hint
    setAvailableHints(prev => prev - 1);
    
    // Show toast
    toast.info("Hint used! The correct color has been placed.");
    
    // Check for win
    if (checkWin(newGrid)) {
      handleWin();
    }
  };
  
  // Toggle pause
  const togglePause = () => {
    setIsPaused(prev => !prev);
    setIsRunning(prev => !prev);
    setShowPauseOverlay(prev => !prev);
  };
  
  // Change difficulty
  const changeDifficulty = (newDifficulty: DifficultyLevel) => {
    if (newDifficulty === "medium") {
      // Check if medium is enabled yet
      setShowMediumWarning(true);
      return;
    }
    
    // Update URL parameter
    setSearchParams({ difficulty: newDifficulty });
    
    setDifficulty(newDifficulty);
    setIsPaused(false);
    setShowPauseOverlay(false);
    
    // The useEffect will trigger startNewGame()
  };
  
  // Render loading state
  if (grid.length === 0 || originalGrid.length === 0) {
    return (
      <PageWrapper loadingColor="purple" animationSrc="/animations/game-loading.lottie">
        <div className="flex items-center justify-center h-screen">
          <p>Loading game...</p>
        </div>
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper
      key={animationKey}
      loadingTitle="Game Loading"
      loadingDescription="Generating your puzzle..."
      loadingColor="purple"
      animationSrc="/animations/game-loading.lottie"
    >
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-8">
        {/* Game Header */}
        <div className="container mx-auto max-w-xl mb-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-center">Color Grid Logic</h1>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                    <span className="sr-only">Game Information</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Color Grid Logic - Rules</DialogTitle>
                    <DialogDescription className="pt-4">
                      <div className="space-y-4">
                        <p>Fill the grid with colors following these rules:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Each row must contain each color exactly once</li>
                          <li>Each column must contain each color exactly once</li>
                          <li>Each region must contain each color exactly once</li>
                        </ul>
                        <p>Use logic to deduce the correct placement of colors.</p>
                        <div className="mt-4 pt-2 border-t">
                          <h4 className="font-bold mb-2">Keyboard Controls</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Arrow keys: Navigate the grid</li>
                            <li>1-9: Select colors</li>
                            <li>Delete/Backspace: Clear cell</li>
                          </ul>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" size="icon" onClick={togglePause}>
                <PauseCircle className="h-5 w-5" />
                <span className="sr-only">Pause</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Game Info Bar */}
        <div className="container mx-auto max-w-xl mb-6">
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            {/* Difficulty */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Level</span>
              <Badge variant="outline" className="capitalize">
                {difficulty}
              </Badge>
            </div>
            
            {/* Timer */}
            <GameTimer time={time} setTime={setTime} isRunning={isRunning} />
            
            {/* Hints */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Hints</span>
              <div className="flex items-center gap-1">
                <Badge variant="secondary">{availableHints}</Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleUseHint}
                  disabled={availableHints <= 0 || !selectedCell || isPaused || isGameWon}
                  className="h-7 w-7 p-0"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Use hint</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game Board */}
        <div className="container mx-auto max-w-xl mb-8">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ColorGrid
                grid={grid}
                originalGrid={originalGrid}
                gridSize={newGridSize}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Color Palette */}
        <div className="container mx-auto max-w-xl mb-8">
          <ColorPalette
            colors={colors}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
        </div>
        
        {/* Game Controls */}
        <div className="container mx-auto max-w-xl mb-8">
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={startNewGame} 
              className="flex items-center gap-1"
              disabled={isPaused}
            >
              <RefreshCw className="h-4 w-4" />
              New Game
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  disabled={isPaused}
                >
                  <Award className="h-4 w-4" />
                  Achievements
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <AchievementsDialog />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Difficulty Selection */}
        <div className="container mx-auto max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Select Difficulty</CardTitle>
              <CardDescription>
                Choose a difficulty level for your next game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue={difficulty} 
                onValueChange={(value) => changeDifficulty(value as DifficultyLevel)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="easy">Easy</TabsTrigger>
                  <TabsTrigger value="medium" disabled>Medium (WIP)</TabsTrigger>
                  <TabsTrigger value="hard">Hard</TabsTrigger>
                </TabsList>
                <TabsContent value="easy" className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded flex items-center justify-center">
                      <div className="grid grid-cols-2 grid-rows-2 gap-1">
                        <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                        <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                        <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                        <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">4×4 Grid</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        4 colors, 4 regions, perfect for beginners
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medium" className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded flex items-center justify-center opacity-50">
                      <div className="grid grid-cols-3 grid-rows-3 gap-0.5">
                        {[...Array(7)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-3 h-3 ${['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'][i]} rounded-sm`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Coming Soon</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Medium difficulty 7×7 grid is under development
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="hard" className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded flex items-center justify-center">
                      <div className="grid grid-cols-3 grid-rows-3 gap-0.5">
                        {[...Array(9)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-3 h-3 ${['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400', 'bg-indigo-400', 'bg-teal-400'][i]} rounded-sm`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">9×9 Grid</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        9 colors, 9 regions, challenging puzzles
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Tutorial Dialog */}
        <TutorialMode
          open={showTutorial}
          onOpenChange={setShowTutorial}
        />
        
        {/* Pause Overlay */}
        {showPauseOverlay && (
          <PauseOverlay 
            onResume={togglePause} 
            onNewGame={startNewGame}
            onGoHome={() => navigate('/')}
          />
        )}
        
        {/* Medium difficulty warning */}
        <AlertDialog open={showMediumWarning} onOpenChange={setShowMediumWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Medium Difficulty Coming Soon
              </AlertDialogTitle>
              <AlertDialogDescription>
                The 7×7 puzzle mode is currently under development and not yet available.
                Please try the Easy (4×4) or Hard (9×9) puzzles instead.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowMediumWarning(false)}>
                Got it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageWrapper>
  );
};

export default Game;
