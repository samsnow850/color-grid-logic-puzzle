
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

interface GameTimerProps {
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onTimeUpdate?: (seconds: number) => void; // Added a callback for time tracking
  // Add time and setTime props
  time?: number;
  setTime?: React.Dispatch<React.SetStateAction<number>>;
}

const GameTimer = ({ isRunning, onPause, onResume, onTimeUpdate, time, setTime }: GameTimerProps) => {
  const [internalSeconds, setInternalSeconds] = useState(0);
  
  // Use either external time state or internal state
  const seconds = time !== undefined ? time : internalSeconds;
  const updateSeconds = setTime || setInternalSeconds;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        updateSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          // Call the optional callback with the updated time
          if (onTimeUpdate) onTimeUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate, updateSeconds]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="px-3 py-1 bg-gray-100 rounded-md font-mono text-lg">
        {formatTime(seconds)}
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={isRunning ? onPause : onResume}
        className="h-8 w-8"
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default GameTimer;
