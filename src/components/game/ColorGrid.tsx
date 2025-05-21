
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
  
  return (
    <div 
      className={cn(
        "grid gap-1 p-1 bg-gray-200 rounded-lg",
        gridSize === 9 && "max-w-[500px]"
      )}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {displayGrid.map((row, rowIndex) => (
        row.map((cell, colIndex) => {
          // Calculate region boundaries for borders
          const isTopEdge = rowIndex % regionSize === 0;
          const isLeftEdge = colIndex % regionSize === 0;
          const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
          const isPrefilled = displayOriginal[rowIndex]?.[colIndex] !== "";
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square flex items-center justify-center rounded-sm cursor-pointer",
                cell || "bg-white",
                isSelected && "ring-2 ring-blue-500",
                isPrefilled && "cursor-not-allowed",
                isTopEdge && "border-t-2 border-gray-500",
                isLeftEdge && "border-l-2 border-gray-500",
                rowIndex === gridSize - 1 && "border-b-2 border-gray-500",
                colIndex === gridSize - 1 && "border-r-2 border-gray-500"
              )}
              onClick={() => onCellClick(rowIndex, colIndex)}
              style={{
                width: gridSize === 9 ? "40px" : gridSize === 6 ? "50px" : "60px",
                height: gridSize === 9 ? "40px" : gridSize === 6 ? "50px" : "60px",
              }}
            />
          );
        })
      ))}
    </div>
  );
};

export default ColorGrid;
