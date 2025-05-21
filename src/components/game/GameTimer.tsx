
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

interface GameTimerProps {
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onTimeUpdate?: (seconds: number) => void;
  time?: number;
  setTime?: React.Dispatch<React.SetStateAction<number>>;
}

const GameTimer = ({ isRunning, onPause, onResume, onTimeUpdate, time: externalTime, setTime: setExternalTime }: GameTimerProps) => {
  const [seconds, setSeconds] = useState(0);
  
  // Use external time state if provided, otherwise use internal state
  const time = externalTime !== undefined ? externalTime : seconds;
  const setTime = setExternalTime || setSeconds;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          // Call the optional callback with the updated time
          if (onTimeUpdate) onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate, setTime]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-lg">
        {formatTime(time)}
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
