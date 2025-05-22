
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from "@/hooks/useAuth";
import { useGameTimer } from '@/hooks/useGameTimer';
import { 
  getGameById, 
  solveGrid, 
  generateGrid, 
  checkSolution, 
  Difficulty, 
  Cell, 
  Hint 
} from '@/lib/grid';
import { 
  GridHistory, 
  createHistory, 
  saveHistory, 
  undo, 
  redo 
} from '@/lib/historySystem';
import { 
  defaultAchievements,
  unlockAchievement,
  updateAchievementProgress,
} from '@/lib/achievements';
import { 
  AlertDialog, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Slider 
} from "@/components/ui/slider"
import { 
  Button 
} from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  Separator 
} from "@/components/ui/separator";
import { 
  Shuffle, 
  Undo, 
  Redo, 
  Lightbulb, 
  CheckCircle2, 
  RotateCcw, 
  RotateCw, 
  MoreVertical,
  Trophy,
  Sparkles,
  Pause,
  Play,
  ChevronsLeft,
  ChevronsRight,
  Flag,
  Settings,
  Share2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import GridComponent from "@/components/game/GridComponent";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShareDialog } from '@/components/game/ShareDialog';
import AchievementDialog from '@/components/game/AchievementDialog';

const Game = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Game state
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showSolution, setShowSolution] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [hints, setHints] = useState<Hint[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAchievementsDialog, setShowAchievementsDialog] = useState(false);
  const [gridSize, setGridSize] = useState<number>(9);

  // History state
  const [gridHistory, setGridHistory] = useState<GridHistory<string>>(createHistory<string>([[]]));

  // Timer
  const timer = useGameTimer(false);
  const { isRunning, seconds, minutes, hours, formatted, start, pause, reset } = timer;

  // Local storage for settings
  const [animationSpeed, setAnimationSpeed] = useLocalStorage<number>('animationSpeed', 50);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);

  // Achievements state
  const [achievements, setAchievements] = useState(defaultAchievements);

  // Fetch game data
  const { isLoading, error } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      if (id === 'daily') {
        // Daily puzzle logic here
        const today = new Date();
        const seed = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const newGrid = generateGrid(difficulty, gridSize, seed);
        return {
          grid: newGrid.grid,
          solution: newGrid.solution,
          difficulty: difficulty,
        };
      } else if (id) {
        const game = await getGameById(id);
        if (!game) {
          throw new Error('Game not found');
        }
        return game;
      } else {
        const newGrid = generateGrid(difficulty, gridSize);
        return {
          grid: newGrid.grid,
          solution: newGrid.solution,
          difficulty: difficulty,
        };
      }
    },
    meta: {
      onSuccess: (data: any) => {
        setGrid(data.grid);
        setSolution(data.solution);
        setGridHistory(createHistory<string>(data.grid.map((row: Cell[]) => row.map(cell => cell.value))));
      },
      onError: () => {
        toast.error('Failed to load game. Redirecting to home.');
        setTimeout(() => navigate('/'), 2000);
      },
    },
    enabled: true,
    retry: false,
  });

  // Function to start a new game
  const startNewGame = useCallback((newDifficulty: Difficulty = difficulty, newGridSize: number = gridSize) => {
    reset();
    pause();
    setIsSolved(false);
    setShowSolution(false);
    setDifficulty(newDifficulty);
    setGridSize(newGridSize);

    const newGridData = generateGrid(newDifficulty, newGridSize);
    setGrid(newGridData.grid);
    setSolution(newGridData.solution);
    setGridHistory(createHistory<string>(newGridData.grid.map(row => row.map(cell => cell.value))));
  }, [difficulty, gridSize, reset, pause]);

  // Check if the game is solved
  useEffect(() => {
    if (grid.length > 0) {
      const solved = checkSolution(grid, solution);
      setIsSolved(solved);

      if (solved) {
        pause();
        setShowCongratulations(true);

        // Unlock "First Victory" achievement
        if (user) {
          setAchievements(prevAchievements => {
            const updatedAchievements = unlockAchievement(prevAchievements, "first_victory");
            return updatedAchievements;
          });
        }
      }
    }
  }, [grid, solution, pause, user]);

  // Handle cell value change
  const handleCellValueChange = (rowIndex: number, colIndex: number, newValue: string) => {
    if (isPaused) return;

    const newGrid = grid.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex ? { ...cell, value: newValue } : cell
      )
    );

    setGrid(newGrid);
    setGridHistory(saveHistory<string>(gridHistory, newGrid.map(row => row.map(cell => cell.value))));
  };

  // Undo move
  const handleUndoMove = () => {
    if (isPaused) return;
    
    const newHistory = undo<string>(gridHistory);
    setGridHistory(newHistory);
    setGrid(newHistory.present.map((row, i) => 
      row.map((value, j) => ({
        ...grid[i][j],
        value
      }))
    ));
  };

  // Redo move
  const handleRedoMove = () => {
    if (isPaused) return;

    const newHistory = redo<string>(gridHistory);
    setGridHistory(newHistory);
    setGrid(newHistory.present.map((row, i) => 
      row.map((value, j) => ({
        ...grid[i][j],
        value
      }))
    ));
  };

  // Solve the grid
  const handleSolveGrid = async () => {
    if (isPaused) return;

    const solvedGrid = await solveGrid(grid, solution);
    if (solvedGrid) {
      setGrid(solvedGrid);
      setGridHistory(saveHistory<string>(gridHistory, solvedGrid.map(row => row.map(cell => cell.value))));
      setIsSolved(true);
      pause();
      setShowSolution(true);
    } else {
      toast.error('Could not solve the grid.');
    }
  };

  // Get a hint
  const handleGetHint = () => {
    if (isPaused) return;

    // Find an empty cell
    const emptyCells = grid.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) =>
        cell.value === '' ? { rowIndex, colIndex } : null
      ).filter(Boolean)
    );

    if (emptyCells.length > 0) {
      // Select a random empty cell
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, colIndex } = emptyCells[randomIndex] as { rowIndex: number, colIndex: number };

      // Get the correct value from the solution
      const correctValue = String(solution[rowIndex][colIndex]);

      // Update the grid with the hint
      const newGrid = grid.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          rIndex === rowIndex && cIndex === colIndex ? { ...cell, value: correctValue, isHint: true } : cell
        )
      );

      setGrid(newGrid);
      setGridHistory(saveHistory<string>(gridHistory, newGrid.map(row => row.map(cell => cell.value))));

      // Add the hint to the hints array
      setHints([...hints, { rowIndex, colIndex, value: correctValue }]);
    } else {
      toast('No hints available. The grid is full!');
    }
  };

  // Reset hints
  const handleResetHints = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({ ...cell, isHint: false }))
    );
    setGrid(newGrid);
    setHints([]);
  };

  // Toggle pause
  const togglePause = () => {
    if (isRunning) {
      pause();
      setIsPaused(true);
    } else {
      start();
      setIsPaused(false);
    }
  };

  // Format time
  const formatTime = () => {
    const hrs = String(hours).padStart(2, '0');
    const mins = String(minutes).padStart(2, '0');
    const secs = String(seconds).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  if (isLoading) {
    return (
      <PageWrapper
        loadingTitle="Loading Game"
        loadingDescription="Generating your puzzle"
        loadingColor="blue"
        animationSrc="/animations/loading.lottie"
      >
        <div>Loading...</div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper
        loadingTitle="Failed to Load Game"
        loadingDescription="There was an error loading the game. Please try again."
        loadingColor="red"
        animationSrc="/animations/error.lottie"
        errorTitle="Failed to Load Game"
        errorDescription="There was an error loading the game. Please try again."
        errorColor="red"
      >
        <div>Error loading game</div>
      </PageWrapper>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-4 md:p-8 bg-gradient-to-b from-background to-blue-50 dark:to-blue-950/20">
        <div className="container mx-auto max-w-4xl">
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                {id === 'daily' ? 'Daily Puzzle' : 'Color Grid Logic'}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePause}
                        disabled={isSolved}
                      >
                        {isRunning ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isRunning ? 'Pause' : 'Play'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleGetHint}
                        disabled={isSolved}
                      >
                        <Lightbulb className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get Hint</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleUndoMove}
                        disabled={isSolved || gridHistory.past.length === 0}
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Undo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRedoMove}
                        disabled={isSolved || gridHistory.future.length === 0}
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Redo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowSettings(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAchievementsDialog(true)}>
                      <Trophy className="h-4 w-4 mr-2" />
                      Achievements
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSolveGrid} disabled={isSolved}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Solve
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem>
                          <Shuffle className="h-4 w-4 mr-2" />
                          New Game
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will start a new game and you will lose your current progress.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button variant="destructive" onClick={() => startNewGame()}>
                            New Game
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardDescription>
              Time: {formatTime()}
            </CardDescription>
            <CardContent className="p-0">
              <GridComponent
                grid={grid}
                solution={solution}
                showSolution={showSolution}
                hints={hints}
                animationSpeed={animationSpeed}
                onCellValueChange={handleCellValueChange}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Congratulations Dialog */}
      <Dialog open={showCongratulations} onOpenChange={setShowCongratulations}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription>
              You solved the puzzle in {formatTime()}!
              <div className="flex justify-center mt-4">
                <Sparkles className="h-10 w-10 text-yellow-400" />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowCongratulations(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your gaming experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Animation Speed</h3>
              <p className="text-sm text-muted-foreground">
                Control the speed of the cell reveal animations.
              </p>
              <Slider
                defaultValue={[animationSpeed]}
                max={100}
                step={1}
                onValueChange={(value) => setAnimationSpeed(value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Current speed: {animationSpeed}ms
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} />

      {/* Achievements Dialog */}
      <AchievementDialog open={showAchievementsDialog} onOpenChange={setShowAchievementsDialog} achievements={achievements} />
    </div>
  );
};

export default Game;
