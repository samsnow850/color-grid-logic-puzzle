
import { supabase } from "@/integrations/supabase/client";
import { recordGameScore } from "./achievements";

export const calculateGameScore = (
  difficulty: string,
  timeTaken: number,
  errorCount: number = 0
): number => {
  // Base scores by difficulty
  const baseScores: Record<string, number> = {
    easy: 100,
    medium: 200,
    hard: 300,
    daily: 250
  };
  
  // Get base score for the difficulty (default to easy if unknown)
  const baseScore = baseScores[difficulty] || baseScores.easy;
  
  // Time factor (faster = better)
  // For a 5-minute game (300 seconds) or longer, minimum time bonus
  const timeFactor = Math.max(0.5, Math.min(2.0, 600 / (timeTaken + 300)));
  
  // Error penalty (fewer errors = better)
  const errorPenalty = Math.max(0.5, 1 - (errorCount * 0.05));
  
  // Calculate final score and round to integer
  return Math.round(baseScore * timeFactor * errorPenalty);
};

export const saveGameResult = async (
  userId: string | undefined,
  difficulty: string,
  timeTaken: number,
  errorCount: number = 0,
  completed: boolean = true
): Promise<number> => {
  if (!userId) return 0;
  
  const score = calculateGameScore(difficulty, timeTaken, errorCount);
  
  await recordGameScore(
    userId,
    score,
    difficulty,
    timeTaken,
    completed
  );
  
  return score;
};
