
interface ColorPaletteProps {
  colors: string[];
  onColorSelect: (color: string) => void;
}

const ColorPalette = ({ colors, onColorSelect }: ColorPaletteProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`${color} w-10 h-10 rounded-md cursor-pointer hover:ring-2 hover:ring-blue-500 flex items-center justify-center`}
          onClick={() => onColorSelect(color)}
        >
          <span className="text-xs font-bold text-white text-shadow">{index + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorPalette;
