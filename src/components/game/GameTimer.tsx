
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Pause, Play } from "lucide-react";

interface GameTimerProps {
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
}

const GameTimer = ({ isRunning, onPause, onResume }: GameTimerProps) => {
  const [seconds, setSeconds] = useState<number>(0);
  
  useEffect(() => {
    let timer: number | undefined;
    
    if (isRunning) {
      timer = window.setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);
  
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-full border border-gray-200">
      <Timer size={18} className="text-purple-600" />
      <span className="font-mono text-lg">{formatTime(seconds)}</span>
      
      <Button 
        variant="ghost" 
        size="icon"
        className="ml-1 rounded-full"
        onClick={isRunning ? onPause : onResume}
      >
        {isRunning ? (
          <Pause size={18} className="text-purple-600" />
        ) : (
          <Play size={18} className="text-purple-600" />
        )}
      </Button>
    </div>
  );
};

export default GameTimer;
