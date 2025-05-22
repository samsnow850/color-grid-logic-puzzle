
// This file will handle daily game generation based on SF time

import { generatePuzzle, DifficultyLevel } from './gameLogic';

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
 * Always returns a hard difficulty 9x9 puzzle
 */
export function generateDailyPuzzle() {
  const sfDate = getSanFranciscoDate();
  const dateString = `${sfDate.getFullYear()}-${sfDate.getMonth() + 1}-${sfDate.getDate()}`;
  
  // Use the date string to seed the random generator in a deterministic way
  const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Set the seed for randomization (this is a mock since we can't directly set JS random seed)
  // In a real implementation, you might use a seeded random number generator
  
  // Always generate a hard 9x9 puzzle for daily challenges
  return {
    ...generatePuzzle(9, 'hard'),
    date: dateString,
    seed: seed
  };
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
