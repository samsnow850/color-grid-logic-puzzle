
export interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  achieved: boolean;
  progress?: number;
  progressTarget?: number;
  date?: string;
}

export const defaultAchievements: Achievement[] = [
  {
    id: "first_victory",
    type: "first_victory",
    name: "First Victory",
    description: "Complete your first puzzle",
    achieved: false
  },
  {
    id: "easy_master",
    type: "easy_master",
    name: "Easy Master",
    description: "Complete 5 Easy puzzles",
    achieved: false,
    progress: 0,
    progressTarget: 5
  },
  {
    id: "hard_master",
    type: "hard_master",
    name: "Hard Master",
    description: "Complete 3 Hard puzzles",
    achieved: false,
    progress: 0,
    progressTarget: 3
  },
  {
    id: "speed_demon",
    type: "speed_demon",
    name: "Speed Demon",
    description: "Complete a puzzle in under 2 minutes",
    achieved: false
  },
  {
    id: "no_help",
    type: "no_help",
    name: "No Help Needed",
    description: "Complete a puzzle without using hints",
    achieved: false
  },
  {
    id: "daily_streak",
    type: "daily_streak",
    name: "Daily Challenger",
    description: "Complete 3 daily puzzles",
    achieved: false,
    progress: 0,
    progressTarget: 3
  }
];

export const getAchievementById = (achievements: Achievement[], id: string): Achievement | undefined => {
  return achievements.find(a => a.id === id);
};

export const updateAchievementProgress = (
  achievements: Achievement[], 
  id: string, 
  progress: number
): Achievement[] => {
  return achievements.map(a => {
    if (a.id === id) {
      const newProgress = progress;
      const achieved = a.progressTarget ? newProgress >= a.progressTarget : false;
      
      return {
        ...a,
        progress: newProgress,
        achieved: achieved,
        date: achieved && !a.achieved ? new Date().toISOString() : a.date
      };
    }
    return a;
  });
};

export const unlockAchievement = (
  achievements: Achievement[], 
  id: string
): Achievement[] => {
  return achievements.map(a => {
    if (a.id === id) {
      return {
        ...a,
        achieved: true,
        date: a.achieved ? a.date : new Date().toISOString()
      };
    }
    return a;
  });
};
