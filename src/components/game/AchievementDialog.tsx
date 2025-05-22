
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Award, Clock, Shield, Calendar, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Define Achievement interface here since we're importing it
interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  achieved: boolean;
  progress?: number;
  progressTarget?: number;
  date?: string;
}

const getAchievementIcon = (type: string) => {
  switch (type) {
    case "first_victory":
      return <Trophy className="w-6 h-6 text-gray-400" />;
    case "easy_master":
      return <Award className="w-6 h-6 text-gray-400" />;
    case "hard_master":
      return <Award className="w-6 h-6 text-gray-400" />;
    case "speed_demon":
      return <Clock className="w-6 h-6 text-gray-400" />;
    case "no_help":
      return <Shield className="w-6 h-6 text-gray-400" />;
    case "daily_streak":
      return <Calendar className="w-6 h-6 text-gray-400" />;
    default:
      return <Award className="w-6 h-6 text-gray-400" />;
  }
};

const AchievementDialog = ({ 
  open, 
  onOpenChange, 
  achievements 
}: AchievementDialogProps) => {
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    // Count unlocked achievements
    const count = achievements.filter(achievement => achievement.achieved).length;
    setUnlockedCount(count);
  }, [achievements]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Achievements</h2>
            <p className="text-muted-foreground text-sm">
              You've unlocked {unlockedCount} out of {achievements.length} achievements
            </p>
          </div>
          <X 
            className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" 
            onClick={() => onOpenChange(false)}
          />
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-4 rounded-lg border ${achievement.achieved ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getAchievementIcon(achievement.type)}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  
                  {achievement.progress !== undefined && achievement.progressTarget !== undefined && (
                    <div className="mt-2">
                      <Progress 
                        value={(achievement.progress / achievement.progressTarget) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.progress}/{achievement.progressTarget}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  {achievement.achieved ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1.16667V12.8333M1.16675 7H12.8334" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementDialog;
