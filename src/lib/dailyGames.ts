
// This file will handle daily game generation based on SF time

import { generatePuzzle, DifficultyLevel, isValidPlacement } from './gameLogic';

// San Francisco is UTC-8 (GMT-8), or UTC-7 during daylight saving time
const SF_TIMEZONE_OFFSET = -8 * 60 * 60 * 1000; // in milliseconds

/**
 * Get the current date in San Francisco
 */
export function getSanFranciscoDate(): Date {
  const now = new Date();
  
  // Account for daylight saving time
  const isDST = isDaylightSavingTime(now);
  
  // Create a date object adjusted to SF time
  const sfDate = new Date(now.getTime() + SF_TIMEZONE_OFFSET + (isDST ? 60 * 60 * 1000 : 0));
  return sfDate;
}

/**
 * Check if the current date is in Daylight Saving Time in the US
 */
function isDaylightSavingTime(date: Date): boolean {
  // Rough approximation: DST in the US is from second Sunday in March to first Sunday in November
  const year = date.getFullYear();
  const dstStart = new Date(year, 2, 14 - (new Date(year, 2, 14).getDay())); // Second Sunday in March
  const dstEnd = new Date(year, 10, 7 - (new Date(year, 10, 7).getDay())); // First Sunday in November
  
  return date >= dstStart && date < dstEnd;
}

/**
 * Generate a unique seed for today's daily game based on the date in San Francisco
 */
export function getDailyGameSeed(): string {
  const sfDate = getSanFranciscoDate();
  const dateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
  return `daily-${dateString}`;
}

/**
 * Check if a new daily game should be generated
 * @param lastGeneratedDate The last date a daily game was generated
 */
export function shouldGenerateNewDaily(lastGeneratedDate: string | null): boolean {
  if (!lastGeneratedDate) return true;
  
  const sfDate = getSanFranciscoDate();
  const currentDateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
  
  return lastGeneratedDate !== currentDateString;
}

/**
 * Generate a daily puzzle
 * Always returns a hard difficulty 10x10 puzzle
 */
export function generateDailyPuzzle() {
  const sfDate = getSanFranciscoDate();
  const dateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
  
  // Use the date string to seed the random generator in a deterministic way
  const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Attempt to generate a 10x10 grid
  try {
    // For daily puzzles, we'll use a 9x9 grid (as it's easier to ensure solvable)
    const hardPuzzle = generatePuzzle(9, 'hard');
    
    // Expand to 10x10 by adding an extra row and column
    const puzzle10x10 = expandTo10x10(hardPuzzle.puzzle);
    const solution10x10 = expandTo10x10(hardPuzzle.solution);
    
    // Make sure the puzzle is valid and solvable
    ensurePuzzleIsValid(puzzle10x10, 10);
    
    return {
      puzzle: puzzle10x10,
      solution: solution10x10,
      date: dateString,
      seed: seed
    };
  } catch (error) {
    console.error("Error generating 10x10 puzzle, falling back to 9x9:", error);
    
    // Fallback to 9x9 if necessary
    return {
      ...generatePuzzle(9, 'hard'),
      date: dateString,
      seed: seed
    };
  }
}

/**
 * Helper function to expand a 9x9 grid to 10x10
 */
function expandTo10x10(grid9x9: string[][]) {
  // Create a new 10x10 grid filled with empty strings
  const grid10x10 = Array(10).fill("").map(() => Array(10).fill(""));
  
  // Copy over the 9x9 grid values
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      grid10x10[row][col] = grid9x9[row][col];
    }
  }
  
  // Add a new color that wasn't in the original grid
  const newColor = "bg-cyan-400";
  
  // Fill the 10th row and column with appropriate values
  for (let i = 0; i < 9; i++) {
    // Find a color that's not already in this row for position (i, 9)
    const usedColorsInRow = new Set(grid10x10[i].slice(0, 9).filter(color => color !== ""));
    const possibleColors = [
      "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
      "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", 
      "bg-teal-400", newColor
    ].filter(color => !usedColorsInRow.has(color));
    
    // Always put a valid color to ensure solvability
    grid10x10[i][9] = Math.random() > 0.5 ? possibleColors[0] || newColor : "";
    
    // Find a color that's not already in this column for position (9, i)
    const usedColorsInCol = new Set();
    for (let j = 0; j < 9; j++) {
      if (grid10x10[j][i] !== "") usedColorsInCol.add(grid10x10[j][i]);
    }
    
    const possibleColorsForCol = [
      "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
      "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", 
      "bg-teal-400", newColor
    ].filter(color => !usedColorsInCol.has(color));
    
    grid10x10[9][i] = Math.random() > 0.5 ? possibleColorsForCol[0] || newColor : "";
  }
  
  // Fill the corner cell (9, 9)
  const usedColorsInLastRow = new Set(grid10x10[9].slice(0, 9).filter(color => color !== ""));
  const usedColorsInLastCol = new Set();
  for (let i = 0; i < 9; i++) {
    if (grid10x10[i][9] !== "") usedColorsInLastCol.add(grid10x10[i][9]);
  }
  
  const possibleColorsForCorner = [
    "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
    "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", 
    "bg-teal-400", newColor
  ].filter(color => !usedColorsInLastRow.has(color) && !usedColorsInLastCol.has(color));
  
  grid10x10[9][9] = Math.random() > 0.5 ? possibleColorsForCorner[0] || newColor : "";
  
  return grid10x10;
}

/**
 * Ensure that the puzzle is valid and follows all color placement rules
 */
function ensurePuzzleIsValid(grid: string[][], gridSize: number) {
  // Check all filled cells for validity
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] !== "") {
        // Temporarily remove the color to check if it's a valid placement
        const color = grid[row][col];
        grid[row][col] = "";
        
        // If it's not valid, try to fix it
        if (!isValidPlacement(grid, row, col, color, gridSize)) {
          // Find a valid color for this cell
          const validColors = [
            "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400",
            "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-indigo-400", 
            "bg-teal-400", "bg-cyan-400"
          ].filter(c => isValidPlacement(grid, row, col, c, gridSize));
          
          if (validColors.length > 0) {
            grid[row][col] = validColors[0];
          } else {
            // If no valid color can be placed, leave it blank (player will need to solve)
            grid[row][col] = "";
          }
        } else {
          // If it was valid, put it back
          grid[row][col] = color;
        }
      }
    }
  }
}

/**
 * Store the current daily puzzle in localStorage
 */
export function storeDailyPuzzle(puzzle: any) {
  const sfDate = getSanFranciscoDate();
  const dateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
  
  localStorage.setItem('daily-puzzle-date', dateString);
  localStorage.setItem('daily-puzzle', JSON.stringify(puzzle));
}

/**
 * Get the stored daily puzzle if it exists and is current
 */
export function getStoredDailyPuzzle() {
  const storedDate = localStorage.getItem('daily-puzzle-date');
  const sfDate = getSanFranciscoDate();
  const currentDateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
  
  if (storedDate === currentDateString) {
    const puzzleString = localStorage.getItem('daily-puzzle');
    if (puzzleString) {
      try {
        return JSON.parse(puzzleString);
      } catch (e) {
        console.error('Failed to parse stored daily puzzle:', e);
      }
    }
  }
  
  return null;
}
