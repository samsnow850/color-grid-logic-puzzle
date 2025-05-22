import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  achieved: boolean;
  progress?: number;
  progressTarget?: number;
  achievedAt?: string;
}

export const ACHIEVEMENT_TYPES = {
  first_victory: "first_victory",
  easy_master: "easy_master",
  hard_master: "hard_master",
  speed_demon: "speed_demon",
  no_help: "no_help",
  daily_challenger: "daily_challenger",
};

export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const achievements: Achievement[] = [
    {
      id: ACHIEVEMENT_TYPES.first_victory,
      type: ACHIEVEMENT_TYPES.first_victory,
      name: "First Victory",
      description: "Complete your first puzzle",
      achieved: false,
    },
    {
      id: ACHIEVEMENT_TYPES.easy_master,
      type: ACHIEVEMENT_TYPES.easy_master,
      name: "Easy Master",
      description: "Complete 5 Easy puzzles",
      achieved: false,
      progress: 0,
      progressTarget: 5,
    },
    {
      id: ACHIEVEMENT_TYPES.hard_master,
      type: ACHIEVEMENT_TYPES.hard_master,
      name: "Hard Master",
      description: "Complete 3 Hard puzzles",
      achieved: false,
      progress: 0,
      progressTarget: 3,
    },
    {
      id: ACHIEVEMENT_TYPES.speed_demon,
      type: ACHIEVEMENT_TYPES.speed_demon,
      name: "Speed Demon",
      description: "Complete a puzzle in under 2 minutes",
      achieved: false,
    },
    {
      id: ACHIEVEMENT_TYPES.no_help,
      type: ACHIEVEMENT_TYPES.no_help,
      name: "No Help Needed",
      description: "Complete a puzzle without using hints",
      achieved: false,
    },
    {
      id: ACHIEVEMENT_TYPES.daily_challenger,
      type: ACHIEVEMENT_TYPES.daily_challenger,
      name: "Daily Challenger",
      description: "Complete 3 daily puzzles",
      achieved: false,
      progress: 0,
      progressTarget: 3,
    },
  ];
  
  if (!userId) return achievements;
  
  try {
    // Get user's unlocked achievements from the database
    const { data: unlockedAchievements, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId);
      
    if (error) {
      console.error("Error fetching achievements:", error);
      return achievements;
    }
    
    // Mark achievements as achieved if they are in the database
    if (unlockedAchievements && unlockedAchievements.length > 0) {
      unlockedAchievements.forEach((achievement) => {
        const index = achievements.findIndex((a) => a.type === achievement.achievement_type);
        if (index >= 0) {
          achievements[index].achieved = true;
          achievements[index].achievedAt = achievement.achieved_at;
          achievements[index].id = achievement.id;
        }
      });
    }
    
    // Calculate progress for achievements that have progress tracking
    const { data: gameScores } = await supabase
      .from("game_scores")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true);
      
    if (gameScores) {
      // Easy Master progress
      const easyGames = gameScores.filter((score) => score.difficulty === "easy").length;
      const easyMasterAchievement = achievements.find((a) => a.type === ACHIEVEMENT_TYPES.easy_master);
      if (easyMasterAchievement) {
        easyMasterAchievement.progress = Math.min(easyGames, easyMasterAchievement.progressTarget || 5);
      }
      
      // Hard Master progress
      const hardGames = gameScores.filter((score) => score.difficulty === "hard").length;
      const hardMasterAchievement = achievements.find((a) => a.type === ACHIEVEMENT_TYPES.hard_master);
      if (hardMasterAchievement) {
        hardMasterAchievement.progress = Math.min(hardGames, hardMasterAchievement.progressTarget || 3);
      }
      
      // Daily Challenger progress
      const dailyGames = gameScores.filter((score) => score.difficulty === "daily").length;
      const dailyChallengerAchievement = achievements.find((a) => a.type === ACHIEVEMENT_TYPES.daily_challenger);
      if (dailyChallengerAchievement) {
        dailyChallengerAchievement.progress = Math.min(dailyGames, dailyChallengerAchievement.progressTarget || 3);
      }
    }
    
    return achievements;
  } catch (error) {
    console.error("Error processing achievements:", error);
    return achievements;
  }
};

export const recordGameScore = async (
  userId: string,
  score: number,
  difficulty: string,
  timeTaken: number,
  completed: boolean = true,
  usedHint: boolean = false
): Promise<void> => {
  try {
    // Add game score to the database
    const { data: scoreData, error: scoreError } = await supabase
      .from("game_scores")
      .insert({
        user_id: userId,
        score,
        difficulty,
        time_taken: timeTaken,
        completed
      })
      .select("*")
      .single();
      
    if (scoreError) {
      console.error("Error recording game score:", scoreError);
      return;
    }
    
    // No need to check for achievements if game is not completed
    if (!completed) return;
    
    // Check for achievements
    const userAchievements = await getUserAchievements(userId);
    const newAchievements = [];
    
    // First Victory
    const firstVictory = userAchievements.find((a) => a.type === ACHIEVEMENT_TYPES.first_victory);
    if (firstVictory && !firstVictory.achieved) {
      newAchievements.push({
        user_id: userId,
        achievement_type: ACHIEVEMENT_TYPES.first_victory,
      });
    }
    
    // Speed Demon - Complete in under 2 minutes (120 seconds)
    const speedDemon = userAchievements.find((a) => a.type === ACHIEVEMENT_TYPES.speed_demon);
    if (speedDemon && !speedDemon.achieved && timeTaken < 120) {
      newAchievements.push({
        user_id: userId,
        achievement_type: ACHIEVEMENT_TYPES.speed_demon,
      });
    }
    
    // No Help Needed
    const noHelp = userAchievements.find((a) => a.type === ACHIEVEMENT_TYPES.no_help);
    if (noHelp && !noHelp.achieved && !usedHint) {
      newAchievements.push({
        user_id: userId,
        achievement_type: ACHIEVEMENT_TYPES.no_help,
      });
    }
    
    // Easy Master - 5 easy puzzles
    const easyMaster = userAchievements.find((a) => a.type === ACHIEVEMENT_TYPES.easy_master);
    if (easyMaster && !easyMaster.achieved && difficulty === "easy" && 
        (easyMaster.progress || 0) >= 4) { // Already completed 4, this is the 5th
      newAchievements.push({
        user_id: userId,
        achievement_type: ACHIEVEMENT_TYPES.easy_master,
      });
    }
    
    // Hard Master - 3 hard puzzles
    const hardMaster = userAchievements.find((a) => a.type === ACHIEVEMENT_TYPES.hard_master);
    if (hardMaster && !hardMaster.achieved && difficulty === "hard" && 
        (hardMaster.progress || 0) >= 2) { // Already completed 2, this is the 3rd
      newAchievements.push({
        user_id: userId,
        achievement_type: ACHIEVEMENT_TYPES.hard_master,
      });
    }
    
    // Daily Challenger - 3 daily puzzles
    const dailyChallenger = userAchievements.find((a) => a.type === ACHIEVEMENT_TYPES.daily_challenger);
    if (dailyChallenger && !dailyChallenger.achieved && difficulty === "daily" && 
        (dailyChallenger.progress || 0) >= 2) { // Already completed 2, this is the 3rd
      newAchievements.push({
        user_id: userId,
        achievement_type: ACHIEVEMENT_TYPES.daily_challenger,
      });
    }
    
    // Record new achievements
    if (newAchievements.length > 0) {
      const { error: achievementsError } = await supabase
        .from("achievements")
        .insert(newAchievements);
        
      if (achievementsError) {
        console.error("Error recording achievements:", achievementsError);
      } else {
        toast.success(`Achievement${newAchievements.length > 1 ? 's' : ''} unlocked!`, {
          description: "Check your achievements page to see what you've earned."
        });
      }
    }
    
    // Update user stats
    try {
      // First, get current user stats
      const { data: currentStats, error: statsError } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (statsError) {
        console.error("Error fetching user stats:", statsError);
        return;
      }
      
      if (currentStats) {
        // Update existing stats
        const gamesPlayed = currentStats.games_played + 1;
        const gamesWon = currentStats.games_won + 1;
        const totalScore = currentStats.total_score + score;
        const averageScore = Math.round(totalScore / gamesWon);
        const highestScore = Math.max(currentStats.highest_score, score);
        
        await supabase
          .from("user_stats")
          .update({
            games_played: gamesPlayed,
            games_won: gamesWon,
            total_score: totalScore,
            average_score: averageScore,
            highest_score: highestScore,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", userId);
      } else {
        // Create new stats record
        await supabase
          .from("user_stats")
          .insert({
            user_id: userId,
            games_played: 1,
            games_won: 1,
            total_score: score,
            average_score: score,
            highest_score: score
          });
      }
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
    
  } catch (error) {
    console.error("Error in recordGameScore:", error);
  }
};
