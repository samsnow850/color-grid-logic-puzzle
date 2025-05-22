
import { Achievement } from "@/components/game/AchievementsDialog";

export const defaultAchievements: Achievement[] = [
  {
    id: "first_victory",
    name: "First Victory",
    description: "Complete your first puzzle",
    unlocked: false
  },
  {
    id: "easy_master",
    name: "Easy Master",
    description: "Complete 5 Easy puzzles",
    unlocked: false,
    progress: {
      current: 0,
      total: 5
    }
  },
  {
    id: "hard_master",
    name: "Hard Master",
    description: "Complete 3 Hard puzzles",
    unlocked: false,
    progress: {
      current: 0,
      total: 3
    }
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Complete a puzzle in under 2 minutes",
    unlocked: false
  },
  {
    id: "no_hints",
    name: "No Help Needed",
    description: "Complete a puzzle without using hints",
    unlocked: false
  },
  {
    id: "daily_challenger",
    name: "Daily Challenger",
    description: "Complete 3 daily puzzles",
    unlocked: false,
    progress: {
      current: 0,
      total: 3
    }
  }
];

export function unlockAchievement(achievements: Achievement[], id: string): Achievement[] {
  return achievements.map(achievement => {
    if (achievement.id === id) {
      return { ...achievement, unlocked: true };
    }
    return achievement;
  });
}

export function updateAchievementProgress(achievements: Achievement[], id: string, increment: number = 1): Achievement[] {
  return achievements.map(achievement => {
    if (achievement.id === id && achievement.progress) {
      const newCurrent = Math.min(achievement.progress.current + increment, achievement.progress.total);
      const newUnlocked = newCurrent >= achievement.progress.total;
      
      return { 
        ...achievement, 
        progress: { ...achievement.progress, current: newCurrent },
        unlocked: newUnlocked
      };
    }
    return achievement;
  });
}

export function saveAchievements(achievements: Achievement[]) {
  localStorage.setItem('achievements', JSON.stringify(achievements));
}

export function loadAchievements(): Achievement[] {
  const saved = localStorage.getItem('achievements');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved achievements', e);
    }
  }
  return defaultAchievements;
}
