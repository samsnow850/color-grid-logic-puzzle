
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
import { DifficultyLevel, generatePuzzle, checkWinCondition } from "@/lib/gameLogic";

const Game = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [showTitleScreen, setShowTitleScreen] = useState(true);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState<string[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [colors, setColors] = useState<string[]>([]);

  const startNewGame = () => {
    let newGridSize = 4;
    let colorCount = 4;
    
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
    
    setShowTitleScreen(false);
    setShowGameOverScreen(false);
  };

  const handleCellClick = (row: number, col: number) => {
    // Don't allow clicking on pre-filled cells
    if (originalGrid[row][col] !== "") {
      return;
    }
    setSelectedCell([row, col]);
  };

  const handleColorSelect = (color: string) => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    const newGrid = [...grid];
    newGrid[row][col] = color;
    setGrid(newGrid);
    
    // Check if the puzzle is solved
    if (checkWinCondition(newGrid)) {
      setGameWon(true);
      setShowGameOverScreen(true);
    }
  };

  const handleReset = () => {
    setGrid(JSON.parse(JSON.stringify(originalGrid)));
    setSelectedCell(null);
  };

  const handleGiveUp = () => {
    setGameWon(false);
    setShowGameOverScreen(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell) return;
    
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
  }, [selectedCell, colors]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background to-purple-50">
        {showTitleScreen ? (
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
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
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium (6×6)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard (9×9)</Label>
                </div>
              </RadioGroup>
            </div>
            
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
              <h1 className="text-2xl font-bold">Color Grid Logic</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGiveUp}
                >
                  Give Up
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <ColorGrid 
                  grid={grid}
                  originalGrid={originalGrid}
                  gridSize={gridSize}
                  selectedCell={selectedCell}
                  onCellClick={handleCellClick}
                />

                <div className="w-full md:w-auto">
                  <h2 className="text-lg font-medium mb-4">Color Palette</h2>
                  <ColorPalette colors={colors} onColorSelect={handleColorSelect} />
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-4">Instructions</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Click on an empty cell to select it</li>
                      <li>Click on a color or press 1-{colors.length} to place it</li>
                      <li>Each row, column, and region must contain each color exactly once</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
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
              }}
            >
              Main Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Game;
