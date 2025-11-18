import React from 'react';
import { motion } from 'framer-motion';
import { usePomodoro } from '../hooks/use-pomodoro';
import Timer from '../components/pomodoro/timer';
import TimerControls from '../components/pomodoro/timer-controls';
import Card from '../components/ui/card';

const Pomodoro = () => {
  const {
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
  } = usePomodoro();

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">Pomodoro Timer</h1>
        <p className="text-gray-600 mt-2">Focus on your tasks and take regular breaks</p>
      </motion.div>

      <Card className="p-8 mb-8">
        <Timer
          minutes={minutes}
          seconds={seconds}
          isActive={isActive}
          progress={progress}
          onStartPause={startPause}
          onReset={reset}
        />
      </Card>

      <TimerControls
        mode={mode}
        setMode={setMode}
        customMinutes={customMinutes}
        setCustomMinutes={setCustomMinutes}
        setTimer={setTimer}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <Card.Content className="text-center">
            <h3 className="font-bold text-gray-800 mb-2">Pomodoro Technique</h3>
            <p className="text-sm text-gray-600">
              Work for 25 minutes, then take a 5-minute break. After four pomodoros, take a longer 15-minute break.
            </p>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="text-center">
            <h3 className="font-bold text-gray-800 mb-2">Benefits</h3>
            <p className="text-sm text-gray-600">
              Improves focus, prevents burnout, and helps maintain high productivity throughout the day.
            </p>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="text-center">
            <h3 className="font-bold text-gray-800 mb-2">Tips</h3>
            <p className="text-sm text-gray-600">
              Eliminate distractions during work periods. Use breaks to stretch, hydrate, and rest your eyes.
            </p>
          </Card.Content>
        </Card>
      </motion.div>
    </div>
  );
};

export default Pomodoro;