export type DifficultyLevel = "easy" | "medium" | "hard";

// Function to generate a new puzzle
export function generatePuzzle(gridSize: number, difficulty: DifficultyLevel) {
  try {
    // Validate grid size
    if (gridSize !== 4 && gridSize !== 6 && gridSize !== 9) {
      throw new Error(`Invalid grid size: ${gridSize}`);
    }

    // Ensure the grid size has a valid square root for region calculations
    const regionSize = Math.sqrt(gridSize);
    if (Math.floor(regionSize) !== regionSize) {
      throw new Error(`Grid size must have an integer square root: ${gridSize}`);
    }

    // Create an empty grid
    const emptyGrid = Array(gridSize).fill("").map(() => Array(gridSize).fill(""));
    
    // Generate a solved grid
    const solution = generateSolution(emptyGrid, gridSize);
    
    // Create a copy of the solution
    const puzzle = JSON.parse(JSON.stringify(solution));
    
    // Determine how many cells to remove based on difficulty
    let cellsToRemove: number;
    if (difficulty === "easy") {
      cellsToRemove = Math.floor(gridSize * gridSize * 0.4); // 40% cells removed
    } else if (difficulty === "medium") {
      cellsToRemove = Math.floor(gridSize * gridSize * 0.55); // 55% cells removed (slightly easier than before)
    } else {
      cellsToRemove = Math.floor(gridSize * gridSize * 0.7); // 70% cells removed (slightly easier than before)
    }
    
    // Remove cells randomly with a maximum number of attempts
    const maxAttempts = gridSize * gridSize * 2;
    let attempts = 0;
    let removed = 0;
    
    while (removed < cellsToRemove && attempts < maxAttempts) {
      attempts++;
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      
      if (puzzle[row][col] !== "") {
        puzzle[row][col] = "";
        removed++;
      }
    }
    
    return { puzzle, solution };
  } catch (error) {
    console.error("Error generating puzzle:", error);
    // Fall back to a simple 4×4 puzzle in case of errors
    const fallbackGrid = Array(4).fill("").map(() => Array(4).fill(""));
    const fallbackSolution = generateSolution(fallbackGrid, 4);
    const fallbackPuzzle = JSON.parse(JSON.stringify(fallbackSolution));
    
    // Remove a small number of cells for the fallback puzzle
    for (let i = 0; i < 6; i++) {
      const row = Math.floor(Math.random() * 4);
      const col = Math.floor(Math.random() * 4);
      fallbackPuzzle[row][col] = "";
    }
    
    return { puzzle: fallbackPuzzle, solution: fallbackSolution };
  }
}

// Generate a valid solution for the grid
function generateSolution(grid: string[][], gridSize: number): string[][] {
  const colors = [
    "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
    "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", "bg-teal-400"
  ].slice(0, gridSize);
  
  // Simple backtracking solver to generate a valid grid
  const newGrid = JSON.parse(JSON.stringify(grid));
  solveGrid(newGrid, 0, 0, gridSize, colors);
  return newGrid;
}

// Backtracking solver function
function solveGrid(
  grid: string[][],
  row: number,
  col: number,
  gridSize: number,
  colors: string[]
): boolean {
  // If we've filled the entire grid, we're done
  if (row === gridSize) {
    return true;
  }
  
  // Move to the next cell (or next row if at end of current row)
  const nextRow = col === gridSize - 1 ? row + 1 : row;
  const nextCol = col === gridSize - 1 ? 0 : col + 1;
  
  // If this cell is already filled, move to the next cell
  if (grid[row][col] !== "") {
    return solveGrid(grid, nextRow, nextCol, gridSize, colors);
  }
  
  // Try each color
  const shuffledColors = shuffleArray([...colors]);
  for (const color of shuffledColors) {
    if (isValidPlacement(grid, row, col, color, gridSize)) {
      grid[row][col] = color;
      
      // Recursively try to solve the rest of the grid
      if (solveGrid(grid, nextRow, nextCol, gridSize, colors)) {
        return true;
      }
      
      // If that didn't work, undo our choice and try the next color
      grid[row][col] = "";
    }
  }
  
  // No solution found with any color
  return false;
}

// Check if placing a color at the given position is valid
export function isValidPlacement(
  grid: string[][],
  row: number,
  col: number,
  color: string,
  gridSize: number
): boolean {
  // Check row
  for (let c = 0; c < gridSize; c++) {
    if (grid[row][c] === color) {
      return false;
    }
  }
  
  // Check column
  for (let r = 0; r < gridSize; r++) {
    if (grid[r][col] === color) {
      return false;
    }
  }
  
  // Check region (like 2x2 for 4x4 grid, or 3x3 for 9x9 grid)
  const regionSize = Math.sqrt(gridSize);
  const regionStartRow = Math.floor(row / regionSize) * regionSize;
  const regionStartCol = Math.floor(col / regionSize) * regionSize;
  
  for (let r = regionStartRow; r < regionStartRow + regionSize; r++) {
    for (let c = regionStartCol; c < regionStartCol + regionSize; c++) {
      if (grid[r][c] === color) {
        return false;
      }
    }
  }
  
  // All checks passed
  return true;
}

// Check if the puzzle is solved
export function checkWinCondition(grid: string[][]): boolean {
  const gridSize = grid.length;
  
  // Check that there are no empty cells
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === "") {
        return false;
      }
    }
  }
  
  // Check rows
  for (let row = 0; row < gridSize; row++) {
    const seen = new Set();
    for (let col = 0; col < gridSize; col++) {
      if (seen.has(grid[row][col])) {
        return false;
      }
      seen.add(grid[row][col]);
    }
  }
  
  // Check columns
  for (let col = 0; col < gridSize; col++) {
    const seen = new Set();
    for (let row = 0; row < gridSize; row++) {
      if (seen.has(grid[row][col])) {
        return false;
      }
      seen.add(grid[row][col]);
    }
  }
  
  // Check regions
  const regionSize = Math.sqrt(gridSize);
  for (let regionRow = 0; regionRow < regionSize; regionRow++) {
    for (let regionCol = 0; regionCol < regionSize; regionCol++) {
      const seen = new Set();
      for (let row = regionRow * regionSize; row < (regionRow + 1) * regionSize; row++) {
        for (let col = regionCol * regionSize; col < (regionCol + 1) * regionSize; col++) {
          if (seen.has(grid[row][col])) {
            return false;
          }
          seen.add(grid[row][col]);
        }
      }
    }
  }
  
  return true;
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
