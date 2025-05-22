
import { Button } from "@/components/ui/button";

interface PauseOverlayProps {
  onResume: () => void;
}

const PauseOverlay = ({ onResume }: PauseOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        <h2 className="text-5xl font-bold text-white">Game Paused</h2>
        <p className="text-xl text-gray-300">Timer has been stopped</p>
        <Button 
          size="lg" 
          onClick={onResume}
          className="mt-8 px-8 py-6 text-xl bg-purple-600 hover:bg-purple-700"
        >
          Resume Game
        </Button>
      </div>
    </div>
  );
};

export default PauseOverlay;
