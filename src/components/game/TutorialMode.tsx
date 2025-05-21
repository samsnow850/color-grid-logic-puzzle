
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Book, ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TutorialStep {
  title: string;
  description: React.ReactNode;
  image?: string;
}

interface TutorialModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialMode = ({ open, onOpenChange }: TutorialModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to Color Grid Logic!",
      description: (
        <div className="space-y-2">
          <p>
            Color Grid Logic is a puzzle game inspired by Sudoku, but using colors instead of numbers.
          </p>
          <p>
            This short tutorial will guide you through the basic rules and gameplay mechanics.
          </p>
        </div>
      ),
    },
    {
      title: "The Basic Rules",
      description: (
        <div className="space-y-2">
          <p>The goal is to fill the grid following these rules:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Each row must contain each color exactly once</li>
            <li>Each column must contain each color exactly once</li>
            <li>Each region (outlined by thicker borders) must contain each color exactly once</li>
          </ul>
          <p>Some cells are pre-filled to get you started.</p>
        </div>
      ),
    },
    {
      title: "How to Play",
      description: (
        <div className="space-y-2">
          <p>Playing is simple:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click on any empty cell to select it</li>
            <li>Choose a color from the palette or use keyboard numbers (1-9)</li>
            <li>The color will be placed in the selected cell</li>
            <li>Continue until the entire grid is filled correctly</li>
          </ol>
        </div>
      ),
    },
    {
      title: "Using Hints",
      description: (
        <div className="space-y-2">
          <p>Stuck on a puzzle? You can use hints to help:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Each puzzle provides a limited number of hints</li>
            <li>Click the <span className="font-bold">Hint</span> button to reveal one correct cell</li>
            <li>Use hints wisely - they count against your achievements!</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Undo and Redo",
      description: (
        <div className="space-y-2">
          <p>Made a mistake? No problem:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the <span className="font-bold">Undo</span> button to revert your last move</li>
            <li>Use the <span className="font-bold">Redo</span> button if you change your mind</li>
            <li>You can undo multiple moves in sequence</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Achievements",
      description: (
        <div className="space-y-2">
          <p>Earn achievements as you play:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Complete puzzles at different difficulty levels</li>
            <li>Solve puzzles quickly</li>
            <li>Complete puzzles without using hints</li>
            <li>Play daily challenges regularly</li>
          </ul>
          <p>Check your achievements page to track your progress!</p>
        </div>
      ),
    },
    {
      title: "Ready to Play?",
      description: (
        <div className="space-y-2">
          <p>That's it! You now know everything you need to get started.</p>
          <p>Choose a difficulty level and start solving puzzles to earn achievements and improve your logical thinking!</p>
          <p className="font-medium">Good luck and have fun!</p>
        </div>
      ),
    },
  ];

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
      setCurrentStep(0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) setCurrentStep(0);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Book className="h-5 w-5 text-purple-600" />
            <span>{tutorialSteps[currentStep].title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <Progress 
          value={(currentStep + 1) / tutorialSteps.length * 100} 
          className="my-2 h-1"
        />
        <DialogDescription className="text-sm text-center text-muted-foreground">
          Step {currentStep + 1} of {tutorialSteps.length}
        </DialogDescription>
        
        <div className="py-4">
          {tutorialSteps[currentStep].description}
          
          {tutorialSteps[currentStep].image && (
            <div className="mt-4 flex justify-center">
              <img 
                src={tutorialSteps[currentStep].image} 
                alt={`Tutorial step ${currentStep + 1}`}
                className="max-w-full rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNextStep}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
          >
            {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
            {currentStep < tutorialSteps.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialMode;
