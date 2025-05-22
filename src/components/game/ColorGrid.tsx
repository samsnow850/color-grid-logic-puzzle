
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
  
  // Calculate cell size based on grid size
  const getCellSize = () => {
    if (gridSize <= 4) return "62px";
    if (gridSize <= 6) return "52px";
    if (gridSize <= 9) return "40px";
    return "36px";
  };
  
  return (
    <div 
      className={cn(
        "grid gap-1 bg-white border border-gray-200 rounded-lg p-1.5 shadow-md",
        gridSize === 10 && "max-w-[540px]",
        gridSize === 9 && "max-w-[420px]",  // Reduced from 500px
        gridSize === 6 && "max-w-[350px]",
        gridSize === 4 && "max-w-[280px]"
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
                "aspect-square flex items-center justify-center rounded shadow-sm transition-all",
                cell ? `${cell} shadow-inner` : "bg-white border border-gray-100",
                isSelected && "ring-2 ring-purple-400",
                isPrefilled && "cursor-not-allowed",
                !isPrefilled && "cursor-pointer hover:brightness-110",
                isTopEdge && "border-t-2 border-gray-500",
                isLeftEdge && "border-l-2 border-gray-500",
                rowIndex === gridSize - 1 && "border-b-2 border-gray-500",
                colIndex === gridSize - 1 && "border-r-2 border-gray-500"
              )}
              onClick={() => onCellClick(rowIndex, colIndex)}
              style={{
                width: getCellSize(),
                height: getCellSize(),
              }}
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
