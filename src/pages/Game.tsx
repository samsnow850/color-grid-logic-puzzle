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

// Define the types for our game
type CellValue = number | null;
type Grid = CellValue[][];
type Difficulty = 'easy' | 'hard';
type Notes = Record<string, number[]>;

// Helper function to generate a random grid
const generateRandomGrid = (difficulty: Difficulty): { grid: Grid, solution: Grid } => {
  const size = difficulty === 'easy' ? 4 : 9;
  const emptyGrid: Grid = Array(size).fill(null).map(() => Array(size).fill(null));
  const solutionGrid: Grid = Array(size).fill(null).map(() => Array(size).fill(null));
  
  // For this demo, we'll just create a simple grid
  // In a real app, you'd use a proper Sudoku generator algorithm
  
  // Fill the solution grid
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      solutionGrid[i][j] = ((i * Math.floor(Math.sqrt(size)) + Math.floor(i / Math.sqrt(size)) + j) % size) + 1;
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
        emptyGrid[i][j] = null;
      }
    }
  }
  
  return { grid: emptyGrid, solution: solutionGrid };
};

// Helper function to check if the grid is valid
const isValidGrid = (grid: Grid): boolean => {
  const size = grid.length;
  
  // Check if all cells are filled
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === null) {
        return false;
      }
    }
  }
  
  // Check rows
  for (let i = 0; i < size; i++) {
    const row = new Set<number>();
    for (let j = 0; j < size; j++) {
      const value = grid[i][j];
      if (value !== null) {
        if (row.has(value)) {
          return false;
        }
        row.add(value);
      }
    }
  }
  
  // Check columns
  for (let j = 0; j < size; j++) {
    const col = new Set<number>();
    for (let i = 0; i < size; i++) {
      const value = grid[i][j];
      if (value !== null) {
        if (col.has(value)) {
          return false;
        }
        col.add(value);
      }
    }
  }
  
  // Check regions (boxes)
  const regionSize = Math.sqrt(size);
  for (let boxRow = 0; boxRow < regionSize; boxRow++) {
    for (let boxCol = 0; boxCol < regionSize; boxCol++) {
      const box = new Set<number>();
      for (let i = 0; i < regionSize; i++) {
        for (let j = 0; j < regionSize; j++) {
          const row = boxRow * regionSize + i;
          const col = boxCol * regionSize + j;
          const value = grid[row][col];
          if (value !== null) {
            if (box.has(value)) {
              return false;
            }
            box.add(value);
          }
        }
      }
    }
  }
  
  return true;
};

// Helper function to check if the grid is complete and correct
const isGridComplete = (grid: Grid, solution: Grid): boolean => {
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
const isValidMove = (grid: Grid, row: number, col: number, value: number): boolean => {
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
const cloneGrid = (grid: Grid): Grid => {
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

// Helper function to count occurrences of a value in the grid
const countValueInGrid = (grid, value) => {
  let count = 0;
  const size = grid.length;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === value) {
        count++;
      }
    }
  }
  
  return count;
};

// Helper function to check if a value has reached its maximum allowed count
const isValueMaxed = (grid, value) => {
  const size = grid.length;
  const maxAllowed = size; // In Sudoku, each value can appear exactly size times
  const currentCount = countValueInGrid(grid, value);
  
  return currentCount >= maxAllowed;
};

// Main Game component
const Game = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Game state
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [grid, setGrid] = useState<Grid>([]);
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [noteMode, setNoteMode] = useState(false);
  const [notes, setNotes] = useState<Notes>({});
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [showErrors, setShowErrors] = useState(true);
  const [highlightSameValues, setHighlightSameValues] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
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
    setNotes({});
    setErrors(new Set());
    setTimer(0);
    setIsTimerRunning(true);
    setShowCongrats(false);
    setTotalScore(0);
  };
  
  // Reset the current game
  const resetGame = () => {
    setGrid(cloneGrid(initialGrid));
    setSelectedCell(null);
    setNotes({});
    setErrors(new Set());
    setShowConfirmReset(false);
    setIsTimerRunning(true);
  };
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (isGameOver || showSolution) return;
    
    // If the cell is part of the initial grid, don't allow selection
    if (initialGrid[row][col] !== null) return;
    
    setSelectedCell([row, col]);
  };
  
  // Handle number input
  const handleNumberInput = (value: number) => {
    if (!selectedCell || isGameOver || showSolution) return;
    
    const [row, col] = selectedCell;
    
    // If the cell is part of the initial grid, don't allow changes
    if (initialGrid[row][col] !== null) return;
    
    const newGrid = cloneGrid(grid);
    
    if (noteMode) {
      // Handle note mode
      const cellKey = `${row}-${col}`;
      const currentNotes = notes[cellKey] || [];
      
      // Toggle the note
      const newNotes = { ...notes };
      if (currentNotes.includes(value)) {
        newNotes[cellKey] = currentNotes.filter(n => n !== value);
      } else {
        newNotes[cellKey] = [...currentNotes, value].sort((a, b) => a - b);
      }
      
      setNotes(newNotes);
    } else {
      // Regular mode - place a number
      // If the same number is clicked again, remove it
      if (newGrid[row][col] === value) {
        newGrid[row][col] = null;
      } else {
        newGrid[row][col] = value;
        
        // Check if the move is valid
        if (!isValidMove(newGrid, row, col, value)) {
          const errorKey = `${row}-${col}`;
          const newErrors = new Set(errors);
          newErrors.add(errorKey);
          setErrors(newErrors);
          
          // Show error toast if enabled
          if (showErrors) {
            sonnerToast.error('Invalid move', {
              description: 'This number already exists in the same row, column, or region.',
              duration: 2000,
            });
          }
        } else {
          // Remove from errors if it was there
          const errorKey = `${row}-${col}`;
          if (errors.has(errorKey)) {
            const newErrors = new Set(errors);
            newErrors.delete(errorKey);
            setErrors(newErrors);
          }
        }
        
        // Clear notes for this cell
        const cellKey = `${row}-${col}`;
        if (notes[cellKey]) {
          const newNotes = { ...notes };
          delete newNotes[cellKey];
          setNotes(newNotes);
        }
      }
      
      setGrid(newGrid);
      
      // Check if the game is complete
      if (isGridComplete(newGrid, solution)) {
        handleGameComplete();
      }
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
    const finalScore = baseScore + timeBonus;
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
      variant: "default",
    });
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get cell background color
  const getCellBackgroundColor = (row: number, col: number) => {
    const size = grid.length;
    const regionSize = Math.sqrt(size);
    const isEvenRegion = (Math.floor(row / regionSize) + Math.floor(col / regionSize)) % 2 === 0;
    
    if (selectedCell && row === selectedCell[0] && col === selectedCell[1]) {
      return 'bg-primary/20';
    }
    
    if (selectedCell && highlightSameValues && grid[row][col] !== null && grid[selectedCell[0]][selectedCell[1]] === grid[row][col]) {
      return 'bg-primary/10';
    }
    
    // Highlight the selected cell's row, column, and region
    if (selectedCell) {
      const [selRow, selCol] = selectedCell;
      const selRegionRow = Math.floor(selRow / regionSize);
      const selRegionCol = Math.floor(selCol / regionSize);
      
      if (row === selRow || col === selCol || 
          (Math.floor(row / regionSize) === selRegionRow && Math.floor(col / regionSize) === selRegionCol)) {
        return 'bg-muted/50';
      }
    }
    
    return isEvenRegion ? 'bg-background' : 'bg-muted/30';
  };
  
  // Get cell text color
  const getCellTextColor = (row: number, col: number) => {
    if (initialGrid[row][col] !== null) {
      return 'text-foreground font-bold';
    }
    
    if (errors.has(`${row}-${col}`)) {
      return 'text-destructive';
    }
    
    return 'text-primary';
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameStarted || isGameOver || showSolution) return;
      
      if (e.key === 'n') {
        setNoteMode(prev => !prev);
        return;
      }
      
      // Number keys
      const size = grid.length;
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= size) {
        handleNumberInput(num);
        return;
      }
      
      // Arrow keys for navigation
      if (!selectedCell) return;
      
      const [row, col] = selectedCell;
      let newRow = row;
      let newCol = col;
      
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
          if (initialGrid[row][col] === null) {
            const newGrid = cloneGrid(grid);
            newGrid[row][col] = null;
            setGrid(newGrid);
            
            // Remove from errors if it was there
            const errorKey = `${row}-${col}`;
            if (errors.has(errorKey)) {
              const newErrors = new Set(errors);
              newErrors.delete(errorKey);
              setErrors(newErrors);
            }
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
  }, [selectedCell, grid, initialGrid, isGameStarted, isGameOver, showSolution, errors]);
  
  // Render the game board
  const renderGrid = () => {
    if (!grid.length) return null;
    
    const size = grid.length;
    const regionSize = Math.sqrt(size);
    
    return (
      <div 
        ref={gridRef}
        className={cn(
          "grid gap-0.5 md:gap-1 border-2 border-primary/50 rounded-lg overflow-hidden",
          size === 4 ? "grid-cols-4" : "grid-cols-9"
        )}
        style={{ 
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          aspectRatio: '1/1',
          maxWidth: size === 4 ? '400px' : '600px',
          margin: '0 auto'
        }}
      >
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isInitial = initialGrid[rowIndex][colIndex] !== null;
            const isSelected = selectedCell && rowIndex === selectedCell[0] && colIndex === selectedCell[1];
            const hasError = errors.has(`${rowIndex}-${colIndex}`);
            const cellKey = `${rowIndex}-${colIndex}`;
            const cellNotes = notes[cellKey] || [];
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "relative flex items-center justify-center cursor-pointer transition-all",
                  getCellBackgroundColor(rowIndex, colIndex),
                  isInitial ? "cursor-not-allowed" : "hover:bg-primary/10",
                  isSelected && "ring-2 ring-primary",
                  hasError && showErrors && "ring-2 ring-destructive",
                  // Add borders to separate regions
                  (colIndex + 1) % regionSize === 0 && colIndex < size - 1 && "border-r-2 border-r-primary/50",
                  (rowIndex + 1) % regionSize === 0 && rowIndex < size - 1 && "border-b-2 border-b-primary/50"
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== null ? (
                  <span 
                    className={cn(
                      "text-lg md:text-2xl font-medium",
                      getCellTextColor(rowIndex, colIndex)
                    )}
                  >
                    {showSolution ? solution[rowIndex][colIndex] : cell}
                  </span>
                ) : showSolution ? (
                  <span className="text-lg md:text-2xl font-medium text-primary/70">
                    {solution[rowIndex][colIndex]}
                  </span>
                ) : cellNotes.length > 0 ? (
                  <div className={`grid grid-cols-${Math.ceil(Math.sqrt(size))} gap-0.5 p-0.5 w-full h-full`}>
                    {Array.from({ length: size }).map((_, i) => {
                      const noteValue = i + 1;
                      return (
                        <div key={i} className="flex items-center justify-center">
                          {cellNotes.includes(noteValue) && (
                            <span className="text-[8px] md:text-xs text-muted-foreground">
                              {noteValue}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })
        ))}
      </div>
    );
  };
  
  // Render the number pad with grayed out numbers that have reached max
  const renderNumberPad = () => {
    const size = grid.length;
    
    return (
      <div className={cn(
        "grid gap-2 mt-4",
        size === 4 ? "grid-cols-4" : "grid-cols-5 md:grid-cols-9"
      )}>
        {Array.from({ length: size }).map((_, i) => {
          const value = i + 1;
          const isMaxed = isValueMaxed(grid, value);
          
          return (
            <Button
              key={value}
              variant="outline"
              className={cn(
                "h-10 md:h-12 text-lg font-medium",
                noteMode && "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20",
                isMaxed && !noteMode && "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700"
              )}
              onClick={() => !isMaxed || noteMode ? handleNumberInput(value) : null}
            >
              {value}
            </Button>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Puzzle Game</h1>
            <p className="text-muted-foreground">Fill the grid with numbers following Sudoku-style rules.</p>
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
                        onClick={() => setNoteMode(!noteMode)}
                        className={noteMode ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" : ""}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle Note Mode {noteMode ? '(On)' : '(Off)'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
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
            
            <div className="mb-6">
              {renderGrid()}
            </div>
            
            <div>
              {renderNumberPad()}
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
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-errors">Show Errors</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight cells with invalid values
                </p>
              </div>
              <Switch
                id="show-errors"
                checked={showErrors}
                onCheckedChange={setShowErrors}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="highlight-same">Highlight Same Values</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight cells with the same value as the selected cell
                </p>
              </div>
              <Switch
                id="highlight-same"
                checked={highlightSameValues}
                onCheckedChange={setHighlightSameValues}
              />
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
              Fill the grid so that every row, column, and region contains each number exactly once.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Controls:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click on a cell to select it</li>
                <li>Click on a number in the number pad to place it</li>
                <li>Toggle note mode to add small notes to cells</li>
                <li>Use arrow keys to navigate the grid</li>
                <li>Use number keys (1-9) to input numbers</li>
                <li>Press 'N' to toggle note mode</li>
                <li>Press Delete or Backspace to clear a cell</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Difficulty Levels:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Easy:</strong> 4×4 grid with more pre-filled cells</li>
                <li><strong>Hard:</strong> 9×9 grid with fewer pre-filled cells</li>
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
