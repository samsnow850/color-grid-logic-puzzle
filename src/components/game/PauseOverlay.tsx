
import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface PauseOverlayProps {
  onResume: () => void;
}

const PauseOverlay = ({ onResume }: PauseOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Game Paused</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Take your time! When you're ready to continue, click the button below.
        </p>
        <Button
          onClick={onResume}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 text-lg w-full"
        >
          <Play size={24} />
          Resume Game
        </Button>
      </div>
    </div>
  );
};

export default PauseOverlay;
