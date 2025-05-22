
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2, RotateCcw, Settings, Info, Trophy, Timer, Check, X, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ColorGrid from '@/components/game/ColorGrid';
import ColorPalette from '@/components/game/ColorPalette';

// Define the types for our game
type Difficulty = 'easy' | 'hard';
type Notes = Record<string, number[]>;

const COLORS = {
  easy: [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500'
  ],
  hard: [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-indigo-500'
  ]
};

// Helper function to generate a random grid
const generateRandomGrid = (difficulty: Difficulty): { grid: string[][], solution: string[][] } => {
  const size = difficulty === 'easy' ? 4 : 9;
  const colors = COLORS[difficulty];
  const emptyGrid: string[][] = Array(size).fill("").map(() => Array(size).fill(""));
  const solutionGrid: string[][] = Array(size).fill("").map(() => Array(size).fill(""));
  
  // For this demo, we'll just create a simple grid
  // In a real app, you'd use a proper Sudoku generator algorithm
  
  // Fill the solution grid
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const colorIndex = ((i * Math.floor(Math.sqrt(size)) + Math.floor(i / Math.sqrt(size)) + j) % size);
      solutionGrid[i][j] = colors[colorIndex];
    }
  }
  
  // Create the puzzle by removing some values
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // Copy from solution
      emptyGrid[i][j] = solutionGrid[i][j];
      
      // Remove some values based on difficulty
      const removalProbability = difficulty === 'easy' ? 0.5 : 0.7;
      if (Math.random() < removalProbability) {
        emptyGrid[i][j] = "";
      }
    }
  }
  
  return { grid: emptyGrid, solution: solutionGrid };
};

// Helper function to check if the grid is complete and correct
const isGridComplete = (grid: string[][], solution: string[][]): boolean => {
  const size = grid.length;
  
  // Check if all cells are filled correctly
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] !== solution[i][j]) {
        return false;
      }
    }
  }
  
  return true;
};

// Helper function to check if a specific value is valid at a position
const isValidMove = (grid: string[][], row: number, col: number, value: string): boolean => {
  const size = grid.length;
  
  // Check row
  for (let j = 0; j < size; j++) {
    if (j !== col && grid[row][j] === value) {
      return false;
    }
  }
  
  // Check column
  for (let i = 0; i < size; i++) {
    if (i !== row && grid[i][col] === value) {
      return false;
    }
  }
  
  // Check region (box)
  const regionSize = Math.sqrt(size);
  const boxRowStart = Math.floor(row / regionSize) * regionSize;
  const boxColStart = Math.floor(col / regionSize) * regionSize;
  
  for (let i = 0; i < regionSize; i++) {
    for (let j = 0; j < regionSize; j++) {
      const r = boxRowStart + i;
      const c = boxColStart + j;
      if ((r !== row || c !== col) && grid[r][c] === value) {
        return false;
      }
    }
  }
  
  return true;
};

// Helper function to deep clone a grid
const cloneGrid = (grid: string[][]): string[][] => {
  return grid.map(row => [...row]);
};

// Helper function to send score to the database
const sendScore = async (score: number, difficulty: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    const { error } = await supabase
      .from('scores')
      .insert([
        { 
          user_id: user.id,
          score,
          difficulty
        }
      ]);
      
    if (error) {
      console.error('Error saving score:', error);
    }
  } catch (error) {
    console.error('Error in sendScore:', error);
  }
};

// Helper function to count occurrences of a color in the grid
const countColorInGrid = (grid: string[][], color: string): number => {
  let count = 0;
  const size = grid.length;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === color) {
        count++;
      }
    }
  }
  
  return count;
};

// Helper function to check if a color has reached its maximum allowed count
const isColorMaxed = (grid: string[][], color: string): boolean => {
  const size = grid.length;
  const maxAllowed = size; // In Sudoku, each color can appear exactly size times
  const currentCount = countColorInGrid(grid, color);
  
  return currentCount >= maxAllowed;
};

// Main Game component
const Game = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Game state
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [grid, setGrid] = useState<string[][]>([]);
  const [initialGrid, setInitialGrid] = useState<string[][]>([]);
  const [solution, setSolution] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize the game
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);
  
  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);
  
  // Start a new game
  const startNewGame = () => {
    const { grid: newGrid, solution: newSolution } = generateRandomGrid(difficulty);
    setGrid(newGrid);
    setInitialGrid(cloneGrid(newGrid));
    setSolution(newSolution);
    setSelectedCell(null);
    setIsGameOver(false);
    setIsGameStarted(true);
    setShowSolution(false);
    setTimer(0);
    setIsTimerRunning(true);
    setShowCongrats(false);
    setTotalScore(0);
    setHintsRemaining(3);
  };
  
  // Reset the current game
  const resetGame = () => {
    setGrid(cloneGrid(initialGrid));
    setSelectedCell(null);
    setShowConfirmReset(false);
    setIsTimerRunning(true);
    setHintsRemaining(3);
  };
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (isGameOver || showSolution) return;
    
    // If the cell is part of the initial grid, don't allow selection
    if (initialGrid[row][col] !== "") return;
    
    setSelectedCell([row, col]);
  };
  
  // Handle color selection
  const handleColorSelect = (color: string) => {
    if (!selectedCell || isGameOver || showSolution) return;
    
    const [row, col] = selectedCell;
    
    // If the cell is part of the initial grid, don't allow changes
    if (initialGrid[row][col] !== "") return;
    
    const newGrid = cloneGrid(grid);
    
    // If the same color is clicked again, remove it
    if (newGrid[row][col] === color) {
      newGrid[row][col] = "";
    } else {
      newGrid[row][col] = color;
      
      // Check if the move is valid
      if (!isValidMove(newGrid, row, col, color)) {
        sonnerToast.error('Invalid move', {
          description: 'This color already exists in the same row, column, or region.',
          duration: 2000,
        });
      }
    }
    
    setGrid(newGrid);
    
    // Check if the game is complete
    if (isGridComplete(newGrid, solution)) {
      handleGameComplete();
    }
  };
  
  // Handle hint request
  const handleHintRequest = () => {
    if (hintsRemaining <= 0 || !selectedCell) return;
    
    const [row, col] = selectedCell;
    
    // If the cell already has the correct color or is part of initial grid, don't provide hint
    if (grid[row][col] === solution[row][col] || initialGrid[row][col] !== "") {
      sonnerToast.warning('Try another cell', {
        description: 'This cell already has the correct color or is part of the initial puzzle.',
        duration: 2000,
      });
      return;
    }
    
    // Apply the hint
    const newGrid = cloneGrid(grid);
    newGrid[row][col] = solution[row][col];
    setGrid(newGrid);
    setHintsRemaining(prev => prev - 1);
    
    sonnerToast.success('Hint used', {
      description: `You have ${hintsRemaining - 1} hints remaining.`,
      duration: 2000,
    });
    
    // Check if the game is complete after hint
    if (isGridComplete(newGrid, solution)) {
      handleGameComplete();
    }
  };
  
  // Handle game completion
  const handleGameComplete = () => {
    setIsGameOver(true);
    setIsTimerRunning(false);
    setShowCongrats(true);
    
    // Calculate score based on difficulty and time
    const baseScore = difficulty === 'easy' ? 1000 : 2500;
    const timeBonus = Math.max(0, difficulty === 'easy' ? 500 - timer : 1000 - timer);
    const hintsBonus = hintsRemaining * 100;
    const finalScore = baseScore + timeBonus + hintsBonus;
    setTotalScore(finalScore);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Save score if user is logged in
    if (user) {
      sendScore(finalScore, difficulty);
    }
    
    // Show toast
    toast({
      title: "Congratulations!",
      description: "You've completed the puzzle!",
    });
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameStarted || isGameOver || showSolution) return;
      
      // Arrow keys for navigation
      if (!selectedCell) return;
      
      const [row, col] = selectedCell;
      let newRow = row;
      let newCol = col;
      const size = grid.length;
      
      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(size - 1, row + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(size - 1, col + 1);
          break;
        case 'Delete':
        case 'Backspace':
          if (initialGrid[row][col] === "") {
            const newGrid = cloneGrid(grid);
            newGrid[row][col] = "";
            setGrid(newGrid);
          }
          break;
        default:
          return;
      }
      
      if (newRow !== row || newCol !== col) {
        setSelectedCell([newRow, newCol]);
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, grid, initialGrid, isGameStarted, isGameOver, showSolution]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Color Sudoku</h1>
            <p className="text-muted-foreground">Fill the grid with colors following Sudoku-style rules.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="easy">Easy (4×4)</TabsTrigger>
                <TabsTrigger value="hard">Hard (9×9)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-1">
                  <Timer className="w-4 h-4 mr-1" />
                  {formatTime(timer)}
                </Badge>
                
                <Badge variant={difficulty === 'easy' ? 'secondary' : 'destructive'} className="px-2 py-1">
                  {difficulty === 'easy' ? 'Easy' : 'Hard'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowConfirmReset(true)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset Puzzle</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowSettings(true)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Game Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowHelp(true)}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>How to Play</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="mb-6 flex justify-center">
              {grid.length > 0 && (
                <ColorGrid 
                  grid={grid}
                  originalGrid={initialGrid}
                  gridSize={grid.length}
                  selectedCell={selectedCell}
                  onCellClick={handleCellClick}
                />
              )}
            </div>
            
            <div className="flex justify-center">
              <ColorPalette
                colors={COLORS[difficulty]}
                onColorSelect={handleColorSelect}
                hintsRemaining={hintsRemaining}
                onHintRequest={handleHintRequest}
              />
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmNew(true)}
              >
                New Game
              </Button>
              
              <Button
                variant={showSolution ? "default" : "secondary"}
                className="flex-1"
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? "Hide Solution" : "Show Solution"}
              </Button>
              
              {user ? (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/leaderboard')}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Trophy className="mr-2 h-4 w-4" />
                      Leaderboard
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Sign in to save scores</h4>
                          <p className="text-sm text-muted-foreground">
                            Create an account to track your progress and compete on the leaderboard.
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => navigate('/auth')}>Sign In / Register</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Game Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Adjust game settings to your preference</p>
              <Button onClick={() => setShowSettings(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to Play</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>
              Fill the grid so that every row, column, and region contains each color exactly once.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Controls:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click on a cell to select it</li>
                <li>Click on a color in the palette to place it</li>
                <li>Use the hint button when you're stuck</li>
                <li>Use arrow keys to navigate the grid</li>
                <li>Press Delete or Backspace to clear a cell</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Difficulty Levels:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Easy:</strong> 4×4 grid with four colors</li>
                <li><strong>Hard:</strong> 9×9 grid with nine colors</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Reset Confirmation Dialog */}
      <Dialog open={showConfirmReset} onOpenChange={setShowConfirmReset}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Puzzle</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to reset the puzzle? All your progress will be lost.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmReset(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={resetGame}>
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* New Game Confirmation Dialog */}
      <Dialog open={showConfirmNew} onOpenChange={setShowConfirmNew}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Game</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to start a new game? All your progress will be lost.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmNew(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowConfirmNew(false);
              startNewGame();
            }}>
              New Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Congratulations Dialog */}
      <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Congratulations!
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
              >
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
            
            <h3 className="text-xl font-medium mb-2">Puzzle Completed!</h3>
            <p className="text-muted-foreground mb-4">
              You've successfully solved the {difficulty} puzzle.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span>Time:</span>
                <span className="font-medium">{formatTime(timer)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Difficulty:</span>
                <Badge variant={difficulty === 'easy' ? 'secondary' : 'destructive'}>
                  {difficulty === 'easy' ? 'Easy' : 'Hard'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Hints Used:</span>
                <span className="font-medium">{3 - hintsRemaining} of 3</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Score:</span>
                <span className="font-bold text-lg">{totalScore}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button onClick={() => {
                setShowCongrats(false);
                startNewGame();
              }}>
                Play Again
              </Button>
              
              {user ? (
                <Button variant="outline" onClick={() => {
                  setShowCongrats(false);
                  navigate('/leaderboard');
                }}>
                  <Trophy className="mr-2 h-4 w-4" />
                  View Leaderboard
                </Button>
              ) : (
                <Button variant="outline" onClick={() => {
                  setShowCongrats(false);
                  navigate('/auth');
                }}>
                  Sign In to Save Score
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Game;
