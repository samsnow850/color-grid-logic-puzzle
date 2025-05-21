import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { generateGrid, isValidPlacement, solvePuzzle, checkWin } from "@/lib/gameLogic";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"

import { ArrowLeft, ArrowRight, CheckCircle2, ChevronsUpDown, HelpCircle, RefreshCw, Settings, Timer, User2, XCircle } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import ColorPalette from "@/components/game/ColorPalette";
import ColorGrid from "@/components/game/ColorGrid";

const Game = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [solution, setSolution] = useState<string[][]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [newGridSize, setNewGridSize] = useState(4);
  const [colorCount, setColorCount] = useState(4);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState(2);
  const [availableHints, setAvailableHints] = useState(2);
  const [isSolved, setIsSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMediumWarning, setShowMediumWarning] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const colors = ["bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400", "bg-purple-400", "bg-orange-400", "bg-teal-400", "bg-pink-400", "bg-indigo-400"];
  
  // Function to handle difficulty changes
  const handleDifficultyChange = (value: "easy" | "medium" | "hard") => {
    setDifficulty(value);
  };

  // Load settings from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const difficultyParam = params.get('difficulty') as "easy" | "medium" | "hard" | null;
    if (difficultyParam && ['easy', 'medium', 'hard'].includes(difficultyParam)) {
      setDifficulty(difficultyParam);
    }
  
    // Start a new game with the loaded difficulty
    startNewGame();
  }, [searchParams]);

  // Update URL parameters when difficulty changes
  useEffect(() => {
    setSearchParams({ difficulty: difficulty });
  }, [difficulty, setSearchParams]);

  // Start/stop timer based on isRunning
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showTimer && isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, showTimer]);

  // Format time into readable string
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Start a new game
  const startNewGame = () => {
    setIsLoading(true);
    setIsSolved(false);
    setShowSolution(false);
    setSelectedColor(null);
    setTime(0);
    setIsRunning(false);
    setAvailableHints(hintCount);
    setAnimationKey(prevKey => prevKey + 1);

    let newGridSize = 4;
    let colorCount = 4;
    let hintCount = 2;

    if (difficulty === "medium") {
      // Show medium difficulty warning
      setShowMediumWarning(true);
      return; // Don't actually start the game for medium difficulty
    } else if (difficulty === "hard") {
      newGridSize = 9;
      colorCount = 9;
      hintCount = 3;
    }

    setNewGridSize(newGridSize);
    setColorCount(colorCount);
    setHintCount(hintCount);
    setAvailableHints(hintCount);

    setTimeout(() => {
      const newGrid = generateGrid(newGridSize, difficulty as any);
      setGrid(newGrid);
      const solvedGrid = solvePuzzle(newGrid);
      setSolution(solvedGrid);
      setIsLoading(false);
    }, 500);
  };

  // Cell selection
  const handleCellClick = (row: number, col: number) => {
    if (selectedColor && grid[row][col] === "") {
      if (isValidPlacement(grid, row, col, selectedColor, newGridSize)) {
        const newGrid = grid.map((rowArray, rowIndex) =>
          rowIndex === row
            ? rowArray.map((cellValue, colIndex) =>
              colIndex === col ? selectedColor : cellValue
            )
            : rowArray
        );
        setGrid(newGrid);
        if (checkWin(newGrid)) {
          setIsSolved(true);
          setIsRunning(false);
          toast({
            title: "Congratulations! Puzzle Solved!",
            description: "You've successfully completed the Color Grid Logic puzzle.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Incorrect Placement",
          description: "This placement is not valid. Please try again.",
        });
      }
    }
  };

  // Provide a hint
  const handleGetHint = () => {
    if (availableHints > 0) {
      let row: number, col: number;
      do {
        row = Math.floor(Math.random() * newGridSize);
        col = Math.floor(Math.random() * newGridSize);
      } while (grid[row][col] !== "");

      const newGrid = grid.map((rowArray, rowIndex) =>
        rowIndex === row
          ? rowArray.map((cellValue, colIndex) =>
            colIndex === col ? solution[row][col] : cellValue
          )
          : rowArray
      );
      setGrid(newGrid);
      setAvailableHints(availableHints - 1);

      if (checkWin(newGrid)) {
        setIsSolved(true);
        setIsRunning(false);
        toast({
          title: "Congratulations! Puzzle Solved!",
          description: "You've successfully completed the Color Grid Logic puzzle.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "No Hints Available",
        description: "You've used all available hints for this game.",
      });
    }
  };

  // Reset the game
  const handleResetGame = () => {
    setShowResetConfirmation(true);
  };

  const confirmReset = () => {
    startNewGame();
    setShowResetConfirmation(false);
  };

  // Toggle timer
  const toggleTimer = () => {
    setShowTimer(!showTimer);
    setIsRunning(!isRunning);
  };

  return (
    <PageWrapper
      loadingTitle="Loading Game"
      loadingDescription="Preparing your Color Grid Logic puzzle"
      loadingColor="purple"
    >
      <div className="min-h-screen flex flex-col">
        {/* Game Content */}
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Color Grid Logic</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <User2 className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTimer}>
                    <Timer className="mr-2 h-4 w-4" />
                    {showTimer ? "Hide Timer" : "Show Timer"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGetHint} disabled={availableHints === 0}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Get Hint ({availableHints} remaining)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleResetGame}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Game
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Settings Modal */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Game Settings</DialogTitle>
                <DialogDescription>Customize your Color Grid Logic experience.</DialogDescription>
              </DialogHeader>

              {/* Difficulty Selection */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-foreground">Select Difficulty</h2>
                <RadioGroup value={difficulty} onValueChange={handleDifficultyChange} className="space-y-1">
                  <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy" className="cursor-pointer w-full">Easy (4×4)</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                    <RadioGroupItem value="medium" id="medium" disabled />
                    <Label htmlFor="medium" className="flex items-center cursor-pointer w-full">
                      Medium (7×7) 
                      <span className="ml-2 text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-md">
                        OUT OF SERVICE
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard" className="cursor-pointer w-full">Hard (9×9)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Timer Setting */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTimer" className="text-xl font-bold text-foreground">Show Timer</Label>
                  <Button variant="outline" onClick={toggleTimer}>
                    {showTimer ? "Hide Timer" : "Show Timer"}
                  </Button>
                </div>
              </div>
              
              <Button onClick={() => setShowSettings(false)}>Close</Button>
            </DialogContent>
          </Dialog>

					{/* Medium Difficulty Warning Modal */}
					<Dialog open={showMediumWarning} onOpenChange={setShowMediumWarning}>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Medium Difficulty Unavailable</DialogTitle>
								<DialogDescription>
									We apologize, but the Medium (7×7) difficulty is currently out of service. Please select another difficulty level.
								</DialogDescription>
							</DialogHeader>
							<Button onClick={() => setShowMediumWarning(false)}>OK</Button>
						</DialogContent>
					</Dialog>

          {/* Reset Confirmation Dialog */}
          <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Reset</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset the game? This will start a new game with the same difficulty.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowResetConfirmation(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmReset}>Reset Game</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Help Dialog */}
          <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>How to Play</DialogTitle>
                <DialogDescription>Learn how to play Color Grid Logic.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  Color Grid Logic is a puzzle game where you fill the grid with colors such that each row, column, and region contains each color exactly once.
                </p>
                <h3 className="font-bold">Basic Rules:</h3>
                <ul className="list-disc pl-5">
                  <li>Each cell must be filled with a color.</li>
                  <li>Each row must contain all unique colors.</li>
                  <li>Each column must contain all unique colors.</li>
                  <li>Each region (4x4, 6x6, or 9x9 depending on difficulty) must contain all unique colors.</li>
                </ul>
                <h3 className="font-bold">How to Play:</h3>
                <ul className="list-decimal pl-5">
                  <li>Select a color from the color palette.</li>
                  <li>Click on an empty cell in the grid to place the selected color.</li>
                  <li>If the placement is valid, the cell will be filled with the color.</li>
                  <li>Continue filling the grid until all cells are filled correctly.</li>
                </ul>
                <h3 className="font-bold">Tips:</h3>
                <ul className="list-disc pl-5">
                  <li>Use logic to deduce the correct placement of colors.</li>
                  <li>Avoid guessing; every puzzle can be solved through deduction.</li>
                  <li>If you get stuck, use a hint to reveal a correct placement.</li>
                </ul>
              </div>
              <Button onClick={() => setShowHelp(false)}>Close</Button>
            </DialogContent>
          </Dialog>

          {/* Game Board and Controls */}
          <div className="flex flex-col md:flex-row items-start">
            {/* Game Board */}
            <div className="md:w-2/3">
              {isLoading ? (
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${newGridSize}, minmax(50px, 1fr))` }}>
                  {Array.from({ length: newGridSize * newGridSize }).map((_, index) => (
                    <Skeleton key={index} className="w-full aspect-square rounded-md" />
                  ))}
                </div>
              ) : (
                <div
                  key={animationKey}
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${newGridSize}, minmax(50px, 1fr))`,
                  }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <motion.button
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square rounded-md flex items-center justify-center font-medium text-white text-lg ${cell || "bg-gray-100 dark:bg-gray-700"
                          }`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isSolved}
                      >
                        {showSolution && solution[rowIndex][colIndex]}
                      </motion.button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="md:w-1/3 md:ml-6 mt-6 md:mt-0">
              {showTimer && (
                <div className="mb-4">
                  <Timer className="inline-block mr-2 h-5 w-5" />
                  <span className="text-lg font-medium">{formatTime(time)}</span>
                </div>
              )}
              <ColorPalette
                colors={colors.slice(0, colorCount)}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
              <div className="flex flex-col space-y-2">
                <Button onClick={startNewGame} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Start New Game"}
                </Button>
                <Button variant="secondary" onClick={() => setShowHelp(true)}>
                  How to Play
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Game;
