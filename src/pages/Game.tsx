
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
import PageWrapper from "@/components/PageWrapper";
import ColorGrid from "@/components/game/ColorGrid";
import ColorPalette from "@/components/game/ColorPalette";
import GameTimer from "@/components/game/GameTimer";
import PauseOverlay from "@/components/game/PauseOverlay";
import HintSystem from "@/components/game/HintSystem";
import AchievementsDialog from "@/components/game/AchievementsDialog";
import TutorialMode from "@/components/game/TutorialMode";
import { DifficultyLevel, generatePuzzle, checkWinCondition } from "@/lib/gameLogic";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Info, 
  Award, 
  Book, 
  Undo, 
  Redo,
  Trophy
} from "lucide-react";
import { scrollToTop } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  createHistory, 
  recordHistory, 
  undo, 
  redo,
  canUndo,
  canRedo,
  GridHistory
} from "@/lib/historySystem";
import { 
  checkPuzzleCompletionAchievements, 
  checkNoHintAchievement
} from "@/lib/achievementSystem";

const Game = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [showTitleScreen, setShowTitleScreen] = useState(true);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState<string[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<string[][]>([]);
  const [solution, setSolution] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [colors, setColors] = useState<string[]>([
    "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400"
  ]);
  const [error, setError] = useState<string | null>(null);
  const [previewGrid, setPreviewGrid] = useState<JSX.Element | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showMediumWarning, setShowMediumWarning] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gridHistory, setGridHistory] = useState<GridHistory<string> | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [usedHint, setUsedHint] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Initialize with preview colors based on difficulty
  useEffect(() => {
    let colorCount = 4;
    let gridSizeValue = 4;
    let previewColors: string[] = [
      "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400"
    ];
    
    if (difficulty === "medium") {
      colorCount = 7; // Changed to 7 for medium difficulty
      gridSizeValue = 7; // Changed to 7 for medium difficulty
      previewColors = [
        "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
        "bg-purple-400", "bg-pink-400", "bg-orange-400"
      ];
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
        let regionSize = Math.sqrt(gridSizeValue);
        let isTopEdge = i % regionSize === 0;
        let isLeftEdge = j % regionSize === 0;
        
        // Special case for 7x7 which doesn't have clean square regions
        if (gridSizeValue === 7) {
          // Define custom region boundaries for 7x7
          const isInTopRegion = i < 3;
          const isInMiddleRegion = i >= 3 && i < 5;
          const isInLeftRegion = j < 3;
          
          isTopEdge = i === 0 || i === 3 || i === 5;
          isLeftEdge = j === 0 || j === 3;
        }
        
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
          width: gridSizeValue === 9 ? "210px" : gridSizeValue === 7 ? "190px" : "160px",
          height: gridSizeValue === 9 ? "210px" : gridSizeValue === 7 ? "190px" : "160px",
        }}
      >
        {previewElements}
      </div>
    );
    
  }, [difficulty]);

  const startNewGame = () => {
    let newGridSize = 4;
    let colorCount = 4;
    let hintCount = 3;
    
    try {
      setError(null);
      scrollToTop();
      
      if (difficulty === "medium") {
        // Show medium difficulty warning
        setShowMediumWarning(true);
        return; // Don't actually start the game for medium difficulty
      } else if (difficulty === "hard") {
        newGridSize = 9;
        colorCount = 9;
        hintCount = 5; // More hints for hard difficulty
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
      setSolution(solution);
      
      // Initialize undo/redo history
      setGridHistory(createHistory(puzzle));
      
      // Reset game state
      setShowTitleScreen(false);
      setShowGameOverScreen(false);
      setIsTimerRunning(true);
      setIsPaused(false);
      setGameTime(0);
      setHintsRemaining(hintCount);
      setUsedHint(false);
      
      toast({
        title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} puzzle started!`,
        description: "Good luck and have fun!",
      });
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
    if (!selectedCell || isPaused || !gridHistory) return;
    
    const [row, col] = selectedCell;
    const newGrid = JSON.parse(JSON.stringify(gridHistory.present));
    newGrid[row][col] = color;
    
    // Update history
    const newHistory = recordHistory(gridHistory, newGrid);
    setGridHistory(newHistory);
    
    // Update current grid
    setGrid(newGrid);
    
    // Check if the puzzle is solved
    if (checkWinCondition(newGrid)) {
      handleGameWon();
    }
  };
  
  const handleGameWon = () => {
    setGameWon(true);
    setShowGameOverScreen(true);
    setIsTimerRunning(false);
    
    if (user) {
      // Award achievements
      const achievements = checkPuzzleCompletionAchievements(
        user.id,
        difficulty,
        gameTime
      );
      
      // Award no-hint achievement if applicable
      if (!usedHint) {
        checkNoHintAchievement(user.id);
      }
      
      // Show achievement toast if any were unlocked
      const newlyUnlocked = achievements.filter(a => a.unlocked && a.date && 
        new Date(a.date).getTime() > Date.now() - 10000);
      
      if (newlyUnlocked.length > 0) {
        toast({
          title: "Achievement Unlocked!",
          description: `You've unlocked ${newlyUnlocked.length} new achievement${
            newlyUnlocked.length !== 1 ? "s" : ""
          }!`,
        });
        
        // Show achievements dialog with a slight delay
        setTimeout(() => {
          setShowAchievements(true);
        }, 1500);
      }
    }
  };

  const handleReset = () => {
    if (isPaused) return;
    
    if (gridHistory) {
      const newHistory = createHistory(JSON.parse(JSON.stringify(originalGrid)));
      setGridHistory(newHistory);
      setGrid(JSON.parse(JSON.stringify(originalGrid)));
    } else {
      setGrid(JSON.parse(JSON.stringify(originalGrid)));
    }
    
    setSelectedCell(null);
    
    toast({
      title: "Puzzle reset",
      description: "The grid has been restored to its initial state.",
    });
  };

  const handleGiveUp = () => {
    if (isPaused) return;
    
    setGameWon(false);
    setShowGameOverScreen(true);
    setIsTimerRunning(false);
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
  }, [selectedCell, colors, isPaused, gridHistory]);

  const handlePauseGame = () => {
    setIsTimerRunning(false);
    setIsPaused(true);
  };
  
  const handleResumeGame = () => {
    setIsTimerRunning(true);
    setIsPaused(false);
  };

  const handleCloseMediumWarning = () => {
    setShowMediumWarning(false);
  };
  
  const handleUndo = () => {
    if (!gridHistory || isPaused) return;
    
    if (canUndo(gridHistory)) {
      const newHistory = undo(gridHistory);
      setGridHistory(newHistory);
      setGrid(newHistory.present);
      
      // Clear selection after undo
      setSelectedCell(null);
    } else {
      toast({
        title: "Cannot undo",
        description: "No more moves to undo.",
      });
    }
  };
  
  const handleRedo = () => {
    if (!gridHistory || isPaused) return;
    
    if (canRedo(gridHistory)) {
      const newHistory = redo(gridHistory);
      setGridHistory(newHistory);
      setGrid(newHistory.present);
      
      // Clear selection after redo
      setSelectedCell(null);
    } else {
      toast({
        title: "Cannot redo",
        description: "No more moves to redo.",
      });
    }
  };
  
  const handleHintUsed = () => {
    setHintsRemaining((prev) => Math.max(0, prev - 1));
    setUsedHint(true);
  };
  
  const handleCellReveal = (row: number, col: number, value: string) => {
    if (!gridHistory) return;
    
    const newGrid = JSON.parse(JSON.stringify(gridHistory.present));
    newGrid[row][col] = value;
    
    // Update history
    const newHistory = recordHistory(gridHistory, newGrid);
    setGridHistory(newHistory);
    
    // Update current grid
    setGrid(newGrid);
    
    // Check if the puzzle is solved after hint
    if (checkWinCondition(newGrid)) {
      handleGameWon();
    }
  };
  
  // Update game time from timer component
  const handleTimeUpdate = (seconds: number) => {
    setGameTime(seconds);
  };

  return (
    <PageWrapper 
      loadingTitle="Game Loading" 
      loadingDescription="Preparing your color puzzle"
      loadingColor="green"
    >
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          {showTitleScreen ? (
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md border border-gray-200">
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
                  <div className="flex items-center space-x-2 mb-2 relative">
                    <RadioGroupItem value="medium" id="medium" disabled />
                    <Label htmlFor="medium" className="flex items-center">
                      Medium (7×7) 
                      <span className="ml-2 text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-md">
                        OUT OF SERVICE
                      </span>
                    </Label>
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
              
              <div className="flex flex-col space-y-3">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                  size="lg"
                  onClick={startNewGame}
                >
                  Start Game
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowTutorial(true)}
                >
                  <Book className="mr-2 h-4 w-4" />
                  How to Play
                </Button>
                
                {user && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAchievements(true)}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    View Achievements
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl">
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-2xl font-bold">Color Grid Logic</h1>
                
                <div className="flex flex-wrap items-center gap-2">
                  {!showTitleScreen && !showGameOverScreen && (
                    <GameTimer 
                      isRunning={isTimerRunning} 
                      onPause={handlePauseGame} 
                      onResume={handleResumeGame}
                      onTimeUpdate={handleTimeUpdate}
                    />
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAchievements(true)}
                    disabled={isPaused}
                  >
                    <Trophy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTutorial(true)}
                    disabled={isPaused}
                  >
                    <Book className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-4 md:p-8 rounded-lg shadow-md border border-gray-200">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="flex flex-col items-center gap-4">
                    <ColorGrid 
                      grid={grid}
                      originalGrid={originalGrid}
                      gridSize={gridSize}
                      selectedCell={selectedCell}
                      onCellClick={handleCellClick}
                    />
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={handleUndo}
                        disabled={!gridHistory || !canUndo(gridHistory) || isPaused}
                        className="flex items-center gap-1"
                      >
                        <Undo className="h-4 w-4" />
                        Undo
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleRedo}
                        disabled={!gridHistory || !canRedo(gridHistory) || isPaused}
                        className="flex items-center gap-1"
                      >
                        <Redo className="h-4 w-4" />
                        Redo
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={isPaused}
                      >
                        Reset
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleGiveUp}
                        disabled={isPaused}
                      >
                        Give Up
                      </Button>
                    </div>
                    
                    {/* Hint system */}
                    <div className="w-full">
                      <HintSystem 
                        grid={grid}
                        solution={solution}
                        hintsRemaining={hintsRemaining}
                        onHintUsed={handleHintUsed}
                        onCellReveal={handleCellReveal}
                        disabled={isPaused || showGameOverScreen}
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    <h2 className="text-lg font-medium mb-3 text-center md:text-left">Color Palette</h2>
                    <ColorPalette colors={colors} onColorSelect={handleColorSelect} />
                    
                    <div className="mt-8">
                      <h2 className="text-lg font-medium mb-4 text-center md:text-left">Instructions</h2>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        <li>Click on an empty cell to select it</li>
                        <li>Click on a color or press 1-{colors.length} to place it</li>
                        <li>Each row, column, and region must contain each color exactly once</li>
                        <li>Use the hint button if you're stuck (limited hints per game)</li>
                        <li>Use Undo/Redo to fix mistakes</li>
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
        
        {/* Medium Difficulty Warning Dialog */}
        <Dialog open={showMediumWarning} onOpenChange={setShowMediumWarning}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-600">
                Medium Difficulty Unavailable
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <Alert className="bg-red-50 border border-red-200 mb-4">
                <Info className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-600">
                  We're experiencing technical difficulties with the 7×7 puzzle format.
                </AlertDescription>
              </Alert>
              <p className="text-center text-muted-foreground">
                We are working hard to fix this issue. In the meantime, please try our other difficulty levels.
                We apologize for the inconvenience.
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleCloseMediumWarning}
              >
                Return to Selection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Game Over Dialog */}
        <Dialog open={showGameOverScreen} onOpenChange={setShowGameOverScreen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {gameWon ? "Puzzle Solved!" : "Puzzle Unfinished"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-center text-muted-foreground">
                {gameWon 
                  ? "Congratulations! You've successfully solved the puzzle." 
                  : "Try a new puzzle?"}
              </p>
              
              {gameWon && user && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAchievements(true)}
                    className="mx-auto flex items-center gap-2"
                  >
                    <Award className="h-4 w-4" />
                    View Achievements
                  </Button>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
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
        
        {/* Achievements Dialog */}
        <AchievementsDialog
          open={showAchievements}
          onOpenChange={setShowAchievements}
        />
        
        {/* Tutorial Dialog */}
        <TutorialMode
          open={showTutorial}
          onOpenChange={setShowTutorial}
        />
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Game;
