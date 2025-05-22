
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialDialog = ({ open, onOpenChange }: TutorialDialogProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Reset step and close dialog when completed
      setStep(1);
      onOpenChange(false);
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">How to Play Color Grid Logic</DialogTitle>
          <DialogDescription className="text-center">
            Step {step} of {totalSteps}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">The Basics</h3>
              <p>Color Grid Logic is similar to Sudoku, but with colors instead of numbers.</p>
              <div className="bg-gray-100 p-4 rounded-md">
                <p>Your goal is to fill the grid so that each row, each column, and each region contains each color exactly once.</p>
              </div>
              <div className="flex justify-center py-2">
                <div className="grid grid-cols-4 gap-1 p-2 bg-gray-200 rounded">
                  {Array(16).fill(0).map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded ${
                      i === 0 ? "bg-blue-400" : 
                      i === 5 ? "bg-green-400" : 
                      i === 10 ? "bg-yellow-400" : 
                      i === 15 ? "bg-red-400" : "bg-white"
                    }`}></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">How to Play</h3>
              <p>Click on an empty cell to select it, then click on a color from the palette to fill it in.</p>
              <p>You can also press number keys 1-4 to select colors quickly.</p>
              <div className="bg-gray-100 p-4 rounded-md">
                <p>Some cells are pre-filled and cannot be changed. Use these as clues to solve the puzzle.</p>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Game Rules</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Each row must contain each color exactly once</li>
                <li>Each column must contain each color exactly once</li>
                <li>Each region must contain each color exactly once</li>
              </ul>
              <div className="bg-gray-100 p-4 rounded-md">
                <p>Regions are the 2×2 squares marked by thicker borders in the easy 4×4 grid (or 3×3 in hard 9×9 grid).</p>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Game Controls</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Undo/Redo</strong> - Fix mistakes or try different approaches</li>
                <li><strong>Reset</strong> - Start the puzzle over</li>
                <li><strong>Hint</strong> - Get help by revealing a correct cell (limited uses)</li>
                <li><strong>Pause</strong> - Pause the game timer</li>
              </ul>
              <div className="bg-gray-100 p-4 rounded-md">
                <p>Use hints sparingly! You only have 3 hints per game.</p>
              </div>
            </div>
          )}
          
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Tips & Strategies</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Start with rows, columns, or regions that already have several colors filled in</li>
                <li>Use the process of elimination to determine where colors must go</li>
                <li>If you're stuck between two possibilities, try one and see if it leads to contradictions</li>
                <li>Complete daily challenges to earn achievements</li>
              </ul>
              <div className="bg-gray-100 p-4 rounded-md">
                <p>Ready to play? Good luck and have fun!</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button onClick={handleNext}>
            {step === totalSteps ? "Start Playing" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
