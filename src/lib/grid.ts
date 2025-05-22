
export interface Cell {
  value: string;
  isFixed?: boolean;
  isHint?: boolean;
}

export interface Hint {
  rowIndex: number;
  colIndex: number;
  value: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export const generateGrid = (difficulty: Difficulty, size: number = 9, seed?: string) => {
  // This is a simplified mock implementation
  const grid: Cell[][] = Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => ({ 
      value: '',
      isFixed: Math.random() > 0.7
    }))
  );
  
  // Add some fixed values
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j].isFixed) {
        grid[i][j].value = String(Math.floor(Math.random() * size) + 1);
      }
    }
  }
  
  // Generate a solution matrix
  const solution: number[][] = Array(size).fill(null).map((_, i) => 
    Array(size).fill(null).map((_, j) => (i + j) % size + 1)
  );
  
  return { grid, solution };
};

export const getGameById = async (id: string) => {
  // Mock implementation
  const size = id.includes('hard') ? 9 : 4;
  return generateGrid(id.includes('hard') ? 'hard' : 'easy', size);
};

export const solveGrid = async (grid: Cell[][], solution: number[][]) => {
  // Return a grid with all cells filled according to the solution
  return grid.map((row, i) => 
    row.map((cell, j) => ({
      ...cell,
      value: String(solution[i][j])
    }))
  );
};

export const checkSolution = (grid: Cell[][], solution: number[][]) => {
  // Check if all cells match the solution
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j].value !== String(solution[i][j])) {
        return false;
      }
    }
  }
  return true;
};
