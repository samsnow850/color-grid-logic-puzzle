import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/supabaseClient";
import { PageWrapper } from "@/components/PageWrapper";
import { formatTime } from "@/lib/utils";
import {
  Trophy,
  Lightbulb,
  History,
  GraduationCap,
  Confetti,
  Pause,
  Play,
  HelpCircle,
  ChevronsLeft,
} from "lucide-react";

interface Cell {
  value: number | null;
  isClue: boolean;
}

const Game = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(180);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (isGameStarted && !isGameOver && timeLeft > 0 && !paused) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      handleGameOver(false, score, timeLeft);
    }
  }, [isGameStarted, isGameOver, timeLeft, score, paused, handleGameOver]);

  const generateGrid = useCallback((difficulty: "Easy" | "Medium" | "Hard") => {
    let size: number;
    let clues: number;

    switch (difficulty) {
      case "Easy":
        size = 4;
        clues = 4;
        break;
      case "Medium":
        size = 6;
        clues = 12;
        break;
      case "Hard":
        size = 9;
        clues = 20;
        break;
    }

    const newGrid: Cell[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill({ value: null, isClue: false }));

    // Fill diagonally
    for (let i = 0; i < size; i++) {
      newGrid[i][i] = { value: (i % size) + 1, isClue: true };
    }

    // Add clues randomly
    let cluesAdded = 0;
    while (cluesAdded < clues) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (!newGrid[row][col].value) {
        newGrid[row][col] = { value: (cluesAdded % size) + 1, isClue: true };
        cluesAdded++;
      }
    }

    setGrid(newGrid);
    setTimeLeft(totalTime);
    setIsSuccess(false);
    setIsGameOver(false);
    setScore(0);
  }, [totalTime]);

  const startGame = () => {
    generateGrid(difficulty);
    setIsGameStarted(true);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell) return;

    const { value } = event.target;
    const [row, col] = selectedCell;

    if (grid[row][col].isClue) {
      toast({
        title: "Cannot change clue cells",
        description: "These cells are part of the original puzzle",
      });
      return;
    }

    if (value === "" || (Number(value) >= 1 && Number(value) <= grid.length)) {
      const newValue = value === "" ? null : Number(value);
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((rowArray, rowIndex) =>
          rowArray.map((cell, colIndex) =>
            rowIndex === row && colIndex === col ? { ...cell, value: newValue } : cell
          )
        );
        return newGrid;
      });
    } else {
      toast({
        title: "Invalid Input",
        description: `Please enter a number between 1 and ${grid.length}`,
      });
    }
  };

  const checkSolution = useCallback(() => {
    let isCorrect = true;
    const size = grid.length;

    // Check rows and columns
    for (let i = 0; i < size; i++) {
      const rowValues = new Set<number>();
      const colValues = new Set<number>();

      for (let j = 0; j < size; j++) {
        const rowValue = grid[i][j].value;
        const colValue = grid[j][i].value;

        if (!rowValue || rowValues.has(rowValue)) {
          isCorrect = false;
          break;
        }
        rowValues.add(rowValue);

        if (!colValue || colValues.has(colValue)) {
          isCorrect = false;
          break;
        }
        colValues.add(colValue);
      }

      if (!isCorrect) break;
    }

    if (isCorrect) {
      setIsSuccess(true);
      handleGameOver(true, score, timeLeft);
    } else {
      toast({
        title: "Solution Incorrect",
        description: "The grid is not solved correctly. Keep trying!",
      });
    }
  }, [grid, score, timeLeft, handleGameOver, toast]);

  const handleGameOver = useCallback(async (success: boolean, score: number, timeLeft: number) => {
    setIsGameOver(true);
    setPaused(false);
    
    const finalScore = success ? score + Math.floor(timeLeft) : score;
    setScore(finalScore);
    
    // Save score to Supabase if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('game_scores')
          .insert([
            { 
              user_id: user.id, 
              score: finalScore,
              difficulty: difficulty,
              completed: success,
              time_taken: totalTime - timeLeft
            }
          ]);
          
        if (error) {
          console.error("Error saving score:", error);
          toast.error("Failed to save your score");
        } else {
          toast.success("Score saved successfully!");
          
          // Update user stats
          const { data: statsData, error: statsError } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (statsError && statsError.code !== 'PGRST116') {
            console.error("Error fetching stats:", statsError);
          }
          
          const stats = statsData || {
            user_id: user.id,
            games_played: 0,
            games_won: 0,
            total_score: 0,
            average_score: 0,
            highest_score: 0
          };
          
          const newStats = {
            games_played: stats.games_played + 1,
            games_won: stats.games_won + (success ? 1 : 0),
            total_score: stats.total_score + finalScore,
            average_score: Math.round((stats.total_score + finalScore) / (stats.games_played + 1)),
            highest_score: Math.max(stats.highest_score, finalScore)
          };
          
          const { error: updateError } = await supabase
            .from('user_stats')
            .upsert([
              { 
                user_id: user.id,
                ...newStats
              }
            ]);
            
          if (updateError) {
            console.error("Error updating stats:", updateError);
          }
        }
      } catch (err) {
        console.error("Error in score saving process:", err);
        toast.error("An unexpected error occurred");
      }
    }
  }, [difficulty, totalTime, user, toast]);

  const handlePlayAgain = () => {
    setIsGameOver(false);
    setIsGameStarted(false);
    generateGrid(difficulty);
  };

  const handleMainMenu = () => {
    navigate("/");
  };

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDifficulty(event.target.value as "Easy" | "Medium" | "Hard");
  };

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0] * 60;
    setTotalTime(newTime);
    setTimeLeft(newTime);
  };

  const togglePause = () => {
    setPaused((p) => !p);
  };

  return (
    <PageWrapper
      loadingTitle="Preparing Your Game"
      loadingDescription="Setting up the puzzle"
      loadingColor="indigo"
      animationSrc="/animations/game-loading.lottie"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Color Grid Logic</h1>
          <p className="text-muted-foreground">Fill the grid according to the rules</p>
        </div>

        {/* Game controls */}
        {!isGameStarted && !isGameOver && (
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Game Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Difficulty</h3>
                <div className="flex justify-center gap-4">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      className="accent-purple-500"
                      name="difficulty"
                      value="Easy"
                      checked={difficulty === "Easy"}
                      onChange={handleDifficultyChange}
                    />
                    <span>Easy</span>
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      className="accent-purple-500"
                      name="difficulty"
                      value="Medium"
                      checked={difficulty === "Medium"}
                      onChange={handleDifficultyChange}
                    />
                    <span>Medium</span>
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      className="accent-purple-500"
                      name="difficulty"
                      value="Hard"
                      checked={difficulty === "Hard"}
                      onChange={handleDifficultyChange}
                    />
                    <span>Hard</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Time Limit</h3>
                <div className="flex items-center justify-center">
                  <Slider
                    defaultValue={[totalTime / 60]}
                    max={120}
                    min={1}
                    step={1}
                    onValueChange={handleTimeChange}
                    className="w-64"
                  />
                  <span className="ml-4">{totalTime / 60} minutes</span>
                </div>
              </div>

              <Button onClick={startGame} className="w-full">
                Start Game
              </Button>
            </div>
          </div>
        )}

        {/* Game in progress */}
        {isGameStarted && !isGameOver && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowTutorial(true)}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  How to Play
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAchievements(true)}
                  className="ml-2"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Achievements
                </Button>
              </div>
              <div className="text-lg font-semibold">
                Time Left: {formatTime(timeLeft)}
              </div>
              <Button variant="outline" size="sm" onClick={togglePause}>
                {paused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-2">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  {row.map((cell, colIndex) => (
                    <input
                      key={colIndex}
                      type="number"
                      value={cell.value === null ? "" : cell.value}
                      onChange={handleInputChange}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`w-12 h-12 text-center rounded-md border border-input bg-background shadow-sm
                        ${cell.isClue ? "font-bold text-foreground" : "text-muted-foreground"}
                        ${selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                          ? "ring-2 ring-primary"
                          : ""
                        }`}
                      readOnly={cell.isClue || paused}
                    />
                  ))}
                </div>
              ))}
            </div>

            <Button onClick={checkSolution} className="mt-6 w-full">
              Check Solution
            </Button>
          </div>
        )}

        {/* Game over screen */}
        {isGameOver && (
          <div className="bg-card rounded-lg shadow-lg p-6 mx-auto max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isSuccess ? "Puzzle Completed!" : "Game Over"}
            </h2>
            <p className="mb-6 text-lg">
              {isSuccess ? "Congratulations! You've completed the puzzle." : "Better luck next time!"}
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Score:</span>
                <span className="font-bold text-xl">{score}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Difficulty:</span>
                <span>{difficulty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Time:</span>
                <span>{formatTime(totalTime - timeLeft)}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Button onClick={handlePlayAgain}>
                Play Again
              </Button>
              <Button variant="outline" onClick={handleMainMenu}>
                Main Menu
              </Button>
            </div>
          </div>
        )}

        {/* Tutorial dialog */}
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>How to Play</DialogTitle>
              <DialogDescription>
                Learn the rules of Color Grid Logic
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Color Grid Logic is a puzzle where you fill a grid with colors
                following these rules:
              </p>
              <ul className="list-disc pl-5">
                <li>Each row must contain all unique colors.</li>
                <li>Each column must contain all unique colors.</li>
                <li>
                  Use logic to deduce the correct placement of colors based on
                  the initial clues.
                </li>
              </ul>
              <p>
                Select a cell and enter a number to fill it with a color.
                Complete the grid to solve the puzzle!
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowTutorial(false)}>
                Got it!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Achievements dialog */}
        <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Achievements</DialogTitle>
              <DialogDescription>
                Track your progress and unlock rewards
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Confetti className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold">First Game</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Play your first game of Color Grid Logic.
                </p>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Easy Win</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Solve an Easy difficulty puzzle.
                </p>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Trophy className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Medium Master</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Solve a Medium difficulty puzzle.
                </p>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Brain className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold">Hardcore Solver</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Solve a Hard difficulty puzzle.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowAchievements(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
};

export default Game;
