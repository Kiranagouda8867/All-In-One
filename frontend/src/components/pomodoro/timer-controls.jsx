import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/button';
import Input from '../ui/input';

const TimerControls = ({ 
  mode, 
  setMode, 
  customMinutes, 
  setCustomMinutes, 
  setTimer 
}) => {
  const modes = [
    { id: 'pomodoro', label: 'Pomodoro', minutes: 25 },
    { id: 'shortBreak', label: 'Short Break', minutes: 5 },
    { id: 'longBreak', label: 'Long Break', minutes: 15 },
    { id: 'custom', label: 'Custom', minutes: customMinutes }
  ];

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode !== 'custom') {
      const selectedMode = modes.find(m => m.id === newMode);
      setTimer(selectedMode.minutes * 60);
    }
  };

  const handleCustomMinutesChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCustomMinutes(value);
    if (mode === 'custom' && value > 0) {
      setTimer(value * 60);
    }
  };

  return (
    <div className="mt-8 w-full max-w-md">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {modes.map((item) => (
          <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={mode === item.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModeChange(item.id)}
              className="px-4"
            >
              {item.label}
            </Button>
          </motion.div>
        ))}
      </div>
      
      {mode === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center justify-center space-x-2"
        >
          <Input
            type="number"
            min="1"
            max="120"
            value={customMinutes}
            onChange={handleCustomMinutesChange}
            className="w-20 text-center"
          />
          <span className="text-gray-600">minutes</span>
        </motion.div>
      )}
    </div>
  );
};

export default TimerControls;