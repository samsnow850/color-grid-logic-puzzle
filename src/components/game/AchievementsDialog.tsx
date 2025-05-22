
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: {
    current: number;
    total: number;
  };
  icon?: React.ReactNode;
}

interface AchievementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: Achievement[];
}

const AchievementsDialog = ({ open, onOpenChange, achievements }: AchievementsDialogProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievements
          </DialogTitle>
          <DialogDescription>
            You've unlocked {unlockedCount} out of {achievements.length} achievements
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`border rounded-lg p-4 transition-all ${
                achievement.unlocked 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-200 opacity-70"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  
                  {achievement.progress && (
                    <div className="mt-2">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {achievement.progress.current}/{achievement.progress.total}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  {achievement.unlocked ? (
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="bg-gray-200 text-gray-400 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.707-9.293a1 1 0 000 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 12.586l-3.293-3.293a1 1 0 00-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementsDialog;
