
import React, { useMemo } from 'react';

interface CellProps {
  value: string;
  isFixed?: boolean;
  isHint?: boolean;
  rowIndex: number;
  colIndex: number;
  onCellValueChange: (rowIndex: number, colIndex: number, newValue: string) => void;
  animationSpeed?: number;
  showSolution?: boolean;
  solutionValue?: string;
}

interface GridComponentProps {
  grid: any[][];
  solution: any[][];
  showSolution?: boolean;
  hints?: { rowIndex: number; colIndex: number; value: string }[];
  animationSpeed?: number;
  onCellValueChange: (rowIndex: number, colIndex: number, newValue: string) => void;
}

const Cell = ({
  value,
  isFixed = false,
  isHint = false,
  rowIndex,
  colIndex,
  onCellValueChange,
  animationSpeed = 50,
  showSolution = false,
  solutionValue = ''
}: CellProps) => {
  // Calculate animation delay based on position and animation speed
  const animationDelay = useMemo(() => {
    if (!showSolution) return 0;
    const delay = (rowIndex + colIndex) * animationSpeed;
    return delay > 2000 ? 2000 : delay; // Cap at 2 seconds
  }, [rowIndex, colIndex, animationSpeed, showSolution]);

  // Apply background color based on value
  const getBgColor = () => {
    if (showSolution && solutionValue) {
      return `bg-blue-100`;
    } else if (value) {
      return isHint ? 'bg-yellow-100' : isFixed ? 'bg-gray-100' : 'bg-white';
    }
    return 'bg-white';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFixed) return;
    
    // Allow only numbers
    const newValue = e.target.value.replace(/[^1-9]/g, '');
    if (newValue.length <= 1) {
      onCellValueChange(rowIndex, colIndex, newValue);
    }
  };

  return (
    <div
      className={`relative border border-gray-300 ${getBgColor()} rounded-md overflow-hidden transition-colors`}
      style={{ 
        aspectRatio: '1/1',
      }}
    >
      {showSolution ? (
        <div 
          className="absolute inset-0 flex items-center justify-center font-bold bg-blue-500 text-white transform scale-0 opacity-0 transition-all"
          style={{
            animation: showSolution ? `scaleIn 0.3s ease-out forwards ${animationDelay}ms` : 'none',
          }}
        >
          {solutionValue}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className={`w-full h-full text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            isFixed ? 'font-bold text-gray-700' : isHint ? 'text-yellow-600' : 'text-blue-600'
          }`}
          readOnly={isFixed || showSolution}
        />
      )}
    </div>
  );
};

const GridComponent = ({ 
  grid, 
  solution, 
  showSolution = false, 
  hints = [],
  animationSpeed = 50,
  onCellValueChange 
}: GridComponentProps) => {
  // Get the grid dimensions
  const gridSize = grid.length;
  
  // Determine region size (e.g. 3x3 for a 9x9 grid)
  const regionSize = Math.sqrt(gridSize);

  return (
    <div 
      className={`grid gap-1 p-4 bg-white rounded-lg shadow-inner mx-auto`}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        width: gridSize <= 4 ? "280px" : "400px",
        height: gridSize <= 4 ? "280px" : "400px",
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // Check if this cell has a hint
          const hasHint = hints.some(
            hint => hint.rowIndex === rowIndex && hint.colIndex === colIndex
          );

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value || ''}
              isFixed={cell.isFixed || false}
              isHint={cell.isHint || hasHint}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onCellValueChange={onCellValueChange}
              animationSpeed={animationSpeed}
              showSolution={showSolution}
              solutionValue={solution ? String(solution[rowIndex][colIndex]) : ''}
            />
          );
        })
      )}
    </div>
  );
};

export default GridComponent;
