
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  progress?: number;
  progressTarget?: number;
  achieved: boolean;
}

export const ACHIEVEMENT_TYPES = {
  FIRST_VICTORY: "first_victory",
  EASY_MASTER: "easy_master",
  HARD_MASTER: "hard_master",
  SPEED_DEMON: "speed_demon",
  NO_HELP: "no_help",
  DAILY_CHALLENGER: "daily_challenger"
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_victory",
    type: ACHIEVEMENT_TYPES.FIRST_VICTORY,
    name: "First Victory",
    description: "Complete your first puzzle",
    achieved: false
  },
  {
    id: "easy_master",
    type: ACHIEVEMENT_TYPES.EASY_MASTER,
    name: "Easy Master",
    description: "Complete 5 Easy puzzles",
    progress: 0,
    progressTarget: 5,
    achieved: false
  },
  {
    id: "hard_master",
    type: ACHIEVEMENT_TYPES.HARD_MASTER,
    name: "Hard Master",
    description: "Complete 3 Hard puzzles",
    progress: 0,
    progressTarget: 3,
    achieved: false
  },
  {
    id: "speed_demon",
    type: ACHIEVEMENT_TYPES.SPEED_DEMON,
    name: "Speed Demon",
    description: "Complete a puzzle in under 2 minutes",
    achieved: false
  },
  {
    id: "no_help",
    type: ACHIEVEMENT_TYPES.NO_HELP,
    name: "No Help Needed",
    description: "Complete a puzzle without using hints",
    achieved: false
  },
  {
    id: "daily_challenger",
    type: ACHIEVEMENT_TYPES.DAILY_CHALLENGER,
    name: "Daily Challenger",
    description: "Complete 3 daily puzzles",
    progress: 0,
    progressTarget: 3,
    achieved: false
  }
];

export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  if (!userId) return [...ACHIEVEMENTS];
  
  try {
    const { data: achievementData, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Copy the achievements list and mark those that have been achieved
    const achievements = [...ACHIEVEMENTS];
    
    // Create a map of achievement types that the user has earned
    const earnedAchievements = new Map();
    achievementData?.forEach(item => {
      earnedAchievements.set(item.achievement_type, true);
    });
    
    // Update achievements with user progress
    for (let achievement of achievements) {
      achievement.achieved = earnedAchievements.has(achievement.type);
      
      // Update progress for specific achievements
      if (achievement.type === ACHIEVEMENT_TYPES.EASY_MASTER) {
        achievement.progress = await getGameCountByDifficulty(userId, 'easy');
      } else if (achievement.type === ACHIEVEMENT_TYPES.HARD_MASTER) {
        achievement.progress = await getGameCountByDifficulty(userId, 'hard');
      } else if (achievement.type === ACHIEVEMENT_TYPES.DAILY_CHALLENGER) {
        achievement.progress = await getDailyPuzzleCount(userId);
      }
    }
    
    return achievements;
    
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [...ACHIEVEMENTS];
  }
};

export const getGameCountByDifficulty = async (userId: string, difficulty: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('game_scores')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('difficulty', difficulty)
      .eq('completed', true);
      
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting ${difficulty} games count:`, error);
    return 0;
  }
};

export const getDailyPuzzleCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('game_scores')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('difficulty', 'daily')
      .eq('completed', true);
      
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error getting daily puzzle count:', error);
    return 0;
  }
};

export const unlockAchievement = async (userId: string, achievementType: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // First check if achievement already exists
    const { data: existing } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_type', achievementType)
      .maybeSingle();
      
    if (existing) return false; // Already unlocked
    
    // Insert new achievement
    const { error } = await supabase
      .from('achievements')
      .insert({
        user_id: userId,
        achievement_type: achievementType
      });
      
    if (error) throw error;
    
    // Find the achievement details to display in toast
    const achievementDetails = ACHIEVEMENTS.find(a => a.type === achievementType);
    
    if (achievementDetails) {
      toast.success(`Achievement Unlocked: ${achievementDetails.name}`, {
        description: achievementDetails.description,
        duration: 5000
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return false;
  }
};

export const checkAndUnlockAchievements = async (
  userId: string,
  difficulty: string, 
  timeTaken: number, 
  usedHints: boolean
): Promise<void> => {
  if (!userId) return;
  
  try {
    // First Victory
    await unlockAchievement(userId, ACHIEVEMENT_TYPES.FIRST_VICTORY);
    
    // Easy Master
    if (difficulty === 'easy') {
      const easyGames = await getGameCountByDifficulty(userId, 'easy');
      if (easyGames >= 5) {
        await unlockAchievement(userId, ACHIEVEMENT_TYPES.EASY_MASTER);
      }
    }
    
    // Hard Master
    if (difficulty === 'hard') {
      const hardGames = await getGameCountByDifficulty(userId, 'hard');
      if (hardGames >= 3) {
        await unlockAchievement(userId, ACHIEVEMENT_TYPES.HARD_MASTER);
      }
    }
    
    // Daily Challenger
    if (difficulty === 'daily') {
      const dailyGames = await getDailyPuzzleCount(userId);
      if (dailyGames >= 3) {
        await unlockAchievement(userId, ACHIEVEMENT_TYPES.DAILY_CHALLENGER);
      }
    }
    
    // Speed Demon (under 2 minutes = 120 seconds)
    if (timeTaken <= 120) {
      await unlockAchievement(userId, ACHIEVEMENT_TYPES.SPEED_DEMON);
    }
    
    // No Help Needed
    if (!usedHints) {
      await unlockAchievement(userId, ACHIEVEMENT_TYPES.NO_HELP);
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};

export const updateUserStats = async (
  userId: string,
  score: number,
  won: boolean
): Promise<void> => {
  if (!userId) return;
  
  try {
    // First check if user already has stats
    const { data: existingStats, error: fetchError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    
    if (existingStats) {
      // Update existing stats
      const gamesPlayed = existingStats.games_played + 1;
      const gamesWon = won ? existingStats.games_won + 1 : existingStats.games_won;
      const totalScore = existingStats.total_score + score;
      const averageScore = Math.round(totalScore / gamesPlayed);
      const highestScore = Math.max(existingStats.highest_score, score);
      
      const { error: updateError } = await supabase
        .from('user_stats')
        .update({
          games_played: gamesPlayed,
          games_won: gamesWon,
          total_score: totalScore,
          average_score: averageScore,
          highest_score: highestScore,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (updateError) throw updateError;
    } else {
      // Create new stats record
      const { error: insertError } = await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          games_played: 1,
          games_won: won ? 1 : 0,
          total_score: score,
          average_score: score,
          highest_score: score
        });
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

export const recordGameScore = async (
  userId: string,
  score: number,
  difficulty: string,
  timeTaken: number,
  completed: boolean = true
): Promise<void> => {
  if (!userId) return;
  
  try {
    const { error } = await supabase
      .from('game_scores')
      .insert({
        user_id: userId,
        score,
        difficulty,
        time_taken: timeTaken,
        completed
      });
      
    if (error) throw error;
    
    // If game was completed successfully, check achievements and update stats
    if (completed) {
      await updateUserStats(userId, score, true);
      await checkAndUnlockAchievements(userId, difficulty, timeTaken, false);
    }
  } catch (error) {
    console.error('Error recording game score:', error);
  }
};
