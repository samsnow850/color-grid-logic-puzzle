import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ColorGrid from "@/components/game/ColorGrid";
import ColorPalette from "@/components/game/ColorPalette";
import { DifficultyLevel, generatePuzzle, checkWinCondition } from "@/lib/gameLogic";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { scrollToTop } from "@/lib/utils";
import { createHistory, saveHistory, undo, redo } from '@/lib/historySystem';
import { defaultAchievements, unlockAchievement, updateAchievementProgress, saveAchievements, loadAchievements } from '@/lib/achievements';
import TutorialDialog from '@/components/game/TutorialDialog';
import PauseOverlay from '@/components/game/PauseOverlay';
import AchievementsDialog from '@/components/game/AchievementsDialog';
import Logo from '@/components/Logo';
import { Undo, Redo, Lightbulb, Trophy, Pause, Play, Info } from "lucide-react";
import PageWrapper from '@/components/PageWrapper';

const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [showTitleScreen, setShowTitleScreen] = useState(true);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const [showTutorialDialog, setShowTutorialDialog] = useState(false);
  const [showAchievementsDialog, setShowAchievementsDialog] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState<string[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [colors, setColors] = useState<string[]>([
    "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400"
  ]);
  const [error, setError] = useState<string | null>(null);
  const [previewGrid, setPreviewGrid] = useState<JSX.Element | null>(null);
  
  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // History state
  const [gridHistory, setGridHistory] = useState(createHistory([[]]));
  
  // Hints state
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  // Achievements state
  const [achievements, setAchievements] = useState(loadAchievements());

  // Initialize with preview colors based on difficulty
  useEffect(() => {
    let colorCount = 4;
    let gridSizeValue = 4;
    let previewColors: string[] = [];
    
    if (difficulty === "medium") {
      colorCount = 6;
      gridSizeValue = 6;
      previewColors = [
        "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
        "bg-purple-400", "bg-pink-400"
      ];
    } else if (difficulty === "hard") {
      colorCount = 9;
      gridSizeValue = 9;
      previewColors = [
        "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
        "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", "bg-teal-400"
      ];
    } else {
      gridSizeValue = 4;
      previewColors = [
        "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400"
      ];
    }
    
    setColors(previewColors);
    
    // Create preview grid
    const previewElements = [];
    for (let i = 0; i < gridSizeValue * gridSizeValue; i++) {
      const colorIndex = i % colorCount;
      previewElements.push(
        <div 
          key={`preview-${i}`} 
          className={`rounded-md ${previewColors[colorIndex]}`}
          style={{
            width: gridSizeValue === 9 ? "20px" : gridSizeValue === 6 ? "30px" : "40px",
            height: gridSizeValue === 9 ? "20px" : gridSizeValue === 6 ? "30px" : "40px",
          }}
        />
      );
    }
    
    setPreviewGrid(
      <div 
        className="grid gap-1 p-2 bg-gray-100 rounded-lg mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridSizeValue}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSizeValue}, minmax(0, 1fr))`,
          width: gridSizeValue === 9 ? "210px" : gridSizeValue === 6 ? "210px" : "180px",
          height: gridSizeValue === 9 ? "210px" : gridSizeValue === 6 ? "210px" : "180px",
        }}
      >
        {previewElements}
      </div>
    );
    
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 59) {
            setMinutes(prevMinutes => {
              if (prevMinutes === 59) {
                setHours(prevHours => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const startNewGame = () => {
    let newGridSize = 4;
    let colorCount = 4;
    
    try {
      setError(null);
      scrollToTop();
      
      if (difficulty === "medium") {
        newGridSize = 6;
        colorCount = 6;
      } else if (difficulty === "hard") {
        newGridSize = 9;
        colorCount = 9;
      }
      
      setGridSize(newGridSize);
      
      // Generate colors
      const generatedColors = [
        "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
        "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", "bg-teal-400"
      ].slice(0, colorCount);
      
      setColors(generatedColors);
      
      const { puzzle, solution } = generatePuzzle(newGridSize, difficulty);
      setGrid(puzzle);
      setOriginalGrid(JSON.parse(JSON.stringify(puzzle)));
      setGridHistory(createHistory(JSON.parse(JSON.stringify(puzzle))));
      
      // Reset timer
      setSeconds(0);
      setMinutes(0);
      setHours(0);
      setIsTimerRunning(true);
      setIsPaused(false);
      
      // Reset hints
      setHintsRemaining(3);
      setHintsUsed(0);
      
      setShowTitleScreen(false);
      setShowGameOverScreen(false);
      setSelectedCell(null);
    } catch (err) {
      console.error("Error starting game:", err);
      setError("There was a problem starting the game. Please try a different difficulty level.");
      // Default to easy mode if an error occurs
      setDifficulty("easy");
    }
  };

  const handleCellClick = (row: number, col: number) => {
    // Don't allow clicking on pre-filled cells
    if (originalGrid[row][col] !== "") {
      return;
    }
    
    // Don't allow clicking when paused
    if (isPaused) {
      return;
    }
    
    setSelectedCell([row, col]);
  };

  const handleColorSelect = (color: string) => {
    if (!selectedCell || isPaused) return;
    
    const [row, col] = selectedCell;
    const newGrid = [...grid];
    newGrid[row][col] = color;
    setGrid(newGrid);
    
    // Update grid history for undo/redo
    setGridHistory(saveHistory(gridHistory, JSON.parse(JSON.stringify(newGrid))));
    
    // Check if the puzzle is solved
    if (checkWinCondition(newGrid)) {
      handleGameWin();
    }
  };
  
  const handleGameWin = () => {
    setGameWon(true);
    setShowGameOverScreen(true);
    setIsTimerRunning(false);
    
    // Update achievements
    let updatedAchievements = [...achievements];
    
    // First victory achievement
    if (!achievements.find(a => a.id === "first_victory")?.unlocked) {
      updatedAchievements = unlockAchievement(updatedAchievements, "first_victory");
    }
    
    // Difficulty-based achievements
    if (difficulty === "easy") {
      updatedAchievements = updateAchievementProgress(updatedAchievements, "easy_master");
    } else if (difficulty === "hard") {
      updatedAchievements = updateAchievementProgress(updatedAchievements, "hard_master");
    }
    
    // Speed demon achievement (under 2 minutes)
    if (hours === 0 && minutes < 2) {
      updatedAchievements = unlockAchievement(updatedAchievements, "speed_demon");
    }
    
    // No hints achievement
    if (hintsUsed === 0) {
      updatedAchievements = unlockAchievement(updatedAchievements, "no_hints");
    }
    
    // If it's a daily puzzle
    if (id === "daily") {
      updatedAchievements = updateAchievementProgress(updatedAchievements, "daily_challenger");
    }
    
    setAchievements(updatedAchievements);
    saveAchievements(updatedAchievements);
    
    // Only show achievements dialog for logged in users
    if (user && !showAchievementsDialog) {
      setTimeout(() => {
        setShowAchievementsDialog(true);
      }, 1500);
    }
  };

  const handleReset = () => {
    if (isPaused) return;
    
    setGrid(JSON.parse(JSON.stringify(originalGrid)));
    setGridHistory(createHistory(JSON.parse(JSON.stringify(originalGrid))));
    setSelectedCell(null);
  };

  const handleGiveUp = () => {
    if (isPaused) return;
    
    setGameWon(false);
    setShowGameOverScreen(true);
    setIsTimerRunning(false);
  };
  
  const handleUndo = () => {
    if (isPaused) return;
    
    const newHistory = undo(gridHistory);
    if (newHistory !== gridHistory) {
      setGridHistory(newHistory);
      setGrid(JSON.parse(JSON.stringify(newHistory.present)));
    }
  };
  
  const handleRedo = () => {
    if (isPaused) return;
    
    const newHistory = redo(gridHistory);
    if (newHistory !== gridHistory) {
      setGridHistory(newHistory);
      setGrid(JSON.parse(JSON.stringify(newHistory.present)));
    }
  };
  
  const handleHint = () => {
    if (isPaused || hintsRemaining <= 0) return;
    
    // Find all empty cells
    const emptyCells: [number, number][] = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "") {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });
    
    if (emptyCells.length === 0) {
      toast.info("No empty cells to provide a hint for!");
      return;
    }
    
    // Pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    
    // Get the correct color from the solution
    const { solution } = generatePuzzle(gridSize, difficulty);
    const correctColor = solution[row][col];
    
    // Update the grid
    const newGrid = [...grid];
    newGrid[row][col] = correctColor;
    setGrid(newGrid);
    
    // Update grid history
    setGridHistory(saveHistory(gridHistory, JSON.parse(JSON.stringify(newGrid))));
    
    // Update hints state
    setHintsRemaining(hintsRemaining - 1);
    setHintsUsed(hintsUsed + 1);
    
    // Check if the puzzle is solved
    if (checkWinCondition(newGrid)) {
      handleGameWin();
    }
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
    setIsTimerRunning(isPaused);
  };

  const formatTime = () => {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell || isPaused) return;
    
    const keyNum = parseInt(e.key);
    if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= colors.length) {
      handleColorSelect(colors[keyNum - 1]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, colors, isPaused]);
  
  // Handle the "daily" puzzle case
  useEffect(() => {
    if (id === "daily" && !showTitleScreen) {
      // We only need to check if the user is logged in for daily puzzles
      if (!user) {
        toast.error("You need to be logged in to play the daily puzzle.");
        navigate("/auth");
        return;
      }
      
      // Generate a daily puzzle based on the current date
      const today = new Date();
      const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const seed = `daily-${dateString}`;
      
      try {
        // Use the date as a seed for the puzzle
        const { puzzle, solution } = generatePuzzle(9, "hard", seed);
        setGrid(puzzle);
        setOriginalGrid(JSON.parse(JSON.stringify(puzzle)));
        setGridHistory(createHistory(JSON.parse(JSON.stringify(puzzle))));
        setGridSize(9);
        setDifficulty("hard");
        
        // Set colors for hard difficulty
        const hardColors = [
          "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
          "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", "bg-teal-400"
        ];
        setColors(hardColors);
        
        // Start the timer
        setSeconds(0);
        setMinutes(0);
        setHours(0);
        setIsTimerRunning(true);
        
        // Reset hints
        setHintsRemaining(3);
        setHintsUsed(0);
      } catch (err) {
        console.error("Error generating daily puzzle:", err);
        toast.error("Failed to generate the daily puzzle. Please try again later.");
        navigate("/game");
      }
    }
  }, [id, showTitleScreen, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background to-purple-50">
        {showTitleScreen ? (
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-6 flex justify-center">
              <Logo size="lg" />
            </div>
            
            <h1 className="text-3xl font-bold mb-6 text-center">Color Grid Logic</h1>
            <p className="mb-6 text-center text-muted-foreground">
              Fill the grid with colors following Sudoku-style rules.
            </p>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Select Difficulty:</h2>
              <RadioGroup value={difficulty} onValueChange={(val) => setDifficulty(val as DifficultyLevel)}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy (4×4)</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2 opacity-50">
                  <RadioGroupItem value="medium" id="medium" disabled />
                  <Label htmlFor="medium">Medium (6×6) - Out of Service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard (9×9)</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Preview of the selected grid */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 text-center text-muted-foreground">Preview:</h3>
              <div className="flex justify-center">
                {previewGrid}
              </div>
            </div>
            
            <div className="flex gap-2 mb-6">
              <Button 
                variant="outline"
                onClick={() => setShowTutorialDialog(true)}
                className="flex-1"
              >
                <Info className="w-4 h-4 mr-2" />
                How to Play
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowAchievementsDialog(true)}
                className="flex-1"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700" 
              size="lg"
              onClick={startNewGame}
            >
              Start Game
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">{id === 'daily' ? 'Daily Puzzle' : 'Color Grid Logic'}</h1>
              <div className="flex items-center gap-2">
                <div className="bg-white px-3 py-1 rounded-md shadow font-mono">
                  {formatTime()}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePause}
                  className="flex-shrink-0"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-full md:w-auto">
                  <div className="mb-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleUndo}
                            disabled={gridHistory.past.length === 0 || isPaused}
                          >
                            <Undo className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRedo}
                            disabled={gridHistory.future.length === 0 || isPaused}
                          >
                            <Redo className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={isPaused}
                          >
                            Reset
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reset the puzzle</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={handleGiveUp}
                            disabled={isPaused}
                          >
                            Give Up
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Give up and end the game</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <ColorGrid 
                    grid={grid}
                    originalGrid={originalGrid}
                    gridSize={gridSize}
                    selectedCell={selectedCell}
                    onCellClick={handleCellClick}
                  />
                </div>

                <div className="w-full md:w-auto">
                  <h2 className="text-lg font-medium mb-4">Color Palette</h2>
                  <ColorPalette 
                    colors={colors} 
                    onColorSelect={handleColorSelect}
                    hintsRemaining={hintsRemaining}
                    onHintRequest={handleHint}
                  />
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-4">Instructions</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Click on an empty cell to select it</li>
                      <li>Click on a color or press 1-{colors.length} to place it</li>
                      <li>Each row, column, and region must contain each color exactly once</li>
                      <li>Use the hint button if you're stuck (limited hints per game)</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTutorialDialog(true)}
                      className="w-full"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      How to Play
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Game Over Dialog */}
      <Dialog open={showGameOverScreen} onOpenChange={setShowGameOverScreen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {gameWon ? "Puzzle Solved!" : "Puzzle Unfinished"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {gameWon ? (
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Congratulations! You've successfully solved the puzzle.
                </p>
                <p className="font-medium">
                  Time: {formatTime()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Hints used: {hintsUsed} of 3
                </p>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Would you like to try a new puzzle?
              </p>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={startNewGame}
            >
              {gameWon ? "Play Again" : "New Puzzle"}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowGameOverScreen(false);
                setShowTitleScreen(true);
                scrollToTop();
              }}
            >
              Main Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tutorial Dialog */}
      <TutorialDialog 
        open={showTutorialDialog} 
        onOpenChange={setShowTutorialDialog}
      />
      
      {/* Achievements Dialog */}
      <AchievementsDialog 
        open={showAchievementsDialog} 
        onOpenChange={setShowAchievementsDialog}
        achievements={achievements}
      />
      
      {/* Pause Overlay */}
      {isPaused && <PauseOverlay onResume={togglePause} />}
      
      <Footer />
    </div>
  );
};

export default Game;
