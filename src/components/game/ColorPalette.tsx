
import React from 'react';

export interface ColorPaletteProps {
  colors: string[];
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
}

const ColorPalette = ({ colors, selectedColor, onColorSelect }: ColorPaletteProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {colors.map((color, index) => {
        const isSelected = selectedColor === color;
        return (
          <button
            key={index}
            className={`w-10 h-10 rounded-md transition-all ${color} ${
              isSelected ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' : 'hover:scale-110'
            }`}
            onClick={() => onColorSelect(color)}
            aria-label={`Color ${index + 1}`}
            aria-pressed={isSelected}
          >
            <span className="sr-only">Color {index + 1}</span>
            <span className="text-white font-medium flex items-center justify-center h-full">
              {index + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ColorPalette;
