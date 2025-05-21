
interface ColorPaletteProps {
  colors: string[];
  onColorSelect: (color: string) => void;
}

const ColorPalette = ({ colors, onColorSelect }: ColorPaletteProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 pt-2">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`${color} w-12 h-12 rounded-full cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center`}
          onClick={() => onColorSelect(color)}
        >
          <span className="sr-only">Color {index + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorPalette;
