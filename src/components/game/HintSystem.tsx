
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HintSystemProps {
  grid: string[][];
  solution: string[][];
  hintsRemaining: number;
  onHintUsed: () => void;
  onCellReveal: (row: number, col: number, value: string) => void;
  disabled: boolean;
}

const HintSystem = ({ 
  grid, 
  solution, 
  hintsRemaining, 
  onHintUsed, 
  onCellReveal,
  disabled
}: HintSystemProps) => {
  const { toast } = useToast();
  const [isThinking, setIsThinking] = useState(false);

  const findHint = () => {
    if (hintsRemaining <= 0 || disabled) {
      toast({
        title: "No hints remaining",
        description: "You've used all available hints for this puzzle.",
        variant: "destructive",
      });
      return;
    }

    setIsThinking(true);
    
    // Simulate thinking time (can be removed in production)
    setTimeout(() => {
      // Find a random empty cell that we can provide a hint for
      const emptyCells: [number, number][] = [];
      
      // Collect all empty cells
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] === "") {
            emptyCells.push([row, col]);
          }
        }
      }
      
      if (emptyCells.length === 0) {
        toast({
          title: "No hints available",
          description: "All cells are already filled. Try checking for errors instead.",
        });
        setIsThinking(false);
        return;
      }
      
      // Select a random empty cell
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [hintRow, hintCol] = emptyCells[randomIndex];
      
      // Get the correct value from the solution
      const correctValue = solution[hintRow][hintCol];
      
      // Call the hint used callback
      onHintUsed();
      
      // Update the grid with the hint
      onCellReveal(hintRow, hintCol, correctValue);
      
      toast({
        title: "Hint provided",
        description: `A cell has been filled for you. ${hintsRemaining - 1} hints remaining.`,
      });
      
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={findHint}
        disabled={hintsRemaining <= 0 || isThinking || disabled}
        className="flex items-center gap-1"
      >
        <HelpCircle className="h-4 w-4" />
        {isThinking ? "Finding hint..." : "Hint"}
      </Button>
      <span className={`text-sm ${hintsRemaining > 0 ? "text-purple-600" : "text-gray-400"}`}>
        {hintsRemaining} {hintsRemaining === 1 ? "hint" : "hints"} remaining
      </span>
    </div>
  );
};

export default HintSystem;
