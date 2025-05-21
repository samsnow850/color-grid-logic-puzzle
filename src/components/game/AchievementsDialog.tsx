
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Award, 
  Calendar, 
  Zap, 
  Brain, 
  LockIcon, 
  CheckCircle,
  Trophy,
  Medal,
  Star
} from "lucide-react";
import { Achievement, getUserAchievements, achievementsList } from "@/lib/achievementSystem";
import { useAuth } from "@/hooks/useAuth";

interface AchievementsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AchievementsDialog = ({ open, onOpenChange }: AchievementsDialogProps) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    if (open) {
      const userAchievements = user ? getUserAchievements(user.id) : [...achievementsList];
      setAchievements(userAchievements);
      setUnlockedCount(userAchievements.filter(a => a.unlocked).length);
    }
  }, [user, open]);

  // Map achievement icons to components
  const getAchievementIcon = (iconName: string, unlocked: boolean) => {
    const iconProps = { 
      size: 24,
      className: unlocked ? "text-yellow-500" : "text-gray-400"
    };

    switch (iconName) {
      case "award":
        return <Award {...iconProps} />;
      case "calendar":
        return <Calendar {...iconProps} />;
      case "zap":
        return <Zap {...iconProps} />;
      case "brain":
        return <Brain {...iconProps} />;
      case "trophy":
        return <Trophy {...iconProps} />;
      case "medal":
        return <Medal {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">
          Achievements
        </DialogTitle>
        <DialogDescription>
          You've unlocked {unlockedCount} out of {achievements.length} achievements
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border ${
                achievement.unlocked 
                  ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30" 
                  : "border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  achievement.unlocked ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-gray-100 dark:bg-gray-800"
                }`}>
                  {getAchievementIcon(achievement.icon, achievement.unlocked)}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    achievement.unlocked ? "text-yellow-900 dark:text-yellow-300" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                  
                  {/* Progress bar for achievements with progress */}
                  {achievement.progress && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 rounded-full transition-all duration-300 ease-in-out"
                          style={{ 
                            width: `${(achievement.progress.current / achievement.progress.target) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {achievement.progress.current}/{achievement.progress.target}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  {achievement.unlocked ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <LockIcon className="text-gray-300 dark:text-gray-600" size={20} />
                  )}
                </div>
              </div>
              
              {achievement.date && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Unlocked: {new Date(achievement.date).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <DialogFooter>
        <Button
          onClick={() => onOpenChange && onOpenChange(false)}
          className="w-full"
        >
          Close
        </Button>
      </DialogFooter>
    </>
  );
};

export default AchievementsDialog;
