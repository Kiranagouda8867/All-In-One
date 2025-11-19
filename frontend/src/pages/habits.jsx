import React, { useState } from 'react';
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
    togglingIds,
    editingHabit,
    saveHabit,
    deleteHabit,
    toggleHabitComplete,
    startEditing,
    cancelEditing
  } = useHabits();
  const [toast, setToast] = useState({ msg: '', visible: false });

  const showToast = (msg, ms = 2500) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast({ msg: '', visible: false }), ms);
  };

  const handleToggle = async (id) => {
    try {
      await toggleHabitComplete(id);
      showToast('Habit updated');
    } catch (err) {
      console.error('Toggle failed', err);
      showToast('Update failed');
    }
  };
  const [quickName, setQuickName] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickFreq, setQuickFreq] = useState('daily');
  const [quickGoal, setQuickGoal] = useState(21);
  const [creating, setCreating] = useState(false);

  const handleQuickCreate = async () => {
    if (!quickName.trim()) return;
    setCreating(true);
    try {
      await saveHabit({
        name: quickName.trim(),
        description: quickDesc.trim(),
        frequency: quickFreq,
        goalStreak: quickGoal,
        currentStreak: 0,
        bestStreak: 0,
        completedToday: false
      });
      setQuickName('');
      setQuickDesc('');
      setQuickFreq('daily');
      setQuickGoal(21);
    } catch (err) {
      console.error('Quick create failed', err);
    } finally {
      setCreating(false);
    }
  };
  
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  const totalBestStreak = habits.reduce((sum, habit) => sum + habit.bestStreak, 0);
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-5 right-5 z-50">
          <div className="bg-gray-900 text-white px-4 py-2 rounded shadow">{toast.msg}</div>
        </div>
      )}
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
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <input
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleQuickCreate(); } }}
              placeholder="Quick add habit..."
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={quickFreq}
              onChange={(e) => setQuickFreq(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-xl"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
            </select>
            <Button onClick={handleQuickCreate} disabled={creating}>
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
          <Button 
            onClick={() => startEditing({})}
            className="md:ml-2"
          >
            <Plus size={16} className="mr-1" /> New Habit
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
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
          <Button onClick={() => startEditing({})}>
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
                key={habit._id}
                habit={habit}
                onToggleComplete={handleToggle}
                onEdit={startEditing}
                onDelete={deleteHabit}
                isToggling={togglingIds.includes(habit._id)}
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