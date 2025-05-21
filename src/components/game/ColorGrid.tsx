
import { cn } from "@/lib/utils";

interface ColorGridProps {
  grid: string[][];
  originalGrid: string[][];
  gridSize: number;
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

const ColorGrid = ({
  grid,
  originalGrid,
  gridSize,
  selectedCell,
  onCellClick,
}: ColorGridProps) => {
  // Calculate region size (sqrt of gridSize)
  const regionSize = Math.sqrt(gridSize);
  
  // Ensure the grid is fully initialized with empty cells if needed
  const ensureFullGrid = () => {
    // If grid is incomplete, return a properly sized grid
    if (!grid || grid.length < gridSize || grid.some(row => row.length < gridSize)) {
      return Array(gridSize).fill("").map(() => Array(gridSize).fill(""));
    }
    return grid;
  };
  
  const displayGrid = ensureFullGrid();
  const displayOriginal = originalGrid && originalGrid.length === gridSize ? 
    originalGrid : Array(gridSize).fill("").map(() => Array(gridSize).fill(""));
  
  // Count pre-filled cells for debugging
  console.log("Pre-filled cell count:", displayOriginal.flat().filter(cell => cell !== "").length);
  
  // Calculate cell size based on grid size
  const getCellSize = () => {
    if (gridSize === 9) return "w-9 h-9 md:w-11 md:h-11";
    if (gridSize === 7) return "w-10 h-10 md:w-12 md:h-12";
    return "w-14 h-14 md:w-16 md:h-16"; // For 4x4
  };
  
  return (
    <div 
      className={cn(
        "grid gap-px bg-gray-800 border border-gray-800 rounded-lg p-1 shadow-lg mx-auto",
        gridSize === 9 && "max-w-[360px] md:max-w-[420px]",
        gridSize === 7 && "max-w-[300px] md:max-w-[360px]",
        gridSize === 4 && "max-w-[240px] md:max-w-[280px]"
      )}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {displayGrid.map((row, rowIndex) => (
        row.map((cell, colIndex) => {
          // Calculate borders based on grid size
          const isTopEdge = rowIndex % regionSize === 0;
          const isLeftEdge = colIndex % regionSize === 0;
          const isBottomEdge = rowIndex === gridSize - 1;
          const isRightEdge = colIndex === gridSize - 1;
          
          // Special case for 7x7 grid
          let borderClasses = "";
          if (gridSize === 7) {
            // Define custom region boundaries for 7x7
            const isTopEdge = rowIndex === 0 || rowIndex === 3 || rowIndex === 5;
            const isLeftEdge = colIndex === 0 || colIndex === 3;
            borderClasses = cn(
              isTopEdge && "border-t-2 border-gray-900",
              isLeftEdge && "border-l-2 border-gray-900",
              isBottomEdge && "border-b-2 border-gray-900",
              isRightEdge && "border-r-2 border-gray-900"
            );
          } else {
            borderClasses = cn(
              isTopEdge && "border-t-2 border-gray-900",
              isLeftEdge && "border-l-2 border-gray-900",
              isBottomEdge && "border-b-2 border-gray-900",
              isRightEdge && "border-r-2 border-gray-900"
            );
          }
          
          const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
          const isPrefilled = displayOriginal[rowIndex]?.[colIndex] !== "";
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "flex items-center justify-center transition-all",
                getCellSize(),
                cell ? cell : "bg-white",
                isSelected && "ring-2 ring-purple-500 ring-offset-1",
                isPrefilled && "cursor-not-allowed",
                !isPrefilled && "cursor-pointer hover:brightness-110",
                borderClasses
              )}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {isPrefilled && (
                <span className="block w-2 h-2 bg-white dark:bg-gray-300 rounded-full opacity-70"></span>
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default ColorGrid;
