// app/hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react';

export default function useTimer(initialSeconds: number, onTimeUp: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef<number | null>(null); // use number for RN

  const start = () => {
    if (intervalRef.current !== null) return; // prevent multiple intervals

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number; // TypeScript fix
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = (seconds?: number) => {
    stop();
    setTimeLeft(seconds ?? initialSeconds);
  };

  useEffect(() => {
    return () => stop(); // cleanup on unmount
  }, []);

  return { timeLeft, start, stop, reset };
}
