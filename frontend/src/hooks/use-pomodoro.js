import { useState, useEffect, useRef } from 'react';

export const usePomodoro = () => {
  const [mode, setMode] = useState('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const audioRef = useRef(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(
      'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3'
    );
  }, []);
  
  // Calculate total time based on mode
  const getTotalTime = () => {
    switch (mode) {
      case 'pomodoro': return 25 * 60;
      case 'shortBreak': return 5 * 60;
      case 'longBreak': return 15 * 60;
      case 'custom': return customMinutes * 60;
      default: return 25 * 60;
    }
  };
  
  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          const totalTime = getTotalTime();
          setProgress((newTime / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, customMinutes]);
  
  const startPause = () => {
    setIsActive(!isActive);
  };
  
  const reset = () => {
    setIsActive(false);
    setTimeLeft(getTotalTime());
    setProgress(100);
  };
  
  const setTimer = (seconds) => {
    setTimeLeft(seconds);
    setProgress(100);
  };
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return {
    minutes,
    seconds,
    isActive,
    progress,
    mode,
    customMinutes,
    setMode,
    setCustomMinutes,
    setTimer,
    startPause,
    reset
  };
};