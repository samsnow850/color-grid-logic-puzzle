
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Home, RefreshCw } from "lucide-react";

interface PauseOverlayProps {
  onResume: () => void;
  onNewGame?: () => void; // Make these optional
  onGoHome?: () => void;
}

const PauseOverlay = ({ onResume, onNewGame, onGoHome }: PauseOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Game Paused</h2>
        <p className="mb-6 text-gray-600">
          Take your time! When you're ready to continue, click the button below.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={onResume}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 text-lg w-full"
          >
            <Play size={24} />
            Resume Game
          </Button>
          
          {onNewGame && (
            <Button
              onClick={onNewGame}
              variant="outline"
              className="px-6 py-4 flex items-center justify-center gap-2 text-lg w-full"
            >
              <RefreshCw size={20} />
              New Game
            </Button>
          )}
          
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="ghost"
              className="px-6 py-2 flex items-center justify-center gap-2 text-base w-full"
            >
              <Home size={18} />
              Return to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PauseOverlay;
