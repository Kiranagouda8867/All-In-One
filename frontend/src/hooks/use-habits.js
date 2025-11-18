import { useState, useEffect } from 'react';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  
  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('studysphere-habits');
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        console.error('Failed to parse habits from localStorage', e);
      }
    } else {
      // Initialize with mock data
      setHabits([
        {
          id: 1,
          name: 'Morning Meditation',
          description: '10 minutes of mindfulness meditation',
          goalStreak: 30,
          frequency: 'daily',
          currentStreak: 7,
          bestStreak: 14,
          completedToday: true,
          createdAt: '2023-09-15T08:00:00Z',
          lastCompleted: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Read for 30 minutes',
          description: 'Read educational material',
          goalStreak: 21,
          frequency: 'daily',
          currentStreak: 3,
          bestStreak: 10,
          completedToday: false,
          createdAt: '2023-09-20T09:30:00Z',
          lastCompleted: '2023-10-13T09:30:00Z'
        },
        {
          id: 3,
          name: 'Exercise',
          description: 'Physical activity for at least 20 minutes',
          goalStreak: 14,
          frequency: 'daily',
          currentStreak: 5,
          bestStreak: 8,
          completedToday: false,
          createdAt: '2023-09-25T07:00:00Z',
          lastCompleted: '2023-10-14T07:00:00Z'
        }
      ]);
    }
  }, []);
  
  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studysphere-habits', JSON.stringify(habits));
  }, [habits]);
  
  const saveHabit = (habit) => {
    if (habit.id) {
      // Update existing habit
      setHabits(habits.map(h => h.id === habit.id ? habit : h));
    } else {
      // Add new habit
      setHabits([...habits, { ...habit, id: Date.now() }]);
    }
    setEditingHabit(null);
  };
  
  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };
  
  const toggleHabitComplete = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const completedToday = !habit.completedToday;
        let currentStreak = habit.currentStreak;
        let bestStreak = habit.bestStreak;
        let lastCompleted = habit.lastCompleted;
        
        if (completedToday) {
          // Marking as complete today
          const today = new Date().toDateString();
          const lastCompletedDate = habit.lastCompleted 
            ? new Date(habit.lastCompleted).toDateString() 
            : null;
          
          if (lastCompletedDate !== today) {
            // Check if it's consecutive
            if (lastCompletedDate) {
              const lastDate = new Date(habit.lastCompleted);
              const todayDate = new Date();
              const diffTime = Math.abs(todayDate - lastDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) {
                currentStreak += 1;
              } else {
                currentStreak = 1;
              }
            } else {
              currentStreak = 1;
            }
            
            if (currentStreak > bestStreak) {
              bestStreak = currentStreak;
            }
            
            lastCompleted = new Date().toISOString();
          }
        } else {
          // Unmarking as complete today
          // If we're unmarking today, we need to reduce the streak
          const today = new Date().toDateString();
          const lastCompletedDate = habit.lastCompleted 
            ? new Date(habit.lastCompleted).toDateString() 
            : null;
          
          if (lastCompletedDate === today) {
            currentStreak = Math.max(0, currentStreak - 1);
            lastCompleted = null;
          }
        }
        
        return {
          ...habit,
          completedToday,
          currentStreak,
          bestStreak,
          lastCompleted
        };
      }
      return habit;
    }));
  };
  
  const startEditing = (habit) => {
    setEditingHabit(habit);
  };
  
  const cancelEditing = () => {
    setEditingHabit(null);
  };
  
  return {
    habits,
    editingHabit,
    saveHabit,
    deleteHabit,
    toggleHabitComplete,
    startEditing,
    cancelEditing
  };
};