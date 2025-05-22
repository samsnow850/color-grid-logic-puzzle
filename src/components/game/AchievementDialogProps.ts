
import { Achievement } from "@/lib/achievements";

export interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: Achievement[];
}
