import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/card';
import Button from '../ui/button';
import Input from '../ui/input';
import { X, Target } from 'lucide-react';

const HabitModal = ({ 
  habit = null, 
  onSave, 
  onCancel 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goalStreak, setGoalStreak] = useState(21);
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    // Treat only habits with a real `_id` as existing edits.
    if (habit && habit._id) {
      setName(habit.name || '');
      setDescription(habit.description || '');
      setGoalStreak(habit.goalStreak || 21);
      setFrequency(habit.frequency || 'daily');
    } else {
      setName('');
      setDescription('');
      setGoalStreak(21);
      setFrequency('daily');
    }
  }, [habit]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    const habitData = {
      _id: habit ? habit._id : undefined,
      name: name.trim(),
      description: description.trim(),
      goalStreak,
      frequency,
      currentStreak: habit ? habit.currentStreak : 0,
      bestStreak: habit ? habit.bestStreak : 0,
      completedToday: habit ? habit.completedToday : false,
      createdAt: habit ? habit.createdAt : new Date().toISOString(),
      lastCompleted: habit ? habit.lastCompleted : null
    };
    // debug: log payload to help trace update/create
    // eslint-disable-next-line no-console
    console.log('[HabitModal] saving habitData:', habitData);
    onSave(habitData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <Card.Header className="flex justify-between items-center pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="p-1 h-8 w-8"
          >
            <X size={20} />
          </Button>
        </Card.Header>
        
        <Card.Content className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Habit Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder="e.g., Morning Meditation"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your habit..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                onKeyDown={(e) => {
                  // allow newline with Enter, but submit on Ctrl/Cmd+Enter
                  if ((e.key === 'Enter' && (e.ctrlKey || e.metaKey))) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Target className="mr-1 text-indigo-500" size={16} />
                Goal Streak (days)
              </label>
              <Input
                type="number"
                min="1"
                max="365"
                value={goalStreak}
                onChange={(e) => setGoalStreak(parseInt(e.target.value) || 1)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                How many consecutive days would you like to achieve?
              </p>
            </div>
          </div>
        </Card.Content>
        
        <Card.Footer className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {habit ? 'Update Habit' : 'Create Habit'}
          </Button>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

export default HabitModal;