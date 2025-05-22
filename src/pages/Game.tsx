import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ColorGrid from "@/components/game/ColorGrid";
import ColorPalette from "@/components/game/ColorPalette";
import GameTimer from "@/components/game/GameTimer";
import PauseOverlay from "@/components/game/PauseOverlay";
import AchievementDialog from "@/components/game/AchievementDialog";
import { DifficultyLevel, generatePuzzle, checkWinCondition } from "@/lib/gameLogic";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Info, Trophy, ChevronRight, HelpCircle, Sparkles 
} from "lucide-react";
import { scrollToTop } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { saveGameResult } from "@/lib/gameUtils";
import { Link } from "react-router-dom";
import { useAchievements } from "@/hooks/useAchievements";
import { Achievement } from "@/lib/achievements";

const Game = () => {
  const { user } = useAuth();
  const { achievements, refresh: refreshAchievements } = useAchievements();
  
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [showTitleScreen, setShowTitleScreen] = useState(true);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const [showTutorialScreen, setShowTutorialScreen] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState<string[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [colors, setColors] = useState<string[]>([
    "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400"
  ]);
  const [error, setError] = useState<string | null>(null);
  const [previewGrid, setPreviewGrid] = useState<JSX.Element | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [showHintConfirm, setShowHintConfirm] = useState(false);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);

  // Initialize with preview colors based on difficulty
  useEffect(() => {
    let colorCount = 4;
    let gridSizeValue = 4;
    let previewColors: string[] = [
      "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400"
    ];
    
    if (difficulty === "medium") {
      colorCount = 4;
      gridSizeValue = 4;
    } else if (difficulty === "hard") {
      colorCount = 9;
      gridSizeValue = 9;
      previewColors = [
        "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
        "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", "bg-teal-400"
      ];
    }
    
    setColors(previewColors.slice(0, colorCount));
    
    // Create preview grid with actual colored cells
    const previewElements = [];
    for (let i = 0; i < gridSizeValue; i++) {
      for (let j = 0; j < gridSizeValue; j++) {
        // Calculate region boundaries for borders
        const regionSize = Math.sqrt(gridSizeValue);
        const isTopEdge = i % regionSize === 0;
        const isLeftEdge = j % regionSize === 0;
        const isBottomEdge = i === gridSizeValue - 1;
        const isRightEdge = j === gridSizeValue - 1;
        
        // Assign colors in a pattern to make it look like a puzzle
        const colorIndex = (i + j) % colorCount;
        
        previewElements.push(
          <div 
            key={`preview-${i}-${j}`}
            className={`${previewColors[colorIndex]} rounded-sm shadow-sm
              ${isTopEdge ? "border-t-2 border-gray-500" : ""}
              ${isLeftEdge ? "border-l-2 border-gray-500" : ""}
              ${isBottomEdge ? "border-b-2 border-gray-500" : ""}
              ${isRightEdge ? "border-r-2 border-gray-500" : ""}`
            }
          >
            {(i + j) % 3 === 0 && (
              <div className="w-2 h-2 bg-white rounded-full mx-auto my-auto"></div>
            )}
          </div>
        );
      }
    }
    
    setPreviewGrid(
      <div 
        className="grid gap-1 p-2 bg-neutral-100 dark:bg-gray-700 rounded-lg mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridSizeValue}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSizeValue}, minmax(0, 1fr))`,
          width: gridSizeValue === 9 ? "210px" : "180px",
          height: gridSizeValue === 9 ? "210px" : "180px",
        }}
      >
        {previewElements}
      </div>
    );
    
  }, [difficulty]);

  const startNewGame = () => {
    let newGridSize = 4;
    let colorCount = 4;
    
    try {
      setError(null);
      scrollToTop();
      
      // For medium difficulty, use same size as easy
      if (difficulty === "medium") {
        newGridSize = 4;
        colorCount = 4;
        // Here we'd normally set medium difficulty params, but it's out of service
        toast.info("Medium difficulty is currently unavailable. Starting an Easy puzzle instead.");
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
      
      // Generate a new puzzle
      const actualDifficulty = difficulty === "medium" ? "easy" : difficulty;
      const { puzzle, solution } = generatePuzzle(newGridSize, actualDifficulty);
      setGrid(puzzle);
      setOriginalGrid(JSON.parse(JSON.stringify(puzzle)));
      
      // Reset game state
      setShowTitleScreen(false);
      setShowGameOverScreen(false);
      setIsTimerRunning(true);
      setIsPaused(false);
      setTimeTaken(0);
      setErrorCount(0);
      setUsedHint(false);
      setSelectedCell(null);
      setGameWon(false);
      setFinalScore(0);
    } catch (err) {
      console.error("Error starting game:", err);
      setError("There was a problem starting the game. Please try a different difficulty level.");
      // Default to easy mode if an error occurs
      setDifficulty("easy");
    }
  };

  const handleCellClick = (row: number, col: number) => {
    // Don't allow clicking if paused
    if (isPaused) return;
    
    // Don't allow clicking on pre-filled cells
    if (originalGrid[row][col] !== "") {
      return;
    }
    setSelectedCell([row, col]);
  };

  const handleColorSelect = (color: string) => {
    if (!selectedCell || isPaused) return;
    
    const [row, col] = selectedCell;
    const newGrid = [...grid];
    
    // Check if this is a valid move
    if (newGrid[row][col] === color) return; // No change
    
    // Apply the color
    newGrid[row][col] = color;
    setGrid(newGrid);
    
    // Check if the puzzle is solved
    if (checkWinCondition(newGrid)) {
      handleGameWon();
    }
  };

  const handleGameWon = async () => {
    // Stop the timer
    setIsTimerRunning(false);
    setGameWon(true);
    
    if (user) {
      // Calculate and save score
      const score = await saveGameResult(
        user.id,
        difficulty === "medium" ? "easy" : difficulty, 
        timeTaken,
        errorCount,
        true,
        usedHint
      );
      setFinalScore(score);
      
      // Refresh achievements to show any newly unlocked ones
      await refreshAchievements();
      
      // Check if any new achievements were unlocked
      setTimeout(() => {
        const newlyUnlocked = achievements.find(a => a.achieved && 
          (a.type === "first_victory" || a.type === "speed_demon" || 
           a.type === "no_help" || 
           (a.type === "easy_master" && difficulty === "easy") ||
           (a.type === "hard_master" && difficulty === "hard")));
           
        if (newlyUnlocked) {
          setLatestAchievement(newlyUnlocked);
          setShowAchievementDialog(true);
        } else {
          setShowGameOverScreen(true);
        }
      }, 500);
    } else {
      // If not logged in, just show game over
      setShowGameOverScreen(true);
    }
  };

  const handleReset = () => {
    if (isPaused) return;
    
    setGrid(JSON.parse(JSON.stringify(originalGrid)));
    setSelectedCell(null);
    // Count as an error
    setErrorCount(prev => prev + 1);
    
    // Show a toast when user resets
    toast.info("Puzzle has been reset");
  };

  const handleGiveUp = () => {
    if (isPaused) return;
    
    setGameWon(false);
    setShowGameOverScreen(true);
    setIsTimerRunning(false);
    
    // Record an incomplete game if the user is logged in
    if (user) {
      saveGameResult(
        user.id,
        difficulty === "medium" ? "easy" : difficulty,
        timeTaken,
        errorCount,
        false,
        usedHint
      );
    }
  };
  
  const provideHint = () => {
    if (!selectedCell || isPaused) return;
    
    setShowHintConfirm(false);
    setUsedHint(true);
    
    // We'd normally provide a real hint here, but for now let's just
    // give a generic message
    toast("Try looking for rows or columns that are almost complete", {
      description: "Focus on cells that have fewer possible options"
    });
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

  const handlePauseGame = () => {
    setIsTimerRunning(false);
    setIsPaused(true);
  };
  
  const handleResumeGame = () => {
    setIsTimerRunning(true);
    setIsPaused(false);
  };
  
  const handleTimerUpdate = (seconds: number) => {
    setTimeTaken(seconds);
  };

  // Handle showing game over screen from achievement dialog
  const handleAchievementContinue = () => {
    setShowGameOverScreen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-purple-50">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {showTitleScreen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">Color Grid Logic</h1>
            <p className="mb-6 text-center text-muted-foreground">
              Fill the grid with colors following Sudoku-style rules.
            </p>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Select Difficulty:</h2>
              <RadioGroup value={difficulty} onValueChange={(val) => setDifficulty(val as DifficultyLevel)}>
                <div className="flex items-center space-x-2 mb-2 py-2 hover:bg-gray-50 rounded-lg px-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy (4×4)</Label>
                </div>
                
                <div className="flex items-center space-x-2 mb-2 py-2 bg-gray-50 rounded-lg px-2 opacity-70">
                  <RadioGroupItem value="medium" id="medium" disabled />
                  <Label htmlFor="medium" className="flex items-center">
                    Medium (4×4 - More challenging)
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Out of Service
                    </span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 py-2 hover:bg-gray-50 rounded-lg px-2">
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
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg" 
                size="lg"
                onClick={startNewGame}
              >
                Start Game
              </Button>
              
              <Button
                variant="outline"
                className="w-full rounded-lg"
                onClick={() => setShowTutorialScreen(true)}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                How to Play
              </Button>
            </div>
            
            {!user && (
              <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-muted-foreground">
                <p>Sign in to track your progress and achievements</p>
                <Button variant="link" size="sm" asChild>
                  <Link to="/auth">Sign in now</Link>
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Color Grid Logic</h1>
              
              {!showTitleScreen && !showGameOverScreen && (
                <GameTimer 
                  isRunning={isTimerRunning} 
                  onPause={handlePauseGame} 
                  onResume={handleResumeGame}
                  onUpdate={handleTimerUpdate}
                />
              )}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex flex-col items-center gap-4">
                  <ColorGrid 
                    grid={grid}
                    originalGrid={originalGrid}
                    gridSize={gridSize}
                    selectedCell={selectedCell}
                    onCellClick={handleCellClick}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={isPaused}
                      className="rounded-lg"
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-lg"
                      onClick={() => setShowHintConfirm(true)}
                      disabled={isPaused || usedHint}
                    >
                      {usedHint ? "Hint Used" : "Get Hint"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGiveUp}
                      disabled={isPaused}
                      className="rounded-lg"
                    >
                      Give Up
                    </Button>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <h2 className="text-lg font-medium mb-3 text-center md:text-left">Color Palette</h2>
                  <ColorPalette colors={colors} onColorSelect={handleColorSelect} />
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-4 text-center md:text-left">Instructions</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Click on an empty cell to select it</li>
                      <li>Click on a color or press 1-{colors.length} to place it</li>
                      <li>Each row, column, and region must contain each color exactly once</li>
                      <li>Press pause to take a break and hide the puzzle</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Pause Overlay */}
      {isPaused && <PauseOverlay onResume={handleResumeGame} />}
      
      {/* Game Over Dialog */}
      <Dialog open={showGameOverScreen} onOpenChange={setShowGameOverScreen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {gameWon ? "Puzzle Solved!" : "Puzzle Unfinished"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {gameWon ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-muted-foreground">
                  Congratulations! You've successfully solved the puzzle.
                </p>
                {user && finalScore > 0 && (
                  <div className="bg-primary/5 py-3 px-4 rounded-lg">
                    <p className="font-medium">Your Score</p>
                    <p className="text-3xl font-bold text-primary">{finalScore}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Try a new puzzle?
              </p>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              onClick={startNewGame}
            >
              {gameWon ? "Play Again" : "New Puzzle"}
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto rounded-lg"
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
      <Dialog open={showTutorialScreen} onOpenChange={setShowTutorialScreen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">How to Play</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <p className="text-muted-foreground">
              Color Grid Logic is a puzzle game inspired by Sudoku, but with colors instead of numbers.
            </p>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Game Rules:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Fill the grid with colors so that each row, column, and region contains each color exactly once</li>
                <li>Some cells are pre-filled to get you started</li>
                <li>Use logic to determine where each color should go</li>
                <li>The puzzle is complete when all cells are filled correctly</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">How to Play:</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Click on an empty cell to select it</li>
                <li>Click on a color from the palette or use number keys (1-4 for Easy, 1-9 for Hard) to place it</li>
                <li>If you make a mistake, you can reset the puzzle or give up</li>
                <li>The timer keeps track of how long you take to solve the puzzle</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Tips:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Look for rows, columns, or regions that are almost complete</li>
                <li>If a color can only go in one place in a row, column, or region, it must go there</li>
                <li>Use process of elimination to narrow down possibilities</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              className="rounded-lg"
              onClick={() => setShowTutorialScreen(false)}
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hint Confirmation Dialog */}
      <Dialog open={showHintConfirm} onOpenChange={setShowHintConfirm}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Use a Hint?</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-muted-foreground">
              Using a hint will make you ineligible for the "No Help Needed" achievement.
              Are you sure you want to use a hint?
            </p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-lg"
              onClick={() => setShowHintConfirm(false)}
            >
              Cancel
            </Button>
            <Button 
              className="w-full sm:w-auto rounded-lg"
              onClick={provideHint}
            >
              Use Hint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Achievement Dialog */}
      <AchievementDialog 
        open={showAchievementDialog} 
        onOpenChange={setShowAchievementDialog} 
        achievement={latestAchievement}
        onContinue={handleAchievementContinue} 
      />
      
      <Footer />
    </div>
  );
};

export default Game;
