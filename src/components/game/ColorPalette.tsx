
interface ColorPaletteProps {
  colors: string[];
  onColorSelect: (color: string) => void;
  hintsRemaining?: number;
  onHintRequest?: () => void;
}

const ColorPalette = ({ colors, onColorSelect, hintsRemaining = 0, onHintRequest }: ColorPaletteProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`${color} w-10 h-10 rounded-md cursor-pointer hover:ring-2 hover:ring-blue-500 flex items-center justify-center transition-all duration-200 hover:scale-105`}
            onClick={() => onColorSelect(color)}
          >
            <span className="text-xs font-bold text-white text-shadow">{index + 1}</span>
          </div>
        ))}
      </div>
      
      {onHintRequest && (
        <button 
          onClick={onHintRequest}
          disabled={hintsRemaining <= 0}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
          </svg>
          Hint {hintsRemaining > 0 && `(${hintsRemaining} left)`}
        </button>
      )}
    </div>
  );
};

export default ColorPalette;
