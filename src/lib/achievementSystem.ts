
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

// List of all available achievements
export const achievementsList: Achievement[] = [
  {
    id: "first_win",
    name: "First Victory",
    description: "Complete your first puzzle",
    icon: "award",
    unlocked: false,
  },
  {
    id: "easy_master",
    name: "Easy Master",
    description: "Complete 5 Easy puzzles",
    icon: "award",
    unlocked: false,
    progress: {
      current: 0,
      target: 5,
    },
  },
  {
    id: "hard_master",
    name: "Hard Master",
    description: "Complete 3 Hard puzzles",
    icon: "award",
    unlocked: false,
    progress: {
      current: 0,
      target: 3,
    },
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Complete a puzzle in under 2 minutes",
    icon: "zap",
    unlocked: false,
  },
  {
    id: "no_hint",
    name: "No Help Needed",
    description: "Complete a puzzle without using hints",
    icon: "brain",
    unlocked: false,
  },
  {
    id: "daily_streak",
    name: "Daily Challenger",
    description: "Complete 3 daily puzzles",
    icon: "calendar",
    unlocked: false,
    progress: {
      current: 0,
      target: 3,
    },
  },
];

// Get user achievements from localStorage
export const getUserAchievements = (userId: string): Achievement[] => {
  const savedAchievements = localStorage.getItem(`achievements-${userId}`);
  if (!savedAchievements) {
    return [...achievementsList];
  }
  return JSON.parse(savedAchievements);
};

// Save achievements to localStorage
export const saveAchievements = (userId: string, achievements: Achievement[]) => {
  localStorage.setItem(`achievements-${userId}`, JSON.stringify(achievements));
};

// Unlock an achievement by ID
export const unlockAchievement = (userId: string, achievementId: string): Achievement[] => {
  const achievements = getUserAchievements(userId);
  const achievementIndex = achievements.findIndex(
    (achievement) => achievement.id === achievementId
  );
  
  if (achievementIndex !== -1 && !achievements[achievementIndex].unlocked) {
    achievements[achievementIndex].unlocked = true;
    achievements[achievementIndex].date = new Date();
    saveAchievements(userId, achievements);
    return achievements;
  }
  
  return achievements;
};

// Update achievement progress
export const updateAchievementProgress = (
  userId: string,
  achievementId: string,
  increment: number = 1
): Achievement[] => {
  const achievements = getUserAchievements(userId);
  const achievementIndex = achievements.findIndex(
    (achievement) => achievement.id === achievementId
  );
  
  if (
    achievementIndex !== -1 &&
    !achievements[achievementIndex].unlocked &&
    achievements[achievementIndex].progress
  ) {
    const progress = achievements[achievementIndex].progress!;
    progress.current = Math.min(progress.current + increment, progress.target);
    
    // Check if achievement should be unlocked
    if (progress.current >= progress.target) {
      achievements[achievementIndex].unlocked = true;
      achievements[achievementIndex].date = new Date();
    }
    
    saveAchievements(userId, achievements);
  }
  
  return achievements;
};

// Check puzzles completed achievements
export const checkPuzzleCompletionAchievements = (
  userId: string,
  difficulty: string,
  timeSeconds: number
): Achievement[] => {
  let achievements = getUserAchievements(userId);
  
  // First win achievement
  achievements = unlockAchievement(userId, "first_win");
  
  // Difficulty-specific achievements
  if (difficulty === "easy") {
    achievements = updateAchievementProgress(userId, "easy_master");
  } else if (difficulty === "hard") {
    achievements = updateAchievementProgress(userId, "hard_master");
  }
  
  // Speed demon achievement (under 2 minutes)
  if (timeSeconds < 120) {
    achievements = unlockAchievement(userId, "speed_demon");
  }
  
  return achievements;
};

// Check daily puzzle completion achievement
export const checkDailyAchievements = (userId: string): Achievement[] => {
  return updateAchievementProgress(userId, "daily_streak");
};

// Check no-hint achievement
export const checkNoHintAchievement = (userId: string): Achievement[] => {
  return unlockAchievement(userId, "no_hint");
};
