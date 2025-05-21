
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Achievement, getUserAchievements } from '@/lib/achievements';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) {
        const defaultAchievements = await getUserAchievements('');
        setAchievements(defaultAchievements);
        setUnlockedCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userAchievements = await getUserAchievements(user.id);
        setAchievements(userAchievements);
        
        // Count unlocked achievements
        const unlocked = userAchievements.filter(a => a.achieved).length;
        setUnlockedCount(unlocked);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  return {
    achievements,
    loading,
    unlockedCount,
    totalCount: achievements.length,
    refresh: async () => {
      if (user) {
        setLoading(true);
        const refreshedAchievements = await getUserAchievements(user.id);
        setAchievements(refreshedAchievements);
        setUnlockedCount(refreshedAchievements.filter(a => a.achieved).length);
        setLoading(false);
      }
    }
  };
};
