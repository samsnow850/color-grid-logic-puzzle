
import { useState, useEffect } from 'react';

export interface GameTimerState {
  seconds: number;
  minutes: number;
  hours: number;
  isRunning: boolean;
  totalSeconds: number;
  formatted: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useGameTimer(autoStart: boolean = true): GameTimerState {
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);

  // Calculate hours, minutes and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // Format time as HH:MM:SS
  const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setTotalSeconds(0);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  return {
    seconds,
    minutes,
    hours,
    isRunning,
    totalSeconds,
    formatted,
    start,
    pause,
    reset
  };
}
