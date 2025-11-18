import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../hooks/use-habits';
import HabitCard from '../components/habits/habit-card';
import HabitModal from '../components/habits/habit-modal';
import Button from '../components/ui/button';
import Card from '../components/ui/card';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react';

const Habits = () => {
  const {
    habits,
    editingHabit,
    saveHabit,
    deleteHabit,
    toggleHabitComplete,
    startEditing,
    cancelEditing
  } = useHabits();
  
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  // Calculate total current streaks
  const totalCurrentStreak = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  const totalBestStreak = habits.reduce((sum, habit) => sum + habit.bestStreak, 0);
  
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Habit Tracker</h1>
          <p className="text-gray-600 mt-2">Build good habits and track your progress</p>
        </div>
        <Button 
          onClick={() => startEditing(null)}
          className="mt-4 md:mt-0"
        >
          <Plus size={16} className="mr-1" /> New Habit
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card>
          <Card.Content className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <Target className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Today's Progress</p>
              <p className="text-2xl font-bold text-gray-800">{completedToday}/{totalHabits}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Current Streaks</p>
              <p className="text-2xl font-bold text-gray-800">{totalCurrentStreak} days</p>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Best Streaks</p>
              <p className="text-2xl font-bold text-gray-800">{totalBestStreak} days</p>
            </div>
          </Card.Content>
        </Card>
      </motion.div>
      
      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Target size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No habits yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first habit to start tracking your progress.
          </p>
          <Button onClick={() => startEditing(null)}>
            <Plus size={16} className="mr-1" /> Create Habit
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleComplete={toggleHabitComplete}
                onEdit={startEditing}
                onDelete={deleteHabit}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      <AnimatePresence>
        {editingHabit !== null && (
          <HabitModal
            habit={editingHabit}
            onSave={saveHabit}
            onCancel={cancelEditing}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Habits;