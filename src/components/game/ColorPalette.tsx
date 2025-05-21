
import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  colors: string[];
  onColorSelect: (color: string) => void;
}

const ColorPalette = ({ colors, onColorSelect }: ColorPaletteProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {colors.map((color, index) => (
        <button
          key={index}
          className={cn(
            color,
            "w-12 h-12 rounded-md shadow-md hover:brightness-110 transition-all relative"
          )}
          onClick={() => onColorSelect(color)}
          aria-label={`Select color ${index + 1}`}
        >
          <span className="absolute top-0.5 left-1 text-xs bg-white bg-opacity-60 rounded-full w-5 h-5 flex items-center justify-center text-gray-800 font-bold">
            {index + 1}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ColorPalette;
