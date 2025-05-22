
import { Achievement } from "@/lib/achievements";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";

interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: Achievement | null;
  onContinue: () => void;
}

const AchievementDialog = ({ 
  open, 
  onOpenChange, 
  achievement,
  onContinue 
}: AchievementDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Achievement Unlocked!</DialogTitle>
        </DialogHeader>
        
        {achievement && (
          <div className="py-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{achievement.name}</h3>
              <p className="text-muted-foreground">
                {achievement.description}
              </p>
              
              <div className="pt-4">
                <Button
                  className="rounded-lg"
                  onClick={() => {
                    onOpenChange(false);
                    onContinue();
                  }}
                >
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="pt-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    window.location.href = '/achievements';
                  }}
                >
                  View all achievements
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AchievementDialog;
