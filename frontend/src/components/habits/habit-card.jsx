import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/card';
import Button from '../ui/button';
import { Check, TrendingUp, Calendar } from 'lucide-react';

const HabitCard = ({ 
  habit, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStreakColor = (streak) => {
    if (streak >= 21) return 'text-emerald-600';
    if (streak >= 14) return 'text-green-600';
    if (streak >= 7) return 'text-lime-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProgressPercentage = (streak, goal) => {
    return Math.min(100, (streak / goal) * 100);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full">
        <Card.Header className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800">{habit.name}</h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(habit)}
                className="p-1 h-8 w-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(habit.id)}
                className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">{habit.description}</p>
        </Card.Header>
        
        <Card.Content>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${habit.completedToday ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <Check 
                  className={habit.completedToday ? 'text-emerald-600' : 'text-gray-400'} 
                  size={20} 
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Today</p>
                <p className="text-xs text-gray-500">
                  {habit.completedToday ? 'Completed' : 'Not completed'}
                </p>
              </div>
            </div>
            
            <Button
              variant={habit.completedToday ? 'outline' : 'default'}
              size="sm"
              onClick={() => onToggleComplete(habit.id)}
              className={habit.completedToday ? 'border-emerald-300 text-emerald-700' : ''}
            >
              {habit.completedToday ? 'Undo' : 'Mark Complete'}
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <TrendingUp className="mr-1 text-emerald-500" size={14} />
                  Current Streak
                </span>
                <span className={`text-sm font-bold ${getStreakColor(habit.currentStreak)}`}>
                  {habit.currentStreak} days
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage(habit.currentStreak, habit.goalStreak)}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Goal: {habit.goalStreak} days
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="mr-1 text-indigo-500" size={14} />
                  Best Streak
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {habit.bestStreak} days
                </span>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default HabitCard;