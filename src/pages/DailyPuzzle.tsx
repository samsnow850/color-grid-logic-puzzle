
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ColorGrid from "@/components/game/ColorGrid";
import ColorPalette from "@/components/game/ColorPalette";
import GameTimer from "@/components/game/GameTimer";
import PauseOverlay from "@/components/game/PauseOverlay";
import { checkWinCondition } from "@/lib/gameLogic";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { scrollToTop } from "@/lib/utils";
import { 
  generateDailyPuzzle, 
  getSanFranciscoDate, 
  getStoredDailyPuzzle, 
  storeDailyPuzzle,
  shouldGenerateNewDaily
} from "@/lib/dailyGames";

const DailyPuzzle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [grid, setGrid] = useState<string[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<string[][]>([]);
  const [solution, setSolution] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [nextPuzzleTime, setNextPuzzleTime] = useState<Date | null>(null);
  const [timeUntilNextPuzzle, setTimeUntilNextPuzzle] = useState<string>("");
  const [puzzleDate, setPuzzleDate] = useState<string>("");
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const gridSize = 10; // Daily puzzle is now 10x10
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { returnTo: "/daily-puzzle" } });
    }
  }, [user, navigate]);
  
  // Load or generate daily puzzle
  useEffect(() => {
    if (!user) return;
    
    scrollToTop();
    
    try {
      // Get the current SF date
      const sfDate = getSanFranciscoDate();
      const currentDateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
      
      // Check if user has completed today's puzzle
      const completedPuzzles = localStorage.getItem(`completed-puzzles-${user.id}`);
      const completedPuzzlesList = completedPuzzles ? JSON.parse(completedPuzzles) : [];
      
      if (completedPuzzlesList.includes(currentDateString)) {
        setDailyCompleted(true);
        setIsTimerRunning(false);
        
        // Calculate time until next puzzle
        const tomorrow = new Date(sfDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        setNextPuzzleTime(tomorrow);
      }
      
      // Check if we have today's puzzle already
      const storedPuzzle = getStoredDailyPuzzle();
      
      if (storedPuzzle) {
        // Use the stored puzzle
        setPuzzleDate(storedPuzzle.date);
        setGrid(storedPuzzle.puzzle);
        setOriginalGrid(JSON.parse(JSON.stringify(storedPuzzle.puzzle)));
        setSolution(storedPuzzle.solution);
        
        // Calculate time until next puzzle even if not completed
        const tomorrow = new Date(sfDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        setNextPuzzleTime(tomorrow);
        
        // Set 10 colors for 10x10 grid
        setColors([
          "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
          "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", 
          "bg-teal-400", "bg-cyan-400"
        ]);
      } else {
        // Generate a new puzzle (ensure our generator handles 10x10)
        const dailyPuzzle = generateDailyPuzzle();
        setPuzzleDate(dailyPuzzle.date);
        setGrid(dailyPuzzle.puzzle);
        setOriginalGrid(JSON.parse(JSON.stringify(dailyPuzzle.puzzle)));
        setSolution(dailyPuzzle.solution);
        
        // Calculate time until next puzzle
        const tomorrow = new Date(sfDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        setNextPuzzleTime(tomorrow);
        
        // Store the daily puzzle
        storeDailyPuzzle(dailyPuzzle);
        
        // Set 10 colors for 10x10 grid
        setColors([
          "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
          "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", 
          "bg-teal-400", "bg-cyan-400"
        ]);
      }
    } catch (err) {
      console.error("Error loading daily puzzle:", err);
      setError("There was a problem loading today's puzzle. Please try again later.");
    }
  }, [user, navigate]);
  
  // Countdown timer for next puzzle
  useEffect(() => {
    if (!nextPuzzleTime) return;
    
    const updateTimer = () => {
      const now = new Date();
      const diffMs = nextPuzzleTime.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        // Time's up, reload the page to get a new puzzle
        window.location.reload();
        return;
      }
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeUntilNextPuzzle(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };
    
    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [nextPuzzleTime]);
  
  const handleCellClick = (row: number, col: number) => {
    // Don't allow clicking if the daily puzzle is completed
    if (dailyCompleted || isPaused) return;
    
    // Don't allow clicking on pre-filled cells
    if (originalGrid[row][col] !== "") {
      return;
    }
    setSelectedCell([row, col]);
  };

  const handleColorSelect = (color: string) => {
    if (dailyCompleted || !selectedCell || isPaused) return;
    
    const [row, col] = selectedCell;
    const newGrid = [...grid];
    newGrid[row][col] = color;
    setGrid(newGrid);
    
    // Check if the puzzle is solved
    if (checkWinCondition(newGrid)) {
      // Mark as completed
      const sfDate = getSanFranciscoDate();
      const currentDateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
      
      // Save completion to localStorage
      const completedPuzzles = localStorage.getItem(`completed-puzzles-${user?.id}`);
      const completedPuzzlesList = completedPuzzles ? JSON.parse(completedPuzzles) : [];
      
      if (!completedPuzzlesList.includes(currentDateString)) {
        completedPuzzlesList.push(currentDateString);
        localStorage.setItem(`completed-puzzles-${user?.id}`, JSON.stringify(completedPuzzlesList));
      }
      
      setGameWon(true);
      setDailyCompleted(true);
      setIsTimerRunning(false);
      setShowGameOverScreen(true);
    }
  };

  const handleReset = () => {
    if (dailyCompleted || isPaused) return;
    
    setGrid(JSON.parse(JSON.stringify(originalGrid)));
    setSelectedCell(null);
  };

  const handleGiveUp = () => {
    if (dailyCompleted || isPaused) return;
    
    // Mark as completed but not won
    const sfDate = getSanFranciscoDate();
    const currentDateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
    
    // Save completion to localStorage
    const completedPuzzles = localStorage.getItem(`completed-puzzles-${user?.id}`);
    const completedPuzzlesList = completedPuzzles ? JSON.parse(completedPuzzles) : [];
    
    if (!completedPuzzlesList.includes(currentDateString)) {
      completedPuzzlesList.push(currentDateString);
      localStorage.setItem(`completed-puzzles-${user?.id}`, JSON.stringify(completedPuzzlesList));
    }
    
    setGameWon(false);
    setDailyCompleted(true);
    setIsTimerRunning(false);
    setShowGameOverScreen(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (dailyCompleted || !selectedCell || isPaused) return;
    
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
  }, [selectedCell, colors, dailyCompleted, isPaused]);

  const handlePauseGame = () => {
    setIsTimerRunning(false);
    setIsPaused(true);
  };
  
  const handleResumeGame = () => {
    setIsTimerRunning(true);
    setIsPaused(false);
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold text-primary">Daily Challenge</h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="text-primary" size={16} />
                <span>{puzzleDate}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!dailyCompleted && (
                <GameTimer 
                  isRunning={isTimerRunning} 
                  onPause={handlePauseGame} 
                  onResume={handleResumeGame} 
                />
              )}
            </div>
          </div>
          
          {nextPuzzleTime && (
            <div className="mb-4 py-2 px-4 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="mr-2 text-purple-800" size={18} />
              <span className="font-medium">
                Puzzle resets in: <span className="font-mono font-bold">{timeUntilNextPuzzle}</span>
              </span>
            </div>
          )}
          
          {error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : dailyCompleted ? (
            <Alert className="mb-6 bg-purple-100 text-purple-800 border-purple-200">
              <Info className="h-4 w-4 text-purple-800" />
              <AlertDescription className="flex items-center gap-2">
                You've completed today's puzzle! Next puzzle in{" "}
                <span className="font-mono font-bold flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {timeUntilNextPuzzle}
                </span>
              </AlertDescription>
            </Alert>
          ) : null}
          
          <div className="bg-white p-4 md:p-8 rounded-lg shadow-md border border-gray-200">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex flex-col items-center gap-4">
                <ColorGrid 
                  grid={grid}
                  originalGrid={originalGrid}
                  gridSize={gridSize} // Now using 10x10 for daily challenge
                  selectedCell={dailyCompleted ? null : selectedCell}
                  onCellClick={handleCellClick}
                />
              </div>

              <div className="w-full md:w-auto">
                <h2 className="text-lg font-medium mb-3 text-center md:text-left">Color Palette</h2>
                <ColorPalette colors={colors} onColorSelect={handleColorSelect} />
                
                <div className="mt-8 space-y-4">
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={dailyCompleted}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGiveUp}
                      disabled={dailyCompleted}
                    >
                      Give Up
                    </Button>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h2 className="text-lg font-medium mb-2">Daily Challenge</h2>
                    <p className="text-sm text-muted-foreground">
                      A new 10×10 puzzle is available each day at midnight San Francisco time (PT).
                      Complete the daily challenge to track your streak!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Pause Overlay */}
      {isPaused && <PauseOverlay onResume={handleResumeGame} />}
      
      <Dialog open={showGameOverScreen} onOpenChange={setShowGameOverScreen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {gameWon ? "Daily Challenge Complete!" : "Better Luck Tomorrow"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              {gameWon 
                ? "Congratulations! You've successfully solved today's daily challenge." 
                : "Don't worry, a new challenge will be available tomorrow."}
            </p>
            
            <div className="mt-4 text-center">
              <p className="font-medium">Next puzzle in:</p>
              <p className="font-mono text-2xl font-bold">{timeUntilNextPuzzle}</p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setShowGameOverScreen(false);
                navigate("/");
                scrollToTop();
              }}
            >
              Return Home
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                setShowGameOverScreen(false);
                navigate("/game");
                scrollToTop();
              }}
            >
              Play Practice Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default DailyPuzzle;
